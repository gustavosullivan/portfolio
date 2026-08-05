"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const AboutGalaxyCanvas = dynamic(
  () =>
    import("@/components/three/AboutGalaxyCanvas").then(
      (m) => m.AboutGalaxyCanvas,
    ),
  { ssr: false },
);

/**
 * Continuous nebula field from After-Hero through Contato.
 * Sticky viewport window into a tall animated world (not a frozen photo).
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
      { rootMargin: "120px 0px", threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={root} className="relative bg-black">
      <div
        className={cn(
          "pointer-events-none relative sticky top-0 z-0 h-[100svh] w-full overflow-hidden transition-opacity duration-700 ease-in-out [contain:paint]",
          active ? "opacity-100" : "opacity-0",
        )}
        aria-hidden
      >
        {mounted ? (
          <AboutGalaxyCanvas active={active} bandRef={root} />
        ) : null}
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-24 bg-gradient-to-b from-black via-black/50 to-transparent md:h-32" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-28 bg-gradient-to-t from-black via-black/55 to-transparent md:h-40" />

      <div className="relative z-10 -mt-[100svh]">{children}</div>
    </div>
  );
}
