import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PlaceMap } from "@/components/PlaceMap";
import { AvoirAd } from "@/components/AvoirAd";
import { pageMeta } from "@/lib/seo";
import { getGuide } from "@/lib/guide";
import { PLACES } from "@/content/archive/locations";

export const metadata = pageMeta({
  title: "더 초즌 촬영지와 성경 속 장소 지도",
  description: "더 초즌(The Chosen)을 찍은 텍사스·유타·이탈리아 촬영지와, 드라마에 나오는 가버나움·가나·사마리아·예루살렘·베다니 같은 성경 속 장소를 한 지도에 모았습니다.",
  path: "/map",
});

function Section({ kind, title }: { kind: "set" | "bible"; title: string }) {
  const eps = new Map(getGuide().episodes.map((e) => [e.code, e]));
  return (
    <>
      <h2>{title}</h2>
      <ul className="place-list">
        {PLACES.filter((p) => p.kind === kind).map((p) => (
          <li key={p.slug} id={p.slug} className="place">
            <strong>{p.name}</strong> <span className="muted">{p.en}</span>
            <p>{p.text}</p>
            {p.episodes?.length ? (
              <p className="place-eps">
                {p.episodes.map((c) => {
                  const e = eps.get(c);
                  return e ? (
                    <Link key={c} href={e.path} className="chip">
                      시즌{e.season} {e.ep}화
                    </Link>
                  ) : null;
                })}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </>
  );
}

export default function MapPage() {
  return (
    <article>
      <Breadcrumbs items={[{ name: "지도", path: "/map" }]} />
      <h1>🗺️ 촬영지와 성경 속 장소</h1>
      <p className="muted">
        <span className="dot dot-set" /> 실제 촬영지 · <span className="dot dot-bible" /> 드라마 속 성경 장소. 점을 누르면 설명이 열립니다.
      </p>
      <PlaceMap places={PLACES} />
      <Section kind="set" title="🎥 실제 촬영지" />
      <AvoirAd place="map" />
      <Section kind="bible" title="📍 드라마 속 성경 장소" />
      <p className="muted small">
        촬영지 출처: 위키백과 영어판 〈<a href="https://en.wikipedia.org/wiki/The_Chosen_(TV_series)" target="_blank" rel="noopener noreferrer">The Chosen (TV series)</a>〉. 좌표는 도시·유적 기준의 대략적인 위치입니다. 지도 © OpenStreetMap.
      </p>
    </article>
  );
}
