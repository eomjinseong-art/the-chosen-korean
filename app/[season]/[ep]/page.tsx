import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuide, stripMd, versesForEpisode } from "@/lib/guide";
import { Md } from "@/components/Md";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CharacterNames } from "@/components/CharacterNames";
import { KindBadge, SourceBox } from "@/components/SourceBox";
import { VerseCard } from "@/components/VerseCard";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl, clip, pageMeta, SERIES_LD } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return getGuide().episodes.map((e) => ({ season: `s${e.season}`, ep: `e${e.ep}` }));
}

function find(season: string, ep: string) {
  const g = getGuide();
  const i = g.episodes.findIndex((e) => `s${e.season}` === season && `e${e.ep}` === ep);
  return i < 0 ? null : { e: g.episodes[i], prev: g.episodes[i - 1], next: g.episodes[i + 1] };
}

export async function generateMetadata({ params }: { params: Promise<{ season: string; ep: string }> }) {
  const p = await params;
  const f = find(p.season, p.ep);
  if (!f) return {};
  const { e } = f;
  return pageMeta({
    title: `더 초즌 시즌${e.season} ${e.ep}화 줄거리·등장인물 — ${e.titleKo}`,
    description: `더 초즌 시즌${e.season} ${e.ep}화 '${e.titleEn}(${e.titleKo})' 줄거리와 등장인물, 성경 이야기와 드라마 창작 구분. ${stripMd(e.plot)}`,
    path: e.path,
    type: "article",
  });
}

export default async function EpisodePage({ params }: { params: Promise<{ season: string; ep: string }> }) {
  const p = await params;
  const f = find(p.season, p.ep);
  if (!f) notFound();
  const { e, prev, next } = f;
  const g = getGuide();
  const season = g.seasons.find((s) => s.season === e.season)!;
  const verses = versesForEpisode(e.code);
  const url = absoluteUrl(e.path);
  return (
    <article className="episode">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "TVEpisode",
            name: e.titleEn,
            alternateName: e.titleKo,
            episodeNumber: e.ep,
            url,
            description: clip(stripMd(e.plot), 200),
            partOfSeason: { "@type": "TVSeason", seasonNumber: e.season, url: absoluteUrl(season.path) },
            partOfSeries: SERIES_LD,
          },
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: `더 초즌 시즌${e.season} ${e.ep}화 줄거리·등장인물 — ${e.titleKo}`,
            inLanguage: "ko",
            mainEntityOfPage: url,
            about: { "@type": "TVEpisode", name: e.titleEn, url },
            publisher: { "@type": "Organization", name: SITE_NAME },
            image: absoluteUrl("/og.png"),
          },
        ]}
      />
      <Breadcrumbs
        items={[
          { name: `시즌 ${e.season}`, path: season.path },
          { name: `${e.ep}화`, path: e.path },
        ]}
      />
      <header className="ep-head">
        <p className="eyebrow">
          시즌 {e.season} · {e.ep}화 {e.suffix ? `· ${e.suffix}` : ""}
        </p>
        <h1>{e.titleKo}</h1>
        <p className="ep-en-big" lang="en">
          {e.titleEn}
        </p>
        <KindBadge kind={e.sourceKind} />
      </header>

      <SourceBox e={e} />

      <section>
        <h2>줄거리</h2>
        <Md as="p" className="plot" text={e.plot} />
      </section>

      <section>
        <h2>이 화의 등장인물</h2>
        <div className="table-wrap">
          <table className="cast">
            <thead>
              <tr>
                <th>인물</th>
                <th>이 화에서</th>
              </tr>
            </thead>
            <tbody>
              {e.characters.map((c, i) => (
                <tr key={i}>
                  <td>
                    <CharacterNames raw={c.raw} names={c.names} />
                  </td>
                  <td>
                    <Md text={c.role} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="point">
        <h2>💡 이해 포인트</h2>
        <Md as="p" text={e.point} />
      </section>

      {verses.length > 0 ? (
        <section>
          <h2>📖 이 화와 이어지는 성경 구절</h2>
          <div className="verses">
            {verses.map((v) => (
              <VerseCard key={v.id} v={v} showEpisodes={false} />
            ))}
          </div>
        </section>
      ) : null}

      <nav className="prevnext" aria-label="이전·다음 화">
        {prev ? (
          <Link href={prev.path} className="pn prev">
            <span className="pn-dir">← 이전 화</span>
            <span className="pn-t">
              시즌{prev.season} {prev.ep}화 · {prev.titleKo}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={next.path} className="pn next">
            <span className="pn-dir">다음 화 →</span>
            <span className="pn-t">
              시즌{next.season} {next.ep}화 · {next.titleKo}
            </span>
          </Link>
        ) : (
          <span />
        )}
      </nav>
      <nav className="ep-chips" aria-label={`시즌 ${e.season} 에피소드`}>
        <Link href={season.path} className="chip">
          시즌 {e.season} 목록
        </Link>
        {season.episodes.map((x) => (
          <Link key={x.code} href={x.path} className={"chip" + (x.code === e.code ? " chip-on" : "")}>
            {x.ep}화
          </Link>
        ))}
      </nav>
    </article>
  );
}
