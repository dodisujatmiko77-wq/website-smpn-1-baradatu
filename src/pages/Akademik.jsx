import PageShell from "../components/PageShell";

const academicAreas = [
  ["01", "Kurikulum", "Informasi kurikulum yang digunakan sekolah beserta dokumen pendukungnya."],
  ["02", "Kalender Akademik", "Informasi jadwal dan kegiatan akademik sekolah dalam satu tahun pelajaran."],
  ["03", "Penilaian", "Informasi mengenai pelaksanaan penilaian dan pengelolaan hasil belajar peserta didik."],
  ["04", "Kegiatan Pembelajaran", "Informasi kegiatan pembelajaran, program akademik, dan aktivitas pendukung pembelajaran."],
];

export default function AkademikPage() {
  return (
    <PageShell title="Akademik" sub="Informasi akademik UPT SMPN 1 Baradatu">
      <div className="academic-page">
        <div className="page-breadcrumb">
          <a href="/">Beranda</a><span aria-hidden="true">›</span><strong>Akademik</strong>
        </div>

        <section className="academic-intro">
          <div>
            <span className="eyebrow">INFORMASI AKADEMIK</span>
            <h2>Akademik Sekolah</h2>
            <p>
              Halaman ini menjadi pusat informasi akademik sekolah yang dapat memuat
              kurikulum, kalender akademik, penilaian, serta kegiatan pembelajaran.
            </p>
          </div>
          <div className="academic-status">
            <span className="academic-status-dot" aria-hidden="true"></span>
            <div>
              <strong>Data akademik resmi</strong>
              <small>Siap dilengkapi oleh admin/operator sekolah</small>
            </div>
          </div>
        </section>

        <section className="academic-panel">
          <div className="academic-panel-head">
            <div>
              <span className="eyebrow">RUANG INFORMASI</span>
              <h2>Informasi Akademik</h2>
            </div>
            <span className="academic-badge">Data resmi sekolah</span>
          </div>

          <div className="academic-grid">
            {academicAreas.map(([num, title, desc]) => (
              <article className="academic-card" key={num}>
                <div className="academic-card-num">{num}</div>
                <div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
                <div className="academic-card-state">Belum tersedia</div>
              </article>
            ))}
          </div>
        </section>

        <section className="academic-empty">
          <div className="academic-empty-icon" aria-hidden="true">▣</div>
          <div>
            <h3>Belum Ada Data Akademik Resmi</h3>
            <p>
              Informasi akademik akan ditampilkan setelah data dan dokumen resmi
              sekolah dimasukkan oleh admin/operator. Halaman ini sengaja tidak
              menampilkan data contoh agar informasi publik tetap akurat.
            </p>
          </div>
        </section>

        <div className="academic-note">
          <div className="academic-note-icon">i</div>
          <div>
            <h3>Catatan Pengelolaan Akademik</h3>
            <p>
              Data yang nantinya ditampilkan dapat mencakup nama kurikulum, tahun
              pelajaran, kalender akademik, informasi penilaian, program pembelajaran,
              dan dokumen pendukung sesuai data resmi sekolah.
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
