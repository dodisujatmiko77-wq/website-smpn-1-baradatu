import PageShell from "../components/PageShell";
import Photo from "../components/Photo";
import { newsData } from "../data/newsData";

export default function BeritaPage() {
  const items = newsData || [];
  return (
    <PageShell title="Berita" sub="Informasi dan kegiatan terkini UPT SMPN 1 Baradatu">
      <div className="page-breadcrumb"><a href="/">Beranda</a><span>›</span><span>Berita</span></div>

      <div className="news-intro">
        <div>
          <div className="eyebrow">INFORMASI SEKOLAH</div>
          <h2>Berita & Kegiatan Sekolah</h2>
          <p>Ruang informasi untuk menyampaikan berita, kegiatan, prestasi, dan perkembangan terbaru UPT SMPN 1 Baradatu.</p>
        </div>
        <div className="news-status">Data resmi siap diisi oleh admin/operator sekolah.</div>
      </div>

      {items.length ? (
        <div className="news-page-grid">
          {items.map((item, index) => {
            const isPlaceholder = !item.judul || item.judul.includes("[Judul") || item.ringkasan?.includes("[Ringkasan");
            return (
              <article className="news-page-card" key={index}>
                <Photo src={item.foto} alt="Foto berita sekolah" />
                <div className="news-page-body">
                  <div className="news-page-meta">
                    <span className="news-category">{item.kategori}</span>
                    <span>{item.tanggal}</span>
                  </div>
                  <h3>{isPlaceholder ? "Berita sekolah akan ditampilkan di sini" : item.judul}</h3>
                  <p>{isPlaceholder ? "Data berita resmi belum tersedia. Konten dapat ditambahkan melalui pengelolaan data sekolah." : item.ringkasan}</p>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="news-empty">
          <div className="news-empty-icon">📰</div>
          <h3>Belum ada berita</h3>
          <p>Berita resmi sekolah akan tampil di halaman ini setelah data dimasukkan oleh admin/operator.</p>
        </div>
      )}
    </PageShell>
  );
}
