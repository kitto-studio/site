/**
 * @file Writing the OG cards: per locale, one 1200 × 630 PNG per row of `OG_CARDS`
 * (`og/{lang}/{card}.png`, the paths `pageHead` links). A card is drawn once per process: later
 * runs, such as the dev server's rebuilds, write it from the plugin's card cache.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { LOCALES, type Locale } from "../../../i18n/languages";
import { OG_CARD_NAMES, ogImagePath } from "../../../lib/head";
import { OG_CARDS, type OgCardName } from "../../../og/cards";
import type { OgCardSpec } from "../../../og/types";
import { createArtStore } from "./art";
import { createFontStore } from "./fonts";
import { cardText, renderOgCard } from "./render";
import type { CardCache, CardRun } from "./types";

/**
 * Write one card into a built output directory. A card the cache holds is written as it is; a
 * card it lacks is drawn and added to it.
 *
 * @param run - The output directory, the card cache and the run's stores.
 * @param name - The card.
 * @param locale - The card locale.
 * @returns The written file, relative to the output directory.
 */
async function writeCard(run: CardRun, name: OgCardName, locale: Locale): Promise<string> {
  const key = `${name}/${locale}`;
  const card: OgCardSpec = OG_CARDS[name];
  const png = run.cards.get(key) ?? (await renderOgCard(card, locale, cardText(card, locale), run));
  run.cards.set(key, png);

  const file = ogImagePath(name, locale).slice(1);
  const target = path.join(run.outputDirectory, file);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, png);

  return file;
}

/**
 * Write every card of every locale into a built output directory.
 *
 * @param outputDirectory - The output directory.
 * @param cards - The drawn cards of the process; the cards drawn by this run are added.
 * @returns The written files, relative to `outputDirectory`.
 * @example
 * ```ts
 * const files = await writeOgCards("dist", ctx.state.cards); // ["og/en/home.png", "og/en/game.png", …]
 * ```
 */
export async function writeOgCards(outputDirectory: string, cards: CardCache): Promise<string[]> {
  const run: CardRun = {
    outputDirectory,
    cards,
    fonts: createFontStore(),
    art: createArtStore()
  };
  const files: string[] = [];
  for (const locale of LOCALES) {
    for (const name of OG_CARD_NAMES) files.push(await writeCard(run, name, locale));
  }
  return files;
}
