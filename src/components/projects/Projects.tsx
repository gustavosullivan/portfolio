"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Code2, X } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HoloCard } from "@/components/ui/HoloCard";
import { PROJECTS } from "@/lib/constants";
import { useI18n } from "@/i18n";
import type { ProjectCategory } from "@/types";
import { cn } from "@/lib/utils";

export function Projects() {
  const { t } = useI18n();
  const projects = PROJECTS.map((p) => {
    const tr = t.projects.items.find((i) => i.id === p.id);
    return tr
      ? {
          ...p,
          ...tr,
          tech: p.tech,
          accent: p.accent,
          liveUrl: p.liveUrl,
          githubUrl: p.githubUrl,
          category: p.category,
          underConstruction: p.underConstruction,
        }
      : p;
  });

  const [filter, setFilter] = useState<ProjectCategory>("all");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const filtered =
    filter === "all"
      ? projects
      : projects.filter((p) => p.category === filter);
  const active = activeId
    ? (projects.find((p) => p.id === activeId) ?? null)
    : null;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!activeId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveId(null);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [activeId]);

  const modal =
    mounted &&
    createPortal(
      <AnimatePresence>
        {active && (
          <motion.div
            key={active.id}
            className="fixed inset-0 z-[90] flex items-center justify-center p-5 sm:p-6 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <button
              type="button"
              aria-label={t.projects.close}
              className="absolute inset-0 bg-black/85 md:bg-black/75 md:backdrop-blur-sm"
              onClick={() => setActiveId(null)}
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-modal-title"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-full max-w-lg overflow-hidden md:max-w-3xl"
            >
              <HoloCard
                accent={active.accent}
                solid
                tilt={false}
                className="overflow-hidden p-3.5 sm:p-5 md:p-8"
              >
                <div className="flex items-start justify-between gap-3 md:gap-4">
                  <div className="min-w-0">
                    <p className="neon-label font-mono text-[10px] md:text-xs">
                      {t.projects.caseStudy}
                    </p>
                    <h3
                      id="project-modal-title"
                      className="display neon-title mt-1 text-lg font-semibold sm:text-xl md:mt-2 md:text-4xl"
                    >
                      {active.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveId(null)}
                    className="shrink-0 border border-[#00f0ff]/20 p-2 text-[#00f0ff]/60 transition-colors hover:border-[#00f0ff]/45 hover:text-[#00f0ff]"
                    aria-label={t.projects.closeModal}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {active.underConstruction && (
                  <div
                    role="alert"
                    className="warn-blink mt-3 border border-amber-400/70 bg-amber-500/15 px-3 py-2.5 text-center font-mono text-[11px] tracking-[0.14em] text-amber-300 uppercase sm:mt-4 sm:text-xs"
                  >
                    ⚠ {t.projects.underConstruction}
                  </div>
                )}

                <p className="mt-2 max-w-2xl text-[13px] leading-snug text-[#00f0ff]/80 sm:mt-3 sm:text-sm sm:leading-relaxed md:text-base md:text-[#00f0ff]/70">
                  {active.description}
                </p>

                <div className="mt-3 grid gap-3 sm:mt-4 sm:gap-4 md:mt-6 md:grid-cols-2 md:gap-6">
                  <div>
                    <h4 className="neon-label mb-1.5 font-mono text-[11px] sm:mb-2">
                      {t.projects.features}
                    </h4>
                    <ul className="space-y-1 sm:space-y-1.5">
                      {active.features.map((feature) => (
                        <li
                          key={feature}
                          className="text-[13px] text-white/80 sm:text-sm md:text-white/65"
                        >
                          <span className="mr-2 text-[#7cff3a]">▸</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col">
                    <h4 className="neon-label mb-1.5 font-mono text-[11px] sm:mb-2">
                      {t.projects.architecture}
                    </h4>
                    <p className="text-[13px] leading-snug text-white/75 sm:text-sm sm:leading-relaxed md:text-white/55">
                      {active.architecture}
                    </p>
                    <div className="mt-3 grid grid-cols-3 gap-1.5 sm:mt-4 sm:gap-2 md:gap-2.5">
                      {active.metrics.map((metric) => (
                        <div
                          key={metric.label}
                          className="border border-white/10 bg-black/30 p-1.5 sm:p-2 md:p-2.5"
                        >
                          <p className="font-mono text-[10px] text-white/35 uppercase">
                            {metric.label}
                          </p>
                          <p className="mt-0.5 text-xs text-white sm:mt-1 md:text-sm">
                            {metric.value}
                          </p>
                        </div>
                      ))}
                    </div>
                    {(active.liveUrl || active.githubUrl) && (
                      <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 sm:mt-5">
                        {active.liveUrl && (
                          <a
                            href={active.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 bg-white px-5 py-2 text-sm text-black transition-colors hover:bg-[#7cff3a]"
                          >
                            {t.projects.visit}{" "}
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {active.githubUrl && (
                          <a
                            href={active.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="glass inline-flex items-center gap-2 px-4 py-2 text-sm text-white"
                          >
                            {t.projects.github}{" "}
                            <Code2 className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </HoloCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body,
    );

  return (
    <section
      id="projects"
      className="cv-auto section-pad relative mx-auto max-w-7xl overflow-x-clip pt-6 pb-10 md:pt-8 md:pb-12"
    >
      <div className="pointer-events-none absolute -top-16 right-0 hidden h-56 w-56 rounded-full bg-[#ff2bd6]/10 blur-[80px] md:block" />
      <div className="pointer-events-none absolute bottom-0 left-0 hidden h-48 w-48 rounded-full bg-[#7cff3a]/8 blur-[70px] md:block" />

      <SectionHeading
        eyebrow={t.projects.eyebrow}
        eyebrowAsTitle
        title={t.projects.title}
        description={t.projects.description}
        className="mb-5"
      />

      <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
        {t.projects.filters.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id as ProjectCategory)}
            className={cn(
              "border px-3.5 py-1.5 font-mono text-[10px] tracking-[0.18em] uppercase transition-[colors,box-shadow]",
              filter === item.id
                ? "border-[#00f0ff]/55 bg-[#00f0ff]/15 text-[#00f0ff] shadow-[0_0_16px_rgba(0,240,255,0.22)]"
                : "border-[#00f0ff]/20 text-[#00f0ff]/55 hover:border-[#00f0ff]/40 hover:text-[#00f0ff]",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mx-auto grid w-full max-w-2xl gap-3 md:[perspective:1200px]">
        <AnimatePresence mode="popLayout">
          {filtered.map((project) => (
            <HoloCard
              key={project.id}
              as="button"
              active={activeId === project.id}
              accent={project.accent}
              onClick={() => setActiveId(project.id)}
              className="w-full p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="display text-2xl font-semibold text-[#00f0ff]">
                  {project.title}
                </h3>
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    background: project.accent,
                    boxShadow: `0 0 14px ${project.accent}`,
                  }}
                />
              </div>
              <p className="mt-1 text-sm text-[#00f0ff]/50">
                {project.subtitle}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tech.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="border border-[#00f0ff]/20 px-2 py-1 font-mono text-[10px] tracking-wider text-[#00f0ff]/45 uppercase"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </HoloCard>
          ))}
        </AnimatePresence>
      </div>

      {modal}
    </section>
  );
}
