import Link from "next/link";
import { getGuide } from "@/lib/guide";
import { Md } from "@/components/Md";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { VerseExplorer } from "@/components/VerseExplorer";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl, pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "더 초즌 명언·성경 구절 모음 — 영어 KJV 원문과 한글",
  description:
    "더 초즌(The Chosen) 에피소드와 이어지는 성경 구절 모음. 요한복음 3:16 등 꼭 기억할 10구절과 시즌별 구절을 영어 KJV 원문, 쉬운 한글 번역, 출처와 함께 정리했습니다.",
  path: "/verses",
});

export default function VersesPage() {
  const g = getGuide();
  const sorted = [...g.verses].sort((a, b) => (a.mustKnow || 99) - (b.mustKnow || 99));
  return (
    <article>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "더 초즌 성경 구절 모음",
          url: absoluteUrl("/verses"),
          numberOfItems: sorted.length,
          itemListElement: sorted.map((v, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: `${v.ref} (${v.refEn})`,
            url: absoluteUrl(`/verses#${v.id}`),
          })),
        }}
      />
      <Breadcrumbs items={[{ name: "성경 구절", path: "/verses" }]} />
      <h1>📖 명언·성경 구절 모음</h1>
      <div className="note-box">
        <strong>읽는 법</strong>
        <ul>
          {g.verseNote.map((l, i) => (
            <Md key={i} as="li" text={l} />
          ))}
        </ul>
      </div>
      <p className="note-box">
        매일 아침·저녁 한 구절씩 전하는 <Link href="/daily">오늘의 말씀</Link>도 함께 모아 두었어요.
      </p>
      <VerseExplorer verses={sorted} />
    </article>
  );
}
