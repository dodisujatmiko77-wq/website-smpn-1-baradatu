// Data untuk website publik.
// - Supabase aktif  : hanya data berstatus terbit/aktif yang diambil dari database. Database kosong = tampil kosong
//                     (tidak ada data contoh yang tampil sebagai data resmi).
// - Mode prototype : membaca data yang disimpan panel admin di browser, atau data contoh di src/data/.
import { useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { schoolData } from './schoolData';
import { principalData } from './principalData';
import { newsData } from './newsData';
import { announcementData } from './announcementData';
import { agendaData } from './agendaData';
import { achievementData } from './achievementData';
import { galleryData } from './galleryData';
import { digitalServices } from './digitalServices';
import { defaultHomeSettings, fetchHomepageSettings, fetchSchoolSettings, fetchSingleSchoolData, read } from './siteStore';

const remote = () => Boolean(isSupabaseConfigured && supabase);
const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const ISO = /^(\d{4})-(\d{2})-(\d{2})/;

// "2026-10-12" -> "12 Oktober 2026"; teks lain dikembalikan apa adanya
export function fmtDate(value) {
  const m = ISO.exec(String(value || ''));
  if (!m) return value || '';
  return `${Number(m[3])} ${MONTHS[Number(m[2]) - 1] || ''} ${m[1]}`.trim();
}

// Teks seperti "[NPSN]" atau "[Judul berita contoh]" dianggap belum diisi
export const isPlaceholder = (v) => typeof v !== 'string' || v.trim() === '' || /^\[.*\]$/.test(v.trim());
const filled = (v) => (typeof v === 'string' ? v.trim() !== '' : v != null);
const today = () => new Date().toISOString().slice(0, 10);

// --- Cache sederhana: beberapa komponen di satu halaman berbagi satu permintaan -------------
const cache = new Map();
function cached(key, loader) {
  if (!cache.has(key)) cache.set(key, loader().catch((e) => { cache.delete(key); throw e; }));
  return cache.get(key);
}
if (typeof window !== 'undefined') window.addEventListener('smpn-site-change', () => cache.clear());

function useLoad(key, loader, initial) {
  const [state, setState] = useState({ data: initial, loading: true, error: null });
  useEffect(() => {
    let alive = true;
    const run = () => cached(key, loader)
      .then((data) => { if (alive) setState({ data, loading: false, error: null }); })
      .catch((error) => { if (alive) setState({ data: initial, loading: false, error }); });
    run();
    window.addEventListener('smpn-site-change', run);
    return () => { alive = false; window.removeEventListener('smpn-site-change', run); };
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  return state;
}

// --- Koleksi konten ---------------------------------------------------------------------
const lines = (t) => String(t || '').split(/\r?\n/).map((x) => x.trim()).filter(Boolean);

const shape = {
  news: (x) => ({ ...x, tanggalLabel: fmtDate(x.tanggal), sample: isPlaceholder(x.judul) }),
  announcements: (x) => ({ ...x, tglLabel: fmtDate(x.tgl), sample: isPlaceholder(x.judul) }),
  agenda: (x) => {
    const m = ISO.exec(String(x.tgl || ''));
    return { ...x, hari: m ? m[3] : x.tgl, bulan: m ? MONTHS[Number(m[2]) - 1].slice(0, 3).toUpperCase() : x.bln, tglLabel: fmtDate(x.tgl), sample: isPlaceholder(x.nama) };
  },
  achievements: (x) => ({ ...x, sample: isPlaceholder(x.nama) }),
  gallery: (x) => ({ ...x, sample: !x.foto }),
  services: (x) => x,
  facilities: (x) => x,
};

const remoteQuery = {
  news: () => supabase.from('news').select('id,title,category,publish_date,summary,content,photo_url,show_home').eq('status', 'published')
    .order('publish_date', { ascending: false, nullsFirst: false }).order('created_at', { ascending: false }),
  announcements: () => supabase.from('announcements').select('id,title,publish_date,badge,content,show_home').eq('status', 'published')
    .order('publish_date', { ascending: false, nullsFirst: false }).order('created_at', { ascending: false }),
  agenda: () => supabase.from('agendas').select('id,name,event_date,time_text,location,description,show_home').eq('status', 'published')
    .order('event_date', { ascending: true, nullsFirst: false }),
  achievements: () => supabase.from('achievements').select('id,name,student_team,level,year,photo_url,description,show_home').eq('status', 'published')
    .order('year', { ascending: false, nullsFirst: false }).order('created_at', { ascending: false }),
  gallery: () => supabase.from('galleries').select('id,title,category,photo_url,caption,show_home').eq('status', 'published')
    .order('created_at', { ascending: false }),
  services: () => supabase.from('services').select('id,name,description,icon,color,url,button_text,sort_order').eq('active', true)
    .order('sort_order').order('created_at'),
  facilities: () => supabase.from('facilities').select('id,name,description,photo_url,sort_order').eq('active', true)
    .order('sort_order').order('name'),
};

const fromRow = {
  news: (x) => ({ id: x.id, judul: x.title, kategori: x.category || '', tanggal: x.publish_date || '', ringkasan: x.summary || '', content: x.content || '', foto: x.photo_url || '', homepage: !!x.show_home }),
  announcements: (x) => ({ id: x.id, judul: x.title, tgl: x.publish_date || '', badge: x.badge || 'INFO', content: x.content || '', homepage: !!x.show_home }),
  agenda: (x) => ({ id: x.id, nama: x.name, tgl: x.event_date || '', jam: x.time_text || '', lokasi: x.location || '', description: x.description || '', homepage: !!x.show_home }),
  achievements: (x) => ({ id: x.id, nama: x.name, siswa: x.student_team || '', tingkat: x.level || '', tahun: x.year || '', foto: x.photo_url || '', description: x.description || '', homepage: !!x.show_home }),
  gallery: (x) => ({ id: x.id, judul: x.title, kat: x.category || '', foto: x.photo_url || '', caption: x.caption || '', homepage: !!x.show_home }),
  services: (x) => ({ id: x.id, nama: x.name, desk: x.description || '', ikon: x.icon || '🔗', warna: x.color || '#0F4C81', url: x.url || '', tombol: x.button_text || 'Buka Layanan' }),
  facilities: (x) => ({ id: x.id, nama: x.name, deskripsi: x.description || '', foto: x.photo_url || '' }),
};

const samples = {
  news: newsData, announcements: announcementData, agenda: agendaData, achievements: achievementData,
  gallery: galleryData, services: digitalServices, facilities: [],
};

async function loadCollection(type) {
  if (remote()) {
    const { data, error } = await remoteQuery[type]();
    if (error) throw error;
    return (data || []).map(fromRow[type]);
  }
  const visible = (x) => (type === 'services' || type === 'facilities' ? x.aktif !== false : x.terbit !== false);
  return read(type, samples[type]).filter(visible);
}

/**
 * Daftar konten publik.
 * opsi.home  : hanya yang dicentang "Tampil di homepage"
 * opsi.limit : batasi jumlah
 * opsi.upcoming (agenda): agenda yang tanggalnya belum lewat lebih dulu
 */
export function usePublicList(type, { home = false, limit } = {}) {
  const { data, loading, error } = useLoad(`list:${type}`, () => loadCollection(type), []);
  const items = useMemo(() => {
    let rows = data.map(shape[type]);
    if (home) rows = rows.filter((x) => x.homepage !== false);
    if (type === 'agenda' && remote()) {
      const t = today();
      const next = rows.filter((x) => !x.tgl || x.tgl >= t);
      rows = home ? next : [...next, ...rows.filter((x) => x.tgl && x.tgl < t).reverse()];
    }
    return limit ? rows.slice(0, limit) : rows;
  }, [data, type, home, limit]);
  return { items, loading, error };
}

export function usePublicItem(type, id) {
  const { data, loading } = useLoad(`item:${type}:${id}`, async () => {
    if (remote()) {
      const table = { news: 'news', announcements: 'announcements' }[type];
      const { data: row, error } = await supabase.from(table).select('*').eq('id', id).eq('status', 'published').maybeSingle();
      if (error) throw error;
      return row ? fromRow[type](row) : null;
    }
    return read(type, []).find((x) => String(x.id) === String(id) && x.terbit !== false) || null;
  }, null);
  return { item: data ? shape[type](data) : null, loading };
}

// --- Data tunggal -------------------------------------------------------------------------
export function useSchoolData() {
  const { data } = useLoad('school', fetchSchoolSettings, null);
  return useMemo(() => {
    if (!data) return schoolData;
    const own = Object.fromEntries(Object.entries(data).filter(([k, v]) => (k in schoolData || k === 'jumlahSiswa' || k === 'akreditasi') && filled(v)));
    return { ...schoolData, ...own };
  }, [data]);
}

export function useHomeSettings() {
  const { data } = useLoad('home', fetchHomepageSettings, defaultHomeSettings);
  return data || defaultHomeSettings;
}

function useSingle(key) {
  const { data, loading } = useLoad(`single:${key}`, () => fetchSingleSchoolData(key), null);
  return { row: data && data.status === 'published' ? data : null, loading };
}

export function usePrincipal() {
  const { row, loading } = useSingle('principal');
  return useMemo(() => {
    if (row && filled(row.name)) {
      return { official: true, loading, nama: row.name, jabatan: row.position || 'Kepala Sekolah', photo: row.photo_url || '', sambutan: row.greeting || '', nip: row.nip || '', nuptk: row.nuptk || '', periode: row.period || '' };
    }
    return { official: false, loading, ...principalData };
  }, [row, loading]);
}

const MISSION_ICONS = ['📘', '❤️', '🏆', '🌱', '💡', '🤝', '🎯', '⭐'];
export function useVisionMission() {
  const { row, loading } = useSingle('vision');
  return useMemo(() => {
    const visi = row && filled(row.vision) ? row.vision.trim() : (!isPlaceholder(schoolData.visi) ? schoolData.visi : '');
    const misi = row && filled(row.mission)
      ? lines(row.mission).map((t, i) => [MISSION_ICONS[i % MISSION_ICONS.length], t.replace(/^(\d+[.)]|[-•*])\s*/, '')])
      : (schoolData.misi || []).filter((m) => Array.isArray(m) && !isPlaceholder(m[1]));
    return { visi, misi, loading };
  }, [row, loading]);
}

export function useHistory() {
  const { row, loading } = useSingle('history');
  return { title: row?.title || 'Sejarah Sekolah', paragraphs: lines(row?.content), loading };
}

export function useStructure() {
  const { row, loading } = useSingle('structure');
  return { title: row?.title || 'Struktur Organisasi', description: row?.description || '', image: row?.chart_image_url || '', loading };
}

// Statistik beranda. Angka dihitung dari data yang sudah diterbitkan; yang belum ada datanya tidak ditampilkan.
export function useSchoolStats() {
  const s = useSchoolData();
  const { items: achievements, loading: l1 } = usePublicList('achievements');
  const { items: agenda, loading: l2 } = usePublicList('agenda');
  const { data: staffCount, loading: l3 } = useLoad('staffCount', async () => {
    if (!remote()) return ['guru', 'tendik'].reduce((n, k) => n + read(`staff_${k}`, []).filter((r) => r.status === 'published').length, 0);
    const { count, error } = await supabase.from('staff_public').select('id', { count: 'exact', head: true });
    if (error) throw error;
    return count || 0;
  }, 0);
  const real = (list) => list.filter((x) => !x.sample).length;
  const stats = [
    [s.jumlahSiswa, 'Peserta Didik'],
    [staffCount || '', 'Guru & Tendik'],
    [real(agenda) || '', 'Kegiatan'],
    [real(achievements) || '', 'Prestasi'],
  ].filter(([v]) => filled(String(v)) && Number(v) > 0);
  return { stats, loading: l1 || l2 || l3 };
}
