import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { AvoirAd } from "@/components/AvoirAd";
import { HymnExplorer, type HymnCard } from "@/components/HymnExplorer";
import { absoluteUrl, pageMeta } from "@/lib/seo";
import {
  enTitle,
  getHymns,
  hymnPath,
  hymnTags,
  shortName,
  HYMNS_CHECKED,
  HYMNS_COPYRIGHT,
  HYMNS_INTRO,
  HYMNS_METHOD,
  HYMNS_PATH,
  HYMNS_SOURCES,
  HYMNS_TITLE,
  type Hymn,
} from "@/lib/hymns";

export const metadata = pageMeta({
  title: `${HYMNS_TITLE} — 새찬송가 장 번호·원제·작사작곡·유래·성경 구절`,
  description:
    "한국 교회에서 사랑받는 찬송가 100곡. 새찬송가 장 번호, 영어 원제, 작사·작곡자와 연도, 찬송이 만들어진 이야기, 관련 성경 구절, 주제별 찾기. 「나 같은 죄인 살리신」(305장), 「내 평생에 가는 길」(413장), 「부름받아 나선 이 몸」(323장) 등.",
  path: HYMNS_PATH,
});

function toCard(h: Hymn): HymnCard {
  return {
    n: h.n,
    title: h.title,
    en: h.en ? enTitle(h) : null,
    origin: h.origin,
    by: `작사 ${shortName(h.text)} · 작곡 ${shortName(h.music)}`,
    tags: h.tags,
    pd: !!h.lyricsEn?.length,
    search: [h.n, h.tong ? `통일${h.tong}` : "", h.title, h.title.replace(/\s+/g, ""), h.en || "", h.origin, h.text, h.music, h.tune || "", ...h.tags, ...h.refs]
      .join(" ")
      .toLowerCase(),
  };
}

export default function HymnsPage() {
  const hymns = getHymns();
  return (
    <article>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: HYMNS_TITLE,
          url: absoluteUrl(HYMNS_PATH),
          numberOfItems: hymns.length,
          itemListElement: hymns.map((h, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: `새찬송가 ${h.n}장 ${h.title}`,
            url: absoluteUrl(hymnPath(h)),
          })),
        }}
      />
      <Breadcrumbs items={[{ name: HYMNS_TITLE, path: HYMNS_PATH }]} />
      <h1>🎵 {HYMNS_TITLE}</h1>
      <p className="lead">{HYMNS_INTRO}</p>
      <section className="note-box" aria-labelledby="method-h">
        <strong id="method-h">이 100곡은 어떻게 골랐나요?</strong>
        <ul>
          {HYMNS_METHOD.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>주제별로 찾기</h2>
        <HymnExplorer hymns={hymns.map(toCard)} tags={hymnTags()} />
      </section>

      <AvoirAd place="hymns" />

      <section className="note-box" aria-labelledby="copy-h">
        <strong id="copy-h">저작권 안내</strong>
        <ul>
          {HYMNS_COPYRIGHT.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </section>

      <section id="sources">
        <h2>참고 자료</h2>
        <ul className="plain-list">
          {HYMNS_SOURCES.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener noreferrer">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="muted small">
          {HYMNS_CHECKED} 확인. 장 번호는 『새찬송가』(2006)와 『통일찬송가』(1983) 목록을 두 곳 이상에서 대조했습니다. 잘못된 내용이 있으면 곡 페이지의
          출처를 함께 확인해 주세요.
        </p>
      </section>
    </article>
  );
}
