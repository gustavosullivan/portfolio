"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion, useIsMobile } from "@/hooks/useMediaQuery";

type Cloud = {
  x: number;
  y: number;
  w: number;
  h: number;
  speed: number;
  alpha: number;
  blobs: { ox: number; oy: number; rw: number; rh: number }[];
};

/**
 * Day blue sky + drifting clouds — behind content until Contato.
 */
export function AboutGalaxyCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();
  const mobile = useIsMobile();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let clouds: Cloud[] = [];
    let t0 = performance.now();

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.75);
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const seed = () => {
      const cloudCount = mobile ? 7 : 12;
      clouds = Array.from({ length: cloudCount }, (_, i) => {
        const depth = i / Math.max(1, cloudCount - 1);
        const cw = w * (0.28 + Math.random() * 0.5);
        const ch = h * (0.05 + Math.random() * 0.1);
        const blobN = 5 + Math.floor(Math.random() * 5);
        return {
          x: Math.random() * (w + cw) - cw * 0.4,
          y: h * (0.06 + depth * 0.55 + Math.random() * 0.06),
          w: cw,
          h: ch,
          speed: (0.018 + (1 - depth) * 0.045) * (mobile ? 0.65 : 1),
          alpha: 0.35 + (1 - depth) * 0.4,
          blobs: Array.from({ length: blobN }, () => ({
            ox: (Math.random() - 0.5) * cw * 0.75,
            oy: (Math.random() - 0.5) * ch * 0.5,
            rw: cw * (0.16 + Math.random() * 0.3),
            rh: ch * (0.4 + Math.random() * 0.55),
          })),
        };
      });
    };

    const drawCloud = (c: Cloud) => {
      ctx.save();
      for (const b of c.blobs) {
        const gx = c.x + b.ox;
        const gy = c.y + b.oy;
        const rad = Math.max(b.rw, b.rh);
        const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, rad);
        grad.addColorStop(0, `rgba(255, 255, 255, ${c.alpha})`);
        grad.addColorStop(0.4, `rgba(245, 250, 255, ${c.alpha * 0.75})`);
        grad.addColorStop(0.75, `rgba(210, 225, 240, ${c.alpha * 0.28})`);
        grad.addColorStop(1, "rgba(180, 200, 230, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(gx, gy, b.rw, b.rh, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    const paint = (now: number) => {
      const t = (now - t0) / 1000;

      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, "#1a5fb4");
      sky.addColorStop(0.28, "#3a8fd4");
      sky.addColorStop(0.55, "#6eb6e8");
      sky.addColorStop(0.78, "#9ccff0");
      sky.addColorStop(1, "#c5dff5");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      const sunX = w * (0.72 + Math.sin(t * 0.03) * 0.01);
      const sunY = h * 0.14;
      const sun = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, h * 0.45);
      sun.addColorStop(0, "rgba(255, 244, 200, 0.35)");
      sun.addColorStop(0.35, "rgba(255, 230, 160, 0.12)");
      sun.addColorStop(1, "rgba(255, 220, 140, 0)");
      ctx.fillStyle = sun;
      ctx.fillRect(0, 0, w, h);

      const horizon = ctx.createLinearGradient(0, h * 0.55, 0, h);
      horizon.addColorStop(0, "rgba(180, 210, 240, 0)");
      horizon.addColorStop(1, "rgba(200, 220, 235, 0.35)");
      ctx.fillStyle = horizon;
      ctx.fillRect(0, 0, w, h);

      for (const c of clouds) {
        if (!reduced) {
          c.x += c.speed * (w * 0.012);
          if (c.x - c.w > w) c.x = -c.w * 1.05;
        }
        drawCloud(c);
      }

      const vig = ctx.createRadialGradient(
        w * 0.5,
        h * 0.4,
        Math.min(w, h) * 0.25,
        w * 0.5,
        h * 0.5,
        Math.max(w, h) * 0.78,
      );
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, "rgba(0,20,40,0.18)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);

      if (!reduced) raf = requestAnimationFrame(paint);
    };

    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    if (reduced) {
      paint(performance.now());
    } else {
      raf = requestAnimationFrame(paint);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [reduced, mobile]);

  return (
    <div className="absolute inset-0 h-full w-full">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
