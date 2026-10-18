import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { useEffect, useState } from 'react';

const PREFIX = 'smpn1_site_';
const memoryStore = new Map();

function canUseStorage() {
  try {
    return typeof window !== 'undefined' && !!window.localStorage;
  } catch {
    return false;
  }
}

function storageGet(key) {
  const fullKey = PREFIX + key;
  try {
    if (canUseStorage()) return window.localStorage.getItem(fullKey);
  } catch {}
  return memoryStore.has(fullKey) ? memoryStore.get(fullKey) : null;
}

function storageSet(key, value) {
  const fullKey = PREFIX + key;
  memoryStore.set(fullKey, value);
  try {
    if (canUseStorage()) window.localStorage.setItem(fullKey, value);
  } catch {}
}

function storageRemove(key) {
  const fullKey = PREFIX + key;
  memoryStore.delete(fullKey);
  try {
    if (canUseStorage()) window.localStorage.removeItem(fullKey);
  } catch {}
}

export const defaultHomeSettings = {
  hero: true, sambutan: true, profil: true, visiMisi: true,
  berita: true, pengumuman: true, agenda: true, prestasi: true,
  ekstrakurikuler: true, galeri: true, digital: true, ppdb: true, kontak: true,
};

export const defaultSchoolSettings = {
  name: 'UPT SMPN 1 BARADATU', npsn: '[NPSN]', nss: '[NSS]',
  alamat: '[Alamat Sekolah]', kecamatan: 'Baradatu', kabupaten: 'Way Kanan', provinsi: 'Lampung',
  email: '[email@sekolah.sch.id]', telp: '[08xxxxxxxxxx]', website: '',
  akreditasi: '', kepalaSekolah: '', logo: '', heroImage: '', schoolImage: '',
};

