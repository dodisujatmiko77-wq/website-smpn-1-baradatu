import { Link } from "react-router-dom";
import { motto } from "../data/schoolData";
import { useVisionMission } from "../data/publicData";

export default function VisiMisi() {
  const s = useVisionMission();
  const hasVisi = Boolean(s.visi);
  const hasMisi = s.misi.length > 0;
  return (
    <>
      <div className="vm-intro">
        <span className="vm-kicker">ARAH PENDIDIKAN</span>
        <h2>Visi &amp; Misi</h2>
        <p>Landasan dan arah pengembangan UPT SMPN 1 Baradatu dalam membangun peserta didik yang berkarakter dan berprestasi.</p>
        <div className="vm-motto" aria-label={`Motto JUARA: ${motto.join(", ")}`}>
          {motto.map((w) => <span key={w} title={w}>{w[0]}</span>)}
        </div>
        <Link className="vm-link" to="/profil/visi-misi">Lihat selengkapnya <span aria-hidden="true">→</span></Link>
      </div>

      <div className="vm-body">
        <article className={`vm-visi${hasVisi ? "" : " is-empty"}`}>
          <div className="vm-label"><span className="vm-badge" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" fill="currentColor" /></svg>
          </span>VISI</div>
          <blockquote>{hasVisi ? s.visi : "Visi resmi sekolah akan ditampilkan setelah data dimasukkan oleh admin/operator."}</blockquote>
        </article>

        <article className="vm-misi">
          <div className="vm-misi-head">
            <div className="vm-label"><span className="vm-badge" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" /></svg>
            </span>MISI</div>
            {hasMisi && <span className="vm-count">{s.misi.length} butir</span>}
          </div>
          {hasMisi ? (
            <ol className="vm-list">
              {s.misi.map(([, text], i) => (
                <li key={`${i}-${text}`}><span className="vm-num">{String(i + 1).padStart(2, "0")}</span><span>{text}</span></li>
              ))}
            </ol>
          ) : (
            <p className="vm-empty">Butir misi resmi akan ditampilkan setelah data dimasukkan oleh admin/operator.</p>
          )}
        </article>
      </div>
    </>
  );
}
