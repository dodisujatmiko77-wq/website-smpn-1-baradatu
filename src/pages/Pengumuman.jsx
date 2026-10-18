import PageShell from "../components/PageShell";

const items = [
  { icon: "01", title: "Pengumuman Sekolah", text: "Informasi resmi sekolah akan ditampilkan pada bagian ini setelah data dimasukkan oleh admin/operator sekolah.", type: "PENGUMUMAN" },
  { icon: "02", title: "Informasi Akademik", text: "Jadwal, ketentuan, atau informasi akademik resmi dapat ditampilkan di sini.", type: "AKADEMIK" },
  { icon: "03", title: "Informasi Kegiatan", text: "Informasi kegiatan dan pemberitahuan sekolah akan tersedia setelah data resmi ditambahkan.", type: "KEGIATAN" },
];

export default function PengumumanPage() {
  return (
    <PageShell title="Pengumuman" sub="Informasi dan pengumuman resmi UPT SMPN 1 Baradatu">
      <div className="announcement-page">
        <div className="page-breadcrumb">
          <a href="/">Beranda</a><span aria-hidden="true">›</span><span>Pengumuman</span>
        </div>

        <section className="announcement-intro card">
          <div className="announcement-icon" aria-hidden="true">!</div>
          <div>
            <span className="eyebrow">INFORMASI SEKOLAH</span>
            <h2>Pengumuman Resmi Sekolah</h2>
            <p>Halaman ini menjadi pusat informasi resmi yang dapat digunakan sekolah untuk menyampaikan pemberitahuan kepada peserta didik, orang tua, guru, tenaga kependidikan, dan masyarakat.</p>
          </div>
          <div className="announcement-status">
            <span className="status-dot" aria-hidden="true"></span>
            <div><strong>Data resmi belum tersedia</strong><span>Siap diisi oleh admin/operator sekolah</span></div>
          </div>
        </section>

        <section className="announcement-section">
          <div className="head">
            <div><span className="eyebrow">DAFTAR INFORMASI</span><h2>Pengumuman Sekolah</h2><p>Informasi yang telah dipublikasikan akan tampil dalam daftar berikut.</p></div>
          </div>

          <div className="announcement-grid">
            {items.map((item) => (
              <article className="announcement-card card" key={item.icon}>
                <div className="announcement-card-top"><span className="announcement-number">{item.icon}</span><span className="announcement-label">{item.type}</span></div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <div className="announcement-placeholder">Konten resmi akan ditampilkan di sini</div>
              </article>
            ))}
          </div>
        </section>

        <section className="announcement-note">
          <div className="announcement-note-icon" aria-hidden="true">i</div>
          <div><h3>Catatan Pengelolaan Data</h3><p>Judul, tanggal, isi pengumuman, kategori, dan lampiran nantinya dapat diisi dan dikelola menggunakan data resmi sekolah. Tidak ada informasi fiktif yang ditampilkan sebagai pengumuman resmi.</p></div>
        </section>
      </div>
    </PageShell>
  );
}
