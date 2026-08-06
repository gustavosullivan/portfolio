"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "ghost";
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
}

export function MagneticButton({
  children,
  className,
  href,
  variant = "primary",
  type = "button",
  disabled,
  onClick,
}: MagneticButtonProps) {
  const classes = cn(
    "group relative inline-flex items-center justify-center overflow-hidden px-6 py-3 text-sm font-medium tracking-wide transition-[transform,colors] duration-200 disabled:cursor-not-allowed disabled:opacity-60 hover:scale-[1.03] active:scale-[0.98]",
    variant === "primary"
      ? "bg-[#ffe81f] text-black hover:bg-[#fff6a0]"
      : "glass text-[#ffe81f] hover:border-[#ffe81f]/50",
    className,
  );

  const inner = (
    <>
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 translate-y-full bg-gradient-to-r from-[#ffe81f]/30 via-white/10 to-[#ffe81f]/20 transition-transform duration-500 group-hover:translate-y-0" />
    </>
  );

  if (href) {
    return (
      <a href={href} data-cursor="magnetic" className={classes}>
        {inner}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      data-cursor="magnetic"
      className={classes}
    >
      {inner}
    </button>
  );
}
