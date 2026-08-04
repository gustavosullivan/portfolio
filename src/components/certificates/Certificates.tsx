"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Download, Expand, X } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CERTIFICATES } from "@/lib/constants";
import type { Certificate } from "@/types";
import { cn } from "@/lib/utils";

const DRAG_THRESHOLD = 6;

export function Certificates() {
  const [active, setActive] = useState<Certificate | null>(null);
  const [mounted, setMounted] = useState(false);
  const [dragging, setDragging] = useState(false);
  const midStart = Math.floor(CERTIFICATES.length / 2);
  const [index, setIndex] = useState(midStart);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const suppressClick = useRef(false);
  const dragRef = useRef({
    down: false,
    dragging: false,
    startX: 0,
    scrollLeft: 0,
    lastX: 0,
    lastT: 0,
    vx: 0, // px/ms
  });
  const inertiaRaf = useRef(0);

  useEffect(() => setMounted(true), []);

  const scrollToIndex = useCallback(
    (next: number, behavior: ScrollBehavior = "smooth") => {
      const clamped = Math.max(0, Math.min(CERTIFICATES.length - 1, next));
      const card = cardRefs.current[clamped];
      const scroller = scrollerRef.current;
      if (!card || !scroller) return;

      const left =
        card.offsetLeft - (scroller.clientWidth - card.offsetWidth) / 2;

      scroller.scrollTo({ left, behavior });
      setIndex(clamped);
    },
    [],
  );

  const snapNearest = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const mid = scroller.scrollLeft + scroller.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const center = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(center - mid);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    scrollToIndex(best, "smooth");
  }, [scrollToIndex]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    let raf = 0;
    const sync = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const mid = scroller.scrollLeft + scroller.clientWidth / 2;
        let best = 0;
        let bestDist = Infinity;
        cardRefs.current.forEach((card, i) => {
          if (!card) return;
          const center = card.offsetLeft + card.offsetWidth / 2;
          const dist = Math.abs(center - mid);
          if (dist < bestDist) {
            bestDist = dist;
            best = i;
          }
        });
        setIndex(best);
      });
    };

    scroller.addEventListener("scroll", sync, { passive: true });
    sync();
    return () => {
      scroller.removeEventListener("scroll", sync);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const goMid = () => scrollToIndex(midStart, "auto");
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(goMid);
    });

    const onResize = () => scrollToIndex(index, "auto");
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollToIndex, midStart]);

  // Grab + flick: arrasta e “atira” o carrossel com inércia
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const cancelInertia = () => {
      if (inertiaRaf.current) {
        cancelAnimationFrame(inertiaRaf.current);
        inertiaRaf.current = 0;
      }
    };

    const maxScroll = () =>
      Math.max(0, scroller.scrollWidth - scroller.clientWidth);

    const clampScroll = (v: number) => Math.max(0, Math.min(maxScroll(), v));

    const runInertia = (initialVx: number) => {
      cancelInertia();
      let vx = initialVx; // px/ms
      let prev = performance.now();
      setDragging(true);

      const tick = (now: number) => {
        const dt = Math.min(32, now - prev);
        prev = now;

        scroller.scrollLeft = clampScroll(scroller.scrollLeft - vx * dt);
        // atrito (quanto maior o flick, mais anda)
        vx *= Math.pow(0.965, dt / 16);

        const atEdge =
          scroller.scrollLeft <= 0.5 ||
          scroller.scrollLeft >= maxScroll() - 0.5;

        if (Math.abs(vx) < 0.04 || atEdge) {
          inertiaRaf.current = 0;
          setDragging(false);
          snapNearest();
          window.setTimeout(() => {
            suppressClick.current = false;
          }, 60);
          return;
        }

        inertiaRaf.current = requestAnimationFrame(tick);
      };

      inertiaRaf.current = requestAnimationFrame(tick);
    };

    const onDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      if ((e.target as HTMLElement).closest("[data-no-drag]")) return;

      cancelInertia();
      setDragging(false);

      const now = performance.now();
      dragRef.current = {
        down: true,
        dragging: false,
        startX: e.clientX,
        scrollLeft: scroller.scrollLeft,
        lastX: e.clientX,
        lastT: now,
        vx: 0,
      };
      suppressClick.current = false;
    };

    const onMove = (e: MouseEvent) => {
      const d = dragRef.current;
      if (!d.down) return;

      const dx = e.clientX - d.startX;
      if (!d.dragging && Math.abs(dx) < DRAG_THRESHOLD) return;

      if (!d.dragging) {
        d.dragging = true;
        suppressClick.current = true;
        setDragging(true);
      }

      e.preventDefault();
      const now = performance.now();
      const frameDx = e.clientX - d.lastX;
      const frameDt = Math.max(1, now - d.lastT);
      // suaviza velocidade recente
      const sample = frameDx / frameDt;
      d.vx = d.vx * 0.65 + sample * 0.35;
      d.lastX = e.clientX;
      d.lastT = now;

      scroller.scrollLeft = clampScroll(d.scrollLeft - dx);
    };

    const endDrag = () => {
      const d = dragRef.current;
      if (!d.down) return;
      const wasDragging = d.dragging;
      const throwVx = d.vx;
      d.down = false;
      d.dragging = false;

      if (!wasDragging) {
        setDragging(false);
        return;
      }

      // “atirar”: se tiver velocidade, roda inércia; senão só encaixa
      if (Math.abs(throwVx) > 0.08) {
        // amplifica um pouco o flick
        runInertia(throwVx * 1.35);
      } else {
        setDragging(false);
        snapNearest();
        window.setTimeout(() => {
          suppressClick.current = false;
        }, 60);
      }
    };

    scroller.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove, { passive: false });
    window.addEventListener("mouseup", endDrag);
    window.addEventListener("blur", endDrag);

    return () => {
      cancelInertia();
      scroller.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", endDrag);
      window.removeEventListener("blur", endDrag);
    };
  }, [snapNearest]);

  // Horizontal wheel only (Shift+roda ou gesto horizontal) — vertical scrolla a página
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const onWheel = (e: WheelEvent) => {
      if (active) return;

      const horizontalIntent =
        Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey;
      if (!horizontalIntent) return;

      const delta = e.shiftKey && Math.abs(e.deltaY) >= Math.abs(e.deltaX)
        ? e.deltaY
        : Math.abs(e.deltaX) >= Math.abs(e.deltaY)
          ? e.deltaX
          : e.deltaY;

      if (Math.abs(delta) < 0.5) return;

      const max = scroller.scrollWidth - scroller.clientWidth;
      if (max <= 0) return;

      const next = scroller.scrollLeft + delta;
      const clamped = Math.max(0, Math.min(max, next));
      if (clamped === scroller.scrollLeft) return;

      e.preventDefault();
      scroller.scrollLeft = clamped;
    };

    scroller.addEventListener("wheel", onWheel, { passive: false });
    return () => scroller.removeEventListener("wheel", onWheel);
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (active) return;
      if (e.key === "ArrowLeft") scrollToIndex(index - 1);
      if (e.key === "ArrowRight") scrollToIndex(index + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, index, scrollToIndex]);

  const openCert = (cert: Certificate) => {
    suppressClick.current = false;
    setActive(cert);
  };

  const modal =
    mounted &&
    createPortal(
      <AnimatePresence>
        {active && (
          <motion.div
            key={active.id}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              type="button"
              aria-label="Fechar"
              className="absolute inset-0 bg-black/85"
              onClick={() => setActive(null)}
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="certificate-modal-title"
              initial={{ opacity: 0, scale: 0.97, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden border border-white/10 bg-[#0a0a0c]"
            >
              <div className="flex items-start justify-between gap-4 border-b border-white/10 px-4 py-3 md:px-5">
                <div className="min-w-0">
                  <p className="font-mono text-[10px] tracking-[0.22em] text-cyan-300/70 uppercase">
                    {active.issuer}
                    {active.hours ? ` · ${active.hours}` : ""}
                  </p>
                  <h3
                    id="certificate-modal-title"
                    className="mt-1 truncate text-sm font-medium text-white md:text-base"
                  >
                    {active.title}
                  </h3>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {active.pdf ? (
                    <a
                      href={active.pdf}
                      download
                      className="inline-flex items-center gap-1.5 border border-white/15 px-2.5 py-1.5 font-mono text-[10px] tracking-wider text-white/70 uppercase transition-colors hover:border-cyan-300/40 hover:text-white"
                    >
                      <Download className="h-3.5 w-3.5" />
                      PDF
                    </a>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setActive(null)}
                    className="border border-white/15 p-1.5 text-white/60 transition-colors hover:border-white/35 hover:text-white"
                    aria-label="Fechar certificado"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="overflow-auto bg-black/40 p-3 md:p-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={active.image}
                  alt={active.title}
                  className="mx-auto h-auto max-h-[78vh] w-auto max-w-full object-contain shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
                  draggable={false}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body,
    );

  return (
    <section
      id="certificates"
      className="relative overflow-hidden pt-10 pb-10 md:pt-12 md:pb-12"
    >
      <div className="section-pad mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Certificados"
          title="Certificações"
          description="Certificado completo no centro. Laterais saem da página — role ou arraste para o próximo entrar."
          className="mb-10"
        />
      </div>

      <div className="relative">
        <div
          ref={scrollerRef}
          className={cn(
            "flex gap-5 overflow-x-auto py-3 md:gap-7",
            // centraliza o card ativo; vizinhos ficam pela metade fora da viewport
            "px-[max(0.75rem,calc(50vw-min(40vw,200px)))] md:px-[calc(50vw-210px)]",
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            "select-none",
            dragging
              ? "cursor-grabbing snap-none"
              : "cursor-grab snap-x snap-mandatory",
          )}
          style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-x" }}
        >
          {CERTIFICATES.map((cert, i) => {
            const focused = i === index;
            return (
              <article
                key={cert.id}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className={cn(
                  "w-[min(80vw,420px)] shrink-0 snap-center overflow-hidden border text-left transition-[border-color,box-shadow] duration-300",
                  focused
                    ? "z-[2] border-cyan-300/40 bg-black/55 shadow-[0_0_40px_rgba(34,211,238,0.08)]"
                    : "z-[1] border-white/12 bg-black/45",
                )}
              >
                <div className="relative aspect-[16/11] overflow-hidden bg-black/40">
                  <button
                    type="button"
                    aria-label={
                      focused
                        ? `Ampliar certificado ${cert.title}`
                        : `Centralizar ${cert.title}`
                    }
                    onClick={() => {
                      if (suppressClick.current) {
                        suppressClick.current = false;
                        return;
                      }
                      if (!focused) {
                        scrollToIndex(i);
                        return;
                      }
                      openCert(cert);
                    }}
                    className="absolute inset-0 block w-full"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cert.image}
                      alt=""
                      draggable={false}
                      className="pointer-events-none h-full w-full select-none object-cover object-top"
                    />
                  </button>

                  {focused ? (
                    <button
                      type="button"
                      data-no-drag
                      onClick={() => openCert(cert)}
                      className="absolute right-3 bottom-3 z-[2] inline-flex items-center gap-1.5 bg-black/75 px-2 py-1 font-mono text-[10px] tracking-wider text-white/85 uppercase"
                    >
                      <Expand className="h-3 w-3" />
                      Ampliar
                    </button>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (suppressClick.current) {
                      suppressClick.current = false;
                      return;
                    }
                    if (!focused) {
                      scrollToIndex(i);
                      return;
                    }
                    openCert(cert);
                  }}
                  className="block w-full p-4 text-left md:p-5"
                >
                  <p className="font-mono text-[11px] tracking-[0.22em] text-cyan-300/70 uppercase">
                    {cert.year}
                    {cert.hours ? ` · ${cert.hours}` : ""}
                  </p>
                  <h3 className="mt-2 line-clamp-2 text-base font-medium text-white md:text-lg">
                    {cert.title}
                  </h3>
                  <p className="mt-2 text-sm text-white/45">{cert.issuer}</p>
                </button>
              </article>
            );
          })}
        </div>

        <button
          type="button"
          data-no-drag
          onClick={() => scrollToIndex(index - 1)}
          disabled={index <= 0}
          aria-label="Certificado anterior"
          className={cn(
            "glass absolute top-1/2 left-3 z-[4] -translate-y-1/2 p-3 text-white/80 transition-colors md:left-6",
            index <= 0
              ? "cursor-not-allowed opacity-25"
              : "hover:border-cyan-300/40 hover:text-white",
          )}
        >
          <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
        </button>
        <button
          type="button"
          data-no-drag
          onClick={() => scrollToIndex(index + 1)}
          disabled={index >= CERTIFICATES.length - 1}
          aria-label="Próximo certificado"
          className={cn(
            "glass absolute top-1/2 right-3 z-[4] -translate-y-1/2 p-3 text-white/80 transition-colors md:right-6",
            index >= CERTIFICATES.length - 1
              ? "cursor-not-allowed opacity-25"
              : "hover:border-cyan-300/40 hover:text-white",
          )}
        >
          <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
        </button>
      </div>

      <div className="section-pad mx-auto mt-6 flex max-w-7xl justify-center gap-2">
        {CERTIFICATES.map((cert, i) => (
          <button
            key={cert.id}
            type="button"
            aria-label={`Ir para ${cert.title}`}
            onClick={() => scrollToIndex(i)}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === index
                ? "w-7 bg-cyan-300/85"
                : "w-1.5 bg-white/25 hover:bg-white/45",
            )}
          />
        ))}
      </div>

      {modal}
    </section>
  );
}
