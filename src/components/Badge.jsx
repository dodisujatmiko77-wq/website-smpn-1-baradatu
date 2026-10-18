// tag = label kategori; type = PENTING | INFO | BARU
export default function Badge({ type, tag, children }) {
  return <span className={tag ? "tag" : `bd ${type}`}>{children || type}</span>;
}
