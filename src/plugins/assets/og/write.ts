/**
 * @file Writing the OG cards: per locale, one 1200 × 630 PNG per row of `OG_CARDS`
 * (`{ogDir}/{lang}/{card}.png`, served at the paths `pageHead` links). `writeOgCards` draws only
 * the cards whose inputs changed since the manifest and writes the manifest last.
 * `writeBuildCards` is the build's step until the data PR: it writes every card into a built
 * output directory, drawing each once per process.
 */
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { LOCALES, type Locale } from "../../../i18n/languages";
import { OG_CARD_NAMES, ogImagePath } from "../../../lib/head";
import { OG_CARDS, type OgCardName } from "../../../og/cards";
import type { OgCardSpec } from "../../../og/types";
import type { Config, OgResult } from "../types";
import { createArtStore } from "./art";
import { createFontStore } from "./fonts";
import { cardHash, ogInputs } from "./hash";
import { cardText, renderOgCard } from "./render";
import type { CardCache, CardRun, CardStores, OgManifest } from "./types";

/** One card of an `og()` run. */
type CardJob = {
  /** The card. */
  name: OgCardName;
  /** The card locale. */
  locale: Locale;
  /** Manifest key, `{card}/{locale}`. */
  key: string;
  /** The card's input hash. */
  hash: string;
  /** The PNG file, relative to the project. */
  output: string;
};

/**
 * Draw one card.
 *
 * @param name - The card.
 * @param locale - The card locale.
 * @param stores - The run's font and art stores.
 * @returns The PNG bytes.
 */
function drawCard(name: OgCardName, locale: Locale, stores: CardStores): Promise<Buffer> {
  const card: OgCardSpec = OG_CARDS[name];
  return renderOgCard(card, locale, cardText(card, locale), stores);
}

/**
 * Write a PNG, with its folder.
 *
 * @param file - The target file.
 * @param png - The PNG bytes.
 * @returns A promise settled once the file is written.
 */
async function writePng(file: string, png: Buffer): Promise<void> {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, png);
}

/**
 * Read the manifest of drawn cards. A missing file is an empty manifest: every card is drawn.
 *
 * @param file - The manifest file.
 * @returns The hash of each drawn card, keyed `{card}/{locale}`.
 * @example
 * ```ts
 * (await readManifest("assets/og-manifest.json"))["game/zh"]; // "9b1e…"
 * ```
 */
export async function readManifest(file: string): Promise<OgManifest> {
  let source: string;
  try {
    source = await readFile(file, "utf8");
  } catch {
    return {};
  }
  const table: unknown = JSON.parse(source);
  if (typeof table !== "object" || table === null) return {};

  const entries = Object.entries(table).filter(
    (entry): entry is [string, string] => typeof entry[1] === "string"
  );
  return Object.fromEntries(entries);
}

/**
 * Whether a card has to be drawn: its hash differs from the manifest, or its PNG is missing.
 *
 * @param job - The card.
 * @param manifest - The manifest of the last run.
 * @returns True when the card is drawn.
 */
async function isStale(job: CardJob, manifest: OgManifest): Promise<boolean> {
  if (manifest[job.key] !== job.hash) return true;
  try {
    await stat(job.output);
    return false;
  } catch {
    return true;
  }
}

/**
 * Draw the cards whose inputs changed or whose PNG is missing, skip the rest, and write the
 * manifest of every card last, so a run that fails draws its cards again next time.
 *
 * @param config - The plugin config: the art folder, the card folder and the manifest file.
 * @returns The cards written, card by card, and the count of cards that were up to date.
 */
export async function writeOgCards(
  config: Pick<Config, "outDir" | "ogDir" | "ogManifest">
): Promise<OgResult> {
  const [inputs, manifest] = await Promise.all([
    ogInputs(config.outDir),
    readManifest(config.ogManifest)
  ]);
  const jobs = OG_CARD_NAMES.flatMap(name =>
    LOCALES.map(
      (locale): CardJob => ({
        name,
        locale,
        key: `${name}/${locale}`,
        hash: cardHash(name, locale, inputs),
        output: path.join(config.ogDir, locale, `${name}.png`)
      })
    )
  );
  const staleFlags = await Promise.all(jobs.map(job => isStale(job, manifest)));
  const stale = jobs.filter((_job, index) => staleFlags[index]);

  // One card at a time: a card holds its fonts and art in memory while satori lays it out.
  const stores: CardStores = { fonts: createFontStore(), art: createArtStore(config.outDir) };
  for (const job of stale) await writePng(job.output, await drawCard(job.name, job.locale, stores));

  const hashes: OgManifest = Object.fromEntries(jobs.map(job => [job.key, job.hash]));
  await mkdir(path.dirname(config.ogManifest), { recursive: true });
  await writeFile(config.ogManifest, `${JSON.stringify(hashes, undefined, 2)}\n`);

  return { written: stale.map(job => job.output), upToDate: jobs.length - stale.length };
}

/**
 * Write one card into a built output directory. A card the cache holds is written as it is; a
 * card it lacks is drawn and added to it. Removed in the data PR.
 *
 * @param run - The output directory, the card cache and the run's stores.
 * @param name - The card.
 * @param locale - The card locale.
 * @returns The written file, relative to the output directory.
 */
async function writeBuildCard(run: CardRun, name: OgCardName, locale: Locale): Promise<string> {
  const key = `${name}/${locale}`;
  const png = run.cards.get(key) ?? (await drawCard(name, locale, run));
  run.cards.set(key, png);

  const file = ogImagePath(name, locale).slice(1);
  await writePng(path.join(run.outputDirectory, file), png);
  return file;
}

/**
 * Write every card of every locale into a built output directory: the build's OG step until the
 * data PR commits the cards. Removed in the data PR.
 *
 * @param outputDirectory - The output directory.
 * @param cards - The drawn cards of the process; the cards drawn by this run are added.
 * @param mediaDirectory - The art folder.
 * @returns The written files, relative to `outputDirectory`.
 * @example
 * ```ts
 * const files = await writeBuildCards("dist", ctx.state.cards, "public/media"); // ["og/en/home.png", …]
 * ```
 */
export async function writeBuildCards(
  outputDirectory: string,
  cards: CardCache,
  mediaDirectory: string
): Promise<string[]> {
  const run: CardRun = {
    outputDirectory,
    cards,
    fonts: createFontStore(),
    art: createArtStore(mediaDirectory)
  };
  const files: string[] = [];
  for (const locale of LOCALES) {
    for (const name of OG_CARD_NAMES) files.push(await writeBuildCard(run, name, locale));
  }
  return files;
}
