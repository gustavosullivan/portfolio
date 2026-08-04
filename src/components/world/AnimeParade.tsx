"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { withBase } from "@/lib/utils";

const FRAME_COUNT = 4;
const SHEET_URL = withBase("/world/walker-sheet.png");

/**
 * Meadow emerging from matte space — top continues the Hero/void black.
 * Animations pause while offscreen.
 */
export function AnimeParade() {
  const root = useRef<HTMLDivElement>(null);
  const sprite = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "120px 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduced || !root.current || !visible) return;

    const ctx = gsap.context(() => {
      gsap.to("[data-parallax='sky']", {
        backgroundPosition: "120% 45%",
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
    }, root);

    return () => ctx.revert();
  }, [reduced, visible]);

  useEffect(() => {
    if (!sprite.current) return;
    if (reduced || !visible) {
      if (sprite.current) sprite.current.style.backgroundPosition = "0% 0";
      return;
    }

    let frame = 0;
    const id = window.setInterval(() => {
      frame = (frame + 1) % FRAME_COUNT;
      if (sprite.current) {
        const denom = Math.max(1, FRAME_COUNT - 1);
        const pct = (frame / denom) * 100;
        sprite.current.style.backgroundPosition = `${pct}% 0`;
      }
    }, 160);

    return () => window.clearInterval(id);
  }, [reduced, visible]);

  return (
    <div
      ref={root}
      className="relative h-[min(88vh,720px)] w-full overflow-hidden bg-black"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[42%] bg-gradient-to-b from-black via-[#08090f] to-[#1a2438]" />

      <div
        data-parallax="sky"
        className="absolute inset-x-0 top-[6%] bottom-[18%] bg-cover bg-[center_top]"
        style={{
          backgroundImage: "url(/world/anime-sky.png)",
          backgroundSize: "cover",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 28%, black 72%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 28%, black 72%, transparent 100%)",
        }}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black via-black/75 to-transparent md:h-44" />

      <div
        data-parallax="far"
        className="absolute inset-x-0 bottom-[16%] h-[44%] opacity-85"
        style={{
          backgroundImage: "url(/world/anime-grass-far.png)",
          backgroundRepeat: "repeat-x",
          backgroundSize: "auto 100%",
          backgroundPosition: "0% 100%",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 18%, black 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 18%, black 100%)",
        }}
      />

      <div
        data-parallax="grass"
        className="absolute inset-x-0 bottom-0 h-[50%]"
        style={{
          backgroundImage: "url(/world/anime-grass-scroll.png)",
          backgroundRepeat: "repeat-x",
          backgroundSize: "auto 108%",
          backgroundPosition: "0% 100%",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 12%, black 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 12%, black 100%)",
        }}
      />

      <div
        data-parallax="grass-front"
        className="absolute inset-x-0 bottom-0 h-[24%] opacity-90"
        style={{
          backgroundImage: "url(/world/anime-grass-scroll.png)",
          backgroundRepeat: "repeat-x",
          backgroundSize: "auto 160%",
          backgroundPosition: "0% 100%",
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

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.22)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0a1a0c] via-[#0a1a0c]/45 to-transparent" />
    </div>
  );
}
