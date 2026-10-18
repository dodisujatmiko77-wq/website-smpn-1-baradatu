import { useRef, useState } from 'react';
import { uploadMedia } from '../data/siteStore';

// Kolom foto: unggah file (disimpan di Supabase Storage) atau tempel URL.
export default function ImageField({ label, value, onChange, folder = 'umum', wide = false, maxSize = 1600 }) {
  const [busy, setBusy] = useState('');
  const fileRef = useRef(null);
  async function pick(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    setBusy('Memproses…');
    try { onChange(await uploadMedia(file, folder, { maxSize, onStatus: setBusy })); }
    catch (err) { alert(err.message || 'Gagal mengunggah foto.'); }
    finally { setBusy(''); }
  }
  return (
    <label className="image-field" style={wide ? { gridColumn: '1 / -1' } : undefined}>
      {label}
      <div className="image-field-row">
        {value ? <img src={value} alt="" className="image-field-preview" /> : <span className="image-field-preview empty">Belum ada foto</span>}
        <div className="image-field-controls">
          <input value={value && value.startsWith('data:') ? '(foto tersimpan di browser)' : value || ''} onChange={(e) => onChange(e.target.value)} placeholder="https://… atau unggah file" readOnly={Boolean(value && value.startsWith('data:'))} />
          <div className="image-field-buttons">
            <button type="button" className="mini-btn" onClick={() => fileRef.current && fileRef.current.click()} disabled={Boolean(busy)}>{busy || 'Unggah Foto'}</button>
            {value && <button type="button" className="mini-btn danger" onClick={() => onChange('')} disabled={Boolean(busy)}>Hapus</button>}
          </div>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden tabIndex={-1} aria-hidden="true" onChange={pick} />
        </div>
      </div>
      <small className="image-field-hint">JPG/PNG/WEBP. Foto besar diperkecil otomatis sebelum diunggah.</small>
    </label>
  );
}
