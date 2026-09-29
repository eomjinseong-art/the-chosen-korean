const WIKI = "https://en.wikipedia.org/wiki/The_Chosen_(TV_series)";

export type Place = { slug: string; kind: "set" | "bible"; name: string; en: string; lat: number; lng: number; text: string; episodes?: string[]; source?: string };

export const PLACES: Place[] = [
  // 촬영지
  { slug: "poolville", kind: "set", name: "텍사스 풀빌·웨더퍼드", en: "Poolville & Weatherford, Texas", lat: 32.9687, lng: -97.8473, text: "시즌 1 촬영지입니다. 관광객 체험과 촬영 대여를 함께 하던 ‘가버나움 마을(Capernaum Village)’ 세트를 빌려 60일 동안 찍었습니다.", source: WIKI },
  { slug: "utah-jerusalem", kind: "set", name: "유타 예루살렘 세트", en: "LDS Motion Picture Studios South Campus, Utah", lat: 39.9522, lng: -111.9021, text: "예수 그리스도 후기 성도 교회가 지은 고대 예루살렘 재현 세트입니다. 시즌 2에서 처음 썼고, 시즌 5·6에서도 유타(고셴 등)에서 촬영했습니다.", source: WIKI },
  { slug: "midlothian", kind: "set", name: "텍사스 미들로디언 스튜디오", en: "Midlothian, Texas", lat: 32.4824, lng: -96.9945, text: "시즌 3부터 쓰는 전용 촬영장입니다. 중동과 지형·날씨가 비슷해 골랐고, 구세군 캠프 호블리첼 부지에 2천만 달러 규모로 지었습니다. 가버나움 재현 세트가 있습니다.", source: WIKI },
  { slug: "matera", kind: "set", name: "이탈리아 마테라", en: "Matera, Italy", lat: 40.6664, lng: 16.6043, text: "시즌 6의 십자가 장면을 찍은 곳입니다.", source: WIKI },
  // 성경 속 장소
  { slug: "capernaum", kind: "bible", name: "가버나움", en: "Capernaum", lat: 32.8803, lng: 35.5733, text: "갈릴리 호숫가 어촌. 시몬·안드레의 집과 마태의 세관이 있는, 드라마의 중심 무대입니다.", episodes: ["S1E1", "S1E4", "S3E2"] },
  { slug: "magdala", kind: "bible", name: "막달라", en: "Magdala", lat: 32.825, lng: 35.516, text: "막달라 마리아의 고향으로 알려진 호숫가 마을입니다.", episodes: ["S1E1"] },
  { slug: "sea-of-galilee", kind: "bible", name: "갈릴리 호수", en: "Sea of Galilee", lat: 32.82, lng: 35.59, text: "그물이 찢어질 만큼 고기가 잡히고, 예수가 물 위를 걸어온 호수입니다.", episodes: ["S1E4", "S3E8"] },
  { slug: "nazareth", kind: "bible", name: "나사렛", en: "Nazareth", lat: 32.7019, lng: 35.2971, text: "예수가 자란 고향. 회당에서 이사야서를 읽었다가 쫓겨납니다.", episodes: ["S3E3"] },
  { slug: "cana", kind: "bible", name: "가나", en: "Cana", lat: 32.747, lng: 35.339, text: "혼인 잔치에서 물이 포도주로 바뀐 곳입니다.", episodes: ["S1E5"] },
  { slug: "bethsaida", kind: "bible", name: "벳새다", en: "Bethsaida", lat: 32.91, lng: 35.63, text: "빌립의 고향. 빌립이 나다나엘을 예수에게 데려갑니다.", episodes: ["S2E2"] },
  { slug: "sychar", kind: "bible", name: "수가(사마리아)", en: "Sychar, Samaria", lat: 32.209, lng: 35.285, text: "야곱의 우물에서 예수가 사마리아 여인에게 자신이 메시아라고 밝힌 곳입니다.", episodes: ["S1E8", "S2E1"] },
  { slug: "decapolis", kind: "bible", name: "데가볼리(아빌라)", en: "Decapolis (Abila)", lat: 32.681, lng: 35.869, text: "이방인 도시들이 모인 지역. 아빌라에서 귀먹고 말 못 하는 사람이 고쳐집니다.", episodes: ["S3E7"] },
  { slug: "caesarea-philippi", kind: "bible", name: "가이사랴 빌립보", en: "Caesarea Philippi", lat: 33.248, lng: 35.694, text: "이방 신전 앞에서 시몬이 ‘당신은 그리스도’라고 고백하고 베드로라는 이름을 받습니다.", episodes: ["S4E2"] },
  { slug: "jerusalem", kind: "bible", name: "예루살렘", en: "Jerusalem", lat: 31.778, lng: 35.2354, text: "베데스다 연못, 성전, 다락방, 겟세마네가 있는 도시. 시즌 5의 무대입니다.", episodes: ["S2E4", "S4E6", "S5E1", "S5E8"] },
  { slug: "bethany", kind: "bible", name: "베다니", en: "Bethany", lat: 31.771, lng: 35.261, text: "마르다·마리아·나사로 남매의 마을. 나사로가 무덤에서 살아납니다.", episodes: ["S4E5", "S4E7", "S4E8"] },
];
