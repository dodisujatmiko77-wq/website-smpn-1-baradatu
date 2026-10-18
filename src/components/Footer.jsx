import { Link } from "react-router-dom";
import { useSchoolData } from "../data/publicData";
import { digitalServices } from "../data/digitalServices";
import { useContact } from "../data/settingsStore";
const links = [["Beranda", "/"], ["Profil", "/profil"], ["Berita", "/berita"], ["PPDB", "/ppdb"], ["Kontak", "/kontak"]];
export default function Footer() {
  const c = useContact();
  const s = useSchoolData();
  return (
    <footer>
      <div className="wrap">
        <div className="fg">
          <div><h3>{s.name}</h3><p style={{ fontSize: 14, margin: 0 }}>Kabupaten Way Kanan • Lampung<br />Unggul dalam prestasi, berkarakter dalam sikap, adaptif terhadap perkembangan zaman.</p></div>
          <div><h3>Menu</h3><ul>{links.map(([n, u]) => <li key={u}><Link to={u}>{n}</Link></li>)}</ul></div>
          <div><h3>Layanan Digital</h3><ul>{digitalServices.map((d) => <li key={d.nama}><a href={d.url}>{d.nama}</a></li>)}</ul></div>
          <div><h3>Sosial Media</h3><ul>{c.sosmed.map(([n, u]) => <li key={n}><a href={u}>{n}</a></li>)}</ul></div>
          <div className="footer-quote"><p>“Pendidikan hari ini<br />untuk masa depan yang lebih baik.”</p></div>
        </div>
        <div className="copy"><span>© 2026 UPT SMPN 1 Baradatu. All Rights Reserved.</span><small>Developed by Dodi Sujatmiko</small></div>
      </div>
    </footer>
  );
}
