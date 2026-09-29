import { getGuide, stripMd } from "@/lib/guide";
import { Md, MdTable } from "@/components/Md";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { pageMeta } from "@/lib/seo";
import { WATCH_NOTE } from "@/lib/site";
import Link from "next/link";

export const metadata = pageMeta({
  title: "더 초즌 입문 — 먼저 알아둘 것과 용어 사전",
  description:
    "더 초즌(The Chosen)을 처음 보는 사람을 위한 입문 안내. 작품 배경, 분량, 시즌 5의 끝, 그리고 메시아·바리새인·안식일·유월절 등 꼭 알아야 할 용어를 쉽게 설명합니다.",
  path: "/intro",
});

export default function IntroPage() {
  const g = getGuide();
  return (
    <article className="prose-page">
      <Breadcrumbs items={[{ name: "입문", path: "/intro" }]} />
      <h1>더 초즌 입문 가이드</h1>
      <p className="lead">성경을 몰라도 이 페이지만 읽고 시즌 1을 시작할 수 있어요.</p>

      <h2 id="basics">먼저 알아둘 것</h2>
      <MdTable
        header={g.basics.header}
        rows={g.basics.rows}
        className="kv"
        renderCell={(c, col, row) =>
          col === 1 && stripMd(row[0]) === "시청처" ? <span>{WATCH_NOTE}</span> : <Md text={c} />
        }
      />

      <h2 id="summary">줄거리를 3줄로 요약하면</h2>
      <ol className="three-line">
        {g.threeLine.map((l, i) => (
          <Md key={i} as="li" text={l} />
        ))}
      </ol>

      <h2 id="glossary">용어 사전 (이것만 알면 됩니다)</h2>
      <dl className="glossary">
        {g.glossary.rows.map((r) => (
          <div key={r[0]} className="gl-item">
            <dt>
              <Md text={r[0]} />
            </dt>
            <dd>
              <Md text={r[1]} />
            </dd>
          </div>
        ))}
      </dl>

      {g.appendix ? (
        <>
          <h2 id="tips">이 가이드 활용 팁</h2>
          <MdTable header={g.appendix.header} rows={g.appendix.rows} />
        </>
      ) : null}

      <div className="cta-row">
        <Link href="/characters" className="btn">
          인물 사전 보기
        </Link>
        <Link href="/s1" className="btn btn-primary">
          시즌 1 시작하기 →
        </Link>
      </div>
    </article>
  );
}
