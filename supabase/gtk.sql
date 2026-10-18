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
