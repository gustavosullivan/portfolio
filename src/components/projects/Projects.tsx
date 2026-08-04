"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Code2, X } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HoloCard } from "@/components/ui/HoloCard";
import { PROJECTS } from "@/lib/constants";
import type { ProjectCategory } from "@/types";
import { cn } from "@/lib/utils";

const FILTERS: { id: ProjectCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "saas", label: "SaaS" },
  { id: "systems", label: "Systems" },
  { id: "web", label: "Web" },
];

export function Projects() {
  const [filter, setFilter] = useState<ProjectCategory>("all");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const filtered =
    filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);
  const active = activeId
    ? (PROJECTS.find((p) => p.id === activeId) ?? null)
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
            className="fixed inset-0 z-[90] flex items-center justify-center p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <button
              type="button"
              aria-label="Fechar"
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
              onClick={() => setActiveId(null)}
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-modal-title"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-full max-w-3xl overflow-hidden"
              style={{ perspective: 1200 }}
            >
              <HoloCard accent={active.accent} className="p-6 md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs tracking-[0.24em] text-[#ffe81f]/40 uppercase">
                      Case study
                    </p>
                    <h3
                      id="project-modal-title"
                      className="display glow-text mt-2 text-3xl font-semibold text-[#ffe81f] md:text-4xl"
                    >
                      {active.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveId(null)}
                    className="shrink-0 border border-[#ffe81f]/20 p-2 text-[#ffe81f]/60 transition-colors hover:border-[#ffe81f]/45 hover:text-[#ffe81f]"
                    aria-label="Fechar modal"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#ffe81f]/60 md:text-base">
                  {active.description}
                </p>

                <div className="mt-6 grid gap-5 md:grid-cols-2 md:gap-6">
                  <div>
                    <h4 className="mb-2 font-mono text-[11px] tracking-wider text-[#ff2bd6]/80 uppercase">
                      Features
                    </h4>
                    <ul className="space-y-1.5">
                      {active.features.map((feature) => (
                        <li key={feature} className="text-sm text-white/65">
                          <span className="mr-2 text-[#7cff3a]">▸</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-2 font-mono text-[11px] tracking-wider text-[#ff2bd6]/80 uppercase">
                      Architecture
                    </h4>
                    <p className="text-sm leading-relaxed text-white/55">
                      {active.architecture}
                    </p>
                    <div className="mt-4 grid grid-cols-3 gap-2.5">
                      {active.metrics.map((metric) => (
                        <div
                          key={metric.label}
                          className="border border-white/10 bg-black/30 p-2.5"
                        >
                          <p className="font-mono text-[10px] text-white/35 uppercase">
                            {metric.label}
                          </p>
                          <p className="mt-1 text-sm text-white">
                            {metric.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  {active.liveUrl && (
                    <a
                      href={active.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 bg-white px-4 py-2 text-sm text-black transition-colors hover:bg-[#7cff3a]"
                    >
                      Live Demo <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {active.githubUrl && (
                    <a
                      href={active.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="glass inline-flex items-center gap-2 px-4 py-2 text-sm text-white"
                    >
                      GitHub <Code2 className="h-3.5 w-3.5" />
                    </a>
                  )}
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
      className="section-pad relative mx-auto max-w-7xl overflow-hidden pt-6 pb-10 md:pt-8 md:pb-12"
    >
      <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-[#ff2bd6]/10 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-[#7cff3a]/8 blur-[90px]" />

      <SectionHeading
        eyebrow="Projetos"
        title="Profissionais"
        description="SN800, SN250 e Truco Games — sistemas em produção com ownership Full Stack."
      />

      <div className="mb-8 flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={cn(
              "px-4 py-2 font-mono text-xs tracking-wider uppercase transition-colors",
              filter === item.id
                ? "bg-white text-black"
                : "glass text-white/60 hover:text-white",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mx-auto grid max-w-2xl gap-3" style={{ perspective: 1200 }}>
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
                <h3 className="display text-2xl font-semibold text-[#ffe81f]">
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
              <p className="mt-1 text-sm text-[#ffe81f]/50">
                {project.subtitle}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tech.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="border border-[#ffe81f]/20 px-2 py-1 font-mono text-[10px] tracking-wider text-[#ffe81f]/45 uppercase"
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
