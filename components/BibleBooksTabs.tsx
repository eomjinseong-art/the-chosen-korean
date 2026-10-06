"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export type BookCard = { slug: string; order: number; ko: string; en: string; chapters: number; badge?: string };
export type GroupBlock = { name: string; en: string; desc: string; books: BookCard[] };
export type TestamentBlock = { key: "ot" | "nt"; label: string; en: string; count: number; groups: GroupBlock[] };

export function BibleBooksTabs({ testaments }: { testaments: TestamentBlock[] }) {
  const [tab, setTab] = useState<"ot" | "nt">("ot");
  useEffect(() => {
    const read = () => {
      const h = window.location.hash.replace("#", "");
      if (h === "nt" || h === "ot") setTab(h);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);
  const pick = (k: "ot" | "nt") => {
    setTab(k);
    history.replaceState(null, "", `#${k}`);
  };
  return (
    <div className="bb-tabs">
      <div className="bb-tablist" role="tablist" aria-label="구약·신약">
        {testaments.map((t) => (
          <button
            key={t.key}
            role="tab"
            id={`tab-${t.key}`}
            aria-selected={tab === t.key}
            aria-controls={`panel-${t.key}`}
            className={"bb-tab" + (tab === t.key ? " bb-tab-on" : "")}
            onClick={() => pick(t.key)}
          >
            {t.label} <small>{t.count}권</small>
          </button>
        ))}
      </div>
      {testaments.map((t) => (
        <section
          key={t.key}
          id={`panel-${t.key}`}
          role="tabpanel"
          aria-labelledby={`tab-${t.key}`}
          hidden={tab !== t.key}
          className="bb-panel"
        >
          <nav className="ep-chips bb-jump" aria-label={`${t.label} 분류로 이동`}>
            {t.groups.map((g) => (
              <a key={g.name} href={`#${t.key}-${g.name}`} className="chip">
                {g.name} <small>{g.books.length}</small>
              </a>
            ))}
          </nav>
          {t.groups.map((g) => (
            <div key={g.name} className="bb-group" id={`${t.key}-${g.name}`}>
              <h3 className="bb-group-h">
                {g.name} <span className="bb-group-en" lang="en">{g.en}</span> <small className="muted">{g.books.length}권</small>
              </h3>
              <p className="muted small bb-group-desc">{g.desc}</p>
              <ul className="bb-grid">
                {g.books.map((b) => (
                  <li key={b.slug}>
                    <Link href={`/bible-books/${b.slug}`} className="bb-card">
                      <span className="bb-no">{b.order}</span>
                      <span className="bb-names">
                        <strong className="bb-ko">{b.ko}</strong>
                        <span className="bb-en" lang="en">
                          {b.en}
                        </span>
                      </span>
                      <span className="bb-ch">
                        {b.chapters}장{b.badge ? <span className="bb-badge">{b.badge}</span> : null}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
