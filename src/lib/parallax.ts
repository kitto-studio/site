/**
 * @file The home page's paper motion as pure functions of measured numbers: the four-plane hero
 * (plane offsets and scales, the headline sinking behind the hills, the sun or moon kept below the
 * header), the sheet stack (how far a sheet is lifted or covered) and the pop-up hinge spring.
 *
 * Numbers come from the approved prototype (design-context §6 A1, F9). The islands measure the
 * page and write what these functions return; nothing here touches the DOM.
 */

/** A plane of the hero, back to front: the sun or moon, then the four paper layers. */
export type PlaneName = "sun" | "far" | "mid" | "near" | "front";

/** The hero planes in paint order, back to front. The headline sits between `far` and `mid`. */
export const PLANE_NAMES: readonly PlaneName[] = ["sun", "far", "mid", "near", "front"];

/** How one plane answers scroll and pointer. */
type PlaneDepth = {
  /** Horizontal shift in px at full pointer travel. */
  pointerX: number;
  /** Vertical shift in px at full pointer travel. */
  pointerY: number;
  /** Vertical travel at full scroll, as a fraction of the frame height. Negative rises. */
  travel: number;
  /** Extra scale at full scroll. */
  grow: number;
};

/**
 * Depth of every plane. Far is slowest and front fastest; the front leaves grow past the camera.
 * The sun or moon sinks behind its own far hills, the mid hills rise in front of the headline.
 */
const DEPTHS: Record<PlaneName, PlaneDepth> = {
  sun: { pointerX: 5, pointerY: 3, travel: 0.19, grow: 0.02 },
  far: { pointerX: 8, pointerY: 4, travel: 0.02, grow: 0.05 },
  mid: { pointerX: 16, pointerY: 8, travel: -0.03, grow: 0.35 },
  near: { pointerX: 26, pointerY: 12, travel: 0, grow: 0.6 },
  front: { pointerX: 44, pointerY: 20, travel: 0, grow: 1.05 }
};

/** Headline shift in px at full pointer travel, horizontal and vertical. */
const HEADLINE_POINTER = { x: 10, y: 5 };

/** How far the headline sinks at full scroll on a phone, px. */
const PHONE_SINK = 60;

/** How far the headline sinks at full scroll on desktop, as a fraction of the window height. */
const DESKTOP_SINK = 0.21;

/** The headline starts to fade after this much of a window of scroll, and is gone this much later. */
const FADE = { start: 0.7, length: 0.35 };

/** Scroll run of the hero: three quarters of the window on desktop, 70% of the hero on a phone. */
const RUN = { desktop: 0.75, phone: 0.7 };

/** Gap kept between the bottom of the lead and the highest hill, px. */
export const HILLS_GAP = 28;

/**
 * The highest hill contour that can reach under the text, as a fraction of the frame height from
 * its top (the far hills; the near tree and the mid hills peak lower or outside the text column).
 */
export const HILLS_TOP = 0.478;

/** Top of the sun or moon disc in its plane, as a fraction of the frame height. */
export const SUN_DISC_TOP = 0.15;

/** The closest the sun or moon comes to the bottom of the header plate, px. */
export const SUN_GAP = 34;

/** Left edge of the sun or moon disc in its plane, as a fraction of the frame width. */
export const SUN_DISC_LEFT = 0.698;

/** The air kept between the end of the headline and the sun or moon on a phone, px. */
export const SUN_TEXT_GAP = 12;

/** The furthest the sun or moon is nudged right on a phone, px: past this it would leave the screen. */
export const SUN_SHIFT_MAX = 40;

/** The sun or moon starts to fade after this much hero scroll progress, and is gone this much later. */
const SUN_FADE = { start: 0.45, length: 0.4 };

/** The least the frame hangs below the hero, px: desktop and phone. */
const MIN_UNDER = { desktop: 60, phone: 30 };

/** Below this lift a sheet's sticker springs up: the sheet is nearly in its place. */
export const POP_AT = 0.32;

/** Above this lift a sheet is back at the window bottom and its sticker lies flat again. */
export const FOLD_AT = 0.98;

/** Seconds the hinge spring runs before the sticker rests upright. */
export const SPRING_SECONDS = 1.4;

/** The hinge spring: damping ratio and angular frequency (rad/s). A soft paper bounce. */
const SPRING = { damping: 0.46, frequency: 12.5 };

/** A sticker lying flat on its sheet, degrees of hinge rotation. */
const FLAT = 90;

/** How hard a tap pushes the paper, degrees: the dip peaks at about half of it. */
const KICK = 110;

/** How much brighter paper gets when tipped toward the light. */
const TIP_LIGHT = 0.08;

