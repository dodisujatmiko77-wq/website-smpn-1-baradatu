import { useEffect, useState } from 'react';
import { DAYS, DEFAULT_SCHEDULE, MAPS_EMBED_PREFIX, deleteExtra, scheduleLines, fetchExtras, fetchSetting, saveExtra, saveSetting } from '../data/settingsStore';
import { Link } from 'react-router-dom';
import { fetchSchoolSettings, saveAuditRemote, saveSchoolSettings } from '../data/siteStore';

const audit = async (a, d) => { try { await saveAuditRemote(a, d); } catch { /* audit tidak boleh menghalangi simpan */ } };
const isHttp = (u) => !u || /^https?:\/\//i.test(u.trim());

function SettingForm({ settingKey, title, intro, defaults, children, validate, before = null }) {
  const [v, setV] = useState(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    let alive = true;
    fetchSetting(settingKey).then((x) => { if (alive) setV({ ...defaults, ...(x || {}) }); })
      .catch((e) => { alert(e.message || 'Gagal memuat pengaturan.'); if (alive) setV({ ...defaults }); });
    return () => { alive = false; };
  }, [settingKey]);
  if (!v) return <div className="empty">Memuat data…</div>;
  const set = (k) => (e) => setV((p) => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  async function save() {
    const problem = validate && validate(v);
    if (problem) { alert(problem); return; }
    setSaving(true);
    try { await saveSetting(settingKey, v); await audit(`Mengubah pengaturan ${title}`, title); alert('Pengaturan disimpan.'); }
    catch (e) { alert(e.message || 'Gagal menyimpan.'); } finally { setSaving(false); }
  }
  return (
    <div className="page-stack">
      <div className="section-intro"><span className="eyebrow">PENGATURAN</span><h1>{title}</h1><p>{intro}</p></div>
      {before}
      <div className="admin-card form-card">
        {children(v, set)}
        <div className="form-actions"><button className="admin-btn primary" onClick={save} disabled={saving}>{saving ? 'Menyimpan…' : 'Simpan'}</button></div>
      </div>
    </div>
  );
}

const input = (v, set, k, label, ph = '') => <label key={k}>{label}<input value={v[k] || ''} onChange={set(k)} placeholder={ph} /></label>;
const area = (v, set, k, label) => <label key={k} style={{ gridColumn: '1 / -1' }}>{label}<textarea rows="4" value={v[k] || ''} onChange={set(k)} /></label>;

export function PpdbSettings() {
  return (
    <SettingForm settingKey="ppdb" title="PPDB" defaults={{ dibuka: false }}
      intro="Atur status PPDB dan informasi yang tampil di beranda dan halaman PPDB."
      validate={(v) => (!isHttp(v.url) && !v.url.startsWith('/') ? 'Link pendaftaran harus diawali https:// atau /' : '')}>
      {(v, set) => <>
        <div className="checks"><label><input type="checkbox" checked={!!v.dibuka} onChange={set('dibuka')} /> <b>PPDB sedang dibuka</b> (tombol "Daftar Sekarang" tampil)</label></div>
        <div className="form-grid">
          {input(v, set, 'url', 'Link Pendaftaran (Daftar Sekarang)', 'https://...')}
          {input(v, set, 'infoUrl', 'Link Informasi Lengkap', '/ppdb atau https://...')}
          {area(v, set, 'jadwal', 'Jadwal PPDB')}
          {area(v, set, 'persyaratan', 'Persyaratan')}
          {area(v, set, 'alur', 'Alur Pendaftaran')}
          {area(v, set, 'pengumuman', 'Pengumuman PPDB')}
        </div>
        <div className="form-note">ℹ️ Aktifkan "PPDB sedang dibuka" hanya setelah ada keputusan resmi sekolah. Kolom yang kosong tidak ditampilkan.</div>
      </>}
    </SettingForm>
  );
}

