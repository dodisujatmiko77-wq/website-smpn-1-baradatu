import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";
import Prestasi from "../sections/Prestasi";
import { usePublicList } from "../data/publicData";

export default function PrestasiPage() {
  const { items } = usePublicList("achievements");
  const count = items.filter((a) => !a.sample).length;
  return (
    <PageShell title="Prestasi" sub="Prestasi dan pencapaian UPT SMPN 1 Baradatu">
      <div className="page-breadcrumb"><Link to="/">Beranda</Link><span>›</span><span>Prestasi</span></div>
      <section className="achievement-intro">
        <div><div className="eyebrow">PRESTASI SEKOLAH</div><h2>Prestasi &amp; Pencapaian</h2><p>Halaman ini menjadi ruang dokumentasi prestasi peserta didik, guru, maupun sekolah yang telah diraih dalam berbagai bidang.</p></div>
        <div className="achievement-status"><span className="achievement-status-dot" />{count ? <div><strong>{count} prestasi</strong><small>Prestasi yang telah diterbitkan.</small></div> : <div><strong>Data resmi belum tersedia</strong><small>Siap diisi oleh admin/operator sekolah.</small></div>}</div>
      </section>
      {count ? <section className="achievement-list"><Prestasi bare home={false} /></section> : <>
      <section className="achievement-empty"><div className="achievement-empty-icon">🏆</div><h3>Belum Ada Data Prestasi</h3><p>Data prestasi resmi sekolah akan ditampilkan di halaman ini setelah dimasukkan oleh admin/operator sekolah.</p></section>
      <section className="achievement-categories">
        <div className="achievement-category"><span className="achievement-category-icon">🎓</span><div><h3>Akademik</h3><p>Prestasi akademik peserta didik dan sekolah.</p></div></div>
        <div className="achievement-category"><span className="achievement-category-icon">🏅</span><div><h3>Nonakademik</h3><p>Prestasi olahraga, seni, keterampilan, dan bidang lainnya.</p></div></div>
        <div className="achievement-category"><span className="achievement-category-icon">🏫</span><div><h3>Prestasi Sekolah</h3><p>Pencapaian sekolah dalam berbagai program dan kompetisi.</p></div></div>
      </section>
      <div className="achievement-note"><strong>Catatan pengelolaan data</strong><p>Nama kegiatan, tingkat kompetisi, tahun, peraih prestasi, dan dokumentasi akan mengikuti data resmi sekolah.</p></div>
      </>}
    </PageShell>
  );
}
