-- Server-side push når Bilago/staff svarer i en supporttråd.
-- Reuser samme shared secret som platform-event-push, så vi ikke afhænger af frontend-kald.

create extension if not exists pg_net with schema extensions;

create or replace function public.notify_support_staff_reply_push()
returns trigger
language plpgsql
security definer
set search_path = public, net, vault
as $$
declare
  v_secret text;
  v_url text;
begin
  if new.is_staff is distinct from true then
    return new;
  end if;

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

  v_url := coalesce(
    current_setting('app.supabase_functions_url', true),
    'https://vfswagwhjshjnmppptif.supabase.co/functions/v1'
  );

  perform net.http_post(
    url := v_url || '/support-push-notify',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-bilago-platform-event', v_secret
    ),
    body := jsonb_build_object(
      'ticket_id', new.ticket_id::text
    )
  );

  return new;
exception when others then
  -- Push må aldrig blokere beskeden.
  return new;
end;
$$;

drop trigger if exists trg_notify_support_staff_reply_push on public.support_messages;
create trigger trg_notify_support_staff_reply_push
  after insert on public.support_messages
  for each row execute function public.notify_support_staff_reply_push();
