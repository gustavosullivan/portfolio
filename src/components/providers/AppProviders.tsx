"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLenis } from "@/hooks/useLenis";

interface AppContextValue {
  soundEnabled: boolean;
  toggleSound: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProviders({ children }: { children: ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(false);

  useLenis(true);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => !prev);
  }, []);

  const value = useMemo(
    () => ({
      soundEnabled,
      toggleSound,
    }),
    [soundEnabled, toggleSound],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProviders");
  return ctx;
}
