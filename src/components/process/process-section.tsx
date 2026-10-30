import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import styles from "./process.module.css";

const steps = [
  {
    title: "준비",
    number: "1",
    description: ["쓸 주제를 정하고", "참고할 자료를 준비하세요"],
    tasks: ["키워드", "원문", "참고 자료 검토", "글감 선택", "작성할 주제 확인"],
    action: "준비 과정",
    href: "#guide",
  },
  {
    title: "글",
    number: "2",
    description: ["준비한 자료를 바탕으로", "AI 원고를 작성하세요"],
    tasks: ["AI 글", "초안", "제목·본문 작성", "자료 내용 확인", "원고 검토"],
    action: "작성 과정",
    href: "#features",
    featured: true,
  },
  {
    title: "발행",
    number: "3",
    description: ["완성한 원고를 검토하고", "블로그 발행으로 이어가세요"],
    tasks: ["제목·본문 검토", "이미지 배치 확인", "발행 계정 확인", "등록 방식 선택", "실행 결과 확인"],
    action: "발행 과정",
    href: "#contact",
  },
] as const;

export function ProcessSection() {
  return (
    <section id="process" className={styles.section} aria-labelledby="process-title">
      <div className={`landing-container ${styles.container}`}>
        <h2 id="process-title" className={styles.title}>
          내 블로그 작업,<br />이 순서로 진행하세요
        </h2>
        <p className={styles.intro}>준비·작성·발행, 각 단계에서 할 일을 확인하세요.</p>
        <div className={styles.segment} aria-label="사용 과정과 문의">
          <a href="#process">사용 과정</a>
          <a href="#contact" className={styles.segmentAccent}>문의하기</a>
        </div>
        <div className={styles.cards}>
          {steps.map((step) => (
            <article key={step.number} className={`${styles.card} ${"featured" in step ? styles.featured : ""}`}>
              {"featured" in step && (
                <Image src="/figma/22562.svg" alt="" width={600} height={600} className={styles.cardGlow} />
              )}
              <div className={styles.cardHeader}>
                <h3>{step.title}</h3>
                <p className={styles.description}>{step.description[0]}<br />{step.description[1]}</p>
                <p className={styles.number} aria-label={`${step.number}단계`}>{step.number}</p>
                {"featured" in step && <p className={styles.status}>검토 후 진행</p>}
              </div>
              <div className={styles.cardBody}>
                <ul className={styles.taskList}>
                  {step.tasks.map((task, index) => (
                    <li key={task}>
                      <Image src={index === 0 ? "/figma/26240.svg" : "/figma/cef68.svg"} width={26} height={26} alt="" />
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
                <a href={step.href} className={`${buttonVariants({ variant: "ghost" })} ${styles.cardAction}`}>{step.action}</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
