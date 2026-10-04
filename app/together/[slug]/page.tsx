import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { TMd } from "@/components/TogetherMd";
import { VerseCard } from "@/components/VerseCard";
import { AvoirAd } from "@/components/AvoirAd";
import { stripMd, type Verse } from "@/lib/guide";
import { absoluteUrl, clip, pageMeta } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";
import { getWork, getWorks, STATUS_LABEL, TOGETHER_PATH, mediumOf, workPath, type Work } from "@/lib/together";

export const dynamicParams = false;

export function generateStaticParams() {
  return getWorks().map((w) => ({ slug: w.slug }));
}

function infoValue(w: Work, label: string) {
  return w.info.find((i) => i.label === label)?.value;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const w = getWork((await params).slug);
  if (!w) return {};
  return pageMeta({
    title: `「${w.titleKo}」(${w.titleEn}, ${w.year}) 줄거리·실화·역사적 사실 정리`,
    description: `${w.kind} 「${w.titleKo}」(${w.titleEn}) 줄거리, 실화와 ${mediumOf(w)} 각색 구분, 주요 인물, ${mediumOf(w)}에 나온 역사·학술 근거, 더 초즌과의 연결점. ${stripMd(w.tagline)}`,
    path: workPath(w),
    type: "article",
  });
}

