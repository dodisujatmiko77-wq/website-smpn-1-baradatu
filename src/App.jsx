import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Profil from "./pages/Profil";
import Sejarah from "./pages/Sejarah";
import VisiMisi from "./pages/VisiMisi";
import StrukturOrganisasi from "./pages/StrukturOrganisasi";
import KepalaSekolah from "./pages/KepalaSekolah";
import Fasilitas from "./pages/Fasilitas";
import Guru from "./pages/Guru";
import Tendik from "./pages/Tendik";
import Berita from "./pages/Berita";
import Pengumuman from "./pages/Pengumuman";
import Agenda from "./pages/Agenda";
import Prestasi from "./pages/Prestasi";
import Ekstrakurikuler from "./pages/Ekstrakurikuler";
import Galeri from "./pages/Galeri";
import Video from "./pages/Video";
import Akademik from "./pages/Akademik";
import PPDB from "./pages/PPDB";
import LayananDigital from "./pages/LayananDigital";
import Kontak from "./pages/Kontak";
import NotFound from "./pages/NotFound";
import AdminApp from "./admin/AdminApp";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      {!window.location.pathname.startsWith("/admin") && <Navbar />}
      <main>
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
        <Route path="/pengumuman" element={<Pengumuman />} />
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
      </main>
      {!window.location.pathname.startsWith("/admin") && <Footer />}
    </>
  );
}
