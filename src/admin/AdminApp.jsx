import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  defaultHomeSettings,
  defaultSchoolSettings,
  collections,
  read,
  write,
  saveAudit,
  fetchHomepageSettings,
  saveHomepageSettings,
  fetchSchoolSettings,
  saveSchoolSettings,
  fetchSingleSchoolData,
  saveSingleSchoolData,
  fetchCollection,
  saveCollectionItem,
  deleteCollectionItem,
  saveAuditRemote,
  getAuthSession,
  signInAdmin,
  signOutAdmin,
} from '../data/siteStore';
import { isSupabaseConfigured } from '../lib/supabase';
import { newsData } from '../data/newsData';
import { announcementData } from '../data/announcementData';
import { agendaData } from '../data/agendaData';
import { achievementData } from '../data/achievementData';
import { galleryData } from '../data/galleryData';
import { digitalServices } from '../data/digitalServices';
import StaffManager from './StaffManager';
import ImageField from './ImageField';
import UsersManager from './UsersManager';
import { ContactSettings, ExtraManager, PpdbSettings } from './SettingsAdmin';
import './admin.css';

const labels = {
  hero: 'Hero / Banner', sambutan: 'Sambutan Kepala Sekolah', profil: 'Profil Sekolah',
  visiMisi: 'Visi & Misi', berita: 'Berita', pengumuman: 'Pengumuman', agenda: 'Agenda',
  prestasi: 'Prestasi', ekstrakurikuler: 'Ekstrakurikuler', galeri: 'Galeri',
  digital: 'Ekosistem Digital', ppdb: 'PPDB', kontak: 'Kontak',
};

// [kolom, label, jenis input, pilihan]
const NEWS_CATS = ['Sekolah','Kegiatan','Prestasi','Akademik','Pengumuman'];
const GALLERY_CATS = ['Pembelajaran','Kegiatan','Prestasi','Upacara','Ekstrakurikuler'];
const fieldMap = {
  news: [['judul','Judul'],['kategori','Kategori','select',NEWS_CATS],['tanggal','Tanggal Terbit','date'],['foto','Foto Utama','image'],['ringkasan','Ringkasan (tampil di kartu berita)','textarea'],['content','Isi Berita (pisahkan paragraf dengan baris kosong)','longtext']],
  announcements: [['judul','Judul'],['tgl','Tanggal','date'],['badge','Label','select',['PENTING','INFO','BARU']],['content','Isi Pengumuman','longtext']],
  agenda: [['nama','Nama Agenda'],['tgl','Tanggal','date'],['jam','Jam (mis. 07.30 WIB)'],['lokasi','Lokasi'],['description','Deskripsi','textarea']],
  achievements: [['nama','Nama Prestasi'],['siswa','Siswa / Tim'],['tingkat','Tingkat (mis. Kabupaten)'],['tahun','Tahun','number'],['foto','Foto','image'],['description','Keterangan','textarea']],
  gallery: [['judul','Judul'],['kat','Kategori','select',GALLERY_CATS],['foto','Foto','image'],['caption','Keterangan','textarea']],
  services: [['nama','Nama Layanan'],['desk','Deskripsi','textarea'],['ikon','Ikon (emoji)'],['warna','Warna','color'],['url','URL (diawali https://)'],['tombol','Teks Tombol']],
  facilities: [['nama','Nama Fasilitas'],['deskripsi','Deskripsi','textarea'],['foto','Foto','image'],['urutan','Urutan','number']],
};