function toVerse(v: NonNullable<Work["verses"]>[number]): Verse {
  return {
    id: v.refEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    ref: v.ref,
    refEn: v.refEn,
    book: v.ref.replace(/\s*[\d:,\-–\s]+$/, ""),
    en: v.en,
    ko: v.ko,
    episodes: [],
  };
}

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const w = getWork((await params).slug);
  if (!w) notFound();
  const m = mediumOf(w);
  const path = workPath(w);
  const url = absoluteUrl(path);
  const others = getWorks().filter((x) => x.slug !== w.slug);
  const director = infoValue(w, "감독");
  return (
    <article className="work">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": w.kind === "영화" ? "Movie" : w.kind.includes("시리즈") ? "TVSeries" : "CreativeWork",
            name: w.titleEn,
            alternateName: w.titleKo,
            dateCreated: String(w.year),
            url,
            description: clip(stripMd(w.tagline), 200),
            ...(director ? { director: { "@type": "Person", name: director.replace(/\s*\(.*\)$/, "") } } : {}),
            sameAs: w.sources.filter((s) => s.url.includes("wikipedia.org")).slice(0, 1).map((s) => s.url),
          },
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: `「${w.titleKo}」(${w.titleEn}) 줄거리·실화·역사적 사실 정리`,
            inLanguage: "ko",
            mainEntityOfPage: url,
            about: { "@type": "Movie", name: w.titleEn },
            publisher: { "@type": "Organization", name: SITE_NAME },
            image: absoluteUrl("/og.png"),
          },
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "같이 보면 좋은 콘텐츠", path: TOGETHER_PATH },
          { name: w.titleKo, path },
        ]}
      />
      <header className="ep-head">
        <p className="eyebrow">
          같이 보면 좋은 {w.kind} · {w.year}
          {w.runtime ? ` · ${w.runtime}` : ""}
          {w.rating ? ` · ${w.rating}` : ""}
        </p>
        <h1>「{w.titleKo}」</h1>
        <p className="ep-en-big" lang="en">
          {w.titleEn}
        </p>
        <TMd as="p" className="lead" text={w.tagline} />
        {w.facts?.length ? (
          <p>
            <a href="#facts" className="btn btn-primary">
              📚 {m}에 나온 사실 자세히 보기 ↓
            </a>
          </p>
        ) : null}
      </header>

      <nav className="toc" aria-label="이 페이지 목차">
        <a href="#info">작품 정보</a>
        <a href="#plot">줄거리</a>
        <a href="#src-h">{w.source.middle?.length ? "성경·외경·창작" : "실화·각색"}</a>
        <a href="#people">주요 인물</a>
        <a href="#points">이해 포인트</a>
        {w.facts?.length ? <a href="#facts">사실 자세히 보기</a> : null}
        <a href="#chosen">더 초즌과 연결</a>
        {w.verses?.length ? <a href="#verses">성경 구절</a> : null}
        <a href="#sources">출처</a>
      </nav>

      <section id="info">
        <h2>작품 정보</h2>
        <div className="table-wrap">
          <table className="kv">
            <tbody>
              {w.info.map((i) => (
                <tr key={i.label}>
                  <th>{i.label}</th>
                  <td>
                    <TMd text={i.value} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {w.watch ? (
          <p>
            <Ext href={w.watch.url}>📺 {w.watch.label} →</Ext>
          </p>
        ) : null}
      </section>

      <section id="plot">
        <h2>줄거리</h2>
        {w.plot.map((p, i) => (
          <TMd key={i} as="p" className="plot" text={p} />
        ))}
        <p className="muted small">스포일러가 포함돼 있습니다. {m} 대사는 옮기지 않고 내용을 요약했습니다.</p>
      </section>

      <section className="source-box" aria-labelledby="src-h">
        <h2 id="src-h">{w.sourceHeading || (w.source.middle?.length ? `성경일까, 외경일까, ${m} 창작일까?` : `실화일까, ${m} 각색일까?`)}</h2>
        <div className="src-grid">
          <div className="src src-bible">
            <div className="src-label">{w.sourceLabels?.real || "📖 실화·기록에 있는 부분"}</div>
            <ul>
              {w.source.real.map((t, i) => (
                <TMd key={i} as="li" text={t} />
              ))}
            </ul>
          </div>
          {w.source.middle?.length ? (
            <div className="src src-middle">
              <div className="src-label">{w.sourceLabels?.middle || "📜 전승"}</div>
              <ul>
                {w.source.middle.map((t, i) => (
                  <TMd key={i} as="li" text={t} />
                ))}
              </ul>
            </div>
          ) : null}
          <div className="src src-drama">
            <div className="src-label">{w.sourceLabels?.adapted || `🎬 ${m}가 바꾸거나 덧붙인 부분`}</div>
            <ul>
              {w.source.adapted.map((t, i) => (
                <TMd key={i} as="li" text={t} />
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="people">
        <h2>주요 인물</h2>
        <div className="table-wrap">
          <table className="cast">
            <thead>
              <tr>
                <th>인물</th>
                <th>배우</th>
                <th>실제 인물인가</th>
                <th>{m}에서</th>
              </tr>
            </thead>
            <tbody>
              {w.people.map((p) => (
                <tr key={p.name}>
                  <td>
                    <strong>{p.name}</strong>
                  </td>
                  <td>{p.actor || "—"}</td>
                  <td>
                    <TMd text={p.real || "—"} />
                  </td>
                  <td>
                    <TMd text={p.role} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="point" id="points">
        <h2>💡 이해 포인트</h2>
        <ul>
          {w.points.map((p, i) => (
            <TMd key={i} as="li" text={p} />
          ))}
        </ul>
      </section>

      {w.facts?.length ? (
        <section id="facts" className="facts">
          <h2>📚 {m}에 나온 사실(팩트) 자세히 보기</h2>
          {w.factsIntro ? <TMd as="p" className="facts-intro" text={w.factsIntro} /> : null}
          <ol className="facts-toc">
            {w.facts.map((f) => (
              <li key={f.id}>
                <a href={`#fact-${f.id}`}>{f.title}</a>
              </li>
            ))}
          </ol>
          {w.facts.map((f, n) => (
            <article key={f.id} id={`fact-${f.id}`} className="fact">
              <header className="fact-head">
                <span className="fact-num">{n + 1}</span>
                <h3>{f.title}</h3>
                <span className={`fact-status ${STATUS_LABEL[f.status].cls}`}>{STATUS_LABEL[f.status].text}</span>
              </header>
              {f.table ? (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        {f.table.header.map((h) => (
                          <th key={h}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {f.table.rows.map((r, i) => (
                        <tr key={i}>
                          {r.map((c, j) => (
                            <td key={j}>
                              <TMd text={c} />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
              <div className="fact-block fb-film">
                <h4>🎬 {m}에서는 어떻게 나오나</h4>
                <TMd as="p" text={f.film} />
              </div>
              <div className="fact-block fb-evidence">
                <h4>🔎 실제 사실과 근거</h4>
                <ul>
                  {f.evidence.map((t, i) => (
                    <TMd key={i} as="li" text={t} />
                  ))}
                </ul>
              </div>
              <div className="fact-block fb-debate">
                <h4>⚖️ 학계에서 의견이 갈리는 부분</h4>
                <ul>
                  {f.debate.map((t, i) => (
                    <TMd key={i} as="li" text={t} />
                  ))}
                </ul>
              </div>
              <div className="fact-block fb-study">
                <h4>📖 더 공부할 자료</h4>
                <ul>
                  {f.study.map((s, i) => (
                    <li key={i}>{s.url ? <Ext href={s.url}>{s.label}</Ext> : s.label}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </section>
      ) : null}

      <AvoirAd place="together" />

      <section id="chosen">
        <h2>✦ 더 초즌과의 연결점</h2>
        <ul className="chosen-links">
          {w.chosen.map((c, i) => (
            <li key={i}>
              <TMd text={c.text} />
              {c.href ? (
                <>
                  {" "}
                  <Link href={c.href} className="chip">
                    {c.label || "보러 가기"} →
                  </Link>
                </>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      {w.verses?.length ? (
        <section id="verses">
          <h2>📖 함께 읽으면 좋은 성경 구절</h2>
          {w.verseNote ? <p className="muted">{w.verseNote}</p> : null}
          <div className="verses">
            {w.verses.map((v) => (
              <div key={v.refEn}>
                <VerseCard v={toVerse(v)} showEpisodes={false} />
                {v.note ? <p className="muted small verse-note">↳ {v.note}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section id="sources">
        <h2>출처</h2>
        <ul className="plain-list">
          {w.sources.map((s) => (
            <li key={s.url}>
              <Ext href={s.url}>{s.label}</Ext>
            </li>
          ))}
        </ul>
        <p className="muted small">
          {w.checked} 확인. &lsquo;{m}에 나온 사실 자세히 보기&rsquo;의 항목별 출처는 각 항목의 &lsquo;더 공부할 자료&rsquo;에 있습니다. 포스터·스틸 이미지는 저작권 때문에 싣지 않습니다.
        </p>
      </section>

      <nav className="ep-chips" aria-label="같이 보면 좋은 콘텐츠">
        <Link href={TOGETHER_PATH} className="chip">
          같이 보면 좋은 콘텐츠 목록
        </Link>
        {others.map((o) => (
          <Link key={o.slug} href={workPath(o)} className="chip">
            「{o.titleKo}」
          </Link>
        ))}
      </nav>
    </article>
  );
}
