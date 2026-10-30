import type { Metadata } from "next";
import { Inter, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";

const noto = Noto_Sans_KR({ weight: ["400", "500", "700"], subsets: ["latin"], display: "swap", variable: "--font-noto-kr" });
const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.name,
  description: site.description,
  other: { "third-party-notices": "/third-party-notices.txt" },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: site.url,
    siteName: site.name,
    title: site.name,
    description: site.description,
    images: [{
      url: "/images/hero-product.png",
      width: 1600,
      height: 1600,
      alt: "HongSik BlogWorld의 키워드 분석·AI 글쓰기·발행을 소개하는 제품 이미지",
    }],
  },
  twitter: {
    card: "summary",
    title: site.name,
    description: site.description,
    images: [{ url: "/images/hero-product.png", alt: "HongSik BlogWorld 제품 이미지" }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${noto.variable} ${inter.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
