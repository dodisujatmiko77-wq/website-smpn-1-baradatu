export default function PageHeader({ title, sub }) {
  return <div className="phead"><div className="wrap"><h1>{title}</h1>{sub && <p>{sub}</p>}</div></div>;
}
