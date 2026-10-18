import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";
import { useStructure } from "../data/publicData";

function OrgPlaceholder({ title, subtitle, tone = "primary" }) {
  return (
    <div className={`org-node org-node-${tone}`}>
      <strong>{title}</strong>
      <span>{subtitle}</span>
    </div>
  );
}

export default function StrukturOrganisasiPage() {
  const st = useStructure();
  const has = Boolean(st.image || st.description);
  return (
    <PageShell
      title="Struktur Organisasi"
      sub="Susunan organisasi UPT SMPN 1 Baradatu"
    >
      <div className="page-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Beranda</Link><span>›</span><Link to="/profil">Profil</Link><span>›</span><strong>Struktur Organisasi</strong>
      </div>

      <section className="org-intro">
        <div>
          <span className="eyebrow">TATA KELOLA SEKOLAH</span>
          <h2>Struktur Organisasi Sekolah</h2>
          <p>
            Struktur organisasi akan menampilkan susunan kepemimpinan,
            koordinasi, dan unsur pelaksana UPT SMPN 1 Baradatu setelah data
            resmi sekolah tersedia.
          </p>
        </div>
        <div className="org-status">
          <span className="status-dot" aria-hidden="true" />
          {has ? (
            <div>
              <strong>Data resmi sekolah</strong>
              <span>Struktur organisasi yang berlaku.</span>
            </div>
          ) : (
            <div>
              <strong>Data resmi belum tersedia</strong>
              <span>Siap diisi oleh admin/operator sekolah.</span>
            </div>
          )}
        </div>
      </section>

      <section className="org-chart" aria-label="Pratinjau struktur organisasi">
        <div className="org-chart-head">
          <div>
            <span className="eyebrow">PRATINJAU STRUKTUR</span>
            <h2>Susunan Organisasi</h2>
          </div>
          <span className="org-badge">{has ? "Resmi" : "Data belum diisi"}</span>
        </div>

        {has ? (
          <div className="org-official">
            {st.description && <p style={{ whiteSpace: "pre-line" }}>{st.description}</p>}
            {st.image && <a href={st.image} target="_blank" rel="noopener noreferrer"><img src={st.image} alt={`Bagan ${st.title} UPT SMPN 1 Baradatu`} loading="lazy" /></a>}
          </div>
        ) : <div className="org-tree">
          <div className="org-level org-level-top">
            <OrgPlaceholder
              title="Kepala Sekolah"
              subtitle="Data nama & jabatan belum diisi"
            />
          </div>

          <div className="org-connector org-connector-vertical" aria-hidden="true" />

          <div className="org-level org-level-middle">
            <OrgPlaceholder title="Wakil Kepala Sekolah" subtitle="Data belum diisi" tone="secondary" />
            <OrgPlaceholder title="Koordinator / Tim" subtitle="Data belum diisi" tone="secondary" />
          </div>

          <div className="org-connector org-connector-branch" aria-hidden="true" />

          <div className="org-level org-level-bottom">
            <OrgPlaceholder title="Guru" subtitle="Data belum diisi" tone="light" />
            <OrgPlaceholder title="Tenaga Kependidikan" subtitle="Data belum diisi" tone="light" />
            <OrgPlaceholder title="Unsur Pendukung" subtitle="Data belum diisi" tone="light" />
          </div>
        </div>}
      </section>

      {!has && <section className="org-note">
        <div className="org-note-icon" aria-hidden="true">i</div>
        <div>
          <h3>Data akan dilengkapi pada tahap akhir</h3>
          <p>
            Nama personel, jabatan, foto, dan hubungan struktur organisasi
            tidak dibuat secara fiktif. Setelah website siap digunakan, admin
            atau operator sekolah dapat memasukkan data resmi pada sistem.
          </p>
        </div>
      </section>}
    </PageShell>
  );
}
