/** @file The 11 site locales, their native names and the tags derived from them. */

/** Supported locales, default first. */
export const LOCALES = ["en", "ru", "uk", "es", "pt", "de", "fr", "it", "ja", "ko", "zh"] as const;

/** One supported locale. */
export type Locale = (typeof LOCALES)[number];

/** The default locale. */
export const DEFAULT_LOCALE: Locale = "en";

/** Native language names for the picker. Never translated. */
export const NATIVE_NAMES: Record<Locale, string> = {
  en: "English",
  ru: "Русский",
  uk: "Українська",
  es: "Español",
  pt: "Português",
  de: "Deutsch",
  fr: "Français",
  it: "Italiano",
  ja: "日本語",
  ko: "한국어",
  zh: "简体中文"
};

/** BCP 47 tag per locale, for `lang` attributes on language names and links. */
export const HTML_LANG: Record<Locale, string> = {
  en: "en",
  ru: "ru",
  uk: "uk",
  es: "es",
  pt: "pt-BR",
  de: "de",
  fr: "fr",
  it: "it",
  ja: "ja",
  ko: "ko",
  zh: "zh-Hans"
};

/** Open Graph locale per locale. */
export const OG_LOCALE: Record<Locale, string> = {
  en: "en_US",
  ru: "ru_RU",
  uk: "uk_UA",
  es: "es_ES",
  pt: "pt_BR",
  de: "de_DE",
  fr: "fr_FR",
  it: "it_IT",
  ja: "ja_JP",
  ko: "ko_KR",
  zh: "zh_CN"
};

/** Locales that need a CJK font stylesheet. */
export const CJK: ReadonlySet<Locale> = new Set(["ja", "ko", "zh"]);

/** The i18n plugin config, shared by the Node and the browser compositions. */
export const I18N_CONFIG = {
  /** Every supported locale, default first. */
  locales: LOCALES,
  /** Fallback locale. */
  defaultLocale: DEFAULT_LOCALE,
  /** Native names for the picker. */
  localeNames: NATIVE_NAMES,
  /** `og:locale` values. */
  ogLocaleMap: OG_LOCALE
};

/**
 * Narrow any string to a supported locale.
 *
 * @param value - A locale code from a route context or a URL.
 * @returns True when the value is one of {@link LOCALES}.
 * @example
 * ```ts
 * isLocale("ru"); // true
 * isLocale("pl"); // false
 * ```
 */
export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Resolve a route's locale string to a supported locale, falling back to the default.
 *
 * @param value - The `ctx.locale` (or `lang` param) of a route.
 * @returns The locale itself when supported, otherwise {@link DEFAULT_LOCALE}.
 * @example
 * ```ts
 * asLocale("ja"); // "ja"
 * asLocale("xx"); // "en"
 * ```
 */
export function asLocale(value: string): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}
