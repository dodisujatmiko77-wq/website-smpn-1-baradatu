import Seo from "./Seo";
import PageHeader from "./PageHeader";
// Kerangka halaman dalam: SEO + header + konten (Navbar/Footer ada di App.jsx)
export default function PageShell({ title, sub, children }) {
  return (
    <>
      <Seo title={`${title} | UPT SMPN 1 Baradatu`} description={sub || `${title} UPT SMPN 1 Baradatu, Kabupaten Way Kanan, Lampung.`} />
      <PageHeader title={title} sub={sub} />
      <section><div className="wrap">{children}</div></section>
    </>
  );
}
