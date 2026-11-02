/**
 * @file The icon pipeline: the PNG icons drawn from `public/favicon.svg`, the «ki with dot» crop of
 * the wordmark vector. Each is the light favicon centred on the paper colour, with room around it
 * for the rounded mask iOS and Android draw over home-screen icons. Deterministic: a rerun writes
 * the same bytes.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import type { Icon, IconsResult } from "./types";

/** The source vector, relative to the project. */
const SOURCE = "public/favicon.svg";

/** Paper, the light page background (`--color-paper-light`). */
const PAPER = "#F6F2EA";

/** Share of the icon side the favicon square takes; the rest is paper margin. */
const MARK_SHARE = 0.78;

/** Side of the favicon's viewBox, logo units: the density that rasterises it at 1 unit = 1 px. */
const VIEWBOX_SIDE = 347;

/**
 * Render one square icon: the favicon centred on paper.
 *
 * @param svg - The favicon source.
 * @param size - Icon side, px.
 * @returns The PNG bytes.
 */
async function renderIcon(svg: Buffer, size: number): Promise<Buffer> {
  const markSize = Math.round(size * MARK_SHARE);
  // Rasterise at four times the target, then scale down, for clean edges.
  const density = (72 * 4 * markSize) / VIEWBOX_SIDE;
  const mark = await sharp(svg, { density }).resize(markSize, markSize).png().toBuffer();

  return sharp({ create: { width: size, height: size, channels: 3, background: PAPER } })
    .composite([{ input: mark, gravity: "centre" }])
    .removeAlpha()
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/**
 * Draw every icon from the favicon, in order.
 *
 * @param icons - The icons to write.
 * @returns The written files.
 */
export async function writeIcons(icons: readonly Icon[]): Promise<IconsResult> {
  const svg = await readFile(SOURCE);
  for (const { output, size } of icons) {
    await mkdir(path.dirname(output), { recursive: true });
    await writeFile(output, await renderIcon(svg, size));
  }
  return { files: icons.map(icon => icon.output) };
}
