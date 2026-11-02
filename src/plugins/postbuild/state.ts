/** @file Postbuild state factory. */
import type { State } from "./types";

/**
 * Create the empty postbuild state: no run in progress.
 *
 * @returns Fresh state.
 */
export function createPostbuildState(): State {
  return { runs: new Map() };
}
