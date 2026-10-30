"use client";

import { useEffect } from "react";

export function AnchorFocus() {
  useEffect(() => {
    let frame = 0;
    let restoreFocusTarget = () => {};

    const focusHash = (hash: string) => {
      let id: string;
      try {
        id = decodeURIComponent(hash.slice(1));
      } catch {
        return;
      }
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      const heading = target.matches("main") ? target : target.querySelector<HTMLElement>("h1, h2");
      const focusTarget = heading ?? target;
      restoreFocusTarget();
      const originalTabIndex = focusTarget.getAttribute("tabindex");
      if (originalTabIndex === null) focusTarget.setAttribute("tabindex", "-1");
      const restore = () => {
        if (originalTabIndex === null) focusTarget.removeAttribute("tabindex");
        focusTarget.removeEventListener("blur", restore);
      };
      restoreFocusTarget = restore;
      focusTarget.addEventListener("blur", restore, { once: true });
      // Keep native anchor scrolling and history; only move keyboard focus.
      focusTarget.focus({ preventScroll: true });
    };

    const onHashChange = () => {
      window.cancelAnimationFrame(frame);
      focusHash(window.location.hash || "#home");
    };
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href^='#']") : null;
      const hash = link?.getAttribute("href");
      if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self") || !hash || hash === "#") return;
      // Clicking the current hash does not emit hashchange, including Enter on a link.
      if (hash === window.location.hash) {
        window.cancelAnimationFrame(frame);
        frame = window.requestAnimationFrame(() => focusHash(hash));
      }
    };

    if (window.location.hash) focusHash(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    document.addEventListener("click", onClick);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", onHashChange);
      document.removeEventListener("click", onClick);
      restoreFocusTarget();
    };
  }, []);

  return null;
}
