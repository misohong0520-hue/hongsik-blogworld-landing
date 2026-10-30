import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import styles from "./features-section.module.css";

const features = [
  { id: "feature-sources", image: "feature-sources.png", title: "자료 준비", description: "키워드를 정하고, 원문 URL에서 글에 활용할 자료를 준비하세요." },
  { id: "feature-writing", image: "feature-writing.png", title: "AI 원고 작성", description: "준비한 자료와 설정을 활용해 AI 원고를 작성하고 검토하세요." },
  { id: "feature-publishing", image: "feature-publishing.png", title: "검토·발행", description: "제목·본문·이미지를 확인하고 블로그 발행 단계로 이어가세요." },
];

export function FeaturesSection() {
  return (
    <section className={styles.section} id="features" aria-labelledby="features-heading">
      <div className="landing-container">
        <div className={styles.header}>
          <h2 id="features-heading">블로그 운영,<br />이렇게 연결</h2>
          <p className={styles.intro}>키워드와 참고 자료를 정리하고, AI 원고를 작성한 뒤 내용을 검토하세요. 블로그 운영에 필요한 과정을 이어갑니다.</p>
          <a href="#contact" className={`${buttonVariants({ size: "lg" })} landing-cta ${styles.cta}`}>사용 문의</a>
        </div>
        <div className={styles.cards}>
          {features.map((feature) => (
            <article id={feature.id} aria-labelledby={`${feature.id}-heading`} className={styles.card} key={feature.id}>
              <Image className={styles.illustration} src={`/figma/${feature.image}`} width={364} height={430} alt="" />
              <h3 id={`${feature.id}-heading`}>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
