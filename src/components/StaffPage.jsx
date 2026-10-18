import { useMemo, useState } from "react";
import PageShell from "./PageShell";
import Photo from "./Photo";
import { useStaff } from "../data/staffStore";

const DETAILS = [["Jabatan", "jabatan"], ["Mata Pelajaran", "mapel"], ["NIP", "nip"], ["NUPTK", "nuptk"], ["Jenis Kelamin", "gender"],
  ["Tempat, Tanggal Lahir", "ttl"], ["Status Kepegawaian", "status"], ["Pendidikan Terakhir", "education"], ["Email", "email"], ["Telepon", "phone"]];

function ProfileModal({ person, label, onClose }) {
  if (!person) return null;
  const rows = DETAILS.filter(([, k]) => person[k]);
  return (
    <div className="gtk-modal-backdrop" onClick={onClose}>
      <div className="gtk-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={`Profil ${label}`}>
        <button className="gtk-modal-close" onClick={onClose} aria-label="Tutup">×</button>
        <div className="gtk-modal-photo"><Photo src={person.foto} alt={`Foto ${label}`} /></div>
        <div className="gtk-modal-body">
          <span className="eyebrow">PROFIL {label.toUpperCase()}</span>
          <h2>{person.nama}</h2>
          {rows.length > 0 && <dl className="gtk-detail-list">{rows.map(([l, k]) => <div key={k}><dt>{l}</dt><dd>{person[k]}</dd></div>)}</dl>}
          {person.bio && <p style={{ whiteSpace: "pre-line" }}>{person.bio}</p>}
        </div>
      </div>
    </div>
  );
}

// kind: "guru" | "tendik" — data berasal dari modul GTK di admin
export default function StaffPage({ kind }) {
  const isGuru = kind === "guru";
  const label = isGuru ? "guru" : "tenaga kependidikan";
  const allLabel = isGuru ? "Semua Mata Pelajaran" : "Semua Jabatan";
  const { list: all, loading } = useStaff(kind);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState(allLabel);
  const [selected, setSelected] = useState(null);
  const key = isGuru ? "mapel" : "jabatan";
  const groups = useMemo(() => [allLabel, ...new Set(all.map((g) => g[key]).filter(Boolean))], [all, allLabel, key]);
  const list = useMemo(() => all.filter((g) => g.nama.toLowerCase().includes(query.toLowerCase()) && (filter === allLabel || g[key] === filter)), [all, query, filter, allLabel, key]);
  return (
    <PageShell title={isGuru ? "Guru" : "Tenaga Kependidikan"} sub={`Profil dan informasi ${label} UPT SMPN 1 Baradatu`}>
      <div className="gtk-page">
        <div className="gtk-intro">
          <div><span className="eyebrow">GTK • {label.toUpperCase()}</span><h2>Profil {isGuru ? "Guru" : "Tenaga Kependidikan"}</h2>
            <p>Temukan informasi {label} berdasarkan nama dan {isGuru ? "mata pelajaran" : "jabatan"}.</p></div>
        </div>
        <div className="gtk-toolbar">
          <label className="gtk-search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Cari nama ${label}...`} /></label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter">{groups.map((s) => <option key={s}>{s}</option>)}</select>
        </div>
        {!loading && all.length === 0 && <div className="gtk-note"><strong>Data belum tersedia</strong><span>Data {label} akan tampil di sini setelah dipublikasikan oleh admin sekolah.</span></div>}
        <div className="gtk-grid">
          {list.map((g) => (
            <article className="gtk-card" key={g.id}>
              <Photo src={g.foto} alt={`Foto ${label}`} />
              <div className="gtk-card-body"><span className="gtk-role">{isGuru ? "GURU" : "TENDIK"}</span><h3>{g.nama}</h3><p>{g[key]}</p>
                <button className="gtk-profile-btn" onClick={() => setSelected(g)}>Lihat Profil <span>→</span></button></div>
            </article>
          ))}
        </div>
      </div>
      <ProfileModal person={selected} label={label} onClose={() => setSelected(null)} />
    </PageShell>
  );
}
