// Ikon layanan digital: gambar logo (URL / unggahan) atau emoji
export const isImageIcon = (v) => typeof v === "string" && /^(https?:\/\/|\/|data:image\/)/.test(v.trim());

export default function ServiceIcon({ icon, color, className }) {
  if (isImageIcon(icon)) {
    return <span className={`${className} service-logo`} aria-hidden="true"><img src={icon} alt="" loading="lazy" /></span>;
  }
  return <span className={className} style={{ background: color }} aria-hidden="true">{icon}</span>;
}
