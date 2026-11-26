export const supportLanguages = {
  zh: "中文", en: "English", fr: "Français", ru: "Русский", ar: "العربية", es: "Español",
} as const;

export type SupportLanguage = keyof typeof supportLanguages;

export function isSupportLanguage(value: unknown): value is SupportLanguage {
  return typeof value === "string" && Object.hasOwn(supportLanguages, value);
}
