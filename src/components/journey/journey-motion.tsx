"use client";

import { useEffect } from "react";
import { journeyProgress } from "./journey-progress";

/** Progressive enhancement: the full content remains readable before hydration. */
export function JourneyMotion() {
  useEffect(() => {
    const section = document.getElementById("features");
    if (!section) return;
    const cards = [...section.querySelectorAll<HTMLElement>("[data-journey-card]")];
    const segments = [...section.querySelectorAll<SVGPathElement>("[data-curve-segment]")];
    const nodes = [...section.querySelectorAll<SVGGElement>("[data-curve-node]")];
    const links = [...section.querySelectorAll<HTMLAnchorElement>("[data-journey-link]")];
    const counter = section.querySelector<HTMLElement>("[data-journey-counter]");
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let disposed = false;
    let previousActive = -1;
    let previousReduced: boolean | undefined;

    const update = () => {
      frame = 0;
      if (disposed) return;
      // Read all layout before painting. Card spacing and image sizing may change.
      const progress = journeyProgress(cards.map((card) => card.getBoundingClientRect().top), window.innerHeight * .55);
      const active = Math.min(cards.length - 1, Math.floor(progress + .00001));
      const reduced = media.matches;
      segments.forEach((segment, index) => {
        const portion = reduced ? 1 : Math.max(0, Math.min(1, progress - index));
        segment.style.strokeDashoffset = String(1 - portion);
      });
      if (active !== previousActive || reduced !== previousReduced) {
        cards.forEach((card, index) => {
          card.dataset.reached = String(reduced || index <= active);
          card.dataset.current = String(index === active);
        });
        nodes.forEach((node, index) => { node.dataset.reached = String(reduced || index <= active); });
        links.forEach((link, index) => {
          link.dataset.reached = String(reduced || index <= active);
          if (index === active) link.setAttribute("aria-current", "step");
          else link.removeAttribute("aria-current");
        });
        if (counter) counter.textContent = String(active + 1).padStart(2, "0");
        previousActive = active;
        previousReduced = reduced;
      }
    };
    const schedule = () => {
      if (!disposed && !frame) frame = window.requestAnimationFrame(update);
    };
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    cards.forEach((card) => observer?.observe(card));
    section.dataset.journeyReady = "true";
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("pageshow", schedule);
    window.addEventListener("hashchange", schedule);
    window.addEventListener("load", schedule);
    media.addEventListener("change", schedule);
    document.fonts?.ready.then(schedule);
    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pageshow", schedule);
      window.removeEventListener("hashchange", schedule);
      window.removeEventListener("load", schedule);
      media.removeEventListener("change", schedule);
      delete section.dataset.journeyReady;
    };
  }, []);
  return null;
}
