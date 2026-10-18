import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";
import Photo from "../components/Photo";
import { BeritaParagraphs } from "./BeritaDetail";
import { usePrincipal } from "../data/publicData";

export default function KepalaSekolahPage() {
  const p = usePrincipal();
  return (
    <PageShell title="Kepala Sekolah" sub="Profil dan sambutan Kepala UPT SMPN 1 Baradatu">
      <div className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Beranda</Link><span aria-hidden="true">›</span>
        <Link to="/profil">Profil</Link><span aria-hidden="true">›</span>
        <strong>Kepala Sekolah</strong>
      </div>

      <div className="principal-page">
        <section className="principal-overview">
          <div className="card principal-photo-card">
            <Photo src={p.photo} alt={p.official ? `Foto ${p.nama}` : "Foto Kepala Sekolah"} />
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
              <span className="principal-badge">{p.official ? "Data resmi" : "Belum diisi"}</span>
            </div>
            <dl className="profile-info-list">
              <div className="profile-info-row"><dt>Nama</dt><dd>{p.nama}</dd></div>
              <div className="profile-info-row"><dt>Jabatan</dt><dd>{p.jabatan}</dd></div>
              {p.nip && <div className="profile-info-row"><dt>NIP</dt><dd>{p.nip}</dd></div>}
              {p.nuptk && <div className="profile-info-row"><dt>NUPTK</dt><dd>{p.nuptk}</dd></div>}
              {p.periode && <div className="profile-info-row"><dt>Periode</dt><dd>{p.periode}</dd></div>}
            </dl>
            {!p.official && <div className="principal-data-note">
              <strong>Data kepala sekolah</strong>
              <p>Informasi resmi akan diisi oleh admin/operator sekolah setelah data dan foto pimpinan tersedia.</p>
            </div>}
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
              <BeritaParagraphs text={p.sambutan} />
              <div className="principal-signature">
                <strong>{p.nama}</strong>
                <span>{p.jabatan}</span>
              </div>
            </div>
          </div>
        </section>

        {!p.official && <section className="principal-note">
          <div className="principal-note-icon">i</div>
          <div>
            <h3>Siap diisi dengan data resmi sekolah</h3>
            <p>Nama, jabatan, foto, serta naskah sambutan pada halaman ini menggunakan placeholder sampai admin/operator memasukkan informasi resmi.</p>
          </div>
        </section>}
      </div>
    </PageShell>
  );
}
