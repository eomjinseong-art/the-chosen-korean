import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "./site";

export function absoluteUrl(path: string) {
  if (!path || path === "/") return SITE_URL + "/";
  return SITE_URL + (path.startsWith("/") ? path : "/" + path);
}

export function clip(text: string, max = 150) {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length <= max ? t : t.slice(0, max - 1).trim() + "…";
}

export function pageMeta({
  title,
  description,
  path,
  absoluteTitle = false,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
  type?: "website" | "article";
}): Metadata {
  const url = absoluteUrl(path);
  const full = absoluteTitle ? title : `${title} | ${SITE_NAME}`;
  const desc = clip(description, 155);
  const image = { url: "/og.png", width: 1200, height: 630, alt: SITE_NAME };
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description: desc,
    alternates: { canonical: url },
    openGraph: { type, locale: "ko_KR", siteName: SITE_NAME, url, title: full, description: desc, images: [image] },
    twitter: { card: "summary_large_image", title: full, description: desc, images: [image.url] },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  const all = [{ name: "홈", path: "/" }, ...items];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: absoluteUrl(c.path) })),
  };
}

export const SERIES_LD = {
  "@type": "TVSeries",
  name: "The Chosen",
  alternateName: "더 초즌",
  director: { "@type": "Person", name: "Dallas Jenkins" },
};
