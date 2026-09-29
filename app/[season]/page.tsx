import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuide, stripMd } from "@/lib/guide";
import { splitNames } from "@/lib/characters";
import { Md, MdTable } from "@/components/Md";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CharacterNames } from "@/components/CharacterNames";
import { KindBadge } from "@/components/SourceBox";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl, clip, pageMeta, SERIES_LD } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getGuide().seasons.map((s) => ({ season: `s${s.season}` }));
}

function findSeason(param: string) {
  const m = /^s(\d+)$/.exec(param);
  return m ? getGuide().seasons.find((s) => s.season === Number(m[1])) : undefined;
}

export async function generateMetadata({ params }: { params: Promise<{ season: string }> }) {
  const s = findSeason((await params).season);
  if (!s) return {};
  return pageMeta({
    title: `더 초즌 시즌${s.season} 줄거리·등장인물 총정리 (전 ${s.episodes.length}화)`,
    description: `더 초즌(The Chosen) 시즌 ${s.season} 한눈에 보기. ${stripMd(s.summary)}`,
    path: s.path,
  });
}

export default async function SeasonPage({ params }: { params: Promise<{ season: string }> }) {
  const s = findSeason((await params).season);
  if (!s) notFound();
  const g = getGuide();
  return (
    <article>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TVSeason",
          name: `The Chosen 시즌 ${s.season}`,
          seasonNumber: s.season,
          numberOfEpisodes: s.episodes.length,
          url: absoluteUrl(s.path),
          inLanguage: "ko",
          partOfSeries: SERIES_LD,
          episode: s.episodes.map((e) => ({
            "@type": "TVEpisode",
            episodeNumber: e.ep,
            name: e.titleEn,
            alternateName: e.titleKo,
            url: absoluteUrl(e.path),
          })),
        }}
      />
      <Breadcrumbs items={[{ name: `시즌 ${s.season}`, path: s.path }]} />
      <nav className="season-tabs" aria-label="시즌 선택">
        {g.seasons.map((x) => (
          <Link key={x.season} href={x.path} className={"chip" + (x.season === s.season ? " chip-on" : "")}>
            시즌 {x.season}
          </Link>
        ))}
      </nav>
      <h1>더 초즌 시즌 {s.season}</h1>
      <div className="summary-box">
        <div className="summary-label">시즌 한 줄 요약</div>
        <Md as="p" text={s.summary} />
        {s.notes.map((n, i) => (
          <Md key={i} as="p" className="note" text={n} />
        ))}
      </div>

      {s.easyGuide ? (
        <>
          <h2>이 시즌을 쉽게 보는 법</h2>
          <MdTable header={s.easyGuide.header} rows={s.easyGuide.rows} className="kv" />
        </>
      ) : null}

      {s.cast ? (
        <>
          <h2>시즌 {s.season} 등장인물 요약</h2>
          <MdTable
            header={s.cast.header}
            rows={s.cast.rows}
            renderCell={(c, col) => (col === 0 ? <CharacterNames raw={c} names={splitNames(c)} /> : <Md text={c} />)}
          />
        </>
      ) : null}

      <h2>에피소드 ({s.episodes.length}화)</h2>
      <ol className="ep-list">
        {s.episodes.map((e) => (
          <li key={e.code}>
            <Link href={e.path} className="ep-item">
              <span className="ep-num">{e.ep}화</span>
              <span className="ep-body">
                <strong className="ep-title">
                  {e.titleKo}
                  {e.suffix ? <span className="suffix"> · {e.suffix}</span> : null}
                </strong>
                <span className="ep-en" lang="en">
                  {e.titleEn}
                </span>
                <span className="ep-plot">{clip(stripMd(e.plot), 90)}</span>
                <KindBadge kind={e.sourceKind} />
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </article>
  );
}
