-- ========== MANAJEMEN PENGGUNA (menu "Pengguna & Peran", khusus superadmin) ==========
-- Aman dijalankan ulang. Prasyarat: schema.sql.
-- Akun login dibuat di Supabase > Authentication > Users; perannya diatur dari panel admin.

-- Daftar semua akun beserta perannya. Hanya superadmin yang boleh memanggil.
create or replace function public.admin_list_users()
returns table (user_id uuid, email text, role text, created_at timestamptz, last_sign_in_at timestamptz)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.has_site_role(array['superadmin']) then
    raise exception 'Hanya superadmin yang dapat melihat daftar pengguna.' using errcode = '42501';
  end if;
  return query
    select u.id, u.email::text, r.role, u.created_at, u.last_sign_in_at
    from auth.users u left join public.user_roles r on r.user_id = u.id
    order by (r.role is null), u.email;
end $$;

-- Memberi / mengganti / mencabut peran. new_role: 'superadmin' | 'admin' | 'editor' | null (cabut akses).
create or replace function public.admin_set_user_role(target_user uuid, new_role text)
returns void
language plpgsql volatile security definer set search_path = '' as $$
declare target_email text;
begin
  if not public.has_site_role(array['superadmin']) then
    raise exception 'Hanya superadmin yang dapat mengatur peran.' using errcode = '42501';
  end if;
  if target_user = auth.uid() then
    raise exception 'Anda tidak dapat mengubah peran akun sendiri.';
  end if;
  if new_role is not null and new_role not in ('superadmin', 'admin', 'editor') then
    raise exception 'Peran tidak dikenal: %', new_role;
  end if;
  select email into target_email from auth.users where id = target_user;
  if target_email is null then
    raise exception 'Akun tidak ditemukan.';
  end if;

  if new_role is null then
    delete from public.user_roles where user_id = target_user;
  else
    insert into public.user_roles (user_id, role) values (target_user, new_role)
    on conflict (user_id) do update set role = excluded.role;
  end if;

  insert into public.audit_logs (actor_id, action, detail)
  values (auth.uid(), 'Mengatur peran pengguna', target_email || ': ' || coalesce(new_role, 'akses dicabut'));
end $$;

revoke execute on function public.admin_list_users() from public, anon;
revoke execute on function public.admin_set_user_role(uuid, text) from public, anon;
grant execute on function public.admin_list_users() to authenticated;
grant execute on function public.admin_set_user_role(uuid, text) to authenticated;
