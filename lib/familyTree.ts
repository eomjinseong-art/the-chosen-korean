/**
 * 가족관계도 (Family Tree).
 *
 * 핵심 인물만 그립니다. 수명과 긴 족보 목록은 넣지 않고,
 * 여러 세대가 비는 곳은 ellipsis 칸과 skip 선(…)으로 건너뜁니다.
 * 판본이 갈리는 관계(법적 아버지, 예수의 형제, 친족)는 variant/kin 점선입니다.
 */

export type EraId = "genesis" | "patriarchs" | "exodus" | "david" | "jesus";
export type LinkKind = "parent" | "spouse" | "variant" | "skip" | "kin" | "sibling";
export type BadgeTone = "gold" | "purple" | "ink";

export type PageLink = { label: string; href: string };

export function isExternalHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

/** On-site pages first, then links to other sites. */
export function orderedPages(pages: PageLink[] | undefined): PageLink[] {
  if (!pages?.length) return [];
  const internal: PageLink[] = [];
  const external: PageLink[] = [];
  for (const page of pages) (isExternalHref(page.href) ? external : internal).push(page);
  return [...internal, ...external];
}

export type TreeSeed = {
  id: string;
  ko: string;
  en: string;
  band: string;
  col: number;
  y: number;
  summary: string;
  cite: string;
  note?: string;
  role?: string;
  badge?: { text: string; tone: BadgeTone };
  ellipsis?: boolean;
  /** 뒤에 이어지는 핵심 이름. 유다·레위·요셉·베냐민 */
  key?: boolean;
  emptyParents?: string;
  aliases?: string[];
  pages?: PageLink[];
};

export type TreeLink = { from: string; to: string; kind: LinkKind; ref: string };

export type BandMeta = {
  id: string;
  ko: string;
  en: string;
  hint: string;
  color: string;
  soft: string;
};

export type EraMeta = {
  id: EraId;
  ko: string;
  en: string;
  lead: string;
};

type EraInput = EraMeta & {
  bands: BandMeta[];
  seeds: TreeSeed[];
  links: TreeLink[];
};

const COL = 130;
const NODE_W = 116;
const NODE_H = 82;
const PAD = 22;
const BAND_LABEL = 30;
const BAND_BOTTOM = 10;

export const FAMILY_TREE_PATH = "/family-tree";

const book = (slug: string, label: string): PageLink => ({ label, href: `/bible-books/${slug}` });
const person = (slug: string): PageLink => ({ label: "더 초즌 인물", href: `/characters/${slug}` });
const jump = (era: EraId, focus: string, label: string): PageLink => ({
  label,
  href: `${FAMILY_TREE_PATH}?era=${era}&focus=${focus}`,
});

function linksOf(push: (link: TreeLink) => void) {
  const add = (kind: LinkKind) => (from: string, to: string, ref: string) => push({ from, to, kind, ref });
  return {
    parent: add("parent"),
    parents: (child: string, ref: string, ...from: string[]) => from.forEach((id) => add("parent")(id, child, ref)),
    spouse: add("spouse"),
    variant: add("variant"),
    skip: add("skip"),
    kin: add("kin"),
    sibling: add("sibling"),
  };
}

const GENESIS: EraInput = {
  id: "genesis",
  ko: "창세기 초반",
  en: "Early Genesis",
  lead: "아담과 하와에서 노아의 세 아들까지입니다. 셋과 노아 사이는 창세기 5장이 잇지만, 중간 세대는 생략했습니다.",
  bands: [
    { id: "eden", ko: "아담과 하와", en: "Adam & Eve", hint: "창세기가 맨 먼저 부부로 적는 사람입니다.", color: "#3e4d7a", soft: "#e7edf7" },
    { id: "children", ko: "자녀", en: "Children", hint: "가인, 아벨, 셋입니다. 다른 자녀는 이름 없이 언급됩니다.", color: "#8a5a24", soft: "#fbf3e6" },
    { id: "flood", ko: "노아", en: "Noah", hint: "셋에서 노아까지는 … 로 건너뜁니다.", color: "#1f6f5c", soft: "#e3f3ee" },
    { id: "sons", ko: "노아의 아들", en: "Noah's sons", hint: "창세기 5:32의 순서입니다. 출생 순서를 단정하지는 않습니다.", color: "#2d6844", soft: "#e8f4ee" },
  ],
  seeds: [
    {
      id: "adam",
      ko: "아담",
      en: "Adam",
      band: "eden",
      col: 1.05,
      y: 70,
      summary: "하와의 남편이고 가인, 아벨, 셋의 아버지입니다.",
      cite: "창 2:21–25; 4:1–2, 25; 5:3 · Gen 2–5",
      emptyParents: "창세기 1–2장에는 부모가 나오지 않습니다.",
      aliases: ["아담", "Adam", "adam"],
      pages: [book("genesis", "창세기")],
    },
    {
      id: "eve",
      ko: "하와",
      en: "Eve",
      band: "eden",
      col: 2.35,
      y: 70,
      summary: "아담의 아내입니다. 하와라는 이름은 창세기 3:20에 나옵니다.",
      cite: "창 2:21–25; 3:20; 4:1–2, 25 · Gen 2–4",
      emptyParents: "창세기에는 부모가 나오지 않습니다.",
      aliases: ["하와", "Eve", "eve"],
      pages: [book("genesis", "창세기")],
    },
    {
      id: "cain",
      ko: "가인",
      en: "Cain",
      band: "children",
      col: 0.4,
      y: 202,
      summary: "아담과 하와의 아들입니다. 아벨의 형으로 소개됩니다. 가인의 자손은 이 그림에 넣지 않았습니다.",
      cite: "창 4:1–2 · Gen 4",
      aliases: ["가인", "Cain", "cain"],
      pages: [book("genesis", "창세기")],
    },
    {
      id: "abel",
      ko: "아벨",
      en: "Abel",
      band: "children",
      col: 1.7,
      y: 202,
      summary: "아담과 하와의 아들입니다. 자녀는 기록되어 있지 않습니다.",
      cite: "창 4:2 · Gen 4",
      aliases: ["아벨", "Abel", "abel"],
      pages: [book("genesis", "창세기")],
    },
    {
      id: "seth",
      ko: "셋",
      en: "Seth",
      band: "children",
      col: 3,
      y: 202,
      summary: "아담과 하와의 아들입니다. 노아로 이어지는 족보가 셋에서 시작됩니다.",
      cite: "창 4:25; 5:3–8 · Gen 4–5",
      aliases: ["셋", "Seth", "seth"],
      pages: [book("genesis", "창세기")],
    },
    {
      id: "gap-seth",
      ko: "…",
      en: "gap",
      band: "flood",
      col: 3,
      y: 334,
      ellipsis: true,
      role: "셋에서 노아까지",
      summary: "창세기 5장이 셋과 노아를 잇습니다. 중간 세대는 생략했습니다.",
      cite: "창 5장 · Gen 5",
      aliases: ["셋에서 노아"],
    },
    {
      id: "noah",
      ko: "노아",
      en: "Noah",
      band: "flood",
      col: 3,
      y: 446,
      summary: "셈, 함, 야벳의 아버지입니다. 아내의 이름은 창세기에 없습니다.",
      cite: "창 5:32; 6:10; 9:18–19 · Gen 5–9",
      aliases: ["노아", "Noah", "noah"],
      pages: [book("genesis", "창세기")],
    },
    {
      id: "shem",
      ko: "셈",
      en: "Shem",
      band: "sons",
      col: 1.7,
      y: 578,
      summary: "노아의 아들입니다. 창세기 5:32의 순서대로 셈, 함, 야벳을 놓았습니다.",
      cite: "창 5:32; 9:18; 10:21 · Gen 5, 9–10",
      aliases: ["셈", "Shem", "shem"],
      pages: [book("genesis", "창세기")],
    },
    {
      id: "ham",
      ko: "함",
      en: "Ham",
      band: "sons",
      col: 3,
      y: 578,
      summary: "노아의 아들입니다. 창세기 9:24는 함을 막내라고 말합니다.",
      cite: "창 5:32; 9:18, 24 · Gen 5, 9",
      aliases: ["함", "Ham", "ham"],
      pages: [book("genesis", "창세기")],
    },
    {
      id: "japheth",
      ko: "야벳",
      en: "Japheth",
      band: "sons",
      col: 4.3,
      y: 578,
      summary: "노아의 아들입니다.",
      cite: "창 5:32; 9:18; 10:21 · Gen 5, 9–10",
      aliases: ["야벳", "Japheth", "japheth"],
      pages: [book("genesis", "창세기")],
    },
  ],
  links: [],
};

