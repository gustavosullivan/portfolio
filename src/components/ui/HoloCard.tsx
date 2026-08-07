"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { ReactNode, MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface HoloCardProps {
  children: ReactNode;
  className?: string;
  active?: boolean;
  onClick?: () => void;
  accent?: string;
  as?: "button" | "article";
  /** Fundo sólido sem blur — melhor legibilidade em modais (mobile) */
  solid?: boolean;
}

export function HoloCard({
  children,
  className,
  active,
  onClick,
  accent = "#ff2bd6",
  as = "article",
  solid = false,
}: HoloCardProps) {
  const ref = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [9, -9]), {
    stiffness: 180,
    damping: 18,
  });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-11, 11]), {
    stiffness: 180,
    damping: 18,
  });
  const glareX = useTransform(mx, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(my, [-0.5, 0.5], [0, 100]);

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const shared = {
    ref: ref as never,
    onClick,
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    style: {
      rotateX: rx,
      rotateY: ry,
      transformStyle: "preserve-3d" as const,
      transformPerspective: 900,
    },
    className: cn(
      "group relative overflow-hidden border text-left transition-shadow",
      solid
        ? "bg-[#0c0614] backdrop-blur-none"
        : "bg-[rgba(12,6,20,0.72)] backdrop-blur-xl",
      active
        ? "border-[#ff2bd6]/45 shadow-[0_0_48px_rgba(255,43,214,0.18)]"
        : "border-white/10 hover:border-white/25",
      className,
    ),
  };

  const content = (
    <>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-90"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at ${glareX}% ${glareY}%, ${accent}33, transparent 45%)`,
        }}
      />
      <div className="relative z-10" style={{ transform: "translateZ(28px)" }}>
        {children}
      </div>
    </>
  );

  if (as === "button") {
    return (
      <motion.button type="button" {...shared}>
        {content}
      </motion.button>
    );
  }

  return <motion.article {...shared}>{content}</motion.article>;
}
