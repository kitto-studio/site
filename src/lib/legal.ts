/**
 * @file The legal documents: typed accessors and the pure helpers the three legal pages render with.
 *
 * Legal text is trusted HTML written by the studio (`src/i18n/legal/`). It carries two kinds of
 * markers that stay identical in every translation:
 * - slots the page fills: `{email:support}` / `{email:delete}` become the address link from
 *   `src/config.ts`, `{route:privacy}` (any page of {@link LegalLinkTarget}) the page URL in the
 *   reader's locale;
 * - placeholders such as `[ADDRESS]` for a fact not given yet: the page highlights them. The
 *   current texts have none (the owner's address and Spanish law are final); the marker stays for
 *   a future fact.
 */
import { EMAILS, SITE } from "../config";
import { LEGAL } from "../i18n";
import { HTML_LANG, type Locale } from "../i18n/languages";
import type { LegalDocument, LegalDocumentId } from "../i18n/types";
import { typeset } from "./typography";

/** The private individual who runs Kitto Studio and is responsible under the legal pages. */
export const LEGAL_OWNER = "Hanna Kucherenko";

/** The form of every app ID of the studio. Never translated. */
export const APP_ID_PATTERN = "studio.kitto.memorymissing";

/** Postal address lines shown under Contact: the studio, its owner and her address in Spain. */
export const LEGAL_ADDRESS: readonly string[] = [
  SITE.name,
  LEGAL_OWNER,
  "Calle Ventura Selva González 9, Bungalow 28",
  "03130 Gran Alacant, Santa Pola (Alicante)",
  "Spain"
];

/** Pages a legal text may link to with a `{route:…}` slot. */
const LINK_TARGETS = ["home", "support", "privacy", "terms", "deleteData"] as const;

/** A page a legal text may link to. */
export type LegalLinkTarget = (typeof LINK_TARGETS)[number];

/** Every legal document of every locale. */
export type LegalTable = Record<Locale, Record<LegalDocumentId, LegalDocument>>;

/** One legal document as a page shows it. */
export type LegalPage = {
  /** The document in the page's locale, or the English one while there is no translation. */
  document: LegalDocument;
  /** True when a non-English page shows the English text. */
  isFallback: boolean;
};

/** A placeholder still to be filled: `[ADDRESS]`. */
const PLACEHOLDER = /\[[A-Z][A-Z_]*\]/g;

/** A slot the page fills: `{email:support}`, `{route:privacy}`. */
const SLOT = /\{([a-z]+):([A-Za-z]+)\}/g;

/**
 * Narrow a slot name to a page a legal text may link to.
 *
 * @param name - The name after `route:`.
 * @returns True for a page of {@link LINK_TARGETS}.
 */
function isLinkTarget(name: string): name is LegalLinkTarget {
  return (LINK_TARGETS as readonly string[]).includes(name);
}

/**
 * Narrow a slot name to a site address.
 *
 * @param name - The name after `email:`.
 * @returns True for a key of {@link EMAILS}.
 */
function isEmailName(name: string): name is keyof typeof EMAILS {
  return Object.hasOwn(EMAILS, name);
}

/**
 * The legal document a page shows, and whether it is the English fallback.
 *
 * @param locale - The page locale.
 * @param id - Which document.
 * @param table - The documents of every locale; the site's own by default.
 * @returns The document and the fallback flag.
 * @example
 * ```ts
 * legalDocument("en", "privacy").isFallback; // false
 * ```
 */
export function legalDocument(
  locale: Locale,
  id: LegalDocumentId,
  table: LegalTable = LEGAL
): LegalPage {
  const document = table[locale][id];
  return { document, isFallback: locale !== "en" && document === table.en[id] };
}

/**
 * Every string of a document in reading order: intro, In short, then each section.
 *
 * @param document - A legal document.
 * @returns Headings and HTML strings, in the order the page shows them.
 */
function documentStrings(document: LegalDocument): string[] {
  const strings = [document.intro, ...document.inShort];
  for (const section of document.sections) {
    strings.push(section.heading);
    for (const block of section.blocks) {
      if (block.kind === "paragraph") strings.push(block.html);
      else strings.push(...block.items);
    }
  }
  return strings;
}

/**
 * The first placeholder of a document, for the draft line.
 *
 * @param document - A legal document.
 * @returns The first placeholder in reading order, or `undefined` when the document is complete.
 * @example
 * ```ts
 * firstPlaceholder(legalDocument("en", "privacy").document); // undefined: the text is complete
 * ```
 */
