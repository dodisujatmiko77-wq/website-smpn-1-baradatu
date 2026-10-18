// Data GTK: tabel `staff` (hanya admin) + view `staff_public` (publik, kolom mengikuti centang "tampilkan").
import { useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { read, write } from './siteStore';
import { fmtDate } from './publicData';

export const STAFF_FIELDS = [
  ['position', 'Jabatan'], ['subject', 'Mata Pelajaran / Tugas'], ['nip', 'NIP'], ['nuptk', 'NUPTK'],
  ['gender', 'Jenis Kelamin'], ['birth', 'Tempat, Tanggal Lahir'], ['status', 'Status Kepegawaian'],
  ['education', 'Pendidikan Terakhir'], ['email', 'Email'], ['phone', 'Telepon'], ['photo', 'Foto'], ['bio', 'Profil Singkat'],
];
export const DEFAULT_VISIBLE = ['position', 'subject', 'photo'];

const localKey = (kind) => `staff_${kind}`;
const remote = () => Boolean(isSupabaseConfigured && supabase);

export async function fetchStaffAdmin(kind) {
  if (!remote()) return read(localKey(kind), []);
  const { data, error } = await supabase.from('staff').select('*').eq('kind', kind).order('sort_order').order('name');
  if (error) throw error;
  return data || [];
}

export async function saveStaff(kind, item) {
  const payload = {
    kind, name: (item.name || '').trim(), nip: item.nip || null, nuptk: item.nuptk || null, gender: item.gender || null,
    birth_place: item.birth_place || null, birth_date: item.birth_date || null, position: item.position || null,
    subject: item.subject || null, employment_status: item.employment_status || null, education: item.education || null,
    email: item.email || null, phone: item.phone || null, photo_url: item.photo_url || null, bio: item.bio || null,
    visible_fields: item.visible_fields || DEFAULT_VISIBLE, sort_order: Number(item.sort_order || 0),
    status: item.status === 'published' ? 'published' : 'draft',
  };
  if (!payload.name) throw new Error('Nama wajib diisi.');
  if (!remote()) {
    const items = read(localKey(kind), []);
    const row = { ...payload, id: item.id || String(Date.now()) };
    write(localKey(kind), item.id ? items.map((x) => (x.id === item.id ? row : x)) : [...items, row]);
    return row;
  }
  if (item.id) payload.id = item.id;
  payload.updated_at = new Date().toISOString();
  const { data, error } = await supabase.from('staff').upsert(payload).select('*').single();
  if (error) throw error;
  return data;
}

export async function deleteStaff(kind, id) {
  if (!remote()) { write(localKey(kind), read(localKey(kind), []).filter((x) => x.id !== id)); return; }
  const { error } = await supabase.from('staff').delete().eq('id', id);
  if (error) throw error;
}

// Mode lokal (tanpa Supabase) meniru perilaku view staff_public
function mask(r) {
  const on = (k) => (r.visible_fields || []).includes(k);
  const v = (k, val) => (on(k) ? val || null : null);
  return { id: r.id, kind: r.kind, name: r.name, sort_order: r.sort_order, position: v('position', r.position), subject: v('subject', r.subject),
    nip: v('nip', r.nip), nuptk: v('nuptk', r.nuptk), gender: v('gender', r.gender), birth_place: v('birth', r.birth_place),
    birth_date: v('birth', r.birth_date), employment_status: v('status', r.employment_status), education: v('education', r.education),
    email: v('email', r.email), phone: v('phone', r.phone), photo_url: v('photo', r.photo_url), bio: v('bio', r.bio) };
}

export async function fetchStaffPublic(kind) {
  if (!remote()) return read(localKey(kind), []).filter((r) => r.status === 'published').map(mask).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  const { data, error } = await supabase.from('staff_public').select('*').eq('kind', kind).order('sort_order').order('name');
  if (error) throw error;
  return data || [];
}

const normalize = (r) => ({
  id: r.id, nama: r.name, foto: r.photo_url || '', jabatan: r.position || '', mapel: r.subject || '',
  nip: r.nip || '', nuptk: r.nuptk || '', gender: r.gender || '', status: r.employment_status || '', education: r.education || '',
  ttl: [r.birth_place, r.birth_date ? fmtDate(r.birth_date) : ''].filter(Boolean).join(', '),
  email: r.email || '', phone: r.phone || '', bio: r.bio || '',
});

export function useStaff(kind) {
  const [state, setState] = useState({ list: [], loading: true });
  useEffect(() => {
    let alive = true;
    fetchStaffPublic(kind)
      .then((rows) => { if (alive) setState({ list: rows.map(normalize), loading: false }); })
      .catch(() => { if (alive) setState({ list: [], loading: false }); });
    return () => { alive = false; };
  }, [kind]);
  return state;
}
