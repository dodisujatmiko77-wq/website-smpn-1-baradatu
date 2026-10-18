import PageShell from "../components/PageShell";
import Photo from "../components/Photo";
import { principalData as p } from "../data/principalData";

export default function KepalaSekolahPage() {
  return (
    <PageShell title="Kepala Sekolah" sub="Profil dan sambutan Kepala UPT SMPN 1 Baradatu">
      <div className="breadcrumb" aria-label="Breadcrumb">
        <a href="/">Beranda</a><span aria-hidden="true">›</span>
        <a href="/profil">Profil</a><span aria-hidden="true">›</span>
        <strong>Kepala Sekolah</strong>
      </div>

      <div className="principal-page">
        <section className="principal-overview">
          <div className="card principal-photo-card">
            <Photo src={p.photo} alt="Foto Kepala Sekolah" />
            <div className="principal-photo-overlay">
              <span className="eyebrow">PIMPINAN SEKOLAH</span>
              <strong>{p.nama}</strong>
              <span>{p.jabatan}</span>
            </div>
          </div>

          <div className="card principal-profile">
            <div className="profile-card-head">
              <div>
                <span className="eyebrow">PROFIL KEPALA SEKOLAH</span>
                <h2>{p.nama}</h2>
              </div>
              <span className="principal-badge">Data resmi</span>
            </div>
            <dl className="profile-info-list">
              <div className="profile-info-row"><dt>Nama</dt><dd>{p.nama}</dd></div>
              <div className="profile-info-row"><dt>Jabatan</dt><dd>{p.jabatan}</dd></div>
              <div className="profile-info-row"><dt>Foto</dt><dd>{p.photo ? "Tersedia" : "Belum tersedia"}</dd></div>
            </dl>
            <div className="principal-data-note">
              <strong>Data kepala sekolah</strong>
              <p>Informasi resmi akan diisi oleh admin/operator sekolah setelah data dan foto pimpinan tersedia.</p>
            </div>
          </div>
        </section>

        <section className="card principal-message">
          <div className="profile-section-title">
            <span className="eyebrow">SAMBUTAN</span>
            <h2>Sambutan Kepala Sekolah</h2>
          </div>
          <div className="principal-message-box">
            <span className="principal-quote">“</span>
            <div>
              <p>{p.sambutan}</p>
              <div className="principal-signature">
                <strong>{p.nama}</strong>
                <span>{p.jabatan}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="principal-note">
          <div className="principal-note-icon">i</div>
          <div>
            <h3>Siap diisi dengan data resmi sekolah</h3>
            <p>Nama, jabatan, foto, serta naskah sambutan pada halaman ini menggunakan placeholder sampai admin/operator memasukkan informasi resmi.</p>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
