import { Link } from "react-router-dom";
export default function SectionHead({ title, sub, to, label = "Lihat Semua", style }) {
  return (
    <div className="head" style={style}>
      <div><h2>{title}</h2>{sub && <p>{sub}</p>}</div>
      {to && <Link className="more" to={to}>{label}</Link>}
    </div>
  );
}
