import { getGuide, stripMd } from "@/lib/guide";
import { anchorId } from "@/lib/characters";
import { SearchClient, type SearchItem } from "@/components/SearchClient";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { pageMeta } from "@/lib/seo";
import { getWorks, workPath } from "@/lib/together";

export const metadata = pageMeta({
  title: "검색 — 에피소드·인물·성경 구절",
  description: "더 초즌 한국어 가이드 검색. 에피소드 줄거리, 등장인물, 성경 구절을 한 번에 찾아보세요.",
  path: "/search",
});

export default function SearchPage() {
  const g = getGuide();
  const items: SearchItem[] = [
    ...g.episodes.map((e) => ({
      type: "에피소드" as const,
      title: `시즌${e.season} ${e.ep}화 · ${e.titleKo}`,
      sub: e.titleEn,
      text: stripMd([e.plot, e.point, e.characters.map((c) => c.raw).join(" "), e.sourceRaw].join(" ")),
      href: e.path,
    })),
    ...g.characters
      .filter((c) => c.appearances.length || c.slug)
      .map((c) => ({
        type: "인물" as const,
        title: c.name,
        sub: `${c.appearances.length}개 화 등장`,
        text: stripMd([c.sectionName || "", ...c.info.map((i) => i.value), ...c.seasonRoles.map((r) => r.role), ...c.appearances.map((a) => a.role)].join(" ")),
        href: c.slug ? `/characters/${c.slug}` : `/characters#${anchorId(c.key)}`,
      })),
    ...g.verses.map((v) => ({
      type: "성경 구절" as const,
      title: `📖 ${v.ref}`,
      sub: v.refEn,
      text: `${v.ko} ${v.en}`,
      href: `/verses#${v.id}`,
    })),
    ...getWorks().map((w) => ({
      type: "같이 보기" as const,
      title: `「${w.titleKo}」`,
      sub: `${w.titleEn} · ${w.kind} ${w.year}`,
      text: stripMd([w.tagline, ...w.plot, ...w.people.map((p) => `${p.name} ${p.actor || ""}`), ...(w.facts || []).map((f) => f.title)].join(" ")),
      href: workPath(w),
    })),
  ];
  return (
    <article>
      <Breadcrumbs items={[{ name: "검색", path: "/search" }]} />
      <h1>🔎 검색</h1>
      <SearchClient items={items} />
    </article>
  );
}
