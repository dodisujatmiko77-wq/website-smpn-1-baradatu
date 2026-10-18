import Card from "../components/Card";
import Photo from "../components/Photo";
import SectionHead from "../components/SectionHead";
import { achievementData } from "../data/achievementData";
import { useSiteValue } from "../data/siteStore";
export default function Prestasi({ bare }) {
  const items = useSiteValue("achievements", achievementData);
  return (
    <div>
      {!bare && <SectionHead title="Prestasi & Pencapaian" to="/prestasi" />}
      <div className="pg">
        {items.filter(a=>a.terbit!==false && a.homepage!==false).map((a, i) => (
          <Card key={i}><Photo src={a.foto} alt="Foto prestasi" />
            <div className="b"><h3>{a.nama}</h3><p>{a.siswa}<br />Tingkat {a.tingkat} • {a.tahun}</p></div></Card>
        ))}
      </div>
    </div>
  );
}
