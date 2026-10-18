// Tampilan saat data belum ada (beranda & halaman daftar)
export default function EmptyState({ icon, title, text, tone = "blue" }) {
  return (
    <div className={`empty-state tone-${tone}`} role="status">
      <span className="empty-state-icon" aria-hidden="true">{icon}</span>
      <div><strong>{title}</strong>{text && <p>{text}</p>}</div>
    </div>
  );
}
