"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** CSS rootMargin for IntersectionObserver */
  rootMargin?: string;
  /** Min height while waiting (avoids layout jump) */
  minHeight?: string | number;
  className?: string;
  /** Optional id on the sentinel wrapper */
  id?: string;
};

/**
 * Renders children only when the sentinel approaches the viewport.
 * Keeps below-fold JS/assets off the critical path.
 */
export function WhenNear({
  children,
  rootMargin = "280px 0px",
  minHeight,
  className,
  id,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || show) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, show]);

  return (
    <div
      ref={ref}
      id={id}
      className={className}
      style={minHeight !== undefined ? { minHeight } : undefined}
    >
      {show ? children : null}
    </div>
  );
}