// Jam layanan per hari (Senin–Minggu), masing-masing bisa buka/tutup dengan jam berbeda
function ScheduleEditor({ value, onChange }) {
  const rows = DAYS.map((hari) => (value || []).find((d) => d.hari === hari) || DEFAULT_SCHEDULE.find((d) => d.hari === hari));
  const toInput = (t) => String(t || '').replace('.', ':');
  const update = (hari, patch) => onChange(rows.map((d) => (d.hari === hari ? { ...d, ...patch } : d)));
  const preview = scheduleLines(rows);
  return (
    <div className="schedule-editor" style={{ gridColumn: '1 / -1' }}>
      <b>Jam Layanan</b>
      <table><thead><tr><th>Hari</th><th>Buka</th><th>Mulai</th><th>Selesai</th></tr></thead>
        <tbody>{rows.map((d) => (
          <tr key={d.hari} className={d.buka ? '' : 'closed'}>
            <td>{d.hari}</td>
            <td><input type="checkbox" checked={!!d.buka} onChange={(e) => update(d.hari, { buka: e.target.checked })} aria-label={`${d.hari} buka`} /></td>
            <td><input type="time" value={toInput(d.mulai)} disabled={!d.buka} onChange={(e) => update(d.hari, { mulai: e.target.value.replace(':', '.') })} aria-label={`${d.hari} jam mulai`} /></td>
            <td><input type="time" value={toInput(d.selesai)} disabled={!d.buka} onChange={(e) => update(d.hari, { selesai: e.target.value.replace(':', '.') })} aria-label={`${d.hari} jam selesai`} /></td>
          </tr>
        ))}</tbody></table>
      <div className="schedule-preview"><span>Tampil di website:</span>{preview.map((l) => <div key={l}>{l}</div>)}</div>
    </div>
  );
}

// Alamat, telepon & email disimpan di Profil Sekolah; ditampilkan di sini agar mudah ditemukan.
function SchoolContactCard() {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    let alive = true;
    fetchSchoolSettings().then((x) => { if (alive) setData(x); }).catch((e) => alert(e.message || 'Gagal memuat profil sekolah.'));
    return () => { alive = false; };
  }, []);
  if (!data) return <div className="admin-card empty">Memuat data…</div>;
  const set = (k) => (e) => setData((p) => ({ ...p, [k]: e.target.value }));
  async function save() {
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) { alert('Format email belum benar.'); return; }
    setSaving(true);
    try { await saveSchoolSettings(data); await audit('Mengubah kontak sekolah', 'Alamat, telepon, email'); alert('Alamat, telepon, dan email disimpan.'); }
    catch (e) { alert(/permission|policy|row-level/i.test(e.message || '') ? 'Akun Anda tidak memiliki izin mengubah data ini. Hubungi admin/superadmin.' : (e.message || 'Gagal menyimpan.')); }
    finally { setSaving(false); }
  }
  return (
    <div className="admin-card form-card">
      <div className="card-title"><div><span className="eyebrow">KONTAK UTAMA</span><h3>Alamat, Telepon &amp; Email Sekolah</h3></div></div>
      <div className="form-grid">
        <label style={{ gridColumn: '1 / -1' }}>Alamat<input value={data.alamat || ''} onChange={set('alamat')} /></label>
        <label>Telepon<input value={data.telp || ''} onChange={set('telp')} placeholder="08xxxxxxxxxx" /></label>
        <label>Email Sekolah<input type="email" value={data.email || ''} onChange={set('email')} placeholder="info@sekolah.sch.id" /></label>
      </div>
      <div className="form-note">ℹ️ Data ini sama dengan yang ada di <Link to="/admin/profil">Profil Sekolah</Link>, dan tampil di bagian Kontak, halaman Profil, serta footer website. Ini <b>bukan</b> email login admin.</div>
      <div className="form-actions"><button className="admin-btn primary" onClick={save} disabled={saving}>{saving ? 'Menyimpan…' : 'Simpan Kontak Utama'}</button></div>
    </div>
  );
}

export function ContactSettings() {
  return (
    <SettingForm settingKey="contact" title="Kontak & Sosial Media" defaults={{}} before={<SchoolContactCard />}
      intro="Atur kontak utama sekolah, jam layanan, WhatsApp, peta Google Maps, dan tautan sosial media."
      validate={(v) => {
        if (['maps', 'facebook', 'instagram', 'youtube', 'tiktok'].some((k) => !isHttp(v[k]))) return 'Semua link harus diawali https://';
        const bad = (v.jadwal || []).find((d) => d.buka && (!d.mulai || !d.selesai || d.mulai.replace('.', ':') >= d.selesai.replace('.', ':')));
        if (bad) return `Jam layanan hari ${bad.hari} belum benar: jam selesai harus setelah jam mulai.`;
        if (v.mapsEmbed && !v.mapsEmbed.trim().startsWith(MAPS_EMBED_PREFIX)) return `Link peta sematan harus diawali ${MAPS_EMBED_PREFIX}`;
        return '';
      }}>
      {(v, set) => <>
        <div className="form-grid">
          <ScheduleEditor value={v.jadwal} onChange={(jadwal) => set('jadwal')({ target: { type: 'text', value: jadwal } })} />
          {input(v, set, 'wa', 'Nomor WhatsApp', '08xxxxxxxxxx')}
          {input(v, set, 'maps', 'Link Google Maps (tombol)', 'https://maps.app.goo.gl/...')}
          {input(v, set, 'mapsEmbed', 'Link Peta Sematan (embed)', `${MAPS_EMBED_PREFIX}?pb=...`)}
          {input(v, set, 'facebook', 'Facebook', 'https://facebook.com/...')}
          {input(v, set, 'instagram', 'Instagram', 'https://instagram.com/...')}
          {input(v, set, 'youtube', 'YouTube', 'https://youtube.com/...')}
          {input(v, set, 'tiktok', 'TikTok', 'https://tiktok.com/@...')}
        </div>
        <div className="form-note">ℹ️ Peta sematan: Google Maps → Bagikan → Sematkan peta → salin alamat di dalam <code>src="..."</code>. Kolom kosong tidak ditampilkan di website.</div>
      </>}
    </SettingForm>
  );
}

