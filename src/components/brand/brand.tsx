import Image from "next/image";
import { site } from "@/lib/site";
import styles from "./brand.module.css";
export function Brand({ className = "" }: { className?: string }) {
  return <a className={`${styles.brand} ${className}`} href="#home" aria-label={`${site.name} 홈`}><Image src="/brand/icon.png" width={24} height={24} alt="" /><span>{site.name}</span></a>;
}
