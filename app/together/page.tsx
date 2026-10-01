import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { TMd } from "@/components/TogetherMd";
import { absoluteUrl, pageMeta } from "@/lib/seo";
import { getWorks, TOGETHER_INTRO, TOGETHER_PATH, workPath } from "@/lib/together";

export const metadata = pageMeta({
  title: "같이 보면 좋은 콘텐츠 — 더 초즌과 함께 볼 영화·다큐",
  description: `더 초즌(The Chosen)과 함께 보면 좋은 작품 모음. ${getWorks()
    .map((w) => `「${w.titleKo}」(${w.titleEn}, ${w.year})`)
    .join(", ")}의 줄거리, 실화와 각색 구분, 영화에 나온 역사적 사실을 정리했습니다.`,
  path: TOGETHER_PATH,
});

export default function TogetherPage() {
  const works = getWorks();
  return (
    <article>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "같이 보면 좋은 콘텐츠",
          url: absoluteUrl(TOGETHER_PATH),
          itemListElement: works.map((w, i) => ({ "@type": "ListItem", position: i + 1, name: w.titleKo, url: absoluteUrl(workPath(w)) })),
        }}
      />
      <Breadcrumbs items={[{ name: "같이 보면 좋은 콘텐츠", path: TOGETHER_PATH }]} />
      <h1>🎞️ 같이 보면 좋은 콘텐츠</h1>
      <TMd as="p" className="lead" text={TOGETHER_INTRO} />
      <div className="grid cards">
        {works.map((w) => (
          <Link key={w.slug} href={workPath(w)} className="card">
            <span className="card-kicker">
              {w.kind} · {w.year}
            </span>
            <strong className="card-title">「{w.titleKo}」</strong>
            <span className="ep-en" lang="en">
              {w.titleEn}
            </span>
            <TMd as="p" className="card-text" text={w.tagline} />
            <span className="card-more">자세히 보기 →</span>
          </Link>
        ))}
      </div>
      <p className="muted small">
        포스터·스틸 같은 공식 이미지는 쓰지 않습니다. 작품 정보는 각 페이지 아래에 적은 출처에서 확인한 내용만 담았습니다.
      </p>
    </article>
  );
}
