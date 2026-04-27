-- Indtægter for foreninger (og evt. virksomheder): tilskud, bevillinger, kontingent, donationer.
-- Lever ved siden af fakturaer; bilag-tabellen dækker udgifter, denne dækker indtægter
-- der ikke kommer fra kunde-fakturering.

create table if not exists public.income_entries (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  entry_date date not null default current_date,
  amount_cents bigint not null check (amount_cents > 0),
  kind text not null check (kind in (
    'kommunalt_tilskud',
    'fondsbevilling',
    'medlemskontingent',
    'donation',
    'event',
    'andet'
  )),
  source_name text not null check (length(trim(source_name)) > 0),
  earmarking text,
  voucher_project_id uuid references public.voucher_projects (id) on delete set null,
  notes text,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists income_entries_company_date_idx
  on public.income_entries (company_id, entry_date desc);

create index if not exists income_entries_company_kind_idx
  on public.income_entries (company_id, kind);

create index if not exists income_entries_project_idx
  on public.income_entries (company_id, voucher_project_id);

alter table public.income_entries enable row level security;

drop policy if exists "Members read income entries" on public.income_entries;
create policy "Members read income entries" on public.income_entries for select
  using (company_id in (select public.user_company_ids()));

drop policy if exists "Writers insert income entries" on public.income_entries;
create policy "Writers insert income entries" on public.income_entries for insert
  with check (public.has_company_role(company_id, array['owner', 'manager', 'bookkeeper']));

drop policy if exists "Writers update income entries" on public.income_entries;
create policy "Writers update income entries" on public.income_entries for update
  using (public.has_company_role(company_id, array['owner', 'manager', 'bookkeeper']))
  with check (public.has_company_role(company_id, array['owner', 'manager', 'bookkeeper']));

drop policy if exists "Writers delete income entries" on public.income_entries;
create policy "Writers delete income entries" on public.income_entries for delete
  using (public.has_company_role(company_id, array['owner', 'manager', 'bookkeeper']));

comment on table public.income_entries is
  'Indtægter der ikke kommer fra kunde-fakturering: kommunale tilskud, fondsbevillinger, medlemskontingent, donationer m.v. Primært til foreninger.';
comment on column public.income_entries.kind is
  'Type af indtægt. kommunalt_tilskud, fondsbevilling, medlemskontingent, donation, event eller andet.';
comment on column public.income_entries.source_name is
  'Hvem indtægten kommer fra (fx "Aarhus Kommune", "Tuborgfondet").';
comment on column public.income_entries.earmarking is
  'Valgfri øremærkning til projekt/aktivitet (fx "Sommerlejr 2026"). Kan også sættes via voucher_project_id.';

notify pgrst, 'reload schema';
