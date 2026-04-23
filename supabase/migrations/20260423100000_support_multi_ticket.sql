-- Support: flere sager pr. virksomhed med stigende ticket_number.
-- En ny sag oprettes når kunden skriver efter en tidligere sag er lukket.

-- 1) Ryd eksisterende data (godkendt af produktejer ved migrering).
delete from public.support_messages;
delete from public.support_tickets;

-- 2) Fjern unique-constraint på company_id.
alter table public.support_tickets
  drop constraint support_tickets_company_id_key;

-- 3) Tilføj ticket_number (udfyldes af trigger).
alter table public.support_tickets
  add column ticket_number int;

create unique index support_tickets_company_number_idx
  on public.support_tickets (company_id, ticket_number);

-- 4) Per-virksomhed sekvens (samme mønster som invoice_number_seq).
create table public.support_ticket_number_seq (
  company_id uuid primary key references public.companies (id) on delete cascade,
  last_value int not null default 0
);

alter table public.support_ticket_number_seq enable row level security;

create policy "Members read ticket seq"
  on public.support_ticket_number_seq for select
  using (company_id in (select public.user_company_ids()));

-- 5) BEFORE INSERT trigger der tildeler næste nummer for virksomheden.
create or replace function public.assign_support_ticket_number()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_next int;
begin
  insert into public.support_ticket_number_seq (company_id, last_value)
  values (new.company_id, 1)
  on conflict (company_id) do update
    set last_value = public.support_ticket_number_seq.last_value + 1
  returning last_value into v_next;

  new.ticket_number := v_next;
  return new;
end;
$$;

create trigger support_tickets_assign_number
  before insert on public.support_tickets
  for each row
  execute function public.assign_support_ticket_number();

-- 6) Lås NOT NULL nu hvor trigger udfylder kolonnen.
alter table public.support_tickets
  alter column ticket_number set not null;
