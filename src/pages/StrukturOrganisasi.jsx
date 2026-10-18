import PageShell from "../components/PageShell";

function OrgPlaceholder({ title, subtitle, tone = "primary" }) {
  return (
    <div className={`org-node org-node-${tone}`}>
      <strong>{title}</strong>
      <span>{subtitle}</span>
    </div>
  );
}

export default function StrukturOrganisasiPage() {
  return (
    <PageShell
      title="Struktur Organisasi"
      sub="Susunan organisasi UPT SMPN 1 Baradatu"
    >
      <div className="page-breadcrumb" aria-label="Breadcrumb">
        <a href="/">Beranda</a><span>›</span><a href="/profil">Profil</a><span>›</span><strong>Struktur Organisasi</strong>
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
          <div>
            <strong>Data resmi belum tersedia</strong>
            <span>Siap diisi oleh admin/operator sekolah.</span>
          </div>
        </div>
      </section>

      <section className="org-chart" aria-label="Pratinjau struktur organisasi">
        <div className="org-chart-head">
          <div>
            <span className="eyebrow">PRATINJAU STRUKTUR</span>
            <h2>Susunan Organisasi</h2>
          </div>
          <span className="org-badge">Data belum diisi</span>
        </div>

        <div className="org-tree">
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
        </div>
      </section>

      <section className="org-note">
        <div className="org-note-icon" aria-hidden="true">i</div>
        <div>
          <h3>Data akan dilengkapi pada tahap akhir</h3>
          <p>
            Nama personel, jabatan, foto, dan hubungan struktur organisasi
            tidak dibuat secara fiktif. Setelah website siap digunakan, admin
            atau operator sekolah dapat memasukkan data resmi pada sistem.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
