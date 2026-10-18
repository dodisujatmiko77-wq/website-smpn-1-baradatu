import Card from "../components/Card";
import SectionHead from "../components/SectionHead";
import { agendaData } from "../data/agendaData";
import { useSiteValue } from "../data/siteStore";
export default function Agenda({ bare }) {
  const items = useSiteValue("agenda", agendaData);
  return (
    <div>
      {!bare && <SectionHead title="Agenda Sekolah" to="/agenda" label="Lihat Kalender" />}
      <div className="ag">
        {items.filter(a=>a.terbit!==false && a.homepage!==false).map((a, i) => (
          <Card key={i}><div className="dt">{a.tgl}<small>{a.bln}</small></div>
            <div><h3>{a.nama}</h3><p>🕗 {a.jam}<br />📍 {a.lokasi}</p></div></Card>
        ))}
      </div>
    </div>
  );
}
