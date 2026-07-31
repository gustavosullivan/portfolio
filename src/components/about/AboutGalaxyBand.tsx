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
 * Blue sky + clouds from Perfil through Contato (ends cleanly before WorldStage).
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
      { rootMargin: "220px 0px", threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={root} className="relative bg-[#3a8fd4]">
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-0 overflow-hidden transition-opacity duration-[1200ms] ease-in-out",
          active ? "opacity-100" : "opacity-0",
        )}
        aria-hidden
        style={{
          // Full sky through contact; only soft edge at the very top (from hero)
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 4%, black 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 4%, black 100%)",
        }}
      >
        {mounted ? <AboutGalaxyCanvas /> : null}
      </div>

      {/* From hero hyperspace */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-24 bg-gradient-to-b from-black via-black/45 to-transparent md:h-32" />

      <div className="relative z-10">{children}</div>

      {/* Thin seam after Contact → anime continues as-is */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-16 bg-gradient-to-b from-transparent to-black/80" />
    </div>
  );
}
