import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuide } from "@/lib/guide";
import { Md } from "@/components/Md";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { absoluteUrl, pageMeta } from "@/lib/seo";
import { artFor } from "@/lib/art";
import { CharacterArt } from "@/components/CharacterArt";
import { AvoirAd } from "@/components/AvoirAd";
import { familyTreeHrefForSlug } from "@/lib/familyTree";
import { CHARACTER_ELSEWHERE } from "@/lib/characterElsewhere";

export const dynamicParams = false;

export function generateStaticParams() {
  return getGuide()
    .characters.filter((c) => c.slug)
    .map((c) => ({ slug: c.slug! }));
}

const GROUP_LABEL = {
  disciples: "열두 제자",
  around: "예수 주변 사람들",
  opposition: "반대·위협 세력",
  extra: "주요 인물",
  other: "등장인물",
} as const;

function get(slug: string) {
  return getGuide().characters.find((c) => c.slug === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const c = get((await params).slug);
  if (!c) return {};
  const who = c.info.map((i) => i.value.replace(/\*\*/g, "")).join(" · ") || c.seasonRoles.map((r) => r.role).join(" · ");
  const meta = pageMeta({
    title: `더 초즌 ${c.name} — 인물 소개와 등장 회차`,
    description: `더 초즌(The Chosen) ${c.name}: ${who} 등장한 ${c.appearances.length}개 에피소드와 화별 역할을 정리했습니다.`,
    path: `/characters/${c.slug}`,
  });
  const art = artFor(c.slug);
  if (art && meta.openGraph) {
    const img = { url: absoluteUrl(art.src), width: art.w, height: art.h, alt: `${art.artist} 〈${art.title}〉` };
    meta.openGraph = { ...meta.openGraph, images: [img] };
    meta.twitter = { ...meta.twitter, images: [img.url] };
  }
  return meta;
}

export default async function CharacterPage({ params }: { params: Promise<{ slug: string }> }) {
  const c = get((await params).slug);
  if (!c) notFound();
  const treeHref = c.slug ? familyTreeHrefForSlug(c.slug) : null;
  const elsewhere = c.slug ? CHARACTER_ELSEWHERE[c.slug] : undefined;
  return (
    <article>
      <Breadcrumbs
        items={[
          { name: "인물 사전", path: "/characters" },
          { name: c.name, path: `/characters/${c.slug}` },
        ]}
      />
      <p className="eyebrow">{GROUP_LABEL[c.group]}</p>
      <h1>{c.name}</h1>
      {treeHref ? (
        <p className="muted">
          <Link href={treeHref}>가족관계도에서 보기</Link>
        </p>
      ) : null}
      {(() => {
        const art = artFor(c.slug);
        return art ? <CharacterArt art={art} name={c.name} /> : null;
      })()}
      {c.info.length ? (
        <dl className="info">
          {c.info.map((i) => (
            <div key={i.label}>
              <dt>{i.label}</dt>
              <dd>
                <Md text={i.value} />
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
      {c.seasonRoles.length ? (
        <>
          <h2>시즌별 역할</h2>
          <ul className="roles">
            {c.seasonRoles.map((r, i) => (
              <li key={i}>
                <Link href={`/s${r.season}`}>시즌 {r.season}</Link> — {r.role}
              </li>
            ))}
          </ul>
        </>
      ) : null}
      <h2>등장한 화 ({c.appearances.length})</h2>
      {c.appearances.length ? (
        <ol className="appear">
          {c.appearances.map((a) => {
            const m = /^S(\d+)E(\d+)$/.exec(a.code)!;
            return (
              <li key={a.code}>
                <Link href={a.path}>
                  <span className="ap-code">
                    시즌{m[1]} {m[2]}화
                  </span>{" "}
                  <span className="ap-title">{a.title}</span>
                </Link>
                <span className="ap-role">{a.role}</span>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="muted">화별 등장인물 표에 따로 이름이 오른 화가 없습니다.</p>
      )}
      {elsewhere?.length ? (
        <section>
          <h2>다른 사이트에서 더 보기</h2>
          <ul className="bb-links">
            {elsewhere.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <AvoirAd place="character" />
      <p className="back">
        <Link href="/characters">← 인물 사전으로</Link>
      </p>
    </article>
  );
}
