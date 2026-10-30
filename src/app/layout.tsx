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
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${noto.variable} ${inter.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
