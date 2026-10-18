import Card from "../components/Card";
import { digitalServices } from "../data/digitalServices";
import { useSiteValue } from "../data/siteStore";
export default function EkosistemDigital({ bare }) {
  const items = useSiteValue("services", digitalServices);
  return (
    <div>
      {!bare && <><h2>Ekosistem Digital Sekolah</h2><p style={{ color: "var(--mut)" }}>Akses berbagai layanan digital UPT SMPN 1 Baradatu dalam satu tempat.</p></>}
      <div className="svc">
        {items.filter(d=>d.aktif!==false).map((d) => (
          <Card key={d.nama}><span className="ic" style={{ background: d.warna }} aria-hidden="true">{d.ikon}</span>
            <h3>{d.nama}</h3><p>{d.desk}</p>{d.url === "#" ? (
              <span className="btn digital-disabled" style={{ background: d.warna }} aria-disabled="true" title="Tautan resmi belum tersedia">Tautan Belum Tersedia</span>
            ) : (
              <a className="btn" style={{ background: d.warna }} href={d.url}>{d.tombol}</a>
            )}</Card>
        ))}
      </div>
    </div>
  );
}
