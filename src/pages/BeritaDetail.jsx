import { Link, useParams } from "react-router-dom";
import PageShell from "../components/PageShell";
import Photo from "../components/Photo";
import { usePublicItem, usePublicList } from "../data/publicData";

export function BeritaParagraphs({ text }) {
  return String(text || "").split(/\n\s*\n/).filter((p) => p.trim()).map((p, i) => <p key={i} style={{ whiteSpace: "pre-line" }}>{p.trim()}</p>);
}

export function NotFoundBlock({ title, back, backLabel }) {
  return (
    <div className="news-empty">
      <div className="news-empty-icon">🔍</div>
      <h3>{title}</h3>
      <p>Konten ini tidak ditemukan atau sudah tidak diterbitkan.</p>
      <p><Link className="more" to={back}>{backLabel}</Link></p>
    </div>
  );
}

export default function BeritaDetail() {
  const { id } = useParams();
  const { item, loading } = usePublicItem("news", id);
  const { items: others } = usePublicList("news");
  const related = others.filter((n) => !n.sample && String(n.id) !== String(id)).slice(0, 3);

  if (loading) return <PageShell title="Berita" sub="Memuat berita…"><p className="detail-loading">Memuat…</p></PageShell>;
  if (!item) return <PageShell title="Berita" sub="Berita tidak ditemukan" noindex><NotFoundBlock title="Berita tidak ditemukan" back="/berita" backLabel="Kembali ke daftar berita" /></PageShell>;

  const share = encodeURIComponent(`${item.judul} ${window.location.href}`);
  return (
    <PageShell title={item.judul} sub={item.ringkasan || "Berita UPT SMPN 1 Baradatu"} image={item.foto} type="article">
      <div className="page-breadcrumb"><Link to="/">Beranda</Link><span>›</span><Link to="/berita">Berita</Link><span>›</span><span>{item.judul}</span></div>
      <div className="detail-layout">
        <article className="detail-article card">
          <div className="news-page-meta">
            {item.kategori && <span className="news-category">{item.kategori}</span>}
            {item.tanggalLabel && <time dateTime={item.tanggal}>{item.tanggalLabel}</time>}
          </div>
          {item.foto && <Photo className="detail-cover" src={item.foto} alt={item.judul} />}
          <div className="detail-body">
            {item.content ? <BeritaParagraphs text={item.content} /> : <p>{item.ringkasan}</p>}
          </div>
          <div className="detail-share">
            <span>Bagikan:</span>
            <a href={`https://wa.me/?text=${share}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer">Facebook</a>
          </div>
          <Link className="more" to="/berita">← Kembali ke daftar berita</Link>
        </article>
        {related.length > 0 && (
          <aside className="detail-aside card">
            <h2>Berita Lainnya</h2>
            <ul>{related.map((n) => <li key={n.id}><Link to={`/berita/${n.id}`}>{n.judul}</Link><small>{n.tanggalLabel}</small></li>)}</ul>
          </aside>
        )}
      </div>
    </PageShell>
  );
}