GENESIS.links = (() => {
  const out: TreeLink[] = [];
  const L = linksOf((link) => out.push(link));
  L.spouse("adam", "eve", "창 2:21–25; 3:20 · Gen 2–3");
  L.parents("cain", "창 4:1 · Gen 4", "adam", "eve");
  L.parents("abel", "창 4:2 · Gen 4", "adam", "eve");
  L.parents("seth", "창 4:25 · Gen 4", "adam", "eve");
  L.skip("seth", "gap-seth", "창 5장 · Gen 5");
  L.skip("gap-seth", "noah", "창 5장 · Gen 5");
  L.parent("noah", "shem", "창 5:32; 6:10 · Gen 5–6");
  L.parent("noah", "ham", "창 5:32; 6:10 · Gen 5–6");
  L.parent("noah", "japheth", "창 5:32; 6:10 · Gen 5–6");
  return out;
})();

const PATRIARCHS: EraInput = {
  id: "patriarchs",
  ko: "족장들",
  en: "Patriarchs",
  lead: "아브라함 집안의 핵심입니다. 열두 아들은 지파의 이름만 두었고, 유다·레위·요셉·베냐민을 표시했습니다. 칸은 어머니별로 모았습니다.",
  bands: [
    { id: "abr", ko: "아브라함", en: "Abraham", hint: "사라와 하갈을 함께 그렸습니다.", color: "#3e4d7a", soft: "#e7edf7" },
    { id: "isa", ko: "이삭", en: "Isaac", hint: "이삭은 사라의 아들이고, 이스마엘은 하갈의 아들입니다.", color: "#8a5a24", soft: "#fbf3e6" },
    { id: "jac", ko: "야곱", en: "Jacob", hint: "야곱은 이스라엘이라는 이름을 받습니다.", color: "#7a3454", soft: "#f8eef2" },
    { id: "wives", ko: "야곱의 아내", en: "Jacob's wives", hint: "레아, 라헬, 그리고 여종 빌하와 실바입니다.", color: "#1f3b57", soft: "#e6eef5" },
    { id: "tribes", ko: "열두 아들", en: "Twelve sons", hint: "지파의 이름입니다. 금색 테두리는 뒤에서 다시 나오는 사람입니다.", color: "#2d6844", soft: "#e8f4ee" },
    { id: "eph", ko: "요셉의 아들", en: "Joseph's sons", hint: "므낫세와 에브라임입니다.", color: "#1f6f5c", soft: "#e3f3ee" },
  ],
  seeds: [
    {
      id: "abraham",
      ko: "아브라함",
      en: "Abraham",
      band: "abr",
      col: 0,
      y: 70,
      summary: "처음 이름은 아브람입니다. 사라의 남편이고, 하갈에게서 이스마엘을, 사라에게서 이삭을 둡니다. 아버지 데라와 조카 롯은 창세기 11장에 나오지만 이 그림에는 넣지 않았습니다.",
      cite: "창 11:27–29; 12:5; 16:15; 17:5; 21:2–3 · Gen 11–21",
      aliases: ["아브라함", "아브람", "Abraham", "Abram"],
      pages: [book("genesis", "창세기")],
    },
    {
      id: "sarah",
      ko: "사라",
      en: "Sarah",
      band: "abr",
      col: 1.2,
      y: 70,
      summary: "처음 이름은 사래입니다. 아브라함의 아내이고 이삭의 어머니입니다.",
      cite: "창 11:29; 17:15; 21:2–3 · Gen 11, 17, 21",
      aliases: ["사라", "사래", "Sarah", "Sarai"],
      pages: [book("genesis", "창세기")],
    },
    {
      id: "hagar",
      ko: "하갈",
      en: "Hagar",
      band: "abr",
      col: 4.6,
      y: 70,
      summary: "사라의 여종입니다. 사라가 하갈을 아브라함에게 아내로 주었고, 이스마엘을 낳습니다.",
      cite: "창 16:1–15 · Gen 16",
      aliases: ["하갈", "Hagar"],
      pages: [book("genesis", "창세기")],
    },
    {
      id: "isaac",
      ko: "이삭",
      en: "Isaac",
      band: "isa",
      col: 0.5,
      y: 202,
      summary: "아브라함과 사라의 아들입니다. 리브가의 남편이고 에서와 야곱의 아버지입니다.",
      cite: "창 21:2–3; 24:67; 25:21–26 · Gen 21–25",
      aliases: ["이삭", "Isaac"],
      pages: [book("genesis", "창세기")],
    },
    {
      id: "rebekah",
      ko: "리브가",
      en: "Rebekah",
      band: "isa",
      col: 1.75,
      y: 202,
      summary: "이삭의 아내이고 에서와 야곱의 어머니입니다.",
      cite: "창 24:67; 25:21–26 · Gen 24–25",
      aliases: ["리브가", "Rebekah", "Rebecca"],
      pages: [book("genesis", "창세기")],
    },
    {
      id: "ishmael",
      ko: "이스마엘",
      en: "Ishmael",
      band: "isa",
      col: 4.6,
      y: 202,
      summary: "아브라함과 하갈의 아들입니다. 열두 족장은 창세기 25:12–16에 나오지만 여기에는 이름만 두지 않았습니다.",
      cite: "창 16:15; 25:12–16 · Gen 16, 25",
      aliases: ["이스마엘", "Ishmael"],
      pages: [book("genesis", "창세기")],
    },
    {
      id: "esau",
      ko: "에서",
      en: "Esau",
      band: "jac",
      col: 0,
      y: 334,
      summary: "이삭과 리브가의 아들로, 야곱의 쌍둥이 형입니다. 자손은 창세기 36장에 나옵니다. 이 그림에는 넣지 않았습니다.",
      cite: "창 25:24–26; 36장 · Gen 25, 36",
      aliases: ["에서", "에돔", "Esau", "Edom"],
      pages: [book("genesis", "창세기")],
    },
    {
      id: "jacob",
      ko: "야곱",
      en: "Jacob",
      band: "jac",
      col: 1.6,
      y: 334,
      role: "이스라엘",
      summary: "이삭과 리브가의 아들입니다. 하나님이 이스라엘이라는 이름을 주십니다. 레아, 라헬, 빌하, 실바에게서 열두 아들을 둡니다. 딸 디나는 그리지 않았습니다.",
      cite: "창 25:26; 29–30장; 32:28; 35:23–26 · Gen 25–35",
      aliases: ["야곱", "이스라엘", "Jacob", "Israel"],
      pages: [book("genesis", "창세기")],
    },
    {
      id: "leah",
      ko: "레아",
      en: "Leah",
      band: "wives",
      col: 3,
      y: 466,
      summary: "야곱의 아내입니다. 르우벤, 시므온, 레위, 유다, 잇사갈, 스불론의 어머니입니다. 딸 디나도 낳습니다(창 30:21).",
      cite: "창 29:21–35; 30:17–21; 35:23 · Gen 29–30, 35",
      aliases: ["레아", "Leah"],
      pages: [book("genesis", "창세기")],
    },
    {
      id: "zilpah",
      ko: "실바",
      en: "Zilpah",
      band: "wives",
      col: 8,
      y: 466,
      summary: "레아의 여종입니다. 레아가 실바를 야곱에게 아내로 주었고, 갓과 아셀을 낳습니다.",
      cite: "창 30:9–13; 35:26 · Gen 30, 35",
      aliases: ["실바", "Zilpah"],
      pages: [book("genesis", "창세기")],
    },
    {
      id: "bilhah",
      ko: "빌하",
      en: "Bilhah",
      band: "wives",
      col: 10.6,
      y: 466,
      summary: "라헬의 여종입니다. 라헬이 빌하를 야곱에게 아내로 주었고, 단과 납달리를 낳습니다.",
      cite: "창 30:3–8; 35:25 · Gen 30, 35",
      aliases: ["빌하", "Bilhah"],
      pages: [book("genesis", "창세기")],
    },
    {
      id: "rachel",
      ko: "라헬",
      en: "Rachel",
      band: "wives",
      col: 13.2,
      y: 466,
      summary: "야곱의 아내입니다. 요셉과 베냐민의 어머니입니다.",
      cite: "창 29:28–30; 30:22–24; 35:16–24 · Gen 29–30, 35",
      aliases: ["라헬", "Rachel"],
      pages: [book("genesis", "창세기")],
    },
    tribe("reuben", "르우벤", "Reuben", 0, "야곱과 레아의 아들입니다.", "창 29:32; 35:23 · Gen 29, 35"),
    tribe("simeon", "시므온", "Simeon", 1.2, "야곱과 레아의 아들입니다.", "창 29:33; 35:23 · Gen 29, 35"),
    tribe("levi", "레위", "Levi", 2.4, "야곱과 레아의 아들입니다. 제사장 가문과 모세의 집안으로 이어집니다.", "창 29:34; 35:23 · Gen 29, 35", {
      key: true,
      pages: [book("genesis", "창세기"), jump("exodus", "levi-ex", "출애굽 가계")],
    }),
    tribe("judah", "유다", "Judah", 3.6, "야곱과 레아의 아들입니다. 다윗 왕가의 족보가 유다에서 이어집니다.", "창 29:35; 49:8–10 · Gen 29, 49", {
      key: true,
      pages: [book("genesis", "창세기"), jump("david", "judah-d", "다윗 가계")],
    }),
    tribe("issachar", "잇사갈", "Issachar", 4.8, "야곱과 레아의 아들입니다.", "창 30:17–18; 35:23 · Gen 30, 35"),
    tribe("zebulun", "스불론", "Zebulun", 6, "야곱과 레아의 아들입니다.", "창 30:19–20; 35:23 · Gen 30, 35"),
    tribe("gad", "갓", "Gad", 7.4, "야곱과 실바의 아들입니다.", "창 30:9–11; 35:26 · Gen 30, 35"),
    tribe("asher", "아셀", "Asher", 8.6, "야곱과 실바의 아들입니다.", "창 30:12–13; 35:26 · Gen 30, 35"),
    tribe("dan", "단", "Dan", 10, "야곱과 빌하의 아들입니다.", "창 30:5–6; 35:25 · Gen 30, 35"),
    tribe("naphtali", "납달리", "Naphtali", 11.2, "야곱과 빌하의 아들입니다.", "창 30:7–8; 35:25 · Gen 30, 35"),
    tribe("benjamin", "베냐민", "Benjamin", 12.6, "야곱과 라헬의 아들입니다. 라헬이 낳다가 죽으며 벤오니라고도 부릅니다.", "창 35:16–19, 24 · Gen 35", { key: true }),
    tribe("joseph", "요셉", "Joseph", 13.8, "야곱과 라헬의 아들입니다. 아스낫과 므낫세, 에브라임을 둡니다.", "창 30:22–24; 41:45, 50–52 · Gen 30, 41", { key: true }),
    {
      id: "asenath",
      ko: "아스낫",
      en: "Asenath",
      band: "tribes",
      col: 15,
      y: 598,
      summary: "바로가 요셉에게 아내로 준 사람입니다. 므낫세와 에브라임의 어머니입니다.",
      cite: "창 41:45, 50–52 · Gen 41",
      aliases: ["아스낫", "Asenath", "Aseneth"],
      pages: [book("genesis", "창세기")],
    },
    {
      id: "manasseh",
      ko: "므낫세",
      en: "Manasseh",
      band: "eph",
      col: 13.8,
      y: 730,
      summary: "요셉과 아스낫의 맏아들입니다.",
      cite: "창 41:51; 48:5 · Gen 41, 48",
      aliases: ["므낫세", "Manasseh"],
      pages: [book("genesis", "창세기")],
    },
    {
      id: "ephraim",
      ko: "에브라임",
      en: "Ephraim",
      band: "eph",
      col: 15,
      y: 730,
      summary: "요셉과 아스낫의 둘째 아들입니다. 야곱이 므낫세보다 앞세워 축복합니다.",
      cite: "창 41:52; 48:5, 13–20 · Gen 41, 48",
      aliases: ["에브라임", "Ephraim"],
      pages: [book("genesis", "창세기")],
    },
  ],
  links: [],
};

