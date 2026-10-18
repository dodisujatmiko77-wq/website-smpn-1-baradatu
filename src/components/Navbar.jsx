import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Button from "./Button";
import { menuData } from "../data/menuData";
import { useSchoolData } from "../data/publicData";

const FB = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 42 42'%3E%3Crect width='42' height='42' rx='10' fill='%230F4C81'/%3E%3Ctext x='21' y='25' font-size='11' fill='white' text-anchor='middle' font-family='sans-serif'%3ELOGO%3C/text%3E%3C/svg%3E";

const searchPages = [
  ["Profil Sekolah", "/profil", "Profil, identitas, dan informasi sekolah"],
  ["Sejarah", "/profil/sejarah", "Sejarah UPT SMPN 1 Baradatu"],
  ["Visi & Misi", "/profil/visi-misi", "Visi, misi, dan nilai sekolah"],
  ["Struktur Organisasi", "/profil/struktur", "Struktur organisasi sekolah"],
  ["Kepala Sekolah", "/profil/kepala-sekolah", "Profil dan sambutan kepala sekolah"],
  ["Fasilitas Sekolah", "/profil/fasilitas", "Sarana dan prasarana sekolah"],
  ["Guru", "/gtk/guru", "Data dan profil guru"],
  ["Tenaga Kependidikan", "/gtk/tendik", "Data tenaga kependidikan"],
  ["Berita", "/berita", "Berita terbaru sekolah"],
  ["Pengumuman", "/pengumuman", "Pengumuman resmi sekolah"],
  ["Agenda", "/agenda", "Agenda dan kegiatan sekolah"],
  ["Prestasi", "/prestasi", "Prestasi dan pencapaian sekolah"],
  ["Ekstrakurikuler", "/ekstrakurikuler", "Kegiatan ekstrakurikuler"],
  ["Galeri", "/galeri", "Dokumentasi foto kegiatan sekolah"],
  ["Video", "/video", "Video dan dokumentasi sekolah"],
  ["Akademik", "/akademik", "Informasi akademik sekolah"],
  ["PPDB", "/ppdb", "Penerimaan peserta didik baru"],
  ["Layanan Digital", "/layanan-digital", "Aplikasi dan layanan digital sekolah"],
  ["Kontak", "/kontak", "Alamat, telepon, email, dan kontak sekolah"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false), [sub, setSub] = useState(null), [sc, setSc] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false), [query, setQuery] = useState("");
  const searchInputRef = useRef(null);
  const s = useSchoolData();
  const { pathname } = useLocation();

  useEffect(() => {
    const f = () => setSc(window.scrollY > 10);
    f(); window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  useEffect(() => { setOpen(false); setSub(null); }, [pathname]);

  useEffect(() => {
    if (!searchOpen) return;
    const onKey = (e) => { if (e.key === "Escape") setSearchOpen(false); };
    document.addEventListener("keydown", onKey);
    const timer = window.setTimeout(() => searchInputRef.current?.focus(), 40);
    return () => { document.removeEventListener("keydown", onKey); window.clearTimeout(timer); };
  }, [searchOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return searchPages.slice(0, 6);
    return searchPages.filter(([title, path, desc]) => `${title} ${path} ${desc}`.toLowerCase().includes(q)).slice(0, 8);
  }, [query]);

  return (
    <header id="hd" className={sc ? "sc" : ""}>
      <div className="wrap nav">
        <Link className="brand" to="/" aria-label="Beranda">
          <img className="logo" src={s.logo || "/assets/logo.png"} alt="Logo UPT SMPN 1 Baradatu" width="42" height="42"
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FB; }} />
          <span><b>{s.name}</b><small>Kabupaten Way Kanan • Lampung</small></span>
        </Link>
        <nav id="nav" className={open ? "open" : ""} aria-label="Menu utama">
          <ul id="menu">
            {menuData.map(([n, h, items], i) => (
              <li key={n}>
                {items ? (<>
                  <button className="nav-drop-btn" aria-haspopup="true" aria-expanded={sub === i} onClick={() => setSub(sub === i ? null : i)}>
                    <span>{n}</span><span className="nav-chevron" aria-hidden="true">⌄</span>
                  </button>
                  <div className={`dd ${sub === i ? "open" : ""}`}>{items.map(([l, u]) => <Link key={u} to={u}>{l}</Link>)}</div>
                </>) : <NavLink to={h} end={h === "/"}>{n}</NavLink>}
              </li>
            ))}
          </ul>
        </nav>
        <div className="nav-actions">
          <Button to="/layanan-digital">▣&nbsp; Portal Digital</Button>
          <button className="search-btn" type="button" aria-label="Buka pencarian" title="Pencarian" onClick={() => setSearchOpen(true)}>
            <span aria-hidden="true">⌕</span>
          </button>
        </div>
        <button id="burger" aria-label="Buka menu" aria-expanded={open} onClick={() => setOpen(!open)}>☰</button>
      </div>

      {searchOpen && (
        <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Pencarian website" onMouseDown={(e) => { if (e.target === e.currentTarget) setSearchOpen(false); }}>
          <div className="search-panel">
            <div className="search-head">
              <div><span className="search-eyebrow">CARI DI WEBSITE</span><h2>Pencarian</h2></div>
              <button className="search-close" type="button" onClick={() => setSearchOpen(false)} aria-label="Tutup pencarian">×</button>
            </div>
            <label className="search-field">
              <span aria-hidden="true">⌕</span>
              <input ref={searchInputRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari berita, guru, akademik, PPDB, galeri..." aria-label="Kata pencarian" />
              {query && <button type="button" onClick={() => setQuery("")} aria-label="Hapus pencarian">×</button>}
            </label>
            <div className="search-results" aria-live="polite">
              {results.length ? results.map(([title, path, desc]) => (
                <Link key={path} to={path} onClick={() => { setSearchOpen(false); setQuery(""); }}>
                  <span className="search-result-icon" aria-hidden="true">→</span>
                  <span><strong>{title}</strong><small>{desc}</small></span>
                </Link>
              )) : <div className="search-empty"><strong>Tidak ada hasil</strong><span>Coba gunakan kata kunci lain.</span></div>}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
