"use client";

import { useEffect, useState } from "react";

type Options = {
  /** Delay before mounting even if idle never fires */
  timeoutMs?: number;
  /** Prefer idle callback when available */
  useIdle?: boolean;
};

/**
 * Mount heavy UI after first paint / browser idle so the hero wins the network.
 */
export function useDeferredMount({
  timeoutMs = 900,
  useIdle = true,
}: Options = {}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const enable = () => {
      if (!cancelled) setReady(true);
    };

    const ric = window.requestIdleCallback;
    if (useIdle && typeof ric === "function") {
      idleId = ric(enable, { timeout: timeoutMs });
    } else {
      timeoutId = setTimeout(enable, Math.min(timeoutMs, 400));
    }

    return () => {
      cancelled = true;
      if (idleId !== undefined && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, [timeoutMs, useIdle]);

  return ready;
}
