-- DB-trigger på companies INSERT som POSTer til edge-funktion platform-event-push
-- via pg_net. Secret hentes fra Vault (key: 'platform_event_secret') så det aldrig
-- ligger i klartext i version-control eller logs.
--
-- Forudsætninger (kør én gang efter denne migration):
--   1) supabase secrets set PLATFORM_EVENT_SECRET=<random-hex>  (til edge-funktionen)
--   2) select vault.create_secret('<samme-random-hex>', 'platform_event_secret');
--      (kan køres i Supabase Studio → SQL Editor)
--
-- Subscription-aktivering håndteres inline fra stripe-webhook (server-til-server),
-- ikke som DB-trigger — webhooken har allerede secret som env-var.

create extension if not exists pg_net with schema extensions;

create or replace function public.notify_platform_new_company()
returns trigger
language plpgsql
security definer
set search_path = public, net, vault
as $$
declare
  v_secret text;
  v_url text;
begin
  -- Hent shared secret fra Vault. Hvis ikke sat → silent no-op (ingen push).
  begin
    select decrypted_secret into v_secret
      from vault.decrypted_secrets
     where name = 'platform_event_secret'
     limit 1;
  exception when others then
    v_secret := null;
  end;

  if v_secret is null or v_secret = '' then
    return new;
  end if;

  -- Project URL hentes fra app-setting (kan overrides via ALTER DATABASE SET).
  v_url := coalesce(
    current_setting('app.supabase_functions_url', true),
    'https://vfswagwhjshjnmppptif.supabase.co/functions/v1'
  );

  perform net.http_post(
    url := v_url || '/platform-event-push',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-bilago-platform-event', v_secret
    ),
    body := jsonb_build_object(
      'kind', 'company',
      'company_id', new.id::text
    )
  );

  return new;
exception when others then
  -- Push-fejl må aldrig blokere virksomhedsoprettelse.
  return new;
end;
$$;

drop trigger if exists trg_notify_platform_new_company on public.companies;
create trigger trg_notify_platform_new_company
  after insert on public.companies
  for each row execute function public.notify_platform_new_company();
