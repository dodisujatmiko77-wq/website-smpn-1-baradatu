import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";
import Photo from "../components/Photo";
import { isPlaceholder, useHistory, useSchoolData } from "../data/publicData";

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
  const s = useSchoolData();
  const history = useHistory();
  const complete = rows.every(([, k]) => !isPlaceholder(String(s[k] || "")));
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
            <Photo src={s.schoolImage} alt={`Foto ${s.name}`} />
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
              <span className="data-status">{complete ? "Data resmi" : "Data belum lengkap"}</span>
            </div>
            <dl className="profile-info-list">
              {rows.map(([label, key]) => (
                <div className="profile-info-row" key={key}>
                  <dt>{label}</dt>
                  <dd>{isPlaceholder(String(s[key] || "")) ? "Belum diisi" : s[key]}</dd>
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
          {history.paragraphs.length ? (
            <div className="profile-about-text">
              {history.paragraphs.slice(0, 2).map((p, i) => <p key={i}>{p}</p>)}
              <Link className="more" to="/profil/sejarah">Baca sejarah sekolah</Link>
            </div>
          ) : <div className="profile-empty">
            <strong>Profil resmi sekolah belum tersedia.</strong>
            <p>Informasi tentang sejarah singkat, karakteristik, dan profil sekolah akan ditampilkan setelah admin/operator memasukkan data resmi sekolah.</p>
          </div>}
        </section>

        <div className="profile-highlights">
          <section className="profile-highlight card">
            <span className="eyebrow">SEKILAS SEKOLAH</span>
            <h2>Informasi Singkat</h2>
            {complete ? (
              <p>{s.name} adalah sekolah menengah pertama negeri di Kecamatan {s.kecamatan}, Kabupaten {s.kabupaten}, Provinsi {s.provinsi}.{s.akreditasi ? ` Terakreditasi ${s.akreditasi}.` : ""}</p>
            ) : (
              <p>Ringkasan mengenai identitas dan gambaran umum sekolah akan tersedia setelah data resmi dimasukkan.</p>
            )}
          </section>
          <section className="profile-highlight card">
            <span className="eyebrow">INFORMASI PENTING</span>
            <h2>Jelajahi Profil</h2>
            <p className="profile-links">
              <Link to="/profil/visi-misi">Visi &amp; Misi</Link> · <Link to="/profil/sejarah">Sejarah</Link> · <Link to="/profil/struktur">Struktur Organisasi</Link> · <Link to="/profil/fasilitas">Fasilitas</Link> · <Link to="/gtk/guru">Guru</Link>
            </p>
          </section>
        </div>
      </div>
    </PageShell>
  );
}
