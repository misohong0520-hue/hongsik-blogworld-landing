import { Brand } from "@/components/brand/brand";
import { buttonVariants } from "@/components/ui/button";
import styles from "./header.module.css";
const navigation = [["홈", "#home"], ["기능", "#features"], ["안내", "#guide"], ["과정", "#process"], ["문의", "#contact"]] as const;
export function Header() {
  return <header className={styles.header}><div className={`landing-container ${styles.row}`}><Brand /><nav className={styles.navigation} aria-label="상단 메뉴">{navigation.map(([label, href], i) => <a key={href} href={href} className={i === 0 ? styles.current : undefined}>{label}</a>)}</nav><div className={styles.actions}><a className={styles.guide} href="#guide">안내</a><a className={`${buttonVariants()} landing-cta ${styles.contact}`} href="#contact">문의</a></div></div></header>;
}
