/**
 * '같이 보면 좋은 콘텐츠' 데이터. content/together.json 한 파일만 고치면
 * /together 목록, /together/[slug] 작품 페이지, sitemap, 검색, 홈 카드가 함께 바뀝니다.
 */
import data from "@/content/together.json";

export type Link = { label: string; url: string };
export type FactStatus = "consensus" | "debated" | "faith" | "mixed";
export type Fact = {
  id: string;
  title: string;
  status: FactStatus;
  film: string;
  evidence: string[];
  debate: string[];
  study: Link[];
  table?: { header: string[]; rows: string[][] };
};
export type WorkVerse = { ref: string; refEn: string; en: string; ko: string; note?: string };
export type Work = {
  slug: string;
  titleKo: string;
  titleEn: string;
  year: number;
  kind: string; // 영화, 다큐, 드라마 ...
  runtime?: string;
  rating?: string;
  tagline: string;
  info: { label: string; value: string }[];
  watch?: Link;
  plot: string[];
  source: { real: string[]; middle?: string[]; adapted: string[] };
  /** 실화/각색 박스 칸 제목을 바꿀 때 (예: 성경 / 외경 / 영화 창작) */
  sourceLabels?: { real?: string; middle?: string; adapted?: string };
  /** 출처 박스 제목을 바꿀 때 (없으면 기본 문구) */
  sourceHeading?: string;
  /** 페이지 문구에 쓰는 매체 이름 ("영화에 나온 사실" 등). 없으면 "영화" */
  medium?: string;
  people: { name: string; actor?: string; real?: string; role: string }[];
  points: string[];
  chosen: { text: string; href?: string; label?: string }[];
  /** 관련 페이지(사이트 안 링크). 비교표가 아니라 링크만 둡니다 */
  related?: { label: string; href: string; text?: string }[];
  /** 다른 사이트의 같은 이야기 */
  elsewhere?: { label: string; href: string }[];
  verses?: WorkVerse[];
  verseNote?: string;
  factsIntro?: string;
  facts?: Fact[];
  sources: Link[];
  checked: string;
};

const D = data as { intro: string; works: Work[] };

export const TOGETHER_INTRO = D.intro;
export const TOGETHER_PATH = "/together";

export function getWorks(): Work[] {
  return D.works;
}

export function getWork(slug: string) {
  return D.works.find((w) => w.slug === slug);
}

export function workPath(w: Work) {
  return `${TOGETHER_PATH}/${w.slug}`;
}

/** 페이지 문구용 매체 이름: 영화 / 드라마 등 */
export function mediumOf(w: Pick<Work, "medium">): string {
  return w.medium || "영화";
}

export const STATUS_LABEL: Record<FactStatus, { text: string; cls: string }> = {
  consensus: { text: "🏛️ 역사학계 합의", cls: "st-consensus" },
  debated: { text: "⚖️ 학계 의견 갈림", cls: "st-debated" },
  faith: { text: "🙏 믿음의 영역", cls: "st-faith" },
  mixed: { text: "🏛️ 합의 + ⚖️ 논쟁 + 🙏 믿음", cls: "st-mixed" },
};
