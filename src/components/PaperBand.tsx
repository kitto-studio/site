/**
 * @file PaperBand (design-context §6 B4): the short paper-cut strip of the inner pages. Four planes
 * cut from the landscape layers (sun or moon, far hills, mid hills with the house, near slopes),
 * day art in light and night art in dark. The planes settle into place once as the page appears;
 * after that the band is still. Decorative: hidden from assistive technology.
 *
 * Two edges, as in the prototype: `fade` under a page head (About, Games, Support), the band's
 * lower edge fading into the page; `cut` above a legal document, a wavy die-cut edge with a paper
 * shadow, the sheet tucked over it.
 */
import type { VNode } from "preact";

/** The band's lower edge: `fade` under a page head, `cut` above a legal sheet. */
export type BandEdge = "fade" | "cut";

/** PaperBand props. */
export type PaperBandProps = {
  /** The lower edge, `fade` by default. */
  edge?: BandEdge;
};

/** One plane of the band and the landscape layer it shows: the sun is cut from the far layer. */
type Plane = {
  /** Plane name, the hook of its offset and crop. */
  name: "sun" | "far" | "mid" | "near";
  /** Layer file name in `media/layers/`. */
  layer: "far" | "mid" | "near";
};

/** The planes, back to front. */
const PLANES: readonly Plane[] = [
  { name: "sun", layer: "far" },
  { name: "far", layer: "far" },
  { name: "mid", layer: "mid" },
  { name: "near", layer: "near" }
];

/** Intrinsic size of every landscape layer, px. */
const LAYER_SIZE = { width: 1536, height: 1024 };

/**
 * Render the paper band.
 *
 * @param props - PaperBand props.
 * @param props.edge - `fade` (default) under a page head, `cut` above a legal sheet.
 * @returns The band with its four planes, each a day image under its night image.
 * @example
 * ```tsx
 * <section data-page-head>
 *   <div data-container><h1>{strings.title}</h1></div>
 *   <PaperBand />
 * </section>
 * ```
 */
export function PaperBand({ edge = "fade" }: PaperBandProps): VNode {
  return (
    <div data-component="paper-band" data-edge={edge} aria-hidden="true">
      <div data-band-window>
        {PLANES.map(plane => (
          <div key={plane.name} data-band-plane={plane.name}>
            <img
              data-art="day"
              src={`/media/layers/day-${plane.layer}.webp`}
              alt=""
              width={LAYER_SIZE.width}
              height={LAYER_SIZE.height}
              decoding="async"
            />
            <img
              data-art="night"
              src={`/media/layers/night-${plane.layer}.webp`}
              alt=""
              width={LAYER_SIZE.width}
              height={LAYER_SIZE.height}
              decoding="async"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
