/**
 * @file The build's OG step until the data PR. The card drawing moved to the assets plugin
 * (`app.assets.og()`, `src/plugins/assets/og/`); this step still writes every card into each
 * build, so every commit deploys working cards. Removed in the data PR.
 */
// Removed in the data PR: the cards are committed in `public/og` and this step goes away.
import { fileURLToPath } from "node:url";
import type { CardCache } from "../../assets/og/types";
import { writeBuildCards } from "../../assets/og/write";

export type { CardCache } from "../../assets/og/types";

/** The site's served art, the folder the image pipeline writes. */
const MEDIA_DIRECTORY = fileURLToPath(new URL("../../../../public/media/", import.meta.url));

/**
 * Write every card of every locale into a built output directory, from the site's art.
 *
 * @param outputDirectory - The output directory.
 * @param cards - The drawn cards of the process; the cards drawn by this run are added.
 * @returns The written files, relative to `outputDirectory`.
 * @example
 * ```ts
 * const files = await writeOgCards("dist", ctx.state.cards); // ["og/en/home.png", "og/en/about.png", …]
 * ```
 */
export function writeOgCards(outputDirectory: string, cards: CardCache): Promise<string[]> {
  return writeBuildCards(outputDirectory, cards, MEDIA_DIRECTORY);
}
