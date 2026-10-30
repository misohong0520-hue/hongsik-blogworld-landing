"use client";

import { useEffect } from "react";

type Player = {
  video: HTMLVideoElement;
  warmed: boolean;
  userPaused: boolean;
  blocked: boolean;
  internalPauses: number;
  request: number;
  pendingRequest: number | null;
  manualIntentUntil: number;
};

/** One native player at a time. Observes scrolling without moving the page. */
export function FeatureVideoMotion() {
  useEffect(() => {
    const videos = [...document.querySelectorAll<HTMLVideoElement>("#features video[data-feature-video]")];
    if (!videos.length) return;
    const players: Player[] = videos.map((video) => ({ video, warmed: false, userPaused: false, blocked: false, internalPauses: 0, request: 0, pendingRequest: null, manualIntentUntil: 0 }));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let active: Player | null = null;
    let selected: Player | null = null;
    let timer: number | undefined;
    let frame = 0;
    let disposed = false;

    const cancelSwitch = () => {
      if (timer !== undefined) window.clearTimeout(timer);
      timer = undefined;
    };
    const pause = (player: Player) => {
      player.request++;
      if (!player.video.paused) {
        player.internalPauses++;
        player.video.pause();
      }
    };
    const pauseOthers = (except: Player | null) => players.forEach((player) => { if (player !== except) pause(player); });
    const warm = (player: Player) => {
      if (player.warmed || disposed) return;
      player.warmed = true;
      player.video.preload = "metadata";
      // Do not reset a video that the visitor has already started manually.
      if (player.video.paused && player.video.readyState === 0) player.video.load();
    };
    const playAutomatically = (player: Player) => {
      if (disposed || selected !== player || document.hidden || reduced.matches || player.userPaused || player.blocked) return;
      warm(player);
      pauseOthers(player);
      active = player;
      player.video.muted = true;
      const request = ++player.request;
      player.pendingRequest = request;
      player.video.dataset.autoplayState = "starting";
      const failed = () => {
        if (!disposed && player.request === request && active === player) {
          player.blocked = true;
          player.video.dataset.autoplayState = "blocked";
        }
      };
      try {
        Promise.resolve(player.video.play()).then(() => {
          // An earlier play request can finish after a fast scroll or unmount.
          if (disposed || active !== player || player.userPaused) pause(player);
          else if (player.request === request) player.video.dataset.autoplayState = "playing";
        }, failed).finally(() => {
          if (player.pendingRequest === request) player.pendingRequest = null;
        });
      } catch {
        failed();
        player.pendingRequest = null;
      }
    };
    const visibleHeight = (rect: DOMRect) => Math.max(0, Math.min(window.innerHeight, rect.bottom) - Math.max(0, rect.top));
    const update = () => {
      frame = 0;
      if (disposed) return;
      const rects = players.map((player) => player.video.getBoundingClientRect());
      players.forEach((player, index) => {
        if (visibleHeight(rects[index]) === 0) {
          player.userPaused = false;
          player.blocked = false;
        }
      });
      if (document.hidden) {
        cancelSwitch();
        selected = active = null;
        pauseOthers(null);
        return;
      }
      if (reduced.matches) {
        cancelSwitch();
        selected = null;
        // In reduced motion mode native controls still allow manual playback.
        if (active && visibleHeight(rects[players.indexOf(active)]) === 0) {
          pause(active);
          active = null;
        }
        return;
      }
      const middle = window.innerHeight / 2;
      let next: Player | null = null;
      let distance = Infinity;
      players.forEach((player, index) => {
        const rect = rects[index];
        if (rect.height <= 0 || rect.top > middle || rect.bottom < middle) return;
        if (visibleHeight(rect) < Math.min(rect.height, window.innerHeight) * .5) return;
        const candidateDistance = Math.abs((rect.top + rect.bottom) / 2 - middle);
        if (candidateDistance < distance) { next = player; distance = candidateDistance; }
      });
      // Keep the current scene running while it is still meaningfully visible.
      if (!next && active) {
        const rect = rects[players.indexOf(active)];
        if (visibleHeight(rect) >= Math.min(rect.height, window.innerHeight) * .2) next = active;
      }
      const fullscreen = players.find((player) => document.fullscreenElement?.contains(player.video));
      if (fullscreen) next = fullscreen;
      if (next === selected) return;
      cancelSwitch();
      selected = next;
      pauseOthers(next);
      if (active !== next) active = null;
      if (next && !next.userPaused && !next.blocked && next.video.paused) {
        const candidate = next;
        timer = window.setTimeout(() => { timer = undefined; playAutomatically(candidate); }, 180);
      }
    };
    const schedule = () => { if (!disposed && !frame) frame = window.requestAnimationFrame(update); };
    const reset = () => {
      cancelSwitch();
      selected = active = null;
      pauseOthers(null);
      schedule();
    };
    const detach: Array<() => void> = [];
    players.forEach((player) => {
      const { video } = player;
      video.muted = video.defaultMuted = true;
      const intent = () => { player.manualIntentUntil = Date.now() + 1200; };
      const onPlay = () => {
        if (video.paused) return;
        const manual = Date.now() <= player.manualIntentUntil;
        if (disposed || document.hidden || (player.pendingRequest !== null && active !== player && !manual)) {
          pause(player);
          return;
        }
        player.userPaused = false;
        player.blocked = false;
        active = selected = player;
        cancelSwitch();
        pauseOthers(player);
      };
      const onPause = () => {
        if (player.internalPauses) { player.internalPauses--; return; }
        player.userPaused = true;
        player.request++;
      };
      video.addEventListener("play", onPlay);
      video.addEventListener("pause", onPause);
      video.addEventListener("pointerdown", intent);
      video.addEventListener("keydown", intent);
      detach.push(() => {
        video.removeEventListener("play", onPlay);
        video.removeEventListener("pause", onPause);
        video.removeEventListener("pointerdown", intent);
        video.removeEventListener("keydown", intent);
      });
    });
    const nearObserver = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver((entries) => {
      if (disposed) return;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const player = players.find((item) => item.video === entry.target);
          if (player) warm(player);
        }
      });
    }, { rootMargin: "600px 0px" });
    videos.forEach((video) => nearObserver?.observe(video));
    const sizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    videos.forEach((video) => sizeObserver?.observe(video));
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("pageshow", schedule);
    document.addEventListener("visibilitychange", reset);
    document.addEventListener("fullscreenchange", schedule);
    reduced.addEventListener("change", reset);
    document.fonts?.ready.then(schedule);
    update();
    return () => {
      disposed = true;
      cancelSwitch();
      window.cancelAnimationFrame(frame);
      nearObserver?.disconnect();
      sizeObserver?.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pageshow", schedule);
      document.removeEventListener("visibilitychange", reset);
      document.removeEventListener("fullscreenchange", schedule);
      reduced.removeEventListener("change", reset);
      pauseOthers(null);
      detach.forEach((remove) => remove());
      active = selected = null;
    };
  }, []);
  return null;
}
