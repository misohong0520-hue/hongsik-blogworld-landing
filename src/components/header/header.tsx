import { Brand } from "@/components/brand/brand";
import { buttonVariants } from "@/components/ui/button";
import { HeaderNavigation } from "./header-navigation";
import styles from "./header.module.css";
export function Header() {
  return <header className={styles.header}><div className={`landing-container ${styles.row}`}><Brand /><HeaderNavigation /><div className={styles.actions}><a className={styles.guide} href="#guide">안내</a><a className={`${buttonVariants()} landing-cta ${styles.contact}`} href="#contact">문의</a></div></div></header>;
}
