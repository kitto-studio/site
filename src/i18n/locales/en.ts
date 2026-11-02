/** @file English UI strings: the canonical {@link UIStrings} value set every locale mirrors. */
import type { UIStrings } from "../types";

/** English strings, copy from the approved prototype. */
export const en: UIStrings = {
  meta: {
    root: {
      title: "Choose your language",
      description: "Kitto Studio is a small family studio. We make puzzle games for phones."
    },
    home: {
      title: "Surely worth playing.",
      description: "We are Kitto Studio, a small family studio. We make puzzle games for phones."
    },
    about: {
      title: "About",
      description:
        "Kitto Studio is Alex and Hanna. We make puzzle games for phones, together and at our own pace."
    },
    games: {
      title: "Games",
      description: "We make puzzle games for phones. Here is what we are working on now."
    },
    memoryMissing: {
      title: "A Memory Missing: Merge Game",
      description:
        "A young man wakes up in a hospital and remembers nothing. A detective is already waiting by his bed."
    },
    support: {
      title: "Support",
      description:
        "One address for everything: questions, problems in a game, ideas and requests about your data. We read every letter."
    },
    privacy: {
      title: "Privacy Policy",
      description:
        "Kitto Studio games keep your progress on your device. No accounts, no analytics, no ads, no tracking."
    },
    terms: {
      title: "Terms of Use",
      description: "The terms for using Kitto Studio games and the kitto.studio website."
    },
    deleteData: {
      title: "Delete your data",
      description:
        "How to delete your data from Kitto Studio games: no account, nothing on our servers, clear it on your device."
    },
    notFound: {
      title: "Page not found",
      description: "This page does not exist or has moved."
    }
  },
  chrome: {
    skip: "Skip to content",
    homeLabel: "Kitto Studio, home",
    navLabel: "Main",
    nav: { games: "Games", about: "About", support: "Support" },
    footer: {
      label: "Legal and support",
      privacy: "Privacy Policy",
      terms: "Terms of Use",
      deleteData: "Delete your data",
      support: "Support",
      copyright: "© 2026 Kitto Studio"
    },
    theme: { label: "Theme", system: "System", light: "Light", dark: "Dark" },
    language: { label: "Language" },
    menu: { open: "Menu", close: "Close" }
  },
  root: {
    heading: "Choose your language"
  },
  home: {
    hero: {
      title: "Surely worth playing.",
      lead: "We are Kitto Studio, a small family studio. We make puzzle games for phones."
    },
    games: {
      title: "Our games",
      lead: "Our first game is in development. More will follow.",
      comingSoon: "Coming soon",
      slot: "New game",
      genre: "A detective merge game",
      platforms: "For iPhone and Android"
    },
    about: {
      title: "About us",
      text: "Kitto Studio is Alex and Hanna. We make every game together, at our own pace.",
      kitto: "きっと (kitto) means “surely” in Japanese.",
      more: "More about the studio"
    },
    support: {
      title: "Need help?",
      text: "Write to us at {email}. We read every letter.",
      cta: "Write to us"
    }
  },
  about: {
    title: "A small family studio",
    lead: "Kitto Studio is Alex and Hanna. We make puzzle games for phones, together and at our own pace.",
    who: {
      title: "Who we are",
      first: "There are two of us. We are a family, and the studio is the work we share.",
      second:
        "Every game starts at our table. We think it up together, build it and play it many times before anyone else sees it.",
      dioramaAlt:
        "A small paper studio room with two desks facing each other, two laptops and two cups of tea."
    },
    name: {
      title: "Why the name Kitto",
      first:
        "In Japanese, きっと (kitto) means “surely”. People say it when they believe something will happen: it will surely work out.",
      second:
        "We like that quiet confidence. A game takes a long time to make. We believe each one will surely get there.",
      kana: "きっと",
      reading: "kitto"
    },
    how: {
      title: "How we work",
      small: {
        title: "Small on purpose",
        text: "It is just the two of us, so every detail passes through our hands."
      },
      care: {
        title: "Careful with every puzzle",
        text: "We test each puzzle until it feels fair and clear. If it is not ready yet, it waits."
      },
      pace: {
        title: "At our own pace",
        text: "We do not rush. A game comes out when it is good, not when a calendar says so."
      }
    },
    hello: {
      title: "Say hello",
      text: "Questions, ideas or just a kind word: write to {email}. We read every letter.",
      support: "Need help with a game? See {link}.",
      supportLink: "Support"
    }
  },
  games: {
    title: "Our games",
    lead: "We make puzzle games for phones. Here is what we are working on now.",
    card: {
      genre: "A detective merge game",
      teaser:
        "A young man wakes up in a hospital and remembers nothing. A detective is already waiting by his bed.",
      status: "Coming soon to iPhone and Android",
      cta: "About the game"
    },
    slot: {
      name: "New game",
      soon: "Coming soon",
      note: "More games will appear here when they are ready."
    },
    help: "Questions about our games? See {link}.",
    helpLink: "Support"
  },
  game: {
    name: "A Memory Missing: Merge Game",
    breadcrumb: { label: "Breadcrumb", games: "Games" },
    tags: { genre: "Detective merge game", status: "Coming soon to iPhone and Android" },
    gallery: {
      title: "Screenshots and art",
      wardLabel: "Key art",
      wardAlt:
        "Key art: a hospital room at night. A young man sleeps in bed while a detective and a woman talk beside him.",
      splashLabel: "Loading screen",
      splashAlt:
        "The game's loading screen: the young man asleep in a hospital bed, seen in a round frame. Below it are the game's title and a full loading bar.",
      previous: "Previous image",
      next: "Next image",
      open: "Open full screen",
      show: "Show image {n} of {total}: {label}",
      count: "{n} of {total}",
      viewer: "Image viewer",
      close: "Close"
    },
    story: {
      title: "The story",
      premise:
        "A young man wakes up in a hospital and remembers nothing. A detective is already waiting by his bed. Merge clues, bring back lost memories piece by piece and find out what happened on the night he forgot."
    },
    platforms: {
      title: "Where to play",
      iphone: "iPhone",
      android: "Android",
      soon: "Coming soon",
      note: "No release date yet. We will add store links here when the game is out."
    },
    features: {
      title: "In the game",
      merge: {
        title: "Merge to find clues",
        text: "Combine items on the board. Small things turn into clues."
      },
      memories: {
        title: "Memories, piece by piece",
        text: "Each clue brings back a part of the night he forgot."
      },
      solve: {
        title: "A story to solve",
        text: "Put the pieces together and find out what really happened."
      },
      offline: {
        title: "Plays offline",
        text: "No connection needed. Your progress is saved on your device."
      }
    },
    help: {
      title: "Help and privacy",
      text: "Questions or problems with the game? Write to us on the {supportLink}. How the game handles your data is in the {privacyLink}.",
      supportLink: "support page",
      privacyLink: "Privacy Policy"
    },
    board: {
      title: "Merge a few clues",
      lead: "Drag an item onto its twin to merge them, and finish all three chains to bring back a memory.",
      hint: "Or tap an item, then its twin.",
      hintMouse: "Or click an item, then its twin.",
      keys: "Arrow keys move between cells. Enter or Space picks an item up and drops it. Escape puts it back.",
      caseTitle: "Clues to find",
      progress: "{n} of 3 clues found",
      newBoard: "New board",
      empty: "Empty cell",
      picked: "{item} picked up. Choose its twin or an empty cell.",
      merged: "Merged: {item}.",
      found: "Clue found: {item}.",
      missing: "{item}: not found yet",
      winTitle: "A memory is back.",
      winText: "One piece of the night he forgot. The rest is in the game.",
      again: "Play again"
    },
    items: {
      note1: "Torn scrap",
      note2: "Folded note",
      note3: "Sealed letter",
      key1: "Old key",
      key2: "Key ring",
      key3: "Locked box",
      photo1: "Photo corner",
      photo2: "Half a photo",
      photo3: "Framed photo",
      memory: "Memory"
    }
  },
  support: {
    title: "Need help? Write to us.",
    lead: "One address for everything: questions, problems in a game, ideas and requests about your data. We read every letter.",
    mail: {
      title: "Our email",
      write: "Write a letter",
      copy: "Copy address",
      copied: "Copied",
      copiedNote: "The address is on your clipboard.",
      copyFail: "Select the address above and copy it."
    },
    letter: {
      title: "What to put in your letter",
      lead: "A few details help us find the problem faster.",
      game: "The name of the game",
      device: "Your phone or tablet model",
      os: "The iOS or Android version (you find it in Settings)",
      what: "What happened, and what you expected. A screenshot helps a lot."
    },
    faq: {
      title: "Common questions",
      progressQuestion: "Where is my progress saved?",
      progressAnswer:
        "On your device. Your progress stays on the phone or tablet where you play. If you delete the game, your progress is deleted with it.",
      deleteQuestion: "How do I delete my data?",
      deleteAnswer: "Follow the steps on {link}. You can also write to us, and we will help.",
      deleteLink: "Delete your data",
      privacyQuestion: "How do you handle my privacy?",
      privacyAnswer: "Our {link} explains what data our games use and why.",
      privacyLink: "Privacy Policy"
    }
  },
  legal: {
    titles: {
      privacy: "Privacy Policy",
      terms: "Terms of Use",
      deleteData: "Delete your data"
    },
    contents: "Contents",
    inShort: "In short",
    updated: "Last updated: {date}",
    draft: "Draft. Highlighted fields such as {placeholder} are not filled in yet.",
    fallback: "This page is available in English."
  },
  deleteData: {
    facts: {
      developer: "Developer",
      apps: "Apps",
      appsValue: "A Memory Missing: Merge Game, and future Kitto games",
      ids: "App IDs"
    },
    cta: "Email a deletion request",
    mailSubject: "Delete my data",
    deleted: "Deleted",
    kept: "Kept",
    nothing: "Nothing.",
    nothingNote: "We do not keep any of your data after deletion."
  },
  notFound: {
    title: "Page not found",
    text: "This page does not exist or has moved.",
    home: "Go to the home page"
  }
};
