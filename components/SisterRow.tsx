import type { SisterLink } from "@/lib/site";

export function SisterRow({ title, en, links }: { title: string; en: string; links: SisterLink[] }) {
  return (
    <section className="sister-row">
      <h2>
        {title} <span className="sister-row-en" lang="en">/ {en}</span>
      </h2>
      <nav className="sister-row-links" aria-label={`${title} ${en}`}>
        {links.map((site) => (
          <a key={site.href} href={site.href} className="chip" target="_blank" rel="noopener noreferrer">
            {site.name} <span lang="en">{site.en}</span>
          </a>
        ))}
      </nav>
    </section>
  );
}
