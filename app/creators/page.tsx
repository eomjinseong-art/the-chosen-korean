import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AvoirAd } from "@/components/AvoirAd";
import { pageMeta } from "@/lib/seo";
import { COMPANIES, DALLAS, TEAM } from "@/content/archive/creators";

export const metadata = pageMeta({
  title: "더 초즌 제작진 — 감독 댈러스 젠킨스와 만든 사람들",
  description: "더 초즌(The Chosen)을 만든 사람들. 창작자이자 감독 댈러스 젠킨스, 공동 창업자 데럴 이브스, 공동 작가 라이언 스완슨·타일러 톰슨, 대본 자문과 제작·배급사를 정리했습니다.",
  path: "/creators",
});

export default function CreatorsPage() {
  return (
    <article>
      <Breadcrumbs items={[{ name: "제작진", path: "/creators" }]} />
      <h1>🎬 더 초즌을 만든 사람들</h1>
      <Link href="/creators/dallas-jenkins" className="card feature-card">
        <p className="eyebrow">창작자 · 감독</p>
        <strong className="card-title">{DALLAS.nameKo} ({DALLAS.nameEn})</strong>
        <p className="card-text">{DALLAS.bio[3]}</p>
        <span className="more">감독 이야기 전체 보기 →</span>
      </Link>

      <h2>함께 만드는 사람들</h2>
      <div className="grid two">
        {TEAM.map((t) => (
          <div key={t.name} className="card">
            <strong className="card-title">{t.name}</strong>
            <p className="eyebrow">{t.role}</p>
            <p className="card-text">{t.text}</p>
          </div>
        ))}
      </div>

      <AvoirAd place="creators" />

      <h2>제작·배급을 맡은 곳</h2>
      <ul className="plain-list">
        {COMPANIES.map((c) => (
          <li key={c.name}>
            <strong>{c.name}</strong> — {c.text}
          </li>
        ))}
      </ul>
      <p className="muted small">
        출처: 위키백과 영어판 〈<a href="https://en.wikipedia.org/wiki/The_Chosen_(TV_series)" target="_blank" rel="noopener noreferrer">The Chosen (TV series)</a>〉, 〈<a href="https://en.wikipedia.org/wiki/Dallas_Jenkins" target="_blank" rel="noopener noreferrer">Dallas Jenkins</a>〉(2026년 9월 확인)
      </p>
      <p className="back"><Link href="/making">제작 이야기와 기록 보기 →</Link></p>
    </article>
  );
}
