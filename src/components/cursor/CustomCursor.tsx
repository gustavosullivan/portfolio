"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useIsMobile } from "@/hooks/useMediaQuery";

export function CustomCursor() {
  const isMobile = useIsMobile();
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 420, damping: 32, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 420, damping: 32, mass: 0.4 });
  const trailX = useSpring(x, { stiffness: 120, damping: 28, mass: 0.6 });
  const trailY = useSpring(y, { stiffness: 120, damping: 28, mass: 0.6 });

  useEffect(() => {
    if (isMobile) return;

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const interactive = target?.closest(
        "a, button, [data-cursor='magnetic'], input, textarea, [role='button']",
      );
      setHovering(Boolean(interactive));
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, [isMobile, x, y]);

  if (isMobile || !visible) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[90] mix-blend-difference"
        style={{ x: trailX, y: trailY, translateX: "-50%", translateY: "-50%" }}
      >
        <div
          className={`rounded-full border border-white/40 transition-all duration-300 ${
            hovering ? "h-14 w-14 bg-white/10" : "h-8 w-8"
          }`}
        />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[91]"
        style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
      >
        <div
          className={`rounded-full bg-[#ffe81f] shadow-[0_0_22px_rgba(255,232,31,0.9)] transition-all duration-200 ${
            hovering ? "h-2 w-2 scale-150" : "h-1.5 w-1.5"
          }`}
        />
      </motion.div>
    </>
  );
}
