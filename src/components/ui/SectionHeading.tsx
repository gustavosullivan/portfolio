"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  /** eyebrow grande em neon, integrado ao título de baixo */
  eyebrowAsTitle?: boolean;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  eyebrowAsTitle = false,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <motion.div
      className={cn(
        "mb-12 max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {eyebrow && (
        <p
          className={cn(
            align === "center" && "mx-auto",
            eyebrowAsTitle
              ? "display neon-title mb-1 text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl"
              : "neon-eyebrow mb-3 font-mono text-xs tracking-[0.28em] uppercase",
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "display neon-title text-4xl font-semibold md:text-5xl lg:text-6xl",
          !eyebrowAsTitle && "tron-underline",
          eyebrowAsTitle && "tron-underline leading-[1.05]",
          align === "center" && "mx-auto",
        )}
      >
        {title}
      </h2>
      {description && (
        <p className="section-heading-description mt-5 text-base leading-relaxed text-[var(--text-muted)] md:text-lg">
          {description}
        </p>
      )}
    </motion.div>
  );
}
