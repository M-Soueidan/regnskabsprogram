-- Bilagsprojekter/events: gør det muligt at gruppere bilag på tværs af kategorier.
create table if not exists public.voucher_projects (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  name text not null,
  description text,
  budget_cents bigint,
  active boolean not null default true,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (length(trim(name)) > 0),
  check (budget_cents is null or budget_cents >= 0)
);

create unique index if not exists voucher_projects_company_name_key
  on public.voucher_projects (company_id, lower(trim(name)));

create index if not exists voucher_projects_company_active_idx
  on public.voucher_projects (company_id, active, name);

alter table public.vouchers
  add column if not exists voucher_project_id uuid references public.voucher_projects (id) on delete set null;

create index if not exists vouchers_project_idx
  on public.vouchers (company_id, voucher_project_id, expense_date);

create or replace function public.has_company_role(p_company_id uuid, p_roles text[])
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.company_members
    where company_id = p_company_id
      and user_id = auth.uid()
      and role = any(p_roles)
  );
$$;

grant execute on function public.has_company_role(uuid, text[]) to authenticated;

alter table public.voucher_projects enable row level security;

drop policy if exists "Members read voucher projects" on public.voucher_projects;
create policy "Members read voucher projects" on public.voucher_projects for select
  using (company_id in (select public.user_company_ids()));

drop policy if exists "Writers insert voucher projects" on public.voucher_projects;
create policy "Writers insert voucher projects" on public.voucher_projects for insert
  with check (public.has_company_role(company_id, array['owner', 'manager', 'bookkeeper']));

drop policy if exists "Writers update voucher projects" on public.voucher_projects;
create policy "Writers update voucher projects" on public.voucher_projects for update
  using (public.has_company_role(company_id, array['owner', 'manager', 'bookkeeper']))
  with check (public.has_company_role(company_id, array['owner', 'manager', 'bookkeeper']));

drop policy if exists "Writers delete voucher projects" on public.voucher_projects;
create policy "Writers delete voucher projects" on public.voucher_projects for delete
  using (public.has_company_role(company_id, array['owner', 'manager', 'bookkeeper']));

comment on table public.voucher_projects is
  'Valgfri projekt/event-dimension til bilag, fx Sommerlejr 2026 eller Kundeprojekt X.';
comment on column public.vouchers.voucher_project_id is
  'Valgfri projekt/event-kobling for rapportering på bilag på tværs af regnskabskategori.';

notify pgrst, 'reload schema';
