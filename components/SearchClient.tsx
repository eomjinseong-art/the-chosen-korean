"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export type SearchItem = { type: "에피소드" | "인물" | "성경 구절" | "같이 보기"; title: string; sub: string; text: string; href: string };

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, "");

export function SearchClient({ items }: { items: SearchItem[] }) {
  const [q, setQ] = useState("");
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("q");
    if (p) setQ(p);
  }, []);
  const indexed = useMemo(() => items.map((it) => ({ it, t: norm(it.title + " " + it.sub), b: norm(it.text) })), [items]);
  const results = useMemo(() => {
    const terms = q.trim().split(/\s+/).filter(Boolean).map(norm);
    if (!terms.length) return [];
    return indexed
      .map(({ it, t, b }) => {
        let score = 0;
        for (const term of terms) {
          if (t.includes(term)) score += 10;
          else if (b.includes(term)) score += 1;
          else return null;
        }
        return { it, score };
      })
      .filter((x): x is { it: SearchItem; score: number } => !!x)
      .sort((a, b) => b.score - a.score)
      .slice(0, 60);
  }, [q, indexed]);

  const snippet = (text: string) => {
    const term = q.trim().split(/\s+/)[0] || "";
    const i = term ? text.toLowerCase().indexOf(term.toLowerCase()) : -1;
    if (i < 0) return text.slice(0, 90) + (text.length > 90 ? "…" : "");
    const start = Math.max(0, i - 30);
    return (start ? "…" : "") + text.slice(start, start + 100) + (start + 100 < text.length ? "…" : "");
  };

  return (
    <div>
      <input
        className="search-input"
        type="search"
        value={q}
        autoFocus
        onChange={(e) => {
          setQ(e.target.value);
          const u = new URL(window.location.href);
          if (e.target.value) u.searchParams.set("q", e.target.value);
          else u.searchParams.delete("q");
          window.history.replaceState(null, "", u);
        }}
        placeholder="예: 베드로, 물 위, 요한복음 3:16, 유다"
        aria-label="검색어"
      />
      {q.trim() ? <p className="muted">{results.length}개 결과</p> : <p className="muted">에피소드 제목·줄거리, 인물, 성경 구절을 찾습니다.</p>}
      <ul className="results">
        {results.map(({ it }) => (
          <li key={it.href + it.title}>
            <Link href={it.href}>
              <span className={"rtype rtype-" + (it.type === "에피소드" ? "ep" : it.type === "인물" ? "ch" : "v")}>{it.type}</span>
              <strong>{it.title}</strong> <span className="muted">{it.sub}</span>
              <span className="rsnip">{snippet(it.text)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
