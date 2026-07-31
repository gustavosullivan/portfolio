"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CERTIFICATES } from "@/lib/constants";

export function Certificates() {
  return (
    <section id="certificates" className="section-pad relative overflow-hidden py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Formação"
          title="Trajetória acadêmica & profissional"
          description="Atitus, Saicon e experiência em infraestrutura municipal."
        />

        <div className="flex gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CERTIFICATES.map((cert, index) => (
            <motion.article
              key={cert.id}
              className="glass min-w-[280px] flex-1 p-6 transition-transform hover:-translate-y-1 hover:border-cyan-300/30 md:min-w-[300px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <p className="font-mono text-[11px] tracking-[0.22em] text-cyan-300/70 uppercase">
                {cert.year}
              </p>
              <h3 className="mt-3 text-lg font-medium text-white">{cert.title}</h3>
              <p className="mt-2 text-sm text-white/45">{cert.issuer}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
