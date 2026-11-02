/**
 * @file OG card fonts. The faces come from the pinned `@fontsource` packages (OFL), which split each
 * face into woff slices by `unicode-range`. A card loads only the slices its text needs, so the
 * CJK faces stay cheap and no font is copied into the repository. A character no slice of the
 * card's faces covers stops the build instead of shipping a box glyph.
 */
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import type {
  CardFont,
  CodePointRange,
  FaceRanges,
  FontFace,
  FontStore,
  LoadedStack,
  PickedSlice
} from "./types";

/** Module resolution from this file, for paths inside the `@fontsource` packages. */
const { resolve: resolvePackagePath } = createRequire(import.meta.url);

/**
 * Parse a CSS `unicode-range` value.
 *
 * @param value - Comma-separated `U+XXXX` and `U+XXXX-YYYY` items.
 * @returns The inclusive code point ranges.
 * @example
 * ```ts
 * parseUnicodeRange("U+0000-00FF,U+0131"); // [{ start: 0, end: 255 }, { start: 305, end: 305 }]
 * ```
 */
export function parseUnicodeRange(value: string): CodePointRange[] {
  return value.split(",").map(item => {
    const [first = "", last = first] = item.trim().replace(/^U\+/i, "").split("-");
    return { start: Number.parseInt(first, 16), end: Number.parseInt(last, 16) };
  });
}

/**
 * Whether a code point falls in one of the ranges.
 *
 * @param codePoint - The code point.
 * @param ranges - Inclusive ranges.
 * @returns True when a range holds it.
 */
function isInRanges(codePoint: number, ranges: readonly CodePointRange[]): boolean {
  return ranges.some(range => codePoint >= range.start && codePoint <= range.end);
}

/**
 * Format a code point the way an error names it.
 *
 * @param codePoint - The code point.
 * @returns The character and its `U+` number.
 */
function describeCodePoint(codePoint: number): string {
  const hex = codePoint.toString(16).toUpperCase().padStart(4, "0");
  return `"${String.fromCodePoint(codePoint)}" (U+${hex})`;
}

/**
 * The slices of one face that draw characters no earlier slice draws. Each picked slice takes its
 * characters out of `missing`, so no later slice or face is loaded for them.
 *
 * @param entry - One face of the stack, with its slice ranges.
 * @param missing - Code points no picked slice draws yet; the ones this face draws are removed.
 * @returns The picked slices of the face, in `unicode.json` order.
 */
function slicesCovering(entry: FaceRanges, missing: Set<number>): PickedSlice[] {
  const picked: PickedSlice[] = [];
  for (const [slice, ranges] of Object.entries(entry.slices)) {
    const covered = [...missing].filter(codePoint => isInRanges(codePoint, ranges));
    if (covered.length === 0) continue;

    picked.push({ face: entry.face, slice });
    for (const codePoint of covered) missing.delete(codePoint);
  }
  return picked;
}

/**
 * Pick the slices that draw a text. Faces are tried in stack order, so a character the first face
 * covers never loads a slice of the next one.
 *
 * @param stack - The faces of one text, in fallback order, with their slice ranges.
 * @param text - The text to draw.
 * @returns The picked slices, in fallback order.
 * @throws {Error} When a character of the text is in no slice of the stack.
 * @example
 * ```ts
 * pickSlices([nunitoRanges], "Hi"); // [{ face: nunito, slice: "latin" }]
 * ```
 */
export function pickSlices(stack: readonly FaceRanges[], text: string): PickedSlice[] {
  const missing = new Set([...text].map(character => character.codePointAt(0) ?? 0));
  const picked = stack.flatMap(entry => slicesCovering(entry, missing));

  const [first] = missing;
  if (first !== undefined) {
    const faces = stack.map(entry => entry.face.family).join(", ");
    throw new Error(
      `[kitto] assets: no OG card font covers ${describeCodePoint(first)} (faces: ${faces}).\n  Add a face that has it to the card's font stack in src/plugins/assets/og/render.ts.`
    );
  }

  return picked;
}

/**
 * The woff file of one slice inside its `@fontsource` package.
 *
 * @param face - The face.
 * @param slice - The slice key (`latin`, `[12]`).
 * @returns The package-relative module path of the file.
 * @example
 * ```ts
 * sliceFile({ family: "Gothic A1", pkg: "gothic-a1", weight: 800 }, "[12]");
 * // "@fontsource/gothic-a1/files/gothic-a1-12-800-normal.woff"
 * ```
 */
export function sliceFile(face: FontFace, slice: string): string {
  return `@fontsource/${face.pkg}/files/${face.pkg}-${sliceId(slice)}-${face.weight}-normal.woff`;
}

/**
 * The slice key as file and font names use it: numbered CJK slices lose their brackets.
 *
 * @param slice - The slice key (`latin`, `[12]`).
 * @returns The bare id (`latin`, `12`).
 */
function sliceId(slice: string): string {
  return slice.replaceAll(/[[\]]/g, "");
}

/**
 * Read the slice ranges of one `@fontsource` package.
 *
 * @param pkg - Package name under `@fontsource/`.
 * @returns The ranges per slice key.
 * @throws {Error} When `unicode.json` is not a map of range strings.
 */
async function readSliceRanges(pkg: string): Promise<FaceRanges["slices"]> {
  const file = resolvePackagePath(`@fontsource/${pkg}/unicode.json`);
  const table: unknown = JSON.parse(await readFile(file, "utf8"));
  if (typeof table !== "object" || table === null) {
    throw new Error(
      `[kitto] assets: ${file} is not a unicode-range table.\n  Reinstall @fontsource/${pkg}.`
    );
  }
  const entries = Object.entries(table).filter(
    (entry): entry is [string, string] => typeof entry[1] === "string"
  );
  return Object.fromEntries(entries.map(([slice, value]) => [slice, parseUnicodeRange(value)]));
}

/**
 * Create a font store: package tables and woff files are read once per store.
 *
 * @returns A store for one run.
 */
export function createFontStore(): FontStore {
  const tables = new Map<string, Promise<FaceRanges["slices"]>>();
  const files = new Map<string, Promise<Buffer>>();
  return {
    slices: pkg => {
      const cached = tables.get(pkg) ?? readSliceRanges(pkg);
      tables.set(pkg, cached);
      return cached;
    },
    file: modulePath => {
      const cached = files.get(modulePath) ?? readFile(resolvePackagePath(modulePath));
      files.set(modulePath, cached);
      return cached;
    }
  };
}

/**
 * Load the fonts that draw one text of a card.
 *
 * @param stack - The faces of the text, in fallback order.
 * @param text - The text to draw.
 * @param store - The run's font store.
 * @returns The picked slices as satori fonts and the `font-family` list naming them.
 */
export async function loadStack(
  stack: readonly FontFace[],
  text: string,
  store: FontStore
): Promise<LoadedStack> {
  const ranges = await Promise.all(
    stack.map(async face => ({ face, slices: await store.slices(face.pkg) }))
  );
  const fonts = await Promise.all(
    pickSlices(ranges, text).map(
      async ({ face, slice }): Promise<CardFont> => ({
        name: `${face.family} ${face.weight} ${sliceId(slice)}`,
        data: await store.file(sliceFile(face, slice)),
        weight: face.weight,
        style: "normal"
      })
    )
  );
  return { family: fonts.map(font => font.name).join(", "), fonts };
}
