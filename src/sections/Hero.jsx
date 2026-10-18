import { useEffect, useRef, useState } from "react";
import Button from "../components/Button";
import { motto } from "../data/schoolData";
import { useSchoolData, useSchoolStats } from "../data/publicData";

const ICONS = {
  "Peserta Didik": <path d="M12 3 2 8l10 5 10-5-10-5Zm-6 7.2V15c0 1.7 2.7 3.5 6 3.5s6-1.8 6-3.5v-4.8l-6 3-6-3ZM21 9v6" />,
  "Guru & Tendik": <><circle cx="9" cy="7" r="3.2" /><path d="M3 20c0-3.4 2.7-6 6-6s6 2.6 6 6M16 4.5a3 3 0 0 1 0 5.8M18 14.3c1.8.7 3 2.6 3 5.7" /></>,
  "Kegiatan": <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18M8 14h3" /></>,
  "Prestasi": <><path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" /><path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M12 14v4M8 21h8M9.5 18h5" /></>,
};

// Angka naik perlahan saat pertama tampil (dilewati jika pengguna memilih kurangi animasi)
function CountUp({ value }) {
  const target = Number(value) || 0;
  const [n, setN] = useState(target);
  const done = useRef(false);
  useEffect(() => {
    if (done.current || !target || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setN(target); return undefined; }
    done.current = true;
    let raf; const start = performance.now(); const dur = 1100;
    const tick = (t) => { const k = Math.min(1, (t - start) / dur); setN(Math.round(target * (1 - Math.pow(1 - k, 3)))); if (k < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return n.toLocaleString("id-ID");
}

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
          <div className="hero-motto" aria-label={`Motto sekolah: JUARA, ${motto.join(", ")}`}>
            <span className="hero-motto-label">Motto Sekolah <b>JUARA</b></span>
            <ul aria-hidden="true">
              {motto.map((w) => <li key={w}><b>{w[0]}</b>{w.slice(1)}</li>)}
            </ul>
          </div>

          <div className="cta">
            <Button href="#profil">Jelajahi Sekolah <span aria-hidden="true">→</span></Button>
            <Button variant="outline" to="/layanan-digital">
              <span aria-hidden="true">▣</span> Portal Digital
            </Button>
          </div>

          {stats.length > 0 && <div className="stats" aria-label="Statistik sekolah">
            {stats.map(([value, label]) => (
              <div key={label} className="stat">
                <span className="stat-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{ICONS[label]}</svg>
                </span>
                <div>
                  <b><CountUp value={value} /></b>
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
