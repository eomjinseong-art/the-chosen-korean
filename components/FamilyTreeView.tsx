"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  ERAS,
  FAMILY_TREE_PATH,
  eraOf,
  isExternalHref,
  orderedPages,
  relationsOf,
  resolveFocus,
  searchNodes,
  type EraId,
  type LayoutEdge,
  type LayoutNode,
  type RelationPerson,
} from "@/lib/familyTree";

const ERA_IDS = new Set(ERAS.map((era) => era.id));

function edgePaint(edge: LayoutEdge, active: boolean, dimming: boolean) {
  const spouse = edge.kind === "spouse";
  const variant = edge.kind === "variant" || edge.kind === "kin";
  const skip = edge.kind === "skip";
  const sibling = edge.kind === "sibling";
  const color = sibling ? "#1f6f5c" : variant ? "#6d4c8a" : "#a6843d";
  let opacity = spouse ? (edge.local ? 0.95 : 0.62) : variant ? 0.72 : skip ? 0.8 : sibling ? 0.85 : edge.local ? 0.85 : edge.quiet ? 0.2 : 0.45;
  if (dimming) opacity = active ? 1 : 0.06;
  return {
    color,
    opacity,
    width: active ? 2.6 : edge.local || spouse ? 1.7 : 1.25,
    dash: variant || skip ? "5 4" : undefined,
  };
}

function relatedSet(id: string) {
  const rel = relationsOf(id);
  const ids = new Set<string>([id]);
  for (const group of [rel.parents, rel.variantParents, rel.spouses, rel.children, rel.variantChildren, rel.siblings, rel.kin, rel.skipPrev, rel.skipNext]) {
    for (const person of group) ids.add(person.id);
  }
  return ids;
}