function tribe(
  id: string,
  ko: string,
  en: string,
  col: number,
  summary: string,
  cite: string,
  extra: Partial<TreeSeed> = {},
): TreeSeed {
  return {
    id,
    ko,
    en,
    band: "tribes",
    col,
    y: 598,
    summary,
    cite,
    aliases: [ko, en],
    pages: extra.pages ?? [book("genesis", "창세기")],
    ...extra,
  };
}

PATRIARCHS.links = (() => {
  const out: TreeLink[] = [];
  const L = linksOf((link) => out.push(link));
  const g = "창 35:23–26 · Gen 35";
  L.spouse("abraham", "sarah", "창 11:29; 17:15 · Gen 11, 17");
  L.spouse("abraham", "hagar", "창 16:3 · Gen 16");
  L.parents("isaac", "창 21:2–3 · Gen 21", "abraham", "sarah");
  L.parents("ishmael", "창 16:15 · Gen 16", "abraham", "hagar");
  L.spouse("isaac", "rebekah", "창 24:67 · Gen 24");
  L.parents("esau", "창 25:24–26 · Gen 25", "isaac", "rebekah");
  L.parents("jacob", "창 25:24–26 · Gen 25", "isaac", "rebekah");
  L.spouse("jacob", "leah", "창 29:21–25 · Gen 29");
  L.spouse("jacob", "rachel", "창 29:28–30 · Gen 29");
  L.spouse("jacob", "bilhah", "창 30:3–4 · Gen 30");
  L.spouse("jacob", "zilpah", "창 30:9 · Gen 30");
  for (const id of ["reuben", "simeon", "levi", "judah", "issachar", "zebulun"]) L.parents(id, g, "jacob", "leah");
  for (const id of ["gad", "asher"]) L.parents(id, g, "jacob", "zilpah");
  for (const id of ["dan", "naphtali"]) L.parents(id, g, "jacob", "bilhah");
  for (const id of ["joseph", "benjamin"]) L.parents(id, g, "jacob", "rachel");
  L.spouse("joseph", "asenath", "창 41:45 · Gen 41");
  L.parents("manasseh", "창 41:50–51 · Gen 41", "joseph", "asenath");
  L.parents("ephraim", "창 41:50–52 · Gen 41", "joseph", "asenath");
  return out;
})();

const EXODUS: EraInput = {
  id: "exodus",
  ko: "출애굽",
  en: "Exodus",
  lead: "레위에서 미리암, 아론, 모세까지입니다. 레위와 아므람 사이는 생략했습니다.",
  bands: [
    { id: "levi", ko: "레위", en: "Levi", hint: "족장 가계의 레위에서 이어집니다.", color: "#8a5a24", soft: "#fbf3e6" },
    { id: "parents", ko: "아므람과 요게벳", en: "Amram & Jochebed", hint: "미리암, 아론, 모세의 부모입니다.", color: "#1f3b57", soft: "#e6eef5" },
    { id: "children", ko: "세 남매", en: "The three siblings", hint: "모세의 아내 십보라를 옆에 두었습니다.", color: "#2d6844", soft: "#e8f4ee" },
  ],
  seeds: [
    {
      id: "levi-ex",
      ko: "레위",
      en: "Levi",
      band: "levi",
      col: 1.8,
      y: 70,
      key: true,
      summary: "야곱과 레아의 아들입니다. 아므람으로 이어지는 집안입니다.",
      cite: "창 29:34; 출 6:16 · Gen 29; Ex 6",
      aliases: ["레위", "Levi"],
      pages: [book("genesis", "창세기"), book("exodus", "출애굽기"), jump("patriarchs", "levi", "족장 가계")],
    },
    {
      id: "gap-levi",
      ko: "…",
      en: "gap",
      band: "levi",
      col: 1.8,
      y: 182,
      ellipsis: true,
      role: "레위에서 아므람까지",
      summary: "출애굽기 6:16–20이 레위와 아므람을 잇습니다. 중간 세대는 생략했습니다.",
      cite: "출 6:16–20 · Ex 6",
    },
    {
      id: "amram",
      ko: "아므람",
      en: "Amram",
      band: "parents",
      col: 1.15,
      y: 316,
      summary: "요게벳의 남편이고 아론과 모세의 아버지입니다. 민수기는 미리암도 이들의 딸로 적습니다.",
      cite: "출 6:20; 민 26:59 · Ex 6; Num 26",
      aliases: ["아므람", "Amram"],
      pages: [book("exodus", "출애굽기")],
    },
    {
      id: "jochebed",
      ko: "요게벳",
      en: "Jochebed",
      band: "parents",
      col: 2.45,
      y: 316,
      summary: "아므람의 아내이고 미리암, 아론, 모세의 어머니입니다. 출애굽기 6:20은 요게벳을 아므람의 아버지의 누이로 적습니다.",
      cite: "출 6:20; 민 26:59 · Ex 6; Num 26",
      aliases: ["요게벳", "Jochebed"],
      pages: [book("exodus", "출애굽기")],
    },
    {
      id: "miriam",
      ko: "미리암",
      en: "Miriam",
      band: "children",
      col: 0.3,
      y: 448,
      summary: "아론의 누이로 소개됩니다. 출애굽기 2장에서 아기 모세를 지켜 본 누이로 읽힙니다.",
      cite: "출 2:4–8; 15:20; 민 26:59 · Ex 2, 15; Num 26",
      aliases: ["미리암", "Miriam"],
      pages: [book("exodus", "출애굽기")],
    },
    {
      id: "aaron",
      ko: "아론",
      en: "Aaron",
      band: "children",
      col: 1.8,
      y: 448,
      summary: "미리암과 모세의 형제입니다. 아내 엘리세바와 자녀는 이 그림에 넣지 않았습니다.",
      cite: "출 6:20, 23; 7:1; 민 26:59 · Ex 6–7; Num 26",
      aliases: ["아론", "Aaron"],
      pages: [book("exodus", "출애굽기")],
    },
    {
      id: "moses",
      ko: "모세",
      en: "Moses",
      band: "children",
      col: 3.3,
      y: 448,
      summary: "아므람과 요게벳의 아들입니다. 십보라의 남편입니다. 아들 게르솜과 엘리에셀은 그리지 않았습니다.",
      cite: "출 2:1–10, 21–22; 6:20; 18:3–4; 민 26:59 · Ex 2, 6, 18; Num 26",
      aliases: ["모세", "Moses"],
      pages: [
        book("exodus", "출애굽기"),
        { label: "이집트이야기: 람세스 2세 (Ramesses II)", href: "https://egypt-stories.vercel.app/rulers/ramesses-ii" },
      ],
    },
    {
      id: "zipporah",
      ko: "십보라",
      en: "Zipporah",
      band: "children",
      col: 4.55,
      y: 448,
      summary: "미디안 제사장의 딸이고 모세의 아내입니다.",
      cite: "출 2:16–22; 18:2 · Ex 2, 18",
      aliases: ["십보라", "Zipporah"],
      pages: [book("exodus", "출애굽기")],
    },
  ],
  links: [],
};

