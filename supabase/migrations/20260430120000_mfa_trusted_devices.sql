-- "Husk mig"-mekanisme for 2-trins login. Når en bruger har bekræftet TOTP og krydsede
-- "Husk denne enhed", gemmer vi en device_id (genereret i browseren, lever i localStorage)
-- sammen med en udløbsdato. Næste gang brugeren logger ind med samme browser slipper
-- de for TOTP-prompt indtil expires_at er passeret.
create table if not exists public.mfa_trusted_devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  device_id text not null,
  user_agent text,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  unique (user_id, device_id)
);

create index if not exists mfa_trusted_devices_lookup_idx
  on public.mfa_trusted_devices (user_id, device_id, expires_at);

alter table public.mfa_trusted_devices enable row level security;

drop policy if exists "Users read own trusted devices" on public.mfa_trusted_devices;
create policy "Users read own trusted devices" on public.mfa_trusted_devices for select
  using (auth.uid() = user_id);

drop policy if exists "Users insert own trusted devices" on public.mfa_trusted_devices;
create policy "Users insert own trusted devices" on public.mfa_trusted_devices for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users delete own trusted devices" on public.mfa_trusted_devices;
create policy "Users delete own trusted devices" on public.mfa_trusted_devices for delete
  using (auth.uid() = user_id);
