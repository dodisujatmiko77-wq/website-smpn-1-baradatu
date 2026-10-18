// Data publik yang bisa diubah dari panel admin. Nilai kosong di admin tidak menimpa data bawaan.
import { useEffect, useMemo, useState } from 'react';
import { schoolData } from './schoolData';
import { fetchSchoolSettings } from './siteStore';

const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

// "2026-10-12" -> "12 Oktober 2026"; teks lain dikembalikan apa adanya
export function fmtDate(value) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value || ''));
  if (!m) return value || '';
  return `${Number(m[3])} ${MONTHS[Number(m[2]) - 1] || ''} ${m[1]}`.trim();
}

const filled = (v) => typeof v === 'string' ? v.trim() !== '' : v != null;

export function useSchoolData() {
  const [settings, setSettings] = useState(null);
  useEffect(() => {
    let alive = true;
    const run = () => fetchSchoolSettings().then((x) => { if (alive) setSettings(x); }).catch(() => {});
    run();
    window.addEventListener('smpn-site-change', run);
    return () => { alive = false; window.removeEventListener('smpn-site-change', run); };
  }, []);
  return useMemo(() => {
    if (!settings) return schoolData;
    const own = Object.fromEntries(Object.entries(settings).filter(([k, v]) => k in schoolData && filled(v)));
    return { ...schoolData, ...own };
  }, [settings]);
}
