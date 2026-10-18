# CMS Data Sekolah v1

CMS Data Sekolah v1 menambahkan pengelolaan data resmi untuk:

1. Profil Sekolah (modul yang sudah ada dan tetap dipertahankan)
2. Sejarah Sekolah
3. Visi & Misi
4. Struktur Organisasi
5. Fasilitas Sekolah

## Supabase
Jalankan bagian `CMS DATA SEKOLAH v1` pada `supabase/schema.sql` di SQL Editor project Supabase yang sama. Script aman dijalankan setelah schema utama.

## Status publikasi
- Sejarah, Visi & Misi, Struktur: Draft/Publikasikan.
- Fasilitas: Aktif/Nonaktif.
- Data yang belum dipublikasikan tidak boleh tampil pada website publik setelah integrasi frontend berikutnya.

## Catatan
Versi ini membangun kontrol admin dan penyimpanan Supabase terlebih dahulu. Halaman publik yang sudah LOCKED tidak diubah desainnya pada tahap ini.
