import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";
import Photo from "../components/Photo";
import { schoolData as s } from "../data/schoolData";

const rows = [
  ["NPSN", "npsn"],
  ["NSS", "nss"],
  ["Alamat", "alamat"],
  ["Kecamatan", "kecamatan"],
  ["Kabupaten", "kabupaten"],
  ["Provinsi", "provinsi"],
  ["Email", "email"],
  ["Telepon", "telp"],
];

export default function ProfilPage() {
  return (
    <PageShell
      title="Profil Sekolah"
      sub="Informasi lengkap mengenai UPT SMPN 1 Baradatu"
    >
      <div className="profile-page">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Beranda</Link>
          <span aria-hidden="true">›</span>
          <span>Profil Sekolah</span>
        </nav>

        <div className="profile-overview">
          <div className="profile-photo-card card">
            <Photo src={s.schoolImage} alt="Foto UPT SMPN 1 Baradatu" />
            <div className="profile-photo-caption">
              <strong>UPT SMPN 1 Baradatu</strong>
              <span>Foto dan identitas sekolah</span>
            </div>
          </div>

          <div className="profile-identity card">
            <div className="profile-card-head">
              <div>
                <span className="eyebrow">IDENTITAS SEKOLAH</span>
                <h2>Data Sekolah</h2>
              </div>
              <span className="data-status">Data belum lengkap</span>
            </div>
            <dl className="profile-info-list">
              {rows.map(([label, key]) => (
                <div className="profile-info-row" key={key}>
                  <dt>{label}</dt>
                  <dd>{s[key] || "Belum diisi"}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <section className="profile-about card">
          <div className="profile-section-title">
            <span className="eyebrow">TENTANG SEKOLAH</span>
            <h2>Profil UPT SMPN 1 Baradatu</h2>
          </div>
          <div className="profile-empty">
            <strong>Profil resmi sekolah belum tersedia.</strong>
            <p>Informasi tentang sejarah singkat, karakteristik, dan profil sekolah akan ditampilkan setelah admin/operator memasukkan data resmi sekolah.</p>
          </div>
        </section>

        <div className="profile-highlights">
          <section className="profile-highlight card">
            <span className="eyebrow">SEKILAS SEKOLAH</span>
            <h2>Informasi Singkat</h2>
            <p>Ringkasan mengenai identitas dan gambaran umum sekolah akan tersedia setelah data resmi dimasukkan.</p>
          </section>
          <section className="profile-highlight card">
            <span className="eyebrow">INFORMASI PENTING</span>
            <h2>Data Resmi Sekolah</h2>
            <p>Data resmi sekolah akan dikelola dan diperbarui oleh admin/operator pada tahap pengisian konten.</p>
          </section>
        </div>
      </div>
    </PageShell>
  );
}
