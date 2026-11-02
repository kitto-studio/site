/**
 * @file Reveal on view, shared by the islands that hold a motion back until their element comes into
 * view (`popup-sticker`, `kana-drop`): whether the element still waits below the fold, and a one-time
 * watch that fires when enough of it is in view.
 */

/** An element counts as below the fold while less than this part of it has come into view. */
const BELOW_PART = 0.35;

/**
 * Whether an element has not come into view yet: less than {@link BELOW_PART} of it is above the
 * bottom of the window.
 *
 * @param element - The element to measure.
 * @returns True while the element waits below the fold.
 */
export function isBelowFold(element: HTMLElement): boolean {
  const top = element.getBoundingClientRect().top;
  return top > globalThis.innerHeight - element.offsetHeight * BELOW_PART;
}

/**
 * Call `onReveal` once, as soon as enough of an element is in view.
 *
 * @param element - The element to watch.
 * @param threshold - Part of the element that must be in view, 0..1.
 * @param onReveal - What to do then.
 * @returns A function that stops watching.
 */
export function revealOnView(
  element: HTMLElement,
  threshold: number,
  onReveal: () => void
): () => void {
  const observer = new IntersectionObserver(
    entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      onReveal();
    },
    { threshold }
  );
  observer.observe(element);
  return () => observer.disconnect();
}
