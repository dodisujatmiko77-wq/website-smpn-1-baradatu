import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";
import { useVisionMission } from "../data/publicData";

export default function VisiMisiPage() {
  const s = useVisionMission();
  const isPlaceholderVisi = !s.visi;
  const officialMisi = s.misi;
  const ready = !isPlaceholderVisi || officialMisi.length > 0;
  return (
    <PageShell title="Visi & Misi" sub="Arah, tujuan, dan nilai pengembangan UPT SMPN 1 Baradatu">
      <div className="visi-detail-page">
        <div className="page-breadcrumb">
          <Link to="/">Beranda</Link><span>›</span><Link to="/profil">Profil</Link><span>›</span><strong>Visi &amp; Misi</strong>
        </div>

        <section className="visi-detail-hero">
          <div>
            <span className="eyebrow">ARAH PENDIDIKAN SEKOLAH</span>
            <h2>Visi &amp; Misi</h2>
            <p>
              Visi dan misi menjadi landasan dalam menentukan arah pengembangan sekolah,
              pembelajaran, pelayanan, serta pembentukan karakter peserta didik.
            </p>
          </div>
          <div className="visi-detail-status">
            <span className="status-dot" />
            {ready ? (
              <div>
                <strong>Data resmi sekolah</strong>
                <span>Visi dan misi UPT SMPN 1 Baradatu.</span>
              </div>
            ) : (
              <div>
                <strong>Data resmi siap dilengkapi</strong>
                <span>Visi dan misi akan ditampilkan sesuai dokumen resmi sekolah.</span>
              </div>
            )}
          </div>
        </section>

        <section className="visi-detail-grid">
          <article className="visi-detail-card visi-main-card">
            <div className="visi-detail-card-top">
              <span className="visi-detail-number">01</span>
              <span className="visi-detail-label">VISI SEKOLAH</span>
            </div>
            <div className="visi-detail-symbol" aria-hidden="true">◎</div>
            <h3>Visi</h3>
            {isPlaceholderVisi ? (
              <div className="visi-detail-empty">
                <strong>Visi resmi sekolah belum tersedia</strong>
                <p>Data visi akan ditampilkan setelah admin/operator memasukkan visi resmi UPT SMPN 1 Baradatu.</p>
              </div>
            ) : (
              <p className="visi-detail-text">{s.visi}</p>
            )}
          </article>

          <article className="visi-detail-card misi-main-card">
            <div className="visi-detail-card-top">
              <span className="visi-detail-number">02</span>
              <span className="visi-detail-label">MISI SEKOLAH</span>
            </div>
            <h3>Misi</h3>
            {officialMisi.length ? (
              <ol className="visi-detail-list">
                {officialMisi.map(([icon, text], index) => (
                  <li key={`${text}-${index}`}>
                    <span className="visi-list-index">{String(index + 1).padStart(2, "0")}</span>
                    <span className="visi-list-icon" aria-hidden="true">{icon || "•"}</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="visi-detail-empty">
                <strong>Misi resmi sekolah belum tersedia</strong>
                <p>Data misi akan ditampilkan setelah admin/operator memasukkan data resmi sekolah.</p>
              </div>
            )}
          </article>
        </section>

        {!ready && <section className="visi-detail-note">
          <div className="visi-detail-note-icon">i</div>
          <div>
            <h3>Catatan Informasi</h3>
            <p>
              Isi visi dan misi tidak dibuat secara fiktif. Seluruh teks akan menggunakan data resmi
              sekolah dan dapat diperbarui oleh admin/operator ketika data telah tersedia.
            </p>
          </div>
        </section>}
      </div>
    </PageShell>
  );
}
