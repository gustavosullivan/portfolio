export const LOCALES = ["pt", "en", "es"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  pt: "PT-BR",
  en: "EN",
  es: "ES",
};

export const LOCALE_HTML_LANG: Record<Locale, string> = {
  pt: "pt-BR",
  en: "en",
  es: "es",
};

export const LOCALE_STORAGE_KEY = "gp-portfolio-locale";
