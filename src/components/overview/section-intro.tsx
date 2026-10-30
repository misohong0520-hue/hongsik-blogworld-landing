import styles from "./section-intro.module.css";

type SectionIntroProps = {
  id: string;
  label: string;
  title: string;
  emphasis: string;
  description?: string;
  closing?: string;
  compact?: boolean;
};

/** Shared editorial hierarchy; section layouts and interactions remain independent. */
export function SectionIntro({ id, label, title, emphasis, description, closing, compact = false }: SectionIntroProps) {
  return <div className={`${styles.intro}${compact ? ` ${styles.compact}` : ""}`}>
    <p className={styles.label}>{label}</p>
    <h2 id={id} className={styles.title}><span>{title}</span><span className={styles.emphasis}>{emphasis}</span></h2>
    {description && <p className={styles.description}>{description}</p>}
    {closing && <p className={styles.closing}>{closing}</p>}
  </div>;
}
