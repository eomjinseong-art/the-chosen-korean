export const SITE_URL = "https://the-chosen-korean.vercel.app";
export const SITE_NAME = "더 초즌 한국어 가이드";
export const SITE_FULL_NAME = "더 초즌(The Chosen) 한국어 가이드";
export const SITE_DESCRIPTION =
  "성경을 몰라도 따라갈 수 있는 드라마 더 초즌(The Chosen) 시즌 1~5 전 40화 한국어 가이드. 화별 줄거리, 등장인물, 성경 기반과 드라마 창작 구분, 성경 구절(영어 KJV + 한글)을 정리했습니다.";
export const VISITOR_NAMESPACE = "the-chosen-korean";
export const VISITOR_KEY = "visits";
export const GOOGLE_SITE_VERIFICATION = "LglMaYLzS6dacAPQ5ZgZdPgzdtfLbp_1Rk5vh3WNPlM";

/** Site-level policy: keep "where to watch" vague (varies by country). */
export const WATCH_NOTE =
  "넷플릭스 오리지널이 아닙니다. 넷플릭스 등 OTT에서 볼 수 있으며, 제공처는 국가·시기별로 다릅니다.";

export type SisterLink = { href: string; name: string; en: string };

/**
 * Canonical 11-site order. iliad-stories is being built in parallel and may 404
 * until that site ships. Link checkers must allow LINK_CHECK_ALLOW_404.
 */
const NADOO_FAMILY: SisterLink[] = [
  { href: "https://nadoo-myth.vercel.app", name: "나두신화", en: "Myth" },
  { href: "https://iliad-stories.vercel.app", name: "일리아스이야기", en: "The Iliad" },
  { href: "https://greece-stories.vercel.app", name: "그리스이야기", en: "Greece" },
  { href: "https://rome-stories.vercel.app", name: "로마이야기", en: "Rome" },
  { href: "https://egypt-stories.vercel.app", name: "이집트이야기", en: "Egypt" },
  { href: "https://persia-stories.vercel.app", name: "페르시아이야기", en: "Persia" },
  { href: "https://the-chosen-korean.vercel.app", name: "더 초즌 · 성경", en: "The Chosen · Bible" },
  { href: "https://philosophy-stories.vercel.app", name: "철학이야기", en: "Philosophy" },
  { href: "https://korea-stories.vercel.app", name: "대한민국이야기", en: "Korea" },
  { href: "https://nadoo-timeline.vercel.app", name: "나두연표", en: "Timeline" },
  { href: "https://tinalinkeom.vercel.app", name: "나두 허브", en: "Nadoo Hub" },
];

/** Sister sites in canonical order, skipping this site. */
export const NADOO_SISTERS: SisterLink[] = NADOO_FAMILY.filter((site) => site.href !== SITE_URL);

/** Origins a link checker must not fail on while those sites are still being built. */
export const LINK_CHECK_ALLOW_404 = ["https://iliad-stories.vercel.app"];

export function isLinkCheckAllowed404(url: string) {
  return LINK_CHECK_ALLOW_404.some((origin) => url === origin || url.startsWith(`${origin}/`));
}

if (!NADOO_SISTERS.some((site) => isLinkCheckAllowed404(site.href))) {
  throw new Error("일리아스이야기는 자매 사이트 목록과 링크 검사 허용 목록에 있어야 합니다.");
}

/** Shared row A. This site's own family tree is omitted. */
export const OTHER_FAMILY_TREES: SisterLink[] = [
  { href: "https://rome-stories.vercel.app/family-tree", name: "로마이야기", en: "Rome" },
  { href: "https://greece-stories.vercel.app/family-tree", name: "그리스이야기", en: "Greece" },
  { href: "https://egypt-stories.vercel.app/family-tree", name: "이집트이야기", en: "Egypt" },
  { href: "https://persia-stories.vercel.app/family-tree", name: "페르시아이야기", en: "Persia" },
  { href: "https://korea-stories.vercel.app/family-tree", name: "대한민국이야기", en: "Korea" },
  { href: "https://nadoo-myth.vercel.app/family-tree", name: "나두신화", en: "Myth" },
];

/** Shared row B. This site's own /together page is omitted. */
export const OTHER_FILM_PAGES: SisterLink[] = [
  { href: "https://rome-stories.vercel.app/movies", name: "로마이야기", en: "Rome" },
  { href: "https://greece-stories.vercel.app/movies", name: "그리스이야기", en: "Greece" },
  { href: "https://egypt-stories.vercel.app/movies", name: "이집트이야기", en: "Egypt" },
  { href: "https://persia-stories.vercel.app/movies", name: "페르시아이야기", en: "Persia" },
  { href: "https://korea-stories.vercel.app/films", name: "대한민국이야기", en: "Korea" },
  { href: "https://philosophy-stories.vercel.app/films", name: "철학이야기", en: "Philosophy" },
  { href: "https://nadoo-myth.vercel.app/in-media", name: "나두신화", en: "Myth" },
];
