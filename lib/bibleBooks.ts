/**
 * '성경 66권 한눈에' 데이터. content/bible-books.json 한 파일만 고치면
 * /bible-books 목록, /bible-books/[slug] 책 페이지, sitemap, 검색, 홈 카드가 함께 바뀝니다.
 * 관련 에피소드·성경 구절·찬송가·같이 보기 작품은 장·절 표기("창세기 22장", "요한복음 3:16")로 자동 연결하고,
 * 자동으로 잡히지 않는 연결만 related에 직접 적습니다.
 */
import data from "@/content/bible-books.json";
import { getGuide } from "@/lib/guide";
import { getHymns, hymnPath } from "@/lib/hymns";
import { getWorks, workPath } from "@/lib/together";

export type Link = { label: string; url: string };
export type Related = { label: string; href: string; text?: string };
export type Testament = "구약" | "신약";
export type BibleBook = {
  slug: string;
  /** 성경 순서 1~66 */
  order: number;
  testament: Testament;
  group: string;
  /** 개역개정·새번역 표준 이름 */
  ko: string;
  en: string;
  chapters: number;
  /** 전통적 저자 */
  author: string;
  /** [합의]/[논쟁]/[믿음] 표시가 붙은 견해 */
  view: string[];
  dateTrad: string;
  dateSch: string;
  /** 책이 다루는 시대 */
  period: string;
  notes: string[];
  keyVerse: { ref: string; refEn: string; en: string; ko: string };
  related: Related[];
  sources: Link[];
};
export type Group = { name: string; en: string; desc: string };

const D = data as unknown as {
  checked: string;
  intro: string;
  tags: string[];
  method: string[];
  sources: Link[];
  groups: Record<Testament, Group[]>;
  books: BibleBook[];
};

export const BIBLE_BOOKS_PATH = "/bible-books";
export const BIBLE_BOOKS_TITLE = "성경 66권 한눈에";
export const BIBLE_BOOKS_INTRO = D.intro;
export const BIBLE_BOOKS_TAGS = D.tags;
export const BIBLE_BOOKS_METHOD = D.method;
export const BIBLE_BOOKS_SOURCES = D.sources;
export const BIBLE_BOOKS_CHECKED = D.checked;
export const TESTAMENTS: Testament[] = ["구약", "신약"];

export function getBooks(): BibleBook[] {
  return D.books;
}

export function getBook(slug: string) {
  return D.books.find((b) => b.slug === slug);
}

export function bookPath(b: Pick<BibleBook, "slug">) {
  return `${BIBLE_BOOKS_PATH}/${b.slug}`;
}

export function getGroups(t: Testament): (Group & { books: BibleBook[] })[] {
  return D.groups[t].map((g) => ({ ...g, books: D.books.filter((b) => b.testament === t && b.group === g.name) }));
}

/** "창세기 22장", "요한복음 3:16" 처럼 책 이름 바로 뒤에 장 번호가 오는 표기 */
function refRe(b: BibleBook) {
  return new RegExp(`(^|[^가-힣])${b.ko}\\s*\\d`);
}

export type AutoLinks = {
  episodes: { path: string; label: string; refs: string }[];
  verses: { id: string; ref: string }[];
  hymns: { href: string; label: string; ref: string }[];
  works: { href: string; label: string; refs: string }[];
};

/** 이 책을 인용하는 에피소드·구절·찬송가·같이 보기 작품 (빌드 때 계산) */
export function autoLinks(b: BibleBook): AutoLinks {
  const re = refRe(b);
  const refsIn = (s: string) => {
    const out = new Set<string>();
    const r = new RegExp(`${b.ko}\\s*[0-9][0-9:,\\-장편절 ]*`, "g");
    for (const m of s.matchAll(r)) {
      const i = m.index ?? 0;
      if (i > 0 && /[가-힣]/.test(s[i - 1])) continue;
      out.add(m[0].trim().replace(/[,\s]+$/, ""));
    }
    return [...out].join(", ");
  };
  const g = getGuide();
  const episodes = g.episodes
    .filter((e) => re.test(e.sourceRaw))
    .map((e) => ({ path: e.path, label: `시즌 ${e.season} ${e.ep}화 「${e.titleKo}」`, refs: refsIn(e.sourceRaw) }));
  const verses = g.verses.filter((v) => v.ref.startsWith(b.ko + " ")).map((v) => ({ id: v.id, ref: v.ref }));
  const hymns = getHymns()
    .flatMap((h) => {
      const r = h.refs.find((x) => x.startsWith(b.ko + " "));
      return r ? [{ href: hymnPath(h), label: `${h.n}장 「${h.title}」`, ref: r }] : [];
    });
  const works = getWorks().flatMap((w) => {
    const refs = (w.verses || []).map((v) => v.ref).filter((r) => r.startsWith(b.ko + " "));
    return refs.length ? [{ href: workPath(w), label: `「${w.titleKo}」`, refs: refs.join(", ") }] : [];
  });
  return { episodes, verses, hymns, works };
}
