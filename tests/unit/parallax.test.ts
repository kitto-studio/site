import { describe, expect, it } from "vitest";
import {
  framePlacement,
  HILLS_GAP,
  HILLS_TOP,
  headlineMotion,
  headlineSafeTop,
  heroProgress,
  hingeAngle,
  kickAngle,
  PLANE_NAMES,
  type PlaneName,
  paperLight,
  planeTransform,
  SPRING_SECONDS,
  SUN_DISC_LEFT,
  SUN_DISC_TOP,
  SUN_GAP,
  SUN_SHIFT_MAX,
  SUN_TEXT_GAP,
  sheetCover,
  sheetLift,
  sunOpacity,
  sunShift
} from "../../src/lib/parallax";

const STILL = { x: 0, y: 0 };

/** Hero sizes the design is checked at, plus a wide short window and a long headline. */
const LAYOUTS = [
  { name: "1440 × 900", heroHeight: 824, frameHeight: 1037, textBottom: 441, phone: false },
  { name: "1024 × 768", heroHeight: 692, frameHeight: 747, textBottom: 380, phone: false },
  { name: "1920 × 600", heroHeight: 524, frameHeight: 1382, textBottom: 396, phone: false },
  {
    name: "1440 × 700, long text",
    heroHeight: 624,
    frameHeight: 1037,
    textBottom: 560,
    phone: false
  },
  { name: "390 × 844", heroHeight: 576, frameHeight: 600, textBottom: 258, phone: true },
  { name: "390 × 844, long text", heroHeight: 576, frameHeight: 600, textBottom: 330, phone: true }
] as const;

/** The highest hill line under the text, read the way the CSS places the frame. */
const hillsTop = (layout: (typeof LAYOUTS)[number]): number => {
  const { under } = framePlacement(layout);
  return layout.heroHeight + under - layout.frameHeight + layout.frameHeight * HILLS_TOP;
};

describe("hero at rest", () => {
  // Catches: a plane shifted or scaled at load, or the headline hidden or offset before any scroll.
  it("keeps every plane still and the headline fully visible at progress 0", () => {
    for (const plane of PLANE_NAMES) {
      const rest = planeTransform(plane, {
        progress: 0,
        pointer: STILL,
        frameHeight: 1037,
        phone: false
      });
      expect(rest.x).toBeCloseTo(0);
      expect(rest.y).toBeCloseTo(0);
      expect(rest.scale).toBe(1);
    }
    const headline = headlineMotion({
      progress: 0,
      scrollY: 0,
      viewportHeight: 900,
      pointer: STILL,
      phone: false
    });
    expect(headline.x).toBeCloseTo(0);
    expect(headline.y).toBe(0);
    expect(headline.opacity).toBe(1);
  });

  // Catches: the hills rising into the lead at some width or in a long language.
  it("places the frame so the hills stay below the lead plus the gap", () => {
    for (const layout of LAYOUTS) {
      expect(hillsTop(layout), layout.name).toBeGreaterThanOrEqual(
        headlineSafeTop(layout.textBottom) - 0.001
      );
      expect(headlineSafeTop(layout.textBottom)).toBe(layout.textBottom + HILLS_GAP);
    }
  });

  // Catches: the frame floating up off the bottom edge when the text is short.
  it("keeps the minimum overhang below the hero when the text is short", () => {
    const short = { heroHeight: 900, frameHeight: 1037, textBottom: 100 };
    expect(framePlacement({ ...short, phone: false }).under).toBe(60);
    expect(framePlacement({ ...short, phone: true }).under).toBe(30);
  });
});

describe("hero depth", () => {
  // Catches: the depth order swapped, so the front no longer moves fastest and the scene goes flat.
  it("moves the front plane fastest, both on scroll and with the pointer", () => {
    const input = { progress: 0.6, pointer: { x: 1, y: 1 }, frameHeight: 1037, phone: false };
    const motion = (plane: PlaneName) => planeTransform(plane, input);
    const growth = (plane: PlaneName) => motion(plane).scale - 1;
    const shift = (plane: PlaneName) => Math.abs(motion(plane).x);

    expect(growth("front")).toBeGreaterThan(growth("near"));
    expect(growth("near")).toBeGreaterThan(growth("mid"));
    expect(growth("mid")).toBeGreaterThan(growth("far"));
    expect(shift("front")).toBeGreaterThan(shift("near"));
    expect(shift("near")).toBeGreaterThan(shift("mid"));
    expect(shift("mid")).toBeGreaterThan(shift("far"));
    expect(shift("far")).toBeGreaterThan(shift("sun"));
  });

  // Catches: the headline rising over the hills instead of sinking behind them with the sun.
  it("sinks the headline and the sun while the mid hills rise", () => {
    const at = { progress: 1, pointer: STILL, frameHeight: 1037, phone: false };
    const headline = headlineMotion({ ...at, scrollY: 675, viewportHeight: 900 });
    expect(headline.y).toBeGreaterThan(0);
    expect(planeTransform("sun", at).y).toBeGreaterThan(0);
    expect(planeTransform("mid", at).y).toBeLessThan(0);
  });

  // Catches: the headline fading on a phone, where the hero scrolls away and the text must stay readable.
  it("fades the headline on desktop only, once the reader scrolls past the hero", () => {
    const deep = { progress: 1, scrollY: 900, pointer: STILL, viewportHeight: 900 };
    expect(headlineMotion({ ...deep, phone: false }).opacity).toBeLessThan(0.5);
    expect(headlineMotion({ ...deep, phone: true }).opacity).toBe(1);
  });
});

