/**
 * '사랑받는 찬송가 100' 데이터. content/hymns.json 한 파일만 고치면
 * /hymns 목록, /hymns/[n] 곡 페이지, sitemap, 검색, 홈 카드가 함께 바뀝니다.
 * 저작권: 한국어 가사는 넣지 않습니다(제목=첫 줄만). 영어 원문은 공개 영역(PD)인 것만 lyricsEn에 넣습니다.
 */
import data from "@/content/hymns.json";

export type Link = { label: string; url: string };
export type Hymn = {
  /** 새찬송가(2006) 장 번호 */
  n: number;
  /** 통일찬송가(1983) 장 번호 */
  tong?: number | null;
  /** 한국어 제목(첫 줄) */
  title: string;
  /** 원제(번역 찬송일 때) */
  en?: string | null;
  /** 원작 나라·구분 (예: 영국, 미국, 한국 창작) */
  origin: string;
  text: string;
  music: string;
  tune?: string;
  story: string;
  refs: string[];
  tags: string[];
  note?: string;
  /** 공개 영역 영어 원문 (절 단위). 반드시 출처 본문과 한 글자씩 대조한 것만 넣습니다. */
  lyricsEn?: string[];
  /** lyricsEn을 대조한 공개 영역 출처 (Hymnary.org 본문 페이지, CCEL, Wikisource 등) */
  lyricsSource?: Link;
  /** Hymnary.org 곡(text) 페이지 직접 링크. 없으면 검색 링크를 씁니다. */
  hymnary?: string;
};

const D = data as unknown as {
  intro: string;
  method: string[];
  copyright: string[];
  sources: Link[];
  checked: string;
  hymns: Hymn[];
};

export const HYMNS_PATH = "/hymns";
export const HYMNS_TITLE = "사랑받는 찬송가 100";
export const HYMNS_INTRO = D.intro;
export const HYMNS_METHOD = D.method;
export const HYMNS_COPYRIGHT = D.copyright;
export const HYMNS_SOURCES = D.sources;
export const HYMNS_CHECKED = D.checked;

export function getHymns(): Hymn[] {
  return D.hymns;
}

export function getHymn(n: number | string) {
  const k = Number(n);
  return D.hymns.find((h) => h.n === k);
}

export function hymnPath(h: Pick<Hymn, "n">) {
  return `${HYMNS_PATH}/${h.n}`;
}

/** 주제 태그(곡 수 많은 순) */
export function hymnTags(): [string, number][] {
  const m = new Map<string, number>();
  D.hymns.forEach((h) => h.tags.forEach((t) => m.set(t, (m.get(t) || 0) + 1)));
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

/** 원제에서 괄호 설명을 뺀 영어 제목 */
export function enTitle(h: Hymn) {
  return h.en ? h.en.replace(/\s*\(.*?\)\s*/g, " ").trim() : "";
}

export function youtubeUrl(h: Hymn) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(`새찬송가 ${h.n}장 ${h.title}`)}`;
}

export function hymnarySearchUrl(h: Hymn) {
  if (h.hymnary) return h.hymnary;
  return h.en ? `https://hymnary.org/search?qu=${encodeURIComponent(enTitle(h))}` : "";
}

/** "토머스 켄(Thomas Ken), 1674년경" → "토머스 켄" */
export function shortName(s: string) {
  return s.split(" / ")[0].replace(/\(.*?\)/g, "").split(",")[0].trim();
}