EXODUS.links = (() => {
  const out: TreeLink[] = [];
  const L = linksOf((link) => out.push(link));
  const ref = "출 6:20; 민 26:59 · Ex 6; Num 26";
  L.skip("levi-ex", "gap-levi", "출 6:16–20 · Ex 6");
  L.skip("gap-levi", "amram", "출 6:16–20 · Ex 6");
  L.spouse("amram", "jochebed", ref);
  L.parents("miriam", ref, "amram", "jochebed");
  L.parents("aaron", ref, "amram", "jochebed");
  L.parents("moses", ref, "amram", "jochebed");
  L.spouse("moses", "zipporah", "출 2:21 · Ex 2");
  return out;
})();

const DAVID: EraInput = {
  id: "david",
  ko: "룻과 다윗",
  en: "Ruth & David",
  lead: "유다에서 다윗과 솔로몬까지, 그리고 사울의 자녀입니다. 베레스와 보아스 사이, 솔로몬 이후는 … 로 건너뜁니다.",
  bands: [
    { id: "judah", ko: "유다와 베레스", en: "Judah & Perez", hint: "다말은 유다의 며느리이고 베레스의 어머니입니다.", color: "#8a5a24", soft: "#fbf3e6" },
    { id: "gap", ko: "생략", en: "Gap", hint: "룻기 4장이 베레스와 보아스를 잇습니다.", color: "#6f665b", soft: "#f3efe8" },
    { id: "ruth", ko: "룻기", en: "Ruth", hint: "보아스와 룻에서 이새까지입니다.", color: "#1f6f5c", soft: "#e3f3ee" },
    { id: "kings", ko: "사울과 다윗", en: "Saul & David", hint: "미갈은 사울의 딸이고 다윗의 아내입니다.", color: "#7a3454", soft: "#f8eef2" },
    { id: "line", ko: "솔로몬 이후", en: "After Solomon", hint: "마태와 누가는 다윗에서 예수까지 다른 경로를 적습니다.", color: "#6d4c8a", soft: "#f3e8fb" },
  ],
  seeds: [
    {
      id: "judah-d",
      ko: "유다",
      en: "Judah",
      band: "judah",
      col: 1.6,
      y: 70,
      key: true,
      summary: "야곱의 아들입니다. 베레스의 아버지입니다.",
      cite: "창 38:27–30; 마 1:3 · Gen 38; Matt 1",
      aliases: ["유다", "Judah"],
      pages: [book("genesis", "창세기"), jump("patriarchs", "judah", "족장 가계")],
    },
    {
      id: "tamar",
      ko: "다말",
      en: "Tamar",
      band: "judah",
      col: 2.8,
      y: 70,
      summary: "유다의 며느리였고, 베레스의 어머니입니다. 유다와 혼인했다는 기록은 없습니다. 쌍둥이의 다른 한 명은 세라입니다. 세라의 칸은 만들지 않았습니다.",
      cite: "창 38장; 마 1:3 · Gen 38; Matt 1",
      aliases: ["다말", "Tamar"],
      pages: [book("genesis", "창세기")],
    },
    {
      id: "perez",
      ko: "베레스",
      en: "Perez",
      band: "judah",
      col: 2.2,
      y: 182,
      summary: "유다와 다말의 아들입니다. 다윗의 조상으로 이어집니다.",
      cite: "창 38:27–30; 룻 4:18; 마 1:3 · Gen 38; Ruth 4; Matt 1",
      aliases: ["베레스", "Perez", "Pharez"],
      pages: [book("genesis", "창세기"), book("ruth", "룻기")],
    },
    {
      id: "gap-perez",
      ko: "…",
      en: "gap",
      band: "gap",
      col: 2.2,
      y: 316,
      ellipsis: true,
      role: "베레스에서 보아스까지",
      summary: "룻기 4:18–22가 베레스와 보아스를 잇습니다. 중간 세대는 생략했습니다. 마태복음 1:5는 이 구간에 라합을 적습니다.",
      cite: "룻 4:18–22; 마 1:3–5 · Ruth 4; Matt 1",
    },
    {
      id: "boaz",
      ko: "보아스",
      en: "Boaz",
      band: "ruth",
      col: 1.6,
      y: 448,
      summary: "룻의 남편이고 오벳의 아버지입니다.",
      cite: "룻 4:13–17; 마 1:5 · Ruth 4; Matt 1",
      aliases: ["보아스", "Boaz"],
      pages: [book("ruth", "룻기")],
    },
    {
      id: "ruth",
      ko: "룻",
      en: "Ruth",
      band: "ruth",
      col: 2.8,
      y: 448,
      summary: "보아스의 아내이고 오벳의 어머니입니다.",
      cite: "룻 4:13 · Ruth 4",
      aliases: ["룻", "Ruth"],
      pages: [book("ruth", "룻기")],
    },
    {
      id: "obed",
      ko: "오벳",
      en: "Obed",
      band: "ruth",
      col: 2.2,
      y: 560,
      summary: "보아스와 룻의 아들입니다. 동네 사람들은 나오미의 가문을 이을 아이로도 말합니다.",
      cite: "룻 4:13–17 · Ruth 4",
      aliases: ["오벳", "Obed"],
      pages: [book("ruth", "룻기")],
    },
    {
      id: "jesse",
      ko: "이새",
      en: "Jesse",
      band: "ruth",
      col: 2.2,
      y: 672,
      summary: "오벳의 아들이고 다윗의 아버지입니다. 다른 아들들은 그리지 않았습니다.",
      cite: "룻 4:17, 22; 삼상 16:1–13 · Ruth 4; 1 Sam 16",
      aliases: ["이새", "Jesse"],
      pages: [book("ruth", "룻기"), book("1-samuel", "사무엘상")],
    },
    {
      id: "saul",
      ko: "사울",
      en: "Saul",
      band: "kings",
      col: 4.55,
      y: 806,
      summary: "이스라엘의 첫 왕으로 소개됩니다. 요나단과 미갈의 아버지입니다. 다른 자녀는 그리지 않았습니다.",
      cite: "삼상 9–10장; 14:49 · 1 Sam 9–10, 14",
      aliases: ["사울", "Saul"],
      pages: [book("1-samuel", "사무엘상")],
    },
    {
      id: "bathsheba",
      ko: "밧세바",
      en: "Bathsheba",
      band: "kings",
      col: 0.95,
      y: 918,
      summary: "우리아의 아내였고, 뒤에 다윗의 아내가 되어 솔로몬을 낳습니다.",
      cite: "삼하 11:3, 26–27; 12:24 · 2 Sam 11–12",
      aliases: ["밧세바", "Bathsheba"],
      pages: [book("2-samuel", "사무엘하")],
    },
    {
      id: "david",
      ko: "다윗",
      en: "David",
      band: "kings",
      col: 2.2,
      y: 918,
      summary: "이새의 아들입니다. 밧세바의 남편이고 솔로몬의 아버지이며, 미갈의 남편이기도 합니다. 다른 자녀는 그리지 않았습니다.",
      cite: "룻 4:22; 삼상 16장; 18:27; 삼하 12:24 · Ruth 4; 1 Sam 16, 18; 2 Sam 12",
      aliases: ["다윗", "David"],
      pages: [book("1-samuel", "사무엘상"), book("2-samuel", "사무엘하"), book("ruth", "룻기")],
    },
    {
      id: "michal",
      ko: "미갈",
      en: "Michal",
      band: "kings",
      col: 3.45,
      y: 918,
      summary: "사울의 딸이고 다윗의 아내가 됩니다. 그 사이 다른 사람에게 주어졌다가 다윗에게 돌아옵니다. 성경은 미갈에게 자녀가 없었다고 적습니다.",
      cite: "삼상 14:49; 18:20–27; 25:44; 삼하 3:13–16; 6:23 · 1 Sam 14, 18, 25; 2 Sam 3, 6",
      aliases: ["미갈", "Michal"],
      pages: [book("1-samuel", "사무엘상")],
    },
    {
      id: "jonathan",
      ko: "요나단",
      en: "Jonathan",
      band: "kings",
      col: 5.7,
      y: 918,
      summary: "사울의 아들입니다. 다윗과 가까운 사이로 나옵니다.",
      cite: "삼상 14:49; 18:1–4; 20장 · 1 Sam 14, 18, 20",
      aliases: ["요나단", "Jonathan"],
      pages: [book("1-samuel", "사무엘상")],
    },
    {
      id: "solomon",
      ko: "솔로몬",
      en: "Solomon",
      band: "kings",
      col: 2.2,
      y: 1030,
      summary: "다윗과 밧세바의 아들입니다. 여디디야라고도 불립니다. 다른 자녀는 그리지 않았습니다.",
      cite: "삼하 12:24–25; 왕상 1–2장 · 2 Sam 12; 1 Kgs 1–2",
      aliases: ["솔로몬", "여디디야", "Solomon", "Jedidiah"],
      pages: [book("1-kings", "열왕기상"), book("2-samuel", "사무엘하")],
    },
    {
      id: "gap-messiah",
      ko: "…",
      en: "gap",
      band: "line",
      col: 2.2,
      y: 1162,
      ellipsis: true,
      role: "다윗 가문에서 예수까지",
      summary: "마태복음 1:1은 이 계보를 예수 그리스도의 족보라고 부릅니다. 마태복음 1:6–16은 솔로몬을 거쳐 요셉에게 이르고, 누가복음 3:23–31은 다윗의 아들 나단을 거쳐 올라갑니다. 중간 세대는 생략했습니다.",
      cite: "마 1:1–17; 눅 3:23–31 · Matt 1; Luke 3",
      pages: [jump("jesus", "jesus", "예수 주변"), book("matthew", "마태복음"), book("luke", "누가복음")],
    },
  ],
  links: [],
};