export function FamilyTreeView() {
  const [era, setEra] = useState<EraId>("genesis");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [openSuggest, setOpenSuggest] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number } | null>(null);
  const listId = useId();
  const tree = eraOf(era);
  const suggestions = query.trim() ? searchNodes(query).slice(0, 8) : [];
  const selectedNode = selected ? tree.nodes.find((node) => node.id === selected) : undefined;
  const related = useMemo(() => (selectedNode ? relatedSet(selectedNode.id) : null), [selectedNode]);
  const relations = selectedNode ? relationsOf(selectedNode.id) : null;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const focus = resolveFocus(params.get("focus"));
    const eraParam = params.get("era");
    if (focus) {
      setEra(focus.era);
      setSelected(focus.id);
      setQuery(focus.ellipsis ? "" : focus.ko);
      return;
    }
    if (eraParam && ERA_IDS.has(eraParam as EraId)) setEra(eraParam as EraId);
  }, []);

  useEffect(() => {
    if (!selectedNode) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(`ft-${selectedNode.id}`)?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "center",
      inline: "center",
    });
  }, [selectedNode]);

  function writeUrl(nextEra: EraId, focus: string | null) {
    const url = new URL(window.location.href);
    url.searchParams.set("era", nextEra);
    if (focus) url.searchParams.set("focus", focus);
    else url.searchParams.delete("focus");
    window.history.replaceState(null, "", url);
  }

  function choose(id: string, label?: string) {
    const node = ERAS.flatMap((item) => item.nodes).find((item) => item.id === id);
    if (!node) return;
    setEra(node.era);
    setSelected(id);
    setOpenSuggest(false);
    if (label) setQuery(label);
    writeUrl(node.era, id);
  }

  function pickEra(id: EraId) {
    setEra(id);
    setSelected(null);
    setOpenSuggest(false);
    writeUrl(id, null);
    scroller.current?.scrollTo({ left: 0 });
  }

  function onQuery(value: string) {
    setQuery(value);
    setOpenSuggest(true);
    const hit = resolveFocus(value);
    if (hit && !hit.ellipsis) choose(hit.id);
  }

  return (
    <div className="ft">
      <div className="ft-tabs" role="tablist" aria-label="가계 시대">
        {ERAS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`ft-tab-${item.id}`}
            aria-selected={era === item.id}
            aria-controls="ft-panel"
            className={"ft-tab" + (era === item.id ? " ft-tab-on" : "")}
            onClick={() => pickEra(item.id)}
          >
            {item.ko} <small>{item.en}</small>
          </button>
        ))}
      </div>

      <div className="ft-tools">
        <form
          className="ft-search"
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            const id = resolveFocus(query)?.id ?? suggestions[0]?.id;
            if (id) choose(id, suggestions.find((node) => node.id === id)?.ko ?? query);
          }}
        >
          <label htmlFor="tree-find">이름 찾기 · Find</label>
          <input
            id="tree-find"
            type="search"
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            onFocus={() => setOpenSuggest(true)}
            placeholder="아브라함, Abraham, 모세"
            aria-label="가족관계도에서 이름 찾기"
            aria-autocomplete="list"
            aria-controls={openSuggest && suggestions.length > 0 ? listId : undefined}
            autoComplete="off"
          />
          {openSuggest && suggestions.length > 0 ? (
            <ul id={listId} role="listbox" className="ft-suggest">
              {suggestions.map((node) => (
                <li key={node.id} role="option" aria-selected={selected === node.id}>
                  <button
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => choose(node.id, node.ko)}
                  >
                    <span>{node.ko}</span>
                    <small>
                      {eraOf(node.era).ko} · {node.en}
                    </small>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </form>
        <div className="ft-jumps" aria-label="세대로 이동">
          {tree.bands.map((band) => (
            <button
              key={band.id}
              type="button"
              className="chip"
              onClick={() => {
                const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                document.getElementById(`band-${era}-${band.id}`)?.scrollIntoView({
                  behavior: reduce ? "auto" : "smooth",
                  block: "nearest",
                  inline: "start",
                });
              }}
            >
              <i style={{ background: band.color }} aria-hidden />
              {band.ko}
            </button>
          ))}
        </div>
      </div>

      <ul className="ft-legend">
        {tree.bands.map((band) => (
          <li key={band.id}>
            <i className="ft-swatch" style={{ background: band.color }} aria-hidden />
            {band.ko} <span>{band.en}</span>
          </li>
        ))}
        <li>
          <svg width="28" height="8" aria-hidden>
            <line x1="0" y1="4" x2="28" y2="4" stroke="#a6843d" strokeWidth="2" />
          </svg>
          부모 → 자녀
        </li>
        <li>
          <svg width="28" height="8" aria-hidden>
            <line x1="0" y1="2" x2="28" y2="2" stroke="#8c2f2b" strokeWidth="1.4" />
            <line x1="0" y1="6" x2="28" y2="6" stroke="#8c2f2b" strokeWidth="1.4" />
          </svg>
          부부
        </li>
        <li>
          <svg width="28" height="8" aria-hidden>
            <line x1="0" y1="4" x2="28" y2="4" stroke="#a6843d" strokeWidth="1.6" strokeDasharray="4 3" />
          </svg>
          … 세대 생략
        </li>
        <li>
          <svg width="28" height="8" aria-hidden>
            <line x1="0" y1="4" x2="28" y2="4" stroke="#6d4c8a" strokeWidth="1.6" strokeDasharray="4 3" />
          </svg>
          법적·친족·전통
        </li>
        <li>
          <svg width="28" height="8" aria-hidden>
            <line x1="0" y1="4" x2="28" y2="4" stroke="#1f6f5c" strokeWidth="1.6" />
          </svg>
          형제·자매
        </li>
        <li>
          <i className="ft-swatch ft-swatch-key" aria-hidden />
          주요
        </li>
      </ul>

      <p className="muted ft-era-lead">{tree.lead}</p>

      <div
        ref={scroller}
        id="ft-panel"
        role="tabpanel"
        aria-labelledby={`ft-tab-${era}`}
        className="ft-scroll"
        onPointerDown={(event) => {
          if (event.pointerType !== "mouse" || event.button !== 0) return;
          if ((event.target as HTMLElement).closest("button, a, input")) return;
          const el = scroller.current;
          if (!el) return;
          drag.current = { x: event.clientX, left: el.scrollLeft };
          el.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!drag.current || !scroller.current) return;
          scroller.current.scrollLeft = drag.current.left - (event.clientX - drag.current.x);
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
      >
        <div className="ft-chart" style={{ width: tree.width, height: tree.height }}>
          {tree.bands.map((band) => (
            <div key={band.id} id={`band-${era}-${band.id}`} className="ft-band" style={{ top: band.top, height: band.height, width: tree.width, background: band.soft }}>
              <div className="ft-band-label">
                <span style={{ color: band.color }}>{band.ko}</span>
                <small>{band.en}</small>
              </div>
            </div>
          ))}
          <svg className="ft-edges" width={tree.width} height={tree.height} aria-hidden>
            {tree.edges.map((edge) => {
              const active = related ? related.has(edge.from) && related.has(edge.to) : false;
              const paint = edgePaint(edge, active, Boolean(related));
              const halo = related && !active ? 0 : 0.95;
              return (
                <g key={edge.id} fill="none" strokeLinecap="round">
                  <path d={edge.d} stroke="#fffdf8" strokeWidth={paint.width + 2.2} strokeOpacity={halo} />
                  {edge.d2 ? <path d={edge.d2} stroke="#fffdf8" strokeWidth={paint.width + 2.2} strokeOpacity={halo} /> : null}
                  <path d={edge.d} stroke={paint.color} strokeWidth={paint.width} strokeOpacity={paint.opacity} strokeDasharray={paint.dash} />
                  {edge.d2 ? <path d={edge.d2} stroke={paint.color} strokeWidth={paint.width} strokeOpacity={paint.opacity} strokeDasharray={paint.dash} /> : null}
                </g>
              );
            })}
          </svg>
          {tree.nodes.map((node) => (
            <TreeCard
              key={node.id}
              node={node}
              pressed={selected === node.id}
              dimmed={Boolean(related && !related.has(node.id))}
              linked={Boolean(related && related.has(node.id) && selected !== node.id)}
              onSelect={() => choose(node.id, node.ellipsis ? query : node.ko)}
            />
          ))}
        </div>
      </div>
      <p className="muted small">옆으로 밀거나 드래그하면 가계 전체가 보입니다. 칸을 누르면 부모, 배우자, 자녀, 형제가 밝아집니다.</p>

      {selectedNode && relations ? (
        <section className="ft-detail" aria-live="polite">
          <div className="ft-detail-head">
            <div>
              <p className="eyebrow">
                {eraOf(selectedNode.era).ko} · {tree.bands.find((band) => band.id === selectedNode.band)?.ko}
              </p>
              <h2>{selectedNode.ellipsis ? "생략된 세대" : selectedNode.ko}</h2>
              {selectedNode.ellipsis ? null : <p className="muted">{selectedNode.en}</p>}
            </div>
            <button type="button" className="chip" onClick={() => setSelected(null)}>
              닫기
            </button>
          </div>
          <p>{selectedNode.summary}</p>
          <p className="ft-cite">{selectedNode.cite}</p>
          {selectedNode.note ? <p className="ft-note">{selectedNode.note}</p> : null}
          <div className="ft-rels">
            <PeopleRow label="부모" people={relations.parents} empty={relations.parents.length || relations.variantParents.length || relations.skipPrev.length ? undefined : selectedNode.emptyParents || "이 그림에는 없습니다"} onPick={choose} />
            <PeopleRow label="법적·다른 전통" people={relations.variantParents} onPick={choose} />
            <PeopleRow label="배우자" people={relations.spouses} onPick={choose} />
            <PeopleRow label="친족" people={relations.kin} onPick={choose} />
            <PeopleRow label="자녀" people={relations.children} onPick={choose} />
            <PeopleRow label="법적·다른 전통의 자녀" people={relations.variantChildren} onPick={choose} />
            <PeopleRow label="형제·자매" people={relations.siblings} onPick={choose} />
            <PeopleRow label="이전 세대 (생략)" people={relations.skipPrev} onPick={choose} />
            <PeopleRow label="다음 세대 (생략)" people={relations.skipNext} onPick={choose} />
          </div>
          {orderedPages(selectedNode.pages).length ? (
            <div className="ft-pages">
              {orderedPages(selectedNode.pages).map((page) =>
                page.href.startsWith(FAMILY_TREE_PATH) ? (
                  <button
                    key={page.href + page.label}
                    type="button"
                    onClick={() => {
                      const focus = new URL(page.href, window.location.origin).searchParams.get("focus");
                      if (focus) choose(focus);
                    }}
                  >
                    {page.label}
                  </button>
                ) : isExternalHref(page.href) ? (
                  <a key={page.href + page.label} href={page.href} target="_blank" rel="noopener noreferrer">
                    {page.label}
                  </a>
                ) : (
                  <Link key={page.href + page.label} href={page.href}>
                    {page.label}
                  </Link>
                ),
              )}
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}

function PeopleRow({
  label,
  people,
  empty,
  onPick,
}: {
  label: string;
  people: RelationPerson[];
  empty?: string;
  onPick: (id: string) => void;
}) {
  if (!people.length && !empty) return null;
  return (
    <div className="ft-rel">
      <span>{label}</span>
      {people.length ? (
        people.map((person) => (
          <button key={person.id} type="button" className="chip" title={person.ref || undefined} onClick={() => onPick(person.id)}>
            {person.ko === "…" ? "…" : person.ko}
            {person.en && person.en !== "gap" ? <small> {person.en}</small> : null}
          </button>
        ))
      ) : (
        <em>{empty}</em>
      )}
    </div>
  );
}

function TreeCard({
  node,
  pressed,
  dimmed,
  linked,
  onSelect,
}: {
  node: LayoutNode;
  pressed: boolean;
  dimmed: boolean;
  linked: boolean;
  onSelect: () => void;
}) {
  const band = eraOf(node.era).bands.find((item) => item.id === node.band)!;
  const border = node.ellipsis ? "#a6843d" : band.color;
  const pages = orderedPages(node.pages);
  const page =
    pages.find((item) => item.href.startsWith("/") && !item.href.startsWith(FAMILY_TREE_PATH)) ??
    pages.find((item) => isExternalHref(item.href));
  return (
    <div id={`ft-${node.id}`} className="ft-node" style={{ left: node.x, top: node.y, width: node.w, height: node.h, opacity: dimmed ? 0.28 : 1 }}>
      {node.badge ? <span className={"ft-badge ft-badge-" + node.badge.tone}>{node.badge.text}</span> : null}
      <button
        type="button"
        aria-pressed={pressed}
        title={node.ellipsis ? node.summary : `${node.ko} / ${node.en}${node.caption ? `. ${node.caption}` : ""}`}
        onClick={onSelect}
        className={"ft-card" + (node.ellipsis ? " ft-card-gap" : "") + (node.key ? " ft-card-key" : "") + (node.pages?.length ? " ft-card-linked" : "")}
        style={{
          borderColor: border,
          borderStyle: node.ellipsis ? "dashed" : "solid",
          boxShadow: pressed ? "0 0 0 3px #c08a2d" : linked ? `0 0 0 2px ${border}` : undefined,
        }}
      >
        {node.ellipsis ? (
          <span className="ft-gap" aria-hidden>
            …
          </span>
        ) : (
          <span className="ft-avatar" style={{ background: border }} aria-hidden>
            {node.ko.slice(0, 1)}
          </span>
        )}
        <span className="ft-ko">{node.ellipsis ? "생략" : node.ko}</span>
        <span className="ft-en">{node.ellipsis ? node.caption || node.sub : node.sub}</span>
        {!node.ellipsis && node.caption ? <span className="ft-role">{node.caption}</span> : null}
      </button>
      {page ? (
        isExternalHref(page.href) ? (
          <a href={page.href} className="ft-page" target="_blank" rel="noopener noreferrer" aria-label={`${node.ko} ${page.label}`}>
            페이지
          </a>
        ) : (
          <Link href={page.href} className="ft-page" aria-label={`${node.ko} ${page.label}`}>
            페이지
          </Link>
        )
      ) : null}
    </div>
  );
}
