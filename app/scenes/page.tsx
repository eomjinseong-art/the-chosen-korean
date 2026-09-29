import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AvoirAd } from "@/components/AvoirAd";
import { pageMeta } from "@/lib/seo";
import { getGuide } from "@/lib/guide";
import { QUOTES, SCENES } from "@/content/archive/scenes";

export const metadata = pageMeta({
  title: "더 초즌 명장면·명대사 — 시즌 1~5 꼭 봐야 할 순간",
  description: "더 초즌(The Chosen) 시즌 1~5의 명장면 14개와 기억에 남는 대사 14개. 장면마다 해당 에피소드와 이어지는 성경 구절을 함께 달았습니다.",
  path: "/scenes",
});

export default function ScenesPage() {
  const eps = new Map(getGuide().episodes.map((e) => [e.code, e]));
  const epLink = (code: string) => {
    const e = eps.get(code);
    return e ? (
      <Link href={e.path} className="chip">
        시즌{e.season} {e.ep}화 · {e.titleKo}
      </Link>
    ) : null;
  };
  return (
    <article>
      <Breadcrumbs items={[{ name: "명장면·명대사", path: "/scenes" }]} />
      <h1>✨ 명장면·명대사</h1>
      <h2>꼭 봐야 할 명장면</h2>
      <ol className="scene-list">
        {SCENES.map((s) => (
          <li key={s.code + s.title} className="scene">
            <strong className="scene-title">{s.title}</strong>
            <p>{s.text}</p>
            <p className="scene-meta">
              {epLink(s.code)} <span className="muted">📖 {s.bible}</span>
            </p>
          </li>
        ))}
      </ol>
      <AvoirAd place="scenes" />
      <h2>기억에 남는 대사</h2>
      <p className="muted small">드라마 속 대사를 우리말로 옮긴 것으로, 대부분 성경 본문에서 온 말입니다.</p>
      <ul className="quote-list">
        {QUOTES.map((q) => (
          <li key={q.code + q.line} className="quote">
            <blockquote>“{q.line}”</blockquote>
            <p className="quote-meta">
              — {q.speaker}, {q.context} {epLink(q.code)}
            </p>
          </li>
        ))}
      </ul>
      <p className="back"><Link href="/verses">성경 구절 모음 보기 →</Link></p>
    </article>
  );
}
