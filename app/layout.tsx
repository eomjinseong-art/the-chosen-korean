import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GOOGLE_SITE_VERIFICATION, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: { type: "website", locale: "ko_KR", siteName: SITE_NAME, images: ["/og.png"] },
  twitter: { card: "summary_large_image" },
  verification: { google: GOOGLE_SITE_VERIFICATION },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f7f3ea",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <a href="#main" className="skip">
          본문 바로가기
        </a>
        <Header />
        <main id="main" className="wrap">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
