import PageShell from "../components/PageShell";
import { usePpdb } from "../data/settingsStore";

const ppdbAreas = [
  ["01", "Jadwal PPDB", "Informasi waktu pembukaan, pendaftaran, seleksi, dan pengumuman hasil sesuai jadwal resmi sekolah.", "jadwal"],
  ["02", "Persyaratan", "Dokumen dan ketentuan yang perlu dipenuhi calon peserta didik berdasarkan informasi resmi sekolah.", "persyaratan"],
  ["03", "Alur Pendaftaran", "Panduan langkah pendaftaran mulai dari persiapan data hingga proses akhir penerimaan.", "alur"],
  ["04", "Pengumuman", "Informasi resmi mengenai hasil, ketentuan lanjutan, dan pemberitahuan penting PPDB.", "pengumuman"],
];

export default function PPDBPage() {
  const p = usePpdb();
  const opened = Boolean(p.dibuka);

  return (
    <PageShell title="PPDB" sub="Informasi Penerimaan Peserta Didik Baru UPT SMPN 1 Baradatu">
      <div className="ppdb-page">
        <div className="breadcrumb">
          <a href="/">Beranda</a><span aria-hidden="true">›</span><strong>PPDB</strong>
        </div>

        <section className="ppdb-intro">
          <div>
            <span className="eyebrow">PENERIMAAN PESERTA DIDIK BARU</span>
            <h2>PPDB UPT SMPN 1 Baradatu</h2>
            <p>
              Halaman ini menjadi pusat informasi penerimaan peserta didik baru,
              termasuk jadwal, persyaratan, alur pendaftaran, dan pengumuman resmi sekolah.
            </p>
          </div>
          <div className="ppdb-status">
            <span className={`ppdb-status-dot ${opened ? "is-open" : ""}`} aria-hidden="true"></span>
            <div>
              <strong>{opened ? "PPDB Dibuka" : "PPDB Belum Dibuka"}</strong>
              <small>{opened ? "Pendaftaran sedang berlangsung" : "Menunggu informasi resmi sekolah"}</small>
            </div>
          </div>
        </section>

        <section className="ppdb-panel">
          <div className="ppdb-panel-head">
            <div>
              <span className="eyebrow">INFORMASI UTAMA</span>
              <h2>Informasi PPDB</h2>
            </div>
            <span className="ppdb-badge">Data resmi sekolah</span>
          </div>

          <div className="ppdb-grid">
            {ppdbAreas.map(([num, title, desc, key]) => (
              <article className="ppdb-card" key={num}>
                <div className="ppdb-card-num">{num}</div>
                <div>
                  <h3>{title}</h3>
                  <p style={{ whiteSpace: "pre-line" }}>{p[key] || desc}</p>
                </div>
                {!p[key] && <div className="ppdb-card-state">Belum tersedia</div>}
              </article>
            ))}
          </div>
        </section>

        {!ppdbAreas.some((a) => p[a[3]]) && (
        <section className="ppdb-empty">
          <div className="ppdb-empty-icon" aria-hidden="true">↗</div>
          <div>
            <h3>Informasi PPDB Belum Tersedia</h3>
            <p>
              Jadwal, persyaratan, alur, dan informasi pendaftaran akan ditampilkan
              setelah data resmi PPDB dimasukkan oleh admin/operator sekolah. Halaman
              ini tidak menggunakan data contoh agar informasi publik tetap akurat.
            </p>
          </div>
        </section>
        )}

        <section className="ppdb-cta">
          <div>
            <span className="eyebrow">PUSAT INFORMASI</span>
            <h2>{opened ? "Pendaftaran PPDB sedang berlangsung" : "Pantau informasi resmi PPDB"}</h2>
            <p>
              Gunakan halaman ini sebagai rujukan utama setelah sekolah mengisi informasi
              PPDB yang telah ditetapkan secara resmi.
            </p>
          </div>
          <div className="ppdb-cta-state">
            <span className={`st ${opened ? "" : "off"}`}>{opened ? "PPDB Dibuka" : "Belum Dibuka"}</span>
            {opened && p.url && <a className="btn b-a" href={p.url}>Daftar Sekarang</a>}
            {!opened && <span className="ppdb-cta-note">Tautan pendaftaran akan tersedia saat PPDB dibuka.</span>}
          </div>
        </section>

        <div className="ppdb-note">
          <div className="ppdb-note-icon">i</div>
          <div>
            <h3>Catatan Pengelolaan PPDB</h3>
            <p>
              Data yang nantinya ditampilkan dapat mencakup periode penerimaan, jadwal,
              persyaratan, jalur atau ketentuan resmi, tautan pendaftaran, serta pengumuman
              sesuai informasi yang ditetapkan sekolah.
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
