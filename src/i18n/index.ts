/**
 * @file The string registry: one {@link UIStrings} table and one set of legal documents per locale.
 *
 * Only English exists until the data PR. Every other locale points at the English tables, so every
 * page renders in all 11 locales; each data unit swaps its own lines for its locale files. Shared
 * registry, frozen inside a wave (new keys go through `parts/`, see `types.ts`).
 */
import type { Locale } from "./languages";
import { deleteDataDe } from "./legal/delete-data/de";
import { deleteDataEn } from "./legal/delete-data/en";
import { deleteDataEs } from "./legal/delete-data/es";
import { deleteDataFr } from "./legal/delete-data/fr";
import { deleteDataIt } from "./legal/delete-data/it";
import { deleteDataJa } from "./legal/delete-data/ja";
import { deleteDataKo } from "./legal/delete-data/ko";
import { deleteDataPt } from "./legal/delete-data/pt";
import { deleteDataRu } from "./legal/delete-data/ru";
import { deleteDataUk } from "./legal/delete-data/uk";
import { deleteDataZh } from "./legal/delete-data/zh";
import { privacyDe } from "./legal/privacy/de";
import { privacyEn } from "./legal/privacy/en";
import { privacyEs } from "./legal/privacy/es";
import { privacyFr } from "./legal/privacy/fr";
import { privacyIt } from "./legal/privacy/it";
import { privacyJa } from "./legal/privacy/ja";
import { privacyKo } from "./legal/privacy/ko";
import { privacyPt } from "./legal/privacy/pt";
import { privacyRu } from "./legal/privacy/ru";
import { privacyUk } from "./legal/privacy/uk";
import { privacyZh } from "./legal/privacy/zh";
import { termsDe } from "./legal/terms/de";
import { termsEn } from "./legal/terms/en";
import { termsEs } from "./legal/terms/es";
import { termsFr } from "./legal/terms/fr";
import { termsIt } from "./legal/terms/it";
import { termsJa } from "./legal/terms/ja";
import { termsKo } from "./legal/terms/ko";
import { termsPt } from "./legal/terms/pt";
import { termsRu } from "./legal/terms/ru";
import { termsUk } from "./legal/terms/uk";
import { termsZh } from "./legal/terms/zh";
import { de } from "./locales/de";
import { en } from "./locales/en";
import { es } from "./locales/es";
import { fr } from "./locales/fr";
import { it } from "./locales/it";
import { ja } from "./locales/ja";
import { ko } from "./locales/ko";
import { pt } from "./locales/pt";
import { ru } from "./locales/ru";
import { uk } from "./locales/uk";
import { zh } from "./locales/zh";
import type { LegalDocument, LegalDocumentId, UIStrings } from "./types";

/** UI strings per locale. */
const STRINGS: Record<Locale, UIStrings> = {
  en,
  ru,
  uk,
  es,
  pt,
  de,
  fr,
  it,
  ja,
  ko,
  zh
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
  ru: { privacy: privacyRu, terms: termsRu, deleteData: deleteDataRu },
  uk: { privacy: privacyUk, terms: termsUk, deleteData: deleteDataUk },
  es: { privacy: privacyEs, terms: termsEs, deleteData: deleteDataEs },
  pt: { privacy: privacyPt, terms: termsPt, deleteData: deleteDataPt },
  de: { privacy: privacyDe, terms: termsDe, deleteData: deleteDataDe },
  fr: { privacy: privacyFr, terms: termsFr, deleteData: deleteDataFr },
  it: { privacy: privacyIt, terms: termsIt, deleteData: deleteDataIt },
  ja: { privacy: privacyJa, terms: termsJa, deleteData: deleteDataJa },
  ko: { privacy: privacyKo, terms: termsKo, deleteData: deleteDataKo },
  zh: { privacy: privacyZh, terms: termsZh, deleteData: deleteDataZh }
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
