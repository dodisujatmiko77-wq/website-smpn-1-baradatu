import { Link } from "react-router-dom";
import { usePublicList, useSchoolData } from "../data/publicData";
import { motto } from "../data/schoolData";
import { useContact } from "../data/settingsStore";
const links = [["Beranda", "/"], ["Profil", "/profil"], ["Berita", "/berita"], ["PPDB", "/ppdb"], ["Kontak", "/kontak"]];
export default function Footer() {
  const c = useContact();
  const s = useSchoolData();
  const { items: digitalServices } = usePublicList("services");
  return (
    <footer>
      <div className="wrap">
        <div className="fg">
          <div><h3>{s.name}</h3><p style={{ fontSize: 14, margin: 0 }}>Kabupaten Way Kanan • Lampung<br />Motto: <b>JUARA</b> — {motto.join(", ")}.</p></div>
          <div><h3>Menu</h3><ul>{links.map(([n, u]) => <li key={u}><Link to={u}>{n}</Link></li>)}</ul></div>
          <div><h3>Layanan Digital</h3><ul>{digitalServices.map((d) => <li key={d.nama}>{d.url && d.url !== "#" ? <a href={d.url} target="_blank" rel="noopener noreferrer">{d.nama}</a> : <Link to="/layanan-digital">{d.nama}</Link>}</li>)}</ul></div>
          <div><h3>Sosial Media</h3><ul>{c.sosmed.filter(([, u]) => u && u !== "#").map(([n, u]) => <li key={n}><a href={u} target="_blank" rel="noopener noreferrer">{n}</a></li>)}</ul></div>
          <div className="footer-quote"><p>“Pendidikan hari ini<br />untuk masa depan yang lebih baik.”</p></div>
        </div>
        <div className="copy"><span>© {new Date().getFullYear()} UPT SMPN 1 Baradatu. All Rights Reserved.</span><small>Developed by Dodi Sujatmiko</small></div>
      </div>
    </footer>
  );
}
