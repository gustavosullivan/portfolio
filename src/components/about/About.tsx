"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useI18n } from "@/i18n";

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    const total = 40;
    const id = window.setInterval(() => {
      frame += 1;
      setDisplay(Math.round((value * frame) / total));
      if (frame >= total) window.clearInterval(id);
    }, 24);
    return () => window.clearInterval(id);
  }, [inView, value]);

  return (
    <span
      ref={ref}
      className="display text-4xl font-semibold text-[#00f0ff] md:text-5xl"
    >
      {display}
      {suffix}
    </span>
  );
}

function ColumnHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6 min-h-[7.5rem] text-center">
      {eyebrow ? (
        <p className="neon-eyebrow font-mono text-xs tracking-[0.28em] uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={`display neon-title tron-underline mx-auto text-3xl font-semibold md:text-4xl ${eyebrow ? "mt-3" : ""}`}
      >
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-2 text-sm text-[var(--text-muted)]">{subtitle}</p>
      ) : null}
    </div>
  );
}

export function About() {
  const { t } = useI18n();
  const experienceSubtitle = t.experiences.map((e) => e.company).join(" · ");

  return (
    <section
      id="about"
      className="section-pad relative mx-auto max-w-7xl overflow-x-clip pt-20 pb-10 md:pt-24 md:pb-12"
    >
      <div className="grid gap-10 lg:grid-cols-2 lg:items-stretch lg:gap-12">
        <motion.div
          className="flex h-full flex-col"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <ColumnHeader
            title={t.aboutUi.profileTitle}
            subtitle={t.site.location}
          />

          <div className="glass relative flex min-h-0 flex-1 flex-col overflow-hidden bg-black/55 p-6 backdrop-blur-md transition-colors hover:border-[#00f0ff]/30 md:p-8">
            <p className="relative text-base leading-relaxed text-[#00f0ff]/70 md:text-lg">
              {t.site.about}
            </p>

            <ul className="relative mt-6 space-y-1.5">
              {t.aboutUi.focus.map((item) => (
                <li key={item} className="text-sm text-[#00f0ff]/65">
                  <span className="mr-2 text-[#00f0ff]">▸</span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="relative mt-auto grid grid-cols-3 gap-4 pt-10 sm:gap-6">
              {t.stats.map((stat) => (
                <div key={stat.label}>
                  <Counter value={stat.value} suffix={stat.suffix} />
                  <p className="mt-2 text-[10px] tracking-wide text-[#00f0ff]/40 uppercase sm:text-xs">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          className="flex h-full flex-col"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.08 }}
        >
          <ColumnHeader
            eyebrow={t.aboutUi.careerEyebrow}
            title={t.aboutUi.experienceTitle}
            subtitle={experienceSubtitle}
          />

          <div className="flex min-h-0 flex-1 flex-col gap-4">
            {t.experiences.map((exp, index) => (
              <motion.article
                key={exp.id}
                className="glass group flex-1 bg-black/55 p-6 backdrop-blur-md transition-colors hover:border-[#00f0ff]/30 md:p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.55 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-medium text-[#00f0ff]">
                      {exp.role}
                    </h3>
                    <p className="text-sm text-[#00f0ff]/80">{exp.company}</p>
                  </div>
                  <span className="shrink-0 font-mono text-[11px] tracking-wider text-[#00f0ff]/35 uppercase">
                    {exp.period}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#00f0ff]/50">
                  {exp.description}
                </p>
                <ul className="mt-4 space-y-1.5">
                  {exp.highlights.map((item) => (
                    <li key={item} className="text-sm text-[#00f0ff]/65">
                      <span className="mr-2 text-[#00f0ff]">▸</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
