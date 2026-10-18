import { Link, useParams } from "react-router-dom";
import PageShell from "../components/PageShell";
import Badge from "../components/Badge";
import { usePublicItem } from "../data/publicData";
import { BeritaParagraphs, NotFoundBlock } from "./BeritaDetail";

export default function PengumumanDetail() {
  const { id } = useParams();
  const { item, loading } = usePublicItem("announcements", id);
  if (loading) return <PageShell title="Pengumuman" sub="Memuat pengumuman…"><p className="detail-loading">Memuat…</p></PageShell>;
  if (!item) return <PageShell title="Pengumuman" sub="Pengumuman tidak ditemukan" noindex><NotFoundBlock title="Pengumuman tidak ditemukan" back="/pengumuman" backLabel="Kembali ke daftar pengumuman" /></PageShell>;
  return (
    <PageShell title={item.judul} sub={`Pengumuman resmi UPT SMPN 1 Baradatu${item.tglLabel ? ` – ${item.tglLabel}` : ""}`} type="article">
      <div className="page-breadcrumb"><Link to="/">Beranda</Link><span>›</span><Link to="/pengumuman">Pengumuman</Link><span>›</span><span>{item.judul}</span></div>
      <article className="detail-article card detail-narrow">
        <div className="news-page-meta"><Badge type={item.badge} />{item.tglLabel && <time dateTime={item.tgl}>{item.tglLabel}</time>}</div>
        <div className="detail-body">{item.content ? <BeritaParagraphs text={item.content} /> : <p>Tidak ada keterangan tambahan.</p>}</div>
        <Link className="more" to="/pengumuman">← Kembali ke daftar pengumuman</Link>
      </article>
    </PageShell>
  );
}
