import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { pageMeta } from "@/lib/seo";
import { DAILY_TRANSLATION, allVerses, type DailyVerse } from "@/lib/dailyVerses";
import { AvoirAd } from "@/components/AvoirAd";

export const metadata = pageMeta({
  title: "오늘의 말씀 — 힘이 되는 성경 구절 모음",
  description: "아침에 힘을 주는 구절과 저녁에 마음을 내려놓는 구절을 한곳에 모았습니다. 개역한글 본문과 짧은 응원 한마디를 함께 담았습니다.",
  path: "/daily",
});

function List({ items }: { items: DailyVerse[] }) {
  return (
    <ol className="daily-list">
      {items.map((v, i) => (
        <li key={i} className="daily-item">
          <blockquote className="daily-text">{v.text}</blockquote>
          <p className="daily-ref">— {v.ref}</p>
          {v.cheer ? <p className="daily-cheer">{v.cheer}</p> : null}
        </li>
      ))}
    </ol>
  );
}

export default function DailyPage() {
  const { morning, evening } = allVerses();
  return (
    <article>
      <Breadcrumbs items={[{ name: "오늘의 말씀", path: "/daily" }]} />
      <h1>🕊️ 오늘의 말씀</h1>
      <p className="muted">
        하루를 여는 구절 {morning.length}개와 하루를 닫는 구절 {evening.length}개를 모았습니다.{" "}
        <a href="#morning">🌅 아침</a> · <a href="#evening">🌙 저녁</a>
      </p>
      <h2 id="morning">🌅 아침에 읽는 말씀</h2>
      <List items={morning} />
      <AvoirAd place="daily" />
      <h2 id="evening">🌙 저녁에 읽는 말씀</h2>
      <List items={evening} />
      <p className="muted small">성경 본문: {DAILY_TRANSLATION}(대한성서공회, 1961).</p>
      <p className="back">
        <Link href="/verses">더 초즌 성경 구절 모음 보기 →</Link>
      </p>
    </article>
  );
}
