import PageShell from "../components/PageShell";

const categories = [
  ["01", "Kegiatan Sekolah", "Dokumentasi kegiatan dan aktivitas sekolah."],
  ["02", "Pembelajaran", "Video pembelajaran dan kegiatan akademik."],
  ["03", "Prestasi", "Dokumentasi pencapaian dan penghargaan sekolah."],
];

export default function VideoPage() {
  return (
    <PageShell title="Video" sub="Dokumentasi video kegiatan UPT SMPN 1 Baradatu">
      <div className="video-page">
        <div className="page-breadcrumb">
          <a href="/">Beranda</a><span aria-hidden="true">›</span><strong>Video</strong>
        </div>

        <section className="video-intro">
          <div>
            <span className="eyebrow">DOKUMENTASI SEKOLAH</span>
            <h2>Video Kegiatan</h2>
            <p>Dokumentasi video kegiatan, pembelajaran, prestasi, dan aktivitas sekolah dalam satu halaman yang mudah diakses.</p>
          </div>
          <div className="video-status">
            <span className="video-status-dot" aria-hidden="true"></span>
            <div><strong>Data video resmi</strong><small>Siap dilengkapi oleh admin/operator sekolah</small></div>
          </div>
        </section>

        <section className="video-panel">
          <div className="video-panel-head">
            <div><span className="eyebrow">KOLEKSI VIDEO</span><h2>Dokumentasi Video</h2></div>
            <span className="video-badge">Data resmi sekolah</span>
          </div>

          <div className="video-empty">
            <div className="video-play-icon" aria-hidden="true">▶</div>
            <h3>Belum Ada Video Resmi</h3>
            <p>Video dokumentasi resmi sekolah akan ditampilkan di sini setelah data dan tautan video dimasukkan oleh admin/operator sekolah.</p>
          </div>
        </section>

        <section className="video-categories">
          {categories.map(([num, title, desc]) => (
            <article className="video-category" key={num}>
              <div className="video-category-num">{num}</div>
              <div><h3>{title}</h3><p>{desc}</p></div>
            </article>
          ))}
        </section>

        <div className="video-note">
          <div className="video-note-icon">i</div>
          <div><h3>Catatan Pengelolaan Video</h3><p>Judul, thumbnail, kategori, tanggal, deskripsi, dan tautan video nantinya diisi menggunakan dokumentasi resmi sekolah. Placeholder yang tampil saat ini tidak mewakili video kegiatan tertentu.</p></div>
        </div>
      </div>
    </PageShell>
  );
}
