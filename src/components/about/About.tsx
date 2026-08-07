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
      className="display text-4xl font-semibold text-[#ffe81f] md:text-5xl"
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
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-6 min-h-[7.5rem]">
      <p className="font-mono text-xs tracking-[0.28em] text-[#ffe81f]/80 uppercase">
        {eyebrow}
      </p>
      <h2 className="display glow-text mt-3 text-3xl font-semibold text-[#ffe81f] md:text-4xl">
        {title}
      </h2>
      <p className="mt-2 text-sm text-[#ffe81f]/45">{subtitle}</p>
    </div>
  );
}

export function About() {
  const { t } = useI18n();
  const experienceSubtitle = t.experiences.map((e) => e.company).join(" · ");

  return (
    <section id="about" className="section-pad relative mx-auto max-w-7xl pt-20 pb-10 md:pt-24 md:pb-12">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-stretch lg:gap-12">
        {/* Perfil */}
        <motion.div
          className="flex h-full flex-col"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <ColumnHeader
            eyebrow={t.aboutUi.descriptionEyebrow}
            title={t.aboutUi.profileTitle}
            subtitle={t.site.education}
          />

          <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden border border-white/10 bg-black/55 backdrop-blur-md p-8 md:p-10">
            <div className="absolute -top-20 -right-16 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
            <p className="relative text-lg leading-relaxed text-[#ffe81f]/70 md:text-xl">
              {t.site.about}
            </p>
            <p className="relative mt-5 text-sm text-[#ffe81f]/40">
              {t.site.location}
            </p>

            <div className="relative mt-auto grid grid-cols-2 gap-6 pt-10">
              {t.stats.map((stat) => (
                <div key={stat.label}>
                  <Counter value={stat.value} suffix={stat.suffix} />
                  <p className="mt-2 text-xs tracking-wide text-[#ffe81f]/40 uppercase">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Experiência */}
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
                className="glass group flex-1 bg-black/55 p-6 backdrop-blur-md transition-colors hover:border-cyan-300/30 md:p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.55 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-medium text-[#ffe81f]">
                      {exp.role}
                    </h3>
                    <p className="text-sm text-[#ffe81f]/80">{exp.company}</p>
                  </div>
                  <span className="shrink-0 font-mono text-[11px] tracking-wider text-[#ffe81f]/35 uppercase">
                    {exp.period}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#ffe81f]/50">
                  {exp.description}
                </p>
                <ul className="mt-4 space-y-1.5">
                  {exp.highlights.map((item) => (
                    <li key={item} className="text-sm text-[#ffe81f]/65">
                      <span className="mr-2 text-[#ffe81f]">▸</span>
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