describe("sun and moon", () => {
  // Catches: the sun or moon climbing under the header plate on a wide, short window or at any scroll.
  it("never rises above the header bottom + 34 px at any scroll or pointer", () => {
    for (const layout of LAYOUTS) {
      const { under, sunDrop } = framePlacement(layout);
      const planeTop = layout.heroHeight + under - layout.frameHeight + sunDrop;
      for (const progress of [-0.5, 0, 0.25, 0.5, 0.75, 1, 1.5]) {
        for (const pointerY of [-1, 0, 1, 2]) {
          const motion = planeTransform("sun", {
            progress,
            pointer: { x: 0, y: pointerY },
            frameHeight: layout.frameHeight,
            phone: layout.phone
          });
          // The plane scales around its centre, then moves by its offset.
          const centre = layout.frameHeight / 2;
          const discTop =
            planeTop +
            centre +
            (layout.frameHeight * SUN_DISC_TOP - centre) * motion.scale +
            motion.y;
          expect(discTop, `${layout.name} at ${progress}`).toBeGreaterThanOrEqual(SUN_GAP - 0.001);
        }
      }
    }
  });

  // Catches: the sun dropped behind the hills on a window where it already clears the header.
  it("leaves the sun with the frame when it already clears the header", () => {
    expect(framePlacement(LAYOUTS[0]).sunDrop).toBe(0);
    expect(framePlacement(LAYOUTS[2]).sunDrop).toBeGreaterThan(0);
  });

  // The phone frame at 390 px: 231cqw wide, left at -87.4cqw (the CSS of the phone hero).
  const PHONE_FRAME = { frameLeft: -87.4 * 3.9, frameWidth: 231 * 3.9 };

  // Catches: the sun running into the end of a long headline (ru "стоит сыграть." ends at 302 px at 390).
  it("moves the phone sun right of a long headline, with air between them", () => {
    for (const textRight of [246, 265, 288, 292, 302, 316]) {
      const shift = sunShift({ ...PHONE_FRAME, textRight, phone: true });
      const discLeft = PHONE_FRAME.frameLeft + PHONE_FRAME.frameWidth * SUN_DISC_LEFT + shift;
      expect(shift).toBeLessThanOrEqual(SUN_SHIFT_MAX);
      if (shift < SUN_SHIFT_MAX) {
        expect(discLeft - textRight, `headline ends at ${textRight}`).toBeGreaterThanOrEqual(
          SUN_TEXT_GAP - 0.001
        );
      }
    }
    expect(sunShift({ ...PHONE_FRAME, textRight: 302, phone: true })).toBeGreaterThan(20);
  });

  // Catches: a short headline pushing the sun off its place, or desktop moving the sun at all.
  it("keeps the sun where it is for a short headline and on desktop", () => {
    expect(sunShift({ ...PHONE_FRAME, textRight: 246, phone: true })).toBe(0);
    expect(sunShift({ ...PHONE_FRAME, textRight: 400, phone: false })).toBe(0);
  });

  // Catches: a sliver of the sun left above the first sheet's top edge once the hero has scrolled.
  it("fades the desktop sun out before the sheets reach it and keeps it on a phone", () => {
    expect(sunOpacity(0, false)).toBe(1);
    expect(sunOpacity(0.65, false)).toBeCloseTo(0.5);
    expect(sunOpacity(0.9, false)).toBe(0);
    expect(sunOpacity(1, false)).toBe(0);
    expect(sunOpacity(1, true)).toBe(1);
  });
});

