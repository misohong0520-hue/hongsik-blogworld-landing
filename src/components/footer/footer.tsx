import Image from "next/image";
import { Brand } from "@/components/brand/brand";
import { site } from "@/lib/site";
import styles from "./footer.module.css";

const columns = [
  { title: "서비스 안내", links: [["앱 소개", "#home"], ["이용 대상", "#audience"], ["사용 과정", "#process"]] },
  { title: "주요 기능", links: [["자료 준비", "#feature-sources"], ["AI 원고 작성", "#feature-writing"], ["검토·발행", "#feature-publishing"]] },
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
        </div>
      </div>
    </footer>
  );
}
