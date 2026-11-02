/**
 * @file The e2e inventory: the URL map and the expectations of the site, written from the plan
 * (`.planning/app-spec.md` URL map) and the design context (§6), never imported from the code
 * under test, so a broken route table or string table cannot rewrite its own expectations.
 */

/** Every locale, default first (app-spec URL map). */
export const LOCALES = ["en", "ru", "uk", "es", "pt", "de", "fr", "it", "ja", "ko", "zh"] as const;

/** One locale. */
export type Locale = (typeof LOCALES)[number];

/** The locales every engine walks; chromium desktop walks all of them. */
export const SAMPLE_LOCALES: readonly Locale[] = ["en", "ru", "de", "ja", "zh"];

/** One page of the site. */
export type SitePage = {
  /** Stable id, used in golden names. */
  id: string;
  /** Path after `/{lang}`. */
  path: string;
  /** English `<h1>` (design context §6 A). */
  heading: string | RegExp;
};

/** The eight pages of every locale (app-spec URL map, design context §6 A1–A8). */
export const PAGES: readonly SitePage[] = [
  { id: "home", path: "/", heading: "Surely worth playing." },
  { id: "about", path: "/about/", heading: "A small family studio" },
  { id: "games", path: "/games/", heading: "Our games" },
  {
    id: "memory-missing",
    path: "/games/memory-missing/",
    heading: "A Memory Missing: Merge Game"
  },
  { id: "support", path: "/support/", heading: "Need help? Write to us." },
  { id: "privacy", path: "/privacy/", heading: "Privacy Policy" },
  { id: "terms", path: "/terms/", heading: "Terms of Use" },
  { id: "delete-data", path: "/delete-data/", heading: "Delete your data" }
];

/** The footer's targets on every page (design context §6 B2), in order. */
export const FOOTER_PATHS = ["/privacy/", "/terms/", "/delete-data/", "/support/"] as const;

/** The header's nav targets (design context §6 B1), in order. */
export const NAV_PATHS = ["/games/", "/about/", "/support/"] as const;

/** Numbered sections per legal page (design context §6 A6–A8). */
export const LEGAL_SECTIONS: Readonly<Record<string, number>> = {
  privacy: 10,
  terms: 11,
  "delete-data": 6
};

/** The site's addresses (design context §8). */
export const EMAILS = { support: "support@kitto.studio", delete: "delete@kitto.studio" } as const;

/** Canonical origin. */
export const ORIGIN = "https://kitto.studio";

/** `og:locale` per locale. */
export const OG_LOCALE: Readonly<Record<Locale, string>> = {
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

/** Native language names of the picker (design context §4). */
export const NATIVE_NAMES: Readonly<Record<Locale, string>> = {
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

/**
 * The URL of a page in a locale.
 *
 * @param locale - The locale.
 * @param page - The page, or its path after `/{lang}`.
 * @returns The site-relative URL.
 */
export function pageUrl(locale: string, page: SitePage | string): string {
  const path = typeof page === "string" ? page : page.path;
  return `/${locale}${path}`;
}