DAVID.links = (() => {
  const out: TreeLink[] = [];
  const L = linksOf((link) => out.push(link));
  L.parent("judah-d", "perez", "창 38:27–30; 마 1:3 · Gen 38; Matt 1");
  L.parent("tamar", "perez", "창 38:27–30; 마 1:3 · Gen 38; Matt 1");
  L.skip("perez", "gap-perez", "룻 4:18–22 · Ruth 4");
  L.skip("gap-perez", "boaz", "룻 4:18–22; 마 1:5 · Ruth 4; Matt 1");
  L.spouse("boaz", "ruth", "룻 4:13 · Ruth 4");
  L.parents("obed", "룻 4:13–17 · Ruth 4", "boaz", "ruth");
  L.parent("obed", "jesse", "룻 4:17, 22 · Ruth 4");
  L.parent("jesse", "david", "룻 4:22; 삼상 16:11–13 · Ruth 4; 1 Sam 16");
  L.parent("saul", "jonathan", "삼상 14:49 · 1 Sam 14");
  L.parent("saul", "michal", "삼상 14:49 · 1 Sam 14");
  L.spouse("david", "bathsheba", "삼하 11:27; 12:24 · 2 Sam 11–12");
  L.spouse("david", "michal", "삼상 18:27 · 1 Sam 18");
  L.parents("solomon", "삼하 12:24 · 2 Sam 12", "david", "bathsheba");
  L.skip("solomon", "gap-messiah", "마 1:6–16; 눅 3:23–31 · Matt 1; Luke 3");
  return out;
})();

const JESUS: EraInput = {
  id: "jesus",
  ko: "예수 주변",
  en: "Around Jesus",
  lead: "예수와 세례 요한, 복음서가 형제라고 부르는 사람, 제자 가운데 형제인 쌍, 베다니의 남매입니다.",
  bands: [
    { id: "parents", ko: "부모 세대", en: "Parents", hint: "엘리사벳은 마리아의 친족입니다. 촌수는 적혀 있지 않습니다.", color: "#3e4d7a", soft: "#e7edf7" },
    { id: "children", ko: "예수와 요한", en: "Jesus & John", hint: "요셉에서 예수로 가는 점선은 법적 아버지입니다. 형제라 불린 사람의 선도 점선입니다.", color: "#7a3454", soft: "#f8eef2" },
    { id: "fathers", ko: "제자의 아버지", en: "Fathers", hint: "세베대, 그리고 베드로의 아버지로 나오는 요나입니다.", color: "#1f3b57", soft: "#e6eef5" },
    { id: "circle", ko: "제자와 베다니", en: "Disciples & Bethany", hint: "형제인 제자 쌍과, 마르다·마리아·나사로입니다.", color: "#2d6844", soft: "#e8f4ee" },
  ],
  seeds: [
    {
      id: "zechariah",
      ko: "사가랴",
      en: "Zechariah",
      band: "parents",
      col: 0,
      y: 70,
      role: "제사장",
      summary: "아비야 반열의 제사장이고 엘리사벳의 남편이며 세례 요한의 아버지입니다.",
      cite: "눅 1:5, 13, 57–63 · Luke 1",
      aliases: ["사가랴", "Zechariah", "Zacharias"],
      pages: [book("luke", "누가복음")],
    },
    {
      id: "elizabeth",
      ko: "엘리사벳",
      en: "Elizabeth",
      band: "parents",
      col: 1.25,
      y: 70,
      role: "마리아의 친족",
      summary: "사가랴의 아내이고 세례 요한의 어머니입니다. 아론의 자손으로 소개되고, 마리아의 친족입니다. 정확한 촌수는 나오지 않습니다.",
      cite: "눅 1:5, 36, 57 · Luke 1",
      aliases: ["엘리사벳", "Elizabeth"],
      pages: [book("luke", "누가복음")],
    },
    {
      id: "joseph-nt",
      ko: "요셉",
      en: "Joseph",
      band: "parents",
      col: 3.5,
      y: 70,
      role: "마리아의 남편",
      badge: { text: "법적", tone: "ink" },
      summary: "마리아의 남편입니다. 복음서는 예수를 요셉의 아들로 여기던 일을 적고, 동시에 마리아가 성령으로 잉태했다고 적습니다. 족장 요셉과는 다른 사람입니다.",
      cite: "마 1:16, 18–25; 눅 1:27; 3:23 · Matt 1; Luke 1, 3",
      note: "마태복음 1:16은 요셉을 마리아의 남편으로 적고, 누가복음 3:23은 '사람들이 아는 대로는 요셉의 아들'이라고 적습니다.",
      aliases: ["요셉", "Joseph"],
      pages: [book("matthew", "마태복음"), book("luke", "누가복음")],
    },
    {
      id: "mary",
      ko: "마리아",
      en: "Mary",
      band: "parents",
      col: 4.75,
      y: 70,
      role: "예수의 어머니",
      summary: "예수의 어머니이고 요셉의 아내입니다. 더 초즌에서 예수의 어머니로 나옵니다. 엘리사벳의 친족입니다.",
      cite: "마 1:16, 18–25; 눅 1:26–38, 36; 2:5–7 · Matt 1; Luke 1–2",
      aliases: ["마리아", "예수 어머니", "Mary"],
      pages: [person("mary-mother"), book("luke", "누가복음")],
    },
    {
      id: "john-baptist",
      ko: "세례 요한",
      en: "John",
      band: "children",
      col: 0.625,
      y: 202,
      role: "사가랴의 아들",
      summary: "사가랴와 엘리사벳의 아들입니다. 더 초즌에는 세례자 요한으로 나옵니다.",
      cite: "눅 1:13, 57–63 · Luke 1",
      aliases: ["세례 요한", "세례자 요한", "John the Baptist", "Baptist"],
      pages: [person("john-the-baptist"), book("luke", "누가복음")],
    },
    {
      id: "james-brother",
      ko: "야고보",
      en: "James",
      band: "children",
      col: 3.15,
      y: 202,
      role: "예수의 형제",
      badge: { text: "전통", tone: "purple" },
      summary: "복음서가 예수의 형제로 부르는 사람입니다. 세베대의 아들 야고보, 더 초즌의 큰 야고보와는 다른 사람입니다. 야고보서는 전통적으로 이 야고보의 글로 여겨집니다.",
      cite: "마 13:55; 막 6:3; 갈 1:19 · Matt 13; Mark 6; Gal 1",
      note: "친형제, 요셉의 전처 자녀, 또는 사촌으로 보는 전통이 나뉩니다. 점선은 그 차이입니다.",
      aliases: ["야고보", "예수의 형제 야고보", "James"],
      pages: [book("james", "야고보서"), book("matthew", "마태복음")],
    },
    {
      id: "jesus",
      ko: "예수",
      en: "Jesus",
      band: "children",
      col: 4.75,
      y: 202,
      summary: "마리아의 아들입니다. 마태복음과 누가복음은 성령으로 잉태했다고 적고, 요셉을 법적 아버지로 계보에 올립니다. 더 초즌의 중심 인물입니다.",
      cite: "마 1:16, 18–25; 눅 1:26–35; 2:1–7; 3:23 · Matt 1; Luke 1–3",
      note: "요셉으로 가는 점선은 법적·족보상의 아버지입니다.",
      aliases: ["예수", "예수 그리스도", "Jesus", "Christ"],
      pages: [person("jesus"), book("matthew", "마태복음"), book("luke", "누가복음"), jump("david", "gap-messiah", "다윗 가문 계보")],
    },
    {
      id: "jude-brother",
      ko: "유다",
      en: "Jude",
      band: "children",
      col: 6.2,
      y: 202,
      role: "예수의 형제",
      badge: { text: "전통", tone: "purple" },
      summary: "복음서가 예수의 형제로 부르는 유다입니다. 가룟 유다와는 다른 사람이고, 야곱의 아들 유다와도 다릅니다. 유다서는 전통적으로 이 유다의 글로 여겨집니다.",
      cite: "마 13:55; 막 6:3; 유 1 · Matt 13; Mark 6; Jude 1",
      note: "친형제, 요셉의 전처 자녀, 또는 사촌으로 보는 전통이 나뉩니다.",
      aliases: ["유다", "예수의 형제 유다", "Jude", "Judas"],
      pages: [book("jude", "유다서"), book("matthew", "마태복음")],
    },
    {
      id: "zebedee",
      ko: "세베대",
      en: "Zebedee",
      band: "fathers",
      col: 0.625,
      y: 334,
      summary: "야고보와 요한의 아버지입니다. 어머니는 이 그림에 넣지 않았습니다.",
      cite: "마 4:21 · Matt 4",
      aliases: ["세베대", "Zebedee"],
      pages: [book("matthew", "마태복음")],
    },
    {
      id: "jonah-father",
      ko: "요나",
      en: "Jonah",
      band: "fathers",
      col: 3.5,
      y: 334,
      role: "베드로의 아버지",
      summary: "베드로의 아버지로 나오는 사람입니다. 안드레도 그의 형제로 나오므로 같은 아버지 아래 그렸습니다. 선지자 요나와는 다른 사람입니다. 마태복음 16:17은 요나, 요한복음 1:42는 요한이라고 부릅니다.",
      cite: "마 16:17; 요 1:42 · Matt 16; John 1",
      note: "한글 마태복음 16:17은 '바요나'이고, 요한복음 1:42는 '요한의 아들'입니다.",
      aliases: ["요나", "요한", "Jonah", "John"],
      pages: [book("matthew", "마태복음"), book("john", "요한복음")],
    },
    {
      id: "james-zebedee",
      ko: "야고보",
      en: "James",
      band: "circle",
      col: 0,
      y: 466,
      role: "세베대의 아들",
      summary: "세베대와 요한의 형제입니다. 더 초즌에서는 작은 야고보와 구분하여 큰 야고보라고 부릅니다.",
      cite: "마 4:21; 막 1:19–20 · Matt 4; Mark 1",
      aliases: ["큰 야고보", "야고보", "James", "James son of Zebedee"],
      pages: [person("big-james"), book("matthew", "마태복음")],
    },
    {
      id: "john-apostle",
      ko: "요한",
      en: "John",
      band: "circle",
      col: 1.25,
      y: 466,
      role: "세베대의 아들",
      summary: "세베대와 야고보의 형제입니다. 더 초즌의 제자 요한입니다. 요한복음은 전통적으로 이 요한과 연결됩니다.",
      cite: "마 4:21; 막 1:19–20 · Matt 4; Mark 1",
      aliases: ["요한", "John", "세베대의 아들 요한"],
      pages: [person("john"), book("matthew", "마태복음"), book("john", "요한복음")],
    },
    {
      id: "peter",
      ko: "베드로",
      en: "Peter",
      band: "circle",
      col: 2.85,
      y: 466,
      role: "안드레의 형제",
      summary: "안드레와 형제입니다. 시몬이라고도 불립니다. 더 초즌의 제자 베드로입니다.",
      cite: "마 4:18; 16:17; 요 1:40–42 · Matt 4, 16; John 1",
      aliases: ["베드로", "시몬", "Peter", "Simon"],
      pages: [person("peter"), book("matthew", "마태복음")],
    },
    {
      id: "andrew",
      ko: "안드레",
      en: "Andrew",
      band: "circle",
      col: 4.15,
      y: 466,
      role: "베드로의 형제",
      summary: "베드로와 형제입니다. 더 초즌의 제자 안드레입니다.",
      cite: "마 4:18; 요 1:40 · Matt 4; John 1",
      aliases: ["안드레", "Andrew"],
      pages: [person("andrew"), book("matthew", "마태복음")],
    },
    {
      id: "martha",
      ko: "마르다",
      en: "Martha",
      band: "circle",
      col: 6.3,
      y: 466,
      role: "베다니",
      summary: "마리아와 나사로의 자매입니다. 부모의 이름은 나오지 않습니다. 더 초즌에서 베다니의 가족으로 나옵니다.",
      cite: "눅 10:38–42; 요 11:1–5 · Luke 10; John 11",
      aliases: ["마르다", "Martha"],
      pages: [person("martha"), book("john", "요한복음")],
    },
    {
      id: "mary-bethany",
      ko: "마리아",
      en: "Mary",
      band: "circle",
      col: 7.55,
      y: 466,
      role: "베다니",
      summary: "마르다와 나사로의 자매입니다. 예수의 어머니 마리아, 막달라 마리아와는 다른 사람입니다. 더 초즌에서 베다니의 가족으로 나옵니다.",
      cite: "눅 10:38–42; 요 11:1–2 · Luke 10; John 11",
      aliases: ["베다니 마리아", "마리아", "Mary of Bethany"],
      pages: [person("mary-of-bethany"), book("john", "요한복음")],
    },
    {
      id: "lazarus",
      ko: "나사로",
      en: "Lazarus",
      band: "circle",
      col: 8.8,
      y: 466,
      role: "베다니",
      summary: "마르다와 마리아의 오빠로 소개됩니다. 더 초즌에서 베다니의 가족으로 나옵니다.",
      cite: "요 11:1–5 · John 11",
      aliases: ["나사로", "Lazarus"],
      pages: [person("lazarus"), book("john", "요한복음")],
    },
  ],
  links: [],
};

