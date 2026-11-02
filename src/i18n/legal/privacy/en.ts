/**
 * @file English «Privacy Policy», the approved prototype text.
 *
 * Slots the page fills (see `src/lib/legal.ts`): `{email:support}` becomes the support address link,
 * `{route:deleteData}` the URL of that page in the same locale. The owner's address is final, so
 * the text has no placeholders. A translation keeps every slot exactly as written here.
 */
import type { LegalDocument } from "../../types";

/** The English «Privacy Policy» document. */
export const privacyEn: LegalDocument = {
  intro:
    "This policy explains what happens to your information when you play Kitto games, visit kitto.studio or write to us. The short answer: our games keep everything on your device, and we do not collect personal data.",
  inShort: [
    "Our games save progress and settings only on your device.",
    "No accounts, no analytics, no advertising, no tracking.",
    "We do not collect or sell personal data.",
    "If you email us, we use your address only to reply."
  ],
  sections: [
    {
      id: "who",
      heading: "Who we are",
      blocks: [
        {
          kind: "paragraph",
          html: "Kitto Studio is a small family studio. We make puzzle games for phones. Kitto Studio is run by a private individual, Hanna Kucherenko, Calle Ventura Selva González 9, Bungalow 28, 03130 Gran Alacant, Santa Pola (Alicante), Spain. It is responsible for the information described in this policy. You can reach us at {email:support}."
        }
      ]
    },
    {
      id: "scope",
      heading: "What this policy covers",
      blocks: [
        { kind: "paragraph", html: "This policy applies to:" },
        {
          kind: "list",
          items: [
            'Our games. Their app IDs start with studio.kitto, for example <span translate="no">studio.kitto.memorymissing</span>. Our first game is A Memory Missing: Merge Game. It is not released yet.',
            "Our website, kitto.studio.",
            "Emails you send to {email:support}."
          ]
        }
      ]
    },
    {
      id: "games",
      heading: "Our games",
      blocks: [
        {
          kind: "paragraph",
          html: "Our games save your progress and settings only on your device. They do not send them to us or to anyone else."
        },
        {
          kind: "list",
          items: [
            "<strong>No accounts.</strong> You never sign up or log in.",
            "<strong>No analytics.</strong> We do not measure how you play.",
            "<strong>No advertising.</strong> Our games show no ads.",
            "<strong>No tracking.</strong> We do not follow you across apps or websites.",
            "<strong>No data-collecting SDKs.</strong> We do not use third-party SDKs that collect personal data."
          ]
        },
        {
          kind: "paragraph",
          html: "We do not collect personal data through our games, so we have none to sell or share."
        }
      ]
    },
    {
      id: "purchases",
      heading: "Purchases",
      blocks: [
        {
          kind: "paragraph",
          html: "If a game offers purchases, the Apple App Store or Google Play processes them under their own terms. We never receive your payment details."
        },
        {
          kind: "paragraph",
          html: 'To learn how Apple and Google handle your data, read the <a href="https://www.apple.com/legal/privacy/" rel="noopener">Apple Privacy Policy</a> and the <a href="https://policies.google.com/privacy" rel="noopener">Google Privacy Policy</a>.'
        }
      ]
    },
    {
      id: "email",
      heading: "When you write to us",
      blocks: [
        {
          kind: "paragraph",
          html: "If you email {email:support}, we receive your email address and your message. We use them only to reply to you."
        },
        {
          kind: "paragraph",
          html: "We keep them only as long as we need to help you. We delete them when you ask."
        }
      ]
    },
    {
      id: "website",
      heading: "Our website",
      blocks: [
        {
          kind: "paragraph",
          html: "kitto.studio is a static website. It uses no cookies and no analytics."
        },
        {
          kind: "paragraph",
          html: "It remembers your theme and language choice in your browser’s local storage. This stays in your browser, and we cannot see it. You can clear it at any time in your browser settings."
        },
        {
          kind: "paragraph",
          html: 'Our hosting provider, Cloudflare, may process technical data such as IP addresses in server logs, to keep the site secure and deliver it to you. Read the <a href="https://www.cloudflare.com/privacypolicy/" rel="noopener">Cloudflare Privacy Policy</a>.'
        }
      ]
    },
    {
      id: "children",
      heading: "Children",
      blocks: [
        {
          kind: "paragraph",
          html: "Our games are meant for players aged 13 and over. They are not directed at children under 13, and we do not knowingly collect personal data from children. In fact, our games collect no personal data from anyone."
        }
      ]
    },
    {
      id: "rights",
      heading: "Your rights",
      blocks: [
        {
          kind: "paragraph",
          html: "Depending on where you live, for example under the GDPR, the UK GDPR or the CCPA, you have the right to:"
        },
        {
          kind: "list",
          items: [
            "access the personal data we hold about you;",
            "correct it;",
            "have it deleted;",
            "object to how we use it;",
            "complain to a data protection supervisory authority."
          ]
        },
        {
          kind: "paragraph",
          html: 'In practice, the only personal data we might hold is an email you sent us. To use any of these rights, write to {email:support}. To delete your data, see <a href="{route:deleteData}">Delete your data</a>.'
        }
      ]
    },
    {
      id: "changes",
      heading: "Changes to this policy",
      blocks: [
        {
          kind: "paragraph",
          html: "If we change this policy, we update this page and the “Last updated” date at the top."
        }
      ]
    },
    {
      id: "contact",
      heading: "Contact",
      blocks: [{ kind: "paragraph", html: "Questions about privacy? Write to {email:support}." }]
    }
  ]
};
