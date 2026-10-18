import Card from "../components/Card";
import EmptyState from "../components/EmptyState";
import Photo from "../components/Photo";
import SectionHead from "../components/SectionHead";
import { usePublicList } from "../data/publicData";
export default function Prestasi({ bare, home = true }) {
  const { items, loading } = usePublicList("achievements", home ? { home: true, limit: 3 } : {});
  return (
    <div>
      {!bare && <SectionHead title="Prestasi & Pencapaian" to="/prestasi" />}
      <div className="pg">
        {items.map((a, i) => (
          <Card key={a.id || i}><Photo src={a.foto} alt={a.sample ? "Foto prestasi" : a.nama} />
            <div className="b"><h3>{a.nama}</h3><p>{a.siswa}{a.siswa && <br />}{[a.tingkat && `Tingkat ${a.tingkat}`, a.tahun].filter(Boolean).join(" • ")}</p></div></Card>
        ))}
      </div>
      {!loading && !items.length && home && <EmptyState icon="🏆" tone="gold" title="Belum ada prestasi" text="Prestasi peserta didik dan sekolah akan tampil di sini." />}
    </div>
  );
}
