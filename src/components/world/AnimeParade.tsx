"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

const FRAME_COUNT = 4;
const SHEET_URL = "/world/walker-sheet.png";

/**
 * Meadow at ground level → sky gains altitude into the shared starfield.
 */
export function AnimeParade() {
  const root = useRef<HTMLDivElement>(null);
  const sprite = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced || !root.current) return;

    const ctx = gsap.context(() => {
      gsap.to("[data-parallax='sky']", {
        backgroundPosition: "120% 60%",
        duration: 90,
        ease: "none",
        repeat: -1,
      });

      const scrollPeriod = 1536;

      gsap.fromTo(
        "[data-parallax='far']",
        { backgroundPosition: "0px 100%" },
        {
          backgroundPosition: `-${scrollPeriod}px 100%`,
          duration: 48,
          ease: "none",
          repeat: -1,
        },
      );

      gsap.fromTo(
        "[data-parallax='grass']",
        { backgroundPosition: "0px 100%" },
        {
          backgroundPosition: `-${scrollPeriod}px 100%`,
          duration: 14,
          ease: "none",
          repeat: -1,
        },
      );

      gsap.fromTo(
        "[data-parallax='grass-front']",
        { backgroundPosition: "0px 100%" },
        {
          backgroundPosition: `-${scrollPeriod}px 100%`,
          duration: 8,
          ease: "none",
          repeat: -1,
        },
      );

      gsap.to("[data-cycle='wash']", {
        opacity: 0.35,
        duration: 10,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  useEffect(() => {
    if (!sprite.current) return;
    if (reduced) {
      sprite.current.style.backgroundPosition = "0% 0";
      return;
    }

    let frame = 0;
    const id = window.setInterval(() => {
      frame = (frame + 1) % FRAME_COUNT;
      if (sprite.current) {
        const pct = FRAME_COUNT === 1 ? 0 : (frame / (FRAME_COUNT - 1)) * 100;
        sprite.current.style.backgroundPosition = `${pct}% 0`;
      }
    }, 140);

    return () => window.clearInterval(id);
  }, [reduced]);

  return (
    <div
      ref={root}
      className="relative h-[min(88vh,720px)] w-full overflow-hidden bg-transparent"
    >
      {/* High altitude — open to parent starfield */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[42%] bg-gradient-to-b from-transparent via-[#03050c]/40 to-[#070b18]/85" />

      {/* Mid altitude — anime sky fading up into night */}
      <div
        data-parallax="sky"
        className="absolute inset-x-0 top-[12%] bottom-[28%] scale-105 bg-cover bg-[center_top]"
        style={{
          backgroundImage: "url(/world/anime-sky.png)",
          backgroundSize: "cover",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 28%, black 70%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 28%, black 70%, transparent 100%)",
        }}
      />

      {/* Atmosphere / altitude haze */}
      <div
        data-cycle="wash"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0a1020]/0 via-[#1a2744]/25 to-transparent opacity-30"
      />
      <div className="pointer-events-none absolute inset-x-0 top-[20%] h-[35%] bg-gradient-to-b from-[#03050c]/70 via-transparent to-transparent" />

      {/* Distant hills */}
      <div
        data-parallax="far"
        className="absolute inset-x-0 bottom-[20%] h-[42%] opacity-75 blur-[0.5px]"
        style={{
          backgroundImage: "url(/world/anime-grass-far.png)",
          backgroundRepeat: "repeat-x",
          backgroundSize: "auto 100%",
          backgroundPosition: "0% 100%",
          willChange: "background-position",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 22%, black 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 22%, black 100%)",
        }}
      />

      {/* Main grass */}
      <div
        data-parallax="grass"
        className="absolute inset-x-0 bottom-0 h-[48%]"
        style={{
          backgroundImage: "url(/world/anime-grass-scroll.png)",
          backgroundRepeat: "repeat-x",
          backgroundSize: "auto 108%",
          backgroundPosition: "0% 100%",
          willChange: "background-position",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 14%, black 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 14%, black 100%)",
        }}
      />

      {/* Foreground grass */}
      <div
        data-parallax="grass-front"
        className="absolute inset-x-0 bottom-0 h-[24%] opacity-90"
        style={{
          backgroundImage: "url(/world/anime-grass-scroll.png)",
          backgroundRepeat: "repeat-x",
          backgroundSize: "auto 160%",
          backgroundPosition: "0% 100%",
          willChange: "background-position",
          filter: "blur(0.8px) saturate(1.05)",
          maskImage: "linear-gradient(to top, black 35%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to top, black 35%, transparent 100%)",
        }}
      />

      <div
        data-hero="walker"
        className="absolute bottom-[6%] left-[10%] z-10 w-[min(38vw,260px)] origin-bottom drop-shadow-[0_14px_22px_rgba(0,0,0,0.5)] md:left-[16%] md:w-[280px]"
      >
        <div
          ref={sprite}
          role="img"
          aria-label="Aventureiro anime caminhando com espada"
          className="aspect-[2/3] w-full bg-no-repeat"
          style={{
            backgroundImage: `url(${SHEET_URL})`,
            backgroundSize: `${FRAME_COUNT * 100}% 100%`,
            backgroundPosition: "0% 0",
          }}
        />
      </div>

      <div className="pointer-events-none absolute bottom-[7%] left-[16%] z-[5] h-4 w-[16%] rounded-[100%] bg-black/35 blur-md md:left-[20%]" />

      {/* Soft side vignette only — keep top open to stars */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.35)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black to-transparent" />
    </div>
  );
}
