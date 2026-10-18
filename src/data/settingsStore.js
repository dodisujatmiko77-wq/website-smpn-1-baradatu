// Pengaturan publik yang dikelola admin: PPDB, kontak/sosial media, ekstrakurikuler.
import { useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { read, write } from './siteStore';
import { ppdbData } from './ppdbData';
import { contactData } from './contactData';
import { extracurricularData } from './extracurricularData';

const remote = () => Boolean(isSupabaseConfigured && supabase);
const filled = (v) => typeof v === 'string' && v.trim() !== '';

export async function fetchSetting(key) {
  if (!remote()) return read(`setting_${key}`, null);
  const { data, error } = await supabase.from('site_settings').select('value').eq('key', key).maybeSingle();
  if (error) throw error;
  return data ? data.value : null;
}
export async function saveSetting(key, value) {
  if (!remote()) { write(`setting_${key}`, value); return; }
  const { error } = await supabase.from('site_settings').upsert({ key, value, updated_at: new Date().toISOString() });
  if (error) throw error;
}

function useSetting(key) {
  const [value, setValue] = useState(null);
  useEffect(() => {
    let alive = true;
    const run = () => fetchSetting(key).then((x) => { if (alive) setValue(x); }).catch(() => {});
    run();
    window.addEventListener('smpn-site-change', run);
    return () => { alive = false; window.removeEventListener('smpn-site-change', run); };
  }, [key]);
  return value;
}

export function usePpdb() {
  const s = useSetting('ppdb');
  return useMemo(() => ({
    ...ppdbData, ...(s || {}),
    dibuka: s ? !!s.dibuka : ppdbData.dibuka,
    url: (s && s.url) || ppdbData.url,
    infoUrl: (s && s.infoUrl) || ppdbData.infoUrl,
  }), [s]);
}

// --- Jam layanan per hari ---
export const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
export const DEFAULT_SCHEDULE = DAYS.map((hari, i) => ({
  hari, buka: i < 6, mulai: '07.00', selesai: i === 4 ? '11.00' : i === 5 ? '12.00' : '14.00',
}));
const fmtTime = (t) => String(t || '').trim().replace(':', '.');

// Hari berurutan dengan jam yang sama digabung: { hari: "Senin – Kamis", jam: "07.00 – 14.00", tutup: false }
export function scheduleRows(jadwal) {
  if (!Array.isArray(jadwal) || !jadwal.length) return [];
  const rows = DAYS.map((hari) => jadwal.find((d) => d.hari === hari) || { hari, buka: false });
  const key = (d) => (d.buka && d.mulai && d.selesai ? `${fmtTime(d.mulai)} – ${fmtTime(d.selesai)}` : 'Tutup');
  const groups = [];
  rows.forEach((d) => {
    const k = key(d), last = groups[groups.length - 1];
    if (last && last.k === k) last.to = d.hari; else groups.push({ from: d.hari, to: d.hari, k });
  });
  return groups.map((g) => ({ hari: g.from === g.to ? g.from : `${g.from} – ${g.to}`, jam: g.k, tutup: g.k === 'Tutup' }));
}

// Versi teks: "Senin – Kamis: 07.00 – 14.00 WIB"
export const scheduleLines = (jadwal) => scheduleRows(jadwal).map((r) => `${r.hari}: ${r.tutup ? 'Tutup' : `${r.jam} WIB`}`);

function waLink(n) {
  const d = String(n || '').replace(/\D/g, '');
  if (!d) return '';
  return `https://wa.me/${d.startsWith('0') ? `62${d.slice(1)}` : d}`;
}
const httpOnly = (u) => (filled(u) && /^https?:\/\//i.test(u.trim()) ? u.trim() : '');
export const MAPS_EMBED_PREFIX = 'https://www.google.com/maps/embed';
const SOCIAL = [['Facebook', 'facebook'], ['Instagram', 'instagram'], ['YouTube', 'youtube'], ['TikTok', 'tiktok']];

export function useContact() {
  const s = useSetting('contact');
  return useMemo(() => {
    if (!s) return { ...contactData, embed: '' };
    return {
      ...contactData,
      jam: scheduleLines(s.jadwal).join('\n') || (filled(s.jam) ? s.jam.trim() : contactData.jam),
      jadwalRows: scheduleRows(s.jadwal),
      wa: waLink(s.wa), maps: httpOnly(s.maps),
      embed: filled(s.mapsEmbed) && s.mapsEmbed.trim().startsWith(MAPS_EMBED_PREFIX) ? s.mapsEmbed.trim() : '',
      sosmed: SOCIAL.filter(([, k]) => httpOnly(s[k])).map(([n, k]) => [n, httpOnly(s[k])]),
    };
  }, [s]);
}

// --- Ekstrakurikuler ---
export async function fetchExtras() {
  if (!remote()) return read('extracurriculars', []);
  const { data, error } = await supabase.from('extracurriculars').select('*').order('sort_order').order('name');
  if (error) throw error;
  return data || [];
}
export async function saveExtra(item) {
  const payload = { name: (item.name || '').trim(), icon: item.icon || null, description: item.description || null, coach: item.coach || null,
    schedule: item.schedule || null, active: item.active !== false, sort_order: Number(item.sort_order || 0) };
  if (!payload.name) throw new Error('Nama kegiatan wajib diisi.');
  if (!remote()) {
    const items = read('extracurriculars', []);
    const row = { ...payload, id: item.id || String(Date.now()) };
    write('extracurriculars', item.id ? items.map((x) => (x.id === item.id ? row : x)) : [...items, row]);
    return row;
  }
  if (item.id) payload.id = item.id;
  payload.updated_at = new Date().toISOString();
  const { data, error } = await supabase.from('extracurriculars').upsert(payload).select('*').single();
  if (error) throw error;
  return data;
}
export async function deleteExtra(id) {
  if (!remote()) { write('extracurriculars', read('extracurriculars', []).filter((x) => x.id !== id)); return; }
  const { error } = await supabase.from('extracurriculars').delete().eq('id', id);
  if (error) throw error;
}

export function useExtracurriculars() {
  const [rows, setRows] = useState(null);
  useEffect(() => {
    let alive = true;
    fetchExtras().then((d) => { if (alive) setRows(d); }).catch(() => {});
    return () => { alive = false; };
  }, []);
  return useMemo(() => {
    const act = (rows || []).filter((r) => r.active !== false);
    if (act.length) return act.map((r) => ({ id: r.id, ikon: r.icon || '⭐', nama: r.name, deskripsi: r.description || '', pembina: r.coach || '', jadwal: r.schedule || '' }));
    return extracurricularData.map(([ikon, nama]) => ({ id: nama, ikon, nama, deskripsi: '', pembina: '', jadwal: '' }));
  }, [rows]);
}
