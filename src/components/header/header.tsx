import { Brand } from "@/components/brand/brand";
import { HeaderNavigation } from "./header-navigation";
import styles from "./header.module.css";
export function Header() {
  return <header className={styles.header}><div className={`landing-container ${styles.row}`}><Brand /><HeaderNavigation /></div></header>;
}
