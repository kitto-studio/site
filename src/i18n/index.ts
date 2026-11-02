/**
 * @file The string registry: one {@link UIStrings} table and one set of legal documents per locale.
 *
 * Only English exists until the data PR. Every other locale points at the English tables, so every
 * page renders in all 11 locales; each data unit swaps its own lines for its locale files. Shared
 * registry, frozen inside a wave (new keys go through `parts/`, see `types.ts`).
 */
import type { Locale } from "./languages";
import { deleteDataEn } from "./legal/delete-data/en";
import { privacyEn } from "./legal/privacy/en";
import { termsEn } from "./legal/terms/en";
import { en } from "./locales/en";
import type { LegalDocument, LegalDocumentId, UIStrings } from "./types";

/** UI strings per locale. */
const STRINGS: Record<Locale, UIStrings> = {
  en,
  ru: en,
  uk: en,
  es: en,
  pt: en,
  de: en,
  fr: en,
  it: en,
  ja: en,
  ko: en,
  zh: en
};

/** The English legal documents. */
const LEGAL_EN: Record<LegalDocumentId, LegalDocument> = {
  privacy: privacyEn,
  terms: termsEn,
  deleteData: deleteDataEn
};

/** Legal documents per locale, read through the typed accessors in `src/lib/legal.ts`. */
export const LEGAL: Record<Locale, Record<LegalDocumentId, LegalDocument>> = {
  en: LEGAL_EN,
  ru: LEGAL_EN,
  uk: LEGAL_EN,
  es: LEGAL_EN,
  pt: LEGAL_EN,
  de: LEGAL_EN,
  fr: LEGAL_EN,
  it: LEGAL_EN,
  ja: LEGAL_EN,
  ko: LEGAL_EN,
  zh: LEGAL_EN
};

/**
 * The full string table of one locale.
 *
 * @param locale - A supported locale.
 * @returns Every UI string of the site in that locale.
 * @example
 * ```ts
 * t("en").chrome.nav.games; // "Games"
 * ```
 */
export function t(locale: Locale): UIStrings {
  return STRINGS[locale];
}
