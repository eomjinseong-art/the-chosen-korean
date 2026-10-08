import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FamilyTreeView } from "@/components/FamilyTreeView";
import { JsonLd } from "@/components/JsonLd";
import { canonBySlug } from "@/lib/characters";
import { getBook } from "@/lib/bibleBooks";
import {
  ALL_NODES,
  DISPUTES,
  ERAS,
  FAMILY_TREE_PATH,
  NAME_NOTES,
  OMISSIONS,
  familyTreeHref,
  relationsOf,
} from "@/lib/familyTree";
import { absoluteUrl, pageMeta } from "@/lib/seo";

const description =
  "성경의 핵심 인물만 모은 가족관계도. 아담과 노아, 아브라함과 열두 아들, 모세, 룻과 다윗, 예수와 제자 형제까지. 긴 족보와 수명은 빼고, 비는 세대는 … 로 이었습니다.";

export const metadata = pageMeta({
  title: "가족관계도 — 아담·아브라함·다윗·예수 핵심 가계",
  description,
  path: FAMILY_TREE_PATH,
});

for (const node of ALL_NODES) {
  for (const page of node.pages ?? []) {
    if (page.href.startsWith("/bible-books/")) {
      const slug = page.href.split("/")[2];
      if (!getBook(slug)) throw new Error(`가족관계도에 없는 성경 책: ${page.href}`);
    } else if (page.href.startsWith("/characters/")) {
      const slug = page.href.split("/")[2];
      if (!canonBySlug(slug)) throw new Error(`가족관계도에 없는 인물 페이지: ${page.href}`);
    }
  }
}

export default function FamilyTreePage() {
  const listed = ALL_NODES.filter((node) => !node.ellipsis);
  return (
    <article className="family-tree">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "성경 가족관계도",
          description,
          url: absoluteUrl(FAMILY_TREE_PATH),
          numberOfItems: listed.length,
          itemListElement: listed.map((node, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: `${node.ko} (${node.en})`,
            url: absoluteUrl(familyTreeHref(node.era, node.id)),
          })),
        }}
      />
      <Breadcrumbs items={[{ name: "가족관계도", path: FAMILY_TREE_PATH }]} />
      <p className="eyebrow">FAMILY TREE</p>
      <h1>가족관계도</h1>
      <p className="lead">
        성경에 나오는 핵심 인물만 세대별로 그린 가계도입니다. 예를 들어 이삭은 아브라함과 사라의 아들이고, 모세는 아므람과 요게벳의 아들입니다. 수명이나 긴
        자녀 목록은 넣지 않았습니다. 여러 세대가 비는 곳은 <strong>…</strong> 로 건너뜁니다. 칸을 누르면 부모·배우자·자녀·형제가 밝아집니다.
      </p>
      <FamilyTreeView />

      <section>
        <h2>글로 읽는 가족관계</h2>
        <p className="muted">그림과 같은 관계입니다. 이름을 누르면 그 칸으로 이동합니다.</p>
        {ERAS.map((era) => (
          <section key={era.id}>
            <h3>
              {era.ko} <span className="ft-en-title">{era.en}</span>
            </h3>
            <p className="muted">{era.lead}</p>
            {era.bands.map((band) => (
              <div key={band.id}>
                <h4 className="ft-prose-band" style={{ color: band.color }}>
                  {band.ko}
                </h4>
                <p className="muted small">{band.hint}</p>
                <ul className="ft-prose">
                  {band.nodeIds.map((id) => {
                    const node = era.nodes.find((item) => item.id === id)!;
                    const rel = relationsOf(id);
                    return (
                      <li key={id}>
                        <a href={familyTreeHref(era.id, id)}>{node.ellipsis ? "생략된 세대" : node.ko}</a>
                        {node.ellipsis ? null : <span className="muted"> / {node.en}</span>}
                        {node.pages?.map((page) => (
                          <Link key={page.href + page.label} href={page.href} className="ft-prose-link">
                            {page.label}
                          </Link>
                        ))}
                        <span className="ft-prose-sum">{node.summary}</span>
                        {node.note ? <span className="ft-note">{node.note}</span> : null}
                        <span className="ft-cite">{node.cite}</span>
                        <span className="ft-kin">
                          <Kin label="부모" people={rel.parents} />
                          <Kin label="법적·다른 전통" people={rel.variantParents} />
                          <Kin label="배우자" people={rel.spouses} />
                          <Kin label="친족" people={rel.kin} />
                          <Kin label="자녀" people={rel.children} />
                          <Kin label="형제·자매" people={rel.siblings} />
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </section>
        ))}
      </section>

      <section>
        <h2>전통이 갈리는 곳</h2>
        <p className="muted">실선은 본문이 부모나 부부로 말하는 관계입니다. 보라색 점선은 법적 관계, 친족, 또는 전통이 나뉘는 관계입니다.</p>
        <ul className="ft-disputes">
          {DISPUTES.map((item) => (
            <li key={item.id}>
              <h3>{item.title}</h3>
              <p>
                <strong>본문. </strong>
                {item.main}
              </p>
              <p>
                <strong>읽는 차이. </strong>
                {item.other}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>이름을 구분할 때</h2>
        <ul className="plain-list">
          {NAME_NOTES.map((note) => (
            <li key={note.title}>
              <strong>{note.title}. </strong>
              {note.body}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>그림에 넣지 않은 것</h2>
        <ul className="plain-list">
          {OMISSIONS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="muted small">
          관계의 장 표시는 각 인물 옆에 적었습니다. 책 전체 소개는 <Link href="/bible-books">성경 66권 한눈에</Link>에 있습니다.
        </p>
      </section>
    </article>
  );
}

function Kin({ label, people }: { label: string; people: { id: string; ko: string; era?: string }[] }) {
  if (!people.length) return null;
  return (
    <span>
      {label}{" "}
      {people.map((person, index) => {
        const node = ALL_NODES.find((item) => item.id === person.id)!;
        return (
          <span key={person.id}>
            {index > 0 ? ", " : null}
            <a href={familyTreeHref(node.era, node.id)}>{person.ko === "…" ? "…" : person.ko}</a>
          </span>
        );
      })}
    </span>
  );
}
