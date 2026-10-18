import { Link } from "react-router-dom";
import Card from "../components/Card";
import Badge from "../components/Badge";
import Photo from "../components/Photo";
import SectionHead from "../components/SectionHead";
import { usePublicList } from "../data/publicData";
export default function Berita({ bare }) {
  const { items, loading } = usePublicList("news", { home: true, limit: 4 });
  return (
    <div>
      {!bare && <SectionHead title="Berita Terbaru" sub="Informasi dan kegiatan terkini dari UPT SMPN 1 Baradatu" to="/berita" />}
      <div className="ngrid">
        {items.map((n, i) => {
          const to = n.id && !n.sample ? `/berita/${n.id}` : "/berita";
          return (
            <Card key={n.id || i} className="ncard">
              <Photo src={n.foto} alt={n.sample ? "Foto berita" : n.judul} />
              <div className="b"><Badge tag>{n.kategori}</Badge><span className="date">{n.tanggalLabel}</span><h3>{n.judul}</h3><p>{n.ringkasan}</p>
                <Link className="more" to={to}>Baca Selengkapnya</Link></div>
            </Card>
          );
        })}
      </div>
      {!loading && !items.length && <p className="home-empty">Belum ada berita yang diterbitkan.</p>}
    </div>
  );
}
