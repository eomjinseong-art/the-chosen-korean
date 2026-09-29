const WIKI_DJ = "https://en.wikipedia.org/wiki/Dallas_Jenkins";
const WIKI = "https://en.wikipedia.org/wiki/The_Chosen_(TV_series)";

export const DALLAS = {
  nameKo: "댈러스 젠킨스",
  nameEn: "Dallas Jenkins",
  role: "더 초즌 창작자 · 감독 · 공동 작가 · 총괄 프로듀서",
  facts: [
    { label: "출생", value: "1975년 7월 25일, 미국 일리노이주 세인트찰스" },
    { label: "학교", value: "노스웨스턴 세인트폴 대학교(1997년 졸업)" },
    { label: "가족", value: "아버지는 ‘레프트 비하인드’ 시리즈를 쓴 기독교 소설가 제리 B. 젠킨스. 아내 어맨다와 1998년 결혼, 자녀 넷" },
    { label: "신앙", value: "복음주의 기독교인" },
  ],
  bio: [
    "할리우드에서 일을 시작했을 때는 ‘기독교 영화’ 감독으로 불리는 걸 원하지 않았다고 합니다. 2006~2007년쯤 잔디를 깎다가 신앙 영화를 만들라는 부름을 느꼈고, 기독교 영화가 재미없다면 잘 만드는 게 자기 일이라고 생각을 바꿨습니다.",
    "스물다섯 살에 어머니와 제작사 젠킨스 엔터테인먼트를 차려 첫 작품 〈Hometown Legend〉(2000)를 워너브라더스 배급으로 내놓았습니다. 이후 〈Midnight Clear〉(2006), 〈What If...〉(2010)를 감독했습니다.",
    "2012년부터는 시카고의 하비스트 바이블 채플에서 버티컬 처치 필름을 이끌며 신앙 영화를 만들었습니다. 2017년 블룸하우스·WWE 필름과 함께 만든 〈개빈 스톤의 부활〉은 흥행에 실패했고, 그는 이를 ‘경력 최대의 실패’라고 불렀습니다.",
    "그 직후 교회를 위해 찍은 단편 〈The Shepherd〉가 더 초즌의 파일럿이 됐습니다. 사람들이 드라마를 몰아 보듯 예수 이야기를 몰아 볼 수 있게 만들고 싶었다는 게 출발점이고, 예수를 ‘직접 만난 사람들의 눈으로’ 보여 주는 방식을 택했습니다.",
    "2024년에는 라이온스게이트와 킹덤 스토리 컴퍼니가 만든 장편 〈The Best Christmas Pageant Ever〉를 감독해, 제작비 1천만 달러로 4천만 달러를 벌었습니다.",
  ],
  works: [
    { year: "2000", title: "Hometown Legend", role: "제작" },
    { year: "2006", title: "Midnight Clear", role: "감독(장편 데뷔)" },
    { year: "2010", title: "What If...", role: "감독" },
    { year: "2017", title: "The Resurrection of Gavin Stone(개빈 스톤의 부활)", role: "감독" },
    { year: "2017", title: "The Shepherd", role: "감독·각본(더 초즌 파일럿)" },
    { year: "2019~", title: "The Chosen(더 초즌)", role: "창작·감독·공동 작가" },
    { year: "2024", title: "The Best Christmas Pageant Ever", role: "감독" },
  ],
  sources: [WIKI_DJ, WIKI],
};

export const TEAM = [
  { name: "데럴 이브스 (Derral Eves)", role: "공동 창업자 · 총괄 프로듀서", text: "영상 마케팅 전문가로, 젠킨스와 함께 더 초즌을 만들고 소유합니다. 소셜 미디어로 시청자층을 키우는 일을 주로 맡았습니다.", source: WIKI_DJ },
  { name: "라이언 스완슨 (Ryan Swanson)", role: "공동 작가", text: "젠킨스와 함께 대본을 씁니다. 영향받은 작품으로 〈더 와이어〉, 〈왕좌의 게임〉, 〈배틀스타 갈락티카〉, 〈스타트렉〉을 꼽았습니다.", source: WIKI },
  { name: "타일러 톰슨 (Tyler Thompson)", role: "공동 작가", text: "라이언 스완슨과 함께 공동 작가로 참여합니다.", source: WIKI },
  { name: "대본 자문 3인", role: "세 교파의 자문", text: "메시아닉 유대교 랍비 제이슨 소벨, 가톨릭 사제 데이비드 거피 신부, 바이올라 대학교 신약학 교수 더그 허프먼이 대본을 검토합니다. 젠킨스는 복음서 내용과 어긋나지 않는 선에서 인물의 뒷이야기를 더한다고 밝혔습니다.", source: WIKI },
];

export const COMPANIES = [
  { name: "VidAngel → Angel Studios", text: "처음 파일럿을 알아보고 크라우드펀딩 모델을 함께 만든 곳입니다. 2024년에는 계약 분쟁으로 시즌 4 스트리밍 공개가 몇 달 늦어지기도 했습니다.", source: WIKI },
  { name: "Come and See 재단", text: "2022년 10월 만들어진 비영리 재단으로, 후원금 관리와 번역·해외 보급을 맡습니다.", source: WIKI },
  { name: "라이온스게이트", text: "2023년 5월부터 전 세계 배급을 맡고 있습니다.", source: WIKI },
  { name: "아마존 MGM 스튜디오", text: "2025년 시즌 5 극장 배급을 맡았고, 프라임 비디오에서 먼저 공개했습니다.", source: WIKI },
  { name: "5&2 스튜디오", text: "젠킨스가 성경 이야기를 더 만들려고 세운 스튜디오입니다.", source: WIKI },
];
