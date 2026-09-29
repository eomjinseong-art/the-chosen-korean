/**
 * Build-time parser for content/the-chosen-guide.md — the single source of truth.
 * Every page is generated from what this module returns.
 */
import fs from "node:fs";
import path from "node:path";
import { CANON, Resolved, anchorId, resolveName, splitNames } from "./characters";

export type Table = { header: string[]; rows: string[][] };
export type SourceSegment = { kind: "bible" | "drama"; label: string; items: string[] };
export type EpisodeCharacter = { raw: string; names: Resolved[]; role: string };

export type Episode = {
  season: number;
  ep: number;
  code: string; // S1E1
  path: string; // /s1/e1
  titleEn: string;
  titleKo: string;
  suffix?: string; // e.g. 최종화
  plot: string;
  sourceRaw: string;
  sourceSegments: SourceSegment[] | null; // null -> render inline
  sourceKind: "bible" | "mixed" | "drama";
  characters: EpisodeCharacter[];
  point: string;
};

export type Season = {
  season: number;
  path: string;
  summary: string;
  notes: string[];
  easyGuide: Table | null;
  cast: Table | null;
  episodes: Episode[];
};

export type Verse = {
  id: string;
  ref: string; // 요한복음 3:16
  refEn: string; // John 3:16
  book: string; // 요한복음
  en: string;
  ko: string;
  episodes: string[]; // S1E1 codes
  mustKnow?: number; // 1..10
};

export type CharacterGroup = "disciples" | "around" | "opposition" | "extra" | "other";

export type Character = {
  key: string;
  slug?: string;
  name: string;
  group: CharacterGroup;
  sectionName?: string; // as written in section 2
  info: { label: string; value: string }[];
  seasonRoles: { season: number; role: string }[];
  appearances: { code: string; path: string; title: string; role: string }[];
};

export type Guide = {
  title: string;
  subtitle: string;
  intro: string[];
  basics: Table;
  threeLine: string[];
  glossary: Table;
  seasons: Season[];
  episodes: Episode[];
  verseNote: string[];
  verses: Verse[];
  appendix: Table | null;
  limitation: string;
  characters: Character[];
};

const FILE = path.join(process.cwd(), "content", "the-chosen-guide.md");

/* ---------- helpers ---------- */

export function stripMd(s: string) {
  return s
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function cells(line: string) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());
}

function tableAt(lines: string[], from: number, to = lines.length): Table | null {
  let i = from;
  while (i < to && !lines[i].trim().startsWith("|")) i++;
  if (i >= to) return null;
  const header = cells(lines[i]);
  i += 2; // skip separator
  const rows: string[][] = [];
  while (i < to && lines[i].trim().startsWith("|")) rows.push(cells(lines[i++]));
  return { header, rows };
}

function findLine(lines: string[], re: RegExp, from = 0, to = lines.length) {
  for (let i = from; i < to; i++) if (re.test(lines[i])) return i;
  return -1;
}

function blockquote(lines: string[], from: number, to: number) {
  const out: string[] = [];
  let i = findLine(lines, /^>/, from, to);
  if (i < 0) return out;
  while (i < to && lines[i].startsWith(">")) {
    const t = lines[i].replace(/^>\s?/, "").trim();
    if (t) out.push(t);
    i++;
  }
  return out;
}

/** split "a(b, c), d" on top-level commas */
function splitTop(s: string) {
  const out: string[] = [];
  let depth = 0;
  let cur = "";
  for (const ch of s) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) {
      out.push(cur.trim());
      cur = "";
    } else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out.filter(Boolean);
}

function parseSource(raw: string): { segs: SourceSegment[] | null; kind: Episode["sourceKind"] } {
  const hasBible = raw.includes("[성경 기반]");
  const hasDrama = raw.includes("[드라마 창작]");
  const mostlyDrama = /대부분\s*\[드라마 창작\]/.test(raw);
  const kind: Episode["sourceKind"] = hasBible && !hasDrama ? "bible" : hasBible && !mostlyDrama ? "mixed" : "drama";
  const m = /^(대부분\s*)?\[/.exec(raw.trim());
  if (!m) return { segs: null, kind };
  const segs: SourceSegment[] = [];
  const parts = raw.trim().split(/(\[성경 기반\]|\[드라마 창작\])/);
  let prefix = "";
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (p === "[성경 기반]" || p === "[드라마 창작]") {
      const kindSeg = p === "[성경 기반]" ? "bible" : "drama";
      const text = (parts[i + 1] || "").replace(/^\s*[—/-]\s*/, "").replace(/\s*\/\s*$/, "").trim();
      const pre = prefix.trim();
      segs.push({
        kind: kindSeg,
        label: (pre ? pre + " " : "") + (kindSeg === "bible" ? "성경에 있는 이야기" : "드라마 창작"),
        items: text ? splitTop(text) : [],
      });
      prefix = "";
      i++;
    } else prefix = p;
  }
  return { segs, kind };
}

