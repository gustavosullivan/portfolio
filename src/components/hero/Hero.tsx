"use client";

import { useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { SITE } from "@/lib/constants";
import { useI18n } from "@/i18n";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

export function Hero() {
  const { t } = useI18n();
  const root = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

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
