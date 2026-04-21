-- Engangsoprydning: fjern mo.jamals@gmail.com fra virksomhed(er) og slet virksomhederne.
-- Kør i Supabase Dashboard → SQL Editor (rolle: postgres). Bruger slettes IKKE; platform_staff bevares.
-- Tjek først med SELECT nedenfor (fjern kommentarer), kør derefter DELETE.

-- Forhåndsvisning (valgfri):
-- select c.id, c.name, c.cvr, c.created_at, m.role
-- from public.companies c
-- inner join public.company_members m on m.company_id = c.id
-- inner join auth.users u on u.id = m.user_id
-- where lower(u.email) = lower('mo.jamals@gmail.com');

begin;

delete from public.companies c
where c.id in (
  select m.company_id
  from public.company_members m
  inner join auth.users u on u.id = m.user_id
  where lower(u.email) = lower('mo.jamals@gmail.com')
);

-- Bekræft: GET DIAGNOSTICS / row count — i SQL Editor ser du "X rows affected"
commit;
