import Link from "next/link";
import { VisitorCounter } from "./VisitorCounter";
import { getGuide } from "@/lib/guide";
import { Md } from "./Md";

export function Footer() {
  const g = getGuide();
  return (
    <footer className="site-footer">
      <div className="wrap">
        <nav className="foot-nav">
          <Link href="/">홈</Link>
          <Link href="/intro">입문</Link>
          {g.seasons.map((s) => (
            <Link key={s.season} href={s.path}>
              시즌 {s.season}
            </Link>
          ))}
          <Link href="/characters">인물 사전</Link>
          <Link href="/verses">성경 구절</Link>
          <Link href="/search">검색</Link>
        </nav>
        <div className="disclaimer">
          <p>
            <strong>비공식 팬 가이드</strong>입니다. 드라마 &lsquo;더 초즌(The Chosen)&rsquo;, 5&amp;2 Studios, Angel Studios 및
            관련 권리자와 아무런 관계가 없으며, 공식 사진·포스터·로고·영상 스틸을 사용하지 않습니다.
          </p>
          <p>
            영어 성경 구절은 공개 영역(Public Domain)인 KJV(King James Version)입니다. 한글 번역은 이 사이트가 직접 옮긴 쉬운
            번역으로, 교회의 공식 번역과 표현이 다를 수 있습니다.
          </p>
          {g.limitation ? (
            <p>
              ⚠️ <Md text={g.limitation} />
            </p>
          ) : null}
        </div>
        <div className="foot-meta">
          <span>© 더 초즌 한국어 가이드 (팬 제작)</span>
          <VisitorCounter />
        </div>
      </div>
    </footer>
  );
}
