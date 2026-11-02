/**
 * @file The typed string table: every word the site shows, for every page.
 *
 * Rules for every string:
 * - Plain text only. No markup and no URLs: a component builds every link from the route table.
 * - `{name}` marks a slot the component fills: `{email}` with the address link, `{link}` (or
 *   `{supportLink}`, `{privacyLink}`) with a route link whose label is the sibling `…Link` key,
 *   `{date}` with a locale-formatted date, `{n}` / `{total}` / `{label}` / `{item}` with values.
 * - The game name «A Memory Missing: Merge Game» lives once, in `game.name`, and is never translated.
 *
 * Shared registry: this file, `locales/en.ts` and `index.ts` are frozen inside a build wave. A unit
 * that needs a new key adds it to its own fragment `src/i18n/parts/<unit>.ts`, exporting the
 * fragment type and its English values (`export type ChromePart = {…}; export const chromePartEn`).
 * The orchestrator merges every fragment into this file and `locales/en.ts` between waves and
 * deletes the fragment.
 */

/** Route names that render a page. Every one but `root` is a key of {@link UIStrings} `meta`. */
export type PageId =
  | "root"
  | "home"
  | "about"
  | "games"
  | "memoryMissing"
  | "support"
  | "privacy"
  | "terms"
  | "deleteData"
  | "notFound";

/** Head copy of one page: the `<title>` text (before the site suffix) and the meta description. */
export type PageMeta = {
  /** Title before the `— Kitto Studio` template suffix. */
  title: string;
  /** Meta and Open Graph description. */
  description: string;
};

/** A title and a short text, the shape of every feature or principle item. */
export type TitledText = {
  /** Item heading. */
  title: string;
  /** Item text. */
  text: string;
};

/** Header, menus, skip link and footer: present on every page. */
export type ChromeStrings = {
  /** Skip link label. */
  skip: string;
  /** Accessible name of the logo link to home. */
  homeLabel: string;
  /** Accessible name of the main navigation. */
  navLabel: string;
  /** Main navigation labels. */
  nav: {
    /** Games link. */
    games: string;
    /** About link. */
    about: string;
    /** Support link. */
    support: string;
  };
  /** Footer links and copyright. */
  footer: {
    /** Accessible name of the footer navigation. */
    label: string;
    /** Privacy Policy link. */
    privacy: string;
    /** Terms of Use link. */
    terms: string;
    /** Delete your data link. */
    deleteData: string;
    /** Support link. */
    support: string;
    /** Copyright line. */
    copyright: string;
  };
  /** Theme switch. */
  theme: {
    /** Accessible name of the radio group. */
    label: string;
    /** Follow the system setting. */
    system: string;
    /** Light theme. */
    light: string;
    /** Dark theme. */
    dark: string;
  };
  /** Language picker. */
  language: {
    /** Accessible name of the picker button and list. */
    label: string;
  };
  /** Phone menu button. */
  menu: {
    /** Label while closed. */
    open: string;
    /** Label while open. */
    close: string;
  };
};

/** The root language page (`/`). */
export type RootStrings = {
  /** Heading above the list of languages. */
  heading: string;
};

/** Home page. */
export type HomeStrings = {
  /** Paper hero. */
  hero: {
    /** The slogan, the page's h1. */
    title: string;
    /** Lead under the slogan. */
    lead: string;
  };
  /** Games sheet. */
  games: {
    /** Sheet heading. */
    title: string;
    /** Sheet text. */
    lead: string;
    /** Stamp on the game photo and the slot label. */
    comingSoon: string;
    /** Name of the empty game slot. */
    slot: string;
    /** Genre line of the game card. */
    genre: string;
    /** Platforms line of the game card. */
    platforms: string;
  };
  /** About teaser sheet. */
  about: {
    /** Sheet heading. */
    title: string;
    /** Sheet text. */
    text: string;
    /** Meaning of the studio name. */
    kitto: string;
    /** Link to the About page. */
    more: string;
  };
  /** Support sheet. */
  support: {
    /** Sheet heading. */
    title: string;
    /** Sheet text with the `{email}` slot. */
    text: string;
    /** The orange mail button. */
    cta: string;
  };
};

/** About page. */
export type AboutStrings = {
  /** Page h1. */
  title: string;
  /** Lead under the h1. */
  lead: string;
  /** «Who we are» section. */
  who: {
    /** Section heading. */
    title: string;
    /** First paragraph. */
    first: string;
    /** Second paragraph. */
    second: string;
    /** Alt text of the studio diorama. */
    dioramaAlt: string;
  };
  /** «Why the name Kitto» section. */
  name: {
    /** Section heading. */
    title: string;
    /** First paragraph. */
    first: string;
    /** Second paragraph. */
    second: string;
    /** The large kana, the same in every locale. */
    kana: string;
    /** Latin reading under the kana. */
    reading: string;
  };
  /** «How we work» section. */
  how: {
    /** Section heading. */
    title: string;
    /** Small on purpose. */
    small: TitledText;
    /** Careful with every puzzle. */
    care: TitledText;
    /** At our own pace. */
    pace: TitledText;
  };
  /** «Say hello» contact line. */
  hello: {
    /** Section heading. */
    title: string;
    /** Text with the `{email}` slot. */
    text: string;
    /** Support pointer with the `{link}` slot. */
    support: string;
    /** Label of the `{link}` slot. */
    supportLink: string;
  };
};

