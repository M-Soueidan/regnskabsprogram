-- Fremadrettet fix til databaser hvor WYSIWYG-migrationen allerede blev kørt
-- før punkt-skjul blev ændret fra subtitle_hidden til marketing_hidden.

alter table public.billing_plans
  add column if not exists marketing_badge_text text,
  add column if not exists marketing_lock_label text;

alter table public.billing_plan_bullets
  add column if not exists marketing_hidden boolean not null default false;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'billing_plan_bullets'
      and column_name = 'subtitle_hidden'
  ) then
    update public.billing_plan_bullets
    set marketing_hidden = true
    where subtitle_hidden = true
      and marketing_hidden = false;
  end if;
end $$;

comment on column public.billing_plans.marketing_badge_text is
  'Valgfri tekst i øverste badge på pricing-kortet, fx "Introtilbud — lås prisen".';
comment on column public.billing_plans.marketing_lock_label is
  'Valgfri tekst i grønt låse-badge under prisen, fx "Fast pris så længe du er kunde".';
comment on column public.billing_plan_bullets.marketing_hidden is
  'Hvis true skjules hele punktet på offentlig pricing-side, men punktet bevares i admin.';

notify pgrst, 'reload schema';
