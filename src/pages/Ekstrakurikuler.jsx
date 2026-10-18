import PageShell from "../components/PageShell";
import { useExtracurriculars } from "../data/settingsStore";

export default function EkstrakurikulerPage() {
  const items = useExtracurriculars();
  return (
    <PageShell title="Ekstrakurikuler" sub="Kegiatan pengembangan minat dan bakat peserta didik">
      <div className="page-breadcrumb"><span>Beranda</span><span>›</span><span>Ekstrakurikuler</span></div>

      <section className="ekskul-intro">
        <div>
          <div className="eyebrow">KEGIATAN EKSTRAKURIKULER</div>
          <h2>Minat, Bakat &amp; Pengembangan Diri</h2>
          <p>Informasi kegiatan ekstrakurikuler sekolah yang menjadi wadah bagi peserta didik untuk mengembangkan minat, bakat, karakter, kepemimpinan, dan keterampilan.</p>
        </div>
        <div className="ekskul-status"><span className="ekskul-status-dot" /><div><strong>Data resmi siap dilengkapi</strong><small>Diisi oleh admin/operator sekolah.</small></div></div>
      </section>

      <section className="ekskul-section">
        <div className="ekskul-head">
          <div><div className="eyebrow">DAFTAR KEGIATAN</div><h2>Ekstrakurikuler Sekolah</h2></div>
          <span className="ekskul-badge">Data resmi</span>
        </div>
        <div className="ekskul-grid">
          {items.map(({ id, ikon: icon, nama: name, deskripsi, pembina, jadwal }) => (
            <article className="ekskul-card" key={id}>
              <div className="ekskul-icon" aria-hidden="true">{icon}</div>
              <h3>{name}</h3>
              <p>{deskripsi || "Informasi kegiatan, pembina, dan jadwal akan ditampilkan setelah data resmi tersedia."}</p>
              <div className="ekskul-meta"><span>Pembina</span><strong>{pembina || "—"}</strong></div>
              <div className="ekskul-meta"><span>Jadwal</span><strong>{jadwal || "—"}</strong></div>
            </article>
          ))}
        </div>
      </section>

      <div className="ekskul-note"><div className="ekskul-note-icon">i</div><div><h3>Catatan pengelolaan data</h3><p>Nama kegiatan, pembina, jadwal, deskripsi, dan dokumentasi akan mengikuti data resmi sekolah. Data dapat dilengkapi kemudian oleh admin/operator.</p></div></div>
    </PageShell>
  );
}
