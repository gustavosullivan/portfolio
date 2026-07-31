"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
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
        <p className="mb-3 font-mono text-xs tracking-[0.28em] text-[#ffe81f]/90 uppercase">
          {eyebrow}
        </p>
      )}
      <h2 className="display glow-text text-4xl font-semibold text-[#ffe81f] md:text-5xl lg:text-6xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-[#ffe81f]/55 md:text-lg">
          {description}
        </p>
      )}
    </motion.div>
  );
}
