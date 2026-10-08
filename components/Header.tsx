import Link from "next/link";

const NAV = [
  { href: "/intro", label: "입문" },
  { href: "/s1", label: "시즌" },
  { href: "/characters", label: "인물" },
  { href: "/verses", label: "성경 구절" },
  { href: "/bible-books", label: "성경 66권" },
  { href: "/family-tree", label: "가족관계도" },
  { href: "/daily", label: "오늘의 말씀" },
  { href: "/scenes", label: "명장면" },
  { href: "/creators", label: "제작진" },
  { href: "/map", label: "지도" },
  { href: "/together", label: "같이 보기" },
  { href: "/hymns", label: "찬송가" },
];

export function Header() {
  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <Link href="/" className="brand">
          <span className="brand-mark">✦</span> 더 초즌 <span className="brand-sub">한국어 가이드</span>
        </Link>
        <form action="/search" className="header-search" role="search">
          <input name="q" type="search" placeholder="검색" aria-label="사이트 검색" />
        </form>
      </div>
      <nav className="wrap main-nav" aria-label="주요 메뉴">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href}>
            {n.label}
          </Link>
        ))}
        <span className="nav-seasons">
          {[1, 2, 3, 4, 5].map((s) => (
            <Link key={s} href={`/s${s}`} className="chip">
              S{s}
            </Link>
          ))}
        </span>
      </nav>
    </header>
  );
}
