/**
 * @file Site constants, the single source of truth for both compositions: identity, contact, and
 * the head and SPA options `src/app.ts` (Node) and `src/spa.tsx` (browser) share. Reached by the
 * browser bundle, so free of node globals.
 */
import { islands } from "./islands";

/** Site identity, reached by the browser bundle, so free of node globals. */
export const SITE = {
  /** Display name, also the head title template suffix. */
  name: "Kitto Studio",
  /** Canonical origin. */
  url: "https://kitto.studio",
  /** Default author. */
  author: "Kitto Studio",
  /** Meta description fallback (per-locale descriptions come from i18n). */
  description: "Kitto Studio is a small family studio. We make puzzle games for phones."
} as const;

/** Contact addresses shown on the site. */
export const EMAILS = {
  /** Support and general questions. */
  support: "support@kitto.studio",
  /** Data deletion requests. */
  delete: "delete@kitto.studio"
} as const;

/** «Last updated» date of the legal pages, set at release (ISO date). */
export const LEGAL_UPDATED = "2026-11-02";

/**
 * Head defaults of every page, the same in the build and in the browser: the title template, the
 * English home card as the fallback OG image, and the large Twitter card.
 */
export const HEAD = {
  /** `<title>` pattern; `%s` is the page title. */
  titleTemplate: `%s — ${SITE.name}`,
  /** OG image of a page that names none. */
  defaultOgImage: "/og/en/home.png",
  /** Twitter card type. */
  twitterCard: "summary_large_image"
} as const;

/**
 * SPA options, the same in the build and in the browser: the island registry, a crossfade between
 * pages, no progress bar, and a swap of the `[data-page]` element only.
 */
export const SPA = {
  /** Every island of the site. */
  islands,
  /** View transition between pages. */
  viewTransitions: "crossfade",
  /** No navigation progress bar. */
  progressBar: false,
  /** The element a navigation swaps. */
  swapSelector: "[data-page]"
} as const;
