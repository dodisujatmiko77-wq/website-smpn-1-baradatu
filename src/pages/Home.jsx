import Seo from "../components/Seo";
import Hero from "../sections/Hero";
import Sambutan from "../sections/Sambutan";
import ProfilSekolah from "../sections/ProfilSekolah";
import VisiMisi from "../sections/VisiMisi";
import Berita from "../sections/Berita";
import Pengumuman from "../sections/Pengumuman";
import Agenda from "../sections/Agenda";
import Prestasi from "../sections/Prestasi";
import Ekstrakurikuler from "../sections/Ekstrakurikuler";
import Galeri from "../sections/Galeri";
import EkosistemDigital from "../sections/EkosistemDigital";
import PPDB from "../sections/PPDB";
import Kontak from "../sections/Kontak";
import { useHomeSettings } from "../data/publicData";

export default function Home() {
  const visible = useHomeSettings();
  return (
    <div className="home-page">
      <Seo
        title="UPT SMPN 1 Baradatu | Website Resmi Sekolah"
        description="Website resmi UPT SMPN 1 Baradatu, Kabupaten Way Kanan, Lampung."
      />

      {visible.hero && <Hero />}

      {visible.sambutan || visible.profil ? <section id="profil" className="home-section home-profile">
        <div className="wrap two">
          <Sambutan />
          <ProfilSekolah />
        </div>
      </section> : null}

      {visible.visiMisi && <section className="home-section visi" aria-label="Visi dan Misi">
        <div className="wrap vgrid">
          <VisiMisi />
        </div>
      </section>}

      {(visible.berita || visible.pengumuman) && <section className="home-section">
        <div className="wrap news">
          {visible.berita && <Berita />}
          {visible.pengumuman && <Pengumuman />}
        </div>
      </section>}

      {(visible.agenda || visible.prestasi) && <section className="home-section compact-section">
        <div className="wrap home-pair agenda-prestasi">
          {visible.agenda && <Agenda />}
          {visible.prestasi && <Prestasi />}
        </div>
      </section>}

      {(visible.ekstrakurikuler || visible.galeri) && <section className="home-section compact-section">
        <div className="wrap home-pair ekskul-galeri">
          {visible.ekstrakurikuler && <Ekstrakurikuler />}
          {visible.galeri && <Galeri />}
        </div>
      </section>}

      {(visible.digital || visible.ppdb) && <section className="home-section dig" id="digital">
        <div className="wrap dgrid">
          {visible.digital && <EkosistemDigital />}
          {visible.ppdb && <PPDB />}
        </div>
      </section>}

      {visible.kontak && <section id="kontak" className="home-section">
        <div className="wrap kg">
          <Kontak />
        </div>
      </section>}
    </div>
  );
}
