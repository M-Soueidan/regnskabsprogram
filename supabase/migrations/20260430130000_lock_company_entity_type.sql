-- entity_type (virksomhed/forening) er en grundlæggende beslutning der bestemmer
-- hvilken UI brugeren ser, hvilke skattefaner der er tilgængelige osv. Kunne den
-- ændres frit, ville der opstå inkonsistens (fx en forening med fakturaer eller en
-- virksomhed med kommunale tilskud). Vi låser typen efter oprettelse via trigger,
-- så hverken klient eller fremtidig kode ved et uheld kan ændre den. Skal det
-- ændres, må det ske som platform-admin via direkte SQL.
create or replace function public.prevent_company_entity_type_change()
returns trigger language plpgsql as $$
begin
  if new.entity_type is distinct from old.entity_type then
    raise exception
      'company.entity_type kan ikke ændres efter oprettelse (gammel: %, ny: %)',
      old.entity_type, new.entity_type
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

drop trigger if exists companies_lock_entity_type on public.companies;
create trigger companies_lock_entity_type
  before update on public.companies
  for each row
  execute function public.prevent_company_entity_type_change();
