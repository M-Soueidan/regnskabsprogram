-- Udlægslinks: engangslink eller tidsvindue hvor eksterne personer kan uploade bilag.

create table if not exists public.expense_upload_links (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  token_hash text not null unique,
  mode text not null check (mode in ('single_use', 'time_window')),
  expires_at timestamptz not null,
  max_uploads int,
  used_count int not null default 0,
  revoked_at timestamptz,
  note text,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (length(token_hash) >= 40),
  check (max_uploads is null or max_uploads > 0),
  check (
    (mode = 'single_use' and coalesce(max_uploads, 1) = 1)
    or (mode = 'time_window' and max_uploads is null)
  )
);

create index if not exists expense_upload_links_company_created_idx
  on public.expense_upload_links (company_id, created_at desc);

create index if not exists expense_upload_links_token_active_idx
  on public.expense_upload_links (token_hash, expires_at)
  where revoked_at is null;

create table if not exists public.voucher_reimbursements (
  id uuid primary key default gen_random_uuid(),
  voucher_id uuid not null unique references public.vouchers (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  upload_link_id uuid references public.expense_upload_links (id) on delete set null,
  requester_name text not null,
  phone text,
  bank_reg_number text,
  bank_account_number text,
  status text not null default 'pending_approval' check (
    status in ('pending_approval', 'ready_for_refund', 'refunded', 'rejected')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (length(trim(requester_name)) > 0)
);

create index if not exists voucher_reimbursements_company_status_idx
  on public.voucher_reimbursements (company_id, status, created_at desc);

alter table public.expense_upload_links enable row level security;
alter table public.voucher_reimbursements enable row level security;

drop policy if exists "Members read expense upload links" on public.expense_upload_links;
create policy "Members read expense upload links" on public.expense_upload_links for select
  using (company_id in (select public.user_company_ids()));

drop policy if exists "Writers insert expense upload links" on public.expense_upload_links;
create policy "Writers insert expense upload links" on public.expense_upload_links for insert
  with check (public.has_company_role(company_id, array['owner', 'manager', 'bookkeeper']));

drop policy if exists "Writers update expense upload links" on public.expense_upload_links;
create policy "Writers update expense upload links" on public.expense_upload_links for update
  using (public.has_company_role(company_id, array['owner', 'manager', 'bookkeeper']))
  with check (public.has_company_role(company_id, array['owner', 'manager', 'bookkeeper']));

drop policy if exists "Writers delete expense upload links" on public.expense_upload_links;
create policy "Writers delete expense upload links" on public.expense_upload_links for delete
  using (public.has_company_role(company_id, array['owner', 'manager', 'bookkeeper']));

drop policy if exists "Members read voucher reimbursements" on public.voucher_reimbursements;
create policy "Members read voucher reimbursements" on public.voucher_reimbursements for select
  using (company_id in (select public.user_company_ids()));

drop policy if exists "Writers insert voucher reimbursements" on public.voucher_reimbursements;
create policy "Writers insert voucher reimbursements" on public.voucher_reimbursements for insert
  with check (public.has_company_role(company_id, array['owner', 'manager', 'bookkeeper']));

drop policy if exists "Writers update voucher reimbursements" on public.voucher_reimbursements;
create policy "Writers update voucher reimbursements" on public.voucher_reimbursements for update
  using (public.has_company_role(company_id, array['owner', 'manager', 'bookkeeper']))
  with check (public.has_company_role(company_id, array['owner', 'manager', 'bookkeeper']));

drop policy if exists "Writers delete voucher reimbursements" on public.voucher_reimbursements;
create policy "Writers delete voucher reimbursements" on public.voucher_reimbursements for delete
  using (public.has_company_role(company_id, array['owner', 'manager', 'bookkeeper']));

comment on table public.expense_upload_links is
  'Sikre udlægslinks til ekstern bilagsupload. Token gemmes kun som hash.';
comment on table public.voucher_reimbursements is
  'Udlægsoplysninger knyttet til et bilag, så virksomheden kan refundere personen.';

notify pgrst, 'reload schema';
