import Link from "next/link";

export default function NotFound() {
  return (
    <article className="prose-page">
      <h1>페이지를 찾을 수 없어요</h1>
      <p>
        주소가 바뀌었거나 없는 페이지입니다. <Link href="/">홈</Link>이나 <Link href="/search">검색</Link>을 이용해 주세요.
      </p>
    </article>
  );
}
