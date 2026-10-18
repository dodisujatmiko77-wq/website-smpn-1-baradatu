import { useMemo, useState } from "react";
import PageShell from "../components/PageShell";
import Photo from "../components/Photo";
import { teacherData } from "../data/teacherData";

function ProfileModal({ person, type, onClose }) {
  if (!person) return null;
  const isGuru = type === "guru";
  return (
    <div className="gtk-modal-backdrop" onClick={onClose}>
      <div className="gtk-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={`Profil ${isGuru ? "guru" : "tenaga kependidikan"}`}>
        <button className="gtk-modal-close" onClick={onClose} aria-label="Tutup">×</button>
        <div className="gtk-modal-photo"><Photo src={person.foto} alt={isGuru ? "Foto guru" : "Foto tenaga kependidikan"} /></div>
        <div className="gtk-modal-body">
          <span className="eyebrow">PROFIL {isGuru ? "GURU" : "TENAGA KEPENDIDIKAN"}</span>
          <h2>{person.nama}</h2>
          <dl className="gtk-detail-list">
            {isGuru ? <>
              <div><dt>Mata Pelajaran</dt><dd>{person.mapel}</dd></div>
              <div><dt>NIP / NUPTK</dt><dd>{person.nip || "—"}</dd></div>
              <div><dt>Status Kepegawaian</dt><dd>{person.status || "—"}</dd></div>
              <div><dt>Jabatan / Tugas</dt><dd>{person.jabatan || "—"}</dd></div>
            </> : <>
              <div><dt>Jabatan</dt><dd>{person.jabatan}</dd></div>
              <div><dt>NIP / NUPTK</dt><dd>{person.nip || "—"}</dd></div>
              <div><dt>Status Kepegawaian</dt><dd>{person.status || "—"}</dd></div>
            </>}
          </dl>
          <div className="gtk-detail-note">Data resmi GTK akan dilengkapi oleh admin/operator sekolah.</div>
        </div>
      </div>
    </div>
  );
}

export default function GuruPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Semua Mata Pelajaran");
  const [selected, setSelected] = useState(null);
  const subjects = useMemo(() => ["Semua Mata Pelajaran", ...new Set(teacherData.guru.map((g) => g.mapel).filter(Boolean))], []);
  const list = useMemo(() => teacherData.guru.filter((g) => g.nama.toLowerCase().includes(query.toLowerCase()) && (filter === "Semua Mata Pelajaran" || g.mapel === filter)), [query, filter]);

  return <PageShell title="Guru" sub="Profil dan informasi guru UPT SMPN 1 Baradatu">
    <div className="gtk-page">
      <div className="gtk-intro">
        <div><span className="eyebrow">GTK • GURU</span><h2>Profil Guru</h2><p>Temukan informasi guru berdasarkan nama dan mata pelajaran. Data resmi akan dikelola dan diperbarui oleh admin/operator sekolah.</p></div>
        <div className="gtk-status"><span className="gtk-status-dot" /> <div><strong>Data resmi siap dilengkapi</strong><span>Profil GTK dikelola sekolah</span></div></div>
      </div>
      <div className="gtk-toolbar">
        <label className="gtk-search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari nama guru..." /></label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter mata pelajaran">{subjects.map((s) => <option key={s}>{s}</option>)}</select>
      </div>
      <div className="gtk-grid">
        {list.map((g, i) => <article className="gtk-card" key={i}><Photo src={g.foto} alt="Foto guru" /><div className="gtk-card-body"><span className="gtk-role">GURU</span><h3>{g.nama}</h3><p>{g.mapel}</p><button className="gtk-profile-btn" onClick={() => setSelected(g)}>Lihat Profil <span>→</span></button></div></article>)}
      </div>
      <div className="gtk-note"><strong>Informasi resmi GTK</strong><span>Nama, foto, NIP/NUPTK, status kepegawaian, mata pelajaran, dan tugas tambahan akan diisi setelah data resmi sekolah tersedia.</span></div>
    </div>
    <ProfileModal person={selected} type="guru" onClose={() => setSelected(null)} />
  </PageShell>;
}
