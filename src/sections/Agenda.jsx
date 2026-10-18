import Card from "../components/Card";
import SectionHead from "../components/SectionHead";
import { usePublicList } from "../data/publicData";
export default function Agenda({ bare }) {
  const { items, loading } = usePublicList("agenda", { home: true, limit: 3 });
  return (
    <div>
      {!bare && <SectionHead title="Agenda Sekolah" to="/agenda" label="Lihat Kalender" />}
      <div className="ag">
        {items.map((a, i) => (
          <Card key={a.id || i}><div className="dt">{a.hari}<small>{a.bulan}</small></div>
            <div><h3>{a.nama}</h3><p>{a.jam && <>🕗 {a.jam}<br /></>}{a.lokasi && <>📍 {a.lokasi}</>}</p></div></Card>
        ))}
      </div>
      {!loading && !items.length && <p className="home-empty">Belum ada agenda terdekat.</p>}
    </div>
  );
}
