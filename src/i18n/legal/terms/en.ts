/**
 * @file English «Terms of Use», the approved prototype text.
 *
 * Slots the page fills (see `src/lib/legal.ts`): `{email:support}` becomes the support address link,
 * `{route:privacy}` the URL of that page in the same locale. The owner's address and the governing
 * law (Spain) are final, so the text has no placeholders. A translation keeps every slot exactly as
 * written here.
 */
import type { LegalDocument } from "../../types";

/** The English «Terms of Use» document. */
export const termsEn: LegalDocument = {
  intro:
    "These terms apply when you use Kitto games and the website kitto.studio. By using them, you agree to these terms. They are short, so please read them.",
  inShort: [
    "You may use our games and site for personal, non-commercial use.",
    "The games and everything in them belong to Kitto Studio.",
    "Purchases go through the App Store or Google Play, under their terms.",
    "Play fair and do not misuse the games or the site."
  ],
  sections: [
    {
      id: "who",
      heading: "Who we are",
      blocks: [
        {
          kind: "paragraph",
          html: "Kitto Studio is a small family studio that makes puzzle games for phones. Kitto Studio is run by a private individual, Hanna Kucherenko, Calle Ventura Selva González 9, Bungalow 28, 03130 Gran Alacant, Santa Pola (Alicante), Spain. These terms are an agreement between you and us. You can reach us at {email:support}."
        }
      ]
    },
    {
      id: "licence",
      heading: "Your licence",
      blocks: [
        {
          kind: "paragraph",
          html: "We give you a personal, non-exclusive and non-transferable licence to download and use our games and our website for your personal, non-commercial use."
        },
        {
          kind: "paragraph",
          html: "You may not use them for any commercial purpose without our written permission."
        }
      ]
    },
    {
      id: "content",
      heading: "Our content",
      blocks: [
        {
          kind: "paragraph",
          html: "Our games, our website and everything in them, including artwork, characters, music, text, code and the Kitto name and logo, belong to Kitto Studio. They are protected by intellectual property laws."
        },
        {
          kind: "paragraph",
          html: "These terms do not give you any rights to them beyond the licence above."
        }
      ]
    },
    {
      id: "purchases",
      heading: "Purchases",
      blocks: [
        {
          kind: "paragraph",
          html: "If a game offers purchases, they are sold and processed by the Apple App Store or Google Play. Their terms apply to payments and refunds. To ask for a refund, contact the store where you made the purchase."
        },
        { kind: "paragraph", html: "We never receive your payment details." }
      ]
    },
    {
      id: "use",
      heading: "Acceptable use",
      blocks: [
        {
          kind: "paragraph",
          html: "When you use our games and website, please do not:"
        },
        {
          kind: "list",
          items: [
            "copy, sell, rent or redistribute our games or their content;",
            "reverse engineer, decompile or modify the games, except where the law allows it;",
            "use tools that interfere with how the games work;",
            "use our games or website to break the law or to harm others;",
            "try to disrupt our website or gain unauthorised access to it."
          ]
        }
      ]
    },
    {
      id: "as-is",
      heading: "Games “as is”",
      blocks: [
        {
          kind: "paragraph",
          html: "We make our games with care. To the extent the law allows, we provide them “as is” and “as available”. We do not promise that they will be free of errors or always available."
        },
        {
          kind: "paragraph",
          html: "Nothing in these terms limits your rights as a consumer that cannot be limited by law."
        }
      ]
    },
    {
      id: "liability",
      heading: "Limitation of liability",
      blocks: [
        {
          kind: "paragraph",
          html: "To the extent the law allows, Kitto Studio is not liable for indirect or consequential losses arising from your use of our games or website."
        },
        {
          kind: "paragraph",
          html: "Your progress is saved only on your device. If you delete a game or clear its data, your progress is gone, and we cannot restore it."
        },
        {
          kind: "paragraph",
          html: "Nothing in these terms excludes liability that cannot be excluded by law."
        }
      ]
    },
    {
      id: "law",
      heading: "Governing law",
      blocks: [
        { kind: "paragraph", html: "These terms are governed by the laws of Spain." },
        {
          kind: "paragraph",
          html: "If you are a consumer, you also keep the protection of the mandatory laws of the country where you live."
        }
      ]
    },
    {
      id: "privacy",
      heading: "Privacy",
      blocks: [
        {
          kind: "paragraph",
          html: 'How we handle information is explained in our <a href="{route:privacy}">Privacy Policy</a>. In short: our games keep everything on your device, and we do not collect personal data.'
        }
      ]
    },
    {
      id: "changes",
      heading: "Changes to these terms",
      blocks: [
        {
          kind: "paragraph",
          html: "We may update these terms. When we do, we update this page and the “Last updated” date at the top. If you keep using our games after a change, the updated terms apply."
        }
      ]
    },
    {
      id: "contact",
      heading: "Contact",
      blocks: [
        { kind: "paragraph", html: "Questions about these terms? Write to {email:support}." }
      ]
    }
  ]
};
