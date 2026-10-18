import Card from "../components/Card";
import Badge from "../components/Badge";
import SectionHead from "../components/SectionHead";
import { announcementData } from "../data/announcementData";
import { useSiteValue } from "../data/siteStore";
export default function Pengumuman({ bare }) {
  const items = useSiteValue("announcements", announcementData);
  return (
    <div>
      {!bare && <SectionHead title="Pengumuman" to="/pengumuman" />}
      <ul className="ann">
        {items.filter(a=>a.terbit!==false && a.homepage!==false).map((a, i) => (
          <Card as="li" key={i}><div><h3>{a.judul}</h3><span className="date">{a.tgl}</span></div><Badge type={a.badge} /></Card>
        ))}
      </ul>
    </div>
  );
}
