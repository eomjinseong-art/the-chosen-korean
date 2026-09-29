/**
 * Small alias map used to normalize character names found in the
 * per-episode 등장인물 tables of content/the-chosen-guide.md.
 * Only names -> slug mapping lives here; descriptions come from the markdown.
 */
export type CanonCharacter = {
  slug: string;
  name: string;
  aliases: string[];
  /** extra characters that are not in section 2 but get their own page */
  extra?: boolean;
};

export const CANON: CanonCharacter[] = [
  { slug: "peter", name: "베드로(시몬)", aliases: ["베드로", "시몬", "시몬 → 베드로", "시몬(베드로)", "시몬 베드로"] },
  { slug: "andrew", name: "안드레", aliases: ["안드레"] },
  { slug: "big-james", name: "큰 야고보", aliases: ["큰 야고보", "야고보"] },
  { slug: "john", name: "요한", aliases: ["요한", "요한(노년)"] },
  { slug: "philip", name: "빌립", aliases: ["빌립"] },
  { slug: "nathanael", name: "나다나엘", aliases: ["나다나엘"] },
  { slug: "matthew", name: "마태", aliases: ["마태", "마태(노년)"] },
  { slug: "thomas", name: "도마", aliases: ["도마"] },
  { slug: "little-james", name: "작은 야고보", aliases: ["작은 야고보"] },
  { slug: "thaddeus", name: "다대오", aliases: ["다대오"] },
  { slug: "simon-the-zealot", name: "열심당원 시몬(시몬 Z)", aliases: ["열심당원 시몬", "열심당 시몬", "시몬 Z", "열심당 시몬(시몬 Z)"] },
  { slug: "judas", name: "가룟 유다", aliases: ["가룟 유다", "유다", "유다(가룟)"] },
  { slug: "jesus", name: "예수", aliases: ["예수"] },
  { slug: "mary-mother", name: "마리아(예수의 어머니)", aliases: ["마리아", "마리아(예수의 어머니)"] },
  { slug: "mary-magdalene", name: "막달라 마리아", aliases: ["막달라 마리아", "막달라 마리아(릴리스)", "막달라 마리아(노년)"] },
  { slug: "nicodemus", name: "니고데모", aliases: ["니고데모"] },
  { slug: "martha", name: "마르다", aliases: ["마르다"] },
  { slug: "mary-of-bethany", name: "마리아(베다니, 마르다의 동생)", aliases: ["마리아(마르다의 동생)", "베다니 마리아"] },
  { slug: "lazarus", name: "나사로", aliases: ["나사로"] },
  { slug: "joanna", name: "요안나", aliases: ["요안나"] },
  { slug: "caiaphas", name: "가야바", aliases: ["가야바"] },
  { slug: "shammai", name: "샤마이", aliases: ["샤마이"] },
  { slug: "shmuel", name: "슈무엘", aliases: ["슈무엘"] },
  { slug: "yussif", name: "유시프", aliases: ["유시프"] },
  { slug: "quintus", name: "퀸투스", aliases: ["퀸투스"] },
  { slug: "gaius", name: "가이우스", aliases: ["가이우스"] },
  { slug: "atticus", name: "아티쿠스", aliases: ["아티쿠스"] },
  { slug: "pilate", name: "본디오 빌라도", aliases: ["본디오 빌라도", "빌라도"] },
  { slug: "herod-antipas", name: "헤롯 안디바", aliases: ["헤롯 안디바", "헤롯"] },
  { slug: "john-the-baptist", name: "세례자 요한", aliases: ["세례자 요한"], extra: true },
  { slug: "rama", name: "라마", aliases: ["라마"], extra: true },
  { slug: "kafni", name: "카프니", aliases: ["카프니"], extra: true },
  { slug: "eden", name: "에덴", aliases: ["에덴"], extra: true },
];

const aliasIndex = new Map<string, CanonCharacter>();
for (const c of CANON) for (const a of c.aliases) aliasIndex.set(a, c);

export function canonBySlug(slug: string) {
  return CANON.find((c) => c.slug === slug);
}

export type Resolved = { key: string; name: string; canon?: CanonCharacter };

/** Normalize a single name. `context` is the whole table cell (for 마리아/살로메 disambiguation). */
export function resolveName(raw: string, context = ""): Resolved | null {
  let n = raw.replace(/\*\*/g, "").replace(/\s+/g, " ").trim();
  if (!n) return null;
  if (n === "마리아" && /마르다|나사로/.test(context)) n = "베다니 마리아";
  const direct = aliasIndex.get(n);
  if (direct) return { key: direct.slug, name: direct.name, canon: direct };
  let base = n.replace(/\s*\([^)]*\)\s*/g, " ").replace(/\s+등\s.*$/, "").trim();
  if (base === "마리아" && /마르다|나사로/.test(context)) base = "베다니 마리아";
  if (base === "살로메") base = /헤로디아/.test(context) ? "살로메(헤로디아의 딸)" : "살로메(세베대의 아내)";
  const hit = aliasIndex.get(base);
  if (hit) return { key: hit.slug, name: hit.name, canon: hit };
  return { key: base, name: base };
}

/** Split a table cell like "시몬·안드레" or "퀸투스 / 가이우스" into resolved names. */
export function splitNames(cell: string): Resolved[] {
  const clean = cell.replace(/\*\*/g, "").trim();
  const parts = clean.includes("→") ? [clean] : clean.split(/\s*[·/]\s*/);
  const out: Resolved[] = [];
  for (const p of parts) {
    const r = resolveName(p, clean);
    if (r && !out.some((o) => o.key === r.key)) out.push(r);
  }
  return out;
}

export function anchorId(key: string) {
  return "c-" + key.replace(/\s+/g, "-");
}
