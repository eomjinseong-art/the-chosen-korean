import type { Art } from "@/lib/art";

export function CharacterArt({ art, name }: { art: Art; name: string }) {
  return (
    <figure className="char-art">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={art.src} width={art.w} height={art.h} alt={`${name}을(를) 그린 명화: ${art.artist}의 〈${art.title}〉`} loading="eager" />
      <figcaption>
        {art.artist}, 〈{art.title}〉({art.year}) · 이미지 출처:{" "}
        <a href={art.source} target="_blank" rel="noopener noreferrer">
          Wikimedia Commons
        </a>{" "}
        · {art.license}
        <span className="char-art-note">드라마 장면이 아닌, 같은 성경 인물을 그린 옛 명화입니다.</span>
      </figcaption>
    </figure>
  );
}
