import Button from "../components/Button";
import { useSchoolData, useSchoolStats } from "../data/publicData";

export default function Hero() {
  const s = useSchoolData();
  const { stats } = useSchoolStats();
  return (
    <section className="hero" aria-labelledby="h1">
      <div className="heroimg" aria-hidden={s.heroImage ? undefined : "true"}>
        {s.heroImage ? (
          <img src={s.heroImage} alt="" fetchpriority="high" />
        ) : (
          <div className="hero-placeholder">
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

          {stats.length > 0 && <div className="stats" aria-label="Statistik sekolah">
            {stats.map(([value, label]) => (
              <div key={label} className="stat">
                <span className="stat-icon" aria-hidden="true">•</span>
                <div>
                  <b>{value}</b>
                  <span>{label}</span>
                </div>
              </div>
            ))}
          </div>}
        </div>
      </div>

      <div className="hero-arrow hero-arrow-left" aria-hidden="true">‹</div>
      <div className="hero-arrow hero-arrow-right" aria-hidden="true">›</div>
    </section>
  );
}