/** Pointer position over the window, each axis -1..1, 0 at the centre. */
export type Pointer = {
  /** Horizontal position, -1 left edge, 1 right edge. */
  x: number;
  /** Vertical position, -1 top edge, 1 bottom edge. */
  y: number;
};

/** A transform: px offsets and a scale factor. */
export type PlaneTransform = {
  /** Horizontal offset, px. */
  x: number;
  /** Vertical offset, px. */
  y: number;
  /** Scale factor, 1 at rest. */
  scale: number;
};

/** The numbers a plane transform depends on. */
export type PlaneInput = {
  /** Hero scroll progress, 0..1 (clamped). */
  progress: number;
  /** Eased pointer position; `{ x: 0, y: 0 }` on touch screens and phones. */
  pointer: Pointer;
  /** Height of the art frame, px. */
  frameHeight: number;
  /** Phone layout: half the parallax. */
  phone: boolean;
};

/** The numbers the headline motion depends on. */
export type HeadlineInput = {
  /** Hero scroll progress, 0..1 (clamped). */
  progress: number;
  /** Page scroll, px. */
  scrollY: number;
  /** Window height, px. */
  viewportHeight: number;
  /** Eased pointer position. */
  pointer: Pointer;
  /** Phone layout: shorter sink, no fade. */
  phone: boolean;
};

/** The headline's transform and opacity. */
export type HeadlineMotion = {
  /** Horizontal offset, px. */
  x: number;
  /** Vertical offset, px: positive sinks. */
  y: number;
  /** Opacity, 0..1. */
  opacity: number;
};

/** The numbers the hero scroll progress depends on. */
export type ScrollInput = {
  /** Page scroll, px. */
  scrollY: number;
  /** Window height, px. */
  viewportHeight: number;
  /** Hero height, px. */
  heroHeight: number;
  /** Phone layout: the hero scrolls away with the page. */
  phone: boolean;
};

/** The measured hero the frame is placed in. */
export type FrameInput = {
  /** Hero height, px: its top is the bottom of the header plate. */
  heroHeight: number;
  /** Height of the art frame, px. */
  frameHeight: number;
  /** Bottom of the lead, px from the hero top. */
  textBottom: number;
  /** Phone layout. */
  phone: boolean;
};

/** Where the frame sits, written by the island as CSS custom properties. */
export type FramePlacement = {
  /** How far the frame hangs below the hero bottom, px (`--frame-under`). */
  under: number;
  /** Extra drop of the sun or moon plane below the frame top, px (`--sun-drop`). */
  sunDrop: number;
};

/** The measured hero and headline the sun or moon is kept clear of. */
export type SunShiftInput = {
  /** Left edge of the art frame, px from the hero's left edge. */
  frameLeft: number;
  /** Width of the art frame, px. */
  frameWidth: number;
  /** Right edge of the headline's longest line, px from the hero's left edge. */
  textRight: number;
  /** Phone layout: the only one where the sun sits beside the text. */
  phone: boolean;
};

/** A sheet's natural position against its sticky landing place. */
export type LiftInput = {
  /** Top of the sheet's zero-height marker, px from the window top (untouched by transforms). */
  markTop: number;
  /** Window height, px. */
  viewportHeight: number;
  /** The sheet's sticky `top`, px. */
  stickTop: number;
};

/** A sheet and the next sheet sliding over it. */
export type CoverInput = {
  /** Bottom of the sheet, px from the window top. */
  bottom: number;
  /** Top of the next sheet, px from the window top. */
  nextTop: number;
  /** Height of the sheet, px. */
  height: number;
};

/** How a sticker's paper looks at a hinge angle. */
export type PaperLight = {
  /** 1 standing, 0 lying flat: drives the cast shadow and the fold shade. */
  up: number;
  /** Brightness factor of the cut-out, 1 upright. */
  light: number;
};

/**
 * Clamp a number into a range.
 *
 * @param value - Any number.
 * @param min - Lower bound.
 * @param max - Upper bound.
 * @returns The value, limited to `min..max`.
 * @example
 * ```ts
 * clamp(1.4); // 1
 * clamp(-3, -1, 1); // -1
 * ```
 */
export function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Motion strength of the layout: a phone gets half the parallax.
 *
 * @param phone - Phone layout.
 * @returns The amplitude factor.
 */
function amplitude(phone: boolean): number {
  return phone ? 0.5 : 1;
}

/**
 * Scroll progress of the hero.
 *
 * @param input - Scroll position, window and hero heights, layout.
 * @returns 0 at the top, 1 once three quarters of the window (70% of the hero on a phone) scrolled.
 * @example
 * ```ts
 * heroProgress({ scrollY: 300, viewportHeight: 800, heroHeight: 724, phone: false }); // 0.5
 * ```
 */
