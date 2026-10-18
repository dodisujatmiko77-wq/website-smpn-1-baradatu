import Photo from "../components/Photo";
import SectionHead from "../components/SectionHead";
import { schoolData as s } from "../data/schoolData";
const rows = [["NPSN", "npsn"], ["NSS", "nss"], ["Alamat", "alamat"], ["Kecamatan", "kecamatan"], ["Kabupaten", "kabupaten"], ["Provinsi", "provinsi"], ["Email", "email"], ["Telepon", "telp"]];
export default function ProfilSekolah({ bare }) {
  return (
    <div>
      {!bare && <SectionHead title="Profil Sekolah" to="/profil" label="Selengkapnya" style={{ marginBottom: 16 }} />}
      <div className="prof">
        <Photo src={s.schoolImage} alt="Foto Sekolah" />
        <dl className="info">{rows.map(([l, k]) => <FragmentRow key={k} l={l} v={s[k]} />)}</dl>
      </div>
    </div>
  );
}
const FragmentRow = ({ l, v }) => <><dt>{l}</dt><dd>{v}</dd></>;
