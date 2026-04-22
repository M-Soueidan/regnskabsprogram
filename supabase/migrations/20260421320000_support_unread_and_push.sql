-- Ulæst support (staff-beskeder pr. bruger/virksomhed) + Web Push-abonnementer.

create table public.support_ticket_reads (
  user_id uuid not null references auth.users (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  last_read_at timestamptz not null default now(),
  primary key (user_id, company_id)
);

create index support_ticket_reads_company_idx on public.support_ticket_reads (company_id);

alter table public.support_ticket_reads enable row level security;

create policy "Own support read rows"
on public.support_ticket_reads for all
using (
  user_id = auth.uid()
  and company_id in (select public.user_company_ids())
)
with check (
  user_id = auth.uid()
  and company_id in (select public.user_company_ids())
);

create table public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  endpoint text not null,
  subscription jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, endpoint)
);

create index push_subscriptions_user_idx on public.push_subscriptions (user_id);

alter table public.push_subscriptions enable row level security;

create policy "Own push subscriptions"
on public.push_subscriptions for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- Antal staff-beskeder efter sidste «læst» (ingen række = altid ulæst historik indtil bruger åbner support).
create or replace function public.support_unread_staff_count(p_company_id uuid)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select case
    when exists (
      select 1 from public.company_members cm
      where cm.company_id = p_company_id and cm.user_id = auth.uid()
    ) then (
      select count(*)::int
      from public.support_messages m
      inner join public.support_tickets t on t.id = m.ticket_id
      where t.company_id = p_company_id
        and m.is_staff = true
        and m.created_at > coalesce(
          (
            select r.last_read_at
            from public.support_ticket_reads r
            where r.user_id = auth.uid()
              and r.company_id = p_company_id
          ),
          to_timestamp(0)
        )
    )
    else 0
  end;
$$;

grant execute on function public.support_unread_staff_count(uuid) to authenticated;

create or replace function public.support_mark_ticket_read(p_company_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.company_members cm
    where cm.company_id = p_company_id and cm.user_id = auth.uid()
  ) then
    raise exception 'not allowed';
  end if;

  insert into public.support_ticket_reads (user_id, company_id, last_read_at)
  values (auth.uid(), p_company_id, now())
  on conflict (user_id, company_id) do update
    set last_read_at = excluded.last_read_at;
end;
$$;

grant execute on function public.support_mark_ticket_read(uuid) to authenticated;

-- Realtime (ignorer hvis tabellen allerede er med i publication).
do $$
begin
  begin
    alter publication supabase_realtime add table public.support_messages;
  exception
    when duplicate_object then null;
  end;
end $$;
