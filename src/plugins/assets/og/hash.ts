/**
 * @file The input hash of an OG card. A card is drawn from its row, its words, the card code, the
 * installed drawing packages and its art; when none of them changed since the hash in the
 * manifest, the committed PNG is still right and `app.assets.og()` skips it.
 */
import { createHash, type Hash } from "node:crypto";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { SITE } from "../../../config";
import type { Locale } from "../../../i18n/languages";
import { OG_CARD_NAMES } from "../../../lib/head";
import { OG_CARDS, type OgCardName } from "../../../og/cards";
import type { OgCardSpec } from "../../../og/types";
import { artImages } from "./art";
import { cardText } from "./render";
import type { OgInputs } from "./types";

/**
 * The card code, relative to the project: the satori tree, this module and typography. Not
 * `src/config.ts`: a card reads only the site address from it, which `cardHash` takes as a value,
 * so a change elsewhere in the config redraws nothing.
 */
const SOURCES = ["src/og", "src/plugins/assets/og", "src/lib/typography.ts"];

/** The packages that lay out, rasterise and encode a card, and the five font packages. */
const PACKAGES = [
  "satori",
  "@resvg/resvg-js",
  "sharp",
  "@fontsource/golos-text",
  "@fontsource/gothic-a1",
  "@fontsource/m-plus-rounded-1c",
  "@fontsource/noto-sans-sc",
  "@fontsource/nunito"
];

/**
 * A new SHA-256 hash.
 *
 * @returns The hash, ready for its first update.
 */
function sha256(): Hash {
  return createHash("sha256");
}

/**
 * Whether a path inside a folder is a hidden file or lies in a hidden folder.
 *
 * @param relative - The path, relative to the folder.
 * @returns True when a part of it starts with a dot.
 */
function isHidden(relative: string): boolean {
  return relative.split(path.sep).some(part => part.startsWith("."));
}

/**
 * The files under one source: the file itself, or every file of a folder, without hidden files and
 * folders (a Finder `.DS_Store` changes no card).
 *
 * @param source - A file or a folder.
 * @returns The file paths, sorted.
 */
async function filesOf(source: string): Promise<string[]> {
  const status = await stat(source);
  if (!status.isDirectory()) return [source];

  const entries = await readdir(source, { recursive: true, withFileTypes: true });
  return entries
    .filter(entry => entry.isFile())
    .map(entry => path.join(entry.parentPath, entry.name))
    .filter(file => !isHidden(path.relative(source, file)))
    .toSorted();
}

/**
 * One hash of the paths and bytes of every file under the sources: an edit, a new file and a
 * renamed file all change it.
 *
 * @param sources - Files and folders.
 * @returns The hex hash.
 * @example
 * ```ts
 * await hashFiles(["src/og", "src/config.ts"]); // "5f0c…"
 * ```
 */
export async function hashFiles(sources: readonly string[]): Promise<string> {
  const lists = await Promise.all(sources.map(source => filesOf(source)));
  const files = lists.flat();
  const contents = await Promise.all(
    files.map(async file => ({ name: file.split(path.sep).join("/"), bytes: await readFile(file) }))
  );
  const hash = sha256();
  for (const { name, bytes } of contents) hash.update(`${name}\0`).update(bytes);
  return hash.digest("hex");
}

/**
 * The installed version of one package, from its `package.json` under `node_modules`.
 *
 * @param name - The package name.
 * @returns The version.
 * @throws {Error} When the `package.json` has no version.
 */
async function installedVersion(name: string): Promise<string> {
  const file = path.join("node_modules", name, "package.json");
  const manifest: unknown = JSON.parse(await readFile(file, "utf8"));
  const version =
    typeof manifest === "object" && manifest !== null && "version" in manifest
      ? manifest.version
      : undefined;
  if (typeof version !== "string") {
    throw new TypeError(`[kitto] assets: ${file} names no version.\n  Run bun install.`);
  }
  return version;
}

/**
 * The installed versions of the packages that draw a card. An update of satori, resvg, sharp or a
 * font package can change every card, so it redraws them all.
 *
 * @returns The version of each package, by name.
 * @example
 * ```ts
 * (await installedVersions()).satori; // "0.19.1"
 * ```
 */
export async function installedVersions(): Promise<Record<string, string>> {
  const versions = await Promise.all(
    PACKAGES.map(async (name): Promise<[string, string]> => [name, await installedVersion(name)])
  );
  return Object.fromEntries(versions);
}

/**
 * One hash of the drawing code: the card sources and the installed versions of the drawing
 * packages. An update of satori, resvg, sharp or a font package can change every card.
 *
 * @param sources - The hash of the card sources, from `hashFiles`.
 * @param versions - The installed versions, from `installedVersions`.
 * @returns The hex hash.
 * @example
 * ```ts
 * codeHash(await hashFiles(["src/og"]), await installedVersions()); // "a41d…"
 * ```
 */
export function codeHash(sources: string, versions: Readonly<Record<string, string>>): string {
  return sha256().update(sources).update(JSON.stringify(versions)).digest("hex");
}

/**
 * One hash of the names and bytes of the art a card shows. The names are relative to the art
 * folder, so the hash is the same wherever the project is checked out.
 *
 * @param card - The card's row.
 * @param mediaDirectory - The art folder.
 * @returns The hex hash.
 */
async function hashArt(card: OgCardSpec, mediaDirectory: string): Promise<string> {
  const pictures = await Promise.all(
    artImages(card).map(async image => ({
      image,
      bytes: await readFile(path.join(mediaDirectory, `${image}.webp`))
    }))
  );
  const hash = sha256();
  for (const { image, bytes } of pictures) hash.update(`${image}\0`).update(bytes);
  return hash.digest("hex");
}

/**
 * Hash what every card is drawn from, once per run: the card code with the installed drawing
 * packages, and the art of each row.
 *
 * @param mediaDirectory - The art folder: the assets plugin's `outDir`.
 * @returns The inputs `cardHash` combines per card.
 * @example
 * ```ts
 * const inputs = await ogInputs("public/media");
 * inputs.art.has("home"); // true
 * ```
 */
export async function ogInputs(mediaDirectory: string): Promise<OgInputs> {
  const [sources, versions, art] = await Promise.all([
    hashFiles(SOURCES),
    installedVersions(),
    Promise.all(
      OG_CARD_NAMES.map(
        async (name): Promise<[OgCardName, string]> => [
          name,
          await hashArt(OG_CARDS[name], mediaDirectory)
        ]
      )
    )
  ]);
  return { code: codeHash(sources, versions), art: new Map(art) };
}

/**
 * The input hash of one card in one locale: its row, its words, the site address, the card code and
 * its art. The manifest keeps it under `{card}/{locale}`.
 *
 * @param name - The card.
 * @param locale - The card locale.
 * @param inputs - The run's inputs, from `ogInputs`.
 * @returns The hex hash.
 * @example
 * ```ts
 * manifest["game/zh"] === cardHash("game", "zh", inputs); // true when the zh game card is up to date
 * ```
 */
export function cardHash(name: OgCardName, locale: Locale, inputs: OgInputs): string {
  const card: OgCardSpec = OG_CARDS[name];
  const parts = {
    name,
    locale,
    card,
    text: cardText(card, locale),
    site: SITE.url,
    code: inputs.code,
    art: inputs.art.get(name)
  };
  return sha256().update(JSON.stringify(parts)).digest("hex");
}
