import Photo from "../components/Photo";
import Button from "../components/Button";
import { principalData as p } from "../data/principalData";
export default function Sambutan() {
  return (
    <div>
      <h2>Sambutan Kepala Sekolah</h2>
      <div className="sam" style={{ marginTop: 16 }}>
        <Photo src={p.photo} alt="Foto Kepala Sekolah" />
        <div><b>{p.nama}</b><br /><small className="date">{p.jabatan}</small><p>{p.sambutan}</p>
          <Button variant="primary" to="/profil/kepala-sekolah">Baca Selengkapnya</Button></div>
      </div>
    </div>
  );
}
