import Image from "next/image";
import styles from "./benefits-section.module.css";

const benefits = ["운영할 블로그에 맞는 키워드를 정해요", "원문 URL 준비", "참고 자료에서 필요한 내용을 확인해요", "자료를 바탕으로 AI 원고를 작성해요", "검토하고 발행해요"];

export function BenefitsSection() {
  return (
    <section className={styles.section} id="guide" aria-labelledby="benefits-heading">
      <div className={`landing-container ${styles.layout}`}>
        <div className={styles.copy}>
          <h2 id="benefits-heading">어떤 과정을<br />도와주나요?</h2>
          <ul className={styles.list}>
            {benefits.map((benefit) => <li key={benefit}><Image src="/figma/a37da.svg" alt="" width={32} height={32} /><span>{benefit}</span></li>)}
          </ul>
        </div>
        <div className={styles.visual}>
          <Image className={styles.photo} src="/figma/benefit-desk.png" alt="노트북과 카메라가 놓인 블로그 작업 공간" width={450} height={529} />
          <div className={styles.flowCard}>
            <Image className={styles.brand} src="/brand/icon.png" alt="" width={58} height={58} />
            <div className={styles.flowText}><p>사용 흐름 안내</p><span>원고 검토 후 발행</span></div>
            <Image className={styles.chat} src="/figma/f9c98.svg" width={40} height={40} alt="" />
          </div>
          <div className={styles.draftCard}><span>작업 예시</span><p>원고</p><Image src="/figma/5abf6.svg" width={20} height={20} alt="" /></div>
          <div className={styles.photoIcon}><Image src="/figma/3504f.svg" width={20} height={20} alt="" /></div>
          <div className={styles.checkCard}><Image src="/figma/55850.svg" width={24} height={24} alt="" /><p>발행 전 내용을 확인해요</p></div>
        </div>
      </div>
    </section>
  );
}
