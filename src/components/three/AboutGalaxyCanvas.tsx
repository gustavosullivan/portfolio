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
};

/**
 * Mid-page nebula: desktop keeps a light procedural plate;
 * mobile uses sharp soft-blobs (no low-res blur upscale).
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
    const ctx = canvas.getContext("2d", {
      alpha: false,
      desynchronized: true,
    });
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
    // Mobile: fewer frames. Desktop: capped for battery/CPU.
    const fpsInterval = mobile ? 1000 / 12 : reduced ? 1000 / 18 : 1000 / 24;
    const pointer = { x: 0.5, y: 0.45, tx: 0.5, ty: 0.45 };

    let plate: HTMLCanvasElement | null = null;
    let plateScale = 0.4;

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
    const fbm = (x: number, y: number, oct = 3) => {
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
      const n = mobile ? 70 : reduced ? 140 : 220;
      stars = Array.from({ length: n }, () => {
        const roll = Math.random();
        return {
          x: Math.random() * w,
          y: Math.random() * worldH,
          r: Math.random() < 0.9 ? 0.35 + Math.random() * 0.7 : 0.9 + Math.random() * 1.2,
          a: 0.25 + Math.random() * 0.55,
          tw: Math.random() * Math.PI * 2,
          sp: 0.3 + Math.random() * 1.2,
          depth: 0.25 + Math.random() * 0.75,
          hue: roll > 0.88 ? "cool" : roll > 0.78 ? "warm" : "white",
        };
      });
    };

    /** Mobile: campo mais “afastado” (nuvens menores, mais vazio preto). */
    const bakeLitePlate = () => {
      const token = ++bakeToken;
      plateScale = 1;
      const pw = Math.max(1, Math.floor(w));
      // Altura alinhada ao scroll real — evita esticar/zoom estranho
      const ph = Math.max(h * 2, Math.floor(worldH));

      const c = document.createElement("canvas");
      c.width = pw;
      c.height = ph;
      const g = c.getContext("2d");
      if (!g) return;

      g.fillStyle = "#000";
      g.fillRect(0, 0, pw, ph);

      const drawBlob = (
        x: number,
        y: number,
        rx: number,
        ry: number,
        colors: [string, string, string],
      ) => {
        const rad = Math.max(rx, ry);
        const grad = g.createRadialGradient(x, y, 0, x, y, rad);
        grad.addColorStop(0, colors[0]);
        grad.addColorStop(0.4, colors[1]);
        grad.addColorStop(1, colors[2]);
        g.fillStyle = grad;
        g.beginPath();
        g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
        g.fill();
      };

      g.globalCompositeOperation = "lighter";
      // Mais blobs, menores = sensação de panorama (não zoom)
      const n = 14;
      for (let i = 0; i < n; i++) {
        const t = (i + 0.4) / n;
        const x = pw * (0.12 + ((i * 47 + 13) % 76) / 100);
        const y = ph * (0.05 + t * 0.9);
        // ~12–20% da largura — nuvem distante
        const rx = pw * (0.12 + (i % 4) * 0.025);
        const ry = rx * (0.55 + (i % 3) * 0.12);

        if (i % 3 === 0) {
          drawBlob(x, y, rx, ry, [
            "rgba(100,220,255,0.32)",
            "rgba(40,140,230,0.12)",
            "rgba(0,0,0,0)",
          ]);
        } else if (i % 3 === 1) {
          drawBlob(x + rx * 0.35, y, rx * 1.1, ry, [
            "rgba(255,175,80,0.26)",
            "rgba(255,100,45,0.1)",
            "rgba(0,0,0,0)",
          ]);
        } else {
          drawBlob(x - rx * 0.2, y, rx * 1.2, ry * 1.05, [
            "rgba(255,80,170,0.3)",
            "rgba(160,30,110,0.11)",
            "rgba(0,0,0,0)",
          ]);
        }
      }
      g.globalCompositeOperation = "source-over";

      if (!disposed && token === bakeToken) plate = c;
    };

    /** Desktop: lighter noise plate (no heavy bloom blur stack). */
    const bakeDesktopPlate = () => {
      const token = ++bakeToken;
      plateScale = 0.42;
      const pw = Math.max(280, Math.floor(w * plateScale));
      const ph = Math.max(480, Math.floor(worldH * plateScale));

      const gas = document.createElement("canvas");
      gas.width = pw;
      gas.height = ph;
      const gctx = gas.getContext("2d");
      if (!gctx) return;

      const img = gctx.createImageData(pw, ph);
      const data = img.data;
      const ox = 17.3;
      const oy = 41.7;
      const ySpan = (worldH / Math.max(h, 1)) * 1.55;
      const oct = 3;
      const rowsPerChunk = 36;
      let row = 0;

      const step = () => {
        if (disposed || token !== bakeToken) return;
        const end = Math.min(ph, row + rowsPerChunk);

        for (let py = row; py < end; py++) {
          const v = py / ph;
          for (let px = 0; px < pw; px++) {
            const u = px / pw;
            const x = u * 5.8 + ox;
            const y = v * ySpan + oy;

            const w1 = fbm(x * 0.5, y * 0.5, oct);
            const w2 = fbm(x * 0.5 + 5.2, y * 0.5 - 3.1, oct);
            const wx = x + (w1 - 0.5) * 2.1;
            const wy = y + (w2 - 0.5) * 2.1;

            const nA = fbm(wx * 0.85, wy * 0.85, oct);
            const nB = fbm(wx * 1.5 + 12, wy * 1.5 - 8, 2);

            const dens = Math.pow(clamp01(nA * 1.12 - 0.2), 1.45);
            const ridge = Math.pow(clamp01(nB * 1.2 - 0.4), 2);
            const lobe =
              0.55 +
              0.45 * Math.sin(v * Math.PI * 3 + nA * 2) * Math.sin(u * Math.PI * 1.3);
            const d = clamp01(dens * (0.55 + lobe * 0.5));
            const bright = clamp01(ridge * 0.75 + d * 0.35);

            const cool = clamp01(bright * (0.55 + nB * 0.5));
            const warm = clamp01(d * (0.45 + (1 - nB) * 0.55));
            const red = clamp01(d * d * (0.8 + nA * 0.4) + ridge * 0.22);

            let r = cool * 45 + warm * 200 + red * 245;
            let g = cool * 185 + warm * 115 + red * 55;
            let b = cool * 230 + warm * 55 + red * 170;

            const sat = 1.12;
            const lum = r * 0.299 + g * 0.587 + b * 0.114;
            r = lum + (r - lum) * sat;
            g = lum + (g - lum) * sat;
            b = lum + (b - lum) * sat;

            const i = (py * pw + px) * 4;
            data[i] = Math.min(255, r);
            data[i + 1] = Math.min(255, g);
            data[i + 2] = Math.min(255, b);
            data[i + 3] = clamp01(d * 0.78 + ridge * 0.4) * 255;
          }
        }

        row = end;
        if (row < ph) {
          requestAnimationFrame(step);
          return;
        }

        gctx.putImageData(img, 0, 0);

        // Mild soft pass only (keeps edges sharper than old mobile blur stack)
        const final = document.createElement("canvas");
        final.width = pw;
        final.height = ph;
        const fctx = final.getContext("2d");
        if (!fctx || disposed || token !== bakeToken) return;
        fctx.fillStyle = "#000";
        fctx.fillRect(0, 0, pw, ph);
        fctx.drawImage(gas, 0, 0);
        fctx.globalCompositeOperation = "lighter";
        fctx.globalAlpha = 0.28;
        fctx.filter = "blur(4px)";
        fctx.drawImage(gas, 0, 0);
        fctx.filter = "none";
        fctx.globalAlpha = 1;
        fctx.globalCompositeOperation = "source-over";
        plate = final;
      };

      requestAnimationFrame(step);
    };

    const bake = () => {
      plate = null;
      if (mobile || reduced) bakeLitePlate();
      else bakeDesktopPlate();
    };

    let lastCamY = Number.NaN;
    let resizeTimer = 0;
    let needsPaint = true;

    const resizeNow = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.15);
      const parent = canvas.parentElement;
      // Sempre o tamanho do sticky (não visualViewport) — evita faixa nas bordas
      w = Math.max(1, parent?.clientWidth || window.innerWidth);
      h = Math.max(1, parent?.clientHeight || window.innerHeight);
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      worldH = Math.max(band.scrollHeight, h * 2.8);
      bake();
      seedStars();
      needsPaint = true;
      lastCamY = Number.NaN;
    };

    const resize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resizeNow, mobile ? 140 : 90);
    };

    const paintFrame = (now: number) => {
      const t = (now - t0) / 1000;
      const cameraY = -band.getBoundingClientRect().top;

      if (!reduced && !mobile) {
        pointer.x += (pointer.tx - pointer.x) * 0.04;
        pointer.y += (pointer.ty - pointer.y) * 0.04;
      }
      const px = mobile ? 0 : (pointer.x - 0.5) * 2;
      const py = mobile ? 0 : (pointer.y - 0.5) * 2;

      const flowX = reduced || mobile ? 0 : Math.sin(t * 0.14) * 22;
      const flowY = reduced || mobile ? 0 : Math.cos(t * 0.11) * 14;
      const breath = reduced || mobile ? 1 : 1 + Math.sin(t * 0.2) * 0.03;

      ctx.globalCompositeOperation = "source-over";
      // +2px de sangria — mata linha/faixa nas bordas por arredondamento
      ctx.fillStyle = "#000000";
      ctx.fillRect(-2, -2, w + 4, h + 4);

      // Ambiente mais “longe” no mobile (menos wash que parece zoom)
      const amb = ctx.createRadialGradient(
        w * 0.5,
        h * 0.45,
        0,
        w * 0.5,
        h * 0.5,
        Math.max(w, h) * (mobile ? 1.05 : 0.85),
      );
      amb.addColorStop(0, mobile ? "rgba(14, 8, 24, 0.35)" : "rgba(22, 10, 36, 0.55)");
      amb.addColorStop(0.55, "rgba(6, 8, 18, 0.28)");
      amb.addColorStop(1, "rgba(0,0,0,0.94)");
      ctx.fillStyle = amb;
      ctx.fillRect(-2, -2, w + 4, h + 4);

      if (plate) {
        const srcY = Math.max(
          0,
          Math.min(plate.height - 1, (cameraY + flowY * 0.25) * plateScale),
        );
        const srcH = Math.min(plate.height - srcY, h * plateScale);
        // Mobile: cobre além das bordas (evita faixa preta/colorida na esquerda)
        const pad = mobile ? 3 : 0;
        const dw = mobile ? w + pad * 2 : w * breath;
        const dh = mobile ? h + pad * 2 : h * breath;
        const dx = mobile ? -pad : (w - dw) * 0.5 + flowX * 0.35;
        const dy = mobile ? -pad : (h - dh) * 0.5 + flowY * 0.2;

        ctx.globalAlpha = mobile ? 0.78 : 0.88;
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(
          plate,
          0,
          srcY,
          plate.width,
          Math.max(1, srcH),
          dx,
          dy,
          dw,
          dh,
        );
        ctx.globalAlpha = 1;
      }

      // Stars — wrap sem “costura” na borda esquerda
      for (const s of stars) {
        const drift = reduced || mobile ? 0 : t * (4 + s.depth * 8);
        let sx = (s.x + drift * 0.3 + px * 16 * s.depth) % w;
        if (sx < 0) sx += w;
        const sy = s.y - cameraY + py * 10 * s.depth;
        if (sy < -4 || sy > h + 4) continue;

        const twinkle =
          reduced || mobile ? 0.85 : 0.55 + 0.45 * Math.sin(t * s.sp + s.tw);
        const alpha = s.a * twinkle * (0.5 + s.depth * 0.5) * (mobile ? 0.9 : 1);
        ctx.fillStyle =
          s.hue === "cool"
            ? `rgba(170,230,255,${alpha})`
            : s.hue === "warm"
              ? `rgba(255,214,160,${alpha})`
              : `rgba(238,242,250,${alpha})`;
        ctx.fillRect(sx - s.r, sy - s.r, s.r * 2, s.r * 2);
      }

      const vig = ctx.createRadialGradient(
        w * 0.5,
        h * 0.48,
        Math.min(w, h) * (mobile ? 0.35 : 0.25),
        w * 0.5,
        h * 0.5,
        Math.max(w, h) * 0.82,
      );
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, mobile ? "rgba(0,0,0,0.58)" : "rgba(0,0,0,0.7)");
      ctx.fillStyle = vig;
      ctx.fillRect(-2, -2, w + 4, h + 4);
    };

    const tick = (now: number) => {
      if (!active) {
        raf = 0;
        return;
      }

      const cameraY = -band.getBoundingClientRect().top;
      const scrolled = Number.isNaN(lastCamY) || Math.abs(cameraY - lastCamY) >= 0.6;

      // Mobile: fundo quase estático — só repinta no scroll (bem mais fluido)
      // Desktop: anima no fpsInterval ou quando scroll muda
      const due = now - lastPaint >= fpsInterval;
      if (needsPaint || scrolled || (!mobile && !reduced && due)) {
        lastPaint = now;
        lastCamY = cameraY;
        needsPaint = false;
        paintFrame(now);
      }

      raf = requestAnimationFrame(tick);
    };

    const onPointer = (e: PointerEvent) => {
      pointer.tx = e.clientX / Math.max(1, window.innerWidth);
      pointer.ty = e.clientY / Math.max(1, window.innerHeight);
    };

    resizeNow();
    window.addEventListener("resize", resize);
    window.visualViewport?.addEventListener("resize", resize);
    if (!reduced && !mobile) {
      window.addEventListener("pointermove", onPointer, { passive: true });
    }

    const parentRo = canvas.parentElement
      ? new ResizeObserver(() => resize())
      : null;
    if (canvas.parentElement) parentRo?.observe(canvas.parentElement);

    const ro = new ResizeObserver(() => {
      const next = Math.max(band.scrollHeight, h * 2.8);
      if (Math.abs(next - worldH) > 200) {
        worldH = next;
        bake();
        seedStars();
        needsPaint = true;
      }
    });
    ro.observe(band);

    if (reduced || !active) paintFrame(performance.now());
    else raf = requestAnimationFrame(tick);

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (active && !raf) {
        needsPaint = true;
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      disposed = true;
      bakeToken += 1;
      window.clearTimeout(resizeTimer);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.visualViewport?.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      parentRo?.disconnect();
      ro.disconnect();
    };
  }, [active, reduced, mobile, bandRef]);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
  );
}
