import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import sharp from "sharp";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { writeIcons } from "../../icons";

/** The paper colour (`--color-paper-light`, #F6F2EA) as RGB. */
const PAPER = [246, 242, 234];

let outDir = "";

beforeEach(async () => {
  outDir = await mkdtemp(path.join(tmpdir(), "kitto-icons-"));
});

afterEach(async () => {
  await rm(outDir, { recursive: true, force: true });
});

// Catches: an icon at another size than iOS (180) or the web app manifest (512) asks for, and
// transparent corners that a home screen fills with black instead of the paper colour.
describe("writeIcons", () => {
  it("draws each icon from the favicon at its size, opaque, on paper", async () => {
    const icons = [
      { output: path.join(outDir, "apple-touch-icon.png"), size: 180 },
      { output: path.join(outDir, "manifest/icon-512.png"), size: 512 }
    ];

    const result = await writeIcons(icons);

    expect(result.files).toEqual(icons.map(icon => icon.output));
    for (const { output, size } of icons) {
      const image = sharp(output);
      const metadata = await image.metadata();
      const corner = await image.extract({ left: 0, top: 0, width: 1, height: 1 }).raw().toBuffer();
      expect(metadata).toMatchObject({ format: "png", width: size, height: size, channels: 3 });
      expect([...corner]).toEqual(PAPER);
    }
  });
});
