"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { TECH_STACK } from "@/lib/constants";
import { TechIcon } from "@/components/tech/TechIcons";
import { useI18n } from "@/i18n";
import type { MethodologyItem, TechItem } from "@/types";
import { cn } from "@/lib/utils";

const METHOD_TONES: Record<MethodologyItem["category"], string> = {
  agile: "#ffe81f",
  engineering: "#7dd3fc",
  quality: "#86efac",
};

const CLOUD_COLORS: Record<string, string> = {
  AWS: "#FF9900",
  Azure: "#0078D4",
};

type InfoModal = {
  title: string;
  eyebrow: string;
  summary: string;
  tone: string;
};

export function TechStack() {
  const { t } = useI18n();
  const layers = t.tech.layers as readonly {
    id: TechItem["category"];
    label: string;
    blurb: string;
  }[];
  const methodGroups = t.tech.methodGroups.map((group) => ({
    ...group,
    id: group.id as MethodologyItem["category"],
    tone: METHOD_TONES[group.id as MethodologyItem["category"]],
  }));
  const methodologies = t.tech.methodologies as readonly MethodologyItem[];
  const cloudItems = t.tech.clouds.map((cloud) => ({
    ...cloud,
    color: CLOUD_COLORS[cloud.name] ?? "#ffe81f",
  }));

  const [focusLayer, setFocusLayer] = useState<TechItem["category"] | "all">(
    "all",
  );
  const [focusMethod, setFocusMethod] = useState<
    MethodologyItem["category"] | "all" | "cloud"
  >("all");
  const [activeMethod, setActiveMethod] = useState<string | null>(null);
  const [activeCloud, setActiveCloud] = useState<string | null>(null);
  const [info, setInfo] = useState<InfoModal | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!info) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setInfo(null);
        setActiveMethod(null);
        setActiveCloud(null);
      }
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [info]);

  const closeInfo = () => {
    setInfo(null);
    setActiveMethod(null);
    setActiveCloud(null);
  };

  const visible =
    focusLayer === "all"
      ? TECH_STACK
      : TECH_STACK.filter((item) => item.category === focusLayer);

  const visibleMethods =
    focusMethod === "all"
      ? methodologies
      : focusMethod === "cloud"
        ? []
        : methodologies.filter((m) => m.category === focusMethod);

  const showCloud = focusMethod === "all" || focusMethod === "cloud";
  const showMethods = focusMethod !== "cloud";

  const openMethod = (name: string) => {
    const item = methodologies.find((m) => m.name === name);
    if (!item) return;
    const group = methodGroups.find((g) => g.id === item.category);
    setActiveMethod(name);
    setActiveCloud(null);
    setInfo({
      title: item.name,
      eyebrow: group?.label ?? t.tech.methodModalFallback,
      summary: item.summary,
      tone: group?.tone ?? "#ffe81f",
    });
  };

  const openCloud = (name: string) => {
    const item = cloudItems.find((c) => c.name === name);
    if (!item) return;
    setActiveCloud(name);
    setActiveMethod(null);
    setInfo({
      title: item.name,
      eyebrow: t.tech.cloudModalEyebrow,
      summary: item.summary,
      tone: item.color,
    });
  };

  const modal =
    mounted &&
    createPortal(
      <AnimatePresence>
        {info && (
          <motion.div
            key={info.title}
            className="fixed inset-0 z-[90] flex items-center justify-center p-5 sm:p-6 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              type="button"
              aria-label="Fechar"
              className="absolute inset-0 bg-black/85 md:bg-black/75 md:backdrop-blur-sm"
              onClick={closeInfo}
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="info-modal-title"
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-full max-w-md border border-[#ffe81f]/25 bg-[#0c0614] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.55)] md:p-6"
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${info.tone}, transparent)`,
                }}
              />

              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-[10px] tracking-[0.24em] text-[#ffe81f]/55 uppercase">
                    {info.eyebrow}
                  </p>
                  <h3
                    id="info-modal-title"
                    className="display mt-1 text-2xl font-semibold text-[#ffe81f] md:text-3xl"
                  >
                    {info.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={closeInfo}
                  className="shrink-0 border border-[#ffe81f]/20 p-2 text-[#ffe81f]/60 transition-colors hover:border-[#ffe81f]/45 hover:text-[#ffe81f]"
                  aria-label="Fechar"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-[#ffe81f]/80 md:text-base md:text-[#ffe81f]/70">
                {info.summary}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body,
    );

  return (
    <section
      id="tech"
      className="section-pad relative mx-auto max-w-7xl overflow-x-clip pt-10 pb-8 md:pt-12 md:pb-10"
    >
      <div className="grid items-stretch gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="flex h-full flex-col">
          <div className="mb-6 md:min-h-[9.5rem]">
            <p className="font-mono text-xs tracking-[0.28em] text-[#ffe81f]/80 uppercase">
              {t.tech.stackEyebrow}
            </p>
            <h2 className="display glow-text mt-3 text-3xl font-semibold text-[#ffe81f] md:text-4xl lg:text-5xl">
              {t.tech.stackTitle}
            </h2>
            <p className="mt-2 text-sm text-[#ffe81f]/45 md:text-base">
              {t.tech.stackDesc}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <FilterChip
                label={t.tech.filterAll}
                active={focusLayer === "all"}
                onClick={() => setFocusLayer("all")}
              />
              {layers.map((layer) => (
                <FilterChip
                  key={layer.id}
                  label={layer.label}
                  active={focusLayer === layer.id}
                  onClick={() => setFocusLayer(layer.id)}
                />
              ))}
            </div>
          </div>

          <div className="relative flex min-h-0 flex-1 flex-col border border-[#ffe81f]/12 bg-black/35 p-4 backdrop-blur-[2px] sm:p-5 md:p-8">
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255,232,31,0.12) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />

            <div className="relative flex flex-col gap-6">
              {layers.map((layer, layerIndex) => {
                const items = visible.filter((item) => item.category === layer.id);
                if (items.length === 0) return null;

                return (
                  <motion.div
                    key={layer.id}
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

                    <div
                      className={cn(
                        "grid gap-2.5",
                        layer.id === "backend"
                          ? "grid-cols-2 sm:grid-cols-3"
                          : "grid-cols-2",
                      )}
                    >
                      {items.map((tech, i) => (
                        <motion.div
                          key={tech.name}
                          className="relative border border-[#ffe81f]/15 bg-black/40 px-3 py-3 transition-colors hover:border-[#ffe81f]/40"
                          whileHover={{ y: -2 }}
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 28,
                          }}
                        >
                          <span
                            className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: tech.color }}
                          />
                          <div className="flex items-center gap-2.5 pr-2">
                            <TechIcon
                              name={tech.name}
                              mode="color"
                              brandColor={tech.color}
                            />
                            <div className="min-w-0">
                              <span className="display block text-sm font-semibold break-words text-[#ffe81f] sm:text-base md:text-lg">
                                {tech.name}
                              </span>
                              <span className="mt-0.5 block font-mono text-[9px] tracking-wider text-[#ffe81f]/35 uppercase sm:text-[10px]">
                                0{i + 1} · {layer.label}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        <div id="methods" className="flex h-full flex-col">
          <div className="mb-6 md:min-h-[9.5rem]">
            <p className="font-mono text-xs tracking-[0.28em] text-[#ffe81f]/80 uppercase">
              {t.tech.methodsEyebrow}
            </p>
            <h2 className="display glow-text mt-3 text-3xl font-semibold text-[#ffe81f] md:text-4xl lg:text-5xl">
              {t.tech.methodsTitle}
            </h2>
            <p className="mt-2 text-sm text-[#ffe81f]/45 md:text-base">
              {t.tech.methodsDesc}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <FilterChip
                label={t.tech.filterAll}
                active={focusMethod === "all"}
                onClick={() => setFocusMethod("all")}
              />
              {methodGroups.map((group) => (
                <FilterChip
                  key={group.id}
                  label={group.label}
                  active={focusMethod === group.id}
                  onClick={() => setFocusMethod(group.id)}
                />
              ))}
              <FilterChip
                label={t.tech.cloudEyebrow}
                active={focusMethod === "cloud"}
                onClick={() => setFocusMethod("cloud")}
              />
            </div>
          </div>

          <div className="relative flex min-h-0 flex-1 flex-col border border-[#ffe81f]/12 bg-black/35 p-4 backdrop-blur-[2px] sm:p-5 md:p-8">
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255,232,31,0.12) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />

            <div className="relative flex flex-1 flex-col gap-6">
              {showMethods &&
                methodGroups.map((group, groupIndex) => {
                const items = visibleMethods.filter(
                  (m) => m.category === group.id,
                );
                if (items.length === 0) return null;

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
                      <p className="hidden text-xs text-[#ffe81f]/30 sm:block">
                        {group.blurb}
                      </p>
                    </div>

                    <div
                      className={cn(
                        "grid gap-2.5",
                        items.length >= 3
                          ? "grid-cols-2 sm:grid-cols-3"
                          : "grid-cols-2",
                      )}
                    >
                      {items.map((item, i) => {
                        const on = activeMethod === item.name;
                        return (
                          <motion.button
                            key={item.name}
                            type="button"
                            onClick={() => openMethod(item.name)}
                            className={cn(
                              "relative border bg-black/40 px-3 py-3 text-left transition-colors",
                              on
                                ? "border-[#ffe81f]/55 bg-[#ffe81f]/10"
                                : "border-[#ffe81f]/15 hover:border-[#ffe81f]/40",
                            )}
                            whileHover={{ y: -2 }}
                            transition={{
                              type: "spring",
                              stiffness: 380,
                              damping: 28,
                            }}
                          >
                            <span
                              className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full"
                              style={{
                                backgroundColor: group.tone,
                                boxShadow: on
                                  ? `0 0 12px ${group.tone}`
                                  : undefined,
                              }}
                            />
                            <div className="min-w-0 pr-2">
                              <span className="display block text-sm font-semibold break-words text-[#ffe81f] sm:text-base md:text-lg">
                                {item.name}
                              </span>
                              <span className="mt-0.5 block font-mono text-[9px] tracking-wider text-[#ffe81f]/35 uppercase sm:text-[10px]">
                                0{i + 1} · {group.label}
                              </span>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}

              {showCloud ? (
              <div
                className={cn(
                  "relative",
                  showMethods && "mt-auto border-t border-[#ffe81f]/10 pt-5",
                )}
              >
                <div className="mb-3 flex items-baseline justify-between gap-3">
                  <p className="font-mono text-[10px] tracking-[0.28em] text-[#ffe81f]/45 uppercase">
                    {t.tech.cloudEyebrow}
                  </p>
                  <p className="hidden text-xs text-[#ffe81f]/30 sm:block">
                    {t.tech.cloudBlurb}
                  </p>
                </div>
                <p className="mb-3 text-sm leading-relaxed text-[#ffe81f]/55">
                  {t.tech.cloudIntro}
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {cloudItems.map((cloud) => {
                    const on = activeCloud === cloud.name;
                    return (
                      <motion.button
                        key={cloud.name}
                        type="button"
                        onClick={() => openCloud(cloud.name)}
                        className={cn(
                          "relative border bg-black/40 px-3 py-3 text-left transition-colors",
                          on
                            ? "border-[#ffe81f]/55 bg-[#ffe81f]/10"
                            : "border-[#ffe81f]/15 hover:border-[#ffe81f]/40",
                        )}
                        whileHover={{ y: -2 }}
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 28,
                        }}
                      >
                        <span
                          className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full"
                          style={{
                            backgroundColor: cloud.color,
                            boxShadow: on
                              ? `0 0 12px ${cloud.color}`
                              : undefined,
                          }}
                        />
                        <div className="flex items-center gap-2.5 pr-2">
                          <TechIcon
                            name={cloud.name}
                            mode="color"
                            brandColor={cloud.color}
                          />
                          <div className="min-w-0">
                            <span className="display block text-sm font-semibold break-words text-[#ffe81f] sm:text-base md:text-lg">
                              {cloud.name}
                            </span>
                            <span className="mt-0.5 block font-mono text-[9px] tracking-wider text-[#ffe81f]/35 uppercase sm:text-[10px]">
                              {t.tech.cloudLabel}
                            </span>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {modal}
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
