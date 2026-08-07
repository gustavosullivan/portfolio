import type { Locale } from "../config";
import { pt } from "./pt";
import { en } from "./en";
import { es } from "./es";
import type { Messages } from "./types";

export type { Messages } from "./types";
export const messages: Record<Locale, Messages> = { pt, en, es };
