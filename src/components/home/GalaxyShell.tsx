"use client";

import dynamic from "next/dynamic";
import { useDeferredMount } from "@/hooks/useDeferredMount";
import type { ReactNode } from "react";

const HeroCanvas = dynamic(
  () =>
    import("@/components/three/HeroCanvas").then((m) => m.HeroCanvas),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-[#03050c]" />,
  },
);

/**
 * Hyperspace / stars behind the hero only (no sticky — more reliable).
 */
export function GalaxyShell({ children }: { children: ReactNode }) {
  const ready = useDeferredMount({ timeoutMs: 400 });

  return (
    <div className="relative min-h-[100svh] overflow-hidden bg-[#03050c]">
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden
      >
        {ready ? (
          <HeroCanvas />
        ) : (
          <div className="absolute inset-0 bg-[#03050c]" />
        )}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(3,5,12,0.55)_100%)]" />
        {/* Fade longo pro mid — evita quebra preto → azul */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#03050c] via-[#03050c]/85 to-transparent md:h-64" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#041018] to-transparent md:h-32" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
