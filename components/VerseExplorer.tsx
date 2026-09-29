"use client";

import { useMemo, useState } from "react";
import type { Verse } from "@/lib/guide";
import { VerseCard } from "./VerseCard";

export function VerseExplorer({ verses }: { verses: Verse[] }) {
  const books = useMemo(() => {
    const m = new Map<string, number>();
    verses.forEach((v) => m.set(v.book, (m.get(v.book) || 0) + 1));
    return [...m.entries()];
  }, [verses]);
  const [book, setBook] = useState<string>("");
  const [season, setSeason] = useState<number>(0);
  const [star, setStar] = useState(false);
  const list = verses.filter(
    (v) =>
      (!book || v.book === book) &&
      (!season || v.episodes.some((c) => c.startsWith(`S${season}E`))) &&
      (!star || v.mustKnow),
  );
  return (
    <div>
      <div className="filters" role="group" aria-label="구절 필터">
        <div className="filter-row">
          <span className="filter-label">성경</span>
          <button className={"chip" + (!book ? " chip-on" : "")} onClick={() => setBook("")}>
            전체
          </button>
          {books.map(([b, n]) => (
            <button key={b} className={"chip" + (book === b ? " chip-on" : "")} onClick={() => setBook(b)}>
              {b} <small>{n}</small>
            </button>
          ))}
        </div>
        <div className="filter-row">
          <span className="filter-label">시즌</span>
          {[0, 1, 2, 3, 4, 5].map((s) => (
            <button key={s} className={"chip" + (season === s ? " chip-on" : "")} onClick={() => setSeason(s)}>
              {s ? `시즌 ${s}` : "전체"}
            </button>
          ))}
          <button className={"chip chip-star" + (star ? " chip-on" : "")} onClick={() => setStar(!star)}>
            ⭐ 꼭 기억할 10구절만
          </button>
        </div>
        <p className="muted" aria-live="polite">
          {list.length}개 구절
        </p>
      </div>
      <div className="verses">
        {list.map((v) => (
          <VerseCard key={v.id} v={v} />
        ))}
      </div>
    </div>
  );
}