function ExtraForm({ initial, onCancel, onSave }) {
  const [v, setV] = useState({ active: true, ...initial });
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setV((p) => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  async function submit() { setSaving(true); try { await onSave(v); } finally { setSaving(false); } }
  return (
    <div className="admin-card form-card">
      <div className="card-title"><div><span className="eyebrow">FORM DATA</span><h3>{initial.id ? 'Edit' : 'Tambah'} Ekstrakurikuler</h3></div></div>
      <div className="form-grid">
        {input(v, set, 'name', 'Nama Kegiatan')}
        {input(v, set, 'icon', 'Ikon (emoji)', '⚽')}
        {input(v, set, 'coach', 'Pembina')}
        {input(v, set, 'schedule', 'Jadwal', 'Sabtu, 14.00 WIB')}
        {input(v, set, 'sort_order', 'Urutan Tampil')}
        {area(v, set, 'description', 'Deskripsi')}
      </div>
      <div className="checks"><label><input type="checkbox" checked={v.active !== false} onChange={set('active')} /> Aktif (tampil di website)</label></div>
      <div className="form-actions"><button className="admin-btn ghost" onClick={onCancel} disabled={saving}>Batal</button>
        <button className="admin-btn primary" onClick={submit} disabled={saving}>{saving ? 'Menyimpan…' : 'Simpan'}</button></div>
    </div>
  );
}

export function ExtraManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(null);
  useEffect(() => {
    let alive = true;
    fetchExtras().then((d) => { if (alive) setItems(d); }).catch((e) => alert(e.message || 'Gagal memuat data.')).finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);
  async function save(item) {
    try {
      const saved = await saveExtra(item);
      setItems((prev) => (item.id ? prev.map((x) => (x.id === item.id ? saved : x)) : [...prev, saved]));
      await audit('Mengubah ekstrakurikuler', item.name || ''); setEdit(null);
    } catch (e) { alert(e.message || 'Gagal menyimpan.'); }
  }
  async function remove(it) {
    if (!confirm(`Hapus ${it.name}?`)) return;
    try { await deleteExtra(it.id); setItems((prev) => prev.filter((x) => x.id !== it.id)); await audit('Menghapus ekstrakurikuler', it.name); }
    catch (e) { alert(e.message || 'Gagal menghapus.'); }
  }
  return (
    <div className="page-stack">
      <div className="section-intro row"><div><span className="eyebrow">KEGIATAN</span><h1>Ekstrakurikuler</h1><p>Kelola daftar ekstrakurikuler yang tampil di website.</p></div>
        <button className="admin-btn primary" onClick={() => setEdit({ sort_order: items.length })}>+ Tambah</button></div>
      {edit !== null && <ExtraForm key={edit.id || 'new'} initial={edit} onCancel={() => setEdit(null)} onSave={save} />}
      <div className="admin-card table-card"><table><thead><tr><th>Kegiatan</th><th>Pembina</th><th>Status</th><th>Aksi</th></tr></thead>
        <tbody>{loading ? <tr><td colSpan="4" className="empty">Memuat data…</td></tr>
          : items.length === 0 ? <tr><td colSpan="4" className="empty">Belum ada data. Website memakai daftar contoh sampai ada data aktif.</td></tr>
          : items.map((it) => <tr key={it.id}><td><b>{it.icon} {it.name}</b><small>{it.schedule || ''}</small></td><td>{it.coach || '—'}</td>
            <td><span className={`status-chip ${it.active ? 'published' : 'draft'}`}>{it.active ? 'Aktif' : 'Nonaktif'}</span></td>
            <td><button className="mini-btn" onClick={() => setEdit(it)}>Edit</button><button className="mini-btn danger" onClick={() => remove(it)}>Hapus</button></td></tr>)}
        </tbody></table></div>
    </div>
  );
}
