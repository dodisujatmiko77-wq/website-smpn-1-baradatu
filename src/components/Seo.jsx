import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

// Domain resmi dipakai untuk canonical & Open Graph. Isi VITE_SITE_URL di Netlify (mis. https://smpn1baradatu.sch.id).
const SITE_URL = (import.meta.env.VITE_SITE_URL || (typeof window !== "undefined" ? window.location.origin : "")).replace(/\/$/, "");
const DEFAULT_IMAGE = "/assets/og-image.png";
const abs = (u) => (/^https?:\/\//.test(u) ? u : `${SITE_URL}${u.startsWith("/") ? u : `/${u}`}`);

export default function Seo({ title, description, image, type = "website", noindex = false }) {
  const { pathname } = useLocation();
  const url = `${SITE_URL}${pathname}`;
  const img = abs(image && !image.startsWith("data:") ? image : DEFAULT_IMAGE);
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex" />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
}
