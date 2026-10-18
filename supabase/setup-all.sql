-- ============================================================
-- SETUP LENGKAP DATABASE — UPT SMPN 1 Baradatu
-- Jalankan SELURUH isi file ini di Supabase > SQL Editor > New query > Run.
-- Aman dijalankan ulang: tabel dan data yang sudah ada tidak dihapus.
-- Gabungan dari schema.sql + gtk.sql + pengaturan.sql + extra.sql + users.sql (jangan diedit langsung).
-- ============================================================

-- >>>>> schema.sql
-- UPT SMPN 1 Baradatu - CMS production schema
-- Run this file in Supabase SQL Editor.
-- After creating an Auth user, assign a role with:
-- insert into public.user_roles (user_id, role) values ('AUTH-USER-UUID', 'superadmin');

create extension if not exists pgcrypto;

create table if not exists public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('superadmin','admin','editor')),
  created_at timestamptz not null default now()
);

create or replace function public.has_site_role(required_roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = any(required_roles)
  );
$$;

create or replace function public.is_site_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select public.has_site_role(array['superadmin','admin','editor']); $$;

create or replace function public.is_site_manager()
returns boolean language sql stable security definer set search_path = public
as $$ select public.has_site_role(array['superadmin','admin']); $$;

create table if not exists public.school_settings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  npsn text, nss text, alamat text, kecamatan text, kabupaten text, provinsi text,
  email text, telp text, website text, akreditasi text, kepala_sekolah text,
  logo_url text, hero_image_url text, school_image_url text,
  updated_at timestamptz not null default now(), updated_by uuid references auth.users(id)
);

create table if not exists public.homepage_sections (
  section_key text primary key,
  visible boolean not null default true,
  sort_order int not null default 0,
  updated_at timestamptz not null default now(), updated_by uuid references auth.users(id)
);

create table if not exists public.news (
  id uuid primary key default gen_random_uuid(), title text not null, category text,
  publish_date date, summary text, content text, photo_url text,
  status text not null default 'draft' check (status in ('draft','published')),
  show_home boolean not null default false, created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(), created_by uuid references auth.users(id)
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(), title text not null, publish_date date,
  badge text, content text, status text not null default 'draft' check (status in ('draft','published')),
  show_home boolean not null default false, created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(), created_by uuid references auth.users(id)
);

create table if not exists public.agendas (
  id uuid primary key default gen_random_uuid(), name text not null, event_date date,
  time_text text, location text, description text, status text not null default 'draft' check (status in ('draft','published')),
  show_home boolean not null default false, created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(), created_by uuid references auth.users(id)
);

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(), name text not null, student_team text,
  level text, year int, photo_url text, description text,
  status text not null default 'draft' check (status in ('draft','published')),
  show_home boolean not null default false, created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(), created_by uuid references auth.users(id)
);

create table if not exists public.galleries (
  id uuid primary key default gen_random_uuid(), title text not null, category text,
  photo_url text, caption text,
  status text not null default 'draft' check (status in ('draft','published')),
  show_home boolean not null default false, created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(), created_by uuid references auth.users(id)
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(), name text not null, description text,
  icon text, color text, url text, button_text text, active boolean not null default true,
  sort_order int not null default 0, created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(), created_by uuid references auth.users(id)
);