JESUS.links = (() => {
  const out: TreeLink[] = [];
  const L = linksOf((link) => out.push(link));
  const brothers = "마 13:55; 막 6:3 · Matt 13; Mark 6";
  L.spouse("zechariah", "elizabeth", "눅 1:5 · Luke 1");
  L.parents("john-baptist", "눅 1:13, 57 · Luke 1", "zechariah", "elizabeth");
  L.kin("elizabeth", "mary", "눅 1:36 · Luke 1");
  L.spouse("joseph-nt", "mary", "마 1:18–24; 눅 1:27 · Matt 1; Luke 1");
  L.parent("mary", "jesus", "마 1:16; 눅 1:31; 2:7 · Matt 1; Luke 1–2");
  L.variant("joseph-nt", "jesus", "마 1:16; 눅 3:23 · Matt 1; Luke 3");
  L.variant("mary", "james-brother", brothers);
  L.variant("joseph-nt", "james-brother", brothers);
  L.variant("mary", "jude-brother", brothers);
  L.variant("joseph-nt", "jude-brother", brothers);
  L.sibling("james-brother", "jesus", brothers);
  L.sibling("jesus", "jude-brother", brothers);
  L.sibling("james-brother", "jude-brother", brothers);
  L.parent("zebedee", "james-zebedee", "마 4:21 · Matt 4");
  L.parent("zebedee", "john-apostle", "마 4:21 · Matt 4");
  L.parent("jonah-father", "peter", "마 16:17; 요 1:42 · Matt 16; John 1");
  L.parent("jonah-father", "andrew", "마 4:18; 요 1:40 · Matt 4; John 1");
  L.sibling("martha", "mary-bethany", "요 11:1 · John 11");
  L.sibling("mary-bethany", "lazarus", "요 11:1 · John 11");
  L.sibling("martha", "lazarus", "요 11:1–5 · John 11");
  return out;
})();

const INPUTS: EraInput[] = [GENESIS, PATRIARCHS, EXODUS, DAVID, JESUS];

export type LayoutNode = TreeSeed & {
  era: EraId;
  x: number;
  y: number;
  w: number;
  h: number;
  sub: string;
  caption: string;
  keys: string[];
};

export type LayoutEdge = {
  id: string;
  d: string;
  d2?: string;
  kind: LinkKind;
  from: string;
  to: string;
  local: boolean;
  quiet: boolean;
};

export type LayoutBand = BandMeta & {
  top: number;
  height: number;
  nodeIds: string[];
};

export type EraLayout = EraMeta & {
  width: number;
  height: number;
  nodes: LayoutNode[];
  edges: LayoutEdge[];
  bands: LayoutBand[];
};

export type RelationPerson = { id: string; ko: string; en: string; ref: string };

type Box = { id: string; x: number; y: number; w: number; h: number; cx: number; cy: number };

