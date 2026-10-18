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
