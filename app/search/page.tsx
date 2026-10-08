import { getGuide, stripMd } from "@/lib/guide";
import { anchorId } from "@/lib/characters";
import { SearchClient, type SearchItem } from "@/components/SearchClient";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { pageMeta } from "@/lib/seo";
import { getWorks, workPath } from "@/lib/together";
import { enTitle, getHymns, hymnPath } from "@/lib/hymns";
import { bookPath, getBooks } from "@/lib/bibleBooks";
import { ALL_NODES, eraOf, familyTreeHref } from "@/lib/familyTree";

export const metadata = pageMeta({
  title: "검색 — 에피소드·인물·성경 구절·성경 66권·가족관계도·찬송가",
  description: "더 초즌 한국어 가이드 검색. 에피소드 줄거리, 등장인물, 성경 구절, 성경 66권, 가족관계도, 찬송가를 한 번에 찾아보세요.",
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
    ...getHymns().map((h) => ({
      type: "찬송가" as const,
      title: `🎵 ${h.n}장 ${h.title}`,
      sub: h.en ? enTitle(h) : h.origin,
      text: [h.n, `${h.n}장`, h.title, h.en || "", h.text, h.music, h.story, ...h.tags, ...h.refs].join(" "),
      href: hymnPath(h),
    })),
    ...ALL_NODES.filter((n) => !n.ellipsis).map((n) => ({
      type: "가족관계도" as const,
      title: n.ko,
      sub: `${eraOf(n.era).ko} · ${n.en}`,
      text: [n.ko, n.en, n.role || "", n.summary, n.note || "", n.cite, ...(n.aliases ?? [])].join(" "),
      href: familyTreeHref(n.era, n.id),
    })),
    ...getBooks().map((b) => ({
      type: "성경 66권" as const,
      title: `📚 ${b.ko}`,
      sub: `${b.en} · ${b.testament} ${b.group}`,
      text: stripMd([b.ko, b.en, b.group, b.author, b.dateTrad, b.dateSch, b.period, ...b.notes, b.keyVerse.ref, b.keyVerse.ko].join(" ")),
      href: bookPath(b),
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
