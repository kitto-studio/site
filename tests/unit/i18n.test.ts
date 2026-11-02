import { describe, expect, it } from "vitest";
import { LEGAL, t } from "../../src/i18n";
import { LOCALES } from "../../src/i18n/languages";
import { en } from "../../src/i18n/locales/en";
import type { LegalDocument, LegalDocumentId } from "../../src/i18n/types";

// Today every locale points at the English tables, so these checks pass for every locale by
// construction. They are written for the data PR: each locale file it adds is held to the English
// keys, structure, slots, placeholders and links. The last test proves the checks really report
// each kind of defect, so they are not vacuous meanwhile.

/** Leaves that are identifiers, never translated. */
const FIXED_KEYS = new Set(["id", "kind"]);

/** What a translation must keep: placeholders, `{slots}` and link targets. */
const TOKEN = /\[[A-Z][A-Z_]*\]|\{[^{}\s]+\}|href="[^"]*"/g;

/**
 * Every string of a table by its path, such as `legal.titles.privacy` or `sections.2.blocks.0.html`.
 * The walk is generic: it reads any table of nested objects, arrays and strings.
 */
function leaves(value: unknown, path = "", found = new Map<string, string>()): Map<string, string> {
  if (typeof value === "string") {
    found.set(path, value);
  } else if (Array.isArray(value)) {
    for (const [index, item] of value.entries()) leaves(item, `${path}.${index}`, found);
  } else if (typeof value === "object" && value !== null) {
    for (const [key, item] of Object.entries(value))
      leaves(item, path ? `${path}.${key}` : key, found);
  }
  return found;
}

const tokens = (text: string): string => (text.match(TOKEN) ?? []).toSorted().join(" ");

/** What is wrong with one translated string, compared with its English original. */
function leafProblems(path: string, text: string, original: string): string[] {
  const found = text.trim() === "" ? [`empty ${path}`] : [];
  if (FIXED_KEYS.has(path.split(".").at(-1) ?? "")) {
    if (text !== original) found.push(`changed ${path}`);
  } else if (tokens(text) !== tokens(original)) {
    found.push(`tokens ${path}`);
  }
  return found;
}

/** Every way a translated table departs from the English one. */
function problems(english: unknown, translated: unknown): string[] {
  const source = leaves(english);
  const target = leaves(translated);
  const found: string[] = [];
  for (const path of source.keys()) if (!target.has(path)) found.push(`missing ${path}`);
  for (const [path, text] of target) {
    const original = source.get(path);
    if (original === undefined) found.push(`extra ${path}`);
    else found.push(...leafProblems(path, text, original));
  }
  return found;
}

const DOCUMENT_IDS: readonly LegalDocumentId[] = ["privacy", "terms", "deleteData"];

describe("string tables", () => {
  // Catches: a locale missing a key (the page shows `undefined`), a stale extra key, an empty
  // translation, or a `{slot}` translated into plain words so no link or value is filled in.
  it("every locale has exactly the English keys, no empty string, and every slot", () => {
    for (const locale of LOCALES) {
      expect(problems(en, t(locale)), locale).toEqual([]);
    }
  });

  // Catches: a translation that drops [JURISDICTION] or a link, renames a section id (anchors and
  // contents stop matching across languages), or changes the blocks the pages build on.
  it("every locale keeps the English legal structure, ids, slots, placeholders and links", () => {
    for (const locale of LOCALES) {
      for (const id of DOCUMENT_IDS) {
        expect(problems(LEGAL.en[id], LEGAL[locale][id]), `${id} in ${locale}`).toEqual([]);
      }
    }
  });

  // Catches: a comparison that finds nothing, which would let every future locale pass unchecked.
  it("reports each kind of defect in a broken locale", () => {
    const strings = structuredClone(en);
    Reflect.deleteProperty(strings.chrome.nav, "games");
    Object.assign(strings.chrome.nav, { blog: "Blog" });
    strings.legal.contents = " ";
    strings.home.support.text = "Write to us at support@kitto.studio.";

    expect(problems(en, strings)).toEqual([
      "missing chrome.nav.games",
      "extra chrome.nav.blog",
      "tokens home.support.text",
      "empty legal.contents"
    ]);

    const english = LEGAL.en.privacy;
    const document: LegalDocument = {
      ...english,
      sections: english.sections.map((section, index) =>
        index === 0
          ? {
              ...section,
              id: "kto",
              blocks: [
                {
                  kind: "paragraph",
                  html: "Kitto Studio ведёт Hanna Kucherenko, [АДРЕС], [COUNTRY]. Пишите на {email:support}."
                }
              ]
            }
          : section
      )
    };

    expect(problems(english, document)).toEqual([
      "changed sections.0.id",
      "tokens sections.0.blocks.0.html"
    ]);
  });
});
