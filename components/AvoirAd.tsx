const HREF = "https://avoir24.com/?utm_source=the-chosen-korean&utm_medium=referral&utm_campaign=site-ad";

/** 부드러운 자사 광고 카드: 아브아르(AVOIR) 여성의류 */
export function AvoirAd({ place = "default" }: { place?: string }) {
  return (
    <aside className="avoir-ad" aria-label="광고">
      <span className="ad-label">광고</span>
      <a href={`${HREF}&utm_content=${place}`} target="_blank" rel="noopener sponsored" className="avoir-link">
        <strong className="avoir-brand">아브아르 AVOIR</strong>
        <span className="avoir-text">예배 가는 날에도, 평범한 하루에도 단정하게. 여성의류 쇼핑몰 아브아르 둘러보기 →</span>
      </a>
    </aside>
  );
}
