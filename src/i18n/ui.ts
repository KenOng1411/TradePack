import en from "./en.json";
import ko from "./ko.json";
import de from "./de.json";
import vi from "./vi.json";
import zhHant from "./zh-hant.json";
import type { Locale } from "./routes";

export const UI_STRINGS: Record<Locale, typeof en> = {
  en,
  ko,
  de,
  vi,
  "zh-hant": zhHant,
};

export function useTranslations(locale: Locale) {
  return UI_STRINGS[locale] ?? UI_STRINGS.en;
}
