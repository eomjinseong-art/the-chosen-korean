"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type HymnCard = {
  n: number;
  title: string;
  en?: string | null;
  origin: string;
  by: string;
  tags: string[];
  pd: boolean;
  search: string;
};

export function HymnExplorer({ hymns, tags }: { hymns: HymnCard[]; tags: [string, number][] }) {
  const [tag, setTag] = useState("");
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const words = q.toLowerCase().replace(/장/g, " ").split(/\s+/).filter(Boolean);
    return hymns.filter(
      (h) =>
        (!tag || h.tags.includes(tag)) &&
        words.every((w) => (/^\d+$/.test(w) ? String(h.n) === w : h.search.includes(w))),
    );
  }, [hymns, tag, q]);
  return (
    <div>
      <input
        className="search-input"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="제목·장 번호·원제·작가로 찾기 (예: 305, 은혜, Crosby)"
        aria-label="찬송가 찾기"
      />
      <div className="filters" role="group" aria-label="주제 필터">
        <div className="filter-row filter-wrap">
          <span className="filter-label">주제</span>
          <button className={"chip" + (!tag ? " chip-on" : "")} onClick={() => setTag("")}>
            전체
          </button>
          {tags.map(([t, n]) => (
            <button key={t} className={"chip" + (tag === t ? " chip-on" : "")} onClick={() => setTag(tag === t ? "" : t)}>
              {t} <small>{n}</small>
            </button>
          ))}
        </div>
        <p className="muted" aria-live="polite">
          {list.length}곡{tag ? ` · ‘${tag}’` : ""}
          {q ? ` · “${q}” 검색` : ""}
        </p>
      </div>
      {list.length ? (
        <div className="grid cards hymn-cards">
          {list.map((h) => (
            <Link key={h.n} href={`/hymns/${h.n}`} className="card hymn-card">
              <span className="card-kicker">
                새찬송가 {h.n}장 · {h.origin}
              </span>
              <strong className="card-title">{h.title}</strong>
              {h.en ? (
                <span className="ep-en" lang="en">
                  {h.en}
                </span>
              ) : null}
              <span className="card-text small">{h.by}</span>
              <span className="hymn-tags">
                {h.tags.map((t) => (
                  <span key={t} className="tag tag-hymn">
                    {t}
                  </span>
                ))}
                {h.pd ? <span className="tag tag-pd">영어 원문</span> : null}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="note-box">조건에 맞는 찬송이 없습니다. 검색어를 줄이거나 주제를 ‘전체’로 바꿔 보세요.</p>
      )}
    </div>
  );
}