create table if not exists public.audit_logs (
  id bigint generated by default as identity primary key,
  actor_id uuid references auth.users(id), action text not null, detail text,
  created_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists school_settings_touch on public.school_settings;
create trigger school_settings_touch before update on public.school_settings for each row execute function public.touch_updated_at();

drop trigger if exists homepage_sections_touch on public.homepage_sections;
create trigger homepage_sections_touch before update on public.homepage_sections for each row execute function public.touch_updated_at();

drop trigger if exists news_touch on public.news;
create trigger news_touch before update on public.news for each row execute function public.touch_updated_at();

drop trigger if exists announcements_touch on public.announcements;
create trigger announcements_touch before update on public.announcements for each row execute function public.touch_updated_at();

drop trigger if exists agendas_touch on public.agendas;
create trigger agendas_touch before update on public.agendas for each row execute function public.touch_updated_at();

drop trigger if exists achievements_touch on public.achievements;
create trigger achievements_touch before update on public.achievements for each row execute function public.touch_updated_at();

drop trigger if exists galleries_touch on public.galleries;
create trigger galleries_touch before update on public.galleries for each row execute function public.touch_updated_at();

drop trigger if exists services_touch on public.services;
create trigger services_touch before update on public.services for each row execute function public.touch_updated_at();

-- RLS
alter table public.user_roles enable row level security;
alter table public.school_settings enable row level security;
alter table public.homepage_sections enable row level security;
alter table public.news enable row level security;
alter table public.announcements enable row level security;
alter table public.agendas enable row level security;
alter table public.achievements enable row level security;
alter table public.galleries enable row level security;
alter table public.services enable row level security;
alter table public.audit_logs enable row level security;

-- Remove old policies so this script can be safely re-run.
do $$ declare r record; begin
  for r in select schemaname, tablename, policyname from pg_policies where schemaname='public' and tablename in ('user_roles','school_settings','homepage_sections','news','announcements','agendas','achievements','galleries','services','audit_logs') loop
    execute format('drop policy if exists %I on %I.%I', r.policyname, r.schemaname, r.tablename);
  end loop;
end $$;

-- Role table: users may read only their own role; managers can manage roles.
create policy "users read own role" on public.user_roles for select to authenticated using (user_id = auth.uid() or public.has_site_role(array['superadmin']));
create policy "superadmin insert roles" on public.user_roles for insert to authenticated with check (public.has_site_role(array['superadmin']));
create policy "superadmin update roles" on public.user_roles for update to authenticated using (public.has_site_role(array['superadmin'])) with check (public.has_site_role(array['superadmin']));
create policy "superadmin delete roles" on public.user_roles for delete to authenticated using (public.has_site_role(array['superadmin']));

-- Public read rules.
create policy "public read school settings" on public.school_settings for select to anon, authenticated using (true);
create policy "public read homepage sections" on public.homepage_sections for select to anon, authenticated using (true);
create policy "public read published news" on public.news for select to anon, authenticated using (status='published');
create policy "public read published announcements" on public.announcements for select to anon, authenticated using (status='published');
create policy "public read published agendas" on public.agendas for select to anon, authenticated using (status='published');
create policy "public read published achievements" on public.achievements for select to anon, authenticated using (status='published');
create policy "public read published galleries" on public.galleries for select to anon, authenticated using (status='published');
create policy "public read active services" on public.services for select to anon, authenticated using (active=true);

-- Admin/editor write rules. Editors can manage content, managers can manage school settings/homepage/services.
create policy "manager manage school settings" on public.school_settings for all to authenticated using (public.is_site_manager()) with check (public.is_site_manager());
create policy "manager manage homepage sections" on public.homepage_sections for all to authenticated using (public.is_site_manager()) with check (public.is_site_manager());

create policy "site admin manage news" on public.news for all to authenticated using (public.is_site_admin()) with check (public.is_site_admin());
create policy "site admin manage announcements" on public.announcements for all to authenticated using (public.is_site_admin()) with check (public.is_site_admin());
create policy "site admin manage agendas" on public.agendas for all to authenticated using (public.is_site_admin()) with check (public.is_site_admin());
create policy "site admin manage achievements" on public.achievements for all to authenticated using (public.is_site_admin()) with check (public.is_site_admin());
create policy "site admin manage galleries" on public.galleries for all to authenticated using (public.is_site_admin()) with check (public.is_site_admin());
create policy "manager manage services" on public.services for all to authenticated using (public.is_site_manager()) with check (public.is_site_manager());

create policy "site admins read audit logs" on public.audit_logs for select to authenticated using (public.is_site_admin());
create policy "site admins insert audit logs" on public.audit_logs for insert to authenticated with check (public.is_site_admin() and actor_id = auth.uid());

-- Media bucket. Files are public to visitors, but only site managers can upload/update/delete.
insert into storage.buckets (id, name, public) values ('site-media', 'site-media', true)
on conflict (id) do update set public = true;

drop policy if exists "public read site media" on storage.objects;
drop policy if exists "site manager upload media" on storage.objects;
drop policy if exists "site manager update media" on storage.objects;
drop policy if exists "site manager delete media" on storage.objects;
create policy "public read site media" on storage.objects for select to anon, authenticated using (bucket_id = 'site-media');
-- Editor juga boleh mengunggah foto (untuk berita, galeri, dll.). Hapus file tetap khusus admin.
create policy "site manager upload media" on storage.objects for insert to authenticated with check (bucket_id = 'site-media' and public.is_site_admin());
create policy "site manager update media" on storage.objects for update to authenticated using (bucket_id = 'site-media' and public.is_site_manager()) with check (bucket_id = 'site-media' and public.is_site_manager());
create policy "site manager delete media" on storage.objects for delete to authenticated using (bucket_id = 'site-media' and public.is_site_manager());

-- Initial website settings. Safe placeholders; replace from Admin Panel after deployment.
-- Hanya dibuat jika tabel masih kosong (tabel ini tidak punya kunci unik selain id acak).
insert into public.school_settings (name, npsn, kecamatan, kabupaten, provinsi)
select 'UPT SMPN 1 BARADATU', '[NPSN]', 'Baradatu', 'Way Kanan', 'Lampung'
where not exists (select 1 from public.school_settings);

insert into public.homepage_sections (section_key, visible, sort_order) values
('hero',true,1),('sambutan',true,2),('profil',true,3),('visiMisi',true,4),('berita',true,5),
('pengumuman',true,6),('agenda',true,7),('prestasi',true,8),('ekstrakurikuler',true,9),('galeri',true,10),
('digital',true,11),('ppdb',true,12),('kontak',true,13)
on conflict (section_key) do nothing;

-- IMPORTANT: create the first Auth user in Supabase Dashboard > Authentication > Users,
-- then assign superadmin role using the user's UUID.

-- ============================================================
-- CMS DATA SEKOLAH v1
-- Sejarah, Visi & Misi, Struktur Organisasi, Fasilitas
-- Aman dijalankan setelah schema utama.
-- ============================================================
create table if not exists public.school_history (
  id uuid primary key,
  title text not null default 'Sejarah Sekolah',
  content text not null default '',
  status text not null default 'draft' check (status in ('draft','published')),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create table if not exists public.school_vision_mission (
  id uuid primary key,
  vision text not null default '',
  mission text not null default '',
  status text not null default 'draft' check (status in ('draft','published')),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create table if not exists public.school_structure (
  id uuid primary key,
  title text not null default 'Struktur Organisasi',
  description text not null default '',
  chart_image_url text,
  status text not null default 'draft' check (status in ('draft','published')),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create table if not exists public.facilities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  photo_url text,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

alter table public.school_history enable row level security;
alter table public.school_vision_mission enable row level security;
alter table public.school_structure enable row level security;
alter table public.facilities enable row level security;

drop policy if exists "public read school history" on public.school_history;
drop policy if exists "manager manage school history" on public.school_history;
create policy "public read school history" on public.school_history for select to anon, authenticated using (status='published');
create policy "manager manage school history" on public.school_history for all to authenticated using (public.is_site_manager()) with check (public.is_site_manager());

drop policy if exists "public read school vision mission" on public.school_vision_mission;
drop policy if exists "manager manage school vision mission" on public.school_vision_mission;
create policy "public read school vision mission" on public.school_vision_mission for select to anon, authenticated using (status='published');
create policy "manager manage school vision mission" on public.school_vision_mission for all to authenticated using (public.is_site_manager()) with check (public.is_site_manager());

drop policy if exists "public read school structure" on public.school_structure;
drop policy if exists "manager manage school structure" on public.school_structure;
create policy "public read school structure" on public.school_structure for select to anon, authenticated using (status='published');
create policy "manager manage school structure" on public.school_structure for all to authenticated using (public.is_site_manager()) with check (public.is_site_manager());

drop policy if exists "public read active facilities" on public.facilities;
drop policy if exists "manager manage facilities" on public.facilities;
create policy "public read active facilities" on public.facilities for select to anon, authenticated using (active=true);
create policy "manager manage facilities" on public.facilities for all to authenticated using (public.is_site_manager()) with check (public.is_site_manager());

drop trigger if exists school_history_touch on public.school_history;
create trigger school_history_touch before update on public.school_history for each row execute function public.touch_updated_at();
drop trigger if exists school_vision_mission_touch on public.school_vision_mission;
create trigger school_vision_mission_touch before update on public.school_vision_mission for each row execute function public.touch_updated_at();
drop trigger if exists school_structure_touch on public.school_structure;
create trigger school_structure_touch before update on public.school_structure for each row execute function public.touch_updated_at();
drop trigger if exists facilities_touch on public.facilities;
create trigger facilities_touch before update on public.facilities for each row execute function public.touch_updated_at();

insert into public.school_history (id) values ('00000000-0000-0000-0000-000000000001') on conflict (id) do nothing;
insert into public.school_vision_mission (id) values ('00000000-0000-0000-0000-000000000002') on conflict (id) do nothing;
insert into public.school_structure (id) values ('00000000-0000-0000-0000-000000000003') on conflict (id) do nothing;

-- CMS KEPALA SEKOLAH v1
create table if not exists public.principal_profile (
  id uuid primary key,
  name text,
  nip text,
  nuptk text,
  position text not null default 'Kepala Sekolah',
  period text,
  photo_url text,
  greeting text,
  status text not null default 'draft' check (status in ('draft','published')),
  show_home boolean not null default false,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

alter table public.principal_profile enable row level security;
drop policy if exists "public read principal profile" on public.principal_profile;
drop policy if exists "manager manage principal profile" on public.principal_profile;
create policy "public read principal profile" on public.principal_profile for select to anon, authenticated using (status='published');
create policy "manager manage principal profile" on public.principal_profile for all to authenticated using (public.is_site_manager()) with check (public.is_site_manager());

drop trigger if exists principal_profile_touch on public.principal_profile;
create trigger principal_profile_touch before update on public.principal_profile for each row execute function public.touch_updated_at();

insert into public.principal_profile (id) values ('00000000-0000-0000-0000-000000000004') on conflict (id) do nothing;

-- >>>>> gtk.sql
-- ========== MODUL GTK (Guru & Tenaga Kependidikan) ==========
-- Jalankan di Supabase SQL Editor (aman dijalankan ulang). Prasyarat: schema.sql utama sudah dijalankan.
create table if not exists public.staff (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('guru','tendik')),
  name text not null,
  nip text, nuptk text, gender text, birth_place text, birth_date date,
  position text, subject text, employment_status text, education text,
  email text, phone text, photo_url text, bio text,
  -- daftar kolom yang BOLEH tampil di website: position, subject, nip, nuptk, gender, birth, status, education, email, phone, photo, bio
  visible_fields text[] not null default array['position','subject','photo'],
  sort_order int not null default 0,
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.staff enable row level security;
drop policy if exists "site admin manage staff" on public.staff;
-- Tabel asli HANYA bisa dibaca/diubah admin. Publik tidak punya akses langsung (data pribadi aman).
create policy "site admin manage staff" on public.staff for all to authenticated
  using (public.is_site_admin()) with check (public.is_site_admin());

-- Data publik GTK: tabel `staff_public` berisi HANYA baris terbit dan kolom yang dicentang "tampilkan".
-- Diisi otomatis oleh trigger setiap kali tabel `staff` berubah (tanpa view SECURITY DEFINER).
do $$ begin
  if exists (select 1 from pg_class c join pg_namespace n on n.oid = c.relnamespace
             where n.nspname = 'public' and c.relname = 'staff_public' and c.relkind = 'v') then
    drop view public.staff_public;
  end if;
end $$;

create table if not exists public.staff_public (
  id uuid primary key references public.staff(id) on delete cascade,
  kind text not null, name text not null, sort_order int not null default 0,
  position text, subject text, nip text, nuptk text, gender text, birth_place text, birth_date date,
  employment_status text, education text, email text, phone text, photo_url text, bio text
);
alter table public.staff_public enable row level security;
drop policy if exists "public read staff public" on public.staff_public;
create policy "public read staff public" on public.staff_public for select to anon, authenticated using (true);
revoke insert, update, delete on public.staff_public from anon, authenticated;
grant select on public.staff_public to anon, authenticated;

create or replace function public.sync_staff_public()
returns trigger language plpgsql security definer set search_path = '' as $$
declare r public.staff;
begin
  if tg_op = 'DELETE' then
    delete from public.staff_public where id = old.id;
    return old;
  end if;
  r := new;
  delete from public.staff_public where id = r.id;
  if r.status = 'published' then
    insert into public.staff_public (id, kind, name, sort_order, position, subject, nip, nuptk, gender, birth_place, birth_date,
      employment_status, education, email, phone, photo_url, bio)
    values (r.id, r.kind, r.name, r.sort_order,
      case when 'position'  = any(r.visible_fields) then r.position end,
      case when 'subject'   = any(r.visible_fields) then r.subject end,
      case when 'nip'       = any(r.visible_fields) then r.nip end,
      case when 'nuptk'     = any(r.visible_fields) then r.nuptk end,
      case when 'gender'    = any(r.visible_fields) then r.gender end,
      case when 'birth'     = any(r.visible_fields) then r.birth_place end,
      case when 'birth'     = any(r.visible_fields) then r.birth_date end,
      case when 'status'    = any(r.visible_fields) then r.employment_status end,
      case when 'education' = any(r.visible_fields) then r.education end,
      case when 'email'     = any(r.visible_fields) then r.email end,
      case when 'phone'     = any(r.visible_fields) then r.phone end,
      case when 'photo'     = any(r.visible_fields) then r.photo_url end,
      case when 'bio'       = any(r.visible_fields) then r.bio end);
  end if;
  return new;
end $$;
-- Fungsi trigger tidak boleh dipanggil langsung lewat API
revoke execute on function public.sync_staff_public() from public, anon, authenticated;

drop trigger if exists staff_sync_public on public.staff;
create trigger staff_sync_public after insert or update or delete on public.staff
  for each row execute function public.sync_staff_public();

-- Isi ulang dari data yang sudah ada (aman dijalankan berkali-kali)
update public.staff set id = id;

-- >>>>> pengaturan.sql
-- ========== PENGATURAN PPDB, KONTAK, EKSTRAKURIKULER ==========
-- Jalankan di Supabase SQL Editor (aman dijalankan ulang). Prasyarat: schema.sql utama sudah dijalankan.
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.site_settings enable row level security;
drop policy if exists "public read site settings" on public.site_settings;
drop policy if exists "site admin manage site settings" on public.site_settings;
-- Isi tabel ini hanya info publik (status PPDB, jam layanan, tautan sosial media).
create policy "public read site settings" on public.site_settings for select to anon, authenticated using (true);
create policy "site admin manage site settings" on public.site_settings for all to authenticated
  using (public.is_site_admin()) with check (public.is_site_admin());
insert into public.site_settings (key, value) values ('ppdb', '{"dibuka": false}'::jsonb), ('contact', '{}'::jsonb)
  on conflict (key) do nothing;

create table if not exists public.extracurriculars (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icon text,
  description text,
  coach text,
  schedule text,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.extracurriculars enable row level security;
drop policy if exists "public read active extracurriculars" on public.extracurriculars;
drop policy if exists "site admin manage extracurriculars" on public.extracurriculars;
create policy "public read active extracurriculars" on public.extracurriculars for select to anon, authenticated using (active = true);
create policy "site admin manage extracurriculars" on public.extracurriculars for all to authenticated
  using (public.is_site_admin()) with check (public.is_site_admin());

-- >>>>> extra.sql
-- ========== TAMBAHAN PUBLIKASI ==========
-- Aman dijalankan ulang. Prasyarat: schema.sql, gtk.sql, pengaturan.sql.

-- Bersihkan baris ganda school_settings (muncul jika schema.sql versi lama dijalankan berulang).
delete from public.school_settings a
using public.school_settings b
where a.id <> b.id and a.updated_at < b.updated_at;
delete from public.school_settings a
using public.school_settings b
where a.id > b.id and a.updated_at = b.updated_at;

-- updated_at otomatis untuk tabel modul GTK & pengaturan
drop trigger if exists staff_touch on public.staff;
create trigger staff_touch before update on public.staff for each row execute function public.touch_updated_at();
drop trigger if exists extracurriculars_touch on public.extracurriculars;
create trigger extracurriculars_touch before update on public.extracurriculars for each row execute function public.touch_updated_at();
drop trigger if exists site_settings_touch on public.site_settings;
create trigger site_settings_touch before update on public.site_settings for each row execute function public.touch_updated_at();

-- Hak akses Data API. Project Supabase baru tidak lagi otomatis membuka tabel baru ke API;
-- RLS di atas tetap menjadi batas keamanan sebenarnya.
grant usage on schema public to anon, authenticated;
grant select on
  public.school_settings, public.homepage_sections, public.news, public.announcements, public.agendas,
  public.achievements, public.galleries, public.services, public.school_history, public.school_vision_mission,
  public.school_structure, public.facilities, public.principal_profile, public.site_settings,
  public.extracurriculars, public.staff_public
to anon, authenticated;
grant select, insert, update, delete on
  public.user_roles, public.school_settings, public.homepage_sections, public.news, public.announcements,
  public.agendas, public.achievements, public.galleries, public.services, public.school_history,
  public.school_vision_mission, public.school_structure, public.facilities, public.principal_profile,
  public.site_settings, public.extracurriculars, public.staff, public.audit_logs
to authenticated;
grant usage, select on all sequences in schema public to authenticated;

-- Jumlah peserta didik (statistik di beranda), diisi dari Admin > Profil Sekolah
alter table public.school_settings add column if not exists student_count int;

-- >>>>> users.sql
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
