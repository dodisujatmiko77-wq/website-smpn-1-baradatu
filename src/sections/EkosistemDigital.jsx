import Card from "../components/Card";
import { usePublicList } from "../data/publicData";
const hasUrl = (u) => u && u !== "#";
export default function EkosistemDigital({ bare }) {
  const { items } = usePublicList("services");
  return (
    <div>
      {!bare && <><h2>Ekosistem Digital Sekolah</h2><p style={{ color: "var(--mut)" }}>Akses berbagai layanan digital UPT SMPN 1 Baradatu dalam satu tempat.</p></>}
      <div className="svc">
        {items.map((d) => (
          <Card key={d.id || d.nama}><span className="ic" style={{ background: d.warna }} aria-hidden="true">{d.ikon}</span>
            <h3>{d.nama}</h3><p>{d.desk}</p>{hasUrl(d.url) ? (
              <a className="btn" style={{ background: d.warna }} href={d.url} target="_blank" rel="noopener noreferrer">{d.tombol}</a>
            ) : (
              <span className="btn digital-disabled" style={{ background: d.warna }} aria-disabled="true" title="Tautan resmi belum tersedia">Tautan Belum Tersedia</span>
            )}</Card>
        ))}
      </div>
    </div>
  );
}
