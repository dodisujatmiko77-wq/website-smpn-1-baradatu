// Foto dengan placeholder otomatis bila src kosong
export default function Photo({ src, alt, className = "", ...rest }) {
  return (
    <div className={`ph ${className}`.trim()} {...rest}>
      {src ? <img src={src} alt={alt} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : alt}
    </div>
  );
}
