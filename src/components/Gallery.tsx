/**
 * @file Gallery (design-context §6 E1, G «Gallery»; §7): the game page's pictures in the paper world.
 *
 * One large main view, a taped print with a fixed shape (16:9, square on the phone), so changing the
 * picture never moves the page. Its pictures sit in a scroll-snap strip: a phone swipes it natively,
 * the arrows, the thumbnails and ← → move it. Behind a picture that does not fill the frame lies a
 * blurred copy of itself under a paper veil. `art` pictures are shown as they are, `phone` pictures
 * inside a soft phone frame drawn in CSS. Under the print: the thumbnails as small tilted prints, the
 * current one outlined in orange, and the caption with the count. One picture: no arrows, no
 * thumbnails. A click on the main view opens the lightbox, a modal `<dialog>` the `gallery` island
 * fills with the picture.
 *
 * Rendered complete for the first picture, so the page is whole before the island starts. One
 * gallery per page (its ids derive from `headingId`).
 */
import type { VNode } from "preact";
import { t } from "../i18n";
import type { Locale } from "../i18n/languages";
import type { GameStrings } from "../i18n/types";
import { counter, edgesOf, hasControls } from "../lib/gallery";
import type { GalleryItem } from "../lib/game";
import { fillSlots } from "../lib/merge";
import { typeset } from "../lib/typography";

/** Gallery props. */
export type GalleryProps = {
  /** Page locale. */
  locale: Locale;
  /** The pictures, in order. */
  items: readonly GalleryItem[];
  /** Id of the gallery's (visually hidden) heading; names the sheet around it. */
  headingId: string;
};

/** Props of the picture inside a frame. */
type PictureProps = {
  /** The picture. */
  item: GalleryItem;
  /** Its alt text. */
  alt: string;
  /** Load it at once (the first picture) instead of when it comes near. */
  eager: boolean;
};

/** Direction of an arrow. */
type Direction = "previous" | "next";

/** The chevron of each arrow, drawn for this site. */
const CHEVRONS: Record<Direction, string> = {
  previous: "M15 5.5 8.5 12l6.5 6.5",
  next: "M9 5.5 15.5 12 9 18.5"
};

/**
 * The picture itself: the image for `art`, the screenshot inside the CSS phone frame for `phone`.
 * The lightbox shows a copy of this node.
 *
 * @param props - Picture props.
 * @param props.item - The picture.
 * @param props.alt - Its alt text.
 * @param props.eager - Load it at once.
 * @returns The image, or the phone frame holding it.
 */
function Picture({ item, alt, eager }: PictureProps): VNode {
  const image = (
    <img
      src={item.src}
      alt={alt}
      width={item.w}
      height={item.h}
      loading={eager ? undefined : "lazy"}
      decoding="async"
      draggable={false}
      data-gallery-picture={item.kind === "art" ? "" : undefined}
    />
  );
  return item.kind === "phone" ? <span data-gallery-phone>{image}</span> : image;
}

/** Icon props. */
type IconProps = {
  /** The path data, on a 24-unit grid. */
  path: string;
  /** Stroke width, 2.2 by default. */
  weight?: number;
};

/**
 * A decorative 24-unit line icon in the text colour.
 *
 * @param props - Icon props.
 * @param props.path - The path data.
 * @param props.weight - Stroke width.
 * @returns The icon, hidden from assistive technology.
 */
function Icon({ path, weight = 2.2 }: IconProps): VNode {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      stroke-width={weight}
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d={path} />
    </svg>
  );
}

/** A key of the gallery strings. */
type GalleryStringKey = keyof GameStrings["gallery"];

/** Look up a gallery string, set in the typography of the page's locale. */
type GalleryText = (key: GalleryStringKey) => string;

/** Props of the main view and of the thumbnail bar. */
type ViewProps = {
  /** The pictures. */
  items: readonly GalleryItem[];
  /** The gallery strings of the page's locale. */
  text: GalleryText;
  /** Id of the scroll strip, for the arrows' `aria-controls`. */
  trackId: string;
};

/**
 * The taped print with the main view: the strip of pictures, the arrows and the expand mark.
 *
 * @param props - View props.
 * @param props.items - The pictures.
 * @param props.text - Gallery strings.
 * @param props.trackId - Id of the strip.
 * @returns The print.
 */
