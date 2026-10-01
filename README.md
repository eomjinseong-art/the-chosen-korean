# 더 초즌(The Chosen) 한국어 가이드

비공식 팬 가이드 사이트 (Next.js App Router, 정적 생성).

- **콘텐츠 원본은 `content/the-chosen-guide.md` 한 파일뿐입니다.** 빌드할 때 `lib/guide.ts`가 이 파일을 파싱해 홈, 입문, 시즌 5개, 에피소드 40개, 인물 사전, 성경 구절, 검색, sitemap을 만듭니다. 내용을 고치려면 이 md 파일만 수정해 push하면 됩니다.
- md 구조(제목 형식 `### S1E1 · English (한글)`, `- **줄거리:**`, `- **성경/창작:**`, `- **등장인물**` 표, `- 💡 **이해 포인트:**`, 8장 구절 표)는 유지해 주세요.
- 인물 이름 통합(시몬 = 베드로 등)은 `lib/characters.ts`의 작은 별칭 표로 합니다.
- **같이 보면 좋은 콘텐츠(/together)**: `content/together.json`의 `works` 배열에 항목 하나를 추가하면 목록(`/together`), 작품 페이지(`/together/<slug>`), sitemap, 검색, 홈 카드가 자동으로 생깁니다. 필드 설명은 `lib/together.ts`의 `Work` 타입을 보세요. 필수: `slug`, `titleKo`, `titleEn`, `year`, `kind`, `tagline`, `info`, `plot`, `source.real/adapted`, `people`, `points`, `chosen`, `sources`, `checked`. 선택: `runtime`, `rating`, `watch`, `source.middle`+`sourceLabels`(세 칸 구분, 예: 성경/외경/영화 창작), `verses`(영어 KJV + 직접 옮긴 한글), `verseNote`, `factsIntro`, `facts`(항목마다 `film`·`evidence`·`debate`·`study`, 문장 앞 `[합의]`/`[논쟁]`/`[믿음]` 표시). 포스터·스틸 이미지와 영화 대사 인용은 넣지 않습니다.
- 방문자 카운터: Abacus namespace `the-chosen-korean` / key `visits`. Vercel Web Analytics 사용.

```
npm install
npm run build
```