/** Games catalog page. */
export type GamesStrings = {
  /** Page h1. */
  title: string;
  /** Lead under the h1. */
  lead: string;
  /** A Memory Missing card. */
  card: {
    /** Genre line. */
    genre: string;
    /** Short premise. */
    teaser: string;
    /** Release status line. */
    status: string;
    /** The orange button to the game page. */
    cta: string;
  };
  /** The neutral «New game» slot. */
  slot: {
    /** Slot name. */
    name: string;
    /** Slot status. */
    soon: string;
    /** Note under the slot. */
    note: string;
  };
  /** Support pointer with the `{link}` slot. */
  help: string;
  /** Label of the `{link}` slot. */
  helpLink: string;
};

/** Merge board on the game page. */
export type BoardStrings = {
  /** Board heading. */
  title: string;
  /** How to play. */
  lead: string;
  /** Touch hint. */
  hint: string;
  /** Mouse hint. */
  hintMouse: string;
  /** Keyboard help. */
  keys: string;
  /** Heading of the case list. */
  caseTitle: string;
  /** Progress line with `{n}`. */
  progress: string;
  /** Reset button. */
  newBoard: string;
  /** Accessible name of an empty cell. */
  empty: string;
  /** Live region: item picked, with `{item}`. */
  picked: string;
  /** Live region: merged, with `{item}`. */
  merged: string;
  /** Live region: clue found, with `{item}`. */
  found: string;
  /** Case list slot not found yet, with `{item}`. */
  missing: string;
  /** Win heading. */
  winTitle: string;
  /** Win text. */
  winText: string;
  /** The orange replay button. */
  again: string;
};

/** Names of the merge items: three chains of three tiers and the reward. */
export type ItemStrings = {
  /** Paper chain, tier 1. */
  note1: string;
  /** Paper chain, tier 2. */
  note2: string;
  /** Paper chain, tier 3. */
  note3: string;
  /** Key chain, tier 1. */
  key1: string;
  /** Key chain, tier 2. */
  key2: string;
  /** Key chain, tier 3. */
  key3: string;
  /** Photo chain, tier 1. */
  photo1: string;
  /** Photo chain, tier 2. */
  photo2: string;
  /** Photo chain, tier 3. */
  photo3: string;
  /** The reward orb. */
  memory: string;
};

/** A Memory Missing game page. */
export type GameStrings = {
  /** The game name, never translated. */
  name: string;
  /** Breadcrumb back to the catalog. */
  breadcrumb: {
    /** Accessible name of the breadcrumb navigation. */
    label: string;
    /** Link label. */
    games: string;
  };
  /** Tag pills under the title. */
  tags: {
    /** Genre tag. */
    genre: string;
    /** Status tag. */
    status: string;
  };
  /** Media gallery and lightbox. */
  gallery: {
    /** Accessible name of the gallery. */
    title: string;
    /** Key art label. */
    wardLabel: string;
    /** Key art alt text. */
    wardAlt: string;
    /** Loading screen label. */
    splashLabel: string;
    /** Loading screen alt text. */
    splashAlt: string;
    /** Previous arrow. */
    previous: string;
    /** Next arrow. */
    next: string;
    /** Expand to the lightbox. */
    open: string;
    /** Thumbnail name with `{n}`, `{total}`, `{label}`. */
    show: string;
    /** Caption count with `{n}`, `{total}`. */
    count: string;
    /** Accessible name of the lightbox dialog. */
    viewer: string;
    /** Close the lightbox. */
    close: string;
  };
  /** The story. */
  story: {
    /** Section heading. */
    title: string;
    /** The premise. */
    premise: string;
  };
  /** Where to play. */
  platforms: {
    /** Section heading. */
    title: string;
    /** iPhone row. */
    iphone: string;
    /** Android row. */
    android: string;
    /** Row status. */
    soon: string;
    /** Note about store links. */
    note: string;
  };
  /** Four features. */
  features: {
    /** Section heading. */
    title: string;
    /** Merge to find clues. */
    merge: TitledText;
    /** Memories, piece by piece. */
    memories: TitledText;
    /** A story to solve. */
    solve: TitledText;
    /** Plays offline. */
    offline: TitledText;
  };
  /** Help links. */
  help: {
    /** Section heading. */
    title: string;
    /** Text with the `{supportLink}` and `{privacyLink}` slots. */
    text: string;
    /** Label of the `{supportLink}` slot. */
    supportLink: string;
    /** Label of the `{privacyLink}` slot. */
    privacyLink: string;
  };
  /** Merge board. */
  board: BoardStrings;
  /** Merge item names. */
  items: ItemStrings;
};

