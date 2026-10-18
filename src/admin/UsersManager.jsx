import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { listUsers, setUserRole } from '../data/siteStore';
import { isSupabaseConfigured } from '../lib/supabase';

const ROLES = [
  ['superadmin', 'Superadmin', 'Semua akses, termasuk mengatur pengguna'],
  ['admin', 'Admin', 'Data sekolah, beranda, layanan digital, dan semua konten'],
  ['editor', 'Editor', 'Berita, pengumuman, agenda, prestasi, galeri, GTK, PPDB, kontak'],
];
const roleLabel = (r) => (ROLES.find(([k]) => k === r) || [, 'Tanpa akses'])[1];
const fmt = (d) => (d ? new Date(d).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : 'Belum pernah');

// Pesan error database diterjemahkan agar mudah dipahami
function explain(e) {
  const m = (e && e.message) || '';
  if (/admin_list_users|admin_set_user_role/.test(m) && /not find|does not exist|schema cache/i.test(m)) return 'Fungsi database belum dipasang. Jalankan ulang supabase/setup-all.sql di Supabase SQL Editor.';
  return m || 'Terjadi kesalahan.';
}

export default function UsersManager({ session }) {
  const [rows, setRows] = useState([]);
  const [draft, setDraft] = useState({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true); setError('');
    try { const data = await listUsers(); setRows(data); setDraft(Object.fromEntries(data.map((u) => [u.user_id, u.role || '']))); }
    catch (e) { setError(explain(e)); }
    finally { setLoading(false); }
  }
  useEffect(() => { if (isSupabaseConfigured) load(); else setLoading(false); }, []);

  if (session?.role !== 'superadmin') return <Navigate to="/admin" replace />;

  async function apply(u, role) {
    const label = role ? `menjadi ${roleLabel(role)}` : 'dicabut aksesnya';
    if (!confirm(`${u.email} akan ${label}. Lanjutkan?`)) return;
    setBusy(u.user_id);
    try { await setUserRole(u.user_id, role); await load(); }
    catch (e) { alert(explain(e)); }
    finally { setBusy(null); }
  }

  const pending = rows.filter((u) => !u.role).length;
  return (
    <div className="page-stack">
      <div className="section-intro"><span className="eyebrow">SISTEM</span><h1>Pengguna &amp; Peran</h1>
        <p>Atur siapa saja yang boleh masuk ke panel admin dan apa yang boleh mereka kelola.</p></div>

      <div className="admin-card">
        <span className="eyebrow">MENAMBAH PENGGUNA BARU</span>
        <h3>Langkah membuat akun</h3>
        <ol className="users-steps">
          <li>Buka <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">dashboard Supabase</a> → project sekolah → <b>Authentication → Users → Add user → Create new user</b>.</li>
          <li>Isi email dan password, centang <b>Auto Confirm User</b>, lalu klik <b>Create user</b>.</li>
          <li>Kembali ke halaman ini dan klik <b>Muat Ulang</b>. Akun baru muncul dengan status <b>Tanpa akses</b>. Pilih perannya, lalu klik <b>Simpan</b>.</li>
        </ol>
        <div className="users-roles">{ROLES.map(([k, l, d]) => <div key={k}><b>{l}</b><small>{d}</small></div>)}</div>
      </div>

      {!isSupabaseConfigured ? (
        <div className="admin-card empty">Mode prototype: fitur ini aktif setelah Supabase terhubung.</div>
      ) : (
        <div className="admin-card table-card">
          <div className="users-toolbar">
            <b>{rows.length} akun{pending ? ` · ${pending} belum punya akses` : ''}</b>
            <button className="mini-btn" onClick={load} disabled={loading}>{loading ? 'Memuat…' : 'Muat Ulang'}</button>
          </div>
          {error ? <div className="form-error" style={{ margin: 16 }}>{error}</div> : (
            <table><thead><tr><th>Email</th><th>Peran</th><th>Login terakhir</th><th>Aksi</th></tr></thead>
              <tbody>{loading ? <tr><td colSpan="4" className="empty">Memuat data…</td></tr>
                : rows.map((u) => {
                  const self = u.user_id === session?.userId;
                  const changed = (draft[u.user_id] || '') !== (u.role || '');
                  return (
                    <tr key={u.user_id} className={u.role ? '' : 'users-pending'}>
                      <td><b>{u.email}{self && ' (Anda)'}</b><small>Dibuat {fmt(u.created_at)}</small></td>
                      <td>{self ? <span className="status-chip published">{roleLabel(u.role)}</span> : (
                        <select value={draft[u.user_id] || ''} onChange={(e) => setDraft((p) => ({ ...p, [u.user_id]: e.target.value }))} disabled={busy === u.user_id}>
                          <option value="">Tanpa akses</option>
                          {ROLES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                        </select>)}</td>
                      <td>{fmt(u.last_sign_in_at)}</td>
                      <td>{self ? <small>Peran sendiri tidak dapat diubah</small> : <>
                        <button className="mini-btn" onClick={() => apply(u, draft[u.user_id] || null)} disabled={!changed || busy === u.user_id}>{busy === u.user_id ? 'Menyimpan…' : 'Simpan'}</button>
                        {u.role && <button className="mini-btn danger" onClick={() => apply(u, null)} disabled={busy === u.user_id}>Cabut Akses</button>}
                      </>}</td>
                    </tr>
                  );
                })}
              </tbody></table>
          )}
        </div>
      )}
      <div className="admin-card form-note">🔒 Menghapus akun sepenuhnya dilakukan di Supabase → Authentication → Users. <b>Cabut Akses</b> di sini membuat akun tidak bisa masuk panel admin, tetapi akunnya tetap ada.</div>
    </div>
  );
}
