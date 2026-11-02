/**
 * @file The `kana-drop` island: the large きっと on the About page (design-context §6 A2).
 *
 * The kana stand by default: without the island, with reduced motion, in print. Once the reader
 * scrolls, kana still below the fold are hidden (`data-kana="wait"`) and drop in one by one when
 * they come into view (`data-kana="drop"`; the motion is CSS in `KittoMeaning.css`). A click drops
 * them again.
 */
import { createIsland } from "@moku-labs/web/browser";
import { prefersReducedMotion } from "./motion-pref";
import { isBelowFold, revealOnView } from "./reveal";

/** Part of the kana that must be in view before they drop. */
const VIEW_THRESHOLD = 0.6;

/**
 * Drop the kana in from the top, restarting the animation when it already played.
 *
 * @param kana - The kana block.
 * @returns {void} Nothing; the kana drop in.
 */
function drop(kana: HTMLElement): void {
  delete kana.dataset.kana;
  // Reading the layout ends the old animation, so setting the state again restarts it.
  void kana.offsetWidth;
  kana.dataset.kana = "drop";
}

/** About page: the large きっと kana drop in when they come into view; a click drops them again. */
export const kanaDropIsland = createIsland("kana-drop", {
  /**
   * Wire the first-scroll watch and the click replay.
   *
   * @param ctx - The island context: the kana block.
   * @returns {void} Nothing; the kana wait and drop until the page leaves.
   */
  onMount(ctx) {
    // Guard: with reduced motion the kana just stand.
    const kana = ctx.el;
    if (!(kana instanceof HTMLElement) || prefersReducedMotion()) return;

    // Kana still below the fold at the first scroll wait hidden, then drop in once in view.
    let stopReveal: (() => void) | undefined;
    const onFirstScroll = (): void => {
      if (!isBelowFold(kana)) return;
      kana.dataset.kana = "wait";
      stopReveal = revealOnView(kana, VIEW_THRESHOLD, () => drop(kana));
    };
    const onClick = (): void => drop(kana);

    // Watch the first scroll and replay on a click until the page leaves.
    globalThis.addEventListener("scroll", onFirstScroll, { once: true, passive: true });
    kana.addEventListener("click", onClick);
    ctx.cleanup(() => {
      globalThis.removeEventListener("scroll", onFirstScroll);
      kana.removeEventListener("click", onClick);
      stopReveal?.();
    });
  }
});
