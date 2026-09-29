import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { pageMeta } from "@/lib/seo";
import { DAILY_TRANSLATION, sentVerses } from "@/lib/dailyVerses";

export const revalidate = 1800;

export const metadata = pageMeta({
  title: "오늘의 말씀 — 매일 아침·저녁 성경 한 구절",
  description: "매일 아침 5시 56분, 저녁 9시 56분에 전하는 성경 한 구절을 날짜별로 모았습니다. 개역한글 본문과 짧은 응원 한마디를 함께 담았습니다.",
  path: "/daily",
});

const SLOT = { morning: "🌅 아침", evening: "🌙 저녁" } as const;

function fmt(d: string) {
  const [y, m, day] = d.split("-").map(Number);
  const w = "일월화수목금토"[new Date(Date.UTC(y, m - 1, day)).getUTCDay()];
  return `${m}월 ${day}일 (${w})`;
}

export default function DailyPage() {
  const list = sentVerses();
  return (
    <article>
      <Breadcrumbs items={[{ name: "오늘의 말씀", path: "/daily" }]} />
      <h1>🕊️ 오늘의 말씀</h1>
      <p className="muted">매일 아침 5시 56분과 저녁 9시 56분(한국 시간)에 한 구절씩 더해집니다.</p>
      {list.length ? (
        <ol className="daily-list">
          {list.map((v) => (
            <li key={v.date + v.slot} className="daily-item">
              <p className="daily-when">
                {fmt(v.date)} · {SLOT[v.slot]}
              </p>
              <blockquote className="daily-text">{v.text}</blockquote>
              <p className="daily-ref">— {v.ref}</p>
              {v.cheer ? <p className="daily-cheer">{v.cheer}</p> : null}
            </li>
          ))}
        </ol>
      ) : (
        <p className="note-box">첫 구절은 2026년 9월 30일 아침 5시 56분에 올라옵니다.</p>
      )}
      <p className="muted small">성경 본문: {DAILY_TRANSLATION}(대한성서공회, 1961).</p>
      <p className="back">
        <Link href="/verses">더 초즌 성경 구절 모음 보기 →</Link>
      </p>
    </article>
  );
}
