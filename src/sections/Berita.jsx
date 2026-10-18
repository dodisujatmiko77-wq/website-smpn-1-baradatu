import { Link } from "react-router-dom";
import Card from "../components/Card";
import Badge from "../components/Badge";
import Photo from "../components/Photo";
import SectionHead from "../components/SectionHead";
import { newsData } from "../data/newsData";
import { useSiteValue } from "../data/siteStore";
export default function Berita({ bare }) {
  const items = useSiteValue("news", newsData);
  return (
    <div>
      {!bare && <SectionHead title="Berita Terbaru" sub="Informasi dan kegiatan terkini dari UPT SMPN 1 Baradatu" to="/berita" />}
      <div className="ngrid">
        {items.filter(n=>n.terbit!==false && n.homepage!==false).map((n, i) => (
          <Card key={i} className="ncard">
            <Photo src={n.foto} alt="Foto berita" />
            <div className="b"><Badge tag>{n.kategori}</Badge><span className="date">{n.tanggal}</span><h3>{n.judul}</h3><p>{n.ringkasan}</p>
              <Link className="more" to="/berita">Baca Selengkapnya</Link></div>
          </Card>
        ))}
      </div>
    </div>
  );
}
