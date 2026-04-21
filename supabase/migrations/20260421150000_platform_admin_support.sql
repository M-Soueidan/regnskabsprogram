-- Bilago: platform staff (superadmin, support admin), public landing settings,
-- support tickets (one per company), impersonation for support.

-- Platform roles
create table public.platform_staff (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('superadmin', 'support_admin')),
  created_at timestamptz not null default now()
);

create index platform_staff_role_idx on public.platform_staff (role);

-- Impersonation session (extends effective companies via user_company_ids)
create table public.support_impersonation (
  user_id uuid primary key references auth.users (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  previous_company_id uuid references public.companies (id) on delete set null,
  expires_at timestamptz not null
);

-- Public contact / landing (single row)
create table public.platform_public_settings (
  id int primary key default 1 check (id = 1),
  contact_email text,
  contact_phone text,
  address_line text,
  postal_code text,
  city text,
  org_cvr text,
  support_hours text,
  terms_url text,
  privacy_url text,
  monthly_price_cents int,
  updated_at timestamptz not null default now()
);

insert into public.platform_public_settings (id) values (1)
on conflict (id) do nothing;

-- SMTP profiles (transactional / platform / marketing) — passwords not stored here; use Edge secrets in prod
create table public.platform_smtp_profiles (
  id text primary key check (id in ('transactional', 'platform', 'marketing')),
  label text not null,
  host text,
  port int,
  user_name text,
  from_email text,
  from_name text,
  updated_at timestamptz not null default now()
);

insert into public.platform_smtp_profiles (id, label) values
  ('transactional', 'Faktura og kundemails'),
  ('platform', 'Support og system'),
  ('marketing', 'Nyhedsbrev og opdateringer')
on conflict (id) do nothing;

-- Support: one ticket row per company
create table public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null unique references public.companies (id) on delete cascade,
  status text not null default 'open' check (status in ('open', 'closed', 'waiting_customer')),
  consent_deep_access boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index support_tickets_status_idx on public.support_tickets (status);

create table public.support_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets (id) on delete cascade,
  user_id uuid references auth.users (id) on delete set null,
  body text not null,
  is_staff boolean not null default false,
  created_at timestamptz not null default now()
);

create index support_messages_ticket_idx on public.support_messages (ticket_id, created_at);

-- Extend effective company access for platform staff impersonation
create or replace function public.user_company_ids()
returns setof uuid
language sql
stable
security definer
set search_path = public
as $$
  select company_id from public.company_members where user_id = auth.uid()
  union
  select si.company_id
  from public.support_impersonation si
  inner join public.platform_staff ps on ps.user_id = si.user_id
  where si.user_id = auth.uid()
    and si.expires_at > now()
$$;

