-- Fix: members page viste 0 fordi profiles RLS kun tillod auth.uid() at læse egen profil,
-- og MembersPage-queryen brugte INNER JOIN til profiles. Co-members skal kunne se hinandens
-- navne for at member-listen virker.
drop policy if exists "Users read own profile" on public.profiles;
drop policy if exists "Co-members read profile" on public.profiles;
create policy "Co-members read profile" on public.profiles for select
  using (
    auth.uid() = id
    or exists (
      select 1
      from public.company_members cm1
      join public.company_members cm2 on cm2.company_id = cm1.company_id
      where cm1.user_id = auth.uid() and cm2.user_id = profiles.id
    )
  );

-- Fix: trigger on_auth_user_claim_invites fanger kun nye signups. Hvis en bruger
-- allerede har konto når de inviteres, claimes invitation aldrig. Denne RPC kan
-- kaldes af klienten for den nuværende bruger.
create or replace function public.claim_my_pending_invites()
returns int language plpgsql security definer set search_path = public as $$
declare
  inv record;
  my_email text;
  claimed int := 0;
begin
  select email into my_email from auth.users where id = auth.uid();
  if my_email is null then
    return 0;
  end if;

  for inv in
    select * from public.pending_invites where lower(email) = lower(my_email)
  loop
    insert into public.company_members (company_id, user_id, role)
    values (inv.company_id, auth.uid(), inv.role)
    on conflict (company_id, user_id) do nothing;
    delete from public.pending_invites where id = inv.id;
    claimed := claimed + 1;
  end loop;
  return claimed;
end;
$$;

grant execute on function public.claim_my_pending_invites() to authenticated;

-- Owner-funktion: ryd op i pending_invites hvor mailen allerede er registreret
-- som company_member i samme firma. Forekommer når en owner inviterer en bruger
-- der allerede er tilføjet (fx via tidligere claim).
create or replace function public.prune_stale_invites_for(p_company_id uuid)
returns int language plpgsql security definer set search_path = public as $$
declare
  removed int := 0;
begin
  if not exists (
    select 1 from public.company_members
    where company_id = p_company_id and user_id = auth.uid() and role = 'owner'
  ) then
    raise exception 'Forbidden';
  end if;

  with deleted as (
    delete from public.pending_invites pi
    using auth.users u, public.company_members cm
    where pi.company_id = p_company_id
      and lower(u.email) = lower(pi.email)
      and cm.user_id = u.id
      and cm.company_id = pi.company_id
    returning pi.id
  )
  select count(*) into removed from deleted;
  return removed;
end;
$$;

grant execute on function public.prune_stale_invites_for(uuid) to authenticated;
