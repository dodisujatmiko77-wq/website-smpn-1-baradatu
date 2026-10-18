import { useEffect } from "react";
import Photo from "./Photo";
export default function Lightbox({ item, onClose }) {
  useEffect(() => {
    const k = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [onClose]);
  if (!item) return null;
  return (
    <div id="lb" className="on" role="dialog" aria-label="Foto galeri" onClick={onClose}>
      <button aria-label="Tutup" onClick={onClose}>×</button>
      <Photo src={item.foto} alt={item.judul} />
    </div>
  );
}
