/**
 * @file The root page's locale pick: the saved choice, then the browser's languages, then English.
 *
 * {@link pickLocale} is the rule in readable form. {@link ROOT_REDIRECT_SCRIPT} is the same rule as
 * the tiny inline script the root page runs before anything loads. Both read the supported list,
 * the storage key and the default from the same constants, and a unit test runs the script against
 * {@link pickLocale} case by case, so the two cannot drift. The URL the script opens has the shape
 * of the route table's home page.
 */
import { DEFAULT_LOCALE, LOCALES, type Locale } from "../i18n/languages";
import { urls } from "../routes";

/** The localStorage key of the reader's saved language (written by the header language picker). */
export const LANGUAGE_STORAGE_KEY = "kitto-lang";

/**
 * The supported locale a language tag asks for. Every supported locale is a bare language code, so
 * an exact match and a base-tag match are the same test: the part before the first `-`.
 *
 * @param tag - One entry of `navigator.languages`, such as `pt-BR` or `zh-Hant-TW`.
 * @param supported - The site's locales.
 * @returns The matching locale, or undefined when the language is not supported.
 */
function matchTag(tag: string, supported: readonly Locale[]): Locale | undefined {
  const base = tag.split("-")[0];
  return supported.find(locale => locale === base);
}

/**
 * Pick the locale the root page sends a reader to.
 *
 * Order: a saved supported choice; else the first entry of the browser's languages that is
 * supported exactly or by its base tag (`pt-BR` → `pt`, `zh-TW` → `zh`, only Simplified Chinese is
 * offered); else the default locale.
 *
 * @param saved - The saved `kitto-lang` value, undefined when nothing is saved or storage is blocked.
 * @param navigatorLanguages - `navigator.languages`, most preferred first.
 * @param supported - The site's locales.
 * @returns The locale to open.
 * @example
 * ```ts
 * pickLocale(undefined, ["uk-UA", "en"], LOCALES); // "uk"
 * pickLocale("ja", ["de-DE"], LOCALES); // "ja"
 * ```
 */
export function pickLocale(
  saved: string | undefined,
  navigatorLanguages: readonly string[],
  supported: readonly Locale[] = LOCALES
): Locale {
  const savedLocale = supported.find(locale => locale === saved);
  if (savedLocale !== undefined) return savedLocale;
  for (const tag of navigatorLanguages) {
    const match = matchTag(tag, supported);
    if (match !== undefined) return match;
  }
  return DEFAULT_LOCALE;
}

/** Stands in for the locale while the home URL's shape is read from the route table. */
const LOCALE_MARK = "LANG";

/** The route table's home URL, cut where the locale goes: `["/", "/"]` for `/{lang}/`. */
const HOME_PARTS = urls.toUrl("home", { lang: LOCALE_MARK }).split(LOCALE_MARK);

/**
 * The inline script of the root page: {@link pickLocale} in a few hundred bytes of plain ES5, then
 * `location.replace` to the home page of that locale, keeping the query and the hash of the root
 * URL (a `?theme=` preview, a campaign tag, an anchor). Storage may throw (private modes, blocked
 * cookies), so the read is guarded. The supported list, the key, the default and the home URL are
 * written in from the constants and the route table.
 */
export const ROOT_REDIRECT_SCRIPT = [
  "(function(s){var l=(function(){",
  `try{var v=localStorage.getItem(${JSON.stringify(LANGUAGE_STORAGE_KEY)});if(s.indexOf(v)>-1)return v}catch(e){}`,
  "var n=navigator.languages||[navigator.language||''];",
  "for(var i=0;i<n.length;i++){var t=String(n[i]).split('-')[0];if(s.indexOf(t)>-1)return t}",
  `return ${JSON.stringify(DEFAULT_LOCALE)}})();`,
  `location.replace(${HOME_PARTS.map(part => JSON.stringify(part)).join("+l+")}+location.search+location.hash)})(${JSON.stringify(LOCALES)})`
].join("");
