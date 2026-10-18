import { Link } from "react-router-dom";
const V = { amber: "b-a", primary: "b-p", outline: "b-o", plain: "" };
// to = halaman internal (Link), href = anchor/eksternal
export default function Button({ to, href, variant = "amber", className = "", children, ...rest }) {
  const c = `btn ${V[variant]} ${className}`.replace(/\s+/g, " ").trim();
  if (/^(https?:|mailto:|tel:)/.test(to || "")) return <a href={to} className={c} {...rest}>{children}</a>;
  return to ? <Link to={to} className={c} {...rest}>{children}</Link> : <a href={href} className={c} {...rest}>{children}</a>;
}
