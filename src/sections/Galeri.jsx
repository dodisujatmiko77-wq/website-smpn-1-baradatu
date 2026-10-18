import { useState } from "react";
import Photo from "../components/Photo";
import Lightbox from "../components/Lightbox";
import SectionHead from "../components/SectionHead";
import { galleryCats, galleryData } from "../data/galleryData";
import { useSiteValue } from "../data/siteStore";
export default function Galeri({ bare }) {
  const items = useSiteValue("gallery", galleryData);
  const [cur, setCur] = useState("Semua"), [sel, setSel] = useState(null);
  return (
    <div>
      {!bare && <SectionHead title="Galeri Kegiatan" to="/galeri" />}
      <div className="filt" role="group" aria-label="Filter galeri">
        {galleryCats.map((c) => <button key={c} className={c === cur ? "on" : ""} aria-pressed={c === cur} onClick={() => setCur(c)}>{c}</button>)}
      </div>
      <div className="gal">
        {items.filter((g) => cur === "Semua" || g.kat === cur).map((g, i) => (
          <button key={i} aria-label={`Buka ${g.judul}`} onClick={() => setSel(g)}><Photo src={g.foto} alt={g.judul} /></button>
        ))}
      </div>
      <Lightbox item={sel} onClose={() => setSel(null)} />
    </div>
  );
}
