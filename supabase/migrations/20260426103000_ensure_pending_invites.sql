-- Sikrer at medlemsinvitationer findes i databasen.
-- Nogle miljøer har migrationshistorik uden at public.pending_invites faktisk findes.

create table if not exists public.pending_invites (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  email text not null,
  role text not null check (role in ('owner', 'manager', 'bookkeeper', 'accountant')),
  invited_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  check (length(trim(email)) > 0)
);

create unique index if not exists pending_invites_company_email_key
  on public.pending_invites (company_id, lower(trim(email)));

create index if not exists pending_invites_email_idx
  on public.pending_invites (lower(trim(email)));

alter table public.pending_invites enable row level security;

grant select, insert, delete on public.pending_invites to authenticated;

drop policy if exists "Owners read invites" on public.pending_invites;
create policy "Owners read invites" on public.pending_invites for select
  using (public.has_company_role(company_id, array['owner']));

drop policy if exists "Owners create invites" on public.pending_invites;
create policy "Owners create invites" on public.pending_invites for insert
  with check (public.has_company_role(company_id, array['owner']));

drop policy if exists "Owners delete invites" on public.pending_invites;
create policy "Owners delete invites" on public.pending_invites for delete
  using (public.has_company_role(company_id, array['owner']));

create or replace function public.claim_pending_invites()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  inv record;
begin
  for inv in
    select *
    from public.pending_invites
    where lower(trim(email)) = lower(trim(new.email))
  loop
    insert into public.company_members (company_id, user_id, role)
    values (inv.company_id, new.id, inv.role)
    on conflict (company_id, user_id) do nothing;

    delete from public.pending_invites where id = inv.id;
  end loop;

  return new;
end;
$$;

drop trigger if exists on_auth_user_claim_invites on auth.users;
create trigger on_auth_user_claim_invites
  after insert on auth.users
  for each row execute function public.claim_pending_invites();

comment on table public.pending_invites is
  'Ventende medlemsinvitationer. Brugere bliver automatisk tilføjet til virksomheden, når de opretter konto med samme e-mail.';

notify pgrst, 'reload schema';
