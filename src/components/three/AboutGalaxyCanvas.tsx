"use client";

import { useEffect, useRef, type RefObject } from "react";
import { usePrefersReducedMotion, useIsMobile } from "@/hooks/useMediaQuery";

type Star = {
  x: number;
  y: number;
  r: number;
  a: number;
  tw: number;
  sp: number;
  depth: number;
  hue: "cool" | "warm" | "white";
  layer: "back" | "front";
};

/**
 * Hubble/JWST–inspired procedural deep-space field for the mid-page band.
 * Fully generative (no photo textures). Hero + Anime untouched.
 */
export function AboutGalaxyCanvas({
  active = true,
  bandRef,
}: {
  active?: boolean;
  bandRef: RefObject<HTMLDivElement | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();
  const mobile = useIsMobile();

  useEffect(() => {
    const canvas = canvasRef.current;
    const band = bandRef.current;
    if (!canvas || !band) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let worldH = 4000;
    let stars: Star[] = [];
    let t0 = performance.now();
    let lastPaint = 0;
    let disposed = false;
    let bakeToken = 0;
    const fpsInterval = mobile ? 1000 / 18 : 1000 / 26;
    const pointer = { x: 0.5, y: 0.45, tx: 0.5, ty: 0.45 };

    let plate: HTMLCanvasElement | null = null;
    let dustPlate: HTMLCanvasElement | null = null;
    let plateScale = 0.34;

    const hash2 = (x: number, y: number) => {
      const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
      return n - Math.floor(n);
    };

    const smooth = (t: number) => t * t * (3 - 2 * t);

    const valueNoise = (x: number, y: number) => {
      const x0 = Math.floor(x);
      const y0 = Math.floor(y);
      const xf = smooth(x - x0);
      const yf = smooth(y - y0);
      const a = hash2(x0, y0);
      const b = hash2(x0 + 1, y0);
      const c = hash2(x0, y0 + 1);
      const d = hash2(x0 + 1, y0 + 1);
      return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
    };

    const fbm = (x: number, y: number, oct = 4) => {
      let v = 0;
      let a = 0.5;
      let f = 1;
      let s = 0;
      for (let i = 0; i < oct; i++) {
        v += a * valueNoise(x * f, y * f);
        s += a;
        a *= 0.5;
        f *= 2.03;
      }
      return v / s;
    };

    const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

    const seedStars = () => {
      const backN = mobile ? 280 : reduced ? 340 : 520;
      const frontN = mobile ? 90 : reduced ? 120 : 180;
      const mk = (layer: Star["layer"]): Star => {
        const roll = Math.random();
        const back = layer === "back";
        return {
          x: Math.random() * w,
          y: Math.random() * worldH,
          r: back
            ? Math.random() < 0.92
              ? 0.2 + Math.random() * 0.55
              : 0.75 + Math.random() * 1.05
            : Math.random() < 0.86
              ? 0.3 + Math.random() * 0.75
              : 1 + Math.random() * 1.5,
          a: back ? 0.22 + Math.random() * 0.55 : 0.28 + Math.random() * 0.6,
          tw: Math.random() * Math.PI * 2,
          sp: (back ? 0.35 : 0.55) + Math.random() * (back ? 1.4 : 1.8),
          depth: back ? 0.12 + Math.random() * 0.38 : 0.55 + Math.random() * 0.45,
          hue: roll > 0.86 ? "cool" : roll > 0.74 ? "warm" : "white",
          layer,
        };
      };
      stars = [
        ...Array.from({ length: backN }, () => mk("back")),
        ...Array.from({ length: frontN }, () => mk("front")),
      ];
    };

    const drawStars = (
      layer: Star["layer"],
      t: number,
      cameraY: number,
      px: number,
      py: number,
      reducedMotion: boolean,
    ) => {
      for (const s of stars) {
        if (s.layer !== layer) continue;
        const drift = reducedMotion ? 0 : t * (6 + s.depth * 16);
        const bob = reducedMotion
          ? 0
          : Math.sin(t * 0.35 + s.tw) * (3.5 + s.depth * 4);
        const sx =
          ((s.x + drift * (layer === "back" ? 0.25 : 0.55) + px * 26 * s.depth) %
            (w + 24)) -
          12;
        const sy = s.y - cameraY + py * 14 * s.depth + bob;
        if (sy < -6 || sy > h + 6) continue;

        const twinkle = reducedMotion
          ? 1
          : 0.48 + 0.52 * Math.sin(t * s.sp + s.tw);
        const alpha = s.a * twinkle * (0.4 + s.depth * 0.6);
        const color =
          s.hue === "cool"
            ? `rgba(170,230,255,${alpha})`
            : s.hue === "warm"
              ? `rgba(255,214,160,${alpha})`
              : `rgba(238,242,250,${alpha})`;
        ctx.fillStyle = color;
        ctx.fillRect(sx - s.r, sy - s.r, s.r * 2, s.r * 2);

        if (!mobile && s.r > 0.95 && alpha > 0.4) {
          ctx.fillStyle =
            s.hue === "cool"
              ? `rgba(120,210,255,${alpha * 0.16})`
              : `rgba(210,220,255,${alpha * 0.12})`;
          ctx.fillRect(sx - s.r * 2.4, sy - s.r * 2.4, s.r * 4.8, s.r * 4.8);
        }
      }
    };

    const finishPlate = (
      gas: HTMLCanvasElement,
      dust: HTMLCanvasElement,
      pw: number,
      ph: number,
      token: number,
    ) => {
      if (disposed || token !== bakeToken) return;

      const soft = document.createElement("canvas");
      soft.width = pw;
      soft.height = ph;
      const sctx = soft.getContext("2d");
      if (!sctx) return;
      sctx.filter = mobile ? "blur(1.1px)" : "blur(2px)";
      sctx.drawImage(gas, 0, 0);
      sctx.filter = "none";

      const final = document.createElement("canvas");
      final.width = pw;
      final.height = ph;
      const fctx = final.getContext("2d");
      if (!fctx) return;
      fctx.fillStyle = "#000";
      fctx.fillRect(0, 0, pw, ph);
      fctx.drawImage(soft, 0, 0);
      // Punchier photographic bloom on bright ridges
      fctx.globalCompositeOperation = "lighter";
      fctx.globalAlpha = 0.48;
      fctx.filter = mobile ? "blur(5px)" : "blur(10px)";
      fctx.drawImage(gas, 0, 0);
      fctx.globalAlpha = 0.22;
      fctx.filter = mobile ? "blur(10px)" : "blur(18px)";
      fctx.drawImage(gas, 0, 0);
      fctx.filter = "none";
      fctx.globalAlpha = 1;
      fctx.globalCompositeOperation = "source-over";

      plate = final;
      dustPlate = dust;
    };

    const bakePlateAsync = () => {
      const token = ++bakeToken;
      plateScale = mobile ? 0.24 : 0.32;
      const pw = Math.max(220, Math.floor(w * plateScale));
      const ph = Math.max(420, Math.floor(worldH * plateScale));

      const gas = document.createElement("canvas");
      gas.width = pw;
      gas.height = ph;
      const gctx = gas.getContext("2d");
      if (!gctx) return;

      const dust = document.createElement("canvas");
      dust.width = pw;
      dust.height = ph;
      const dctx = dust.getContext("2d");
      if (!dctx) return;

      const img = gctx.createImageData(pw, ph);
      const data = img.data;
      const dimg = dctx.createImageData(pw, ph);
      const ddata = dimg.data;

      const ox = 17.3;
      const oy = 41.7;
      const ySpan = (worldH / Math.max(h, 1)) * 1.65;
      const oct = mobile ? 3 : 4;
      const rowsPerChunk = mobile ? 18 : 28;
      let row = 0;

      const step = () => {
        if (disposed || token !== bakeToken) return;
        const end = Math.min(ph, row + rowsPerChunk);

        for (let py = row; py < end; py++) {
          const v = py / ph;
          for (let px = 0; px < pw; px++) {
            const u = px / pw;
            const x = u * 6.2 + ox;
            const y = v * ySpan + oy;

            const w1 = fbm(x * 0.55, y * 0.55, oct);
            const w2 = fbm(x * 0.55 + 5.2, y * 0.55 - 3.1, oct);
            const wx = x + (w1 - 0.5) * 2.35;
            const wy = y + (w2 - 0.5) * 2.35;

            const nA = fbm(wx * 0.9, wy * 0.9, oct);
            const nB = fbm(wx * 1.65 + 12, wy * 1.65 - 8, oct);
            const nC = fbm(wx * 0.35 - 4, wy * 0.35 + 9, 3);

            const body = Math.pow(clamp01(nA * 1.15 - 0.18), 1.55);
            const ridge = Math.pow(clamp01(nB * 1.25 - 0.42), 2.2);
            const glow = Math.pow(clamp01(nC * 1.1 - 0.28), 1.35);

            const lobe =
              0.55 +
              0.45 *
                Math.sin(v * Math.PI * 3.2 + nC * 2.5) *
                Math.sin(u * Math.PI * 1.4 + 0.4);
            const dens = clamp01(body * (0.55 + lobe * 0.55));
            const bright = clamp01(ridge * 0.85 + dens * 0.35 + glow * 0.25);

            // Vivid but photographic: OIII cyan → amber → Hα magenta
            const cool = clamp01(bright * (0.6 + nB * 0.55));
            const warm = clamp01(dens * (0.5 + (1 - nB) * 0.6));
            const red = clamp01(dens * dens * (0.85 + nA * 0.45) + ridge * 0.28);

            let r = cool * 40 + warm * 210 + red * 255;
            let g = cool * 195 + warm * 125 + red * 55;
            let b = cool * 240 + warm * 55 + red * 175;

            // Keep rich color (realistic plate, not neon wash)
            const sat = 1.18;
            const lum = r * 0.299 + g * 0.587 + b * 0.114;
            r = lum + (r - lum) * sat;
            g = lum + (g - lum) * sat;
            b = lum + (b - lum) * sat;

            const alpha = clamp01(dens * 0.82 + ridge * 0.48 + glow * 0.12) * 255;
            const i = (py * pw + px) * 4;
            data[i] = Math.min(255, r);
            data[i + 1] = Math.min(255, g);
            data[i + 2] = Math.min(255, b);
            data[i + 3] = alpha;

            const dustN = fbm(wx * 1.3 + 30, wy * 1.3 - 18, oct);
            const lane = Math.pow(clamp01(0.62 - dustN), 2.4) * dens;
            ddata[i] = 6;
            ddata[i + 1] = 3;
            ddata[i + 2] = 8;
            ddata[i + 3] = Math.min(210, lane * 255 * 1.35);
          }
        }

        row = end;
        if (row < ph) {
          requestAnimationFrame(step);
          return;
        }

        gctx.putImageData(img, 0, 0);
        dctx.putImageData(dimg, 0, 0);
        finishPlate(gas, dust, pw, ph, token);
      };

      requestAnimationFrame(step);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.25);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      worldH = Math.max(band.scrollHeight, h * 2.8);
      plate = null;
      dustPlate = null;
      bakePlateAsync();
      seedStars();
    };

    const paintFrame = (now: number) => {
      const t = (now - t0) / 1000;
      const cameraY = -band.getBoundingClientRect().top;

      if (!reduced) {
        pointer.x += (pointer.tx - pointer.x) * 0.04;
        pointer.y += (pointer.ty - pointer.y) * 0.04;
      }
      const px = (pointer.x - 0.5) * 2;
      const py = (pointer.y - 0.5) * 2;

      // Living nebula motion (a bit more lively)
      const flowX = reduced
        ? 0
        : Math.sin(t * 0.2) * 42 + Math.sin(t * 0.09) * 22;
      const flowY = reduced
        ? 0
        : Math.cos(t * 0.16) * 30 + Math.sin(t * 0.07) * 16;
      const flowX2 = reduced
        ? 0
        : Math.cos(t * 0.14) * 52 + Math.sin(t * 0.24) * 16;
      const flowY2 = reduced
        ? 0
        : Math.sin(t * 0.12) * 38 + Math.cos(t * 0.19) * 18;
      const breath = reduced ? 1 : 1 + Math.sin(t * 0.28) * 0.055;
      const glowPulse = reduced
        ? 0.55
        : 0.38 + 0.36 * (0.5 + 0.5 * Math.sin(t * 0.34));

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, w, h);

      const amb = ctx.createRadialGradient(
        w * (0.5 + px * 0.02 + Math.sin(t * 0.11) * 0.04),
        h * (0.42 + py * 0.015 + Math.cos(t * 0.1) * 0.03),
        0,
        w * 0.5,
        h * 0.5,
        Math.max(w, h) * 0.9,
      );
      amb.addColorStop(0, "rgba(28, 12, 42, 0.58)");
      amb.addColorStop(0.45, "rgba(8, 10, 28, 0.38)");
      amb.addColorStop(1, "rgba(0,0,0,0.94)");
      ctx.fillStyle = amb;
      ctx.fillRect(0, 0, w, h);

      // Dense starfield behind the gas (nebula look)
      drawStars("back", t, cameraY, px, py, reduced);

      if (plate) {
        const srcY = Math.max(
          0,
          Math.min(plate.height - 1, (cameraY + flowY * 0.55) * plateScale),
        );
        const srcH = Math.min(plate.height - srcY, h * plateScale);
        const dw = w * breath;
        const dh = h * breath;
        const dx = (w - dw) * 0.5 + flowX * 0.55 + px * 22;
        const dy = (h - dh) * 0.5 + flowY * 0.4 + py * 14;

        ctx.save();
        ctx.globalAlpha = 0.86;
        ctx.drawImage(plate, 0, srcY, plate.width, srcH, dx, dy, dw, dh);

        // Counter-moving highlight layer
        ctx.globalAlpha = glowPulse;
        ctx.globalCompositeOperation = "lighter";
        const srcY2 = Math.max(
          0,
          Math.min(plate.height - 1, (cameraY * 0.88 + flowY2 * 0.7) * plateScale),
        );
        ctx.drawImage(
          plate,
          0,
          srcY2,
          plate.width,
          Math.min(plate.height - srcY2, h * plateScale),
          -flowX2 * 0.45 - px * 12,
          -flowY2 * 0.36 - py * 10,
          w * (1.08 + (breath - 1) * 2.4),
          h * (1.08 + (breath - 1) * 2.4),
        );

        if (!mobile) {
          ctx.globalAlpha = 0.2 + 0.12 * Math.sin(t * 0.42);
          const srcY3 = Math.max(
            0,
            Math.min(plate.height - 1, (cameraY * 1.06 - flowY * 1.2) * plateScale),
          );
          ctx.drawImage(
            plate,
            0,
            srcY3,
            plate.width,
            Math.min(plate.height - srcY3, h * plateScale),
            flowX * 0.75 + w * 0.015,
            flowY * 0.55 - h * 0.02,
            w * 0.99,
            h * 0.99,
          );
        }
        ctx.globalCompositeOperation = "source-over";
        ctx.restore();
      }

      if (dustPlate) {
        const srcY = Math.max(
          0,
          Math.min(
            dustPlate.height - 1,
            (cameraY + flowY * 0.35) * plateScale,
          ),
        );
        const srcH = Math.min(dustPlate.height - srcY, h * plateScale);
        ctx.globalAlpha = 0.74 + (reduced ? 0 : 0.1 * Math.sin(t * 0.22));
        ctx.drawImage(
          dustPlate,
          0,
          srcY,
          dustPlate.width,
          srcH,
          flowX * 0.22,
          flowY * 0.16,
          w,
          h,
        );
        ctx.globalAlpha = 1;
      }

      if (!reduced) {
        ctx.globalCompositeOperation = "lighter";
        const wx = w * (0.32 + 0.26 * Math.sin(t * 0.16)) + px * 24;
        const wy = h * (0.38 + 0.2 * Math.cos(t * 0.13)) + py * 16;
        const wash = ctx.createRadialGradient(
          wx,
          wy,
          0,
          wx,
          wy,
          Math.min(w, h) * 0.46,
        );
        wash.addColorStop(0, "rgba(80,210,255,0.09)");
        wash.addColorStop(0.45, "rgba(255,90,160,0.065)");
        wash.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = wash;
        ctx.fillRect(0, 0, w, h);

        const wx2 = w * (0.66 + 0.18 * Math.cos(t * 0.2));
        const wy2 = h * (0.56 + 0.16 * Math.sin(t * 0.15));
        const wash2 = ctx.createRadialGradient(
          wx2,
          wy2,
          0,
          wx2,
          wy2,
          Math.min(w, h) * 0.4,
        );
        wash2.addColorStop(0, "rgba(255,170,70,0.065)");
        wash2.addColorStop(0.5, "rgba(255,60,130,0.045)");
        wash2.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = wash2;
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = "source-over";
      }

      // Brighter stars in front of the dust / gas
      drawStars("front", t, cameraY, px, py, reduced);

      const vig = ctx.createRadialGradient(
        w * 0.5,
        h * 0.48,
        Math.min(w, h) * 0.22,
        w * 0.5,
        h * 0.5,
        Math.max(w, h) * 0.82,
      );
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(0.72, "rgba(0,0,0,0.14)");
      vig.addColorStop(1, "rgba(0,0,0,0.72)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);
    };

    const tick = (now: number) => {
      if (now - lastPaint >= fpsInterval) {
        lastPaint = now;
        paintFrame(now);
      }
      raf = requestAnimationFrame(tick);
    };

    const onPointer = (e: PointerEvent) => {
      pointer.tx = e.clientX / Math.max(1, window.innerWidth);
      pointer.ty = e.clientY / Math.max(1, window.innerHeight);
    };

    resize();
    window.addEventListener("resize", resize);
    if (!reduced && !mobile) {
      window.addEventListener("pointermove", onPointer, { passive: true });
    }

    const ro = new ResizeObserver(() => {
      const next = Math.max(band.scrollHeight, h * 2.8);
      if (Math.abs(next - worldH) > 160) {
        worldH = next;
        plate = null;
        dustPlate = null;
        bakePlateAsync();
        seedStars();
      }
    });
    ro.observe(band);

    if (reduced || !active) paintFrame(performance.now());
    else raf = requestAnimationFrame(tick);

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (active && !reduced && !raf) {
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      disposed = true;
      bakeToken += 1;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      ro.disconnect();
    };
  }, [active, reduced, mobile, bandRef]);

  return <canvas ref={canvasRef} className="block h-full w-full" />;
}