function Field({ spec, value, onChange, folder }) {
  const [key, label, type = 'text', options] = spec;
  const v = value ?? '';
  const set = (e) => onChange(key, e.target.value);
  if (type === 'image') return <ImageField label={label} value={v} onChange={(url) => onChange(key, url)} folder={folder} wide />;
  if (type === 'textarea' || type === 'longtext') return <label style={{ gridColumn: '1 / -1' }}>{label}<textarea rows={type === 'longtext' ? 12 : 3} value={v} onChange={set} /></label>;
  if (type === 'select') return <label>{label}<select value={v} onChange={set}><option value="">— Pilih —</option>{options.map((o) => <option key={o} value={o}>{o}</option>)}</select></label>;
  if (type === 'color') return <label>{label}<input type="color" value={/^#[0-9a-f]{6}$/i.test(v) ? v : '#0f4c81'} onChange={set} /></label>;
  return <label>{label}<input type={type} value={v} onChange={set} /></label>;
}

// Data contoh untuk mode prototype; setiap baris diberi id agar bisa diedit tanpa membuat salinan baru
const seed = (key, rows, extra) => rows.map((x, i) => ({ ...x, ...extra, id: `contoh-${key}-${i + 1}` }));
const localSeed = {
  news: seed('news', newsData, { terbit: true, homepage: true }),
  announcements: seed('announcements', announcementData, { terbit: true, homepage: true }),
  agenda: seed('agenda', agendaData, { terbit: true, homepage: true }),
  achievements: seed('achievements', achievementData, { terbit: true, homepage: true }),
  gallery: seed('gallery', galleryData, { terbit: true, homepage: true }),
  services: seed('services', digitalServices, { aktif: true }),
};

function seedLocalDefaults() {
  if (isSupabaseConfigured) return;
  const defaults = { homeSettings: defaultHomeSettings, schoolSettings: defaultSchoolSettings, ...localSeed, audit: [] };
  Object.entries(defaults).forEach(([key, value]) => {
    const current = read(key, null);
    if (!current) write(key, value);
    // Perbaiki data prototype lama yang tersimpan tanpa id
    else if (Array.isArray(current) && current.some(x => x && x.id == null)) write(key, current.map((x, i) => (x && x.id == null ? { ...x, id: `contoh-${key}-${i + 1}` } : x)));
  });
}
seedLocalDefaults();

async function recordAudit(action, detail) {
  try { await saveAuditRemote(action, detail); } catch { saveAudit(action, detail); }
}

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const production = isSupabaseConfigured;

  async function submit(event) {
    event.preventDefault();
    setError('');
    try {
      if (!production) {
        if ((identifier === 'admin' || identifier === 'superadmin') && password === 'admin123') {
          const role = identifier === 'admin' ? 'admin' : 'superadmin';
          const next = { name: role === 'admin' ? 'Administrator' : 'Super Admin', role };
          write('session', next);
          await recordAudit('Login', 'Masuk ke panel admin mode prototype');
          onLogin(next);
          navigate('/admin', { replace: true });
          return;
        }
        throw new Error('Akun demo: admin / admin123');
      }
      const result = await signInAdmin(identifier, password);
      const next = { name: result.user?.email || 'Administrator', role: result.role, userId: result.user?.id };
      write('session', next);
      await recordAudit('Login', 'Masuk ke panel admin produksi');
      onLogin(next);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err?.message || 'Login gagal.');
    }
  }

  return <div className="admin-login">
    <form className="login-panel" onSubmit={submit}>
      <div className="login-mark">SB</div>
      <span className="eyebrow">ADMINISTRATOR</span>
      <h1>Website UPT SMPN 1 Baradatu</h1>
      <p>Panel pengontrol konten website sekolah.</p>
      <label>{production ? 'Email' : 'Username'}<input value={identifier} onChange={e => setIdentifier(e.target.value)} autoComplete={production ? 'email' : 'username'} required /></label>
      <label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required /></label>
      {error && <div className="form-error">{error}</div>}
      <button className="admin-btn primary">Masuk ke Dashboard</button>
      <small>{production ? 'Mode produksi: autentikasi Supabase aktif.' : 'Mode prototype: admin / admin123. Hubungkan Supabase untuk produksi.'}</small>
    </form>
  </div>;
}

