"use client";

import { useEffect, useState } from "react";
import styles from "./header.module.css";

const navigation = [
  ["홈", "home"],
  ["기능", "features"],
  ["이용 안내", "guide"],
  ["사용 과정", "process"],
  ["문의", "contact"],
] as const;

type Section = (typeof navigation)[number][1];

export function HeaderNavigation() {
  const [current, setCurrent] = useState<Section>("home");

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let section: Section = "home";
      const boundary = Math.min(120, window.innerHeight / 4);
      // #home wraps the entire page, so track the later section boundaries.
      for (const [, id] of navigation.slice(1)) {
        const target = document.getElementById(id);
        if (target && target.getBoundingClientRect().top <= boundary) section = id;
      }
      // A compact footer contact target may never reach the upper boundary.
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      if (atBottom) {
        const contact = document.getElementById("contact")?.getBoundingClientRect();
        if (contact && contact.top < window.innerHeight && contact.bottom > 0) section = "contact";
      }
      setCurrent(section);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", schedule);
    window.addEventListener("load", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", schedule);
      window.removeEventListener("load", schedule);
    };
  }, []);

  return (
    <nav className={styles.navigation} aria-label="상단 메뉴">
      {navigation.map(([label, id]) => (
        <a key={id} href={`#${id}`} className={[current === id && styles.current, id === "contact" && styles.contact].filter(Boolean).join(" ") || undefined} aria-current={current === id ? "location" : undefined}>
          {label}
        </a>
      ))}
    </nav>
  );
}