function MainView({ items, text, trackId }: ViewProps): VNode {
  const count = items.length;
  const { atEnd } = edgesOf(0, count);
  return (
    <div data-gallery-print>
      <span data-gallery-tape="left" aria-hidden="true" />
      <span data-gallery-tape="right" aria-hidden="true" />
      <div data-gallery-view>
        <ul data-gallery-track id={trackId} tabIndex={-1}>
          {items.map((item, index) => {
            const label = text(item.labelKey);
            const position = fillSlots(text("count"), { n: index + 1, total: count });
            return (
              <li
                key={item.src}
                data-gallery-slide
                data-kind={item.kind}
                data-label={label}
                data-announce={`${label}, ${position}`}
                inert={index === 0 ? undefined : true}
              >
                <img
                  data-gallery-backdrop
                  src={item.src}
                  alt=""
                  aria-hidden="true"
                  width={item.w}
                  height={item.h}
                  loading={index === 0 ? undefined : "lazy"}
                  decoding="async"
                  draggable={false}
                />
                <span data-gallery-veil />
                <button type="button" data-gallery-open>
                  <Picture item={item} alt={text(item.altKey)} eager={index === 0} />
                  <span data-visually-hidden>{` ${text("open")}`}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          data-gallery-step="previous"
          aria-label={text("previous")}
          aria-controls={trackId}
          aria-disabled="true"
          tabIndex={-1}
        >
          <Icon path={CHEVRONS.previous} />
        </button>
        <button
          type="button"
          data-gallery-step="next"
          aria-label={text("next")}
          aria-controls={trackId}
          aria-disabled={atEnd ? "true" : "false"}
          tabIndex={atEnd ? -1 : 0}
        >
          <Icon path={CHEVRONS.next} />
        </button>
        <span data-gallery-zoom aria-hidden="true">
          <Icon path="M14.5 4.5h5v5M9.5 19.5h-5v-5M19.5 4.5l-5.8 5.8M4.5 19.5l5.8-5.8" weight={2} />
        </span>
      </div>
    </div>
  );
}

/**
 * The thumbnails, each a small taped print, and the caption of the current picture.
 *
 * @param props - View props.
 * @param props.items - The pictures.
 * @param props.text - Gallery strings.
 * @returns The bar under the print.
 */
function ThumbBar({ items, text }: Omit<ViewProps, "trackId">): VNode {
  const count = items.length;
  const first = items[0];
  return (
    <div data-gallery-bar>
      <div data-gallery-thumbs>
        {items.map((item, index) => (
          <button
            key={item.src}
            type="button"
            data-gallery-thumb
            data-kind={item.kind}
            aria-label={fillSlots(text("show"), {
              n: index + 1,
              total: count,
              label: text(item.labelKey)
            })}
            aria-current={index === 0 ? "true" : "false"}
          >
            <span data-thumb-print>
              <span data-thumb-tape aria-hidden="true" />
              <img
                src={item.thumb.src}
                alt=""
                width={item.thumb.w}
                height={item.thumb.h}
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            </span>
          </button>
        ))}
      </div>
      <p data-gallery-caption>
        <span data-gallery-label>{first === undefined ? "" : text(first.labelKey)}</span>
        <span data-gallery-number aria-hidden="true">
          {counter(0, count)}
        </span>
      </p>
    </div>
  );
}

/**
 * The lightbox: a modal dialog over a dark scrim, the picture as large as fits, its caption and
 * count, close and the two arrows. Empty until the island shows a picture in it.
 *
 * @param props - Lightbox props.
 * @param props.text - Gallery strings.
 * @returns The closed dialog.
 */
function Lightbox({ text }: Pick<ViewProps, "text">): VNode {
  return (
    <dialog data-gallery-lightbox aria-label={text("viewer")}>
      <div data-lightbox-stage />
      <p data-lightbox-caption aria-live="polite">
        <span data-lightbox-label />
        <span data-lightbox-number />
      </p>
      <button type="button" data-lightbox-close aria-label={text("close")}>
        <Icon path="M7 7l10 10M17 7 7 17" />
      </button>
      <button type="button" data-lightbox-step="previous" aria-label={text("previous")}>
        <Icon path={CHEVRONS.previous} />
      </button>
      <button type="button" data-lightbox-step="next" aria-label={text("next")}>
        <Icon path={CHEVRONS.next} />
      </button>
    </dialog>
  );
}

/**
 * Render the gallery, complete for its first picture.
 *
 * @param props - Gallery props.
 * @param props.locale - Page locale.
 * @param props.items - The pictures.
 * @param props.headingId - Id of the gallery heading.
 * @returns The gallery, an island root (`data-island="gallery"`).
 * @example
 * ```tsx
 * <PaperSheet labelledBy="game-gallery">
 *   <Gallery locale={locale} items={GALLERY} headingId="game-gallery" />
 * </PaperSheet>
 * ```
 */
export function Gallery({ locale, items, headingId }: GalleryProps): VNode {
  const strings = t(locale).game.gallery;
  const text: GalleryText = key => typeset(strings[key], locale);
  return (
    <div
      data-component="gallery"
      data-island="gallery"
      data-single={hasControls(items.length) ? undefined : ""}
    >
      <h2 id={headingId} data-visually-hidden>
        {text("title")}
      </h2>
      <MainView items={items} text={text} trackId={`${headingId}-track`} />
      <ThumbBar items={items} text={text} />
      <p data-gallery-live data-visually-hidden aria-live="polite" />
      <Lightbox text={text} />
    </div>
  );
}
