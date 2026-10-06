import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { TMd } from "@/components/TogetherMd";
import { CopyButton } from "@/components/CopyButton";
import { absoluteUrl, clip, pageMeta } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";
import { stripMd } from "@/lib/guide";
import {
  autoLinks,
  bookPath,
  getBook,
  getBooks,
  BIBLE_BOOKS_CHECKED,
  BIBLE_BOOKS_PATH,
  BIBLE_BOOKS_TITLE,
  type Related,
} from "@/lib/bibleBooks";

export const dynamicParams = false;

export function generateStaticParams() {
  return getBooks().map((b) => ({ slug: b.slug }));
}

const plain = (s: string) => stripMd(s).replace(/\[(합의|논쟁|믿음)\]\s*/g, "");

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const b = getBook((await params).slug);
  if (!b) return {};
  return pageMeta({
    title: `${b.ko}(${b.en}) — 저자·기록 연대·다루는 시대·특징·대표 구절 | 성경 66권`,
    description: clip(
      `${b.testament} ${b.group} ${b.ko}(${b.en}, ${b.chapters}장). 전통적 저자: ${plain(b.author)} 학계: ${b.dateSch}. 다루는 시대: ${b.period}. 대표 구절 ${b.keyVerse.ref}.`,
      300,
    ),
    path: bookPath(b),
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

type Item = { href: string; label: string; text?: string };

function merge(manual: Related[], auto: Item[]): Item[] {
  const out: Item[] = manual.map((r) => ({ href: r.href, label: r.label, text: r.text }));
  for (const a of auto) {
    const m = out.find((o) => o.href === a.href);
    if (m) {
      if (a.text && !(m.text || "").includes(a.text)) m.text = m.text ? `${m.text} · ${a.text}` : a.text;
    } else out.push(a);
  }
  return out;
}

function LinkList({ items }: { items: Item[] }) {
  return (
    <ul className="bb-links">
      {items.map((it) => (
        <li key={it.href}>
          <Link href={it.href}>{it.label}</Link>
          {it.text ? <span className="muted small"> — {it.text}</span> : null}
        </li>
      ))}
    </ul>
  );
}

export default async function BibleBookPage({ params }: { params: Promise<{ slug: string }> }) {
  const b = getBook((await params).slug);
  if (!b) notFound();
  const all = getBooks();
  const prev = all[b.order - 2];
  const next = all[b.order];
  const sameGroup = all.filter((x) => x.testament === b.testament && x.group === b.group && x.slug !== b.slug);
  const path = bookPath(b);
  const url = absoluteUrl(path);
  const auto = autoLinks(b);
  const is = (p: string) => (r: Related) => r.href.startsWith(p);
  const episodes = merge(
    b.related.filter(is("/s")),
    auto.episodes.map((e) => ({ href: e.path, label: e.label, text: e.refs ? `성경 근거: ${e.refs}` : "" })),
  ).sort((x, y) => x.href.localeCompare(y.href, "en", { numeric: true }));
  const characters = b.related.filter(is("/characters"));
  const works = merge(
    b.related.filter(is("/together")),
    auto.works.map((w) => ({ href: w.href, label: w.label, text: `페이지에서 다루는 구절: ${w.refs}` })),
  );
  const books = b.related.filter(is("/bible-books"));
  const hymnsPage = b.related.filter(is("/hymns"));
  const HYMN_MAX = 6;
  const hymns = auto.hymns.slice(0, HYMN_MAX);
  const testKey = b.testament === "구약" ? "ot" : "nt";
  const kv = b.keyVerse;
  return (
    <article className="bb-book">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Book",
            name: b.ko,
            alternateName: b.en,
            url,
            inLanguage: b.testament === "구약" ? "he" : "grc",
            isPartOf: { "@type": "Book", name: b.testament === "구약" ? "구약성경 (Old Testament)" : "신약성경 (New Testament)" },
            genre: b.group,
            description: clip(plain(b.notes[0]), 200),
          },
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: `${b.ko}(${b.en}) 한눈에 — 저자·연대·특징`,
            inLanguage: "ko",
            mainEntityOfPage: url,
            about: { "@type": "Book", name: b.en },
            publisher: { "@type": "Organization", name: SITE_NAME },
            image: absoluteUrl("/og.png"),
          },
        ]}
      />
      <Breadcrumbs
        items={[
          { name: BIBLE_BOOKS_TITLE, path: BIBLE_BOOKS_PATH },
          { name: b.ko, path },
        ]}
      />
      <header className="ep-head">
        <p className="eyebrow">
          {b.testament} · {b.group} · 성경의 {b.order}번째 책 · {b.chapters}장
        </p>
        <h1>{b.ko}</h1>
        <p className="ep-en-big" lang="en">
          {b.en}
        </p>
      </header>

      <nav className="toc" aria-label="이 페이지 목차">
        <a href="#info">기본 정보</a>
        <a href="#view">학계의 견해</a>
        <a href="#notes">특이사항</a>
        <a href="#verse">대표 구절</a>
        <a href="#links">함께 보기</a>
        <a href="#sources">출처</a>
      </nav>

      <section id="info">
        <h2>기본 정보</h2>
        <div className="table-wrap">
          <table className="kv">
            <tbody>
              <tr>
                <th>책 이름</th>
                <td>
                  {b.ko} <span lang="en">({b.en})</span>
                </td>
              </tr>
              <tr>
                <th>분류</th>
                <td>
                  {b.testament} · {b.group} · {b.chapters}장
                </td>
              </tr>
              <tr>
                <th>전통적 저자</th>
                <td>{b.author}</td>
              </tr>
              <tr>
                <th>기록 연대</th>
                <td>
                  <span className="bb-date">
                    <span className="tag tag-faith">전통</span> {b.dateTrad}
                  </span>
                  <span className="bb-date">
                    <span className="tag tag-fact">학계</span> {b.dateSch}
                  </span>
                </td>
              </tr>
              <tr>
                <th>다루는 시대</th>
                <td>{b.period}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="muted small">연대는 모두 대략적인 추정입니다. &lsquo;학계&rsquo;는 현대 학자 다수의 견해를 뜻하며, 아래에 의견이 갈리는 부분을 함께 적었습니다.</p>
      </section>

      <section id="view">
        <h2>🏛️ 저자와 연대, 학계는 어떻게 보나</h2>
        <ul className="bb-view">
          {b.view.map((v, i) => (
            <TMd key={i} as="li" text={v} />
          ))}
        </ul>
      </section>

      <section id="notes" className="point">
        <h2>✨ 특이사항</h2>
        <ol className="bb-notes">
          {b.notes.map((n, i) => (
            <TMd key={i} as="li" text={n} />
          ))}
        </ol>
      </section>

      <section id="verse">
        <h2>📖 대표 구절</h2>
        <div className="verse">
          <h3 className="verse-ref">
            📖 {kv.ref} <span className="verse-ref-en">({kv.refEn})</span>
          </h3>
          <p className="verse-ko">{kv.ko}</p>
          <p className="verse-en" lang="en">
            {kv.en} <span className="kjv">KJV</span>
          </p>
          <div className="verse-foot">
            <span className="muted small">한글은 이 사이트가 직접 옮긴 쉬운 번역입니다.</span>
            <CopyButton text={`${kv.ko}\n— ${kv.ref}\n\n"${kv.en}"\n— ${kv.refEn} (KJV)`} />
          </div>
        </div>
      </section>

      <section id="links">
        <h2>🔗 함께 보기</h2>
        {episodes.length ? (
          <>
            <h3>📺 더 초즌 에피소드</h3>
            <LinkList items={episodes} />
          </>
        ) : null}
        {characters.length ? (
          <>
            <h3>👤 인물</h3>
            <LinkList items={characters} />
          </>
        ) : null}
        {auto.verses.length ? (
          <>
            <h3>📖 성경 구절 모음</h3>
            <ul className="bb-links">
              {auto.verses.map((v) => (
                <li key={v.id}>
                  <Link href={`/verses#${v.id}`}>{v.ref}</Link>
                  <span className="muted small"> — 더 초즌에 나오는 구절</span>
                </li>
              ))}
            </ul>
          </>
        ) : null}
        {works.length ? (
          <>
            <h3>🎞️ 같이 보면 좋은 작품</h3>
            <LinkList items={works} />
          </>
        ) : null}
        {hymns.length || hymnsPage.length ? (
          <>
            <h3>🎵 이 책의 말씀을 담은 찬송</h3>
            <ul className="bb-links">
              {hymns.map((h) => (
                <li key={h.href}>
                  <Link href={h.href}>{h.label}</Link>
                  <span className="muted small"> — {h.ref}</span>
                </li>
              ))}
            </ul>
            {auto.hymns.length > HYMN_MAX || hymnsPage.length ? (
              <p className="small">
                <Link href="/hymns">
                  사랑받는 찬송가 100 전체 보기
                  {auto.hymns.length > HYMN_MAX ? ` (이 책 관련 ${auto.hymns.length}곡)` : ""} →
                </Link>
              </p>
            ) : null}
          </>
        ) : null}
        {books.length ? (
          <>
            <h3>📚 함께 읽을 책</h3>
            <LinkList items={books} />
          </>
        ) : null}
        <h3>📚 같은 분류({b.group})의 책</h3>
        <nav className="ep-chips" aria-label={`${b.group}의 다른 책`}>
          {sameGroup.map((x) => (
            <Link key={x.slug} href={bookPath(x)} className="chip">
              {x.ko}
            </Link>
          ))}
        </nav>
      </section>

      <section id="sources">
        <h2>출처</h2>
        <ul className="plain-list">
          {b.sources.map((s) => (
            <li key={s.url}>
              <Ext href={s.url}>{s.label}</Ext>
            </li>
          ))}
          <li>
            <Link href={`${BIBLE_BOOKS_PATH}#sources`}>{BIBLE_BOOKS_TITLE} – 공통 참고 자료(탈무드 저자 목록, 성경 문헌 총론 등)</Link>
          </li>
        </ul>
        <p className="muted small">{BIBLE_BOOKS_CHECKED} 확인. 여러 자료를 대조해 직접 요약했습니다. 위키백과는 2차 자료로만 참고했습니다.</p>
      </section>

      <nav className="ep-chips" aria-label="성경 순서로 이동">
        {prev ? (
          <Link href={bookPath(prev)} className="chip">
            ← {prev.ko}
          </Link>
        ) : null}
        <Link href={`${BIBLE_BOOKS_PATH}#${testKey}`} className="chip">
          {b.testament} 목록
        </Link>
        {next ? (
          <Link href={bookPath(next)} className="chip">
            {next.ko} →
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
