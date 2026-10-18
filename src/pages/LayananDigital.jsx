import PageShell from "../components/PageShell";
import { usePublicList } from "../data/publicData";

const groups = [
  ["01", "Layanan Utama", "Akses sistem digital sekolah yang digunakan untuk mendukung layanan dan pengelolaan sekolah."],
  ["02", "Administrasi & Pengelolaan", "Layanan untuk mendukung administrasi sekolah, data, dan kebutuhan pengelolaan internal."],
];

export default function LayananDigitalPage() {
  const { items: services } = usePublicList("services");
  return (
    <PageShell title="Layanan Digital" sub="Akses layanan digital UPT SMPN 1 Baradatu dalam satu tempat">
      <div className="digital-page">
        <div className="page-breadcrumb">
          <a href="/">Beranda</a><span aria-hidden="true">›</span><strong>Layanan Digital</strong>
        </div>

        <section className="digital-intro">
          <div>
            <span className="eyebrow">EKOSISTEM DIGITAL SEKOLAH</span>
            <h2>Layanan Digital UPT SMPN 1 Baradatu</h2>
            <p>
              Satu halaman untuk mengakses berbagai aplikasi dan layanan digital yang
              mendukung kegiatan sekolah. Tautan layanan dapat dilengkapi oleh
              admin/operator ketika alamat resmi masing-masing sistem sudah ditetapkan.
            </p>
          </div>
          <div className="digital-status">
            <span className="digital-status-dot" aria-hidden="true"></span>
            <div>
              <strong>Ekosistem digital sekolah</strong>
              <small>Siap dilengkapi dengan tautan resmi</small>
            </div>
          </div>
        </section>

        <section className="digital-panel">
          <div className="digital-panel-head">
            <div>
              <span className="eyebrow">LAYANAN TERSEDIA</span>
              <h2>Aplikasi & Sistem Sekolah</h2>
            </div>
            <span className="digital-badge">Data layanan sekolah</span>
          </div>

          <div className="digital-grid">
            {services.map((service) => (
              <article className="digital-card" key={service.id || service.nama}>
                <div className="digital-card-top">
                  <span className="digital-icon" style={{ background: service.warna }} aria-hidden="true">{service.ikon}</span>
                </div>
                <h3>{service.nama}</h3>
                <p>{service.desk}</p>
                <div className="digital-card-bottom">
                  <a
                    className="digital-open-btn"
                    style={{ background: service.warna }}
                    href={(!service.url || service.url === "#") ? undefined : service.url}
                    aria-disabled={(!service.url || service.url === "#") ? "true" : undefined}
                    onClick={(!service.url || service.url === "#") ? (e) => e.preventDefault() : undefined}
                  >
                    {service.tombol}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="digital-info-grid">
          {groups.map(([num, title, desc]) => (
            <article className="digital-info-card" key={num}>
              <span className="digital-info-num">{num}</span>
              <div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            </article>
          ))}
        </section>

        {services.some((d) => !d.url || d.url === "#") && (
        <section className="digital-empty">
          <div className="digital-empty-icon" aria-hidden="true">⌁</div>
          <div>
            <h3>Tautan Layanan Belum Dihubungkan</h3>
            <p>
              Nama dan fungsi layanan dapat ditampilkan terlebih dahulu. Tautan menuju
              aplikasi akan diaktifkan setelah URL resmi masing-masing layanan dimasukkan
              oleh admin/operator sekolah. Tidak ada tautan contoh yang digunakan.
            </p>
          </div>
        </section>
        )}

        <div className="digital-note">
          <div className="digital-note-icon">i</div>
          <div>
            <h3>Catatan Pengelolaan Layanan Digital</h3>
            <p>
              Setiap layanan sebaiknya menggunakan alamat resmi dan aktif. Admin/operator
              dapat memperbarui nama layanan, deskripsi, ikon, status, dan tautan tanpa
              mengubah struktur halaman publik.
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
