/**
 * @file The reader's motion preference, shared by every island that animates. Each one checks it
 * before it moves anything, so under reduced motion the page changes at once.
 */

/** The media query of a reader who asked for less motion. */
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Whether the reader asked for less motion. A browser with no `matchMedia` counts as no.
 *
 * @returns True with `prefers-reduced-motion: reduce`.
 */
export function prefersReducedMotion(): boolean {
  return globalThis.matchMedia?.(REDUCED_MOTION_QUERY).matches ?? false;
}
