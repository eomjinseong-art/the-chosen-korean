import Link from "next/link";
import type { Verse } from "@/lib/guide";
import { CopyButton } from "./CopyButton";

export function verseCopyText(v: Verse) {
  return `${v.ko}\n— ${v.ref}\n\n"${v.en}"\n— ${v.refEn} (KJV)`;
}

export function VerseCard({ v, showEpisodes = true }: { v: Verse; showEpisodes?: boolean }) {
  return (
    <article className={"verse" + (v.mustKnow ? " verse-star" : "")} id={v.id}>
      {v.mustKnow ? <div className="star-badge">⭐ 꼭 기억할 구절 #{v.mustKnow}</div> : null}
      <h3 className="verse-ref">
        📖 {v.ref} <span className="verse-ref-en">({v.refEn})</span>
      </h3>
      <p className="verse-ko">{v.ko}</p>
      <p className="verse-en" lang="en">
        {v.en} <span className="kjv">KJV</span>
      </p>
      <div className="verse-foot">
        {showEpisodes && v.episodes.length > 0 ? (
          <span className="verse-eps">
            관련 화:{" "}
            {v.episodes.map((c) => {
              const m = /^S(\d+)E(\d+)$/.exec(c)!;
              return (
                <Link key={c} href={`/s${m[1]}/e${m[2]}`} className="chip">
                  시즌{m[1]} {m[2]}화
                </Link>
              );
            })}
          </span>
        ) : (
          <span />
        )}
        <CopyButton text={verseCopyText(v)} />
      </div>
    </article>
  );
}