function norm(value: string) {
  return value.toLowerCase().replace(/[\s·.'’\-()/_]/g, "");
}

function captionFor(id: string, links: TreeLink[], byId: Map<string, TreeSeed>) {
  const names = links
    .filter((link) => link.to === id && link.kind === "parent")
    .map((link) => byId.get(link.from)?.ko)
    .filter((name): name is string => Boolean(name) && name !== "…");
  return names.join("·");
}

function layoutEra(input: EraInput): EraLayout {
  const bySeed = new Map(input.seeds.map((seed) => [seed.id, seed]));
  const cols = input.seeds.map((seed) => seed.col);
  const min = Math.min(...cols);
  const max = Math.max(...cols);
  const width = (max - min) * COL + NODE_W + PAD * 2;
  const nodes: LayoutNode[] = input.seeds.map((seed) => {
    const keys = [seed.ko, seed.en, seed.id, seed.role, ...(seed.aliases ?? [])].filter((key): key is string => Boolean(key));
    return {
      ...seed,
      era: input.id,
      x: PAD + (seed.col - min) * COL,
      w: NODE_W,
      h: NODE_H,
      sub: seed.ellipsis ? "여러 세대" : seed.en,
      caption: seed.role || captionFor(seed.id, input.links, bySeed),
      badge: seed.badge ?? (seed.key ? { text: "주요", tone: "gold" } : undefined),
      keys,
    };
  });
  const height = Math.max(...nodes.map((node) => node.y + node.h)) + 28;
  const edges = edgePaths(nodes, input.links);
  const bands = input.bands.map((meta) => {
    const group = nodes.filter((node) => node.band === meta.id).sort((a, b) => a.y - b.y || a.x - b.x);
    if (!group.length) throw new Error(`가족관계도 빈 세대: ${input.id}/${meta.id}`);
    const top = Math.min(...group.map((node) => node.y)) - BAND_LABEL;
    const bottom = Math.max(...group.map((node) => node.y + node.h)) + BAND_BOTTOM;
    return { ...meta, top, height: bottom - top, nodeIds: group.map((node) => node.id) };
  });
  validate(input, nodes, bands);
  return {
    id: input.id,
    ko: input.ko,
    en: input.en,
    lead: input.lead,
    width,
    height,
    nodes,
    edges,
    bands,
  };
}

function edgePaths(nodes: LayoutNode[], links: TreeLink[]): LayoutEdge[] {
  const box = new Map(boxes(nodes).map((item) => [item.id, item]));
  const drawn: LayoutEdge[] = [];
  for (const link of links) {
    if (link.kind === "sibling" && (hasParentLine(link.from, links) || hasParentLine(link.to, links))) continue;
    const from = box.get(link.from);
    const to = box.get(link.to);
    if (!from || !to) continue;
    if (link.kind === "sibling" && someoneBetween(from, to, [...box.values()])) continue;
    const path: { d: string; d2?: string } =
      link.kind === "spouse"
        ? spousePath(from, to)
        : link.kind === "kin"
          ? kinPath(from, to)
          : link.kind === "sibling"
            ? siblingPath(from, to)
            : directedPath(from, to);
    const dx = Math.abs(from.cx - to.cx);
    const dy = Math.abs(from.cy - to.cy);
    const local = link.kind === "spouse" ? dx < COL * 1.6 && dy < NODE_H * 1.4 : dx < COL * 1.8 && dy < 220;
    drawn.push({
      id: `${link.kind}-${link.from}-${link.to}`,
      d: path.d,
      d2: path.d2,
      kind: link.kind,
      from: link.from,
      to: link.to,
      local,
      quiet: Math.hypot(dx, dy) > 560,
    });
  }
  return drawn;
}

function hasParentLine(id: string, links: TreeLink[]) {
  return links.some((link) => link.to === id && (link.kind === "parent" || link.kind === "variant"));
}

function someoneBetween(a: Box, b: Box, all: Box[]) {
  const left = Math.min(a.cx, b.cx);
  const right = Math.max(a.cx, b.cx);
  return all.some((item) => item.id !== a.id && item.id !== b.id && Math.abs(item.cy - a.cy) < 24 && item.cx > left + 8 && item.cx < right - 8);
}

function boxes(nodes: LayoutNode[]): Box[] {
  return nodes.map((node) => ({
    id: node.id,
    x: node.x,
    y: node.y,
    w: node.w,
    h: node.h,
    cx: node.x + node.w / 2,
    cy: node.y + node.h / 2,
  }));
}

function directedPath(from: Box, to: Box): { d: string; d2?: string } {
  const downward = from.cy <= to.cy;
  const x1 = from.cx;
  const y1 = downward ? from.y + from.h : from.y;
  const x2 = to.cx;
  const y2 = downward ? to.y : to.y + to.h;
  if (Math.abs(x1 - x2) < 6) return { d: `M ${x1} ${y1} V ${y2}` };
  const mid = (y1 + y2) / 2;
  return { d: `M ${x1} ${y1} C ${x1} ${mid}, ${x2} ${mid}, ${x2} ${y2}` };
}

function spousePath(a: Box, b: Box): { d: string; d2?: string } {
  const left = a.cx <= b.cx ? a : b;
  const right = a.cx <= b.cx ? b : a;
  const x1 = left.x + left.w;
  const x2 = right.x;
  const gap = x2 - x1;
  if (Math.abs(a.cy - b.cy) < 24 && gap < COL * 0.75) {
    const y = (left.cy + right.cy) / 2;
    return { d: `M ${x1} ${y - 2.5} H ${x2}`, d2: `M ${x1} ${y + 2.5} H ${x2}` };
  }
  if (Math.abs(a.cy - b.cy) < 24) {
    const y = left.y;
    const mid = (left.cx + right.cx) / 2;
    const lift = Math.min(32, 16 + Math.abs(right.cx - left.cx) * 0.04);
    return { d: `M ${left.cx} ${y} Q ${mid} ${y - lift}, ${right.cx} ${y}` };
  }
  const upper = a.cy <= b.cy ? a : b;
  const lower = a.cy <= b.cy ? b : a;
  const mid = (upper.y + upper.h + lower.y) / 2;
  const bow = upper.cx <= lower.cx ? 28 : -28;
  return { d: `M ${upper.cx} ${upper.y + upper.h} C ${upper.cx + bow} ${mid}, ${lower.cx + bow} ${mid}, ${lower.cx} ${lower.y}` };
}

function kinPath(a: Box, b: Box): { d: string } {
  const left = a.cx <= b.cx ? a : b;
  const right = a.cx <= b.cx ? b : a;
  const y = Math.min(left.y, right.y);
  const mid = (left.cx + right.cx) / 2;
  const lift = Math.min(34, 16 + (right.cx - left.cx) * 0.035);
  return { d: `M ${left.cx} ${y} Q ${mid} ${y - lift}, ${right.cx} ${y}` };
}

function siblingPath(a: Box, b: Box): { d: string } {
  const left = a.cx <= b.cx ? a : b;
  const right = a.cx <= b.cx ? b : a;
  const y = Math.min(left.y, right.y);
  const mid = (left.cx + right.cx) / 2;
  return { d: `M ${left.cx} ${y} Q ${mid} ${y - 14}, ${right.cx} ${y}` };
}

function validate(input: EraInput, nodes: LayoutNode[], bands: LayoutBand[]) {
  const ids = new Set<string>();
  for (const node of nodes) {
    if (ids.has(node.id)) throw new Error(`가족관계도 id 중복: ${node.id}`);
    ids.add(node.id);
    if (!node.cite) throw new Error(`출처 없음: ${node.id}`);
    if (!input.bands.some((band) => band.id === node.band)) throw new Error(`없는 세대: ${node.id}`);
  }
  for (const link of input.links) {
    if (!ids.has(link.from) || !ids.has(link.to)) throw new Error(`가족관계도 선 오류: ${link.kind} ${link.from} → ${link.to}`);
    if (!link.ref) throw new Error(`관계 출처 없음: ${link.from} → ${link.to}`);
  }
  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const a = nodes[i];
      const b = nodes[j];
      const overlapX = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
      const overlapY = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
      if (overlapX > 2 && overlapY > 2) throw new Error(`가족관계도 칸이 겹칩니다: ${a.id} · ${b.id}`);
      if (a.band !== b.band || overlapX < 18) continue;
      const upper = a.y <= b.y ? a : b;
      const lower = a.y <= b.y ? b : a;
      const gap = lower.y - (upper.y + upper.h);
      if (gap < 0 || gap > 72) continue;
      const related = input.links.some(
        (link) => (link.from === a.id && link.to === b.id) || (link.from === b.id && link.to === a.id),
      );
      if (!related) throw new Error(`위아래가 어긋납니다: ${upper.id} 아래 ${lower.id}`);
    }
  }
  for (let i = 1; i < bands.length; i += 1) {
    const gap = bands[i].top - (bands[i - 1].top + bands[i - 1].height);
    if (gap < 8) throw new Error(`세대 간격이 좁습니다: ${input.id} ${bands[i - 1].id} → ${bands[i].id} (${gap})`);
  }
}

export const ERAS: EraLayout[] = INPUTS.map(layoutEra);

const LINKS = new Map<EraId, TreeLink[]>(INPUTS.map((input) => [input.id, input.links]));

export const ALL_NODES: LayoutNode[] = ERAS.flatMap((era) => era.nodes);

const nodeById = new Map(ALL_NODES.map((node) => [node.id, node]));

function eraLinks(id: string) {
  const node = nodeById.get(id);
  if (!node) throw new Error(id);
  return LINKS.get(node.era) ?? [];
}

