import Image from "next/image";
import styles from "./support-section.module.css";

const steps = [
  { icon: "86fbc.svg", title: "자료 준비", body: <>참고할 원문 URL을 준비하고,<br />글에 활용할 내용을 확인하세요.</> },
  { icon: "caa0b.svg", title: "원고 작성", body: "준비한 자료와 설정을 바탕으로 AI 원고를 작성하세요." },
  { icon: "21eee.svg", title: "검토·발행", body: "제목·본문·이미지를 확인한 뒤 발행 단계로 이어가세요." },
];

export function SupportSection() {
  return (
    <section className={styles.section} aria-labelledby="support-heading" id="audience">
      <div className={`landing-container ${styles.layout}`}>
        <div className={styles.intro}>
          <h2 id="support-heading">반복되는 블로그 작업,<br />한 흐름으로 이어집니다</h2>
          <p className={styles.description}>자료 준비와 AI 글 작성·발행을 반복하는 개인 블로그 운영자와 소규모 사업자를 위해. 쓸 주제부터 참고 자료와 원고까지 한 흐름으로 연결합니다.</p>
          <div className={styles.summaries}>
            {[["자료 준비", "원문 기준"], ["원고 검토", "발행 전 확인"]].map(([title, caption]) => (
              <div className={styles.summary} key={title}>
                <div className={styles.checks} aria-hidden="true">
                  {Array.from({ length: 5 }, (_, i) => <Image key={i} src="/figma/aff4e.svg" alt="" width={26} height={26} />)}
                </div>
                <p className={styles.summaryTitle}>{title}</p>
                <p className={styles.caption}>{caption}</p>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.steps}>
          {steps.map((step, index) => (
            <article key={step.title} className={`${styles.step} ${index === 0 ? styles.first : ""}`}>
              <div className={styles.icon}><Image src={`/figma/${step.icon}`} width={30} height={30} alt="" /></div>
              <div className={styles.stepContent}><h3>{step.title}</h3><p>{step.body}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
