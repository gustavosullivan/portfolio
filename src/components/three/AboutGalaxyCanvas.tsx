"use client";

import { useEffect, useRef, type RefObject } from "react";

type Star = {
  x: number;
  y: number;
  r: number;
  a: number;
  tw: number;
  sp: number;
  depth: number;
  hue: "cool" | "warm" | "white";
  spike: boolean;
};

const mulberry = (seed: number) => {
  let t = seed + 0x6d2b79f5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/**
 * Mid-page starfield. `active` only pauses rAF — never remounts.
 */
export function AboutGalaxyCanvas({
  active = true,
  bandRef,
}: {
  active?: boolean;
  bandRef: RefObject<HTMLDivElement | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  const kickRef = useRef<(() => void) | null>(null);
  activeRef.current = active;

  useEffect(() => {
    const canvas = canvasRef.current;
    const band = bandRef.current;
    if (!canvas || !band) return;
    const mobile = window.matchMedia("(max-width: 768px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d", {
      alpha: false,
      desynchronized: true,
    });
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let stars: Star[] = [];
    let t0 = performance.now();
    let lastPaint = 0;
    let disposed = false;
    const fpsInterval = mobile ? 1000 / 12 : reduced ? 1000 / 16 : 1000 / 22;
    const pointer = { x: 0.5, y: 0.45, tx: 0.5, ty: 0.45 };

    let lastCamY = Number.NaN;
    let frozenCam = 0;
    let resizeTimer = 0;
    let needsPaint = true;

    const seedStars = () => {
      const n = mobile ? 180 : reduced ? 280 : 420;
      const period = h * 2.4;
      stars = Array.from({ length: n }, (_, i) => {
        const a = mulberry(i * 97 + 11);
        const b = mulberry(i * 53 + 29);
        const c = mulberry(i * 17 + 71);
        const d = mulberry(i * 131 + 3);
        const bright = d > 0.9;
        return {
          x: a * w,
          y: b * period,
          r: bright ? 1.1 + c * 1.2 : 0.35 + c * 0.7,
          a: bright ? 0.8 : 0.38 + c * 0.45,
          tw: d * Math.PI * 2,
          sp: 0.4 + a * 1.3,
          depth: 0.2 + b * 0.8,
          hue: c > 0.82 ? "cool" : c > 0.68 ? "warm" : "white",
          spike: bright && !mobile,
        };
      });
    };

    const resizeNow = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.25);
      const parent = canvas.parentElement;
      const nextW = Math.max(1, parent?.clientWidth || window.innerWidth);
      const nextH = Math.max(1, parent?.clientHeight || window.innerHeight);
      const sizeChanged = Math.abs(nextW - w) > 2 || Math.abs(nextH - h) > 2;
      w = nextW;
      h = nextH;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
      if (sizeChanged || stars.length === 0) seedStars();
      needsPaint = true;
      lastCamY = Number.NaN;
    };

    const resize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resizeNow, 160);
    };

    const period = () => Math.max(h * 2.4, 1);

    const paintFrame = (now: number) => {
      const t = (now - t0) / 1000;
      const sticky = canvas.parentElement;
      const stickyTop = sticky?.getBoundingClientRect().top ?? 0;
      const bandTop = band.getBoundingClientRect().top;
      const stuck = stickyTop <= 1;
      const liveCam = -bandTop;
      if (stuck) frozenCam = liveCam;
      const cameraY = stuck ? liveCam : frozenCam;

      if (!reduced && !mobile) {
        pointer.x += (pointer.tx - pointer.x) * 0.04;
        pointer.y += (pointer.ty - pointer.y) * 0.04;
      }
      const px = mobile ? 0 : (pointer.x - 0.5) * 2;
      const py = mobile ? 0 : (pointer.y - 0.5) * 2;

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#070712";
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = "lighter";
      const sparks = mobile ? 2 : 3;
      for (let i = 0; i < sparks; i++) {
        const ox = w * (0.2 + i * 0.28 + px * 0.02);
        const oy = h * (0.32 + (i % 2) * 0.28 + py * 0.015);
        const rad = Math.min(w, h) * 0.16;
        const glow = ctx.createRadialGradient(ox, oy, 0, ox, oy, rad);
        const col = i === 0 ? "90,170,255" : i === 1 ? "255,120,180" : "255,190,90";
        glow.addColorStop(0, `rgba(${col},0.09)`);
        glow.addColorStop(0.45, `rgba(${col},0.03)`);
        glow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(ox, oy, rad, 0, Math.PI * 2);
        ctx.fill();
      }

      const loop = period();
      ctx.globalCompositeOperation = "lighter";
      for (const s of stars) {
        const drift = reduced || mobile ? 0 : t * (2.5 + s.depth * 5);
        let sx = (s.x + drift * 0.25 + px * 12 * s.depth) % w;
        if (sx < 0) sx += w;
        let sy = (s.y - cameraY * (0.35 + s.depth * 0.4)) % loop;
        if (sy < 0) sy += loop;
        if (sy > h + 8 && sy < loop - 8) continue;

        const drawY = sy > h + 8 ? sy - loop : sy;
        const twinkle =
          reduced || mobile ? 0.9 : 0.66 + 0.34 * Math.sin(t * s.sp + s.tw);
        const alpha = s.a * twinkle * (0.55 + s.depth * 0.45);
        const rgb =
          s.hue === "cool"
            ? "170,230,255"
            : s.hue === "warm"
              ? "255,214,160"
              : "238,242,250";

        if (s.spike) {
          const len = s.r * 5;
          ctx.fillStyle = `rgba(255,255,255,${alpha * 0.32})`;
          ctx.fillRect(sx - len, drawY - 0.4, len * 2, 0.8);
          ctx.fillRect(sx - 0.4, drawY - len * 0.6, 0.8, len * 1.2);
        }
        ctx.fillStyle = `rgba(${rgb},${alpha})`;
        ctx.fillRect(sx - s.r, drawY - s.r, s.r * 2, s.r * 2);
      }

      const streakN = mobile ? 4 : 8;
      for (let i = 0; i < streakN; i++) {
        const x = w * mulberry(i * 19 + 4);
        let y = (h * mulberry(i * 41 + 8) - cameraY * 0.2) % loop;
        if (y < 0) y += loop;
        if (y > h + 20) continue;
        const len = 18 + mulberry(i * 7) * 36;
        ctx.fillStyle = "rgba(230,240,255,0.22)";
        ctx.fillRect(x, y, len, 1);
      }
      ctx.globalCompositeOperation = "source-over";
    };

    const tick = (now: number) => {
      if (disposed) return;
      if (!activeRef.current) {
        raf = 0;
        return;
      }

      const cameraY = -band.getBoundingClientRect().top;
      const scrolled =
        Number.isNaN(lastCamY) || Math.abs(cameraY - lastCamY) >= 0.75;
      const due = now - lastPaint >= fpsInterval;
      if (needsPaint || scrolled || (!mobile && !reduced && due)) {
        lastPaint = now;
        lastCamY = cameraY;
        needsPaint = false;
        paintFrame(now);
      }

      raf = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (disposed || raf || !activeRef.current) return;
      needsPaint = true;
      raf = requestAnimationFrame(tick);
    };
    kickRef.current = startLoop;

    const onPointer = (e: PointerEvent) => {
      pointer.tx = e.clientX / Math.max(1, window.innerWidth);
      pointer.ty = e.clientY / Math.max(1, window.innerHeight);
    };

    resizeNow();
    window.addEventListener("resize", resize);
    if (!reduced && !mobile) {
      window.addEventListener("pointermove", onPointer, { passive: true });
    }

    if (reduced || !activeRef.current) paintFrame(performance.now());
    else startLoop();

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else {
        startLoop();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      disposed = true;
      kickRef.current = null;
      window.clearTimeout(resizeTimer);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [bandRef]);

  useEffect(() => {
    activeRef.current = active;
    if (active) kickRef.current?.();
  }, [active]);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
  );
}
