"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { METHODOLOGIES, TECH_STACK } from "@/lib/constants";
import type { MethodologyItem, TechItem } from "@/types";
import { cn } from "@/lib/utils";

const LAYERS: {
  id: TechItem["category"];
  label: string;
  blurb: string;
}[] = [
  { id: "frontend", label: "Interface", blurb: "UI e apps web" },
  { id: "backend", label: "APIs", blurb: "Serviços e regras" },
  { id: "infra", label: "Dados & infra", blurb: "Persistência e deploy" },
  { id: "tools", label: "Fluxo", blurb: "Versionamento" },
];

const METHOD_GROUPS: {
  id: MethodologyItem["category"];
  label: string;
  tone: string;
}[] = [
  { id: "agile", label: "Agilidade", tone: "#ffe81f" },
  { id: "engineering", label: "Engenharia", tone: "#7dd3fc" },
  { id: "quality", label: "Qualidade", tone: "#86efac" },
];

export function TechStack() {
  const [focusLayer, setFocusLayer] = useState<TechItem["category"] | "all">(
    "all",
  );
  const [method, setMethod] = useState(METHODOLOGIES[0]?.name ?? null);

  const selectedMethod =
    METHODOLOGIES.find((m) => m.name === method) ?? METHODOLOGIES[0] ?? null;

  const visible =
    focusLayer === "all"
      ? TECH_STACK
      : TECH_STACK.filter((t) => t.category === focusLayer);

  return (
    <section id="tech" className="section-pad relative mx-auto max-w-7xl py-28">
      <div className="grid items-stretch gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Coluna Tecnologias */}
        <div className="flex h-full flex-col">
          <div className="mb-6 min-h-[9.5rem]">
            <p className="font-mono text-xs tracking-[0.28em] text-[#ffe81f]/80 uppercase">
              Stack
            </p>
            <h2 className="display glow-text mt-3 text-3xl font-semibold text-[#ffe81f] md:text-4xl lg:text-5xl">
              Tecnologias
            </h2>
            <p className="mt-2 text-sm text-[#ffe81f]/45 md:text-base">
              Ferramentas do dia a dia — do front à infra.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <FilterChip
                label="Tudo"
                active={focusLayer === "all"}
                onClick={() => setFocusLayer("all")}
              />
              {LAYERS.map((layer) => (
                <FilterChip
                  key={layer.id}
                  label={layer.label}
                  active={focusLayer === layer.id}
                  onClick={() => setFocusLayer(layer.id)}
                />
              ))}
            </div>
          </div>

          <div className="relative flex min-h-0 flex-1 flex-col border border-[#ffe81f]/12 bg-black/35 p-5 backdrop-blur-[2px] md:p-8">
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255,232,31,0.12) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />

            <div className="relative flex flex-1 flex-col justify-between gap-8">
              {LAYERS.map((layer, layerIndex) => {
                const items = visible.filter((t) => t.category === layer.id);
                if (items.length === 0) return null;

                return (
                  <motion.div
                    key={layer.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: layerIndex * 0.06, duration: 0.45 }}
                  >
                    <div className="mb-3 flex items-baseline justify-between gap-3">
                      <p className="font-mono text-[10px] tracking-[0.28em] text-[#ffe81f]/45 uppercase">
                        {layer.label}
                      </p>
                      <p className="hidden text-xs text-[#ffe81f]/30 sm:block">
                        {layer.blurb}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {items.map((tech, i) => (
                        <motion.div
                          key={tech.name}
                          layout
                          className="relative overflow-hidden border border-[#ffe81f]/15 bg-black/40 px-4 py-3"
                          whileHover={{
                            y: -2,
                            borderColor: "rgba(255,232,31,0.4)",
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 28,
                          }}
                        >
                          <span
                            className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: tech.color }}
                          />
                          <span className="display block text-lg font-semibold text-[#ffe81f] md:text-xl">
                            {tech.name}
                          </span>
                          <span className="mt-1 block font-mono text-[10px] tracking-wider text-[#ffe81f]/35 uppercase">
                            0{i + 1} · {layer.label}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Coluna Metodologias */}
        <div id="methods" className="flex h-full flex-col">
          <div className="mb-6 min-h-[9.5rem]">
            <p className="font-mono text-xs tracking-[0.28em] text-[#ffe81f]/80 uppercase">
              Metodologias
            </p>
            <h2 className="display glow-text mt-3 text-3xl font-semibold text-[#ffe81f] md:text-4xl lg:text-5xl">
              Como eu entrego
            </h2>
            <p className="mt-2 text-sm text-[#ffe81f]/45 md:text-base">
              Processo e qualidade no dia a dia.
            </p>
          </div>

          <aside className="relative flex min-h-0 flex-1 flex-col border border-[#ffe81f]/12 bg-black/35 p-5 backdrop-blur-[2px] md:p-8">
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255,232,31,0.12) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />

            <div className="relative flex flex-1 flex-col justify-between gap-8">
              {METHOD_GROUPS.map((group, groupIndex) => {
                const items = METHODOLOGIES.filter(
                  (m) => m.category === group.id,
                );
                return (
                  <motion.div
                    key={group.id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: groupIndex * 0.06, duration: 0.45 }}
                  >
                    <div className="mb-3 flex items-baseline justify-between gap-3">
                      <p className="font-mono text-[10px] tracking-[0.28em] text-[#ffe81f]/45 uppercase">
                        {group.label}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {items.map((item, i) => {
                        const on = method === item.name;
                        return (
                          <motion.button
                            key={item.name}
                            type="button"
                            onMouseEnter={() => setMethod(item.name)}
                            onFocus={() => setMethod(item.name)}
                            onClick={() => setMethod(item.name)}
                            className={cn(
                              "relative overflow-hidden border px-4 py-3 text-left transition-colors",
                              on
                                ? "border-[#ffe81f]/55 bg-[#ffe81f]/10"
                                : "border-[#ffe81f]/15 bg-black/40 hover:border-[#ffe81f]/35",
                            )}
                            whileHover={{ y: -2 }}
                            transition={{
                              type: "spring",
                              stiffness: 380,
                              damping: 28,
                            }}
                          >
                            <span
                              className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full"
                              style={{
                                backgroundColor: group.tone,
                                boxShadow: on
                                  ? `0 0 12px ${group.tone}`
                                  : undefined,
                              }}
                            />
                            <span className="display block text-lg font-semibold text-[#ffe81f] md:text-xl">
                              {item.name}
                            </span>
                            <span className="mt-1 block font-mono text-[10px] tracking-wider text-[#ffe81f]/35 uppercase">
                              0{i + 1} · {group.label}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="relative mt-8 border-t border-[#ffe81f]/10 pt-5">
              <AnimatePresence mode="wait">
                {selectedMethod && (
                  <motion.div
                    key={selectedMethod.name}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.22 }}
                  >
                    <p className="font-mono text-[10px] tracking-[0.2em] text-[#ffe81f]/40 uppercase">
                      Na prática · {selectedMethod.name}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-[#ffe81f]/65">
                      {selectedMethod.summary}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "border px-3 py-1.5 font-mono text-[10px] tracking-[0.18em] uppercase transition-colors",
        active
          ? "border-[#ffe81f]/50 bg-[#ffe81f]/15 text-[#ffe81f]"
          : "border-[#ffe81f]/15 text-[#ffe81f]/45 hover:border-[#ffe81f]/30 hover:text-[#ffe81f]/70",
      )}
    >
      {label}
    </button>
  );
}
