/**
 * @file Drawing one OG card: the words from the locale's strings, `EMAILS` and `SITE`, the fonts
 * each text style needs, the art, and the headline size. Satori lays out `src/og/OgCard.tsx` and
 * resvg rasterises the SVG. sharp packs the PNG into a palette so it stays well under the 300 KB some
 * chat apps take for a preview.
 */
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import sharp from "sharp";
import { EMAILS, SITE } from "../../../config";
import { t } from "../../../i18n";
import { CJK, type Locale } from "../../../i18n/languages";
import { typeset } from "../../../lib/typography";
import { OgCard } from "../../../og/OgCard";
import { OG_CARD_SIZE } from "../../../og/tokens";
import type { OgCardSpec, OgCardText } from "../../../og/types";
import { loadArt } from "./art";
import { fitHeadline, headlineFrame, headlineLines } from "./fit";
import { loadStack } from "./fonts";
import type { CardFont, CardStacks, CardStores, FontFace } from "./types";

/** Headline face (brand-system §4). */
const HEADING_FACE: FontFace = { family: "Nunito", pkg: "nunito", weight: 900 };

/** Message face (brand-system §4). */
const MESSAGE_FACE: FontFace = { family: "Golos Text", pkg: "golos-text", weight: 400 };

/** Address, email, status and signature face. */
const STRONG_FACE: FontFace = { family: "Golos Text", pkg: "golos-text", weight: 600 };

/** The quiet second address line of the support card. */
const QUIET_FACE: FontFace = { family: "Golos Text", pkg: "golos-text", weight: 500 };

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

/** The site address on the address line and in the signature. */
const SITE_ADDRESS = new URL(SITE.url).host;

/**
 * The font stacks of a locale's cards: Latin faces first, the locale's CJK face behind them.
 *
 * @param locale - The card locale.
 * @returns The stacks of the headline, the message, the strong and the quiet text.
 * @example
 * ```ts
 * cardStacks("ko").heading.map(face => face.family); // ["Nunito", "Gothic A1"]
 * ```
 */
export function cardStacks(locale: Locale): CardStacks {
  const cjk = CJK_FACES[locale];
  if (cjk === undefined) {
    return {
      heading: [HEADING_FACE],
      message: [MESSAGE_FACE],
      strong: [STRONG_FACE],
      quiet: [QUIET_FACE]
    };
  }
  return {
    heading: [HEADING_FACE, cjk.heading],
    message: [MESSAGE_FACE, cjk.text],
    strong: [STRONG_FACE, cjk.text],
    quiet: [QUIET_FACE, cjk.text]
  };
}

/** Narrow no-break space: the French space before `; : ! ?` and inside « ». */
const NARROW_NBSP = "\u{202F}";

/** No-break space. */
const NBSP = "\u{A0}";

/**
 * A string set in the locale's typography for a card. Nunito and Golos Text have no narrow no-break
 * space and satori would draw a box, so the card takes a plain no-break space in its place: it
 * still keeps the French `:` on the line of its word.
 *
 * @param text - The string.
 * @param locale - The card locale.
 * @returns The typeset string, with no narrow no-break space.
 */
function cardTypeset(text: string, locale: Locale): string {
  return typeset(text, locale).replaceAll(NARROW_NBSP, NBSP);
}

/**
 * A headline as the design breaks it: a Japanese one after its first comma (`きっと、` /
 * `遊ぶ価値がある。`), so it never wraps mid-word.
 *
 * @param headline - The typeset headline.
 * @param locale - The card locale.
 * @returns The headline, with a written line break in Japanese.
 */
function breakHeadline(headline: string, locale: Locale): string {
  return locale === "ja" ? headline.replace("、", "、\n") : headline;
}

/**
 * The words of one card, set in the locale's typography: the page's title and description, the
 * store status on a card with a status chip, the support address on a card that writes it.
 *
 * @param card - The card's row.
 * @param locale - The card locale.
 * @returns The words on the card.
 * @example
 * ```ts
 * cardText(OG_CARDS.game, "en").status; // "Coming soon to iPhone and Android"
 * cardText(OG_CARDS.home, "ja").headline; // "きっと、\n遊ぶ価値がある。"
 * ```
 */
export function cardText(card: OgCardSpec, locale: Locale): OgCardText {
  const strings = t(locale);
  const { title, description } = strings.meta[card.page];
  const text: OgCardText = {
    headline: breakHeadline(cardTypeset(title, locale), locale),
    message: cardTypeset(description, locale)
  };
  if (card.layout === "letter") return text;

  if (card.status === true) text.status = cardTypeset(strings.game.tags.status, locale);
  if (card.email === true) text.email = EMAILS.support;
  return text;
}

/**
 * The fonts of every text style, each once: the stacks share their CJK text face.
 *
 * @param fonts - The picked fonts of all stacks.
 * @returns The fonts, unique by name, in first-seen order.
 */
function uniqueFonts(fonts: readonly CardFont[]): CardFont[] {
  return [...new Map(fonts.map(font => [font.name, font])).values()];
}

/**
 * Render one card to a PNG.
 *
 * @param card - The card's row; picks the layout and the art.
 * @param locale - The card locale; picks the font stacks and the headline size.
 * @param text - The words on the card.
 * @param stores - The run's font and art stores.
 * @returns The PNG bytes, 1200 × 630.
 * @example
 * ```ts
 * const png = await renderOgCard(OG_CARDS.home, "de", cardText(OG_CARDS.home, "de"), stores);
 * ```
 */
export async function renderOgCard(
  card: OgCardSpec,
  locale: Locale,
  text: OgCardText,
  stores: CardStores
): Promise<Buffer> {
  // Load only the glyphs each text style draws, from the locale's stacks.
  const stacks = cardStacks(locale);
  const strongText = [text.status ?? "", text.email ?? "", SITE_ADDRESS].join("");
  const quietText = text.email === undefined ? "" : SITE_ADDRESS;
  const [heading, message, strong, quiet] = await Promise.all([
    loadStack(stacks.heading, text.headline, stores.fonts),
    loadStack(stacks.message, text.message, stores.fonts),
    loadStack(stacks.strong, strongText, stores.fonts),
    loadStack(stacks.quiet, quietText, stores.fonts)
  ]);

  // Read the art and fit the headline to its column.
  const art = await loadArt(card, stores.art);
  const frame = headlineFrame(card);
  const headlineSize = fitHeadline(text.headline, locale, frame.base, frame.maxLines, frame.width);

  // Lay the card out as SVG in those fonts.
  const tree = OgCard({
    card,
    text,
    site: SITE_ADDRESS,
    art,
    families: {
      heading: heading.family,
      message: message.family,
      strong: strong.family,
      quiet: quiet.family
    },
    headlineSize,
    headlineLines: headlineLines(text.headline, headlineSize, frame.width),
    isCjk: CJK.has(locale)
  });
  const svg = await satori(tree, {
    width: OG_CARD_SIZE.width,
    height: OG_CARD_SIZE.height,
    fonts: uniqueFonts([...heading.fonts, ...message.fonts, ...strong.fonts, ...quiet.fonts])
  });

  // Rasterise the SVG, then pack the PNG into a palette.
  const png = new Resvg(svg).render().asPng();
  return sharp(png).png({ palette: true, quality: 90 }).toBuffer();
}
