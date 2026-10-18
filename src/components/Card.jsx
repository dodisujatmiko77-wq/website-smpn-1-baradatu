export default function Card({ as: T = "article", className = "", children, ...rest }) {
  return <T className={`card ${className}`.trim()} {...rest}>{children}</T>;
}
