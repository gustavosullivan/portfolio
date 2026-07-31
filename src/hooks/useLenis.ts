"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Native scroll only — Lenis was freezing the WebGL scene
 * when dragging the scrollbar with the mouse.
 */
export function useLenis(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    // Keep ScrollTrigger in sync with native scroll (no smooth hijack)
    const onScroll = () => ScrollTrigger.update();
    window.addEventListener("scroll", onScroll, { passive: true });
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [enabled]);
}
