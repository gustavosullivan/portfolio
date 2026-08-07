"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  LOCALES,
  LOCALE_HTML_LANG,
  LOCALE_STORAGE_KEY,
  type Locale,
} from "./config";
import { messages, type Messages } from "./messages";

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Messages;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("pt");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
      if (stored && isLocale(stored)) {
        setLocaleState(stored);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = LOCALE_HTML_LANG[locale];
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      // ignore storage errors
    }
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      t: messages[locale],
    }),
    [locale, setLocale],
  );

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within LocaleProvider");
  }
  return ctx;
}