const sidebarGroups = [
  { key:'utama', label:'UTAMA', items:[
    ['Dashboard','/admin','▦'],
    ['Kontrol Homepage','/admin/homepage','⌂'],
  ]},
  { key:'data-sekolah', label:'DATA SEKOLAH', items:[
    ['Profil Sekolah','/admin/profil','🏫'],
    ['Sejarah Sekolah','/admin/data-sekolah/history','📜'],
    ['Visi & Misi','/admin/data-sekolah/vision','🎯'],
    ['Struktur Organisasi','/admin/data-sekolah/structure','🏢'],
    ['Fasilitas Sekolah','/admin/fasilitas','🏫'],
    ['Kepala Sekolah','/admin/data-sekolah/principal','👤'],
  ]},
  { key:'gtk', label:'GTK', items:[
    ['Guru','/admin/gtk/guru','👩‍🏫'],
    ['Tenaga Kependidikan','/admin/gtk/tendik','🧑‍💼'],
  ]},
  { key:'lainnya', label:'KEGIATAN & PENGATURAN', items:[
    ['Ekstrakurikuler','/admin/ekstrakurikuler','⚽'],
    ['PPDB','/admin/pengaturan/ppdb','🎓'],
    ['Kontak & Sosial Media','/admin/pengaturan/kontak','☎'],
  ]},
  { key:'konten', label:'KONTEN WEBSITE', items:[
    ['Berita','/admin/konten/news','📰'],
    ['Pengumuman','/admin/konten/announcements','📢'],
    ['Agenda','/admin/konten/agenda','📅'],
    ['Prestasi','/admin/konten/achievements','🏆'],
    ['Galeri','/admin/konten/gallery','🖼'],
  ]},
  { key:'layanan', label:'LAYANAN', items:[
    ['Layanan Digital','/admin/konten/services','🔗'],
  ]},
  { key:'sistem', label:'SISTEM', items:[
    ['Pengguna & Peran','/admin/pengguna','👥', 'superadmin'],
    ['Audit Log','/admin/audit','◷'],
  ]},
];
const menu = sidebarGroups.flatMap(group => group.items);

function Layout({ session, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [openGroups, setOpenGroups] = useState(() => ({
    utama: true,
    'data-sekolah': location.pathname.startsWith('/admin/profil') || location.pathname.startsWith('/admin/data-sekolah') || location.pathname === '/admin/fasilitas',
    gtk: location.pathname.startsWith('/admin/gtk/'),
    lainnya: location.pathname === '/admin/ekstrakurikuler' || location.pathname.startsWith('/admin/pengaturan/'),
    konten: location.pathname.startsWith('/admin/konten/'),
    layanan: location.pathname === '/admin/konten/services',
    sistem: location.pathname === '/admin/audit' || location.pathname === '/admin/pengguna',
  }));
  const title = menu.find(item => item[1] === location.pathname)?.[0] || (location.pathname === '/admin/data-sekolah' ? 'Data Sekolah' : 'Kelola Konten');
  useEffect(() => {
    setOpenGroups(prev => {
      const next = { ...prev };
      sidebarGroups.forEach(group => {
        if (group.items.some(item => item[1] === location.pathname)) next[group.key] = true;
      });
      return next;
    });
  }, [location.pathname]);
  async function logout() {
    await recordAudit('Logout', 'Keluar dari panel admin');
    await signOutAdmin();
    onLogout();
    navigate('/admin/login', { replace: true });
  }
  return <div className="admin-shell">
    <aside className="admin-side">
      <div className="admin-brand"><div className="admin-logo">SB</div><div><strong>SMPN 1 BARADATU</strong><span>Website Control</span></div></div>
      <nav>{sidebarGroups.map(group => ({ ...group, items: group.items.filter(item => !item[3] || item[3] === session?.role) })).map(group => <div className={`nav-group ${openGroups[group.key] ? 'open' : ''}`} key={group.key}>
        <button className="nav-group-head" type="button" onClick={() => setOpenGroups(prev => ({ ...prev, [group.key]: !prev[group.key] }))}>
          <span>{group.label}</span><b aria-hidden="true">⌄</b>
        </button>
        <div className="nav-group-items">{group.items.map(item => <Link key={item[1]} to={item[1]} className={location.pathname === item[1] ? 'active' : ''}><i>{item[2]}</i><span>{item[0]}</span></Link>)}</div>
      </div>)}</nav>
      <div className="admin-side-foot"><span className="role-dot"/><div><b>{session?.name || 'Admin'}</b><small>{session?.role || 'admin'}</small></div><button onClick={logout} title="Keluar">↪</button></div>
    </aside>
    <main className="admin-main">
      <header className="admin-top"><div><span className="crumb">PANEL KONTROL</span><h2>{title}</h2></div><Link className="view-site" to="/">Lihat Website ↗</Link></header>
      <div className="admin-content"><Routes>
        <Route index element={<Dashboard/>}/><Route path="homepage" element={<Homepage/>}/><Route path="data-sekolah" element={<DataSekolah/>}/><Route path="data-sekolah/:module" element={<SchoolSingle/>}/><Route path="profil" element={<Profil/>}/><Route path="fasilitas" element={<FacilityManager/>}/>
        <Route path="gtk/:kind" element={<StaffManager/>}/><Route path="konten/:type" element={<Manager/>}/><Route path="ekstrakurikuler" element={<ExtraManager/>}/><Route path="pengaturan/ppdb" element={<PpdbSettings/>}/><Route path="pengaturan/kontak" element={<ContactSettings/>}/><Route path="pengguna" element={<UsersManager session={session}/>}/><Route path="audit" element={<Audit/>}/>
      </Routes></div>
    </main>
  </div>;
}

function Dashboard() {
  const [counts, setCounts] = useState({});
  const [home, setHome] = useState(defaultHomeSettings);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const keys = Object.keys(collections);
        const values = await Promise.all(keys.map(key => fetchCollection(key)));
        if (!alive) return;
        setCounts(Object.fromEntries(keys.map((key, i) => [key, values[i].length])));
        setHome(await fetchHomepageSettings());
      } finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, []);
  return <>
    <div className="welcome"><div><span className="eyebrow">CONTROL CENTER</span><h1>Selamat datang di Panel Website</h1><p>Kelola informasi yang tampil di website UPT SMPN 1 Baradatu dari satu tempat.</p></div><Link className="admin-btn primary" to="homepage">Atur Homepage</Link></div>
    <div className="stats-admin">{Object.entries(collections).map(([key, meta]) => <div className="stat-admin" key={key}><span>{meta.label}</span><strong>{loading ? '—' : counts[key] ?? 0}</strong><small>data tersimpan</small></div>)}<div className="stat-admin"><span>Homepage aktif</span><strong>{Object.values(home).filter(Boolean).length}</strong><small>dari {Object.keys(home).length} bagian</small></div></div>
    <div className="admin-grid-2"><div className="admin-card"><span className="eyebrow">ALUR PUBLIKASI</span><h3>Kontrol sebelum tampil</h3><div className="flow"><b>1</b><span>Tambah / edit konten</span><b>2</b><span>Simpan sebagai draft</span><b>3</b><span>Terbitkan & pilih tampil di homepage</span></div></div><div className="admin-card"><span className="eyebrow">KONEKSI</span><h3>{isSupabaseConfigured ? 'Mode Produksi' : 'Mode Prototype'}</h3><span className={`status-chip ${isSupabaseConfigured ? 'published' : 'warning'}`}>{isSupabaseConfigured ? 'Supabase Aktif' : 'Lokal'}</span><p className="muted">{isSupabaseConfigured ? 'Auth, Database, RLS, dan Audit Log menggunakan Supabase.' : 'Data masih disimpan lokal. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY untuk produksi.'}</p></div></div>
  </>;
}

