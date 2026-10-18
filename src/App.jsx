import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import { useSchoolData } from "./data/publicData";

// Halaman selain beranda dimuat saat dibuka, supaya kunjungan pertama lebih ringan.
// Panel admin dipisah sepenuhnya sehingga kodenya tidak diunduh oleh pengunjung biasa.
const Profil = lazy(() => import("./pages/Profil"));
const Sejarah = lazy(() => import("./pages/Sejarah"));
const VisiMisi = lazy(() => import("./pages/VisiMisi"));
const StrukturOrganisasi = lazy(() => import("./pages/StrukturOrganisasi"));
const KepalaSekolah = lazy(() => import("./pages/KepalaSekolah"));
const Fasilitas = lazy(() => import("./pages/Fasilitas"));
const Guru = lazy(() => import("./pages/Guru"));
const Tendik = lazy(() => import("./pages/Tendik"));
const Berita = lazy(() => import("./pages/Berita"));
const BeritaDetail = lazy(() => import("./pages/BeritaDetail"));
const Pengumuman = lazy(() => import("./pages/Pengumuman"));
const PengumumanDetail = lazy(() => import("./pages/PengumumanDetail"));
const Agenda = lazy(() => import("./pages/Agenda"));
const Prestasi = lazy(() => import("./pages/Prestasi"));
const Ekstrakurikuler = lazy(() => import("./pages/Ekstrakurikuler"));
const Galeri = lazy(() => import("./pages/Galeri"));
const Video = lazy(() => import("./pages/Video"));
const Akademik = lazy(() => import("./pages/Akademik"));
const PPDB = lazy(() => import("./pages/PPDB"));
const LayananDigital = lazy(() => import("./pages/LayananDigital"));
const Kontak = lazy(() => import("./pages/Kontak"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminApp = lazy(() => import("./admin/AdminApp"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Ikon tab browser mengikuti logo yang diunggah di Admin > Profil Sekolah
function SiteFavicon() {
  const { logo } = useSchoolData();
  useEffect(() => {
    if (!logo) return;
    document.head.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]').forEach((link) => {
      link.removeAttribute("type");
      link.href = logo;
    });
  }, [logo]);
  return null;
}

const Loading = () => <div className="page-loading" role="status" aria-live="polite">Memuat…</div>;

export default function App() {
  const { pathname } = useLocation();
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
  return (
    <>
      <ScrollToTop />
      <SiteFavicon />
      {!isAdmin && <Navbar />}
      <main>
      <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/" element={<Home />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/profil/sejarah" element={<Sejarah />} />
        <Route path="/profil/visi-misi" element={<VisiMisi />} />
        <Route path="/profil/struktur" element={<StrukturOrganisasi />} />
        <Route path="/profil/kepala-sekolah" element={<KepalaSekolah />} />
        <Route path="/profil/fasilitas" element={<Fasilitas />} />
        <Route path="/gtk/guru" element={<Guru />} />
        <Route path="/gtk/tendik" element={<Tendik />} />
        <Route path="/berita" element={<Berita />} />
        <Route path="/berita/:id" element={<BeritaDetail />} />
        <Route path="/pengumuman" element={<Pengumuman />} />
        <Route path="/pengumuman/:id" element={<PengumumanDetail />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/prestasi" element={<Prestasi />} />
        <Route path="/ekstrakurikuler" element={<Ekstrakurikuler />} />
        <Route path="/galeri" element={<Galeri />} />
        <Route path="/video" element={<Video />} />
        <Route path="/akademik" element={<Akademik />} />
        <Route path="/ppdb" element={<PPDB />} />
        <Route path="/layanan-digital" element={<LayananDigital />} />
        <Route path="/kontak" element={<Kontak />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
      </main>
      {!isAdmin && <Footer />}
    </>
  );
}
