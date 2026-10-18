import SectionHead from "../components/SectionHead";
import { useExtracurriculars } from "../data/settingsStore";
export default function Ekstrakurikuler({ bare }) {
  const items = useExtracurriculars();
  return (
    <div>
      {!bare && <SectionHead title="Ekstrakurikuler" sub="Beragam kegiatan untuk mengembangkan minat dan bakat siswa" to="/ekstrakurikuler" />}
      <div className="ek">{items.map((e) => <div key={e.id}><i aria-hidden="true">{e.ikon}</i>{e.nama}</div>)}</div>
    </div>
  );
}