function Homepage() {
  const [value, setValue] = useState(defaultHomeSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  useEffect(() => { fetchHomepageSettings().then(setValue).finally(() => setLoading(false)); }, []);
  async function save() { setSaving(true); try { await saveHomepageSettings(value); await recordAudit('Mengubah kontrol homepage', 'Memperbarui bagian homepage'); alert('Pengaturan disimpan.'); } catch (e) { alert(e.message || 'Gagal menyimpan.'); } finally { setSaving(false); } }
  return <div className="page-stack"><div className="section-intro"><span className="eyebrow">PENGATURAN TAMPILAN</span><h1>Kontrol Homepage</h1><p>Tentukan bagian mana yang tampil. Desain homepage final tetap tidak berubah.</p></div>{loading ? <div className="admin-card empty">Memuat pengaturan…</div> : <><div className="toggle-grid">{Object.entries(labels).map(([key, text]) => <label className="toggle-card" key={key}><span><b>{text}</b><small>{value[key] ? 'Tampil di website' : 'Disembunyikan'}</small></span><input type="checkbox" checked={!!value[key]} onChange={e => setValue(prev => ({ ...prev, [key]: e.target.checked }))}/><i/></label>)}</div><button className="admin-btn primary" onClick={save} disabled={saving}>{saving ? 'Menyimpan…' : 'Simpan Pengaturan Homepage'}</button></>}</div>;
}


function DataSekolah() {
  const modules = [
    ['profil','Profil Sekolah','Identitas, alamat, kontak, akreditasi dan branding sekolah.','/admin/profil'],
    ['history','Sejarah Sekolah','Kelola narasi sejarah resmi sekolah.','/admin/data-sekolah/history'],
    ['vision','Visi & Misi','Kelola visi dan misi resmi sekolah.','/admin/data-sekolah/vision'],
    ['structure','Struktur Organisasi','Kelola deskripsi dan bagan struktur organisasi.','/admin/data-sekolah/structure'],
    ['facilities','Fasilitas Sekolah','Kelola daftar fasilitas yang tampil di website.','/admin/fasilitas'],
    ['principal','Kepala Sekolah','Kelola profil, foto, dan sambutan kepala sekolah.','/admin/data-sekolah/principal'],
  ];
  return <div className="page-stack"><div className="section-intro"><span className="eyebrow">CMS DATA SEKOLAH</span><h1>Data Sekolah</h1><p>Satu tempat untuk mengelola informasi resmi sekolah yang menjadi dasar halaman publik.</p></div><div className="toggle-grid">{modules.map(([key,title,desc,to]) => <Link className="toggle-card data-module-card" key={key} to={to}><span><b>{title}</b><small>{desc}</small></span><i>→</i></Link>)}</div><div className="admin-card form-note">ℹ️ Modul ini hanya mengatur data. Desain halaman publik tetap mengikuti UI yang sudah dikunci.</div></div>;
}

function SchoolSingle() {
  const { module } = useParams();
  const config = {
    history: { title:'Sejarah Sekolah', eyebrow:'DATA SEKOLAH', intro:'Kelola narasi sejarah resmi sekolah. Pisahkan paragraf dengan baris baru.', fields:[['title','Judul'],['content','Isi Sejarah']], textareas:['content'] },
    vision: { title:'Visi & Misi', eyebrow:'DATA SEKOLAH', intro:'Kelola visi dan misi resmi sekolah. Tulis setiap butir misi pada baris baru.', fields:[['vision','Visi'],['mission','Misi (satu butir per baris)']], textareas:['vision','mission'] },
    structure: { title:'Struktur Organisasi', eyebrow:'DATA SEKOLAH', intro:'Kelola deskripsi dan bagan struktur organisasi.', fields:[['title','Judul'],['description','Deskripsi'],['chart_image_url','URL Gambar Bagan']], textareas:['description'] },
    principal: { title:'Kepala Sekolah', eyebrow:'DATA SEKOLAH', intro:'Kelola profil kepala sekolah yang akan ditampilkan pada website.', fields:[['name','Nama Lengkap'],['nip','NIP'],['nuptk','NUPTK'],['position','Jabatan'],['period','Periode Menjabat'],['photo_url','URL Foto'],['greeting','Sambutan Kepala Sekolah']], textareas:['greeting'] },
  }[module];
  const [data,setData]=useState(null); const [loading,setLoading]=useState(true); const [saving,setSaving]=useState(false);
  useEffect(()=>{ if(!config){setLoading(false);return;} let alive=true; fetchSingleSchoolData(module).then(x=>alive&&setData(x)).catch(e=>alert(e.message||'Gagal memuat data.')).finally(()=>alive&&setLoading(false)); return ()=>{alive=false}; },[module]);
  if(!config) return <Navigate to="/admin/data-sekolah" replace/>;
  async function save(){setSaving(true);try{const saved=await saveSingleSchoolData(module,data);setData(saved);await recordAudit(`Mengubah ${config.title.toLowerCase()}`,'Memperbarui data sekolah');alert('Data disimpan.');}catch(e){alert(e.message||'Gagal menyimpan.')}finally{setSaving(false)}}
  return <div className="page-stack"><div className="section-intro"><span className="eyebrow">{config.eyebrow}</span><h1>{config.title}</h1><p>{config.intro}</p></div><div className="admin-card form-card">{loading||!data?<div className="empty">Memuat data…</div>:<><div className="form-grid">{config.fields.map(([key,label])=> /_url$/.test(key)?<ImageField key={key} label={label.replace(/^URL /,'')} value={data[key]||''} onChange={(url)=>setData({...data,[key]:url})} folder="data-sekolah" wide/>:config.textareas.includes(key)?<label key={key}>{label}<textarea rows="8" value={data[key]||''} onChange={e=>setData({...data,[key]:e.target.value})}/></label>:<label key={key}>{label}<input value={data[key]||''} onChange={e=>setData({...data,[key]:e.target.value})}/></label>)}</div><div className="checks"><label><input type="checkbox" checked={data.status==='published'} onChange={e=>setData({...data,status:e.target.checked?'published':'draft'})}/> Publikasikan ke website</label></div><div className="form-actions"><Link className="admin-btn ghost" to="/admin/data-sekolah">Kembali</Link><button className="admin-btn primary" onClick={save} disabled={saving}>{saving?'Menyimpan…':'Simpan Data'}</button></div></>}</div></div>;
}

function FacilityManager() {
  const [items,setItems]=useState([]); const [loading,setLoading]=useState(true); const [edit,setEdit]=useState(null);
  async function load(){setLoading(true);try{setItems(await fetchCollection('facilities'))}catch(e){alert(e.message||'Gagal memuat fasilitas.')}finally{setLoading(false)}}
  useEffect(()=>{load()},[]);
  async function save(item){try{const saved=await saveCollectionItem('facilities',item);setItems(prev=>item.id?prev.map(x=>x.id===item.id?saved:x):[saved,...prev]);await recordAudit('Mengubah fasilitas sekolah',item.nama||'Fasilitas');setEdit(null)}catch(e){alert(e.message||'Gagal menyimpan.')}}
  async function remove(id){if(!confirm('Hapus fasilitas ini?'))return;try{await deleteCollectionItem('facilities',id);setItems(prev=>prev.filter(x=>x.id!==id));await recordAudit('Menghapus fasilitas sekolah','Fasilitas')}catch(e){alert(e.message||'Gagal menghapus.')}}
  const meta=collections.facilities;
  return <div className="page-stack"><div className="section-intro row"><div><span className="eyebrow">DATA SEKOLAH</span><h1>Fasilitas Sekolah</h1><p>Kelola fasilitas yang akan ditampilkan pada halaman publik.</p></div><button className="admin-btn primary" onClick={()=>setEdit({aktif:true,urutan:items.length})}>+ Tambah Fasilitas</button></div>{edit!==null&&<Form meta={meta} type="facilities" initial={edit} onCancel={()=>setEdit(null)} onSave={save}/>}<div className="admin-card table-card"><table><thead><tr><th>Fasilitas</th><th>Status</th><th>Urutan</th><th>Aksi</th></tr></thead><tbody>{loading?<tr><td colSpan="4" className="empty">Memuat data…</td></tr>:items.map(item=><tr key={item.id}><td><b>{item.nama}</b><small>{item.deskripsi||''}</small></td><td><span className={`status-chip ${item.aktif?'published':'draft'}`}>{item.aktif?'Aktif':'Nonaktif'}</span></td><td>{item.urutan??0}</td><td><button className="mini-btn" onClick={()=>setEdit(item)}>Edit</button><button className="mini-btn danger" onClick={()=>remove(item.id)}>Hapus</button></td></tr>)}{!loading&&!items.length&&<tr><td colSpan="4" className="empty">Belum ada fasilitas.</td></tr>}</tbody></table></div></div>;
}

function Profil() {
  const [data, setData] = useState(defaultSchoolSettings); const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false);
  const fields = [['name','Nama Resmi Sekolah'],['npsn','NPSN'],['nss','NSS'],['alamat','Alamat'],['kecamatan','Kecamatan'],['kabupaten','Kabupaten'],['provinsi','Provinsi'],['email','Email'],['telp','Telepon'],['website','Website'],['akreditasi','Akreditasi'],['kepalaSekolah','Kepala Sekolah'],['jumlahSiswa','Jumlah Peserta Didik (statistik beranda)']];
  const images = [['logo','Logo Sekolah (persegi, PNG)'],['heroImage','Foto Banner Beranda (lebar)'],['schoolImage','Foto Gedung Sekolah']];
  useEffect(() => { fetchSchoolSettings().then(setData).finally(() => setLoading(false)); }, []);
  async function save() { setSaving(true); try { await saveSchoolSettings(data); await recordAudit('Mengubah profil sekolah', 'Memperbarui identitas sekolah'); alert('Profil disimpan.'); } catch (e) { alert(e.message || 'Gagal menyimpan.'); } finally { setSaving(false); } }
  return <div className="page-stack"><div className="section-intro"><span className="eyebrow">DATA RESMI</span><h1>Profil Sekolah</h1><p>Sumber identitas resmi yang digunakan website publik.</p></div><div className="admin-card form-card">{loading ? <div className="empty">Memuat data…</div> : <><div className="form-grid">{fields.map(([key, label]) => <label key={key}>{label}<input type={key === 'jumlahSiswa' ? 'number' : 'text'} value={data[key] ?? ''} onChange={e => setData(prev => ({ ...prev, [key]: e.target.value }))}/></label>)}{images.map(([key, label]) => <ImageField key={key} label={label} value={data[key] || ''} onChange={(url) => setData(prev => ({ ...prev, [key]: url }))} folder="sekolah" wide />)}</div><div className="form-note">ℹ️ Masukkan hanya data yang memang akan dipublikasikan pada website sekolah.</div><button className="admin-btn primary" onClick={save} disabled={saving}>{saving ? 'Menyimpan…' : 'Simpan Profil Sekolah'}</button></>}</div></div>;
}

