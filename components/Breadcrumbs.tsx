import Link from "next/link";
import { JsonLd } from "./JsonLd";
import { breadcrumbLd } from "@/lib/seo";

export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  return (
    <>
      <nav className="crumbs" aria-label="현재 위치">
        <Link href="/">홈</Link>
        {items.map((c, i) => (
          <span key={c.path}>
            <span aria-hidden> › </span>
            {i === items.length - 1 ? <span aria-current="page">{c.name}</span> : <Link href={c.path}>{c.name}</Link>}
          </span>
        ))}
      </nav>
      <JsonLd data={breadcrumbLd(items)} />
    </>
  );
}