export function heroProgress(input: ScrollInput): number {
  const run = input.phone ? input.heroHeight * RUN.phone : input.viewportHeight * RUN.desktop;
  return clamp(input.scrollY / Math.max(1, run));
}

/**
 * The transform of one hero plane.
 *
 * @param plane - Which plane.
 * @param input - Scroll progress, pointer, frame height, layout.
 * @returns Offsets in px and the scale, all at rest when progress and pointer are 0.
 * @example
 * ```ts
 * const front = planeTransform("front", { progress: 1, pointer: { x: 0, y: 0 }, frameHeight: 1037, phone: false });
 * front.scale; // 2.05: the leaves pass the camera
 * ```
 */
export function planeTransform(plane: PlaneName, input: PlaneInput): PlaneTransform {
  const depth = DEPTHS[plane];
  const progress = clamp(input.progress) * amplitude(input.phone);
  const pointerX = clamp(input.pointer.x, -1, 1);
  const pointerY = clamp(input.pointer.y, -1, 1);
  return {
    x: -pointerX * depth.pointerX,
    y: depth.travel * input.frameHeight * progress - pointerY * depth.pointerY,
    scale: 1 + depth.grow * progress
  };
}

/**
 * The headline's motion: it sinks behind the rising hills and, on desktop, fades past the hero.
 *
 * @param input - Scroll progress and position, window height, pointer, layout.
 * @returns Offsets in px and the opacity, fully visible at rest.
 * @example
 * ```ts
 * const text = headlineMotion({ progress: 1, scrollY: 675, viewportHeight: 900, pointer: { x: 0, y: 0 }, phone: false });
 * text.y; // 189: sunk by 21% of the window
 * ```
 */
export function headlineMotion(input: HeadlineInput): HeadlineMotion {
  const { viewportHeight, phone } = input;
  const progress = clamp(input.progress) * amplitude(phone);
  const pointerX = clamp(input.pointer.x, -1, 1);
  const pointerY = clamp(input.pointer.y, -1, 1);
  const sink = phone ? PHONE_SINK : viewportHeight * DESKTOP_SINK;
  const fade = (input.scrollY - viewportHeight * FADE.start) / (viewportHeight * FADE.length);
  return {
    x: -pointerX * HEADLINE_POINTER.x,
    y: progress * sink - pointerY * HEADLINE_POINTER.y,
    opacity: phone ? 1 : 1 - clamp(fade)
  };
}

/**
 * The highest the hills may reach in the hero so the lead stays readable at rest.
 *
 * @param textBottom - Bottom of the lead, px from the hero top.
 * @returns The hero y, px, that the highest hill contour must stay at or below.
 * @example
 * ```ts
 * headlineSafeTop(441); // 469
 * ```
 */
export function headlineSafeTop(textBottom: number): number {
  return textBottom + HILLS_GAP;
}

/**
 * Place the art frame in the measured hero. The frame is bottom-anchored and sinks below the hero
 * (cropping the foreground) whenever the hills would otherwise rise into the lead. The sun or moon
 * plane alone drops further when the window is wide and short, so it stays below the header.
 *
 * @param input - Hero height, frame height, bottom of the lead, layout.
 * @returns The frame overhang and the sun drop, px.
 * @example
 * ```ts
 * framePlacement({ heroHeight: 524, frameHeight: 1382, textBottom: 396, phone: false });
 * // { under: 621.4, sunDrop: 66.3 }: a 1920 × 600 window, the sun set a little behind its hills
 * ```
 */
export function framePlacement(input: FrameInput): FramePlacement {
  const { heroHeight, frameHeight, phone } = input;
  const minimum = phone ? MIN_UNDER.phone : MIN_UNDER.desktop;
  const hillsBelowTop = frameHeight * (1 - HILLS_TOP);
  const under = Math.max(minimum, headlineSafeTop(input.textBottom) + hillsBelowTop - heroHeight);
  const frameTop = heroHeight + under - frameHeight;
  const sunRest = frameTop + frameHeight * SUN_DISC_TOP - DEPTHS.sun.pointerY;
  return { under, sunDrop: Math.max(0, SUN_GAP - sunRest) };
}

/**
 * How far the sun or moon moves right so a long headline (ru, uk) does not run into it on a phone.
 * The disc keeps its place when the headline ends before it; on desktop it sits clear of the text.
 *
 * @param input - Frame position and width, the headline's right edge, layout.
 * @returns The shift in px, 0 to {@link SUN_SHIFT_MAX} (`--sun-shift`).
 * @example
 * ```ts
 * sunShift({ frameLeft: -341, frameWidth: 901, textRight: 302, phone: true }); // 26
 * ```
 */
