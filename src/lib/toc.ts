/**
 * @file The contents of a legal page: which section the reader is in. Imported by the `legal-toc`
 * island, so it stays free of the legal documents and the string tables (`src/lib/legal.ts` holds
 * those helpers and never reaches the client bundle).
 */

/**
 * Which section the reader is in, for the contents rail and the phone contents bar.
 *
 * @param tops - Viewport top of each section, in page order.
 * @param readingLine - Viewport y of the reading line just under the sticky header.
 * @param atEnd - True when the page is scrolled to its end.
 * @returns The last section whose top passed the reading line (the first before any did, the last
 *   at the end of the page), or -1 when there are no sections.
 * @example
 * ```ts
 * activeSectionIndex([-500, 140, 700], 140, false); // 1
 * ```
 */
export function activeSectionIndex(
  tops: readonly number[],
  readingLine: number,
  atEnd: boolean
): number {
  if (tops.length === 0) return -1;
  if (atEnd) return tops.length - 1;
  let active = 0;
  for (const [index, top] of tops.entries()) if (top <= readingLine) active = index;
  return active;
}
