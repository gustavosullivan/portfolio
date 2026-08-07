"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { SITE } from "@/lib/constants";
import { useI18n } from "@/i18n";
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
  const { t } = useI18n();
  const root = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  // Let text/CSS paint first; WebGL (three.js) waits for idle
  const [canvasReady, setCanvasReady] = useState(false);

  useEffect(() => {
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const enable = () => setCanvasReady(true);

    const ric = window.requestIdleCallback;
    if (typeof ric === "function") {
      idleId = ric(enable, { timeout: 600 });
    } else {
      timeoutId = setTimeout(enable, 120);
    }

    return () => {
      if (idleId !== undefined && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (reduced || !root.current) return;

    let reverted = false;
    let revert: (() => void) | undefined;

    void import("gsap").then(({ default: gsap }) => {
      if (reverted || !root.current) return;
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
      revert = () => ctx.revert();
    });

    return () => {
      reverted = true;
      revert?.();
    };
  }, [reduced]);

  return (
    <section
      ref={root}
      id="top"
      className="relative z-10 flex overflow-hidden pb-12 md:h-[100svh] md:max-h-[100svh] md:items-center md:pb-0"
    >
      {/* Galaxy: deferred until after first paint so GH Pages first click stays snappy */}
      <div className="absolute inset-0 overflow-hidden bg-black">
        {canvasReady && !reduced ? <HeroCanvas /> : null}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-28 bg-gradient-to-b from-transparent via-black/50 to-black md:h-48" />
      </div>

      <div className="section-pad relative z-10 mx-auto w-full max-w-7xl pt-20 md:pt-28">
        <p
          data-hero="eyebrow"
          className="mb-3 font-mono text-xs tracking-[0.32em] text-[#ffe81f]/80 uppercase md:mb-5"
          style={reduced ? undefined : { opacity: 0 }}
        >
          {t.site.roles.join(" · ")}
        </p>

        <h1
          data-hero="title"
          className="display glow-text max-w-5xl text-4xl leading-[0.95] font-semibold text-[#ffe81f] sm:text-5xl md:text-7xl lg:text-8xl"
          style={reduced ? undefined : { opacity: 0 }}
        >
          {SITE.name}
        </h1>

        <p
          data-hero="stack"
          className="mt-4 max-w-3xl font-mono text-xs tracking-wide text-[#ffe81f]/55 md:mt-5 md:text-sm"
          style={reduced ? undefined : { opacity: 0 }}
        >
          {SITE.heroStack}
        </p>

        <p
          data-hero="tagline"
          className="mt-4 max-w-xl text-base text-[#ffe81f]/70 md:mt-6 md:text-xl"
          style={reduced ? undefined : { opacity: 0 }}
        >
          {t.site.tagline}
        </p>

        <div
          data-hero="cta"
          className="mt-7 flex flex-wrap items-center gap-4 md:mt-10"
          style={reduced ? undefined : { opacity: 0 }}
        >
          <MagneticButton href="#projects">{t.hero.viewProjects}</MagneticButton>
          <MagneticButton href="#contact" variant="ghost">
            {t.hero.contact}
          </MagneticButton>
        </div>

        <a
          data-hero="scroll"
          href="#about"
          className="mt-8 inline-flex items-center gap-2 font-mono text-xs tracking-[0.22em] text-[#ffe81f]/45 uppercase transition-colors hover:text-[#ffe81f] md:mt-16"
          style={reduced ? undefined : { opacity: 0 }}
        >
          {t.hero.scroll}
          <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
        </a>
      </div>
    </section>
  );
}
