/**
 * @file The `legal-toc` island: the contents of a legal page (D3, C2).
 *
 * Wide screens: the list stays open as a rail, the section being read is marked, and the orange dot
 * slides to it. Compact screens (900px and below): a sticky bar that names the current section and
 * opens the list; the list closes on a choice or on Escape. Which section is current is decided by
 * `activeSectionIndex` in `src/lib/toc.ts`; this island only measures and marks.
 */
import { createIsland } from "@moku-labs/web/browser";
import { activeSectionIndex } from "../lib/toc";

/** The compact layout, where the contents are a bar (the same width as in `LegalDocument.css`). */
const COMPACT = "(max-width: 900px)";

/** How far the reading line sits below the root scroll padding (the header plus 16px), in px. */
const READING_LINE_BELOW = { wide: 48, compact: 74 } as const;

/** Scroll slack that still counts as the end of the page, in px. */
const END_SLACK = 4;

/** One contents entry and the section it points at. */
type Entry = {
  /** The contents link. */
  link: HTMLAnchorElement;
  /** The section with the link's id. */
  section: HTMLElement;
};

/** The parts of the contents the island works with, found once at mount. */
type Toc = {
  /** The `<details>` panel: the rail on wide screens, the bar's list on compact ones. */
  panel: HTMLDetailsElement;
  /** The panel's summary: the «Contents» label, the bar on compact screens. */
  summary: HTMLElement;
  /** The bar's current-section label. */
  now: HTMLElement | null;
  /** The sliding dot on the rail. */
  dot: HTMLElement | null;
  /** Contents entries in page order. */
  entries: Entry[];
  /** True while the layout is compact. */
  compact: MediaQueryList;
  /** Index of the marked entry, -1 before the first measure. */
  current: number;
};

/**
 * Find the parts of the contents inside the island element.
 *
 * @param root - The island element, `nav[data-island="legal-toc"]`.
 * @returns The parts, or `undefined` when the markup has no panel.
 */
function findToc(root: Element): Toc | undefined {
  const panel = root.querySelector<HTMLDetailsElement>("details[data-toc]");
  const summary = panel?.querySelector<HTMLElement>("summary");
  if (!panel || !summary) return undefined;
  const entries: Entry[] = [];
  for (const link of root.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')) {
    const section = document.querySelector<HTMLElement>(`#${CSS.escape(link.hash.slice(1))}`);
    if (section) entries.push({ link, section });
  }
  return {
    panel,
    summary,
    now: root.querySelector<HTMLElement>("[data-toc-now]"),
    dot: root.querySelector<HTMLElement>("[data-toc-dot]"),
    entries,
    compact: globalThis.matchMedia(COMPACT),
    current: -1
  };
}

/**
 * The viewport y of the reading line: just under the sticky header (and the bar, when compact).
 *
 * @param toc - The contents.
 * @returns The reading line in px from the top of the viewport.
 */
function readingLine(toc: Toc): number {
  const padding = Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
  const below = toc.compact.matches ? READING_LINE_BELOW.compact : READING_LINE_BELOW.wide;
  return (Number.isNaN(padding) ? 0 : padding) + below;
}

/**
 * Centre the dot on the first line of an entry and show it.
 *
 * @param toc - The contents.
 * @param link - The marked entry.
 * @returns {void} Nothing; the dot sits beside the entry.
 */
function placeDot(toc: Toc, link: HTMLAnchorElement): void {
  const number = link.querySelector<HTMLElement>("[data-toc-number]");
  if (!toc.dot || !number) return;
  toc.dot.style.setProperty("--toc-dot-y", `${number.offsetTop + number.offsetHeight / 2}px`);
  toc.dot.dataset.visible = "";
}

/**
 * Move the current mark to an entry: `aria-current` on its link only, and its name in the bar.
 *
 * @param toc - The contents.
 * @param index - The entry's index.
 * @param link - The entry's link, whose text names the section.
 * @returns {void} Nothing; the entry is marked current.
 */
