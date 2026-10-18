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
