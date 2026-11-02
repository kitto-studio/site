import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { LOCALES, type Locale } from "../../../../i18n/languages";
import { renderOgCard, writeOgCards } from "../../og";
import { createFontStore } from "../../og/fonts";
import type { CardCache } from "../../og/types";

/** Width and height from the PNG header (IHDR). */
const pngSize = (png: Buffer) => ({ width: png.readUInt32BE(16), height: png.readUInt32BE(20) });

const PNG_SIGNATURE = "89504e470d0a1a0a";

// One card per script family, with real text in that script: the translations arrive later.
const SAMPLES: [string, Locale, string, string][] = [
  ["Latin", "de", "Ganz sicher einen Versuch wert.", "Ein kleines Familienstudio."],
  ["Cyrillic", "ru", "Точно стоит сыграть.", "Маленькая семейная студия."],
  ["Japanese", "ja", "きっと遊ぶ価値がある。", "小さな家族のスタジオです。"],
  ["Korean", "ko", "분명히 해볼 만해요.", "작은 가족 스튜디오입니다."],
  ["Chinese", "zh", "一定值得一玩。", "一个小小的家庭工作室。"]
];

const store = createFontStore();

// Catches: a script family whose card fails to render (missing face, unreadable slice) or a card
// at a size the share previews crop.
describe("renderOgCard", () => {
  it.each(
    SAMPLES
  )("renders a %s card as a 1200 × 630 PNG", async (_family, locale, headline, lead) => {
    const png = await renderOgCard(locale, { headline, lead, status: lead }, store);

    expect(png.subarray(0, 8).toString("hex")).toBe(PNG_SIGNATURE);
    expect(pngSize(png)).toEqual({ width: 1200, height: 630 });
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

  // Catches: every dev rebuild drawing all 22 cards again (some 9 s), a cached card written under
  // another card's name, and a drawn card the cache never keeps.
  it("writes a cached card as it is and draws, then keeps, a card the cache lacks", async () => {
    const cards: CardCache = new Map(
      LOCALES.flatMap(locale =>
        ["home", "game"].map((kind): [string, Buffer] => [
          `${kind}/${locale}`,
          Buffer.from(`${kind} ${locale}`)
        ])
      )
    );
    cards.delete("game/zh");

    const files = await writeOgCards(outDir, cards);

    expect(files).toHaveLength(22);
    expect(await readFile(path.join(outDir, "og/ru/game.png"), "utf8")).toBe("game ru");
    const drawn = await readFile(path.join(outDir, "og/zh/game.png"));
    expect(drawn.subarray(0, 8).toString("hex")).toBe(PNG_SIGNATURE);
    expect(cards.get("game/zh")).toEqual(drawn);
  });
});
