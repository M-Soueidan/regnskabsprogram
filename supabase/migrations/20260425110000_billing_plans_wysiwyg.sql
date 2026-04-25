-- WYSIWYG-bullets pr. plan + skjul-fra-pricing toggle.
-- billing_plan_features beholdes som entitlement-kilde (bruges af get_company_feature_entitlements),
-- mens billing_plan_bullets driver visningen på pricing-siden.

alter table public.billing_plans
  add column if not exists marketing_hidden boolean not null default false;

comment on column public.billing_plans.marketing_hidden is
  'Hvis true skjules planen på offentlig pricing-side. Aktiv styres separat.';

create table if not exists public.billing_plan_bullets (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.billing_plans (id) on delete cascade,
  kind text not null check (kind in ('feature', 'text', 'heading')),
  feature_id uuid references public.billing_features (id) on delete set null,
  title text not null,
  subtitle text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (length(trim(title)) > 0),
  check ((kind = 'feature') = (feature_id is not null) or kind <> 'feature')
);

create index if not exists billing_plan_bullets_plan_idx
  on public.billing_plan_bullets (plan_id, sort_order);

alter table public.billing_plan_bullets enable row level security;

grant select on public.billing_plan_bullets to anon, authenticated;
grant insert, update, delete on public.billing_plan_bullets to authenticated;

drop policy if exists "Public read plan bullets" on public.billing_plan_bullets;
create policy "Public read plan bullets" on public.billing_plan_bullets for select
  using (
    public.is_platform_staff()
    or plan_id in (select id from public.billing_plans where active and not marketing_hidden)
  );

drop policy if exists "Platform staff write plan bullets" on public.billing_plan_bullets;
create policy "Platform staff write plan bullets" on public.billing_plan_bullets for all
  using (public.is_platform_superadmin())
  with check (public.is_platform_superadmin());

-- Seed bullets fra eksisterende plan_features hvis tabellen er tom for en plan,
-- så pricing-siden ikke pludselig er tom efter migration.
insert into public.billing_plan_bullets (plan_id, kind, feature_id, title, subtitle, sort_order)
select
  pf.plan_id,
  'feature',
  pf.feature_id,
  f.name,
  f.description,
  coalesce(f.sort_order, 0)
from public.billing_plan_features pf
join public.billing_features f on f.id = pf.feature_id
where pf.enabled
  and not exists (
    select 1 from public.billing_plan_bullets b where b.plan_id = pf.plan_id
  );

notify pgrst, 'reload schema';