describe("clamping", () => {
  // Catches: rubber-band overscroll or a scroll past the hero pushing planes past their end or backwards.
  it("treats progress below 0 as 0 and above 1 as 1", () => {
    const base = { pointer: { x: 0.3, y: -0.4 }, frameHeight: 1037, phone: false };
    for (const plane of PLANE_NAMES) {
      expect(planeTransform(plane, { ...base, progress: -2 })).toEqual(
        planeTransform(plane, { ...base, progress: 0 })
      );
      expect(planeTransform(plane, { ...base, progress: 3 })).toEqual(
        planeTransform(plane, { ...base, progress: 1 })
      );
    }
    const text = { pointer: STILL, viewportHeight: 900, phone: false };
    expect(headlineMotion({ ...text, progress: -1, scrollY: -80 })).toEqual(
      headlineMotion({ ...text, progress: 0, scrollY: 0 })
    );
    expect(headlineMotion({ ...text, progress: 4, scrollY: 5000 }).opacity).toBe(0);
  });

  // Catches: a mouse outside the window (or a bad event) throwing the planes off screen.
  it("limits the pointer to -1..1", () => {
    const base = { progress: 0.2, frameHeight: 1037, phone: false };
    expect(planeTransform("front", { ...base, pointer: { x: 5, y: -5 } })).toEqual(
      planeTransform("front", { ...base, pointer: { x: 1, y: -1 } })
    );
  });

  // Catches: scroll progress running past the hero or negative, and a phone using the desktop run.
  it("maps scroll to 0..1 over three quarters of the window, or 70% of the hero on a phone", () => {
    const desktop = { viewportHeight: 800, heroHeight: 724, phone: false };
    expect(heroProgress({ ...desktop, scrollY: -50 })).toBe(0);
    expect(heroProgress({ ...desktop, scrollY: 300 })).toBe(0.5);
    expect(heroProgress({ ...desktop, scrollY: 2000 })).toBe(1);
    expect(heroProgress({ viewportHeight: 844, heroHeight: 500, phone: true, scrollY: 175 })).toBe(
      0.5
    );
  });

  // Catches: a phone getting the full desktop parallax, which the art cannot cover at that width.
  it("halves the parallax on a phone", () => {
    const base = { progress: 1, pointer: STILL, frameHeight: 600 };
    const desktop = planeTransform("front", { ...base, phone: false });
    const phone = planeTransform("front", { ...base, phone: true });
    expect(phone.scale - 1).toBeCloseTo((desktop.scale - 1) / 2);
  });
});

describe("sheet stack", () => {
  // Catches: a sheet that never lands (stays tilted) or lands before it reaches its place.
  it("lifts a sheet at the window bottom and lands it at its sticky top", () => {
    const view = { viewportHeight: 900, stickTop: 94 };
    expect(sheetLift({ ...view, markTop: 900 })).toBe(1);
    expect(sheetLift({ ...view, markTop: 1400 })).toBe(1);
    expect(sheetLift({ ...view, markTop: 94 })).toBe(0);
    expect(sheetLift({ ...view, markTop: -300 })).toBe(0);
    expect(sheetLift({ ...view, markTop: 497 })).toBeCloseTo(0.5);
  });

  // Catches: the cover shade showing on a sheet nothing lies on, or a division by zero on a hidden sheet.
  it("covers a sheet only as far as the next sheet overlaps it", () => {
    expect(sheetCover({ bottom: 600, nextTop: 700, height: 500 })).toBe(0);
    expect(sheetCover({ bottom: 600, nextTop: 350, height: 500 })).toBe(0.5);
    expect(sheetCover({ bottom: 600, nextTop: -100, height: 500 })).toBe(1);
    expect(sheetCover({ bottom: 0, nextTop: -10, height: 0 })).toBe(0);
  });
});

describe("pop-up hinge", () => {
  // Catches: a sticker that starts standing (no pop), never settles upright, or loses its paper bounce.
  it("springs from flat to upright with one overshoot, then rests at 0", () => {
    expect(hingeAngle(-0.2)).toBe(90);
    expect(hingeAngle(0)).toBe(90);
    expect(hingeAngle(SPRING_SECONDS)).toBe(0);
    expect(hingeAngle(5)).toBe(0);
    const path = Array.from({ length: 140 }, (_, step) => hingeAngle(step / 100));
    expect(Math.min(...path)).toBeLessThan(0);
    expect(Math.max(...path.slice(1))).toBeLessThan(90);
  });

  // Catches: a tap that waits before the paper moves, jumps from where it stood, tips over flat or
  // never settles upright again.
  it("kicks from where it stands at once, bounces and settles upright", () => {
    expect(kickAngle(0, 0)).toBe(0);
    expect(kickAngle(-12, 0)).toBe(-12);
    expect(kickAngle(0, 1 / 60)).toBeGreaterThan(5);
    const path = Array.from({ length: 140 }, (_, step) => kickAngle(0, step / 100));
    expect(Math.max(...path)).toBeGreaterThan(40);
    expect(Math.max(...path)).toBeLessThan(90);
    expect(Math.min(...path)).toBeLessThan(0);
    expect(Math.abs(kickAngle(30, 0.6) - kickAngle(0, 0.6))).toBeLessThan(5);
    expect(kickAngle(30, SPRING_SECONDS)).toBe(0);
  });

  // Catches: the cast shadow showing under a flat sticker, or the tipped paper not catching the light.
  it("casts the full shadow standing, none lying flat, and brightens the tipped paper", () => {
    expect(paperLight(0)).toEqual({ up: 1, light: 1 });
    expect(paperLight(90).up).toBe(0);
    expect(paperLight(90).light).toBeCloseTo(1.08);
    expect(paperLight(-10).up).toBe(1);
  });
});
