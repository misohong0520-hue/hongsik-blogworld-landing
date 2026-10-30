import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/lib/site";
import styles from "./contact.module.css";

export function ContactSection() {
  return (
    <section id="contact" className={styles.section} aria-labelledby="contact-title">
      <div className={`landing-container ${styles.grid}`}>
        <div className={styles.copy}>
          <h2 id="contact-title">사용 전에<br />확인해 주세요</h2>
          <p className={styles.description}>
            사용 목적과 궁금한 점을 이메일로 알려주세요.<br />
            <a href={site.supportHref}>{site.supportEmail}</a><br />
            오른쪽 버튼은 메일 앱으로 연결됩니다.
          </p>
          <Image className={styles.quote} src="/figma/b515e.svg" width={45} height={38} alt="" />
          <p className={styles.usageLabel}>사용 안내</p>
        </div>
        <div className={styles.card} aria-labelledby="email-title">
          <Image className={styles.brandMark} src="/brand/icon.png" width={72} height={86} alt="" />
          <h3 id="email-title">이메일 문의</h3>
          <div className={`${styles.field} ${styles.firstField}`}>
            <p className={styles.label}>방식</p>
            <p className={styles.surface}>메일 앱으로 연결</p>
          </div>
          <div className={styles.field}>
            <p className={styles.label}>안내</p>
            <p className={`${styles.surface} ${styles.messageSurface}`}>메일에서 작성해요</p>
          </div>
          <a className={`${buttonVariants()} ${styles.emailAction}`} href={site.supportHref}>메일 앱 열기</a>
          <p className={styles.note}>자동 발송 폼 아님</p>
        </div>
      </div>
    </section>
  );
}
