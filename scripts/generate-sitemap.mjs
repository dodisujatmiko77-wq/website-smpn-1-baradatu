// Membuat public/robots.txt dan public/sitemap.xml sebelum build.
// Domain diambil dari VITE_SITE_URL atau URL bawaan Netlify; berita yang sudah terbit ikut dimasukkan bila Supabase dapat diakses.
import { writeFileSync } from 'node:fs';

const site = (process.env.VITE_SITE_URL || process.env.URL || 'https://smpn1baradatu.sch.id').replace(/\/$/, '');
const routes = ['/', '/profil', '/profil/sejarah', '/profil/visi-misi', '/profil/struktur', '/profil/kepala-sekolah', '/profil/fasilitas',
  '/gtk/guru', '/gtk/tendik', '/berita', '/pengumuman', '/agenda', '/prestasi', '/ekstrakurikuler', '/galeri', '/video',
  '/akademik', '/ppdb', '/layanan-digital', '/kontak'];

async function published(table, prefix) {
  const url = process.env.VITE_SUPABASE_URL, key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  try {
    const res = await fetch(`${url}/rest/v1/${table}?select=id&status=eq.published&limit=1000`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
    if (!res.ok) return [];
    return (await res.json()).map((r) => `${prefix}/${r.id}`);
  } catch { return []; }
}

const all = [...routes, ...(await published('news', '/berita')), ...(await published('announcements', '/pengumuman'))];
const today = new Date().toISOString().slice(0, 10);
writeFileSync('public/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${all.map((p) => `  <url><loc>${site}${p}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`);
writeFileSync('public/robots.txt', `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${site}/sitemap.xml\n`);
console.log(`sitemap.xml: ${all.length} alamat (${site})`);
