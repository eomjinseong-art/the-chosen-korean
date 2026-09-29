import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { AvoirAd } from "@/components/AvoirAd";
import { absoluteUrl, pageMeta } from "@/lib/seo";
import { DALLAS } from "@/content/archive/creators";

export const metadata = pageMeta({
  title: "댈러스 젠킨스 — 더 초즌 감독 프로필과 작품",
  description: "더 초즌(The Chosen) 창작자이자 감독 댈러스 젠킨스(Dallas Jenkins). 출생과 가족, 신앙 영화를 만들게 된 계기, 실패작 뒤에 나온 더 초즌, 대표 작품을 정리했습니다.",
  path: "/creators/dallas-jenkins",
  type: "article",
});

export default function DallasPage() {
  const d = DALLAS;
  return (
    <article>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: d.nameEn,
          alternateName: d.nameKo,
          birthDate: "1975-07-25",
          jobTitle: "Film and television director",
          url: absoluteUrl("/creators/dallas-jenkins"),
          sameAs: [d.sources[0]],
        }}
      />
      <Breadcrumbs items={[{ name: "제작진", path: "/creators" }, { name: d.nameKo, path: "/creators/dallas-jenkins" }]} />
      <p className="eyebrow">{d.role}</p>
      <h1>{d.nameKo} <span className="muted">({d.nameEn})</span></h1>
      <dl className="info">
        {d.facts.map((f) => (
          <div key={f.label}>
            <dt>{f.label}</dt>
            <dd>{f.value}</dd>
          </div>
        ))}
      </dl>
      <h2>어떤 사람인가</h2>
      {d.bio.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
      <AvoirAd place="dallas" />
      <h2>주요 작품</h2>
      <ul className="roles">
        {d.works.map((w) => (
          <li key={w.title}>
            <strong>{w.year}</strong> · {w.title} — {w.role}
          </li>
        ))}
      </ul>
      <p className="muted small">
        출처:{" "}
        {d.sources.map((s, i) => (
          <span key={s}>
            {i ? ", " : ""}
            <a href={s} target="_blank" rel="noopener noreferrer">{decodeURIComponent(s.split("/wiki/")[1]).replace(/_/g, " ")} (위키백과)</a>
          </span>
        ))}{" "}
        · 2026년 9월 확인
      </p>
      <p className="back"><Link href="/creators">← 제작진 전체</Link></p>
    </article>
  );
}