-- RPC: start / end impersonation (updates profile.current_company_id)
create or replace function public.begin_platform_impersonation(p_company_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  prev uuid;
begin
  if not exists (select 1 from public.platform_staff where user_id = auth.uid()) then
    raise exception 'forbidden';
  end if;
  if not exists (select 1 from public.companies where id = p_company_id) then
    raise exception 'company not found';
  end if;
  select current_company_id into prev from public.profiles where id = auth.uid();
  delete from public.support_impersonation where user_id = auth.uid();
  insert into public.support_impersonation (user_id, company_id, previous_company_id, expires_at)
  values (auth.uid(), p_company_id, prev, now() + interval '8 hours');
  update public.profiles set current_company_id = p_company_id where id = auth.uid();
end;
$$;

create or replace function public.end_platform_impersonation()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  prev uuid;
begin
  if not exists (select 1 from public.platform_staff where user_id = auth.uid()) then
    raise exception 'forbidden';
  end if;
  select previous_company_id into prev
  from public.support_impersonation
  where user_id = auth.uid();
  delete from public.support_impersonation where user_id = auth.uid();
  update public.profiles set current_company_id = prev where id = auth.uid();
end;
$$;

grant execute on function public.begin_platform_impersonation(uuid) to authenticated;
grant execute on function public.end_platform_impersonation() to authenticated;

create or replace function public.add_support_admin_by_email(p_email text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid;
begin
  if not exists (
    select 1 from public.platform_staff where user_id = auth.uid() and role = 'superadmin'
  ) then
    raise exception 'forbidden';
  end if;
  select id into uid from auth.users where email = lower(trim(p_email));
  if uid is null then
    raise exception 'Bruger findes ikke — de skal oprette en konto først';
  end if;
  if uid = auth.uid() then
    raise exception 'Ugyldig handling';
  end if;
  insert into public.platform_staff (user_id, role) values (uid, 'support_admin')
  on conflict (user_id) do update set role = 'support_admin';
end;
$$;

grant execute on function public.add_support_admin_by_email(text) to authenticated;

grant select on public.platform_public_settings to anon;
grant select on public.platform_public_settings to authenticated;

-- Optional: bootstrap superadmin by email (run once when user exists)
insert into public.platform_staff (user_id, role)
select id, 'superadmin' from auth.users where email = 'mo.jamals@gmail.com'
on conflict (user_id) do nothing;

-- RLS
alter table public.platform_staff enable row level security;
alter table public.support_impersonation enable row level security;
alter table public.platform_public_settings enable row level security;
alter table public.platform_smtp_profiles enable row level security;
alter table public.support_tickets enable row level security;
alter table public.support_messages enable row level security;

-- platform_staff: staff see all rows; only superadmin inserts/deletes others
create policy "Platform staff read staff" on public.platform_staff for select
  using (
    exists (select 1 from public.platform_staff ps where ps.user_id = auth.uid())
  );

create policy "Superadmin insert staff" on public.platform_staff for insert
  with check (
    exists (
      select 1 from public.platform_staff
      where user_id = auth.uid() and role = 'superadmin'
    )
  );

create policy "Superadmin delete staff" on public.platform_staff for delete
  using (
    exists (
      select 1 from public.platform_staff
      where user_id = auth.uid() and role = 'superadmin'
    )
    and user_id <> auth.uid()
  );

-- support_impersonation: own row only
create policy "Own impersonation" on public.support_impersonation for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- platform_public_settings: world can read row 1; staff can update
create policy "Anyone read public settings" on public.platform_public_settings for select
  using (true);

create policy "Platform staff update public settings" on public.platform_public_settings for update
  using (
    exists (select 1 from public.platform_staff where user_id = auth.uid())
  );

-- smtp profiles: staff only
create policy "Platform staff read smtp" on public.platform_smtp_profiles for select
  using (exists (select 1 from public.platform_staff where user_id = auth.uid()));

create policy "Platform staff update smtp" on public.platform_smtp_profiles for update
  using (exists (select 1 from public.platform_staff where user_id = auth.uid()));

create policy "Platform staff insert smtp" on public.platform_smtp_profiles for insert
  with check (exists (select 1 from public.platform_staff where user_id = auth.uid()));

-- Companies: platform staff can list all (dashboard)
create policy "Platform staff read all companies" on public.companies for select
  using (exists (select 1 from public.platform_staff where user_id = auth.uid()));

-- Subscriptions: platform staff read all
create policy "Platform staff read all subscriptions" on public.subscriptions for select
  using (exists (select 1 from public.platform_staff where user_id = auth.uid()));

-- Support tickets
create policy "Members read own company ticket" on public.support_tickets for select
  using (company_id in (select public.user_company_ids()));

create policy "Platform staff read all tickets" on public.support_tickets for select
  using (exists (select 1 from public.platform_staff where user_id = auth.uid()));

create policy "Members insert ticket for company" on public.support_tickets for insert
  with check (company_id in (select public.user_company_ids()));

create policy "Members update own ticket" on public.support_tickets for update
  using (company_id in (select public.user_company_ids()));

create policy "Platform staff update any ticket" on public.support_tickets for update
  using (exists (select 1 from public.platform_staff where user_id = auth.uid()));

-- Support messages
create policy "Read messages if ticket visible" on public.support_messages for select
  using (
    exists (
      select 1 from public.support_tickets t
      where t.id = support_messages.ticket_id
        and (
          t.company_id in (select public.user_company_ids())
          or exists (select 1 from public.platform_staff where user_id = auth.uid())
        )
    )
  );

create policy "Members insert message" on public.support_messages for insert
  with check (
    user_id = auth.uid()
    and is_staff = false
    and exists (
      select 1 from public.support_tickets t
      where t.id = ticket_id
        and t.company_id in (select public.user_company_ids())
    )
  );

create policy "Staff insert message" on public.support_messages for insert
  with check (
    user_id = auth.uid()
    and is_staff = true
    and exists (select 1 from public.platform_staff where user_id = auth.uid())
    and exists (
      select 1 from public.support_tickets t where t.id = ticket_id
    )
  );
