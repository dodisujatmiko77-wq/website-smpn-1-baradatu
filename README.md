# Website UPT SMPN 1 Baradatu

Website resmi sekolah dengan panel admin (CMS). Dibangun dengan React + Vite, database & login memakai Supabase, dan di-hosting di Netlify.

- **Website publik**: beranda, profil, GTK, berita, pengumuman, agenda, prestasi, ekstrakurikuler, galeri, akademik, PPDB, layanan digital, kontak.
- **Panel admin** (`/admin`): kelola semua konten di atas, unggah foto, atur tampilan beranda, peran pengguna (superadmin/admin/editor), dan audit log.

Website publik hanya menampilkan data yang **sudah diterbitkan** di panel admin. Kalau database masih kosong, halaman menampilkan keterangan "belum tersedia", tidak memakai data contoh.

---

## 1. Siapkan database (Supabase)

1. Buka project di [supabase.com](https://supabase.com) → **SQL Editor** → **New query**.
2. Salin **seluruh** isi `supabase/setup-all.sql`, tempel, lalu klik **Run**.
   Skrip ini aman dijalankan ulang: tabel dan data yang sudah ada tidak dihapus.
3. **Authentication → Users → Add user**: buat akun admin (email + password). Salin **User UID**-nya.
4. Kembali ke SQL Editor, jalankan (ganti UUID-nya):
   ```sql
   insert into public.user_roles (user_id, role)
   values ('PASTE-USER-UID-DI-SINI', 'superadmin')
   on conflict (user_id) do update set role = excluded.role;
   ```
5. **Authentication → Sign In / Providers → Email**: matikan **Allow new users to sign up**, supaya orang lain tidak bisa mendaftar sendiri. Akun baru dibuat oleh superadmin dari dashboard Supabase.

**Menambah pengguna lain** (operator, guru): buat akunnya di **Authentication → Users → Add user** (centang *Auto Confirm User*), lalu atur perannya dari panel admin, di menu **Sistem → Pengguna & Peran** (khusus superadmin). Tidak perlu menulis SQL lagi.

| Peran | Hak akses |
|---|---|
| `superadmin` | Semua, termasuk mengatur peran pengguna |
| `admin` | Profil & data sekolah (sejarah, visi-misi, struktur, fasilitas, kepala sekolah), kontrol beranda, layanan digital, ditambah semua hak editor |
| `editor` | Berita, pengumuman, agenda, prestasi, galeri, GTK, ekstrakurikuler, PPDB, kontak & sosial media, unggah foto |

> Gunakan hanya **anon / publishable key** di website. **Jangan pernah** memakai `service_role`/secret key di website ini.

## 2. Publikasikan di Netlify

1. Push proyek ini ke GitHub.
2. Netlify → **Add new site → Import an existing project** → pilih repositori.
   Pengaturan build sudah ada di `netlify.toml` (build: `npm run build`, publish: `dist`), tidak perlu diubah.
3. **Site configuration → Environment variables**, tambahkan:

   | Nama | Isi |
   |---|---|
   | `VITE_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
   | `VITE_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → anon / publishable key |
   | `VITE_SITE_URL` *(opsional)* | Domain resmi, mis. `https://smpn1baradatu.sch.id` |

4. **Deploys → Trigger deploy**. Setiap kali ada perubahan di variabel ini, lakukan deploy ulang.
5. *(Opsional)* **Domain management** → tambahkan domain sekolah. HTTPS aktif otomatis.

Jika variabel Supabase lupa diisi, website publik tetap tampil, tetapi `/admin` menampilkan pesan "Database belum terhubung". Login demo tidak dibuka di website online.

## 3. Isi konten pertama kali

Login di `https://alamat-website/admin`, lalu isi berurutan:

1. **Profil Sekolah**: NPSN, NSS, alamat, kontak, akreditasi, jumlah peserta didik, **logo**, **foto banner beranda**, dan **foto gedung**.
2. **Kepala Sekolah**, **Visi & Misi** (satu butir misi per baris), **Sejarah**, **Struktur Organisasi**, **Fasilitas**. Centang **Publikasikan ke website**.
3. **Kontak & Sosial Media**: jam layanan, WhatsApp, Google Maps, dan tautan media sosial.
4. **Layanan Digital**: tautan NilaiKu, Presensi, Smart Bell, dan SIAP-TU.
5. **GTK, Ekstrakurikuler, Berita, Pengumuman, Agenda, Prestasi, Galeri.**
   - **Terbit** berarti tampil di website. Tanpa centang, data tersimpan sebagai draft.
   - **Tampil di homepage** berarti ikut muncul di beranda.

Statistik di beranda (peserta didik, GTK, kegiatan, prestasi) dihitung otomatis dari data yang sudah terbit.

Logo resmi sudah terpasang di `public/assets/` (`logo.png`, `favicon-48.png`, `apple-touch-icon.png`) dan dipakai di gambar pratinjau link `og-image.png` (1200×630). Jika logo berubah, ganti file-file tersebut. Logo yang diunggah di Profil Sekolah juga otomatis dipakai sebagai ikon tab.

## 4. Setelah online

- Daftarkan domain di [Google Search Console](https://search.google.com/search-console) dan kirim `https://domain-anda/sitemap.xml`. Sitemap dibuat otomatis setiap deploy, termasuk berita dan pengumuman yang sudah terbit.
- Supabase paket gratis menjeda project yang tidak aktif ±7 hari. Website sekolah yang rutin dikunjungi biasanya aman, tetapi pantau email dari Supabase.

## Menjalankan di komputer

```bash
npm install
cp .env.example .env.local   # lalu isi kuncinya
npm run dev                  # http://localhost:5173
npm run build                # hasil di folder dist/
```

Tanpa `.env.local`, aplikasi berjalan dalam **mode prototype**: data disimpan di browser dan login admin memakai `admin` / `admin123`. Mode ini hanya untuk uji coba di komputer sendiri.

## Struktur proyek

```
src/
  admin/        panel admin (dimuat terpisah, tidak diunduh pengunjung biasa)
  components/   komponen tampilan (Navbar, Footer, Photo, Seo, dll.)
  data/
    publicData.js     data untuk website publik (Supabase / prototype)
    siteStore.js      data & login untuk panel admin, upload foto
    settingsStore.js  PPDB, kontak, ekstrakurikuler
    staffStore.js     data GTK
    *Data.js          teks bawaan / data contoh mode prototype
  pages/        halaman website
  sections/     bagian-bagian beranda
  styles/       CSS (additions.css = tambahan tahap publikasi)
supabase/
  setup-all.sql gabungan semua skrip database (jalankan yang ini)
scripts/        pembuat sitemap.xml & robots.txt saat build
netlify.toml    pengaturan build, redirect & header keamanan Netlify
docs/riwayat/   catatan versi-versi sebelumnya
```

---
Developed by Dodi Sujatmiko.
