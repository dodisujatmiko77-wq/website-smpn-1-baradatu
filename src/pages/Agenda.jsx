import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";
import Card from "../components/Card";
import { usePublicList } from "../data/publicData";

const categories = [
  { no: "01", title: "Kegiatan Akademik", text: "Jadwal dan kegiatan yang berkaitan dengan proses pembelajaran dan akademik sekolah." },
  { no: "02", title: "Kegiatan Sekolah", text: "Agenda kegiatan sekolah, peringatan, program, dan kegiatan bersama warga sekolah." },
  { no: "03", title: "Rapat & Koordinasi", text: "Jadwal rapat, koordinasi, dan kegiatan internal yang telah ditetapkan sekolah." },
];

export default function AgendaPage() {
  const { items: all } = usePublicList("agenda");
  const list = all.filter((a) => !a.sample);
  return (
    <PageShell title="Agenda Sekolah" sub="Jadwal kegiatan UPT SMPN 1 Baradatu">
      <div className="agenda-page">
        <div className="page-breadcrumb">
          <Link to="/">Beranda</Link><span aria-hidden="true">›</span><span>Agenda</span>
        </div>

        <section className="agenda-intro card">
          <div className="agenda-calendar-icon" aria-hidden="true">
            <span>CAL</span><strong>01</strong>
          </div>
          <div>
            <span className="eyebrow">AGENDA SEKOLAH</span>
            <h2>Jadwal Kegiatan Sekolah</h2>
            <p>Halaman ini menjadi pusat informasi jadwal kegiatan resmi UPT SMPN 1 Baradatu yang dapat diakses oleh peserta didik, orang tua, guru, tenaga kependidikan, dan masyarakat.</p>
          </div>
          <div className="agenda-status">
            <span className="status-dot" aria-hidden="true"></span>
            {list.length ? <div><strong>{list.length} agenda</strong><span>Jadwal resmi yang telah diterbitkan</span></div> : <div><strong>Data resmi belum tersedia</strong><span>Siap diisi oleh admin/operator sekolah</span></div>}
          </div>
        </section>

        <section className="agenda-section">
          <div className="head">
            <div>
              <span className="eyebrow">JADWAL KEGIATAN</span>
              <h2>Agenda Mendatang</h2>
              <p>Jadwal yang telah ditetapkan sekolah akan ditampilkan di bagian ini.</p>
            </div>
          </div>

          {list.length ? (
            <div className="ag agenda-list-page">
              {list.map((a) => (
                <Card key={a.id}><div className="dt">{a.hari}<small>{a.bulan}</small></div>
                  <div><h3>{a.nama}</h3><p>📅 {a.tglLabel}{a.jam && <><br />🕗 {a.jam}</>}{a.lokasi && <><br />📍 {a.lokasi}</>}</p>{a.description && <p className="agenda-desc">{a.description}</p>}</div></Card>
              ))}
            </div>
          ) : <div className="agenda-empty card">
            <div className="agenda-empty-icon" aria-hidden="true">▣</div>
            <h3>Belum ada agenda yang ditampilkan</h3>
            <p>Data agenda resmi sekolah belum tersedia. Setelah data dimasukkan oleh admin/operator, jadwal kegiatan akan muncul di halaman ini.</p>
          </div>}
        </section>

        <section className="agenda-section">
          <div className="head">
            <div>
              <span className="eyebrow">KATEGORI AGENDA</span>
              <h2>Jenis Kegiatan</h2>
              <p>Agenda sekolah dapat dikelompokkan berdasarkan jenis kegiatannya.</p>
            </div>
          </div>

          <div className="agenda-category-grid">
            {categories.map((item) => (
              <article className="agenda-category card" key={item.no}>
                <div className="agenda-category-top">
                  <span className="agenda-number">{item.no}</span>
                  <span className="agenda-label">AGENDA</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        {!list.length && <section className="agenda-note">
          <div className="agenda-note-icon" aria-hidden="true">i</div>
          <div>
            <h3>Catatan Pengelolaan Data</h3>
            <p>Judul kegiatan, tanggal, waktu, lokasi, kategori, dan keterangan agenda nantinya diisi berdasarkan informasi resmi sekolah. Tidak ada agenda fiktif yang ditampilkan sebagai kegiatan resmi.</p>
          </div>
        </section>}
      </div>
    </PageShell>
  );
}
