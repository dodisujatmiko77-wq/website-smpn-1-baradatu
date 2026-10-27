-- ============================================================
-- HAPUS ADMIN — UPT SMPN 1 Baradatu
-- Jalankan di Supabase > SQL Editor. Ganti email di baris `target_email`.
-- Pilih SALAH SATU: Versi A (cabut akses) atau Versi B (hapus akun).
-- ============================================================


-- ------------------------------------------------------------
-- VERSI A — CABUT AKSES (disarankan)
-- Akun tetap ada tetapi tidak bisa lagi masuk panel admin.
-- Bisa diberi peran lagi kapan saja dari menu Pengguna & Peran.
-- ------------------------------------------------------------
do $$
declare
  target_email text := 'email.admin@contoh.com';   -- << GANTI
  target_id uuid;
begin
  select id into target_id from auth.users where lower(email) = lower(target_email);
  if target_id is null then
    raise exception 'Akun dengan email % tidak ditemukan.', target_email;
  end if;

  -- Jangan sampai tidak ada superadmin sama sekali
  if exists (select 1 from public.user_roles where user_id = target_id and role = 'superadmin')
     and (select count(*) from public.user_roles where role = 'superadmin') <= 1 then
    raise exception 'Akun ini satu-satunya superadmin. Jadikan akun lain superadmin terlebih dahulu.';
  end if;

  delete from public.user_roles where user_id = target_id;
  insert into public.audit_logs (actor_id, action, detail)
    values (null, 'Mengatur peran pengguna', target_email || ': akses dicabut (lewat SQL)');
  raise notice 'Akses % sudah dicabut.', target_email;
end $$;


-- ------------------------------------------------------------
-- VERSI B — HAPUS AKUN SEPENUHNYA
-- Akun tidak bisa login lagi dan harus dibuat ulang bila dibutuhkan.
-- Konten & catatan audit yang pernah dibuat akun ini TETAP ADA;
-- hanya penandanya (siapa yang membuat) dikosongkan.
-- Hapus tanda "--" di awal setiap baris di bawah untuk menjalankannya.
-- ------------------------------------------------------------
-- do $$
-- declare
--   target_email text := 'email.admin@contoh.com';   -- << GANTI
--   target_id uuid;
--   r record;
-- begin
--   select id into target_id from auth.users where lower(email) = lower(target_email);
--   if target_id is null then
--     raise exception 'Akun dengan email % tidak ditemukan.', target_email;
--   end if;
--
--   if exists (select 1 from public.user_roles where user_id = target_id and role = 'superadmin')
--      and (select count(*) from public.user_roles where role = 'superadmin') <= 1 then
--     raise exception 'Akun ini satu-satunya superadmin. Jadikan akun lain superadmin terlebih dahulu.';
--   end if;
--
--   -- Kosongkan penanda pembuat/pengubah di semua tabel publik yang merujuk ke akun ini
--   for r in
--     select c.table_name, c.column_name
--     from information_schema.columns c
--     where c.table_schema = 'public'
--       and c.column_name in ('actor_id', 'created_by', 'updated_by')
--       and c.table_name in (select table_name from information_schema.tables where table_schema = 'public' and table_type = 'BASE TABLE')
--   loop
--     execute format('update public.%I set %I = null where %I = $1', r.table_name, r.column_name, r.column_name) using target_id;
--   end loop;
--
--   delete from auth.users where id = target_id;   -- peran di user_roles ikut terhapus otomatis
--   insert into public.audit_logs (actor_id, action, detail)
--     values (null, 'Menghapus akun', target_email || ' (lewat SQL)');
--   raise notice 'Akun % sudah dihapus.', target_email;
-- end $$;


-- ------------------------------------------------------------
-- CEK: daftar akun dan perannya saat ini
-- ------------------------------------------------------------
select u.email, coalesce(r.role, '(tanpa akses)') as peran, u.last_sign_in_at as login_terakhir
from auth.users u left join public.user_roles r on r.user_id = u.id
order by r.role nulls last, u.email;