export function firstPlaceholder(document: LegalDocument): string | undefined {
  for (const text of documentStrings(document)) {
    const found = text.match(PLACEHOLDER);
    if (found) return found[0];
  }
  return undefined;
}

/**
 * Check whether a whole string is a placeholder.
 *
 * @param text - One line, such as a line of {@link LEGAL_ADDRESS}.
 * @returns True for a bare placeholder such as `[COUNTRY]`.
 * @example
 * ```ts
 * isPlaceholder("[COUNTRY]"); // true
 * isPlaceholder("Kitto Studio"); // false
 * ```
 */
export function isPlaceholder(text: string): boolean {
  return new RegExp(`^${PLACEHOLDER.source}$`).test(text);
}

/**
 * Fill one slot of a legal text.
 *
 * @param slot - The whole slot, for the error message.
 * @param kind - `email` or `route`.
 * @param name - The address key or the page name.
 * @param linkTo - Builds a page URL in the reader's locale.
 * @returns The address link, or the page URL.
 * @throws {Error} When the slot names no address and no page.
 */
function fillSlot(
  slot: string,
  kind: string,
  name: string,
  linkTo: (target: LegalLinkTarget) => string
): string {
  if (kind === "email" && isEmailName(name)) {
    const address = EMAILS[name];
    return `<a href="mailto:${address}">${address}</a>`;
  }
  if (kind === "route" && isLinkTarget(name)) return linkTo(name);
  throw new Error(
    `[kitto] Unknown slot ${slot} in a legal text.\n  Write {email:support}, {email:delete} or {route:<page>} with a page of ${LINK_TARGETS.join(", ")}.`
  );
}

/**
 * Turn one trusted legal HTML string into the HTML the page shows: the locale's typography,
 * highlighted placeholders, filled slots.
 *
 * @param html - A legal string from `src/i18n/legal/`.
 * @param locale - The locale it is written in.
 * @param linkTo - Builds a page URL in the reader's locale.
 * @returns Ready HTML.
 * @throws {Error} When the text carries a slot that names no address and no page.
 * @example
 * ```ts
 * renderLegalHtml("Write to {email:support}.", "en", target => `/en/${target}/`);
 * // 'Write to <a href="mailto:support@kitto.studio">support@kitto.studio</a>.'
 * ```
 */
export function renderLegalHtml(
  html: string,
  locale: Locale,
  linkTo: (target: LegalLinkTarget) => string
): string {
  return typeset(html, locale)
    .replaceAll(PLACEHOLDER, name => `<mark data-component="placeholder">${name}</mark>`)
    .replaceAll(SLOT, (slot, kind: string, name: string) => fillSlot(slot, kind, name, linkTo));
}

/**
 * Format the publish date of the legal pages for one locale.
 *
 * @param isoDate - A calendar date, `YYYY-MM-DD`.
 * @param locale - The page locale.
 * @returns The long date of that day, in every time zone the build may run in.
 * @example
 * ```ts
 * formatLegalDate("2026-11-02", "en"); // "November 2, 2026"
 * ```
 */
export function formatLegalDate(isoDate: string, locale: Locale): string {
  const format = new Intl.DateTimeFormat(HTML_LANG[locale], { dateStyle: "long", timeZone: "UTC" });
  return format.format(new Date(`${isoDate}T00:00:00Z`));
}

/**
 * Split a UI string at one `{slot}`, so a component can put an element there.
 *
 * @param template - A UI string, such as `"Last updated: {date}"`.
 * @param slot - The slot name without braces.
 * @returns The text before and after the slot. Without the slot, the whole text comes first.
 * @example
 * ```ts
 * splitSlot("Last updated: {date}", "date"); // ["Last updated: ", ""]
 * ```
 */
export function splitSlot(template: string, slot: string): [before: string, after: string] {
  const marker = `{${slot}}`;
  const at = template.indexOf(marker);
  if (at === -1) return [template, ""];
  return [template.slice(0, at), template.slice(at + marker.length)];
}

/**
 * The `mailto:` link of the deletion request button.
 *
 * @param subject - The mail subject in the page's locale.
 * @returns A link to the deletion address with the encoded subject.
 * @example
 * ```ts
 * deletionRequestHref("Delete my data"); // "mailto:delete@kitto.studio?subject=Delete%20my%20data"
 * ```
 */
export function deletionRequestHref(subject: string): string {
  return `mailto:${EMAILS.delete}?subject=${encodeURIComponent(subject)}`;
}