function personRef(id: string, ref: string): RelationPerson {
  const node = nodeById.get(id);
  if (!node) throw new Error(id);
  return { id: node.id, ko: node.ko, en: node.ellipsis ? "gap" : node.en, ref };
}

function byX(a: RelationPerson, b: RelationPerson) {
  return (nodeById.get(a.id)?.x ?? 0) - (nodeById.get(b.id)?.x ?? 0);
}

function uniquePeople(people: RelationPerson[]) {
  const seen = new Set<string>();
  return people.filter((person) => (seen.has(person.id) ? false : (seen.add(person.id), true)));
}

export function relationsOf(id: string) {
  const links = eraLinks(id);
  const pick = (kind: LinkKind, dir: "to" | "from") =>
    links
      .filter((link) => link.kind === kind && (dir === "to" ? link.to === id : link.from === id))
      .map((link) => personRef(dir === "to" ? link.from : link.to, link.ref))
      .sort(byX);
  const parents = pick("parent", "to");
  const variantParents = pick("variant", "to");
  const children = pick("parent", "from");
  const variantChildren = pick("variant", "from");
  const spouses = links
    .filter((link) => link.kind === "spouse" && (link.from === id || link.to === id))
    .map((link) => personRef(link.from === id ? link.to : link.from, link.ref))
    .sort(byX);
  const kin = links
    .filter((link) => link.kind === "kin" && (link.from === id || link.to === id))
    .map((link) => personRef(link.from === id ? link.to : link.from, link.ref))
    .sort(byX);
  const skipPrev = pick("skip", "to");
  const skipNext = pick("skip", "from");

  const parentIds = new Set(
    links.filter((link) => link.to === id && (link.kind === "parent" || link.kind === "variant")).map((link) => link.from),
  );
  const siblingIds = new Set<string>();
  for (const link of links) {
    if ((link.kind !== "parent" && link.kind !== "variant") || !parentIds.has(link.from) || link.to === id) continue;
    siblingIds.add(link.to);
  }
  const explicit = links.filter((link) => link.kind === "sibling");
  const queue = explicit.filter((link) => link.from === id || link.to === id).map((link) => (link.from === id ? link.to : link.from));
  const seen = new Set<string>([id]);
  while (queue.length) {
    const next = queue.pop()!;
    if (seen.has(next)) continue;
    seen.add(next);
    siblingIds.add(next);
    for (const link of explicit) {
      if (link.from === next) queue.push(link.to);
      if (link.to === next) queue.push(link.from);
    }
  }
  const siblings = uniquePeople([...siblingIds].map((siblingId) => personRef(siblingId, ""))).sort(byX);
  return { parents, variantParents, children, variantChildren, spouses, kin, siblings, skipPrev, skipNext };
}

export function searchNodes(query: string) {
  const q = norm(query);
  if (!q) return [];
  return ALL_NODES.filter((node) => !node.ellipsis)
    .map((node) => {
      const keys = node.keys.map(norm);
      const exact = keys.some((key) => key === q);
      const prefix = keys.some((key) => key.startsWith(q));
      const hit = exact || prefix || keys.some((key) => key.includes(q));
      return { node, exact, prefix, hit };
    })
    .filter((item) => item.hit)
    .sort((a, b) => Number(b.exact) - Number(a.exact) || Number(b.prefix) - Number(a.prefix) || a.node.ko.localeCompare(b.node.ko, "ko"))
    .map((item) => item.node);
}

export function resolveFocus(query: string | null | undefined) {
  if (!query) return null;
  const direct = nodeById.get(query);
  if (direct) return direct;
  const hits = searchNodes(query).filter((node) => node.keys.some((key) => norm(key) === norm(query)));
  return hits.length === 1 ? hits[0] : null;
}

export function familyTreeHref(era: EraId, focus?: string) {
  const params = new URLSearchParams();
  params.set("era", era);
  if (focus) params.set("focus", focus);
  return `${FAMILY_TREE_PATH}?${params.toString()}`;
}

export function familyTreeHrefForSlug(slug: string) {
  const node = ALL_NODES.find((item) => item.pages?.some((page) => page.href === `/characters/${slug}`));
  return node ? familyTreeHref(node.era, node.id) : null;
}

for (const node of ALL_NODES) {
  for (const page of node.pages ?? []) {
    if (!page.href.startsWith(FAMILY_TREE_PATH)) continue;
    const focus = new URL(page.href, "https://example.com").searchParams.get("focus");
    if (focus && !nodeById.has(focus)) throw new Error(`가족관계도 링크 대상 없음: ${page.href}`);
  }
}

export const DISPUTES = [
  {
    id: "joseph",
    title: "요셉은 어떤 아버지인가",
    main: "마태복음 1:18–25와 누가복음 1:26–35는 마리아가 성령으로 잉태했다고 적습니다. 요셉은 마리아의 남편입니다.",
    other: "마태복음 1:16은 족보에서 요셉을 마리아의 남편으로 올리고, 누가복음 3:23은 예수를 '사람들이 아는 대로는 요셉의 아들'이라고 적습니다. 그림의 점선은 이 법적·족보상의 관계입니다.",
  },
  {
    id: "brothers",
    title: "예수의 형제",
    main: "마태복음 13:55와 마가복음 6:3은 야고보, 요셉, 시몬, 유다를 예수의 형제로 부르고, 누이는 이름 없이 언급합니다. 이 그림에는 야고보와 유다만 두었습니다.",
    other: "후대에는 이들을 마리아와 요셉의 자녀로 보기도 하고, 요셉의 전처 자녀로 보기도 하고, 사촌으로 보기도 합니다. 점선은 그 차이를 표시한 것이며 어느 한쪽을 고르지 않습니다.",
  },
  {
    id: "genealogies",
    title: "마태와 누가의 족보",
    main: "마태복음 1:6–16은 다윗과 솔로몬을 거쳐 요셉에게 내려옵니다.",
    other: "누가복음 3:23–31은 다윗의 다른 아들 나단을 거쳐 올라갑니다. 두 목록은 중간 이름이 다릅니다. … 칸은 그 구간을 건너뛴 것입니다.",
  },
  {
    id: "jonah",
    title: "베드로 아버지의 이름",
    main: "마태복음 16:17은 시몬을 '바요나', 곧 요나의 아들이라고 부릅니다.",
    other: "요한복음 1:42는 '요한의 아들 시몬'이라고 부릅니다. 그림의 칸은 요나로 두었고, 선지자 요나와는 다른 사람입니다.",
  },
  {
    id: "kin",
    title: "마리아와 엘리사벳",
    main: "누가복음 1:36은 엘리사벳을 마리아의 친족이라고 합니다. 한글 성경은 촌수를 정하지 않습니다.",
    other: "KJV는 cousin이라고 옮깁니다. 부모를 이어서 그리지는 않았고, 두 사람 사이의 점선만 두었습니다.",
  },
] as const;

export const NAME_NOTES = [
  {
    title: "야고보가 셋",
    body: "이 그림의 야고보는 둘입니다. 예수의 형제로 불리는 야고보, 세베대의 아들 야고보(더 초즌의 큰 야고보)입니다. 열두 제자 안의 알패오의 아들 야고보(더 초즌의 작은 야고보)는 넣지 않았습니다.",
  },
  {
    title: "유다가 셋",
    body: "야곱의 아들 유다, 예수의 형제로 불리는 유다, 가룟 유다는 서로 다른 사람입니다. 가룟 유다는 가족 관계로 그리지 않았습니다.",
  },
  {
    title: "요셉이 둘",
    body: "야곱의 아들 요셉과, 마리아의 남편 요셉은 다른 사람입니다.",
  },
  {
    title: "마리아가 셋",
    body: "예수의 어머니 마리아와 베다니의 마리아를 그렸습니다. 막달라 마리아는 이 가계에 없어 칸을 만들지 않았습니다.",
  },
  {
    title: "요한이 둘",
    body: "세례 요한(더 초즌의 세례자 요한)과 세베대의 아들 요한은 다른 사람입니다. 베드로의 아버지로 요한이라는 이름이 요한복음에 나오지만, 선지자 요나와도 다릅니다.",
  },
] as const;

export const OMISSIONS = [
  "수명과 나이는 적지 않았습니다.",
  "자녀가 여럿이면 이 가계에서 이어지는 이름만 남겼습니다. 셋과 노아, 레위와 아므람, 베레스와 보아스, 솔로몬과 예수 사이는 … 로 건너뛰었습니다.",
  "롯은 아브라함의 조카입니다(창 11:27). 에서와 이스마엘의 자손, 야곱의 딸 디나(창 30:21), 모세의 아들(출 18:3–4), 사울의 다른 자녀(삼상 14:49)는 그리지 않았습니다.",
  "예수의 형제로 함께 불리는 요셉과 시몬, 그리고 누이들은 본문에 언급만 하고 칸은 만들지 않았습니다(마 13:55, 막 6:3).",
] as const;

export function eraOf(id: EraId) {
  return ERAS.find((era) => era.id === id)!;
}
