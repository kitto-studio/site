import { describe, expect, it } from "vitest";
import { createFontStore, pickSlices } from "../../og/fonts";
import type { FaceRanges, FontFace } from "../../og/types";

const store = createFontStore();
const nunito: FontFace = { family: "Nunito", pkg: "nunito", weight: 900 };
const mplus: FontFace = { family: "M PLUS Rounded 1c", pkg: "m-plus-rounded-1c", weight: 800 };

const rangesOf = async (face: FontFace): Promise<FaceRanges> => ({
  face,
  slices: await store.slices(face.pkg)
});

const picked = async (faces: FontFace[], text: string): Promise<string[]> => {
  const stack = await Promise.all(faces.map(face => rangesOf(face)));
  return pickSlices(stack, text).map(({ face, slice }) => `${face.family} ${slice}`);
};

// Catches: a card that loads every CJK slice (slow builds), Latin letters drawn by the CJK face,
// and a box glyph shipped for a character no face has.
describe("pickSlices", () => {
  it("loads only the slices the text needs, the Latin face first", async () => {
    expect(await picked([nunito, mplus], "Kitto")).toEqual(["Nunito latin"]);
    expect(await picked([nunito, mplus], "Точно")).toEqual(["Nunito cyrillic"]);

    const japanese = await picked([nunito, mplus], "きっと Kitto");
    expect(japanese).toContain("Nunito latin");
    expect(japanese.filter(slice => slice.startsWith("M PLUS"))).toHaveLength(1);
  });

  // Also catches: an error that names another plugin or sends the reader to a file without the
  // font stacks.
  it("stops on a character no face of the stack covers", async () => {
    await expect(picked([nunito], "분명히")).rejects.toThrow(
      /^\[kitto\] assets: no OG card font covers "분" \(U\+BD84\).*\n.*src\/plugins\/assets\/og\/render\.ts\.$/
    );
  });
});
