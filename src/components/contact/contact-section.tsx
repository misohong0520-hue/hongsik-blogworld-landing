import Image from "next/image";
import { Mail } from "lucide-react";
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
            문의 카드의 버튼을 누르면 메일 앱이 열립니다.
          </p>
          <Image className={styles.quote} src="/figma/b515e.svg" width={45} height={38} alt="" />
          <p className={styles.usageLabel}>사용 안내</p>
        </div>
        <div className={styles.card} aria-labelledby="email-title">
          <span className={styles.mailIcon}><Mail size={29} strokeWidth={1.7} aria-hidden="true" /></span>
          <h3 id="email-title">이메일 문의</h3>
          <dl className={styles.recipient}>
            <dt>받는 주소</dt>
            <dd>{site.supportEmail}</dd>
          </dl>
          <p id="email-help" className={styles.help}>
            아래 버튼을 누르면 기본 메일 앱에서<br />새 메일을 작성할 수 있어요.
          </p>
          <a className={`${buttonVariants()} ${styles.emailAction}`} href={site.supportHref} aria-describedby="email-help"><Mail size={19} aria-hidden="true" />이메일 보내기</a>
          <p className={styles.note}>메일 앱이 열리지 않으면 위 주소를 복사해 문의해 주세요.</p>
        </div>
      </div>
    </section>
  );
}
