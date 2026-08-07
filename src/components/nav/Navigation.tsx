"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { SITE } from "@/lib/constants";
import { LOCALE_LABELS, LOCALES, useI18n, type Locale } from "@/i18n";
import { cn } from "@/lib/utils";

export function Navigation() {
  const { t, locale, setLocale } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeHref, setActiveHref] = useState(t.nav.links[0]?.href ?? "#about");

  useEffect(() => {
    const onScrollChrome = () => setScrolled(window.scrollY > 24);
    onScrollChrome();
    window.addEventListener("scroll", onScrollChrome, { passive: true });
    return () => window.removeEventListener("scroll", onScrollChrome);
  }, []);

  // Seção ativa do menu — mais preciso: maior área visível perto do foco
  useEffect(() => {
    let raf = 0;
    const links = t.nav.links;

    const updateActive = () => {
      const focusY = window.innerHeight * 0.28;
      let bestHref = links[0]?.href ?? "#about";
      let bestScore = -Infinity;

      for (const link of links) {
        const el = document.getElementById(link.href.replace("#", ""));
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        const viewH = window.innerHeight;
        const visibleTop = Math.max(rect.top, 0);
        const visibleBottom = Math.min(rect.bottom, viewH);
        const visible = Math.max(0, visibleBottom - visibleTop);
        if (visible < 48) continue;

        const sectionMid = rect.top + rect.height * 0.2;
        const dist = Math.abs(sectionMid - focusY);
        // prioriza o que está na linha de foco + o quanto aparece na tela
        const score = visible * 1.35 - dist * 0.9;

        if (score > bestScore) {
          bestScore = score;
          bestHref = link.href;
        }
      }

      setActiveHref((prev) => (prev === bestHref ? prev : bestHref));
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateActive);
    };

    updateActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [t.nav.links]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    setActiveHref(href);
  };

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-40 transition-[background,border-color,backdrop-filter] duration-400",
        scrolled || open
          ? "border-b border-[#ffe81f]/10 bg-black/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="section-pad mx-auto flex h-16 max-w-7xl items-center justify-between gap-3">
        <a
          href="#top"
          onClick={() => go("#top")}
          className="display group text-lg font-semibold tracking-tight text-[#ffe81f] transition-opacity hover:opacity-90"
        >
          {SITE.name.split(" ")[0]}
          <span className="text-[#ffe81f] transition-transform group-hover:translate-x-0.5">
            .
          </span>
        </a>

        <LayoutGroup id="desktop-nav">
          <nav
            className="hidden items-center gap-1.5 md:flex"
            aria-label={t.nav.ariaPrimary}
          >
            {t.nav.links.map((link) => {
              const active = activeHref === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setActiveHref(link.href)}
                  className={cn(
                    "relative overflow-hidden border px-3 py-2 font-mono text-[11px] tracking-[0.18em] uppercase transition-colors duration-200",
                    active
                      ? "border-[#fff566]/60 text-[#fff566]"
                      : "border-[#ffe81f]/15 text-[#ffe81f]/40 hover:border-[#ffe81f]/30 hover:text-[#ffe81f]/80",
                  )}
                  style={
                    active
                      ? {
                          textShadow:
                            "0 0 8px rgba(255,245,102,0.95), 0 0 18px rgba(255,232,31,0.7)",
                        }
                      : undefined
                  }
                >
                  {active ? (
                    <motion.span
                      layoutId="nav-active-fill"
                      className="absolute inset-0 bg-[#ffe81f]/28 shadow-[inset_0_0_24px_rgba(255,245,102,0.35)]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  ) : null}
                  <span className="relative z-10">{link.label}</span>
                </a>
              );
            })}
          </nav>
        </LayoutGroup>

        <div className="flex items-center gap-2.5">
          <LanguageSwitcher locale={locale} setLocale={setLocale} />

          <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center border border-[#ffe81f]/20 bg-black/40 text-[#ffe81f] transition-colors hover:border-[#ffe81f]/40 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={t.nav.menu}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{t.nav.menu}</span>
            <span className="flex w-4 flex-col gap-1.5">
              <motion.span
                className="block h-px w-full bg-current origin-center"
                animate={open ? { rotate: 45, y: 3.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="block h-px w-full bg-current origin-center"
                animate={open ? { rotate: -45, y: -3.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
              />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-[#ffe81f]/10 bg-black/95 md:hidden"
          >
            <nav
              className="section-pad py-5"
              aria-label={t.nav.ariaPrimary}
            >
              <ul className="flex flex-col gap-1">
                {t.nav.links.map((link, i) => {
                  const active = activeHref === link.href;
                  return (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={() => go(link.href)}
                        className={cn(
                          "flex items-center gap-4 border-b border-[#ffe81f]/8 py-3.5 transition-colors",
                          active
                            ? "text-[#ffe81f]"
                            : "text-[#ffe81f]/55 hover:text-[#ffe81f]",
                        )}
                      >
                        <span className="font-mono text-[10px] tracking-wider text-[#ffe81f]/30">
                          0{i + 1}
                        </span>
                        <span className="display text-2xl font-semibold tracking-tight">
                          {link.label}
                        </span>
                        {active ? (
                          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#ffe81f] shadow-[0_0_10px_rgba(255,232,31,0.7)]" />
                        ) : null}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function LanguageSwitcher({
  locale,
  setLocale,
}: {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}) {
  return (
    <div
      className="relative flex items-center border border-[#ffe81f]/18 bg-black/50 p-0.5"
      role="group"
      aria-label="Language"
    >
      {LOCALES.map((code) => {
        const active = locale === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            className={cn(
              "relative z-10 overflow-hidden px-2.5 py-1.5 font-mono text-[10px] tracking-wider uppercase transition-colors duration-200",
              active
                ? "text-[#fff566]"
                : "text-[#ffe81f]/35 hover:text-[#ffe81f]/70",
            )}
            style={
              active
                ? {
                    textShadow:
                      "0 0 8px rgba(255,245,102,0.95), 0 0 16px rgba(255,232,31,0.65)",
                  }
                : undefined
            }
            aria-pressed={active}
          >
            {active ? (
              <motion.span
                layoutId="lang-active"
                className="absolute inset-0 -z-10 bg-[#ffe81f]/18 shadow-[inset_0_0_16px_rgba(255,245,102,0.25)]"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            ) : null}
            {LOCALE_LABELS[code]}
          </button>
        );
      })}
    </div>
  );
}
