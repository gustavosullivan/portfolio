"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Code2 } from "lucide-react";
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
  const [activeId, setActiveId] = useState(PROJECTS[0]?.id);

  const filtered =
    filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);
  const active = PROJECTS.find((p) => p.id === activeId) ?? filtered[0];

  return (
    <section
      id="projects"
      className="section-pad relative mx-auto max-w-7xl overflow-hidden py-28"
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

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-3" style={{ perspective: 1200 }}>
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <HoloCard
                key={project.id}
                as="button"
                active={active?.id === project.id}
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
                <p className="mt-1 text-sm text-[#ffe81f]/50">{project.subtitle}</p>
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

        <AnimatePresence mode="wait">
          {active && (
            <motion.div
              key={active.id}
              initial={{ opacity: 0, x: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -12, filter: "blur(6px)" }}
              transition={{ duration: 0.45 }}
              style={{ perspective: 1200 }}
            >
              <HoloCard accent={active.accent} className="h-full p-7 md:p-9">
                <p className="font-mono text-xs tracking-[0.24em] text-[#ffe81f]/40 uppercase">
                  Case study
                </p>
                <h3 className="display glow-text mt-2 text-4xl font-semibold text-[#ffe81f]">
                  {active.title}
                </h3>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#ffe81f]/60">
                  {active.description}
                </p>

                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="mb-3 font-mono text-[11px] tracking-wider text-[#ff2bd6]/80 uppercase">
                      Features
                    </h4>
                    <ul className="space-y-2">
                      {active.features.map((feature) => (
                        <li key={feature} className="text-sm text-white/65">
                          <span className="mr-2 text-[#7cff3a]">▸</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-3 font-mono text-[11px] tracking-wider text-[#ff2bd6]/80 uppercase">
                      Architecture
                    </h4>
                    <p className="text-sm leading-relaxed text-white/55">
                      {active.architecture}
                    </p>
                    <div className="mt-5 grid grid-cols-3 gap-3">
                      {active.metrics.map((metric) => (
                        <div
                          key={metric.label}
                          className="border border-white/10 bg-black/30 p-3"
                        >
                          <p className="font-mono text-[10px] text-white/35 uppercase">
                            {metric.label}
                          </p>
                          <p className="mt-1 text-sm text-white">{metric.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
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
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
