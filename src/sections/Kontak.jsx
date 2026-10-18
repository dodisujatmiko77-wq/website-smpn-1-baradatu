import Card from "../components/Card";
import Button from "../components/Button";
import Photo from "../components/Photo";
import { contactData } from "../data/contactData";
import { useSchoolData } from "../data/publicData";
import { useContact } from "../data/settingsStore";

// Email boleh terpotong ke baris baru tepat sebelum "@", bukan di tengah kata
const breakEmail = (v) => {
  const i = String(v || "").indexOf("@");
  return i > 0 ? <>{v.slice(0, i)}<wbr />{v.slice(i)}</> : v;
};

export default function Kontak({ bare }) {
  const sd = useSchoolData();
  const cs = useContact();
  const c = { ...contactData, ...cs, alamat: sd.alamat, telp: sd.telp, email: sd.email };
  const contactItems = [
    { icon: "📍", label: "Alamat", value: c.alamat, color: "#1976D2" },
    { icon: "📞", label: "Telepon", value: c.telp, color: "#16A34A" },
    { icon: "✉️", label: "Email", value: c.email, color: "#F59E0B" },
  ];

  const socialItems = [
    { label: "WhatsApp", href: c.wa, color: "#16A34A", icon: "💬" },
    { label: "Email", href: `mailto:${c.email}`, color: "#F59E0B", icon: "✉️" },
    { label: "Google Maps", href: c.maps, color: "#DC2626", icon: "📍" },
  ];


  return (
    <>
      <div>
        {!bare && (
          <>
            <h2>Kontak Kami</h2>
            <p style={{ color: "var(--mut)" }}>Hubungi kami untuk informasi lebih lanjut.</p>
          </>
        )}

        <div className="kc contact-cards contact-cards-3">
          {contactItems.map((item) => (
            <Card key={item.label} className="contact-card" style={{ "--card-accent": item.color }}>
              <div className="contact-card-icon" aria-hidden="true">{item.icon}</div>
              <div className="contact-card-body">
                <b>{item.label}</b>
                <span>{item.label === "Email" ? breakEmail(item.value) : item.value}</span>
              </div>
            </Card>
          ))}
          <Card className="contact-card contact-hours" style={{ "--card-accent": "#7C3AED" }}>
            <div className="contact-card-icon" aria-hidden="true">🕗</div>
            <div className="contact-card-body">
              <b>Jam Layanan <small>(WIB)</small></b>
              {c.jadwalRows && c.jadwalRows.length ? (
                <ul className="hours-list">
                  {c.jadwalRows.map((r) => (
                    <li key={r.hari} className={r.tutup ? "is-closed" : ""}><span>{r.hari}</span><strong>{r.jam}</strong></li>
                  ))}
                </ul>
              ) : <span style={{ whiteSpace: "pre-line" }}>{c.jam}</span>}
            </div>
          </Card>
        </div>

        {c.embed ? <iframe className="map" title="Peta lokasi sekolah" src={c.embed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" style={{ border: 0, width: "100%", minHeight: 260 }} /> : <Photo className="map" alt="Peta Google Maps (belum diatur)" role="img" />}
      </div>

      <div>
        <h2>Ikuti Kami</h2>
        <p className="contact-follow-sub">Temukan kanal komunikasi dan lokasi resmi sekolah.</p>
        <div className="soc contact-social" style={{ marginTop: 16 }}>
          {socialItems.filter((i) => i.href && i.href !== "#").map((item) => (
            <Button
              key={item.label}
              variant="primary"
              href={item.href}
              className="contact-social-btn"
              style={{ "--social-accent": item.color }}
            >
              <span aria-hidden="true">{item.icon}</span> {item.label}
            </Button>
          ))}
        </div>
      </div>
    </>
  );
}
