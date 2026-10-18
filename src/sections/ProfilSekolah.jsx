import Photo from "../components/Photo";
import SectionHead from "../components/SectionHead";
import { useSchoolData } from "../data/publicData";
const rows = [["NPSN", "npsn"], ["NSS", "nss"], ["Alamat", "alamat"], ["Kecamatan", "kecamatan"], ["Kabupaten", "kabupaten"], ["Provinsi", "provinsi"], ["Email", "email"], ["Telepon", "telp"]];
export default function ProfilSekolah({ bare }) {
  const s = useSchoolData();
  return (
    <div>
      {!bare && <SectionHead title="Profil Sekolah" to="/profil" label="Selengkapnya" style={{ marginBottom: 16 }} />}
      <div className="prof">
        <Photo src={s.schoolImage} alt={`Foto ${s.name}`} />
        <dl className="info">{rows.map(([l, k]) => <FragmentRow key={k} l={l} v={s[k]} />)}</dl>
      </div>
    </div>
  );
}
const FragmentRow = ({ l, v }) => <><dt>{l}</dt><dd>{v}</dd></>;
