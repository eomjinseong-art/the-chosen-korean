# 더 초즌(The Chosen) 한국어 가이드

비공식 팬 가이드 사이트 (Next.js App Router, 정적 생성).

- **콘텐츠 원본은 `content/the-chosen-guide.md` 한 파일뿐입니다.** 빌드할 때 `lib/guide.ts`가 이 파일을 파싱해 홈, 입문, 시즌 5개, 에피소드 40개, 인물 사전, 성경 구절, 검색, sitemap을 만듭니다. 내용을 고치려면 이 md 파일만 수정해 push하면 됩니다.
- md 구조(제목 형식 `### S1E1 · English (한글)`, `- **줄거리:**`, `- **성경/창작:**`, `- **등장인물**` 표, `- 💡 **이해 포인트:**`, 8장 구절 표)는 유지해 주세요.
- 인물 이름 통합(시몬 = 베드로 등)은 `lib/characters.ts`의 작은 별칭 표로 합니다.
- **같이 보면 좋은 콘텐츠(/together)**: `content/together.json`의 `works` 배열에 항목 하나를 추가하면 목록(`/together`), 작품 페이지(`/together/<slug>`), sitemap, 검색, 홈 카드가 자동으로 생깁니다. 필드 설명은 `lib/together.ts`의 `Work` 타입을 보세요. 필수: `slug`, `titleKo`, `titleEn`, `year`, `kind`, `tagline`, `info`, `plot`, `source.real/adapted`, `people`, `points`, `chosen`, `sources`, `checked`. 선택: `runtime`, `rating`, `watch`, `source.middle`+`sourceLabels`(세 칸 구분, 예: 성경/외경/영화 창작), `sourceHeading`(세 칸 박스 제목), `medium`(페이지 문구의 매체 이름, 기본 "영화", 시리즈는 "드라마"), `related`(관련 페이지 링크 `{label, href, text}`), `verses`(영어 KJV + 직접 옮긴 한글), `verseNote`, `factsIntro`, `facts`(항목마다 `film`·`evidence`·`debate`·`study`, 문장 앞 `[합의]`/`[논쟁]`/`[믿음]` 표시). 포스터·스틸 이미지와 영화 대사 인용은 넣지 않습니다.
- **사랑받는 찬송가 100(/hymns)**: `content/hymns.json`의 `hymns` 배열(100곡)이 목록(`/hymns`, 주제 필터·검색), 곡 페이지(`/hymns/<새찬송가 장 번호>`), sitemap, 사이트 검색, 홈 카드에 쓰입니다. 필드는 `lib/hymns.ts`의 `Hymn` 타입 참고. 필수: `n`(새찬송가 2006 장), `title`(첫 줄=제목), `origin`, `text`(작사), `music`(작곡), `story`(직접 쓴 2~4문장), `refs`(장·절만), `tags`. 선택: `tong`(통일찬송가 장), `en`(원제), `tune`(곡조명), `note`(불확실한 점), `lyricsEn`(공개 영역 영어 원문만, 절 단위. Hymnary.org 본문 페이지·CCEL·Wikisource 등 출처 본문과 한 단어씩 대조한 것만 넣고, 출처는 `lyricsSource`에 적습니다. 대조할 수 없으면 넣지 않습니다), `hymnary`(Hymnary.org 곡 페이지 직접 링크; 없으면 검색 링크). **한국어 가사는 첫 줄(제목) 외에는 넣지 않습니다**(한국찬송가공회 저작물). 순위·설문 수치는 만들지 않습니다. 듣기는 유튜브 검색 링크로만 연결합니다.
- 방문자 카운터: Abacus namespace `the-chosen-korean` / key `visits`. Vercel Web Analytics 사용.

```
npm install
npm run build
```
