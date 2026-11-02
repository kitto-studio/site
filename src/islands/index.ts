/**
 * @file The island registry: every interactive part of the site, registered with the SPA.
 *
 * Shared registry, complete from Wave 0 and frozen inside a wave: each unit fills in its own
 * island file, never this list. Islands own behaviour only, never CSS.
 */
import { chromeIsland } from "./chrome";
import { copyEmailIsland } from "./copy-email";
import { galleryIsland } from "./gallery";
import { homeHeroIsland } from "./home-hero";
import { kanaDropIsland } from "./kana-drop";
import { legalTocIsland } from "./legal-toc";
import { logoJumpIsland } from "./logo-jump";
import { mergeBoardIsland } from "./merge-board";
import { popupStickerIsland } from "./popup-sticker";
import { sheetStackIsland } from "./sheet-stack";

/** Every island, in registration order: chrome first, then the pages. */
export const islands = [
  chromeIsland,
  logoJumpIsland,
  homeHeroIsland,
  sheetStackIsland,
  popupStickerIsland,
  kanaDropIsland,
  galleryIsland,
  mergeBoardIsland,
  copyEmailIsland,
  legalTocIsland
];
