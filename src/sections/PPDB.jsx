import Button from "../components/Button";
import { usePpdb } from "../data/settingsStore";
export default function PPDB() {
  const p = usePpdb();
  return (
    <div className="ppdb" id="ppdb">
      <h2>Penerimaan Peserta Didik Baru</h2>
      <p style={{ margin: 0 }}>Bergabunglah bersama kami untuk meraih masa depan yang lebih baik.</p>
      <span className={`st ${p.dibuka ? "" : "off"}`}>{p.dibuka ? "PPDB Dibuka" : "PPDB Belum Dibuka"}</span>
      <div className="cta">
        {p.dibuka && <Button to={p.url}>Daftar Sekarang</Button>}
        <Button variant="outline" to={p.infoUrl}>Informasi Lengkap</Button>
      </div>
    </div>
  );
}
