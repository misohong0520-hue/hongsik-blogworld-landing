import { MessageCircle } from "lucide-react";
import styles from "./floating-consultation.module.css";

export function FloatingConsultation() {
  return (
    <a className={styles.floating} href="#contact" title="이메일 문의 안내로 이동">
      <MessageCircle size={27} strokeWidth={1.7} aria-hidden="true" />
      <span>사용 상담</span>
    </a>
  );
}