function moveCurrentMark(toc: Toc, index: number, link: HTMLAnchorElement): void {
  for (const [position, entry] of toc.entries.entries()) {
    if (position === index) entry.link.setAttribute("aria-current", "true");
    else entry.link.removeAttribute("aria-current");
  }
  if (toc.now) toc.now.textContent = link.textContent;
  toc.current = index;
}

/**
 * Mark the section being read: `aria-current` on its entry, its name in the bar, the dot beside it.
 *
 * @param toc - The contents.
 * @returns {void} Nothing; the contents mark the section under the reading line.
 */
function markCurrent(toc: Toc): void {
  // Find the section under the reading line; at the end of the page, the last one.
  const root = document.documentElement;
  const atEnd = globalThis.innerHeight + globalThis.scrollY >= root.scrollHeight - END_SLACK;
  const tops = toc.entries.map(entry => entry.section.getBoundingClientRect().top);
  const index = activeSectionIndex(tops, readingLine(toc), atEnd);
  const entry = toc.entries[index];
  if (!entry) return;

  // Mark it when it changed; the dot is placed every time, as line heights can change.
  if (index !== toc.current) moveCurrentMark(toc, index, entry.link);
  placeDot(toc, entry.link);
}

/** The contents of a legal page: rail with the sliding dot, or the phone contents bar. */
export const legalTocIsland = createIsland("legal-toc", {
  /**
   * Wire the contents: open or close the panel for the layout, mark the current section on scroll
   * and resize, close the compact list on a choice or Escape. Every listener goes on teardown.
   *
   * @param ctx - The island context; `ctx.el` is the contents `<nav>`.
   * @returns {void} Nothing; the contents follow the reader until the page leaves.
   */
  onMount(ctx) {
    // Guard: a contents nav with its panel, list and sections.
    const toc = findToc(ctx.el);
    if (!toc) return;

    // Mark the current section at most once a frame, however fast the page scrolls.
    let frame = 0;
    const update = (): void => {
      frame = 0;
      markCurrent(toc);
    };
    const schedule = (): void => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };

    // Wide: the panel is a rail that stays open. Compact: a bar that starts closed and closes
    // again on a choice or on Escape.
    const layout = (): void => {
      toc.panel.open = !toc.compact.matches;
      markCurrent(toc);
    };
    const keepRailOpen = (event: Event): void => {
      if (!toc.compact.matches) event.preventDefault();
    };
    const closeOnChoice = (event: Event): void => {
      const target = event.target instanceof Element ? event.target : undefined;
      if (toc.compact.matches && target?.closest("a")) toc.panel.open = false;
    };
    const closeOnEscape = (event: KeyboardEvent): void => {
      if (event.key !== "Escape" || !toc.compact.matches || !toc.panel.open) return;
      toc.panel.open = false;
      // The bar is sticky: a scrolling focus would nudge the page and move the current section.
      toc.summary.focus({ preventScroll: true });
    };

    // Listen while the page is here; every listener and the pending frame go on teardown.
    globalThis.addEventListener("scroll", schedule, { passive: true });
    globalThis.addEventListener("resize", schedule);
    toc.compact.addEventListener("change", layout);
    toc.summary.addEventListener("click", keepRailOpen);
    ctx.el.addEventListener("click", closeOnChoice);
    document.addEventListener("keydown", closeOnEscape);
    ctx.cleanup(() => {
      globalThis.removeEventListener("scroll", schedule);
      globalThis.removeEventListener("resize", schedule);
      toc.compact.removeEventListener("change", layout);
      toc.summary.removeEventListener("click", keepRailOpen);
      ctx.el.removeEventListener("click", closeOnChoice);
      document.removeEventListener("keydown", closeOnEscape);
      cancelAnimationFrame(frame);
    });

    // Lay out now, and measure the dot again once the web fonts change the line heights.
    layout();
    void document.fonts.ready.then(schedule);
  }
});
