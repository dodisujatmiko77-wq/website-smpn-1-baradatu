# Website UPT SMPN 1 Baradatu (React + Vite)

## Menjalankan
    npm install
    npm run dev        # http://localhost:5173
    npm run build      # hasil di folder dist/

## Mengganti data
Semua data ada di `src/data/` (schoolData, principalData, newsData, announcementData, agendaData, achievementData,
extracurricularData, galleryData, digitalServices, ppdbData, contactData, teacherData, menuData). Ubah placeholder `[...]` di sana.

## Mengganti foto
Taruh file di `public/assets/images/<folder>/`, lalu isi field foto di data, mis. `heroImage: "/assets/images/hero/hero.jpg"`.
Logo: timpa `public/assets/logo.png`.

## Mengganti URL layanan digital
Hanya di `src/data/digitalServices.js` (field `url`). Status PPDB: `ppdbData.dibuka` di `src/data/ppdbData.js`.

## Deploy
`npm run build`, lalu unggah isi `dist/` ke hosting. Karena memakai React Router, arahkan semua URL ke `index.html`:
Netlify memakai `public/_redirects` (sudah ada); Vercel pakai rewrite `/(.*)` -> `/`; Apache/cPanel tambahkan `.htaccess`
berisi RewriteRule ke `/index.html`.
