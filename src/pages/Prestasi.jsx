import PageShell from "../components/PageShell";

export default function PrestasiPage() {
  return (
    <PageShell title="Prestasi" sub="Prestasi dan pencapaian UPT SMPN 1 Baradatu">
      <div className="page-breadcrumb"><span>Beranda</span><span>›</span><span>Prestasi</span></div>
      <section className="achievement-intro">
        <div><div className="eyebrow">PRESTASI SEKOLAH</div><h2>Prestasi &amp; Pencapaian</h2><p>Halaman ini menjadi ruang dokumentasi prestasi peserta didik, guru, maupun sekolah yang telah diraih dalam berbagai bidang.</p></div>
        <div className="achievement-status"><span className="achievement-status-dot" /><div><strong>Data resmi belum tersedia</strong><small>Siap diisi oleh admin/operator sekolah.</small></div></div>
      </section>
      <section className="achievement-empty"><div className="achievement-empty-icon">🏆</div><h3>Belum Ada Data Prestasi</h3><p>Data prestasi resmi sekolah akan ditampilkan di halaman ini setelah dimasukkan oleh admin/operator sekolah.</p></section>
      <section className="achievement-categories">
        <div className="achievement-category"><span className="achievement-category-icon">🎓</span><div><h3>Akademik</h3><p>Prestasi akademik peserta didik dan sekolah.</p></div></div>
        <div className="achievement-category"><span className="achievement-category-icon">🏅</span><div><h3>Nonakademik</h3><p>Prestasi olahraga, seni, keterampilan, dan bidang lainnya.</p></div></div>
        <div className="achievement-category"><span className="achievement-category-icon">🏫</span><div><h3>Prestasi Sekolah</h3><p>Pencapaian sekolah dalam berbagai program dan kompetisi.</p></div></div>
      </section>
      <div className="achievement-note"><strong>Catatan pengelolaan data</strong><p>Nama kegiatan, tingkat kompetisi, tahun, peraih prestasi, dan dokumentasi akan mengikuti data resmi sekolah.</p></div>
    </PageShell>
  );
}