export function sunShift(input: SunShiftInput): number {
  if (!input.phone) {
    return 0;
  }
  const discLeft = input.frameLeft + input.frameWidth * SUN_DISC_LEFT;
  return clamp(input.textRight + SUN_TEXT_GAP - discLeft, 0, SUN_SHIFT_MAX);
}

/**
 * How visible the sun or moon is while the hero scrolls. It sets behind its hills and is gone
 * before the first sheet reaches it, so no sliver shows above the sheet's top edge. A phone hero
 * scrolls away with the page and keeps it.
 *
 * @param progress - Hero scroll progress, 0..1.
 * @param phone - Phone layout.
 * @returns Opacity, 1 at rest, 0 once the scroll is nearly through.
 * @example
 * ```ts
 * sunOpacity(0.65, false); // 0.5
 * ```
 */
export function sunOpacity(progress: number, phone: boolean): number {
  if (phone) {
    return 1;
  }
  return 1 - clamp((progress - SUN_FADE.start) / SUN_FADE.length);
}

/**
 * How far a sheet of the stack is still lifted.
 *
 * @param input - The sheet marker's top, the window height, the sheet's sticky top.
 * @returns 1 while the sheet enters at the window bottom, 0 once it lands in its place.
 * @example
 * ```ts
 * sheetLift({ markTop: 497, viewportHeight: 900, stickTop: 94 }); // 0.5
 * ```
 */
export function sheetLift(input: LiftInput): number {
  const { markTop, viewportHeight, stickTop } = input;
  return 1 - clamp((viewportHeight - markTop) / Math.max(1, viewportHeight - stickTop));
}

/**
 * How far the next sheet covers a sheet of the stack.
 *
 * @param input - The sheet's bottom and height, the next sheet's top.
 * @returns 0 uncovered, 1 fully covered.
 * @example
 * ```ts
 * sheetCover({ bottom: 600, nextTop: 350, height: 500 }); // 0.5
 * ```
 */
export function sheetCover(input: CoverInput): number {
  return input.height > 0 ? clamp((input.bottom - input.nextTop) / input.height) : 0;
}

/**
 * Damped spring from 1 to 0 with a soft overshoot past 0.
 *
 * @param seconds - Time since release.
 * @returns The spring position.
 */
function spring(seconds: number): number {
  const { damping, frequency } = SPRING;
  const ratio = Math.sqrt(1 - damping * damping);
  const damped = frequency * ratio;
  const envelope = Math.exp(-damping * frequency * seconds);
  return envelope * (Math.cos(damped * seconds) + (damping / ratio) * Math.sin(damped * seconds));
}

/**
 * The hinge angle of a sticker springing up from flat.
 *
 * @param seconds - Time since the spring started; negative while it waits.
 * @returns Degrees: 90 lying flat, 0 upright, briefly negative as the paper bounces past upright.
 * @example
 * ```ts
 * hingeAngle(0); // 90
 * hingeAngle(SPRING_SECONDS); // 0
 * ```
 */
export function hingeAngle(seconds: number): number {
  if (seconds <= 0) {
    return FLAT;
  }
  if (seconds >= SPRING_SECONDS) {
    return 0;
  }
  return FLAT * spring(seconds);
}

/**
 * The hinge angle after a tap: the paper is pushed back from where it stands and springs upright
 * on the same spring, starting the moment the finger lands.
 *
 * @param from - The angle it had when tapped.
 * @param seconds - Time since the tap.
 * @returns Degrees: `from` at the tap, a dip of about 55 toward flat at 0.1 s, a bounce past upright, 0 after {@link SPRING_SECONDS}.
 * @example
 * ```ts
 * kickAngle(0, 0.1); // about 55: pushed back toward flat
 * kickAngle(0, SPRING_SECONDS); // 0: upright again
 * ```
 */
export function kickAngle(from: number, seconds: number): number {
  if (seconds >= SPRING_SECONDS) {
    return 0;
  }

  const { damping, frequency } = SPRING;
  const damped = frequency * Math.sqrt(1 - damping * damping);
  const push = KICK * Math.exp(-damping * frequency * seconds) * Math.sin(damped * seconds);
  return Math.min(FLAT, from * spring(seconds) + push);
}

/**
 * How a sticker's paper catches the light at a hinge angle.
 *
 * @param angle - Hinge angle in degrees, 0 upright, 90 flat.
 * @returns The standing factor and the brightness of the cut-out.
 * @example
 * ```ts
 * paperLight(0); // { up: 1, light: 1 }
 * ```
 */
export function paperLight(angle: number): PaperLight {
  return {
    up: clamp(1 - angle / FLAT),
    light: 1 + TIP_LIGHT * Math.sin((angle * Math.PI) / 180)
  };
}
