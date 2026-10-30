import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import styles from "./hero-section.module.css";
export function HeroSection() {
  return <section className={styles.section} aria-labelledby="hero-title"><div className={`landing-container ${styles.layout}`}><div className={styles.copy}>
    <h1 id="hero-title"><span>글감 고민은 줄이고,</span><span>콘텐츠는 더 다양하게.</span></h1>
    <svg className={styles.underline} viewBox="0 0 240 14" width="240" height="14" aria-hidden="true"><path d="M2 11 Q120 -6 238 11" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>
    <p className={styles.description}><span>오늘 쓸 주제를 찾고, 분석한 자리에서 제작을 시작하세요.</span><span>블로그 글부터 카드뉴스·숏폼, 발행과 리포스트까지.</span><span>HongSik BlogWorld가 콘텐츠 운영의 반복 작업을 연결합니다.</span></p>
    <div className={styles.actions}><a className={`${buttonVariants({ size: "lg" })} landing-cta ${styles.primary}`} href="#features"><span>주요 기능 살펴보기</span><ArrowDown className="size-4" aria-hidden="true" /></a></div>
  </div><div className={styles.art}><Image src="/images/hero-product.png" width={1600} height={1600} alt="HongSik BlogWorld의 키워드 분석 화면과 AI 글쓰기·발행 기능을 담은 노트북 이미지" priority sizes="(max-width: 900px) 110vw, 771px" /></div></div></section>;
}
