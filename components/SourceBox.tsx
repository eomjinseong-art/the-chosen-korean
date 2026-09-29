import type { Episode } from "@/lib/guide";
import { Md } from "./Md";

export const KIND_LABEL: Record<Episode["sourceKind"], { text: string; cls: string }> = {
  bible: { text: "📖 성경 중심", cls: "kind-bible" },
  mixed: { text: "📖 성경 + 🎬 창작", cls: "kind-mixed" },
  drama: { text: "🎬 대부분 드라마 창작", cls: "kind-drama" },
};

export function KindBadge({ kind }: { kind: Episode["sourceKind"] }) {
  const k = KIND_LABEL[kind];
  return <span className={`kind ${k.cls}`}>{k.text}</span>;
}

export function SourceBox({ e }: { e: Episode }) {
  return (
    <section className="source-box" aria-labelledby="src-h">
      <h2 id="src-h">성경일까, 드라마 창작일까?</h2>
      {e.sourceSegments ? (
        <div className="src-grid">
          {e.sourceSegments.map((s, i) => (
            <div key={i} className={`src src-${s.kind}`}>
              <div className="src-label">
                {s.kind === "bible" ? "📖" : "🎬"} {s.label}
              </div>
              {s.items.length ? (
                <ul>
                  {s.items.map((it, j) => (
                    <Md key={j} as="li" text={it} refs />
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <Md as="p" className="src-inline" text={e.sourceRaw} refs />
      )}
      <p className="src-help">
        <span className="tag tag-bible">📖 성경에 있는 이야기</span>는 성경에 실제로 나오는 사건,{" "}
        <span className="tag tag-drama">🎬 드라마 창작</span>은 제작진이 상상해 덧붙인 부분입니다.
      </p>
    </section>
  );
}
