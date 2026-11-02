/**
 * @file Pure rules of the game page gallery (design-context §6 E1, §7): which picture is current,
 * where the arrows step away, how the thumbnail strip keeps the current print in view, and when a
 * drag in the lightbox is a swipe. The `gallery` island reads the page; these functions decide.
 */

/** A sideways move shorter than this is a tap or a wobble, not a swipe, px. */
const SWIPE_START = 10;

/** A swipe must be this much more sideways than vertical. */
const SWIPE_SLOPE = 1.2;

/** A swipe longer than this changes the picture, px. */
const SWIPE_DISTANCE = 50;

/** Share of the finger's travel the picture follows. */
const DRAG_FOLLOW = 0.6;

/** Share it follows past the first or the last picture, where nothing comes next. */
const EDGE_FOLLOW = 0.25;

/** Whether a picture is the first or the last one: where the arrow on that side steps away. */
export type Edges = {
  /** No picture before this one. */
  atStart: boolean;
  /** No picture after this one. */
  atEnd: boolean;
};

/** One item of a scrolling row: where it starts and how wide it is, px. */
export type RowItem = {
  /** Distance of the item's start from the row's start. */
  start: number;
  /** Item width. */
  size: number;
};

/**
 * Keep a picture index inside the gallery. The gallery never wraps: past the last picture it stays
 * on the last, before the first it stays on the first.
 *
 * @param index - The wanted index, possibly out of range.
 * @param count - Number of pictures.
 * @returns The index of an existing picture.
 * @example
 * ```ts
 * clampIndex(2, 2); // 1: "next" on the last picture stays there
 * ```
 */
export function clampIndex(index: number, count: number): number {
  return Math.max(0, Math.min(count - 1, index));
}

/**
 * Where a picture sits in the gallery: the arrows step away at the ends.
 *
 * @param index - Index of the current picture.
 * @param count - Number of pictures.
 * @returns Whether it is the first and whether it is the last.
 * @example
 * ```ts
 * edgesOf(0, 2); // { atStart: true, atEnd: false }
 * ```
 */
export function edgesOf(index: number, count: number): Edges {
  return { atStart: index <= 0, atEnd: index >= count - 1 };
}

/**
 * Whether a gallery needs arrows and thumbnails. One picture has nowhere to go.
 *
 * @param count - Number of pictures.
 * @returns True for two pictures or more.
 * @example
 * ```ts
 * hasControls(1); // false
 * ```
 */
export function hasControls(count: number): boolean {
  return count > 1;
}

/**
 * The scroll position of a row that puts one item in its middle, without scrolling before the
 * row's start or past its end.
 *
 * @param item - Where the item starts and how wide it is.
 * @param view - Visible width of the row.
 * @param content - Full width of the row's content.
 * @returns The scroll offset, px.
 * @example
 * ```ts
 * centredOffset({ start: 396, size: 120 }, 400, 912); // 256: the 4th of 7 thumbnails in the middle
 * ```
 */
export function centredOffset(item: RowItem, view: number, content: number): number {
  const centred = item.start - (view - item.size) / 2;
  return Math.max(0, Math.min(content - view, centred));
}

/**
 * The picture a swiped strip came to rest on: the nearest one, also after an overscroll.
 *
 * @param scrollLeft - The strip's scroll position, px.
 * @param slideWidth - Width of one picture, px.
 * @param count - Number of pictures.
 * @returns The picture's index, or `undefined` while the strip has no width (not laid out yet).
 * @example
 * ```ts
 * restingSlide(840, 600, 3); // 1
 * ```
 */
export function restingSlide(
  scrollLeft: number,
  slideWidth: number,
  count: number
): number | undefined {
  if (slideWidth <= 0) return undefined;
  return clampIndex(Math.round(scrollLeft / slideWidth), count);
}

/**
 * Whether a pointer move in the lightbox has become a sideways swipe.
 *
 * @param dx - Horizontal travel since the press, px.
 * @param dy - Vertical travel since the press, px.
 * @returns True once the move is long enough and clearly sideways.
 * @example
 * ```ts
 * isSwipe(-24, 4); // true
 * ```
 */
export function isSwipe(dx: number, dy: number): boolean {
  return Math.abs(dx) >= SWIPE_START && Math.abs(dx) >= Math.abs(dy) * SWIPE_SLOPE;
}

/**
 * The step a finished swipe makes: a swipe to the left shows the next picture.
 *
 * @param dx - Horizontal travel of the swipe, px.
 * @returns `1` for the next picture, `-1` for the previous one, `0` to stay.
 * @example
 * ```ts
 * swipeStep(-80); // 1
 * ```
 */
export function swipeStep(dx: number): -1 | 0 | 1 {
  if (dx < -SWIPE_DISTANCE) return 1;
  if (dx > SWIPE_DISTANCE) return -1;
  return 0;
}

/**
 * How far the picture follows a drag: less past the first or the last picture, so the reader feels
 * there is nothing more on that side.
 *
 * @param dx - Horizontal travel of the finger, px.
 * @param index - Index of the picture shown.
 * @param count - Number of pictures.
 * @returns The picture's offset, px.
 * @example
 * ```ts
 * dragOffset(100, 0, 2); // 25: dragging back from the first picture
 * ```
 */
export function dragOffset(dx: number, index: number, count: number): number {
  const { atStart, atEnd } = edgesOf(index, count);
  const pastEdge = (atStart && dx > 0) || (atEnd && dx < 0);
  return dx * (pastEdge ? EDGE_FOLLOW : DRAG_FOLLOW);
}

/**
 * The count under a picture, the same in every language.
 *
 * @param index - Index of the picture.
 * @param count - Number of pictures.
 * @returns The 1-based position and the total.
 * @example
 * ```ts
 * counter(0, 2); // "1 / 2"
 * ```
 */
export function counter(index: number, count: number): string {
  return `${index + 1} / ${count}`;
}

/**
 * Where Tab takes the focus inside a modal that loops: only the steps that would leave the loop
 * change, everything else is the browser's normal Tab order.
 *
 * @param items - The focusable controls of the loop, in Tab order.
 * @param current - The control in focus, if it is one of them.
 * @param backwards - True for Shift+Tab.
 * @returns The control to focus instead, or `undefined` to let Tab move as usual.
 * @example
 * ```ts
 * loopFocus(["close", "previous", "next"], "next", false); // "close"
 * ```
 */
export function loopFocus<T>(
  items: readonly T[],
  current: T | undefined,
  backwards: boolean
): T | undefined {
  const first = items[0];
  const last = items.at(-1);
  if (current === undefined || !items.includes(current)) return first;
  if (backwards && current === first) return last;
  if (!backwards && current === last) return first;
  return undefined;
}
