import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl, clip, pageMeta } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";
import {
  enTitle,
  getHymn,
  getHymns,
  hymnarySearchUrl,
  hymnPath,
  HYMNS_CHECKED,
  HYMNS_PATH,
  HYMNS_TITLE,
  shortName,
  youtubeUrl,
} from "@/lib/hymns";

export const dynamicParams = false;

export function generateStaticParams() {
  return getHymns().map((h) => ({ n: String(h.n) }));
}

export async function generateMetadata({ params }: { params: Promise<{ n: string }> }) {
  const h = getHymn((await params).n);
  if (!h) return {};
  const en = h.en ? `(${enTitle(h)})` : "";
  return pageMeta({
    title: `새찬송가 ${h.n}장 「${h.title}」${en} 유래·작사·작곡·성경 구절`,
    description: `새찬송가 ${h.n}장${h.tong ? `(통일 ${h.tong}장)` : ""} 「${h.title}」${en ? ` ${en}` : ""}. 작사 ${shortName(h.text)}, 작곡 ${shortName(h.music)}. ${h.story}`,
    path: hymnPath(h),
    type: "article",
  });
}

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default async function HymnPage({ params }: { params: Promise<{ n: string }> }) {
  const h = getHymn((await params).n);
  if (!h) notFound();
  const all = getHymns();
  const i = all.findIndex((x) => x.n === h.n);
  const prev = all[i - 1];
  const next = all[i + 1];
  const related = all.filter((x) => x.n !== h.n && x.tags.some((t) => h.tags.includes(t))).slice(0, 6);
  const path = hymnPath(h);
  const url = absoluteUrl(path);
  const isKoreanOriginal = !h.en;
  return (
    <article className="hymn">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "MusicComposition",
            name: h.title,
            ...(h.en ? { alternateName: enTitle(h) } : {}),
            url,
            description: clip(h.story, 200),
            lyricist: { "@type": "Person", name: shortName(h.text) },
            composer: { "@type": "Person", name: shortName(h.music) },
            genre: "Hymn",
            keywords: h.tags.join(", "),
          },
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: `새찬송가 ${h.n}장 「${h.title}」 유래·작사·작곡`,
            inLanguage: "ko",
            mainEntityOfPage: url,
            about: { "@type": "MusicComposition", name: h.title },
            publisher: { "@type": "Organization", name: SITE_NAME },
            image: absoluteUrl("/og.png"),
          },
        ]}
      />
      <Breadcrumbs
        items={[
          { name: HYMNS_TITLE, path: HYMNS_PATH },
          { name: `${h.n}장 ${h.title}`, path },
        ]}
      />
      <header className="ep-head">
        <p className="eyebrow">
          새찬송가 {h.n}장{h.tong ? ` · 통일찬송가 ${h.tong}장` : ""} · {h.origin}
        </p>
        <h1>「{h.title}」</h1>
        {h.en ? (
          <p className="ep-en-big" lang="en">
            {h.en}
          </p>
        ) : null}
        <p className="hymn-tags">
          {h.tags.map((t) => (
            <span key={t} className="tag tag-hymn">
              {t}
            </span>
          ))}
        </p>
      </header>

      <nav className="toc" aria-label="이 페이지 목차">
        <a href="#info">곡 정보</a>
        <a href="#story">이야기</a>
        <a href="#verses">성경 구절</a>
        {h.lyricsEn?.length ? <a href="#lyrics">영어 원문</a> : null}
        <a href="#listen">듣기</a>
        <a href="#sources">출처</a>
      </nav>

      <section id="info">
        <h2>곡 정보</h2>
        <div className="table-wrap">
          <table className="kv">
            <tbody>
              <tr>
                <th>새찬송가</th>
                <td>{h.n}장</td>
              </tr>
              {h.tong ? (
                <tr>
                  <th>통일찬송가</th>
                  <td>{h.tong}장</td>
                </tr>
              ) : null}
              <tr>
                <th>제목(첫 줄)</th>
                <td>{h.title}</td>
              </tr>
              {h.en ? (
                <tr>
                  <th>원제</th>
                  <td lang="en">{h.en}</td>
                </tr>
              ) : null}
              <tr>
                <th>작사</th>
                <td>{h.text}</td>
              </tr>
              <tr>
                <th>작곡</th>
                <td>{h.music}</td>
              </tr>
              {h.tune ? (
                <tr>
                  <th>곡조명</th>
                  <td lang="en">{h.tune}</td>
                </tr>
              ) : null}
              <tr>
                <th>주제</th>
                <td>{h.tags.join(" · ")}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="story" className="point">
        <h2>📜 이 찬송이 만들어진 이야기</h2>
        <p>{h.story}</p>
        {h.note ? <p className="muted small">⚠️ 확인 메모: {h.note}</p> : null}
      </section>

      <section id="verses">
        <h2>📖 함께 읽을 성경 구절</h2>
        <ul className="plain-list">
          {h.refs.map((r) => (
            <li key={r}>📖 {r}</li>
          ))}
        </ul>
        <p className="muted small">성경에서 위 장·절을 찾아 찬송 가사와 함께 읽어 보세요.</p>
      </section>

      {h.lyricsEn?.length ? (
        <section id="lyrics">
          <h2>🇬🇧 영어 원문 가사 (공개 영역)</h2>
          <p className="muted small">
            원작자가 세상을 떠난 지 70년이 넘은, 공개 영역(Public Domain) 영어 원문입니다. 아래 출처의 본문을 그대로 옮겼고(음악상 되풀이하는 구절과
            &lsquo;Amen&rsquo;은 생략), 찬송가마다 절 구성과 표현이 조금씩 다를 수 있습니다. 한국어 가사는 저작권 때문에 싣지 않습니다.
          </p>
          <div className="lyrics-en" lang="en">
            {h.lyricsEn.map((s, k) => (
              <p key={k} className={s.startsWith("(Refrain)") ? "refrain" : undefined}>
                {s.split("\n").map((line, j) => (
                  <span key={j}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
            ))}
          </div>
          {h.lyricsSource ? (
            <p className="muted small">
              영어 원문 출처: <Ext href={h.lyricsSource.url}>{h.lyricsSource.label}</Ext>
            </p>
          ) : null}
        </section>
      ) : (
        <p className="note-box">
          {isKoreanOriginal
            ? "한국어(또는 일본어) 원작 찬송이라 가사는 저작권 보호를 위해 싣지 않았습니다. 찬송가책이나 교회 자료에서 확인해 주세요."
            : "영어 원문이 아직 저작권 보호 기간 안에 있거나 확인이 어려워 가사를 싣지 않았습니다. 한국어 가사도 저작권 때문에 싣지 않습니다."}
        </p>
      )}

      <section id="listen">
        <h2>🎧 듣기</h2>
        <p>
          <Ext href={youtubeUrl(h)}>▶ 유튜브에서 「새찬송가 {h.n}장 {h.title}」 검색하기 →</Ext>
        </p>
        <p className="muted small">특정 영상을 붙이지 않고 검색 결과로 연결합니다. 교회·찬양팀의 공식 채널 영상을 골라 들어 주세요.</p>
      </section>

      <section id="sources">
        <h2>출처</h2>
        <ul className="plain-list">
          {h.en ? (
            <li>
              <Ext href={hymnarySearchUrl(h)}>
                Hymnary.org – “{enTitle(h)}” {h.hymnary ? "곡 정보(작사·작곡·곡조)" : "검색 결과(작사·작곡·곡조 정보)"}
              </Ext>
            </li>
          ) : null}
          {h.lyricsSource ? (
            <li>
              <Ext href={h.lyricsSource.url}>{h.lyricsSource.label} – 영어 원문</Ext>
            </li>
          ) : null}
          <li>
            <Link href={`${HYMNS_PATH}#sources`}>{HYMNS_TITLE} – 공통 참고 자료(장 번호 대조, 선정 자료)</Link>
          </li>
        </ul>
        <p className="muted small">{HYMNS_CHECKED} 확인. 이야기는 여러 자료를 바탕으로 직접 요약했고, 확인이 어려운 일화는 &lsquo;전해집니다&rsquo;로 표시했습니다.</p>
      </section>

      {related.length ? (
        <section>
          <h2>같은 주제의 찬송</h2>
          <nav className="ep-chips" aria-label="같은 주제의 찬송">
            {related.map((r) => (
              <Link key={r.n} href={hymnPath(r)} className="chip">
                {r.n}장 {r.title}
              </Link>
            ))}
          </nav>
        </section>
      ) : null}

      <nav className="ep-chips" aria-label="찬송가 이동">
        {prev ? (
          <Link href={hymnPath(prev)} className="chip">
            ← {prev.n}장 {prev.title}
          </Link>
        ) : null}
        <Link href={HYMNS_PATH} className="chip">
          {HYMNS_TITLE} 목록
        </Link>
        {next ? (
          <Link href={hymnPath(next)} className="chip">
            {next.n}장 {next.title} →
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
