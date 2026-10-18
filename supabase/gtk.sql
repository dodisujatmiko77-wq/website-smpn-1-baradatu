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

-- View publik: hanya baris published, dan kolom hanya terisi bila dicentang "tampilkan" oleh admin.
create or replace view public.staff_public as
select id, kind, name, sort_order,
  case when 'position' = any(visible_fields) then position end as position,
  case when 'subject'  = any(visible_fields) then subject end as subject,
  case when 'nip'      = any(visible_fields) then nip end as nip,
  case when 'nuptk'    = any(visible_fields) then nuptk end as nuptk,
  case when 'gender'   = any(visible_fields) then gender end as gender,
  case when 'birth'    = any(visible_fields) then birth_place end as birth_place,
  case when 'birth'    = any(visible_fields) then birth_date end as birth_date,
  case when 'status'   = any(visible_fields) then employment_status end as employment_status,
  case when 'education'= any(visible_fields) then education end as education,
  case when 'email'    = any(visible_fields) then email end as email,
  case when 'phone'    = any(visible_fields) then phone end as phone,
  case when 'photo'    = any(visible_fields) then photo_url end as photo_url,
  case when 'bio'      = any(visible_fields) then bio end as bio
from public.staff where status = 'published';
grant select on public.staff_public to anon, authenticated;
