import Card from "../components/Card";
import { schoolData as s } from "../data/schoolData";

const isPlaceholderVisi = !s.visi || /^\[.*\]$/.test(s.visi.trim());
const hasOfficialMisi = Array.isArray(s.misi) && s.misi.length > 0 && s.misi.some(([, text]) => text && !/^\[.*\]$/.test(text.trim()));

export default function VisiMisi() {
  return (
    <>
      <div className="visi-intro">
        <span className="visi-kicker">ARAH PENDIDIKAN</span>
        <h2>Visi &amp; Misi</h2>
        <p>
          Landasan dan arah pengembangan UPT SMPN 1 Baradatu dalam membangun
          peserta didik yang berkarakter, berprestasi, dan adaptif.
        </p>
        <a className="visi-link" href="/profil/visi-misi">Lihat selengkapnya <span aria-hidden="true">→</span></a>
      </div>

      <Card className="visi-card">
        <span className="visi-number">01</span>
        <div className="visi-icon" aria-hidden="true">◎</div>
        <h3>Visi</h3>
        <p className="visi-content">
          {isPlaceholderVisi
            ? "Visi resmi sekolah akan ditampilkan setelah data resmi dimasukkan."
            : s.visi}
        </p>
      </Card>

      <Card className="misi-card">
        <div className="misi-head">
          <span className="visi-number">02</span>
          <span className="misi-status">{hasOfficialMisi ? `${s.misi.length} fokus` : "Data belum tersedia"}</span>
        </div>
        <h3>Misi</h3>
        {hasOfficialMisi ? (
          <div className="misi">
            {s.misi.map(([icon, text], index) => (
              <div key={`${text}-${index}`}>
                <span className="misi-index">{String(index + 1).padStart(2, "0")}</span>
                <i aria-hidden="true">{icon}</i>
                <span>{text}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="misi-empty">
            <strong>Misi resmi sekolah</strong>
            <span>Data misi akan ditampilkan setelah admin/operator memasukkan data resmi sekolah.</span>
          </div>
        )}
      </Card>
    </>
  );
}
