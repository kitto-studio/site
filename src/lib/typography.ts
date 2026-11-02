/**
 * @file Typography applied when a string is rendered: no-break spaces where a line must not break.
 *
 * - Russian and Ukrainian: a no-break space after a word of one or two letters, and before a spaced
 *   em dash, so no short word hangs at the end of a line and no line starts with a dash.
 * - French: a narrow no-break space before `; : ! ?` and inside « ».
 * - Every other locale: the text comes back unchanged.
 *
 * A string may be trusted HTML: tags and entities pass through untouched, only the text between them
 * changes. The game name and a `<span translate="no">` with its text are never changed in any locale.
 * Every rule is idempotent, so a string typeset twice equals the string typeset once.
 */
import type { Locale } from "../i18n/languages";

/** One replacement applied to a run of text. */
type Rule = {
  /** What to find; always a global pattern. */
  pattern: RegExp;
  /** What to put in its place. */
  replacement: string;
};

/** No-break space. */
const NBSP = "\u{A0}";

/** Narrow no-break space, the French space before high punctuation and inside guillemets. */
const NARROW_NBSP = "\u{202F}";

/**
 * Text no rule may change, split off whole: a `<span translate="no">` with its text (app IDs), and
 * the game name, written the same in every locale (French would space its colon).
 */
const UNTOUCHED = /(<span\b[^>]*\btranslate="no"[^>]*>[^<]*<\/span>|A Memory Missing: Merge Game)/;

/** A tag or a character entity. `split` keeps it as its own part, which is never changed. */
const MARKUP = /(<[^>]*>|&(?:#\d+|#x[\da-f]+|[a-z][\da-z]*);)/i;

/** Russian and Ukrainian rules. */
const CYRILLIC_RULES: readonly Rule[] = [
  // A word of one or two letters, at the start or after a space or an opening mark, keeps the next
  // word on its line. The lookbehind reads the original text, so «и в доме» binds both words.
  { pattern: /(?<=^|[\s(«„“"[])(\p{L}{1,2}) +(?=\S|$)/gu, replacement: `$1${NBSP}` },
  // A spaced em dash stays on the line of the word before it.
  { pattern: / +—/g, replacement: `${NBSP}—` }
];

/** French rules. */
const FRENCH_RULES: readonly Rule[] = [
  // High punctuation after a word, followed by a space or the end: never after `:` in a URL or a time.
  {
    pattern: /(?<=[\p{L}\p{N}»)\]’"])[ \u{A0}\u{202F}]*([;:!?])(?=[\s!?»)]|$)/gu,
    replacement: `${NARROW_NBSP}$1`
  },
  { pattern: /«[ \u{A0}\u{202F}]*/gu, replacement: `«${NARROW_NBSP}` },
  { pattern: /[ \u{A0}\u{202F}]*»/gu, replacement: `${NARROW_NBSP}»` }
];

/** The rules of each locale that has any. */
const RULES: Partial<Record<Locale, readonly Rule[]>> = {
  ru: CYRILLIC_RULES,
  uk: CYRILLIC_RULES,
  fr: FRENCH_RULES
};

/**
 * Apply rules, in order, to one run of text without markup.
 *
 * @param text - Plain text.
 * @param rules - The locale's rules.
 * @returns The text with every rule applied.
 */
function applyRules(text: string, rules: readonly Rule[]): string {
  let result = text;
  for (const rule of rules) result = result.replaceAll(rule.pattern, rule.replacement);
  return result;
}

/**
 * Apply rules to the text between the tags and entities of a run of trusted HTML.
 *
 * @param html - Plain text or trusted HTML with nothing untouchable in it.
 * @param rules - The locale's rules.
 * @returns The run with every rule applied to its text.
 */
function applyToText(html: string, rules: readonly Rule[]): string {
  return html
    .split(MARKUP)
    .map((part, index) => (index % 2 === 0 ? applyRules(part, rules) : part))
    .join("");
}

/**
 * Set a string in the typography of its locale.
 *
 * @param text - Plain text or trusted HTML.
 * @param locale - The locale the text is written in.
 * @returns The same text with no-break spaces where the locale needs them.
 * @example
 * ```ts
 * typeset("Мы не знаем — и всё", "ru"); // "Мы\u{A0}не\u{A0}знаем\u{A0}— и\u{A0}всё"
 * typeset("Bonjour !", "fr"); // "Bonjour\u{202F}!"
 * ```
 */
export function typeset(text: string, locale: Locale): string {
  const rules = RULES[locale];
  if (rules === undefined) return text;
  return text
    .split(UNTOUCHED)
    .map((part, index) => (index % 2 === 0 ? applyToText(part, rules) : part))
    .join("");
}
