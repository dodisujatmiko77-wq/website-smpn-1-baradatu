import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";
import { useHistory } from "../data/publicData";

export default function SejarahPage() {
  const h = useHistory();
  const has = h.paragraphs.length > 0;
  return (
    <PageShell
      title="Sejarah Sekolah"
      sub="Perjalanan dan perkembangan UPT SMPN 1 Baradatu"
    >
      <div className="history-page">
        <div className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Beranda</Link>
          <span aria-hidden="true">›</span>
          <Link to="/profil">Profil</Link>
          <span aria-hidden="true">›</span>
          <span>Sejarah</span>
        </div>

        <section className="history-intro card">
          <div className="history-icon" aria-hidden="true">📖</div>
          <div>
            <span className="eyebrow">SEJARAH SEKOLAH</span>
            <h2>Perjalanan UPT SMPN 1 Baradatu</h2>
            <p>
              {has ? "Sejarah berdiri dan perkembangan UPT SMPN 1 Baradatu." : "Informasi mengenai sejarah berdiri dan perkembangan sekolah akan ditampilkan setelah data resmi sekolah tersedia."}
            </p>
          </div>
        </section>

        {has ? (
          <section className="history-content card">
            <h2>{h.title}</h2>
            {h.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </section>
        ) : <>
        <section className="history-empty card">
          <div className="history-empty-icon" aria-hidden="true">◷</div>
          <div>
            <h2>Data sejarah belum tersedia</h2>
            <p>
              Narasi sejarah resmi UPT SMPN 1 Baradatu akan ditampilkan di bagian
              ini setelah admin/operator memasukkan data resmi sekolah.
            </p>
          </div>
        </section>

        <div className="history-highlights">
          <article className="history-highlight card">
            <span className="history-number">01</span>
            <h3>Tahun Berdiri</h3>
            <p>Data tahun berdiri sekolah belum diisi.</p>
          </article>
          <article className="history-highlight card">
            <span className="history-number">02</span>
            <h3>Perkembangan Sekolah</h3>
            <p>Riwayat perkembangan sekolah akan ditampilkan setelah data resmi tersedia.</p>
          </article>
          <article className="history-highlight card">
            <span className="history-number">03</span>
            <h3>Dokumentasi Sejarah</h3>
            <p>Dokumentasi dan foto bersejarah sekolah dapat ditambahkan pada tahap pengisian data.</p>
          </article>
        </div>
        </>}
      </div>
    </PageShell>
  );
}
