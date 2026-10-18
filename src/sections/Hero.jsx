import Button from "../components/Button";
import { schoolData as s } from "../data/schoolData";

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="h1">
      <div className="heroimg" aria-hidden={s.heroImage ? undefined : "true"}>
        {s.heroImage ? (
          <img src={s.heroImage} alt="" />
        ) : (
          <div className="hero-placeholder">
            <span>Foto UPT SMPN 1 Baradatu</span>
            <small>Tambahkan foto sekolah pada schoolData.heroImage</small>
          </div>
        )}
      </div>

      <div className="hero-overlay" aria-hidden="true" />

      <div className="wrap hero-content">
        <div className="hero-copy">
          <small className="hero-kicker">SELAMAT DATANG DI</small>
          <h1 id="h1">{s.name}</h1>
          <p>
            Unggul dalam prestasi, berkarakter dalam sikap, adaptif terhadap
            perkembangan zaman.
          </p>

          <div className="cta">
            <Button href="#profil">Jelajahi Sekolah <span aria-hidden="true">→</span></Button>
            <Button variant="outline" to="/layanan-digital">
              <span aria-hidden="true">▣</span> Portal Digital
            </Button>
          </div>

          <div className="stats" aria-label="Statistik sekolah">
            {s.stats.map(([value, label]) => (
              <div key={label} className="stat">
                <span className="stat-icon" aria-hidden="true">•</span>
                <div>
                  <b>{value}</b>
                  <span>{label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="hero-arrow hero-arrow-left" aria-hidden="true">‹</div>
      <div className="hero-arrow hero-arrow-right" aria-hidden="true">›</div>
    </section>
  );
}
