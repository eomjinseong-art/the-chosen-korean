import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AvoirAd } from "@/components/AvoirAd";
import { pageMeta } from "@/lib/seo";
import { RECORDS, TIMELINE } from "@/content/archive/making";

export const metadata = pageMeta({
  title: "더 초즌 제작 이야기와 기록 — 크라우드펀딩부터 완결까지",
  description: "단편 하나에서 시작해 역대 1위 크라우드펀딩, 앱 무료 공개, 극장 개봉, 아마존 배급, 7시즌 완결 계획까지. 더 초즌(The Chosen)이 걸어온 길과 숫자로 본 기록을 정리했습니다.",
  path: "/making",
});

export default function MakingPage() {
  return (
    <article>
      <Breadcrumbs items={[{ name: "제작 이야기", path: "/making" }]} />
      <h1>📜 제작 이야기와 기록</h1>
      <p className="muted">흥행에 실패한 감독이 교회용으로 찍은 단편 하나가 어떻게 전 세계 수억 명이 보는 시리즈가 됐는지 정리했습니다.</p>

      <h2>숫자로 보는 더 초즌</h2>
      <div className="records">
        {RECORDS.map((r) => (
          <div key={r.label} className="record">
            <span className="record-label">{r.label}</span>
            <strong className="record-value">{r.value}</strong>
            <span className="record-note">{r.note}</span>
          </div>
        ))}
      </div>

      <h2>걸어온 길</h2>
      <ol className="timeline">
        {TIMELINE.slice(0, 8).map((t) => (
          <li key={t.title}>
            <span className="tl-when">{t.when}</span>
            <strong className="tl-title">{t.title}</strong>
            <p>{t.text}</p>
          </li>
        ))}
      </ol>
      <AvoirAd place="making" />
      <ol className="timeline" start={9}>
        {TIMELINE.slice(8).map((t) => (
          <li key={t.title}>
            <span className="tl-when">{t.when}</span>
            <strong className="tl-title">{t.title}</strong>
            <p>{t.text}</p>
          </li>
        ))}
      </ol>
      <p className="muted small">
        출처: 위키백과 영어판 〈<a href="https://en.wikipedia.org/wiki/The_Chosen_(TV_series)" target="_blank" rel="noopener noreferrer">The Chosen (TV series)</a>〉(2026년 9월 확인). 시청자 수는 제작진 추정치입니다.
      </p>
      <p className="back"><Link href="/creators">제작진 보기 →</Link> · <Link href="/map">촬영지 지도 →</Link></p>
    </article>
  );
}
