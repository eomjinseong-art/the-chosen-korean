import Link from "next/link";
import { getGuide, type Character, type CharacterGroup } from "@/lib/guide";
import { anchorId } from "@/lib/characters";
import { Md } from "@/components/Md";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "더 초즌 등장인물 사전 — 열두 제자·예수 주변 인물·반대 세력",
  description:
    "더 초즌(The Chosen) 등장인물 사전. 베드로·마태·가룟 유다 등 열두 제자, 막달라 마리아·니고데모 등 예수 주변 사람들, 가야바·빌라도 등 반대 세력과 인물별 등장 회차를 정리했습니다.",
  path: "/characters",
});

const GROUPS: { id: CharacterGroup; title: string }[] = [
  { id: "disciples", title: "예수의 열두 제자" },
  { id: "around", title: "예수 주변 사람들" },
  { id: "opposition", title: "반대·위협 세력" },
  { id: "extra", title: "그 밖의 주요 인물" },
];

function summary(c: Character) {
  const last = c.info[c.info.length - 1];
  if (last) return last.value;
  return c.seasonRoles[0]?.role || c.appearances[0]?.role || "";
}

export default function CharactersPage() {
  const g = getGuide();
  const others = g.characters.filter((c) => c.group === "other" && c.appearances.length);
  return (
    <article>
      <Breadcrumbs items={[{ name: "인물 사전", path: "/characters" }]} />
      <h1>더 초즌 인물 사전</h1>
      <p className="lead">인물을 누르면 소개와 함께 등장한 화 목록을 볼 수 있어요. 등장 회차는 각 화의 등장인물 표에서 자동으로 모았습니다.</p>
      <nav className="chips-row">
        {GROUPS.map((gr) => (
          <a key={gr.id} href={`#${gr.id}`} className="chip">
            {gr.title}
          </a>
        ))}
        <a href="#others" className="chip">
          그 밖의 등장인물
        </a>
      </nav>
      {GROUPS.map((gr) => (
        <section key={gr.id} id={gr.id}>
          <h2>{gr.title}</h2>
          <div className="grid cards">
            {g.characters
              .filter((c) => c.group === gr.id)
              .map((c) => (
                <Link key={c.key} href={`/characters/${c.slug}`} className="card person-card">
                  <strong className="card-title">{c.name}</strong>
                  {c.info.length > 1 ? (
                    <span className="person-meta">
                      {c.info
                        .slice(0, -1)
                        .map((i) => i.value.replace(/\*\*/g, ""))
                        .join(" · ")}
                    </span>
                  ) : null}
                  <Md as="p" className="card-text" text={summary(c)} />
                  <span className="card-more">등장 {c.appearances.length}화 →</span>
                </Link>
              ))}
          </div>
        </section>
      ))}
      <section id="others">
        <h2>그 밖의 등장인물</h2>
        <ul className="others">
          {others.map((c) => (
            <li key={c.key} id={anchorId(c.key)}>
              <strong>{c.name}</strong>
              <ul>
                {c.appearances.map((a) => (
                  <li key={a.code}>
                    <Link href={a.path}>
                      시즌{a.code.slice(1, a.code.indexOf("E"))} {a.code.slice(a.code.indexOf("E") + 1)}화 · {a.title}
                    </Link>{" "}
                    — {a.role}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
