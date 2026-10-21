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

    let cancelled = false;
    let revert: (() => void) | undefined;

    void import("gsap")
      .then(({ default: gsap }) => {
        if (cancelled || !root.current) return;

        const targets = root.current.querySelectorAll<HTMLElement>("[data-hero]");
        // Garante visibilidade mesmo se a animação falhar no meio
        targets.forEach((el) => {
          el.style.opacity = "1";
          el.style.visibility = "visible";
        });

        const ctx = gsap.context(() => {
          gsap.from("[data-hero]", {
            y: 28,
            autoAlpha: 0,
            duration: 0.75,
            stagger: 0.12,
            ease: "power3.out",
            clearProps: "transform",
          });
        }, root);

        revert = () => ctx.revert();
      })
      .catch(() => {
        // Sem GSAP: conteúdo já está visível no HTML
      });

    return () => {
      cancelled = true;
      revert?.();
      // Após unmount/HMR, força texto visível de novo
      const el = root.current;
      if (!el) return;
      el.querySelectorAll<HTMLElement>("[data-hero]").forEach((node) => {
        node.style.opacity = "1";
        node.style.visibility = "visible";
      });
    };
  }, [reduced]);

  return (
    <section
      ref={root}
      id="top"
      className="relative z-10 flex min-h-[100svh] items-center overflow-hidden pb-16 pt-20 md:pb-0 md:pt-28"
    >
      <div className="section-pad relative z-10 mx-auto w-full max-w-7xl">
        <p
          data-hero="eyebrow"
          className="neon-eyebrow mb-3 font-mono text-xs tracking-[0.32em] uppercase md:mb-5"
        >
          {t.site.roles.join(" · ")}
        </p>

        <h1
          data-hero="title"
          className="display neon-title max-w-5xl text-4xl leading-[0.95] font-semibold sm:text-5xl md:text-7xl lg:text-8xl"
        >
          {SITE.name}
        </h1>

        <p
          data-hero="stack"
          className="mt-4 max-w-3xl font-mono text-xs tracking-wide text-[var(--text-muted)] md:mt-5 md:text-sm"
        >
          {SITE.heroStack}
        </p>

        <div
          data-hero="cta"
          className="mt-7 flex flex-wrap items-center gap-4 md:mt-10"
        >
          <MagneticButton href="#projects">{t.hero.viewProjects}</MagneticButton>
          <MagneticButton href="#contact" variant="ghost">
            {t.hero.contact}
          </MagneticButton>
        </div>

        <a
          data-hero="scroll"
          href="#about"
          className="neon-label mt-10 inline-flex items-center gap-2 font-mono text-xs transition-opacity hover:opacity-100 md:mt-16 opacity-80"
        >
          {t.hero.scroll}
          <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
        </a>
      </div>
    </section>
  );
}
