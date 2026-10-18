# Admin Panel v1 — White Screen Fix

Perbaikan berasal dari baseline `smpn1-baradatu-admin-v1.zip`.

Perubahan:
- Penyimpanan admin dibuat aman jika localStorage tidak tersedia/terblokir.
- Akses baca/tulis data memiliki fallback memory untuk sesi pengujian.
- Error boundary ditambahkan agar aplikasi tidak berhenti pada layar putih tanpa pesan.
- Struktur website publik dan halaman yang sudah LOCKED tidak diubah.

Catatan: koneksi Supabase produksi belum diaktifkan pada versi ini.
