import Image from "next/image";
import styles from "./workflow-section.module.css";
export function WorkflowSection() {
  return <section className={styles.section} aria-labelledby="workflow-title"><div className="landing-container"><h2 id="workflow-title">쓸 주제부터 블로그 발행까지</h2><ul className={styles.marks}>{["키워드", "자료", "원고", "검토", "발행"].map(label => <li key={label}><Image src="/brand/icon.png" width={36} height={36} alt="" /><span>{label}</span></li>)}</ul></div></section>;
}
