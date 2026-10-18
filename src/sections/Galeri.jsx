import { useState } from "react";
import Photo from "../components/Photo";
import Lightbox from "../components/Lightbox";
import SectionHead from "../components/SectionHead";
import { galleryCats } from "../data/galleryData";
import { usePublicList } from "../data/publicData";
export default function Galeri({ bare, home = true }) {
  const { items, loading } = usePublicList("gallery", home ? { home: true, limit: 10 } : {});
  const [cur, setCur] = useState("Semua"), [sel, setSel] = useState(null);
  const shown = items.filter((g) => cur === "Semua" || g.kat === cur);
  return (
    <div>
      {!bare && <SectionHead title="Galeri Kegiatan" to="/galeri" />}
      <div className="filt" role="group" aria-label="Filter galeri">
        {galleryCats.map((c) => <button key={c} className={c === cur ? "on" : ""} aria-pressed={c === cur} onClick={() => setCur(c)}>{c}</button>)}
      </div>
      <div className="gal">
        {shown.map((g, i) => (
          <button key={g.id || i} aria-label={`Buka ${g.judul}`} onClick={() => setSel(g)}><Photo src={g.foto} alt={g.judul} /></button>
        ))}
      </div>
      {!loading && !shown.length && <p className="home-empty">Belum ada foto{cur !== "Semua" ? ` untuk kategori ${cur}` : ""}.</p>}
      <Lightbox item={sel} onClose={() => setSel(null)} />
    </div>
  );
}
