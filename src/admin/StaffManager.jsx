import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { DEFAULT_VISIBLE, STAFF_FIELDS, deleteStaff, fetchStaffAdmin, saveStaff } from '../data/staffStore';
import { saveAuditRemote } from '../data/siteStore';
import ImageField from './ImageField';

const KINDS = { guru: 'Guru', tendik: 'Tenaga Kependidikan' };
const STATUS_OPTIONS = ['', 'PNS', 'PPPK', 'GTT / Honorer', 'PTT / Honorer', 'Lainnya'];
const audit = async (a, d) => { try { await saveAuditRemote(a, d); } catch { /* audit tidak boleh menghalangi simpan */ } };

function StaffForm({ kind, initial, onCancel, onSave }) {
  const [v, setV] = useState({ visible_fields: DEFAULT_VISIBLE, status: 'draft', ...initial });
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setV((p) => ({ ...p, [k]: e.target.value }));
  const toggle = (k) => setV((p) => {
    const cur = p.visible_fields || [];
    return { ...p, visible_fields: cur.includes(k) ? cur.filter((x) => x !== k) : [...cur, k] };
  });
  const text = (k, label, type = 'text') => <label key={k}>{label}<input type={type} value={v[k] || ''} onChange={set(k)} /></label>;
  async function submit() { setSaving(true); try { await onSave(v); } finally { setSaving(false); } }
  return (
    <div className="admin-card form-card">
      <div className="card-title"><div><span className="eyebrow">FORM DATA</span><h3>{initial.id ? 'Edit' : 'Tambah'} {KINDS[kind]}</h3></div></div>
      <div className="form-grid">
        {text('name', 'Nama Lengkap (beserta gelar)')}
        {text('nip', 'NIP')}
        {text('nuptk', 'NUPTK')}
        <label>Jenis Kelamin<select value={v.gender || ''} onChange={set('gender')}><option value="">—</option><option>Laki-laki</option><option>Perempuan</option></select></label>
        {text('birth_place', 'Tempat Lahir')}
        {text('birth_date', 'Tanggal Lahir', 'date')}
        {text('position', 'Jabatan')}
        {text('subject', kind === 'guru' ? 'Mata Pelajaran' : 'Tugas / Bidang')}
        <label>Status Kepegawaian<select value={v.employment_status || ''} onChange={set('employment_status')}>{STATUS_OPTIONS.map((o) => <option key={o} value={o}>{o || '—'}</option>)}</select></label>
        {text('education', 'Pendidikan Terakhir')}
        {text('email', 'Email', 'email')}
        {text('phone', 'Telepon')}
        <ImageField label="Foto" value={v.photo_url || ''} onChange={(url) => setV((p) => ({ ...p, photo_url: url }))} folder="gtk" wide />
        {text('sort_order', 'Urutan Tampil', 'number')}
        <label style={{ gridColumn: '1 / -1' }}>Profil Singkat<textarea rows="4" value={v.bio || ''} onChange={set('bio')} /></label>
      </div>
      <div className="form-note">👁 <b>Centang data yang boleh tampil di website.</b> Data yang tidak dicentang tidak akan tampil di website dan tidak dikirim ke pengunjung.</div>
      <div className="checks">{STAFF_FIELDS.map(([k, label]) => <label key={k}><input type="checkbox" checked={(v.visible_fields || []).includes(k)} onChange={() => toggle(k)} /> Tampilkan {label}</label>)}</div>
      <div className="checks"><label>Status&nbsp;
        <select value={v.status} onChange={set('status')}><option value="draft">Draft (belum tampil)</option><option value="published">Terbit (tampil di website)</option></select></label></div>
      <div className="form-actions"><button className="admin-btn ghost" onClick={onCancel} disabled={saving}>Batal</button>
        <button className="admin-btn primary" onClick={submit} disabled={saving}>{saving ? 'Menyimpan…' : 'Simpan'}</button></div>
    </div>
  );
}

export default function StaffManager() {
  const { kind } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(null);
  useEffect(() => {
    if (!KINDS[kind]) return undefined;
    let alive = true;
    setLoading(true); setEdit(null);
    fetchStaffAdmin(kind).then((d) => { if (alive) setItems(d); }).catch((e) => alert(e.message || 'Gagal memuat data.')).finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [kind]);
  if (!KINDS[kind]) return <Navigate to="/admin" replace />;
  async function save(item) {
    try {
      const saved = await saveStaff(kind, item);
      setItems((prev) => (item.id ? prev.map((x) => (x.id === item.id ? saved : x)) : [...prev, saved]));
      await audit(`Mengubah data ${KINDS[kind]}`, item.name || '');
      setEdit(null);
    } catch (e) { alert(e.message || 'Gagal menyimpan.'); }
  }
  async function remove(item) {
    if (!confirm(`Hapus ${item.name}?`)) return;
    try { await deleteStaff(kind, item.id); setItems((prev) => prev.filter((x) => x.id !== item.id)); await audit(`Menghapus data ${KINDS[kind]}`, item.name); }
    catch (e) { alert(e.message || 'Gagal menghapus.'); }
  }
  return (
    <div className="page-stack">
      <div className="section-intro row"><div><span className="eyebrow">DATA GTK</span><h1>{KINDS[kind]}</h1>
        <p>Isi data selengkapnya; admin menentukan data apa saja yang tampil di website.</p></div>
        <button className="admin-btn primary" onClick={() => setEdit({ sort_order: items.length })}>+ Tambah</button></div>
      {edit !== null && <StaffForm key={edit.id || 'new'} kind={kind} initial={edit} onCancel={() => setEdit(null)} onSave={save} />}
      <div className="admin-card table-card"><table><thead><tr><th>Nama</th><th>{kind === 'guru' ? 'Mata Pelajaran' : 'Tugas'}</th><th>Status</th><th>Tampil di web</th><th>Aksi</th></tr></thead>
        <tbody>{loading ? <tr><td colSpan="5" className="empty">Memuat data…</td></tr>
          : items.length === 0 ? <tr><td colSpan="5" className="empty">Belum ada data.</td></tr>
          : items.map((it) => <tr key={it.id}>
            <td><b>{it.name}</b><small>{it.position || ''}</small></td>
            <td>{it.subject || '—'}</td>
            <td><span className={`status-chip ${it.status === 'published' ? 'published' : 'draft'}`}>{it.status === 'published' ? 'Terbit' : 'Draft'}</span></td>
            <td><small>{(it.visible_fields || []).length} data</small></td>
            <td><button className="mini-btn" onClick={() => setEdit(it)}>Edit</button><button className="mini-btn danger" onClick={() => remove(it)}>Hapus</button></td></tr>)}
        </tbody></table></div>
    </div>
  );
}