/** Support page. */
export type SupportStrings = {
  /** Page h1. */
  title: string;
  /** Lead under the h1. */
  lead: string;
  /** Email card. */
  mail: {
    /** Card heading. */
    title: string;
    /** Mailto button. */
    write: string;
    /** Copy button. */
    copy: string;
    /** Copy button after success. */
    copied: string;
    /** Note after success. */
    copiedNote: string;
    /** Note when the clipboard refuses. */
    copyFail: string;
  };
  /** What to put in a letter. */
  letter: {
    /** Section heading. */
    title: string;
    /** Section lead. */
    lead: string;
    /** The game name item. */
    game: string;
    /** The device item. */
    device: string;
    /** The OS version item. */
    os: string;
    /** What happened item. */
    what: string;
  };
  /** Three short answers. */
  faq: {
    /** Section heading. */
    title: string;
    /** Where progress is saved. */
    progressQuestion: string;
    /** Answer. */
    progressAnswer: string;
    /** How to delete data. */
    deleteQuestion: string;
    /** Answer with the `{link}` slot. */
    deleteAnswer: string;
    /** Label of the `{link}` slot. */
    deleteLink: string;
    /** Privacy question. */
    privacyQuestion: string;
    /** Answer with the `{link}` slot. */
    privacyAnswer: string;
    /** Label of the `{link}` slot. */
    privacyLink: string;
  };
};

/** Shared parts of the three legal pages. Section text lives in `src/i18n/legal/`. */
export type LegalStrings = {
  /** Document titles (the h1). */
  titles: {
    /** Privacy Policy. */
    privacy: string;
    /** Terms of Use. */
    terms: string;
    /** Delete your data. */
    deleteData: string;
  };
  /** Contents rail and phone bar label. */
  contents: string;
  /** «In short» box heading. */
  inShort: string;
  /** Updated line with the `{date}` slot. */
  updated: string;
  /** Draft note with the `{placeholder}` slot. */
  draft: string;
  /** Note shown when the document is only in English. */
  fallback: string;
};

/** Delete your data page: the parts beyond the legal document. */
export type DeleteDataStrings = {
  /** Developer and app card. */
  facts: {
    /** Developer label. */
    developer: string;
    /** Apps label. */
    apps: string;
    /** Apps value. */
    appsValue: string;
    /** App IDs label. */
    ids: string;
  };
  /** The orange mail button. */
  cta: string;
  /** Mail subject of a deletion request. */
  mailSubject: string;
  /** Deleted column heading. */
  deleted: string;
  /** Kept column heading. */
  kept: string;
  /** Kept value. */
  nothing: string;
  /** Kept note. */
  nothingNote: string;
};

/** The 404 page. */
export type NotFoundStrings = {
  /** Page h1. */
  title: string;
  /** Explanation. */
  text: string;
  /** Link to home. */
  home: string;
};

/** Every UI string of the site for one locale. */
export type UIStrings = {
  /** Head copy per page. */
  meta: Record<Exclude<PageId, "root">, PageMeta>;
  /** Header, menus, footer. */
  chrome: ChromeStrings;
  /** Root language page. */
  root: RootStrings;
  /** Home page. */
  home: HomeStrings;
  /** About page. */
  about: AboutStrings;
  /** Games catalog. */
  games: GamesStrings;
  /** A Memory Missing page. */
  game: GameStrings;
  /** Support page. */
  support: SupportStrings;
  /** Shared legal page parts. */
  legal: LegalStrings;
  /** Delete your data page extras. */
  deleteData: DeleteDataStrings;
  /** 404 page. */
  notFound: NotFoundStrings;
};

/** The three legal documents, keyed like their routes. */
export type LegalDocumentId = "privacy" | "terms" | "deleteData";

/** One block of a legal section. Text is trusted HTML written by the studio. */
export type LegalBlock =
  | {
      /** A paragraph. */
      kind: "paragraph";
      /** Paragraph HTML. */
      html: string;
    }
  | {
      /** A bullet list. */
      kind: "list";
      /** One HTML string per item. */
      items: readonly string[];
    }
  | {
      /** Numbered steps, drawn as step tokens. */
      kind: "steps";
      /** One HTML string per step. */
      items: readonly string[];
    };

/** One numbered section of a legal document. */
export type LegalSection = {
  /** Anchor id, unique within the document. */
  id: string;
  /** Section heading. */
  heading: string;
  /** Section body. */
  blocks: readonly LegalBlock[];
};

/** A whole legal document in one locale. */
export type LegalDocument = {
  /** Opening paragraph, trusted HTML. */
  intro: string;
  /** «In short» bullet items, trusted HTML. */
  inShort: readonly string[];
  /** Numbered sections in order. */
  sections: readonly LegalSection[];
};
