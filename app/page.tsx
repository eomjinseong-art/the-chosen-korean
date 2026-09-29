import Link from "next/link";
import { getGuide } from "@/lib/guide";
import { Md } from "@/components/Md";
import { JsonLd } from "@/components/JsonLd";
import { pageMeta, absoluteUrl, SERIES_LD } from "@/lib/seo";
import { SITE_DESCRIPTION, SITE_FULL_NAME, SITE_URL, WATCH_NOTE } from "@/lib/site";

export const metadata = pageMeta({
  title: "더 초즌(The Chosen) 한국어 가이드 — 시즌 1~5 전 40화 줄거리·등장인물·성경 구절",
  description: SITE_DESCRIPTION,
  path: "/",
  absoluteTitle: true,
});

export default function Home() {
  const g = getGuide();
  const top = g.verses.filter((v) => v.mustKnow).sort((a, b) => a.mustKnow! - b.mustKnow!);
  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE_FULL_NAME,
            url: SITE_URL + "/",
            inLanguage: "ko",
            description: SITE_DESCRIPTION,
            potentialAction: {
              "@type": "SearchAction",
              target: `${SITE_URL}/search?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          },
          {
            "@context": "https://schema.org",
            ...SERIES_LD,
            numberOfSeasons: g.seasons.length,
            numberOfEpisodes: g.episodes.length,
            containsSeason: g.seasons.map((s) => ({
              "@type": "TVSeason",
              seasonNumber: s.season,
              numberOfEpisodes: s.episodes.length,
              url: absoluteUrl(s.path),
            })),
          },
        ]}
      />
      <section className="hero">
        <p className="eyebrow">성경을 몰라도 따라가는</p>
        <h1>
          더 초즌(The Chosen)
          <br />
          한국어 가이드
        </h1>
        <p className="lead">시즌 1~5 · 전 {g.episodes.length}화 줄거리, 화별 등장인물, 성경 구절(영어 KJV + 한글)</p>
        <ul className="intro-list">
          {g.intro.map((l, i) => (
            <Md key={i} as="li" text={l} />
          ))}
        </ul>
        <div className="legend">
          <span className="tag tag-bible">📖 성경에 있는 이야기</span>
          <span className="tag tag-drama">🎬 드라마 창작</span>
          <span className="muted">모든 화에서 이 두 가지를 색으로 구분합니다.</span>
        </div>
        <div className="cta-row">
          <Link href="/intro" className="btn btn-primary">
            처음이라면: 입문 가이드 →
          </Link>
          <Link href="/s1/e1" className="btn">
            시즌 1 1화부터 보기
          </Link>
        </div>
        <p className="watch-note">📺 {WATCH_NOTE}</p>
      </section>

      <section>
        <h2>줄거리를 3줄로 요약하면</h2>
        <ol className="three-line">
          {g.threeLine.map((l, i) => (
            <Md key={i} as="li" text={l} />
          ))}
        </ol>
      </section>

      <section>
        <h2>시즌별 가이드</h2>
        <div className="grid cards">
          {g.seasons.map((s) => (
            <Link key={s.season} href={s.path} className="card season-card">
              <span className="card-kicker">SEASON {s.season}</span>
              <strong className="card-title">시즌 {s.season} · 전 {s.episodes.length}화</strong>
              <Md as="p" text={s.summary} className="card-text" />
              <span className="card-more">에피소드 보기 →</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="section-head">
          <h2>⭐ 꼭 기억할 10구절</h2>
          <Link href="/verses">전체 구절 보기 →</Link>
        </div>
        <ol className="top-verses">
          {top.map((v) => (
            <li key={v.id}>
              <Link href={`/verses#${v.id}`}>
                <span className="tv-ref">📖 {v.ref}</span>
                <span className="tv-ko">{v.ko}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid two">
        <Link href="/characters" className="card">
          <strong className="card-title">👥 인물 사전</strong>
          <p className="card-text">열두 제자, 예수 주변 사람들, 반대 세력. 인물마다 등장한 화를 모았습니다.</p>
        </Link>
        <Link href="/search" className="card">
          <strong className="card-title">🔎 검색</strong>
          <p className="card-text">에피소드·인물·성경 구절을 한 번에 찾아보세요.</p>
        </Link>
        <Link href="/daily" className="card">
          <strong className="card-title">🕊️ 오늘의 말씀</strong>
          <p className="card-text">아침·저녁에 읽기 좋은 성경 구절을 한곳에 모았습니다.</p>
        </Link>
      </section>
    </>
  );
}
