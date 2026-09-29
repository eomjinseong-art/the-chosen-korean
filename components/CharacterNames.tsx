import Link from "next/link";
import type { Resolved } from "@/lib/characters";
import { characterHref, getGuide, stripMd } from "@/lib/guide";

/** Render a 등장인물 cell; each recognised name links to the character dictionary. */
export function CharacterNames({ raw, names }: { raw: string; names: Resolved[] }) {
  const text = stripMd(raw);
  const known = new Set(getGuide().characters.filter((c) => c.slug || c.appearances.length).map((c) => c.key));
  const link = (n: Resolved, label: string) =>
    n.canon || known.has(n.key) ? (
      <Link href={characterHref(n)} className="person-link">
        {label}
      </Link>
    ) : (
      <span>{label}</span>
    );
  if (!names.length) return <strong>{text}</strong>;
  const parts = text.includes("→") ? [text] : text.split(/\s*[·/]\s*/);
  if (parts.length === names.length) {
    return (
      <span className="names-inline">
        {parts.map((p, i) => (
          <span key={i}>
            {i > 0 ? <span className="sep">·</span> : null}
            {link(names[i], p)}
          </span>
        ))}
      </span>
    );
  }
  return (
    <span className="names">
      <strong>{text}</strong>
      <span className="names-links">
        {names.map((n) => (
          <Link key={n.key} href={characterHref(n)} className="chip chip-person">
            {n.name}
          </Link>
        ))}
      </span>
    </span>
  );
}