/* ---------- main parse ---------- */

let cache: Guide | null = null;

export function getGuide(): Guide {
  if (cache) return cache;
  const src = fs.readFileSync(FILE, "utf8").replace(/\r\n/g, "\n");
  const lines = src.split("\n");

  const title = stripMd(lines[findLine(lines, /^# /)].replace(/^# /, ""));
  const subtitle = stripMd((lines[findLine(lines, /^### /)] || "").replace(/^### /, ""));
  const s0 = findLine(lines, /^## 0\./);
  const s1 = findLine(lines, /^## 1\./);
  const s2 = findLine(lines, /^## 2\./);
  const firstSeason = findLine(lines, /^# \d+\.\s*시즌/);
  const s8 = findLine(lines, /^# \d+\.\s*.*성경 명언/);

  const intro = blockquote(lines, 0, s0).map((l) => l.replace(/^-\s*/, ""));
  const basics = tableAt(lines, s0, s1)!;
  const tl = findLine(lines, /^### 줄거리를 3줄로/, s0, s1);
  const threeLine: string[] = [];
  for (let i = tl + 1; i < s1; i++) {
    const m = /^\d+\.\s+(.*)$/.exec(lines[i]);
    if (m) threeLine.push(m[1]);
  }
  const glossary = tableAt(lines, s1, s2)!;

  /* section 2 groups */
  const groupDefs: { re: RegExp; group: CharacterGroup }[] = [
    { re: /^### 2-1/, group: "disciples" },
    { re: /^### 2-2/, group: "around" },
    { re: /^### 2-3/, group: "opposition" },
  ];
  const chars = new Map<string, Character>();
  const ensure = (r: Resolved, group: CharacterGroup = "other"): Character => {
    let c = chars.get(r.key);
    if (!c) {
      c = {
        key: r.key,
        slug: r.canon?.slug,
        name: r.name,
        group: r.canon?.extra ? "extra" : group,
        info: [],
        seasonRoles: [],
        appearances: [],
      };
      chars.set(r.key, c);
    }
    return c;
  };
  for (const g of groupDefs) {
    const at = findLine(lines, g.re, s2, firstSeason);
    const t = tableAt(lines, at, firstSeason);
    if (!t) continue;
    for (const row of t.rows) {
      for (const r of splitNames(row[0])) {
        const c = ensure(r, g.group);
        c.group = g.group;
        c.sectionName = stripMd(row[0]);
        c.info = t.header.slice(1).map((h, i) => ({ label: stripMd(h), value: row[i + 1] || "" }));
      }
    }
  }
  for (const c of CANON.filter((c) => c.extra)) ensure({ key: c.slug, name: c.name, canon: c }, "extra");

  /* seasons */
  const seasonStarts: { idx: number; n: number }[] = [];
  lines.forEach((l, i) => {
    const m = /^# \d+\.\s*시즌\s*(\d+)/.exec(l);
    if (m) seasonStarts.push({ idx: i, n: Number(m[1]) });
  });
  const seasons: Season[] = [];
  const episodes: Episode[] = [];
  seasonStarts.forEach((st, si) => {
    const end = si + 1 < seasonStarts.length ? seasonStarts[si + 1].idx : s8;
    const quote = blockquote(lines, st.idx, end);
    const summary = (quote[0] || "").replace(/\*\*시즌 한 줄 요약:\*\*\s*/, "");
    const easyAt = findLine(lines, /^### 이 시즌을 쉽게 보는 법/, st.idx, end);
    const castAt = findLine(lines, /^### 시즌 \d+ 등장인물 요약/, st.idx, end);
    const season: Season = {
      season: st.n,
      path: `/s${st.n}`,
      summary,
      notes: quote.slice(1),
      easyGuide: easyAt >= 0 ? tableAt(lines, easyAt, end) : null,
      cast: castAt >= 0 ? tableAt(lines, castAt, end) : null,
      episodes: [],
    };
    if (season.cast) {
      for (const row of season.cast.rows)
        for (const r of splitNames(row[0])) {
          const c = chars.get(r.key) || (r.canon ? ensure(r) : null);
          if (c) c.seasonRoles.push({ season: st.n, role: stripMd(row[1] || "") });
        }
    }
    const epIdx: number[] = [];
    for (let i = st.idx; i < end; i++) if (/^### S\d+E\d+/.test(lines[i])) epIdx.push(i);
    epIdx.forEach((ei, k) => {
      const eEnd = k + 1 < epIdx.length ? epIdx[k + 1] : end;
      const hm = /^### S(\d+)E(\d+)\s*·\s*(.+?)\s*\(([^()]+)\)\s*(?:—\s*(.+))?$/.exec(lines[ei]);
      if (!hm) throw new Error("Bad episode heading: " + lines[ei]);
      const [, sN, eN, titleEn, titleKo, suffix] = hm;
      const field = (re: RegExp) => {
        const at = findLine(lines, re, ei, eEnd);
        return at < 0 ? "" : lines[at].replace(re, "").trim();
      };
      const plot = field(/^- \*\*줄거리:\*\*\s*/);
      const sourceRaw = field(/^- \*\*성경\/창작:\*\*\s*/);
      const point = field(/^- 💡 \*\*이해 포인트:\*\*\s*/);
      const castLine = findLine(lines, /^- \*\*등장인물\*\*/, ei, eEnd);
      const t = castLine >= 0 ? tableAt(lines, castLine, eEnd) : null;
      const { segs, kind } = parseSource(sourceRaw);
      const e: Episode = {
        season: Number(sN),
        ep: Number(eN),
        code: `S${sN}E${eN}`,
        path: `/s${sN}/e${eN}`,
        titleEn,
        titleKo,
        suffix: suffix?.trim() || undefined,
        plot,
        sourceRaw,
        sourceSegments: segs,
        sourceKind: kind,
        characters: (t?.rows || []).map((row) => ({ raw: row[0], names: splitNames(row[0]), role: row[1] || "" })),
        point,
      };
      for (const ec of e.characters)
        for (const r of ec.names) {
          const c = ensure(r);
          if (!c.appearances.some((a) => a.code === e.code))
            c.appearances.push({ code: e.code, path: e.path, title: e.titleKo, role: stripMd(ec.role) });
        }
      season.episodes.push(e);
      episodes.push(e);
    });
    seasons.push(season);
  });

  /* verses */
  const appendixAt = findLine(lines, /^## 부록/, s8);
  const vEnd = appendixAt >= 0 ? appendixAt : lines.length;
  const verseNote = blockquote(lines, s8, vEnd)
    .filter((l) => !/^\*\*읽는 법\*\*$/.test(l))
    .map((l) => l.replace(/^-\s*/, ""));
  const verseMap = new Map<string, Verse>();
  const parseSrc = (cell: string) => {
    const [a, b] = cell.split(/<br\s*\/?>/i);
    const ref = stripMd(a).replace(/^📖\s*/, "").trim();
    const refEn = stripMd(b || "").replace(/^\(|\)$/g, "").trim();
    return { ref, refEn, book: ref.replace(/\s*[\d:,\-–\s]+$/, "").trim() };
  };
  const upsert = (cell: string, en: string, ko: string) => {
    const { ref, refEn, book } = parseSrc(cell);
    const id = refEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    let v = verseMap.get(id);
    if (!v) {
      v = { id, ref, refEn, book, en: stripMd(en), ko: stripMd(ko), episodes: [] };
      verseMap.set(id, v);
    }
    return v;
  };
  const mk = findLine(lines, /^## ⭐/, s8, vEnd);
  if (mk >= 0) {
    const t = tableAt(lines, mk, vEnd)!;
    for (const row of t.rows) upsert(row[1], row[2], row[3]).mustKnow = Number(row[0]);
  }
  for (let i = s8; i < vEnd; i++) {
    if (!/^## 시즌\s*\d+/.test(lines[i])) continue;
    const t = tableAt(lines, i, vEnd)!;
    for (const row of t.rows) {
      const v = upsert(row[1], row[2], row[3]);
      const m = /^S(\d+)E([\d·,\s]+)$/.exec(stripMd(row[0]));
      if (!m) continue;
      for (const e of m[2].split(/[·,]/).map((x) => x.trim()).filter(Boolean)) {
        const code = `S${m[1]}E${e}`;
        if (!v.episodes.includes(code)) v.episodes.push(code);
      }
    }
  }
  const verses = [...verseMap.values()];

  const appendix = appendixAt >= 0 ? tableAt(lines, appendixAt) : null;
  const limIdx = findLine(lines, /^> ⚠️ \*\*한계 안내/, s8);
  const limitation = limIdx >= 0 ? lines[limIdx].replace(/^>\s*⚠️\s*\*\*한계 안내:\*\*\s*/, "") : "";

  const order: CharacterGroup[] = ["disciples", "around", "opposition", "extra", "other"];
  const characters = [...chars.values()].sort((a, b) => order.indexOf(a.group) - order.indexOf(b.group));

  cache = {
    title,
    subtitle,
    intro,
    basics,
    threeLine,
    glossary,
    seasons,
    episodes,
    verseNote,
    verses,
    appendix,
    limitation,
    characters,
  };
  return cache;
}

export function getEpisode(season: number, ep: number) {
  return getGuide().episodes.find((e) => e.season === season && e.ep === ep);
}

export function versesForEpisode(code: string) {
  return getGuide().verses.filter((v) => v.episodes.includes(code));
}

export function characterHref(r: Resolved) {
  return r.canon ? `/characters/${r.canon.slug}` : `/characters#${anchorId(r.key)}`;
}

export function episodeLabel(e: Episode) {
  return `시즌${e.season} ${e.ep}화`;
}

export { resolveName };
