"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";
import gsap from "gsap";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { SITE } from "@/lib/constants";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

const HeroCanvas = dynamic(
  () =>
    import("@/components/three/HeroCanvas").then((mod) => mod.HeroCanvas),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-black" />,
  },
);

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced || !root.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        "[data-hero='eyebrow']",
        { y: 24, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.7 },
      )
        .fromTo(
          "[data-hero='title']",
          { y: 50, autoAlpha: 0, filter: "blur(10px)" },
          { y: 0, autoAlpha: 1, filter: "blur(0px)", duration: 1.1 },
          "-=0.35",
        )
        .fromTo(
          "[data-hero='stack']",
          { y: 20, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.7 },
          "-=0.55",
        )
        .fromTo(
          "[data-hero='tagline']",
          { y: 20, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.7 },
          "-=0.45",
        )
        .fromTo(
          "[data-hero='cta']",
          { y: 16, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.6 },
          "-=0.35",
        )
        .fromTo(
          "[data-hero='scroll']",
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.5 },
          "-=0.2",
        );
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={root}
      id="top"
      className="relative z-10 flex h-[100svh] max-h-[100svh] items-end overflow-hidden pb-16 md:items-center md:pb-0"
    >
      {/* Galaxy clipped to first viewport only — always running */}
      <div className="absolute inset-0 overflow-hidden">
        <HeroCanvas />
        {/* Soft handoff into the next background */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-36 bg-gradient-to-b from-transparent via-black/50 to-black md:h-48" />
      </div>

      <div className="section-pad relative z-10 mx-auto w-full max-w-7xl pt-28">
        <p
          data-hero="eyebrow"
          className="mb-5 font-mono text-xs tracking-[0.32em] text-[#ffe81f]/80 uppercase"
          style={reduced ? undefined : { opacity: 0 }}
        >
          {SITE.roles.join(" · ")}
        </p>

        <h1
          data-hero="title"
          className="display glow-text max-w-5xl text-5xl leading-[0.95] font-semibold text-[#ffe81f] md:text-7xl lg:text-8xl"
          style={reduced ? undefined : { opacity: 0 }}
        >
          {SITE.name}
        </h1>

        <p
          data-hero="stack"
          className="mt-5 max-w-3xl font-mono text-xs tracking-wide text-[#ffe81f]/55 md:text-sm"
          style={reduced ? undefined : { opacity: 0 }}
        >
          {SITE.heroStack}
        </p>

        <p
          data-hero="tagline"
          className="mt-6 max-w-xl text-lg text-[#ffe81f]/70 md:text-xl"
          style={reduced ? undefined : { opacity: 0 }}
        >
          {SITE.tagline}
        </p>

        <div
          data-hero="cta"
          className="mt-10 flex flex-wrap items-center gap-4"
          style={reduced ? undefined : { opacity: 0 }}
        >
          <MagneticButton href="#projects">Ver projetos</MagneticButton>
          <MagneticButton href="#contact" variant="ghost">
            Contato
          </MagneticButton>
        </div>

        <a
          data-hero="scroll"
          href="#about"
          className="mt-16 inline-flex items-center gap-2 font-mono text-xs tracking-[0.22em] text-[#ffe81f]/45 uppercase transition-colors hover:text-[#ffe81f]"
          style={reduced ? undefined : { opacity: 0 }}
        >
          Scroll
          <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
        </a>
      </div>
    </section>
  );
}
