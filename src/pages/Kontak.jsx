import PageShell from "../components/PageShell";
import KontakSection from "../sections/Kontak";

export default function KontakPage() {
  return (
    <PageShell title="Kontak" sub="Hubungi UPT SMPN 1 Baradatu">
      <div className="kg contact-page">
        <KontakSection bare />
      </div>
    </PageShell>
  );
}
