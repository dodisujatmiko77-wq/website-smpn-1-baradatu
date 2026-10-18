import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import Card from "../components/Card";
import Badge from "../components/Badge";
import SectionHead from "../components/SectionHead";
import { usePublicList } from "../data/publicData";
export default function Pengumuman({ bare }) {
  const { items, loading } = usePublicList("announcements", { home: true, limit: 4 });
  return (
    <div>
      {!bare && <SectionHead title="Pengumuman" to="/pengumuman" />}
      <ul className="ann">
        {items.map((a, i) => (
          <Card as="li" key={a.id || i}>
            <div><h3>{a.id && !a.sample ? <Link to={`/pengumuman/${a.id}`}>{a.judul}</Link> : a.judul}</h3><span className="date">{a.tglLabel}</span></div>
            <Badge type={a.badge} />
          </Card>
        ))}
      </ul>
      {!loading && !items.length && <EmptyState icon="📢" tone="orange" title="Belum ada pengumuman" text="Pengumuman resmi akan tampil di sini." />}
    </div>
  );
}
