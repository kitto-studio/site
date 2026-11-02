/**
 * @file Writing the OG cards: per locale, one 1200 × 630 PNG per row of `OG_CARDS`
 * (`{ogDir}/{lang}/{card}.png`, served at the paths `pageHead` links). `writeOgCards` draws only
 * the cards whose inputs changed since the manifest and writes the manifest last.
 */
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { LOCALES, type Locale } from "../../../i18n/languages";
import { OG_CARD_NAMES } from "../../../lib/head";
import { OG_CARDS, type OgCardName } from "../../../og/cards";
import type { OgCardSpec } from "../../../og/types";
import type { Config, OgResult } from "../types";
import { createArtStore } from "./art";
import { createFontStore } from "./fonts";
import { cardHash, ogInputs } from "./hash";
import { cardText, renderOgCard } from "./render";
import type { CardStores, OgManifest } from "./types";

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
