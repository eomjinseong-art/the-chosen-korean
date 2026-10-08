import type { MetadataRoute } from "next";
import { getGuide } from "@/lib/guide";
import { SITE_URL } from "@/lib/site";
import { getWorks, TOGETHER_PATH, workPath } from "@/lib/together";
import { getHymns, HYMNS_PATH, hymnPath } from "@/lib/hymns";
import { BIBLE_BOOKS_PATH, bookPath, getBooks } from "@/lib/bibleBooks";
import { FAMILY_TREE_PATH } from "@/lib/familyTree";

export default function sitemap(): MetadataRoute.Sitemap {
  const g = getGuide();
  const now = new Date();
  const paths = [
    "/",
    "/intro",
    "/characters",
    "/verses",
    "/daily",
    "/scenes",
    "/creators",
    "/creators/dallas-jenkins",
    "/making",
    "/map",
    TOGETHER_PATH,
    ...getWorks().map(workPath),
    HYMNS_PATH,
    ...getHymns().map(hymnPath),
    BIBLE_BOOKS_PATH,
    FAMILY_TREE_PATH,
    ...getBooks().map(bookPath),
    ...g.seasons.map((s) => s.path),
    ...g.episodes.map((e) => e.path),
    ...g.characters.filter((c) => c.slug).map((c) => `/characters/${c.slug}`),
  ];
  return paths.map((p) => ({
    url: p === "/" ? `${SITE_URL}/` : `${SITE_URL}${p}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: p === "/" ? 1 : /^\/s\d+$/.test(p) ? 0.8 : 0.6,
  }));
}
