"use client";

import { useEffect } from "react";

/**
 * Keep ScrollTrigger in sync with native scroll — throttled (no Lenis).
 * GSAP is loaded lazily so it stays off the first-paint critical path.
 */
export function useLenis(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    let onScroll: (() => void) | undefined;
    let timeoutId: number | undefined;
    let ctxCleanup: (() => void) | undefined;

    const boot = async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      let scheduled = false;
      onScroll = () => {
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(() => {
          scheduled = false;
          ScrollTrigger.update();
        });
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      timeoutId = window.setTimeout(() => ScrollTrigger.refresh(), 120);
      ctxCleanup = () => {
        if (onScroll) {
          window.removeEventListener("scroll", onScroll);
        }
        if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      };
    };

    // Prefer idle so hero/text win the network
    const ric = window.requestIdleCallback;
    let idleId: number | undefined;
    let fallbackId: ReturnType<typeof setTimeout> | undefined;

    if (typeof ric === "function") {
      idleId = ric(() => {
        void boot();
      }, { timeout: 1500 });
    } else {
      fallbackId = setTimeout(() => {
        void boot();
      }, 500);
    }

    return () => {
      cancelled = true;
      if (idleId !== undefined && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
      if (fallbackId !== undefined) clearTimeout(fallbackId);
      ctxCleanup?.();
    };
  }, [enabled]);
}
