"use client";

import dynamic from "next/dynamic";
import { useDeferredMount } from "@/hooks/useDeferredMount";
import type { ReactNode } from "react";

const HeroCanvas = dynamic(
  () =>
    import("@/components/three/HeroCanvas").then((m) => m.HeroCanvas),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-black" />,
  },
);

/**
 * One shared hero galaxy behind the landing + mid sections.
 */
export function GalaxyShell({ children }: { children: ReactNode }) {
  const ready = useDeferredMount({ timeoutMs: 600 });

  return (
    <div className="relative bg-black">
      <div
        className="pointer-events-none sticky top-0 z-0 h-screen w-full overflow-hidden bg-black"
        aria-hidden
      >
        {ready ? <HeroCanvas /> : <div className="absolute inset-0 bg-black" />}
      </div>
      <div className="relative z-10 -mt-[100vh]">{children}</div>
    </div>
  );
}