function Manager() {
  const { type } = useParams(); const meta = collections[type]; const [items, setItems] = useState([]); const [loading, setLoading] = useState(true); const [edit, setEdit] = useState(null);
  useEffect(() => { if (!meta) return; let alive = true; fetchCollection(type).then(data => alive && setItems(data)).catch(() => alive && setItems([])).finally(() => alive && setLoading(false)); return () => { alive = false; }; }, [type]);
  if (!meta) return <Navigate to="/admin" replace/>;
  async function save(item) { try { const saved = await saveCollectionItem(type, item); setItems(prev => item.id ? prev.map(x => x.id === item.id ? saved : x) : [saved, ...prev]); await recordAudit('Mengubah konten', `${meta.label}: ${item.judul || item.nama || 'item'}`); setEdit(null); } catch (e) { alert(e.message || 'Gagal menyimpan.'); } }
  async function remove(id) { if (!confirm('Hapus data ini?')) return; try { await deleteCollectionItem(type, id); setItems(prev => prev.filter(x => x.id !== id)); await recordAudit('Menghapus konten', meta.label); } catch (e) { alert(e.message || 'Gagal menghapus.'); } }
  return <div className="page-stack"><div className="section-intro row"><div><span className="eyebrow">MANAJEMEN KONTEN</span><h1>{meta.label}</h1><p>Kelola konten, status terbit, dan tampil di homepage.</p></div><button className="admin-btn primary" onClick={() => setEdit({})}>+ Tambah</button></div>{edit !== null && <Form meta={meta} type={type} initial={edit} onCancel={() => setEdit(null)} onSave={save}/>}<div className="admin-card table-card"><table><thead><tr><th>Konten</th><th>Status</th><th>Homepage</th><th>Aksi</th></tr></thead><tbody>{loading ? <tr><td colSpan="4" className="empty">Memuat data…</td></tr> : items.map(item => <tr key={item.id}><td><b>{item.judul || item.nama || item.tgl}</b><small>{item.kategori || item.kat || item.siswa || item.desk || ''}</small></td><td>{type === 'services' ? <span className={`status-chip ${item.aktif ? 'published' : 'draft'}`}>{item.aktif ? 'Aktif' : 'Nonaktif'}</span> : <span className={`status-chip ${item.terbit === false ? 'draft' : 'published'}`}>{item.terbit === false ? 'Draft' : 'Terbit'}</span>}</td><td>{type === 'services' ? '—' : item.homepage ? '✓' : '—'}</td><td><button className="mini-btn" onClick={() => setEdit(item)}>Edit</button><button className="mini-btn danger" onClick={() => remove(item.id)}>Hapus</button></td></tr>)}{!loading && !items.length && <tr><td colSpan="4" className="empty">Belum ada data.</td></tr>}</tbody></table></div></div>;
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
function validate(type, value) {
  const fields = fieldMap[type] || [];
  const title = fields[0];
  if (title && !String(value[title[0]] || '').trim()) return `${title[1]} wajib diisi.`;
  const bad = fields.find(([key, , t]) => t === 'date' && value[key] && !ISO_DATE.test(value[key]));
  if (bad) return `${bad[1]} belum valid. Pilih tanggal dari kalender.`;
  if (value.url && value.url !== '#' && !/^(https?:\/\/|\/)/i.test(value.url)) return 'URL harus diawali https:// atau /';
  return '';
}

function Form({ meta, type, initial, onCancel, onSave }) {
  // Data lama yang tanggalnya berupa teks (mis. "[Tanggal]") dikosongkan agar bisa dipilih ulang
  const [value, setValue] = useState(() => { const v = { ...initial }; (fieldMap[type] || []).forEach(([k, , t]) => { if (t === 'date' && v[k] && !ISO_DATE.test(v[k])) v[k] = ''; }); return v; });
  const [saving, setSaving] = useState(false);
  const fields = fieldMap[type] || [];
  const change = (key, v) => setValue(prev => ({ ...prev, [key]: v }));
  async function submit() { const problem = validate(type, value); if (problem) { alert(problem); return; } setSaving(true); try { await onSave(value); } finally { setSaving(false); } }
  return <div className="admin-card form-card"><div className="card-title"><div><span className="eyebrow">FORM DATA</span><h3>{initial.id ? 'Edit' : 'Tambah'} {meta.label}</h3></div></div><div className="form-grid">{fields.map((spec) => <Field key={spec[0]} spec={spec} value={value[spec[0]]} onChange={change} folder={type}/>)}</div>{type === 'services' || type === 'facilities' ? <div className="checks"><label><input type="checkbox" checked={value.aktif !== false} onChange={e => setValue(prev => ({ ...prev, aktif: e.target.checked }))}/> Aktif</label></div> : <div className="checks"><label><input type="checkbox" checked={value.terbit !== false} onChange={e => setValue(prev => ({ ...prev, terbit: e.target.checked }))}/> Terbit</label><label><input type="checkbox" checked={!!value.homepage} onChange={e => setValue(prev => ({ ...prev, homepage: e.target.checked }))}/> Tampil di homepage</label></div>}<div className="form-actions"><button className="admin-btn ghost" onClick={onCancel} disabled={saving}>Batal</button><button className="admin-btn primary" onClick={submit} disabled={saving}>{saving ? 'Menyimpan…' : 'Simpan'}</button></div></div>;
}

function Audit() {
  const [logs, setLogs] = useState([]); const [loading, setLoading] = useState(true);
  useEffect(() => { let alive = true; (async () => { if (isSupabaseConfigured) { const { supabase } = await import('../lib/supabase'); const { data } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(100); if (alive) setLogs(data || []); } else if (alive) setLogs(read('audit', [])); if (alive) setLoading(false); })(); return () => { alive = false; }; }, []);
  return <div className="page-stack"><div className="section-intro"><span className="eyebrow">JEJAK AKTIVITAS</span><h1>Audit Log</h1><p>Riwayat perubahan dari panel admin.</p></div><div className="admin-card table-card"><table><thead><tr><th>Waktu</th><th>Pengguna</th><th>Aksi</th><th>Detail</th></tr></thead><tbody>{loading ? <tr><td colSpan="4" className="empty">Memuat…</td></tr> : logs.map(item => <tr key={item.id}><td>{new Date(item.created_at || item.at).toLocaleString('id-ID')}</td><td>{item.actor || item.actor_id || 'Admin'}</td><td>{item.action}</td><td>{item.detail}</td></tr>)}{!loading && !logs.length && <tr><td colSpan="4" className="empty">Belum ada aktivitas.</td></tr>}</tbody></table></div></div>;
}

export default function AdminApp() {
  // Build produksi tanpa Supabase: jangan buka login demo (admin/admin123) ke publik
  if (import.meta.env.PROD && !isSupabaseConfigured) return <div className="admin-disabled"><div><span className="eyebrow">PANEL ADMIN</span><h1>Database belum terhubung</h1><p>Isi <code>VITE_SUPABASE_URL</code> dan <code>VITE_SUPABASE_ANON_KEY</code> di pengaturan Environment variables hosting, lalu deploy ulang.</p></div></div>;
  return <AdminRoot />;
}

function AdminRoot() {
  const [session, setSession] = useState(undefined);
  useEffect(() => { let alive = true; (async () => { try { const auth = await getAuthSession(); if (!alive) return; if (isSupabaseConfigured) { if (!auth) setSession(null); else { const { supabase } = await import('../lib/supabase'); const { data } = await supabase.from('user_roles').select('role').eq('user_id', auth.user.id).maybeSingle(); setSession(data ? { name: auth.user.email, role: data.role, userId: auth.user.id } : null); } } else setSession(read('session', null)); } catch { if (alive) setSession(null); } })(); return () => { alive = false; }; }, []);
  if (session === undefined) return <div className="admin-loading">Memuat panel admin…</div>;
  return <Routes><Route path="login" element={session ? <Navigate to="/admin" replace/> : <Login onLogin={setSession}/>}/><Route path="*" element={session ? <Layout session={session} onLogout={() => setSession(null)}/> : <Navigate to="/admin/login" replace/>}/></Routes>;
}
