import PageShell from "../components/PageShell";

export default function SejarahPage() {
  return (
    <PageShell
      title="Sejarah Sekolah"
      sub="Perjalanan dan perkembangan UPT SMPN 1 Baradatu"
    >
      <div className="history-page">
        <div className="breadcrumb" aria-label="Breadcrumb">
          <a href="/">Beranda</a>
          <span aria-hidden="true">›</span>
          <a href="/profil">Profil</a>
          <span aria-hidden="true">›</span>
          <span>Sejarah</span>
        </div>

        <section className="history-intro card">
          <div className="history-icon" aria-hidden="true">📖</div>
          <div>
            <span className="eyebrow">SEJARAH SEKOLAH</span>
            <h2>Perjalanan UPT SMPN 1 Baradatu</h2>
            <p>
              Informasi mengenai sejarah berdiri dan perkembangan sekolah akan
              ditampilkan setelah data resmi sekolah tersedia.
            </p>
          </div>
        </section>

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
      </div>
    </PageShell>
  );
}
