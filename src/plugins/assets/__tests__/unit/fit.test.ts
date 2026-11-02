import { describe, expect, it } from "vitest";
import { LOCALES } from "../../../../i18n/languages";
import { OG_CARDS } from "../../../../og/cards";
import { fitHeadline, headlineFrame, headlineLines } from "../../og/fit";
import { cardText } from "../../og/render";

// Catches: a line count that never wraps (every headline "fits" at its base size), CJK text read
// as one unbreakable word, the ja line break ignored, and a word wider than the column counted as
// fitting (satori would draw it past the column).
describe("headlineLines", () => {
  it("wraps words where the estimated width runs out", () => {
    // "Surely worth" is 6.68 em: 494.3 px at 74 fits 500, 507.7 px at 76 does not.
    expect(headlineLines("Surely worth playing.", 74, 500)).toBe(2);
    expect(headlineLines("Surely worth playing.", 76, 500)).toBe(3);
  });

  it("breaks CJK text between any two characters and at a written line break", () => {
    expect(headlineLines("遊ぶ価値がある。", 64, 500)).toBe(2);
    expect(headlineLines("きっと、\n遊ぶ価値がある。", 58, 500)).toBe(2);
  });

  // A no-break space (typeset ru, uk, fr) glues its words: they wrap as one.
  it("never fits a word wider than the column, a no-break space included", () => {
    expect(headlineLines("Datenschutzerklärung", 84, 600)).toBe(Number.POSITIVE_INFINITY);
    expect(headlineLines("О\u{A0}студии", 96, 400)).toBe(Number.POSITIVE_INFINITY);
  });
});

describe("fitHeadline", () => {
  // Catches: a headline shrunk although it already fits at the design size.
  it("keeps a short en headline at its base size", () => {
    expect(fitHeadline("Games", "en", 96, 2, 500)).toBe(96);
  });

  // Catches: a CJK card set at the Latin design size instead of the CJK one (design A8).
  it("starts a CJK headline at 58", () => {
    expect(fitHeadline("ゲーム", "ja", 96, 2, 500)).toBe(58);
  });

  // Catches: a long headline kept at its base size, or shrunk below the readable floor.
  it("steps down by 2 px until the headline fits, never below the floor", () => {
    expect(fitHeadline("Surely worth playing.", "en", 76, 2, 500)).toBe(74);
    expect(fitHeadline("Datenschutzerklärung", "de", 84, 2, 300)).toBe(48);
    expect(fitHeadline("遊ぶ価値がある。".repeat(3), "ja", 74, 1, 500)).toBe(44);
  });

  // Catches: a headline that runs off its column, or past its line limit, in one locale.
  it("fits every card's headline in every locale within its line limit", () => {
    for (const [name, card] of Object.entries(OG_CARDS)) {
      const frame = headlineFrame(card);
      for (const locale of LOCALES) {
        const { headline } = cardText(card, locale);
        const size = fitHeadline(headline, locale, frame.base, frame.maxLines, frame.width);

        expect(headlineLines(headline, size, frame.width), `${name} ${locale}`).toBeLessThanOrEqual(
          frame.maxLines
        );
      }
    }
  });
});
