import Link from "next/link";
import { getGuide } from "@/lib/guide";
import { Md } from "@/components/Md";
import { JsonLd } from "@/components/JsonLd";
import { pageMeta, absoluteUrl, SERIES_LD } from "@/lib/seo";
import { SITE_DESCRIPTION, SITE_FULL_NAME, SITE_URL, WATCH_NOTE } from "@/lib/site";
import { AvoirAd } from "@/components/AvoirAd";
import { getWorks, TOGETHER_PATH } from "@/lib/together";
import { getHymns, HYMNS_PATH, HYMNS_TITLE } from "@/lib/hymns";
import { BIBLE_BOOKS_PATH, BIBLE_BOOKS_TITLE } from "@/lib/bibleBooks";
import { FAMILY_TREE_PATH } from "@/lib/familyTree";

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
        <Link href="/scenes" className="card">
          <strong className="card-title">✨ 명장면·명대사</strong>
          <p className="card-text">시즌 1~5에서 꼭 봐야 할 장면과 기억에 남는 대사.</p>
        </Link>
      </section>

      <AvoirAd place="home" />

      <section className="grid two">
        <Link href="/creators" className="card">
          <strong className="card-title">🎬 제작진</strong>
          <p className="card-text">감독 댈러스 젠킨스와 더 초즌을 만든 사람들.</p>
        </Link>
        <Link href="/making" className="card">
          <strong className="card-title">📜 제작 이야기와 기록</strong>
          <p className="card-text">단편 하나에서 역대 1위 크라우드펀딩, 7시즌 완결까지.</p>
        </Link>
        <Link href="/map" className="card">
          <strong className="card-title">🗺️ 촬영지 지도</strong>
          <p className="card-text">텍사스·유타 촬영지와 드라마 속 성경 장소.</p>
        </Link>
        <Link href={TOGETHER_PATH} className="card">
          <strong className="card-title">🎞️ 같이 보면 좋은 콘텐츠</strong>
          <p className="card-text">
            {getWorks()
              .map((w) => `「${w.titleKo}」`)
              .join(", ")}{" "}
            등 더 초즌과 함께 볼 작품. 실화와 각색, 영화에 나온 역사적 사실까지.
          </p>
        </Link>
        <Link href={BIBLE_BOOKS_PATH} className="card">
          <strong className="card-title">📚 {BIBLE_BOOKS_TITLE}</strong>
          <p className="card-text">
            창세기부터 요한계시록까지. 누가 썼다고 전해지는지, 학자들은 어떻게 보는지, 언제 쓰였고 어느 시대를 다루는지, 그리고 대표 구절까지 한 권씩.
          </p>
        </Link>
        <Link href={FAMILY_TREE_PATH} className="card">
          <strong className="card-title">🌳 가족관계도</strong>
          <p className="card-text">아담과 노아, 아브라함과 열두 아들, 모세, 다윗, 예수와 제자 형제까지. 핵심 인물만 이은 가계도입니다.</p>
        </Link>
        <Link href={HYMNS_PATH} className="card">
          <strong className="card-title">🎵 {HYMNS_TITLE}</strong>
          <p className="card-text">
            한국 교회가 사랑하는 찬송 {getHymns().length}곡의 새찬송가 장 번호, 원제, 작사·작곡자, 만들어진 이야기와 성경 구절. 주제별로 찾아보세요.
          </p>
        </Link>
      </section>
    </>
  );
}
