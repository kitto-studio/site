import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { LOCALES } from "../../../../i18n/languages";
import { OG_CARD_NAMES } from "../../../../lib/head";
import { cardHash, ogInputs } from "../../og/hash";
import type { OgManifest } from "../../og/types";

/** The committed cards, their manifest and their art, as the assets plugin config names them. */
const OG_DIR = "public/og";
const MANIFEST = "assets/og-manifest.json";
const MEDIA = "public/media";

/** What to do when a card is stale or missing. */
const RECIPE = `Run \`bun run og\` and commit ${OG_DIR} and ${MANIFEST}.`;

/** Whether a file exists. */
const exists = async (file: string): Promise<boolean> => {
  try {
    await stat(file);
    return true;
  } catch {
    return false;
  }
};

// Catches: a commit that changes a card's words, row, art or drawing code without `bun run og`,
// so the site deploys an old card. Hashes only, it draws nothing.
describe("committed OG cards", () => {
  it("match the hash of every card in every locale", async () => {
    const [inputs, source] = await Promise.all([ogInputs(MEDIA), readFile(MANIFEST, "utf8")]);
    const manifest: OgManifest = JSON.parse(source);

    const stale = OG_CARD_NAMES.flatMap(name =>
      LOCALES.filter(
        locale => manifest[`${name}/${locale}`] !== cardHash(name, locale, inputs)
      ).map(locale => `${name}/${locale}`)
    );

    expect(stale, `Stale OG cards: ${stale.join(", ")}.\n${RECIPE}`).toEqual([]);
    expect(
      Object.keys(manifest).toSorted(),
      `The manifest keys differ from OG_CARDS × LOCALES.\n${RECIPE}`
    ).toEqual(OG_CARD_NAMES.flatMap(name => LOCALES.map(locale => `${name}/${locale}`)).toSorted());
  });

  it("have a PNG for every manifest key", async () => {
    const manifest: OgManifest = JSON.parse(await readFile(MANIFEST, "utf8"));
    const files = Object.keys(manifest).map(key => {
      const [name = "", locale = ""] = key.split("/");
      return path.join(OG_DIR, locale, `${name}.png`);
    });
    const flags = await Promise.all(files.map(file => exists(file)));
    const missing = files.filter((_file, index) => !flags[index]);

    expect(missing, `Missing OG cards: ${missing.join(", ")}.\n${RECIPE}`).toEqual([]);
  });
});
