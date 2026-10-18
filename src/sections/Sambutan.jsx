import Photo from "../components/Photo";
import Button from "../components/Button";
import { usePrincipal } from "../data/publicData";
const excerpt = (t, n = 320) => (t.length > n ? `${t.slice(0, n).replace(/\s+\S*$/, "")}…` : t);
export default function Sambutan() {
  const p = usePrincipal();
  return (
    <div>
      <h2>Sambutan Kepala Sekolah</h2>
      <div className="sam" style={{ marginTop: 16 }}>
        <Photo src={p.photo} alt={p.official ? `Foto ${p.nama}` : "Foto Kepala Sekolah"} />
        <div><b>{p.nama}</b><br /><small className="date">{p.jabatan}</small><p style={{ whiteSpace: "pre-line" }}>{excerpt(p.sambutan || "")}</p>
          <Button variant="primary" to="/profil/kepala-sekolah">Baca Selengkapnya</Button></div>
      </div>
    </div>
  );
}
