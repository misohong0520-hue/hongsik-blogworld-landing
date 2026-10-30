import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import styles from "./hero-section.module.css";
export function HeroSection() {
  return <section className={styles.section} aria-labelledby="hero-title"><div className={`landing-container ${styles.layout}`}><div className={styles.copy}>
    <h1 id="hero-title">키워드부터<br />글 발행까지<br />하나로 연결</h1>
    <div className={styles.underline} aria-hidden="true"><Image src="/figma/3cbb8.svg" width={487.002} height={34.001} alt="" priority /></div>
    <p className={styles.description}>오늘 쓸 글감을 찾고, 분석한 자리에서 제작을 시작하세요. AI 글쓰기부터 카드뉴스·숏폼, 발행과 리포스트까지. HongSik BlogWorld로 반복하는 콘텐츠 작업을 연결하세요.</p>
    <div className={styles.actions}><a className={`${buttonVariants({ size: "lg" })} landing-cta ${styles.inquiry}`} href="#contact">사용 문의</a><a className={styles.process} href="#process"><Image src="/figma/da4ba.svg" width={40} height={40} alt="" /><span>과정 보기</span></a></div>
  </div><div className={styles.art}><Image src="/images/hero-product.png" width={1600} height={1600} alt="HongSik BlogWorld의 키워드 분석 화면과 AI 글쓰기·발행 기능을 담은 노트북 이미지" priority sizes="(max-width: 900px) 110vw, 771px" /></div></div></section>;
}
