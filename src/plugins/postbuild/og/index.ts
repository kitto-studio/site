/**
 * @file OG cards: per locale, one 1200 × 630 PNG for the home page and one for the game page
 * (`og/{lang}/{home,game}.png`, the paths `pageHead` links). Satori lays out `src/og/OgCard.tsx`
 * with the card's fonts and resvg rasterises the SVG. Every word comes from the locale's strings.
 * A card is drawn once per process: later runs, such as the dev server's rebuilds, write it from
 * the plugin's card cache.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import { SITE } from "../../../config";
import { t } from "../../../i18n";
import { CJK, LOCALES, type Locale } from "../../../i18n/languages";
import { type OgCardKind, ogImagePath } from "../../../lib/head";
import { typeset } from "../../../lib/typography";
import { OG_CARD_SIZE, OgCard } from "../../../og/OgCard";
import { createFontStore, loadStack } from "./fonts";
import type { CardCache, CardRun, FontFace, FontStore, OgCardText } from "./types";

/** The two cards of every locale. */
const CARD_KINDS: readonly OgCardKind[] = ["home", "game"];

/** Headline face (brand-system §4). */
const HEADING_FACE: FontFace = { family: "Nunito", pkg: "nunito", weight: 900 };

/** Text face (brand-system §4). */
const TEXT_FACE: FontFace = { family: "Golos Text", pkg: "golos-text", weight: 500 };

/** CJK faces behind the Latin ones, as on the site's CJK pages; headline at the heaviest vendored weight. */
const CJK_FACES: Readonly<Partial<Record<Locale, { heading: FontFace; text: FontFace }>>> = {
  ja: {
    heading: { family: "M PLUS Rounded 1c", pkg: "m-plus-rounded-1c", weight: 800 },
    text: { family: "M PLUS Rounded 1c", pkg: "m-plus-rounded-1c", weight: 500 }
  },
  ko: {
    heading: { family: "Gothic A1", pkg: "gothic-a1", weight: 800 },
    text: { family: "Gothic A1", pkg: "gothic-a1", weight: 500 }
  },
  zh: {
    heading: { family: "Noto Sans SC", pkg: "noto-sans-sc", weight: 800 },
    text: { family: "Noto Sans SC", pkg: "noto-sans-sc", weight: 500 }
  }
};

/** The site address in the card corner. */
const SITE_ADDRESS = new URL(SITE.url).host;

/**
 * The font stacks of a locale's cards: Latin faces first, the locale's CJK face behind them.
 *
 * @param locale - The card locale.
 * @returns The headline and text stacks, in fallback order.
 * @example
 * ```ts
 * cardStacks("ko").heading.map(face => face.family); // ["Nunito", "Gothic A1"]
 * ```
 */
export function cardStacks(locale: Locale): { heading: FontFace[]; text: FontFace[] } {
  const cjk = CJK_FACES[locale];
  if (cjk === undefined) return { heading: [HEADING_FACE], text: [TEXT_FACE] };
  return { heading: [HEADING_FACE, cjk.heading], text: [TEXT_FACE, cjk.text] };
}

/**
 * The words of one card, set in the locale's typography.
 *
 * @param kind - The card.
 * @param locale - The card locale.
 * @returns Headline, lead and, on the game card, the status line.
 * @example
 * ```ts
 * cardText("game", "en"); // { headline: "A Memory Missing: Merge Game", lead: "Detective merge game", status: "Coming soon to iPhone and Android" }
 * ```
 */
export function cardText(kind: OgCardKind, locale: Locale): OgCardText {
  const strings = t(locale);
  const text: OgCardText =
    kind === "home"
      ? { headline: strings.home.hero.title, lead: strings.home.hero.lead }
      : {
          headline: strings.game.name,
          lead: strings.game.tags.genre,
          status: strings.game.tags.status
        };
  return {
    headline: typeset(text.headline, locale),
    lead: typeset(text.lead, locale),
    ...(text.status === undefined ? {} : { status: typeset(text.status, locale) })
  };
}

/**
 * Render one card to a PNG.
 *
 * @param locale - The card locale; picks the font stacks.
 * @param text - The words on the card.
 * @param store - The run's font store.
 * @returns The PNG bytes, 1200 × 630.
 */
export async function renderOgCard(
  locale: Locale,
  text: OgCardText,
  store: FontStore
): Promise<Buffer> {
  // Load only the glyphs the card uses, from the locale's heading and text stacks.
  const stacks = cardStacks(locale);
  const body = [text.lead, text.status ?? "", SITE_ADDRESS].join("");
  const [heading, rest] = await Promise.all([
    loadStack(stacks.heading, text.headline, store),
    loadStack(stacks.text, body, store)
  ]);

  // Lay the card out as SVG in those fonts.
  const card = OgCard({
    ...text,
    site: SITE_ADDRESS,
    headingFamily: heading.family,
    textFamily: rest.family,
    isCjk: CJK.has(locale)
  });
  const svg = await satori(card, {
    width: OG_CARD_SIZE.width,
    height: OG_CARD_SIZE.height,
    fonts: [...heading.fonts, ...rest.fonts]
  });

  // Rasterise the SVG to the PNG bytes.
  return new Resvg(svg).render().asPng();
}

/**
 * Write one card into a built output directory. A card the cache holds is written as it is; a
 * card it lacks is drawn and added to it.
 *
 * @param run - The output directory, the card cache and the run's font store.
 * @param kind - The card.
 * @param locale - The card locale.
 * @returns The written file, relative to the output directory.
 */
async function writeCard(run: CardRun, kind: OgCardKind, locale: Locale): Promise<string> {
  const key = `${kind}/${locale}`;
  const png = run.cards.get(key) ?? (await renderOgCard(locale, cardText(kind, locale), run.store));
  run.cards.set(key, png);

  const file = ogImagePath(kind, locale).slice(1);
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
 */
export async function writeOgCards(outputDirectory: string, cards: CardCache): Promise<string[]> {
  const run: CardRun = { outputDirectory, cards, store: createFontStore() };
  const files: string[] = [];
  for (const locale of LOCALES) {
    for (const kind of CARD_KINDS) files.push(await writeCard(run, kind, locale));
  }
  return files;
}
