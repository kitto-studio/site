import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { EMAILS } from "../../../../config";
import { t } from "../../../../i18n";
import { LOCALES, type Locale } from "../../../../i18n/languages";
import { typeset } from "../../../../lib/typography";
import { OG_CARDS } from "../../../../og/cards";
import { LegalLetter } from "../../../../og/LegalLetter";
import { Postcard } from "../../../../og/Postcard";
import { Message } from "../../../../og/parts/Words";
import type { OgCardSpec } from "../../../../og/types";
import { cardText, renderOgCard, writeOgCards } from "../../og";
import { createArtStore } from "../../og/art";
import { createFontStore } from "../../og/fonts";
import type { CardCache, CardStores } from "../../og/types";

/** Width and height from the PNG header (IHDR). */
const pngSize = (png: Buffer) => ({ width: png.readUInt32BE(16), height: png.readUInt32BE(20) });

const PNG_SIGNATURE = "89504e470d0a1a0a";

/** A legal letter, drawn before the data PR adds the legal rows. */
const LETTER: OgCardSpec = {
  page: "privacy",
  layout: "letter",
  headline: 84,
  stamp: { image: "stickers/plant", ground: "#e2dccd" }
};

/** A postcard with the support address, drawn before the data PR adds the support row. */
const SUPPORT: OgCardSpec = { ...OG_CARDS.home, page: "support", email: true };

const stores: CardStores = { fonts: createFontStore(), art: createArtStore() };

const hasStatus = (card: OgCardSpec): boolean => card.layout === "postcard" && card.status === true;
const hasEmail = (card: OgCardSpec): boolean => card.layout === "postcard" && card.email === true;

// One card per script family, with the locale's real words, across both layouts and both sides.
const SAMPLES: { family: string; locale: Locale; layout: string; card: OgCardSpec }[] = [
  { family: "Latin", locale: "de", layout: "left postcard", card: OG_CARDS.home },
  { family: "Cyrillic", locale: "ru", layout: "right postcard with a status", card: OG_CARDS.game },
  { family: "Japanese", locale: "ja", layout: "legal letter", card: LETTER },
  { family: "Korean", locale: "ko", layout: "postcard with the support address", card: SUPPORT },
  { family: "Chinese", locale: "zh", layout: "right postcard with a status", card: OG_CARDS.game }
];

// Catches: a layout satori refuses (a style it cannot draw, a div with two children and no flex),
// a script family whose card fails to render (missing face, unreadable slice), a card at a size
// the share previews crop, or a card too heavy for a chat app's preview (WhatsApp skips ~300 KB).
describe("renderOgCard", () => {
  it.each(SAMPLES)("renders a $family $layout as a 1200 × 630 PNG", async ({ locale, card }) => {
    const png = await renderOgCard(card, locale, cardText(card, locale), stores);

    expect(png.subarray(0, 8).toString("hex")).toBe(PNG_SIGNATURE);
    expect(pngSize(png)).toEqual({ width: 1200, height: 630 });
    expect(png.length).toBeLessThan(300_000);
  });
});

/** Every element style in a card tree, components left unrendered. */
const stylesOf = (node: unknown): Record<string, unknown>[] => {
  if (Array.isArray(node)) return node.flatMap(child => stylesOf(child));
  if (typeof node !== "object" || node === null || !("props" in node)) return [];
  const props = node.props as { style?: Record<string, unknown>; children?: unknown };
  return [...(props.style === undefined ? [] : [props.style]), ...stylesOf(props.children)];
};

// Catches: a row's message gap dropped, so a short headline's message sits higher than the design,
// and a gap kept under a two-line headline, pushing the message under the postmark (es about).
describe("Postcard", () => {
  it("puts the row's message gap under a one-line headline only", () => {
    const props = {
      text: cardText(OG_CARDS.home, "en"),
      site: "kitto.studio",
      art: { stamp: "", print: "" },
      families: { heading: "H", message: "M", strong: "S", quiet: "Q" },
      headlineSize: 74,
      headlineLines: 1,
      isCjk: false
    };
    const card = { ...OG_CARDS.home, messageGap: 47 };
    const gapped = stylesOf(Postcard({ ...props, card }));
    const twoLines = stylesOf(Postcard({ ...props, card, headlineLines: 2 }));
    const plain = stylesOf(Postcard({ ...props, card: OG_CARDS.home }));

    expect(gapped).toContainEqual({ flexGrow: 1, maxHeight: 47 });
    expect(twoLines.some(style => style.maxHeight === 47)).toBe(false);
    expect(plain.some(style => style.maxHeight === 47)).toBe(false);
  });
});

