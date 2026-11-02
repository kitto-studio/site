/**
 * @file English «Delete your data», the approved prototype text.
 *
 * Slots the page fills (see `src/lib/legal.ts`): `{email:delete}` becomes the deletion address link,
 * `{route:privacy}` the URL of that page in the same locale. The list of the `kept` section is the
 * «Deleted» column of the deleted-and-kept ledger the page draws there. A translation keeps every
 * slot, section id and block exactly as written here.
 */
import type { LegalDocument } from "../../types";

/** The English «Delete your data» document. */
export const deleteDataEn: LegalDocument = {
  intro: "This page explains how to delete your data from games made by Kitto Studio.",
  inShort: [
    "There is no account, so there is no account to delete.",
    "We keep no game data on our servers.",
    "Game data lives only on your device. You can delete it yourself in a few taps.",
    "If you wrote to us, we delete your emails within 30 days of your request."
  ],
  sections: [
    {
      id: "nothing",
      heading: "No account, nothing on our servers",
      blocks: [
        {
          kind: "paragraph",
          html: "Our games have no accounts and send no data to us. Your progress and settings are saved only on your device."
        },
        {
          kind: "paragraph",
          html: "So there is nothing for us to delete on our side. You are in full control of your game data."
        }
      ]
    },
    {
      id: "android",
      heading: "Delete game data on Android",
      blocks: [
        {
          kind: "steps",
          items: [
            "Open <b>Settings</b> on your phone.",
            "Tap <b>Apps</b>.",
            "Find and tap the game, for example <b>A Memory Missing: Merge Game</b>.",
            "Tap <b>Storage</b>.",
            "Tap <b>Clear storage</b>."
          ]
        },
        {
          kind: "paragraph",
          html: "Or uninstall the game: this removes all of its data from your phone. Menu names can differ a little between phones."
        }
      ]
    },
    {
      id: "iphone",
      heading: "Delete game data on iPhone",
      blocks: [
        {
          kind: "steps",
          items: [
            "Touch and hold the game’s icon on the Home Screen.",
            "Tap <b>Remove App</b>.",
            "Tap <b>Delete App</b>, then <b>Delete</b>."
          ]
        },
        {
          kind: "paragraph",
          html: "Deleting the app removes all of its data from your iPhone."
        }
      ]
    },
    {
      id: "email",
      heading: "If you wrote to us",
      blocks: [
        {
          kind: "paragraph",
          html: "If you emailed us, we have your email address and your messages. To have them deleted:"
        },
        {
          kind: "steps",
          items: [
            "Write to {email:delete} from the address you used before.",
            "Use the subject “Delete my data”.",
            "We delete your messages within 30 days and send you a confirmation."
          ]
        }
      ]
    },
    {
      id: "kept",
      heading: "What is deleted and what is kept",
      blocks: [
        {
          kind: "list",
          items: [
            "Your game progress and settings. You delete them on your device.",
            "Your emails and email address. We delete them when you ask."
          ]
        }
      ]
    },
    {
      id: "questions",
      heading: "Questions",
      blocks: [
        {
          kind: "paragraph",
          html: 'Write to {email:delete}. How we handle data is explained in our <a href="{route:privacy}">Privacy Policy</a>.'
        }
      ]
    }
  ]
};
