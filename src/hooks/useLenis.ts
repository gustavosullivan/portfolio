"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Keep ScrollTrigger in sync with native scroll — throttled (no Lenis).
 */
export function useLenis(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    let scheduled = false;
    const onScroll = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        ScrollTrigger.update();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // refresh once after layout settles
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);

    return () => {
      window.clearTimeout(id);
      window.removeEventListener("scroll", onScroll);
    };
  }, [enabled]);
}
