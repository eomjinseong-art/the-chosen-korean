# 더 초즌(The Chosen) 한국어 가이드

비공식 팬 가이드 사이트 (Next.js App Router, 정적 생성).

- **콘텐츠 원본은 `content/the-chosen-guide.md` 한 파일뿐입니다.** 빌드할 때 `lib/guide.ts`가 이 파일을 파싱해 홈, 입문, 시즌 5개, 에피소드 40개, 인물 사전, 성경 구절, 검색, sitemap을 만듭니다. 내용을 고치려면 이 md 파일만 수정해 push하면 됩니다.
- md 구조(제목 형식 `### S1E1 · English (한글)`, `- **줄거리:**`, `- **성경/창작:**`, `- **등장인물**` 표, `- 💡 **이해 포인트:**`, 8장 구절 표)는 유지해 주세요.
- 인물 이름 통합(시몬 = 베드로 등)은 `lib/characters.ts`의 작은 별칭 표로 합니다.
- 방문자 카운터: Abacus namespace `the-chosen-korean` / key `visits`. Vercel Web Analytics 사용.

```
npm install
npm run build
```
