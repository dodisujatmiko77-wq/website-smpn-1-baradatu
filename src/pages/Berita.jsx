import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";
import Photo from "../components/Photo";
import { usePublicList } from "../data/publicData";

export default function BeritaPage() {
  const { items: all, loading } = usePublicList("news");
  const items = all.filter((n) => !n.sample);
  return (
    <PageShell title="Berita" sub="Informasi dan kegiatan terkini UPT SMPN 1 Baradatu">
      <div className="page-breadcrumb"><Link to="/">Beranda</Link><span>›</span><span>Berita</span></div>

      <div className="news-intro">
        <div>
          <div className="eyebrow">INFORMASI SEKOLAH</div>
          <h2>Berita & Kegiatan Sekolah</h2>
          <p>Ruang informasi untuk menyampaikan berita, kegiatan, prestasi, dan perkembangan terbaru UPT SMPN 1 Baradatu.</p>
        </div>
        <div className="news-status">{items.length ? `${items.length} berita diterbitkan` : "Data resmi siap diisi oleh admin/operator sekolah."}</div>
      </div>

      {items.length ? (
        <div className="news-page-grid">
          {items.map((item) => (
            <article className="news-page-card" key={item.id}>
              <Link to={`/berita/${item.id}`} tabIndex={-1} aria-hidden="true"><Photo src={item.foto} alt={item.judul} /></Link>
              <div className="news-page-body">
                <div className="news-page-meta">
                  {item.kategori && <span className="news-category">{item.kategori}</span>}
                  <span>{item.tanggalLabel}</span>
                </div>
                <h3><Link to={`/berita/${item.id}`}>{item.judul}</Link></h3>
                <p>{item.ringkasan}</p>
                <Link className="more" to={`/berita/${item.id}`}>Baca Selengkapnya</Link>
              </div>
            </article>
          ))}
        </div>
      ) : !loading && (
        <div className="news-empty">
          <div className="news-empty-icon">📰</div>
          <h3>Belum ada berita</h3>
          <p>Berita resmi sekolah akan tampil di halaman ini setelah data dimasukkan oleh admin/operator.</p>
        </div>
      )}
    </PageShell>
  );
}
