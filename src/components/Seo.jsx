import { Helmet } from "react-helmet-async";
export default function Seo({ title, description }) {
  return <Helmet><title>{title}</title><meta name="description" content={description} /><meta property="og:title" content={title} /></Helmet>;
}
