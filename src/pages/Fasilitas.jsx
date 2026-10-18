import PageShell from "../components/PageShell";

const facilities = [
  { icon: "🏫", title: "Ruang Kelas", desc: "Data ruang kelas dan fasilitas pembelajaran di dalamnya." },
  { icon: "📚", title: "Perpustakaan", desc: "Informasi fasilitas literasi dan ruang perpustakaan sekolah." },
  { icon: "🔬", title: "Laboratorium", desc: "Data laboratorium dan sarana pendukung kegiatan praktikum." },
  { icon: "💻", title: "Ruang TIK", desc: "Fasilitas teknologi informasi untuk mendukung pembelajaran." },
  { icon: "🏃", title: "Sarana Olahraga", desc: "Lapangan dan sarana olahraga yang tersedia di sekolah." },
  { icon: "🎨", title: "Ruang Kegiatan", desc: "Ruang untuk kegiatan seni, organisasi, dan pengembangan minat bakat." },
  { icon: "🕌", title: "Tempat Ibadah", desc: "Fasilitas tempat ibadah dan kegiatan keagamaan sekolah." },
  { icon: "🩺", title: "UKS", desc: "Fasilitas kesehatan sekolah dan ruang pelayanan UKS." },
];

export default function FasilitasPage() {
  return (
    <PageShell title="Fasilitas Sekolah" sub="Sarana dan prasarana UPT SMPN 1 Baradatu">
      <div className="page-breadcrumb">
        <a href="/">Beranda</a><span>›</span><a href="/profil">Profil</a><span>›</span><strong>Fasilitas Sekolah</strong>
      </div>

      <div className="facility-intro">
        <div>
          <span className="eyebrow">SARANA & PRASARANA</span>
          <h2>Fasilitas Sekolah</h2>
          <p>
            Halaman ini menyajikan informasi sarana dan prasarana yang mendukung
            kegiatan belajar, pelayanan sekolah, serta pengembangan potensi peserta didik.
          </p>
        </div>
        <div className="facility-status">
          <span className="status-dot" />
          <div>
            <strong>Data fasilitas siap dilengkapi</strong>
            <span>Data resmi akan dimasukkan oleh admin/operator sekolah.</span>
          </div>
        </div>
      </div>

      <section className="facility-section">
        <div className="facility-head">
          <div>
            <span className="eyebrow">KATEGORI FASILITAS</span>
            <h2>Sarana Pendukung Sekolah</h2>
          </div>
          <span className="facility-badge">Data Resmi</span>
        </div>

        <div className="facility-grid">
          {facilities.map((item) => (
            <article className="facility-card" key={item.title}>
              <div className="facility-icon" aria-hidden="true">{item.icon}</div>
              <div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
              <span className="facility-placeholder">Menunggu data resmi</span>
            </article>
          ))}
        </div>
      </section>

      <div className="facility-note">
        <div className="facility-note-icon">i</div>
        <div>
          <h3>Catatan Informasi</h3>
          <p>
            Nama fasilitas, jumlah ruang, luas, kondisi, foto, serta keterangan lainnya
            tidak dibuat secara fiktif. Informasi tersebut akan diisi setelah data resmi
            sekolah tersedia.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
