"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EXPERIENCES } from "@/lib/constants";

const MILESTONES = [
  {
    year: "Estágio",
    title: "Prefeitura de Passo Fundo",
    detail:
      "Infraestrutura e redes — hardware, Clonezilla, Wi-Fi, racks e suporte técnico.",
  },
  {
    year: "Atual",
    title: "Saicon Sistemas de Pesagem",
    detail:
      "Full Stack & Product Owner — apps para balanças industriais, ciclo completo do produto.",
  },
  {
    year: "2025+",
    title: "SN800",
    detail:
      "SaaS multi-tenant de pesagem florestal com Next.js, Supabase, RLS e Edge Functions.",
  },
  {
    year: "Prod",
    title: "SN250",
    detail:
      "Gestão de confinamentos com FastAPI, Redis, Docker e integração RFID.",
  },
  {
    year: "Live",
    title: "Truco Games",
    detail:
      "Truco online em tempo real com WebSocket, React, Node.js e Neon.",
  },
];

export function Timeline() {
  return (
    <section id="timeline" className="section-pad relative mx-auto max-w-5xl py-28">
      <SectionHeading
        eyebrow="Experiência"
        title="Trajetória"
        description="Da infraestrutura municipal a sistemas industriais em produção."
      />

      <div className="relative">
        <div className="absolute top-0 bottom-0 left-[11px] w-px bg-gradient-to-b from-cyan-400/60 via-blue-400/30 to-transparent md:left-1/2 md:-translate-x-1/2" />

        <ul className="space-y-10">
          {MILESTONES.map((item, index) => (
            <motion.li
              key={item.title}
              className="relative grid gap-4 md:grid-cols-2"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: index * 0.05, duration: 0.55 }}
            >
              <div
                className={`pl-10 md:pl-0 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:col-start-2 md:pl-12"}`}
              >
                <span className="font-mono text-xs tracking-[0.24em] text-cyan-300/80 uppercase">
                  {item.year}
                </span>
                <h3 className="display mt-2 text-2xl font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/50">{item.detail}</p>
              </div>
              <span className="absolute top-2 left-0 h-6 w-6 rounded-full border border-[#ff2bd6]/50 bg-[#030208] shadow-[0_0_18px_rgba(255,43,214,0.5)] md:left-1/2 md:-translate-x-1/2">
                <span className="absolute inset-1.5 rounded-full bg-[#7cff3a]" />
              </span>
            </motion.li>
          ))}
        </ul>

        <motion.p
          className="mt-14 text-center text-sm text-white/35"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Atualmente: {EXPERIENCES[0]?.role} @ {EXPERIENCES[0]?.company}
        </motion.p>
      </div>
    </section>
  );
}
