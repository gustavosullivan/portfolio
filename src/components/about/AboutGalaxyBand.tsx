"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";

const AboutGalaxyCanvas = dynamic(
  () =>
    import("@/components/three/AboutGalaxyCanvas").then(
      (m) => m.AboutGalaxyCanvas,
    ),
  { ssr: false },
);

/**
 * Continuous nebula from After-Hero through Contato.
 * Sticky viewport window — no transform on this node (breaks sticky).
 */
export function AboutGalaxyBand({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        const on = entry.isIntersecting;
        setActive(on);
        if (on) setMounted(true);
      },
      { rootMargin: "80px 0px", threshold: 0 },
    );
    io.observe(el);

    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const prefetch = () => setMounted(true);
    const ric = window.requestIdleCallback;
    if (typeof ric === "function") {
      idleId = ric(prefetch, { timeout: 1200 });
    } else {
      timeoutId = setTimeout(prefetch, 400);
    }

    return () => {
      io.disconnect();
      if (idleId !== undefined && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div ref={root} className="relative bg-[#070712]">
      <div
        className="pointer-events-none sticky top-0 z-0 h-screen w-full overflow-hidden bg-[#070712]"
        aria-hidden
      >
        {mounted ? (
          <AboutGalaxyCanvas active={active} bandRef={root} />
        ) : null}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="relative z-10 -mt-[100vh] [text-shadow:0_1px_2px_rgba(0,0,0,0.95),0_0_14px_rgba(0,0,0,0.75)]">
        {children}
      </div>
    </div>
  );
}
