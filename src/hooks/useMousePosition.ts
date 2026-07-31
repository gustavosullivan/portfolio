"use client";

import { useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

export function useMousePosition(stiffness = 150, damping = 25) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness, damping });
  const springY = useSpring(y, { stiffness, damping });

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y]);

  return { x: springX, y: springY, rawX: x, rawY: y };
}
