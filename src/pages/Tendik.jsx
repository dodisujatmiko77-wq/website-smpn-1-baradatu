import { useMemo, useState } from "react";
import PageShell from "../components/PageShell";
import Photo from "../components/Photo";
import { teacherData } from "../data/teacherData";

function ProfileModal({ person, onClose }) {
  if (!person) return null;
  return <div className="gtk-modal-backdrop" onClick={onClose}><div className="gtk-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Profil tenaga kependidikan">
    <button className="gtk-modal-close" onClick={onClose} aria-label="Tutup">×</button>
    <div className="gtk-modal-photo"><Photo src={person.foto} alt="Foto tenaga kependidikan" /></div>
    <div className="gtk-modal-body"><span className="eyebrow">PROFIL TENAGA KEPENDIDIKAN</span><h2>{person.nama}</h2>
      <dl className="gtk-detail-list"><div><dt>Jabatan</dt><dd>{person.jabatan}</dd></div><div><dt>NIP / NUPTK</dt><dd>{person.nip || "—"}</dd></div><div><dt>Status Kepegawaian</dt><dd>{person.status || "—"}</dd></div></dl>
      <div className="gtk-detail-note">Data resmi GTK akan dilengkapi oleh admin/operator sekolah.</div>
    </div>
  </div></div>;
}

export default function TendikPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Semua Jabatan");
  const [selected, setSelected] = useState(null);
  const roles = useMemo(() => ["Semua Jabatan", ...new Set(teacherData.tendik.map((g) => g.jabatan).filter(Boolean))], []);
  const list = useMemo(() => teacherData.tendik.filter((g) => g.nama.toLowerCase().includes(query.toLowerCase()) && (filter === "Semua Jabatan" || g.jabatan === filter)), [query, filter]);

  return <PageShell title="Tenaga Kependidikan" sub="Profil dan informasi tenaga kependidikan UPT SMPN 1 Baradatu">
    <div className="gtk-page">
      <div className="gtk-intro"><div><span className="eyebrow">GTK • TENAGA KEPENDIDIKAN</span><h2>Profil Tenaga Kependidikan</h2><p>Informasi tenaga kependidikan disajikan secara ringkas dan mudah dicari. Data resmi akan dikelola dan diperbarui oleh admin/operator sekolah.</p></div><div className="gtk-status"><span className="gtk-status-dot" /><div><strong>Data resmi siap dilengkapi</strong><span>Profil GTK dikelola sekolah</span></div></div></div>
      <div className="gtk-toolbar"><label className="gtk-search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari nama tenaga kependidikan..." /></label><select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter jabatan">{roles.map((s) => <option key={s}>{s}</option>)}</select></div>
      <div className="gtk-grid">{list.map((g, i) => <article className="gtk-card" key={i}><Photo src={g.foto} alt="Foto tenaga kependidikan" /><div className="gtk-card-body"><span className="gtk-role">TENAGA KEPENDIDIKAN</span><h3>{g.nama}</h3><p>{g.jabatan}</p><button className="gtk-profile-btn" onClick={() => setSelected(g)}>Lihat Profil <span>→</span></button></div></article>)}</div>
      <div className="gtk-note"><strong>Informasi resmi GTK</strong><span>Nama, foto, NIP/NUPTK, status kepegawaian, dan jabatan akan diisi setelah data resmi sekolah tersedia.</span></div>
    </div><ProfileModal person={selected} onClose={() => setSelected(null)} />
  </PageShell>;
}
