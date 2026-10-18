import PageShell from "../components/PageShell";
import { Link } from "react-router-dom";
import Galeri from "../sections/Galeri";
import { usePublicList } from "../data/publicData";

export default function GaleriPage() {
  const { items } = usePublicList("gallery");
  const count = items.filter((g) => !g.sample).length;
  return (
    <PageShell title="Galeri Kegiatan" sub="Dokumentasi foto kegiatan UPT SMPN 1 Baradatu">
      <div className="gallery-page">
        <div className="page-breadcrumb">
          <Link to="/">Beranda</Link><span aria-hidden="true">›</span><Link to="/prestasi">Kegiatan</Link><span aria-hidden="true">›</span><strong>Galeri</strong>
        </div>

        <section className="gallery-intro">
          <div>
            <span className="eyebrow">DOKUMENTASI SEKOLAH</span>
            <h2>Galeri Kegiatan</h2>
            <p>Dokumentasi visual kegiatan, pembelajaran, prestasi, upacara, dan aktivitas ekstrakurikuler sekolah.</p>
          </div>
          <div className="gallery-status">
            <span className="gallery-status-dot" aria-hidden="true"></span>
            {count ? <div><strong>{count} foto</strong><small>Dokumentasi resmi sekolah</small></div> : <div><strong>Data foto resmi</strong><small>Siap dilengkapi oleh admin/operator sekolah</small></div>}
          </div>
        </section>

        <section className="gallery-panel">
          <div className="gallery-panel-head">
            <div><span className="eyebrow">KOLEKSI FOTO</span><h2>Dokumentasi Kegiatan</h2></div>
            <span className="gallery-badge">Data resmi sekolah</span>
          </div>
          <Galeri bare home={false} />
        </section>

        {!count && <div className="gallery-note">
          <div className="gallery-note-icon">i</div>
          <div><h3>Catatan Pengelolaan Galeri</h3><p>Foto, judul, kategori, dan keterangan kegiatan nantinya diisi menggunakan dokumentasi resmi sekolah. Placeholder yang tampil saat ini tidak mewakili dokumentasi kegiatan tertentu.</p></div>
        </div>}
      </div>
    </PageShell>
  );
}
