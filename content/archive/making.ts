const WIKI = "https://en.wikipedia.org/wiki/The_Chosen_(TV_series)";

export type TimelineItem = { when: string; title: string; text: string; source: string };
export type RecordItem = { label: string; value: string; note: string; source: string };

export const TIMELINE: TimelineItem[] = [
  { when: "2017년", title: "실패한 영화 뒤에 찍은 단편 하나", text: "댈러스 젠킨스 감독은 장편 〈개빈 스톤의 부활〉이 흥행에 실패한 뒤, 다니던 교회의 크리스마스이브 예배에서 틀 단편 〈The Shepherd(목자)〉를 일리노이주 마렝고의 친구 농장에서 찍었습니다. 목자의 눈으로 본 예수 탄생 이야기입니다.", source: WIKI },
  { when: "2017~2018년", title: "페이스북에 올린 파일럿", text: "신앙 영상 플랫폼 VidAngel(훗날 Angel Studios)이 이 단편을 시리즈 파일럿으로 페이스북에 올려 보자고 제안했고, 전 세계에서 1,500만 회가 넘게 재생됐습니다.", source: WIKI },
  { when: "시즌 1 제작 전", title: "역대 1위 크라우드펀딩", text: "미국 JOBS법 조항을 활용해 후원자가 제작 지분을 받는 방식으로 1차 모금을 진행했고, 1만 6천 명 넘는 투자자에게서 1,100만 달러를 모았습니다. 크라우드펀딩으로 제작된 TV 시리즈 가운데 최고 기록입니다.", source: WIKI },
  { when: "2019년", title: "시즌 1 공개", text: "시즌 1은 텍사스 풀빌·웨더퍼드 일대에서 60일 동안 촬영해 VidAngel 유료 서비스로 먼저 공개됐습니다. 처음엔 반응이 더뎠습니다.", source: WIKI },
  { when: "2020년 3~4월", title: "코로나 시기 무료 공개", text: "팬데믹 초기에 제작진이 앱에서 시즌 1을 무료로 풀자 시청자가 급격히 늘었습니다. 이때부터 ‘앞사람이 낸 후원으로 다음 사람이 무료로 본다’는 방식이 자리 잡았습니다.", source: WIKI },
  { when: "2020년 10~11월", title: "유타 예루살렘 세트에서 시즌 2 촬영", text: "시즌 2는 유타 카운티에 있는 예수 그리스도 후기 성도 교회의 예루살렘 재현 세트에서 찍었습니다. 이 교회와 관계없는 작품이 그 세트를 쓴 건 처음이었습니다. 산상수훈 장면에는 엑스트라 2,000명이 참여했습니다.", source: WIKI },
  { when: "2021년 12월", title: "첫 극장 개봉, 크리스마스 특별편", text: "크리스마스 특별편 〈The Messengers〉가 1,700개 극장에서 개봉해 100만 장이 팔리고 1,350만 달러를 벌었습니다.", source: WIKI },
  { when: "2022년 4월", title: "오병이어 장면, 엑스트라 1만 2천 명", text: "텍사스 미들로디언의 새 촬영장에서 오천 명을 먹이신 장면을 나흘 동안 찍었습니다. 36개국에서 온 약 1만 2천 명이 대부분 자기 비용과 직접 만든 의상으로 참여했습니다.", source: WIKI },
  { when: "2022년 10월", title: "Come and See 재단 설립", text: "제작비 모금과 번역·해외 보급을 맡는 비영리 재단이 만들어졌습니다. 목표는 100개 언어 더빙, 600개 언어 자막입니다.", source: WIKI },
  { when: "2022년 11월", title: "시즌 3, 극장에서 먼저", text: "시즌 3 첫 두 화가 극장에서 먼저 개봉해 개봉 주말 877만 달러를 기록했습니다.", source: WIKI },
  { when: "2023년 5~7월", title: "라이온스게이트 배급, 파업 중 촬영 허가", text: "라이온스게이트가 전 세계 배급권을 얻었고, 6월에는 미국 CW 방송이 첫 세 시즌을 샀습니다. 7월 할리우드 배우 파업 때 촬영이 멈추자 팬들이 기도 운동을 벌였고, 이틀 만에 예외 승인을 받아 촬영을 이어갔습니다.", source: WIKI },
  { when: "2024년 2~6월", title: "시즌 4와 Angel Studios 분쟁", text: "시즌 4 전편이 2월 극장에서 먼저 공개됐지만, Angel Studios와의 계약 분쟁으로 스트리밍이 미뤄졌습니다. 중재가 끝난 뒤 6월 2일부터 앱에서 공개됐습니다.", source: WIKI },
  { when: "2025년 3~6월", title: "시즌 5 〈최후의 만찬〉, 아마존과 손잡다", text: "아마존 MGM 스튜디오가 시즌 5를 〈The Chosen: Last Supper〉라는 이름으로 극장 배급했습니다. 개봉 주말 1,149만 달러를 벌었고, 6월 15일 프라임 비디오에서 공개됐습니다.", source: WIKI },
  { when: "2025년 10월", title: "애니메이션 스핀오프", text: "젠킨스가 세운 5&2 스튜디오의 첫 작품 〈The Chosen Adventures〉가 10월 17일 프라임 비디오에서 공개됐습니다. 예수 역의 조너선 루미가 목소리를 맡았습니다.", source: WIKI },
  { when: "2025~2026년", title: "시즌 6·7 촬영", text: "시즌 6은 2025년 4월부터 9월까지 유타 고셴 등에서 찍었고, 십자가 장면은 이탈리아 마테라에서 촬영했습니다. 마지막 시즌 7은 2026년 4월 27일 촬영을 시작해 9월에 마쳤습니다.", source: WIKI },
  { when: "앞으로", title: "시즌 6 공개와 완결", text: "시즌 6은 2026년 11월 15일 공개 예정이고, 시즌 피날레는 2027년 3월 12일 극장에서 개봉합니다. 시즌 7은 2028년 공개 예정으로, 모두 7시즌으로 완결됩니다.", source: WIKI },
];

export const RECORDS: RecordItem[] = [
  { label: "1차 크라우드펀딩", value: "1,100만 달러", note: "1만 6천 명 넘는 투자자. 크라우드펀딩 TV 시리즈 역대 1위", source: WIKI },
  { label: "누적 시청자", value: "약 2억 8천만 명", note: "2025년 제작진 추정. 이 중 3분의 1은 종교가 없는 사람", source: WIKI },
  { label: "극장 누적 수입", value: "1억 2천만 달러 이상", note: "시즌 5 3부 개봉까지 전체 극장 상영 기준", source: WIKI },
  { label: "더빙 언어", value: "약 50개", note: "2024년 1월 기준. 목표는 100개 언어 더빙", source: WIKI },
  { label: "가장 많은 엑스트라", value: "약 1만 2천 명", note: "시즌 3 오병이어 장면, 36개국 참가", source: WIKI },
  { label: "크리스마스 특별편", value: "1,350만 달러", note: "2021년 〈The Messengers〉, 티켓 100만 장", source: WIKI },
  { label: "시즌 5 극장 1부", value: "약 2,020만 달러", note: "미국 내 수입. 개봉 당시 Fathom 이벤트 배급작 최고 기록", source: WIKI },
  { label: "전체 분량", value: "7시즌", note: "시즌당 8화 안팎, 2028년 완결 예정", source: WIKI },
];
