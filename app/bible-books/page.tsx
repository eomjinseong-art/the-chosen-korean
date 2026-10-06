import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { TMd } from "@/components/TogetherMd";
import { BibleBooksTabs, type TestamentBlock } from "@/components/BibleBooksTabs";
import { absoluteUrl, pageMeta } from "@/lib/seo";
import {
  autoLinks,
  bookPath,
  getBooks,
  getGroups,
  BIBLE_BOOKS_CHECKED,
  BIBLE_BOOKS_INTRO,
  BIBLE_BOOKS_METHOD,
  BIBLE_BOOKS_PATH,
  BIBLE_BOOKS_SOURCES,
  BIBLE_BOOKS_TAGS,
  BIBLE_BOOKS_TITLE,
  TESTAMENTS,
} from "@/lib/bibleBooks";

export const metadata = pageMeta({
  title: `${BIBLE_BOOKS_TITLE} — 구약 39권·신약 27권 저자·연대·특징·대표 구절`,
  description:
    "개신교 성경 66권을 한 권씩 정리했습니다. 전통적 저자와 학계의 견해([합의]/[논쟁]/[믿음]), 기록 연대와 다루는 시대, 특이사항, 대표 구절(KJV)과 더 초즌 에피소드 연결. 율법서·역사서·시가서·대선지서·소선지서, 복음서·바울서신·일반서신·요한계시록.",
  path: BIBLE_BOOKS_PATH,
});

export default function BibleBooksPage() {
  const books = getBooks();
  const testaments: TestamentBlock[] = TESTAMENTS.map((t) => ({
    key: t === "구약" ? "ot" : "nt",
    label: t,
    en: t === "구약" ? "Old Testament" : "New Testament",
    count: books.filter((b) => b.testament === t).length,
    groups: getGroups(t).map((g) => ({
      name: g.name,
      en: g.en,
      desc: g.desc,
      books: g.books.map((b) => ({
        slug: b.slug,
        order: b.order,
        ko: b.ko,
        en: b.en,
        chapters: b.chapters,
        badge: autoLinks(b).episodes.length ? "📺" : undefined,
      })),
    })),
  }));
  const chapters = books.reduce((s, b) => s + b.chapters, 0);
  return (
    <article className="bible-books">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: BIBLE_BOOKS_TITLE,
          url: absoluteUrl(BIBLE_BOOKS_PATH),
          numberOfItems: books.length,
          itemListElement: books.map((b) => ({
            "@type": "ListItem",
            position: b.order,
            name: `${b.ko} (${b.en})`,
            url: absoluteUrl(bookPath(b)),
          })),
        }}
      />
      <Breadcrumbs items={[{ name: BIBLE_BOOKS_TITLE, path: BIBLE_BOOKS_PATH }]} />
      <h1>📚 {BIBLE_BOOKS_TITLE}</h1>
      <p className="lead">{BIBLE_BOOKS_INTRO}</p>
      <p className="bb-stats">
        <span>
          <strong>66</strong>권
        </span>
        <span>
          구약 <strong>39</strong>
        </span>
        <span>
          신약 <strong>27</strong>
        </span>
        <span>
          <strong>{chapters.toLocaleString("ko-KR")}</strong>장
        </span>
      </p>

      <section className="note-box" aria-labelledby="tags-h">
        <strong id="tags-h">표시 읽는 법</strong>
        <ul>
          {BIBLE_BOOKS_TAGS.map((t, i) => (
            <TMd key={i} as="li" text={t} />
          ))}
          <li>📺 = 더 초즌 에피소드의 성경 근거로 나오는 책</li>
        </ul>
      </section>

      <section>
        <h2>구약·신약 목록</h2>
        <BibleBooksTabs testaments={testaments} />
      </section>

      <section className="note-box" aria-labelledby="method-h">
        <strong id="method-h">이렇게 정리했습니다</strong>
        <ul>
          {BIBLE_BOOKS_METHOD.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </section>

      <section id="sources">
        <h2>참고 자료</h2>
        <ul className="plain-list">
          {BIBLE_BOOKS_SOURCES.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener noreferrer">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="muted small">
          {BIBLE_BOOKS_CHECKED} 확인. 각 책 페이지에 그 책의 출처(위키백과·브리태니커·BibleProject)를 따로 달았습니다. 연대는 모두 대략적 추정이며, 새로운
          연구에 따라 달라질 수 있습니다.
        </p>
      </section>
    </article>
  );
}
