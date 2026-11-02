/**
 * @file The image pipeline: plan the outputs of every master in the source folder, skip the ones
 * newer than their source, and write the rest with sharp. The encoder is deterministic, so a
 * forced rerun writes the same bytes.
 */
import { copyFile, mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import type { Config, ImageJob, ImagesResult } from "./types";

/** Extensions of the masters the pipeline reads; anything else, such as a manifest, is left out. */
const MASTER_EXTENSIONS = new Set([".png", ".webp"]);

/**
 * The masters under a source folder: PNG and webp files, without hidden files and folders.
 *
 * @param sourceDirectory - The source folder.
 * @returns Paths relative to `sourceDirectory`, sorted.
 */
async function listMasters(sourceDirectory: string): Promise<string[]> {
  const entries = await readdir(sourceDirectory, { recursive: true });
  return entries
    .filter(relative => MASTER_EXTENSIONS.has(path.extname(relative)))
    .filter(relative => !relative.split(path.sep).some(segment => segment.startsWith(".")))
    .toSorted();
}

/**
 * Whether an output is missing or older than its source.
 *
 * @param job - The job to check.
 * @returns True when the output has to be (re)written.
 */
async function isStale(job: ImageJob): Promise<boolean> {
  try {
    const [source, output] = await Promise.all([stat(job.source), stat(job.output)]);
    return output.mtimeMs < source.mtimeMs;
  } catch {
    return true;
  }
}

/**
 * The jobs of one master: its full-size output and, in a thumbnail folder, its thumbnail. A PNG
 * becomes a webp; a webp is copied as it is.
 *
 * @param relative - Master path relative to `config.sourceDir`.
 * @param config - The plugin config.
 * @returns The jobs for that master.
 * @example
 * ```ts
 * jobsFor("scenes/diorama-day.png", config); // [{ source: "assets/site-art/scenes/diorama-day.png", output: "public/media/scenes/diorama-day.webp", size: 1600 }]
 * ```
 */
export function jobsFor(relative: string, config: Config): ImageJob[] {
  const extension = path.extname(relative);
  const base = relative.slice(0, -extension.length);
  const source = path.join(config.sourceDir, relative);
  const full: ImageJob =
    extension === ".png"
      ? { source, output: path.join(config.outDir, `${base}.webp`), size: config.maxSize }
      : { source, output: path.join(config.outDir, relative) };

  const folder = relative.split("/")[0] ?? "";
  if (!config.thumbFolders.includes(folder)) return [full];

  const thumbnail = path.join(config.outDir, `${base}-${config.thumbSize}.webp`);
  return [full, { source, output: thumbnail, size: config.thumbSize }];
}

/**
 * Write one output: a webp fitted into the job's size, never enlarged, or a byte copy when the job
 * has no size.
 *
 * @param job - The job to run.
 * @param quality - webp quality.
 * @returns A promise settled once the file is written.
 */
export async function runJob(job: ImageJob, quality: number): Promise<void> {
  await mkdir(path.dirname(job.output), { recursive: true });
  if (job.size === undefined) {
    await copyFile(job.source, job.output);
    return;
  }

  await sharp(job.source)
    .resize({ width: job.size, height: job.size, fit: "inside", withoutEnlargement: true })
    .webp({ quality })
    .toFile(job.output);
}

/**
 * Turn every master into its served files, skipping the outputs that are up to date.
 *
 * @param config - The plugin config.
 * @returns The outputs written, in source order, and the count of outputs that were up to date.
 */
export async function writeImages(config: Config): Promise<ImagesResult> {
  const masters = await listMasters(config.sourceDir);
  const jobs = masters.flatMap(relative => jobsFor(relative, config));
  const staleFlags = await Promise.all(jobs.map(job => isStale(job)));
  const stale = jobs.filter((_job, index) => staleFlags[index]);

  await Promise.all(stale.map(job => runJob(job, config.quality)));

  return { written: stale.map(job => job.output), upToDate: jobs.length - stale.length };
}