export function read(key, fallback) {
  try {
    const raw = storageGet(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function write(key, value) {
  storageSet(key, JSON.stringify(value));
  if (typeof window !== 'undefined') {
    try { window.dispatchEvent(new CustomEvent('smpn-site-change', { detail: { key, value } })); } catch {}
  }
}

export function reset(key) {
  storageRemove(key);
  if (typeof window !== 'undefined') {
    try { window.dispatchEvent(new CustomEvent('smpn-site-change', { detail: { key } })); } catch {}
  }
}

export function useSiteValue(key, fallback) {
  const [value, setValue] = useState(() => read(key, fallback));

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const refresh = (event) => {
      if (!event || !event.detail || event.detail.key === key) {
        setValue(read(key, fallback));
      }
    };
    window.addEventListener('smpn-site-change', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('smpn-site-change', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [key, fallback]);

  return value;
}

export function saveAudit(action, detail) {
  const logs = read('audit', []);
  const session = read('session', { name: 'Admin' });
  write('audit', [{
    id: Date.now(),
    at: new Date().toISOString(),
    actor: session.name || 'Admin',
    action,
    detail
  }, ...logs].slice(0, 100));
}

export const collections = {
  news: { label: 'Berita', fields: ['judul','kategori','tanggal','ringkasan','foto','terbit','homepage'] },
  announcements: { label: 'Pengumuman', fields: ['judul','tgl','badge','terbit','homepage'] },
  agenda: { label: 'Agenda', fields: ['nama','tgl','bln','jam','lokasi','terbit','homepage'] },
  achievements: { label: 'Prestasi', fields: ['nama','siswa','tingkat','tahun','foto','terbit','homepage'] },
  gallery: { label: 'Galeri', fields: ['judul','kat','foto','terbit','homepage'] },
  services: { label: 'Layanan Digital', fields: ['nama','desk','ikon','warna','url','tombol','aktif'] },
  facilities: { label: 'Fasilitas', fields: ['nama','deskripsi','foto','aktif','urutan'] },
};

export function seedDefaults(defaults) {
  Object.entries(defaults).forEach(([key, value]) => {
    if (!storageGet(key)) write(key, value);
  });
}

// --- Supabase production adapter -------------------------------------------------
// The local adapter above remains as a safe fallback until VITE_SUPABASE_* is set.

export const tableMap = {
  news: 'news',
  announcements: 'announcements',
  agenda: 'agendas',
  achievements: 'achievements',
  gallery: 'galleries',
  services: 'services',
  facilities: 'facilities',
};

const toDb = {
  news: (x) => ({ id: x.id && String(x.id).length > 20 ? x.id : undefined, title: x.judul || '', category: x.kategori || null, publish_date: x.tanggal || null, summary: x.ringkasan || null, photo_url: x.foto || null, status: x.terbit === false ? 'draft' : 'published', show_home: !!x.homepage }),
  announcements: (x) => ({ id: x.id && String(x.id).length > 20 ? x.id : undefined, title: x.judul || '', publish_date: x.tgl || null, badge: x.badge || null, content: x.content || null, status: x.terbit === false ? 'draft' : 'published', show_home: !!x.homepage }),
  agenda: (x) => ({ id: x.id && String(x.id).length > 20 ? x.id : undefined, name: x.nama || '', event_date: x.tgl || null, time_text: x.jam || null, location: x.lokasi || null, description: x.description || null, status: x.terbit === false ? 'draft' : 'published', show_home: !!x.homepage }),
  achievements: (x) => ({ id: x.id && String(x.id).length > 20 ? x.id : undefined, name: x.nama || '', student_team: x.siswa || null, level: x.tingkat || null, year: x.tahun ? Number(x.tahun) : null, photo_url: x.foto || null, description: x.description || null, status: x.terbit === false ? 'draft' : 'published', show_home: !!x.homepage }),
  gallery: (x) => ({ id: x.id && String(x.id).length > 20 ? x.id : undefined, title: x.judul || '', category: x.kat || null, photo_url: x.foto || null, caption: x.caption || null, status: x.terbit === false ? 'draft' : 'published', show_home: !!x.homepage }),
  services: (x) => ({ id: x.id && String(x.id).length > 20 ? x.id : undefined, name: x.nama || '', description: x.desk || null, icon: x.ikon || null, color: x.warna || null, url: x.url || null, button_text: x.tombol || null, active: x.aktif !== false, sort_order: Number(x.sort_order || 0) }),
  facilities: (x) => ({ id: x.id && String(x.id).length > 20 ? x.id : undefined, name: x.nama || '', description: x.deskripsi || null, photo_url: x.foto || null, active: x.aktif !== false, sort_order: Number(x.urutan || 0) }),
};

const fromDb = {
  news: (x) => ({ id: x.id, judul: x.title, kategori: x.category || '', tanggal: x.publish_date || '', ringkasan: x.summary || '', foto: x.photo_url || '', terbit: x.status === 'published', homepage: !!x.show_home }),
  announcements: (x) => ({ id: x.id, judul: x.title, tgl: x.publish_date || '', badge: x.badge || '', content: x.content || '', terbit: x.status === 'published', homepage: !!x.show_home }),
  agenda: (x) => ({ id: x.id, nama: x.name, tgl: x.event_date || '', jam: x.time_text || '', lokasi: x.location || '', description: x.description || '', terbit: x.status === 'published', homepage: !!x.show_home }),
  achievements: (x) => ({ id: x.id, nama: x.name, siswa: x.student_team || '', tingkat: x.level || '', tahun: x.year || '', foto: x.photo_url || '', description: x.description || '', terbit: x.status === 'published', homepage: !!x.show_home }),
  gallery: (x) => ({ id: x.id, judul: x.title, kat: x.category || '', foto: x.photo_url || '', caption: x.caption || '', terbit: x.status === 'published', homepage: !!x.show_home }),
  services: (x) => ({ id: x.id, nama: x.name, desk: x.description || '', ikon: x.icon || '', warna: x.color || '', url: x.url || '', tombol: x.button_text || '', aktif: !!x.active, sort_order: x.sort_order || 0 }),
  facilities: (x) => ({ id: x.id, nama: x.name, deskripsi: x.description || '', foto: x.photo_url || '', aktif: !!x.active, urutan: x.sort_order || 0 }),
};

export async function getAuthSession() {
  if (!isSupabaseConfigured || !supabase) return read('session', null);
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function signInAdmin(email, password) {
  if (!isSupabaseConfigured || !supabase) return { local: true, session: null };
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  const { data: roleRow, error: roleError } = await supabase.from('user_roles').select('role').eq('user_id', data.user.id).maybeSingle();
  if (roleError) { await supabase.auth.signOut(); throw roleError; }
  if (!roleRow || !['superadmin', 'admin', 'editor'].includes(roleRow.role)) {
    await supabase.auth.signOut();
    throw new Error('Akun berhasil login, tetapi belum memiliki role admin website.');
  }
  return { local: false, session: data.session, user: data.user, role: roleRow.role };
}

export async function signOutAdmin() {
  if (isSupabaseConfigured && supabase) await supabase.auth.signOut();
  storageRemove('session');
}

export async function fetchCollection(key) {
  if (!isSupabaseConfigured || !supabase || !tableMap[key]) return read(key, []);
  const { data, error } = await supabase.from(tableMap[key]).select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(fromDb[key]);
}

export async function saveCollectionItem(key, item) {
  if (!isSupabaseConfigured || !supabase || !tableMap[key]) {
    const items = read(key, []);
    const next = item.id ? items.map(x => x.id === item.id ? item : x) : [...items, { ...item, id: Date.now() }];
    write(key, next);
    return item;
  }
  const payload = toDb[key](item);
  const { data, error } = await supabase.from(tableMap[key]).upsert(payload).select('*').single();
  if (error) throw error;
  return fromDb[key](data);
}

export async function deleteCollectionItem(key, id) {
  if (!isSupabaseConfigured || !supabase || !tableMap[key]) {
    const next = read(key, []).filter(x => x.id !== id);
    write(key, next);
    return;
  }
  const { error } = await supabase.from(tableMap[key]).delete().eq('id', id);
  if (error) throw error;
}

export async function fetchHomepageSettings() {
  if (!isSupabaseConfigured || !supabase) return read('homeSettings', defaultHomeSettings);
  const { data, error } = await supabase.from('homepage_sections').select('section_key,visible,sort_order').order('sort_order');
  if (error) throw error;
  const value = { ...defaultHomeSettings };
  (data || []).forEach(row => { value[row.section_key] = row.visible; });
  return value;
}

export async function saveHomepageSettings(value) {
  if (!isSupabaseConfigured || !supabase) { write('homeSettings', value); return; }
  const rows = Object.entries(value).map(([section_key, visible], index) => ({ section_key, visible: !!visible, sort_order: index }));
  const { error } = await supabase.from('homepage_sections').upsert(rows, { onConflict: 'section_key' });
  if (error) throw error;
}

export async function fetchSchoolSettings() {
  if (!isSupabaseConfigured || !supabase) return read('schoolSettings', defaultSchoolSettings);
  const { data, error } = await supabase.from('school_settings').select('*').limit(1).maybeSingle();
  if (error) throw error;
  if (!data) return defaultSchoolSettings;
  return { ...defaultSchoolSettings, ...data, kepalaSekolah: data.kepala_sekolah || '', logo: data.logo_url || '', heroImage: data.hero_image_url || '', schoolImage: data.school_image_url || '' };
}

export async function saveSchoolSettings(value) {
  if (!isSupabaseConfigured || !supabase) { write('schoolSettings', value); return; }
  const payload = { name: value.name || '', npsn: value.npsn || null, nss: value.nss || null, alamat: value.alamat || null, kecamatan: value.kecamatan || null, kabupaten: value.kabupaten || null, provinsi: value.provinsi || null, email: value.email || null, telp: value.telp || null, website: value.website || null, akreditasi: value.akreditasi || null, kepala_sekolah: value.kepalaSekolah || null, logo_url: value.logo || null, hero_image_url: value.heroImage || null, school_image_url: value.schoolImage || null };
  const { data: existing } = await supabase.from('school_settings').select('id').limit(1).maybeSingle();
  if (existing?.id) payload.id = existing.id;
  const { error } = await supabase.from('school_settings').upsert(payload).select().single();
  if (error) throw error;
}


const singleTableMap = { history: 'school_history', vision: 'school_vision_mission', structure: 'school_structure', principal: 'principal_profile' };
const singleDefaults = {
  history: { id: '00000000-0000-0000-0000-000000000001', title: 'Sejarah Sekolah', content: '', status: 'draft' },
  vision: { id: '00000000-0000-0000-0000-000000000002', vision: '', mission: '', status: 'draft' },
  structure: { id: '00000000-0000-0000-0000-000000000003', title: 'Struktur Organisasi', description: '', chart_image_url: '', status: 'draft' },
  principal: { id: '00000000-0000-0000-0000-000000000004', name: '', nip: '', nuptk: '', position: 'Kepala Sekolah', period: '', photo_url: '', greeting: '', status: 'draft', show_home: false },
};
const singleFromDb = {
  history: x => ({ ...singleDefaults.history, ...x }),
  vision: x => ({ ...singleDefaults.vision, ...x }),
  structure: x => ({ ...singleDefaults.structure, ...x }),
  principal: x => ({ ...singleDefaults.principal, ...x }),
};

export async function fetchSingleSchoolData(key) {
  if (!singleTableMap[key] || !isSupabaseConfigured || !supabase) return read(`school_${key}`, singleDefaults[key]);
  const { data, error } = await supabase.from(singleTableMap[key]).select('*').limit(1).maybeSingle();
  if (error) throw error;
  return data ? singleFromDb[key](data) : singleDefaults[key];
}

export async function saveSingleSchoolData(key, value) {
  if (!singleTableMap[key]) throw new Error('Modul data sekolah tidak dikenal.');
  if (!isSupabaseConfigured || !supabase) { write(`school_${key}`, value); return value; }
  const payload = { ...value, id: singleDefaults[key].id };
  const { data, error } = await supabase.from(singleTableMap[key]).upsert(payload).select('*').single();
  if (error) throw error;
  return singleFromDb[key](data);
}

export async function saveAuditRemote(action, detail) {
  if (!isSupabaseConfigured || !supabase) { saveAudit(action, detail); return; }
  const { data: auth } = await supabase.auth.getUser();
  const { error } = await supabase.from('audit_logs').insert({ actor_id: auth.user?.id || null, action, detail });
  if (error) throw error;
}
