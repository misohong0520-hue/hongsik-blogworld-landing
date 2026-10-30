import Image from "next/image";
import { Brand } from "@/components/brand/brand";
import { site } from "@/lib/site";
import styles from "./footer.module.css";

const columns = [
  { title: "안내", links: [["사용 대상", "#audience"], ["사용 과정", "#process"], ["문의", "#contact"], ["이메일 문의", site.supportHref]] },
  { title: "블로그 운영 안내", links: [["사용 문의", "#contact"], ["사용 전 확인", "#contact"], ["Windows 앱", "#home"], ["개인·소규모 운영", "#audience"]] },
  { title: "기능", links: [["자료", "#features"], ["원고 검토", "#guide"], ["AI 글 작성", "#features"], ["블로그 발행", "#process"]] },
] as const;

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="landing-container">
        <div className={styles.grid}>
          <div className={styles.brandColumn}>
            <Brand />
            <p className={styles.tagline}>키워드부터 블로그 발행까지.</p>
            <a className={styles.emailLink} href={site.supportHref}>
              <span>이메일 문의</span>
              <span className={styles.arrow} aria-hidden="true">
                <Image src="/figma/51020.svg" width={46} height={46} alt="" />
                <Image src="/figma/224e8.svg" width={24} height={24} alt="" />
              </span>
            </a>
          </div>
          <nav aria-label="하단 메뉴" className={styles.columns}>
            {columns.map((column) => (
              <div key={column.title} className={styles.column}>
                <h2>{column.title}</h2>
                <ul>{column.links.map(([label, href]) => <li key={label}><a href={href}>{label}</a></li>)}</ul>
              </div>
            ))}
          </nav>
        </div>
        <div className={styles.bottom}>
          <p>© HongSik BlogWorld · blogworld.hongsik.blog</p>
          <div className={styles.smallLinks}>
            <a href="#home">Windows 앱</a>
            <Image className={styles.dot} src="/figma/844d2.svg" width={4} height={4} alt="" />
            <a href={site.supportHref}>이메일 문의</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
