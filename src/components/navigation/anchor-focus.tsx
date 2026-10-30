"use client";

import { useEffect } from "react";

export function AnchorFocus() {
  useEffect(() => {
    let frame = 0;
    let restoreFocusTarget = () => {};

    const resolveHash = (hash: string) => {
      let id: string;
      try {
        id = decodeURIComponent(hash.slice(1));
      } catch {
        return null;
      }
      const target = id ? document.getElementById(id) : null;
      if (!target) return null;
      const headingOwner = target.closest("[data-journey-card]") ?? target;
      const heading = target.matches("main") ? target : headingOwner.querySelector<HTMLElement>("h1, h2, h3");
      return { id, target, focusTarget: heading ?? target };
    };

    const focusHash = (hash: string) => {
      const resolved = resolveHash(hash);
      if (!resolved) return;
      const { focusTarget } = resolved;
      restoreFocusTarget();
      const originalTabIndex = focusTarget.getAttribute("tabindex");
      if (originalTabIndex === null) focusTarget.setAttribute("tabindex", "-1");
      const restore = () => {
        if (originalTabIndex === null) focusTarget.removeAttribute("tabindex");
        focusTarget.removeEventListener("blur", restore);
      };
      restoreFocusTarget = restore;
      focusTarget.addEventListener("blur", restore, { once: true });
      focusTarget.focus({ preventScroll: true });
    };

    const cancelMovement = () => {
      window.cancelAnimationFrame(frame);
      frame = 0;
    };

    const moveToHash = (hash: string) => {
      const resolved = resolveHash(hash);
      if (!resolved) return;
      cancelMovement();
      const { id, target, focusTarget } = resolved;
      const origin = window.scrollY;
      // Align the content rather than the section's decorative top padding.
      const scrollTarget = target.matches("section") ? focusTarget : target;
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const journeyNavigation = target.closest("#features")?.querySelector<HTMLElement>("[data-journey-nav]");
      const offset = journeyNavigation && window.innerWidth <= 900 ? journeyNavigation.getBoundingClientRect().height + 20 : 32;
      const destination = id === "home" ? 0 : Math.max(0, Math.min(maxScroll, scrollTarget.getBoundingClientRect().top + origin - offset));
      const distance = destination - origin;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const scroll = (top: number) => window.scrollTo({ top, behavior: "instant" });

      if (reducedMotion || target.matches("main") || Math.abs(distance) < 1) {
        scroll(destination);
        focusHash(hash);
        return;
      }

      const duration = Math.min(900, Math.max(400, Math.abs(distance) * 0.12 + 300));
      let startedAt: number | undefined;
      const step = (time: number) => {
        startedAt ??= time;
        const progress = Math.min(1, (time - startedAt) / duration);
        const eased = progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
        // Explicit instant positioning avoids combining CSS smooth with this animation.
        scroll(origin + distance * eased);
        if (progress < 1) frame = window.requestAnimationFrame(step);
        else {
          frame = 0;
          focusHash(hash);
        }
      };
      frame = window.requestAnimationFrame(step);
    };

    const onHashChange = () => {
      cancelMovement();
      // Direct hashes and browser history keep their native scroll restoration.
      focusHash(window.location.hash || "#home");
    };
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href^='#']") : null;
      const hash = link?.getAttribute("href");
      if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self") || !hash || hash === "#") return;
      if (!resolveHash(hash)) return;
      event.preventDefault();
      if (hash !== window.location.hash) window.history.pushState(window.history.state, "", hash);
      moveToHash(hash);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " ", "Tab", "Escape"].includes(event.key)) cancelMovement();
    };

    if (window.location.hash) focusHash(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("popstate", cancelMovement);
    window.addEventListener("resize", cancelMovement);
    window.addEventListener("wheel", cancelMovement, { passive: true });
    window.addEventListener("touchstart", cancelMovement, { passive: true });
    window.addEventListener("pointerdown", cancelMovement, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onClick);
    return () => {
      cancelMovement();
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("popstate", cancelMovement);
      window.removeEventListener("resize", cancelMovement);
      window.removeEventListener("wheel", cancelMovement);
      window.removeEventListener("touchstart", cancelMovement);
      window.removeEventListener("pointerdown", cancelMovement);
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onClick);
      restoreFocusTarget();
    };
  }, []);

  return null;
}
