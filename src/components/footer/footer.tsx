import { Mail } from "lucide-react";
import { Brand } from "@/components/brand/brand";
import { site } from "@/lib/site";
import styles from "./footer.module.css";

const columns = [
  { title: "서비스 안내", links: [["앱 소개", "#home"], ["이용 대상", "#audience"], ["사용 과정", "#process"]] },
  { title: "주요 기능", links: [["글감·키워드 분석", "#feature-dashboard"], ["AI 글쓰기", "#feature-writing"], ["카드뉴스·숏폼", "#feature-visual"], ["발행·리포스트", "#feature-publishing"], ["자동 실행·색인", "#feature-automation"]] },
] as const;

export function Footer() {
  return (
    <footer id="footer" className={styles.footer}>
      <div className="landing-container">
        <div className={styles.grid}>
          <div className={styles.brandColumn}>
            <Brand />
            <p className={styles.tagline}>키워드부터 블로그 발행까지.</p>
            <a className={styles.emailLink} href={site.supportHref}>
              <span className={styles.emailIcon}><Mail size={24} strokeWidth={1.8} aria-hidden="true" /></span>
              <span className={styles.emailText}><span>이메일 문의</span><span className={styles.emailAddress}>{site.supportEmail}</span></span>
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
        </div>
      </div>
    </footer>
  );
}
