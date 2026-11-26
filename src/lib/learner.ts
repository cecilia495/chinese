import type { Locale } from "./i18n";

export const levels = ["1", "2", "3", "4", "5", "6", "7–9"] as const;
export type Level = (typeof levels)[number];
export interface LearnerPreferences {
  locale: Locale;
  level: Level;
}

export function isLevel(value: unknown): value is Level {
  return levels.some((level) => level === value);
}

export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "zh";
}
