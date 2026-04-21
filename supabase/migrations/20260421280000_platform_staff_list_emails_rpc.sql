-- Superadmin UI: liste platform-team med e-mail (auth.users er ikke direkte læsbar fra klienten).
create or replace function public.list_platform_staff_with_emails()
returns table (
  user_id uuid,
  role text,
  created_at timestamptz,
  email text
)
language sql
stable
security definer
set search_path = public, auth
as $$
  select ps.user_id, ps.role::text, ps.created_at, u.email::text
  from public.platform_staff ps
  inner join auth.users u on u.id = ps.user_id
  where exists (
    select 1
    from public.platform_staff me
    where me.user_id = auth.uid()
      and me.role = 'superadmin'
  )
  order by ps.created_at asc;
$$;

grant execute on function public.list_platform_staff_with_emails() to authenticated;

comment on function public.list_platform_staff_with_emails() is
  'Returnerer platform_staff-rækker med e-mail fra auth.users; kun kaldbar af superadmin.';
