import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { EMAILS } from "../../../../config";
import { t } from "../../../../i18n";
import { LOCALES, type Locale } from "../../../../i18n/languages";
import { OG_CARD_NAMES } from "../../../../lib/head";
import { typeset } from "../../../../lib/typography";
import { OG_CARDS } from "../../../../og/cards";
import { LegalLetter } from "../../../../og/LegalLetter";
import { Postcard } from "../../../../og/Postcard";
import { Message } from "../../../../og/parts/Words";
import type { OgCardSpec } from "../../../../og/types";
import { createArtStore } from "../../og/art";
import { createFontStore } from "../../og/fonts";
import { cardHash, ogInputs } from "../../og/hash";
import { cardText, renderOgCard } from "../../og/render";
import type { CardStores, OgManifest } from "../../og/types";
import { readManifest, writeOgCards } from "../../og/write";

/** The site's art, the assets plugin's `outDir`; tests run from the project root. */
const MEDIA = "public/media";

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

const stores: CardStores = { fonts: createFontStore(), art: createArtStore(MEDIA) };

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

  // Catches: the support card's five-line message (fr, es, ja) running into the postmark, because
  // the row's line limit never reaches the message.
  it("cuts the message after the row's line limit", () => {
    const tree = Postcard({
      card: OG_CARDS.support,
      text: cardText(OG_CARDS.support, "fr"),
      site: "kitto.studio",
      art: { stamp: "", print: "" },
      families: { heading: "H", message: "M", strong: "S", quiet: "Q" },
      headlineSize: 96,
      headlineLines: 1,
      isCjk: false
    });

    expect(messagesOf(tree).map(props => props.maxLines)).toEqual([4]);
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
    const headline = cardText(OG_CARDS.home, "ja").headline;
    const comma = headline.indexOf("、");

    expect(comma).toBeGreaterThan(0);
    expect(headline.slice(comma + 1, comma + 2)).toBe("\n");
    expect(cardText(OG_CARDS.home, "ko").headline).not.toContain("\n");
  });

  // Catches: the French narrow no-break space reaching a card. Nunito and Golos Text have no
  // U+202F, so satori draws a box before the colon.
  it("sets the French space before a colon as a no-break space the card fonts have", () => {
    const { message } = cardText(OG_CARDS.support, "fr");

    expect(message).not.toContain("\u{202F}");
    expect(message).toContain("\u{A0}:");
  });
});

describe("writeOgCards", () => {
  let root = "";
  let config = { outDir: MEDIA, ogDir: "", ogManifest: "" };

  beforeEach(async () => {
    root = await mkdtemp(path.join(tmpdir(), "kitto-og-"));
    config = {
      outDir: MEDIA,
      ogDir: path.join(root, "og"),
      ogManifest: path.join(root, "og.json")
    };
  });

  afterEach(async () => {
    await rm(root, { recursive: true, force: true });
  });

  /** The PNG file of a card in the temporary card folder. */
  const cardFile = (name: string, locale: string): string =>
    path.join(config.ogDir, locale, `${name}.png`);

  /** A manifest with every card's current hash, and a placeholder PNG for every card. */
  const writeUpToDate = async (): Promise<OgManifest> => {
    const inputs = await ogInputs(MEDIA);
    const manifest: OgManifest = {};
    for (const name of OG_CARD_NAMES) {
      for (const locale of LOCALES) {
        manifest[`${name}/${locale}`] = cardHash(name, locale, inputs);
        await mkdir(path.dirname(cardFile(name, locale)), { recursive: true });
        await writeFile(cardFile(name, locale), `${name} ${locale}`);
      }
    }
    return manifest;
  };

  const cardCount = OG_CARD_NAMES.length * LOCALES.length;

  // Catches: a run that redraws every card (a minute each time), a card whose inputs changed left
  // as it was, a card drawn under another card's file, and a new hash the manifest never records
  // (the card drawn again on every run).
  it("draws exactly the card whose hash changed and records its new hash", async () => {
    const manifest = await writeUpToDate();
    const fresh = manifest["game/zh"];
    await writeFile(config.ogManifest, JSON.stringify({ ...manifest, "game/zh": "stale" }));

    const result = await writeOgCards(config);

    expect(result).toEqual({ written: [cardFile("game", "zh")], upToDate: cardCount - 1 });
    const drawn = await readFile(cardFile("game", "zh"));
    expect(drawn.subarray(0, 8).toString("hex")).toBe(PNG_SIGNATURE);
    expect(await readFile(cardFile("game", "ja"), "utf8")).toBe("game ja");
    expect(await readManifest(config.ogManifest)).toEqual({ ...manifest, "game/zh": fresh });
  });

  // Catches: a card whose PNG was deleted never coming back while its hash still matches.
  it("draws a card whose PNG is missing", async () => {
    const manifest = await writeUpToDate();
    await writeFile(config.ogManifest, JSON.stringify(manifest));
    await rm(cardFile("home", "en"));

    const result = await writeOgCards(config);

    expect(result).toEqual({ written: [cardFile("home", "en")], upToDate: cardCount - 1 });
  });
});

// Catches: the first `bun run og`, with no manifest yet, failing instead of drawing every card.
describe("readManifest", () => {
  it("reads a missing manifest as an empty one", async () => {
    expect(await readManifest(path.join(tmpdir(), "kitto-no-such-manifest.json"))).toEqual({});
  });
});
