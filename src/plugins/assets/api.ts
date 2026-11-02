/**
 * @file Assets API: `images` and `icons` run their pipeline over the plugin config and print the
 * same branded lines `bun run images` and `bun run icons` always printed.
 */
import { createBrandConsole } from "@moku-labs/common/cli";
import { writeIcons } from "./icons";
import { writeImages } from "./images";
import type { Api, AssetsContext } from "./types";

/**
 * Build the assets API.
 *
 * @param ctx - Plugin context.
 * @returns The API mounted as `app.assets`.
 */
export function createAssetsApi(ctx: AssetsContext): Api {
  const ui = createBrandConsole();
  return {
    images: async () => {
      const result = await writeImages(ctx.config);
      ui.info(`images: ${result.written.length} written, ${result.upToDate} up to date`);
      return result;
    },
    icons: async () => {
      const result = await writeIcons(ctx.config.icons);
      for (const { output, size } of ctx.config.icons) {
        ui.info(`icons: ${output} (${size}×${size})`);
      }
      return result;
    }
  };
}