/** The props of every `Message` in a card tree. */
const messagesOf = (node: unknown): Record<string, unknown>[] => {
  if (Array.isArray(node)) return node.flatMap(child => messagesOf(child));
  if (typeof node !== "object" || node === null || !("props" in node)) return [];
  const props = node.props as Record<string, unknown>;
  const own = "type" in node && node.type === Message ? [props] : [];
  return [...own, ...messagesOf(props.children)];
};

// Catches: a long legal description (fr, uk delete-data) running on under the postmark.
describe("LegalLetter", () => {
  it("cuts the message after three lines", () => {
    const tree = LegalLetter({
      card: LETTER,
      text: cardText(LETTER, "fr"),
      site: "kitto.studio",
      art: { stamp: "" },
      families: { heading: "H", message: "M", strong: "S", quiet: "Q" },
      headlineSize: 84,
      headlineLines: 1,
      isCjk: false
    });

    expect(messagesOf(tree).map(props => props.maxLines)).toEqual([3]);
  });
});

describe("cardText", () => {
  // Catches: a card wired to another page's words, the game card without its status chip, and the
  // support card without its address.
  it("gives each card its page's title and description", () => {
    const strings = t("de");
    for (const card of [...Object.values(OG_CARDS), SUPPORT, LETTER]) {
      const text = cardText(card, "de");

      expect(text.headline, card.page).toBe(typeset(strings.meta[card.page].title, "de"));
      expect(text.message, card.page).toBe(typeset(strings.meta[card.page].description, "de"));
      expect(text.status, card.page).toBe(
        hasStatus(card) ? typeset(strings.game.tags.status, "de") : undefined
      );
      expect(text.email, card.page).toBe(hasEmail(card) ? EMAILS.support : undefined);
    }
  });

  // Catches: a Japanese headline wrapping mid-word instead of after its comma, as the design sets it.
  it("breaks the ja headline after the first 、", () => {
    expect(cardText(OG_CARDS.home, "ja").headline).toBe("きっと、\n遊ぶ価値がある。");
    expect(cardText(OG_CARDS.home, "ko").headline).not.toContain("\n");
  });
});

describe("writeOgCards", () => {
  let outDir = "";

  beforeEach(async () => {
    outDir = await mkdtemp(path.join(tmpdir(), "kitto-og-"));
  });

  afterEach(async () => {
    await rm(outDir, { recursive: true, force: true });
  });

  // Catches: a card dropped from the loop, every dev rebuild drawing all cards again, a cached card
  // written under another card's name, and a drawn card the cache never keeps.
  it("writes a cached card as it is and draws, then keeps, a card the cache lacks", async () => {
    const names = Object.keys(OG_CARDS);
    const cards: CardCache = new Map(
      LOCALES.flatMap(locale =>
        names.map((name): [string, Buffer] => [
          `${name}/${locale}`,
          Buffer.from(`${name} ${locale}`)
        ])
      )
    );
    const [cachedName = "", drawnName = ""] = names;
    cards.delete(`${drawnName}/zh`);

    const files = await writeOgCards(outDir, cards);

    expect(files).toHaveLength(names.length * LOCALES.length);
    expect(await readFile(path.join(outDir, "og", "ru", `${cachedName}.png`), "utf8")).toBe(
      `${cachedName} ru`
    );
    const drawn = await readFile(path.join(outDir, "og", "zh", `${drawnName}.png`));
    expect(drawn.subarray(0, 8).toString("hex")).toBe(PNG_SIGNATURE);
    expect(cards.get(`${drawnName}/zh`)).toEqual(drawn);
  });
});
