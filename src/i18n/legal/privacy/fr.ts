/**
 * @file French «Politique de confidentialité», translated from `en.ts`.
 *
 * Same sections, blocks, slots and tags as `en.ts`; only the words are translated. Spaces before
 * `; : ! ?` and inside « » are plain: `src/lib/typography.ts` makes them narrow no-break spaces.
 */
import type { LegalDocument } from "../../types";

/** The French «Privacy Policy» document. */
export const privacyFr: LegalDocument = {
  intro:
    "Cette politique explique ce que deviennent vos informations lorsque vous jouez aux jeux Kitto, visitez kitto.studio ou nous écrivez. En bref : nos jeux conservent tout sur votre appareil, et nous ne collectons aucune donnée personnelle.",
  inShort: [
    "Nos jeux enregistrent la progression et les réglages uniquement sur votre appareil.",
    "Pas de compte, pas de mesure d’audience, pas de publicité, pas de suivi.",
    "Nous ne collectons ni ne vendons de données personnelles.",
    "Si vous nous écrivez, nous utilisons votre adresse uniquement pour vous répondre."
  ],
  sections: [
    {
      id: "who",
      heading: "Qui sommes-nous ?",
      blocks: [
        {
          kind: "paragraph",
          html: "Kitto Studio est un petit studio familial. Nous créons des jeux de réflexion pour téléphone. Kitto Studio est exploité par une personne physique, Hanna Kucherenko, Calle Ventura Selva González 9, Bungalow 28, 03130 Gran Alacant, Santa Pola (Alicante), Espagne, qui est responsable du traitement des informations décrites dans la présente politique. Vous pouvez nous contacter à l’adresse {email:support}."
        }
      ]
    },
    {
      id: "scope",
      heading: "Ce que couvre cette politique",
      blocks: [
        { kind: "paragraph", html: "Cette politique couvre :" },
        {
          kind: "list",
          items: [
            'Nos jeux. Leurs identifiants d’application commencent par studio.kitto, par exemple <span translate="no">studio.kitto.memorymissing</span>. Notre premier jeu est A Memory Missing: Merge Game. Il n’est pas encore sorti.',
            "Notre site web, kitto.studio.",
            "Les e-mails que vous envoyez à {email:support}."
          ]
        }
      ]
    },
    {
      id: "games",
      heading: "Nos jeux",
      blocks: [
        {
          kind: "paragraph",
          html: "Nos jeux enregistrent votre progression et vos réglages uniquement sur votre appareil. Ils ne les envoient ni à nous ni à personne d’autre."
        },
        {
          kind: "list",
          items: [
            "<strong>Pas de compte.</strong> Vous n’avez jamais à vous inscrire ni à vous connecter.",
            "<strong>Pas de mesure d’audience.</strong> Nous ne mesurons pas votre façon de jouer.",
            "<strong>Pas de publicité.</strong> Nos jeux n’affichent aucune publicité.",
            "<strong>Pas de suivi.</strong> Nous ne vous suivons pas d’une application ou d’un site web à l’autre.",
            "<strong>Pas de SDK de collecte de données.</strong> Nous n’utilisons aucun SDK tiers qui collecte des données personnelles."
          ]
        },
        {
          kind: "paragraph",
          html: "Nous ne collectons aucune donnée personnelle par l’intermédiaire de nos jeux : nous n’en avons donc aucune à vendre ou à partager."
        }
      ]
    },
    {
      id: "purchases",
      heading: "Achats",
      blocks: [
        {
          kind: "paragraph",
          html: "Si un jeu propose des achats, ils sont traités par l’App Store d’Apple ou par Google Play, selon leurs propres conditions. Nous ne recevons jamais vos informations de paiement."
        },
        {
          kind: "paragraph",
          html: 'Pour savoir comment Apple et Google traitent vos données, consultez la <a href="https://www.apple.com/legal/privacy/" rel="noopener">Politique de confidentialité d’Apple</a> et les <a href="https://policies.google.com/privacy" rel="noopener">Règles de confidentialité de Google</a>.'
        }
      ]
    },
    {
      id: "email",
      heading: "Lorsque vous nous écrivez",
      blocks: [
        {
          kind: "paragraph",
          html: "Si vous écrivez à {email:support}, nous recevons votre adresse e-mail et votre message. Nous les utilisons uniquement pour vous répondre."
        },
        {
          kind: "paragraph",
          html: "Nous les conservons seulement le temps nécessaire pour vous aider. Nous les supprimons à votre demande."
        }
      ]
    },
    {
      id: "website",
      heading: "Notre site web",
      blocks: [
        {
          kind: "paragraph",
          html: "kitto.studio est un site web statique. Il n’utilise ni cookies ni outils de mesure d’audience."
        },
        {
          kind: "paragraph",
          html: "Il mémorise votre choix de thème et de langue dans le stockage local de votre navigateur. Ces informations restent dans votre navigateur, et nous ne pouvons pas les voir. Vous pouvez les effacer à tout moment dans les réglages de votre navigateur."
        },
        {
          kind: "paragraph",
          html: 'Notre hébergeur, Cloudflare, peut traiter des données techniques, comme les adresses IP, dans les journaux du serveur, afin d’assurer la sécurité du site et de vous le fournir. Consultez la <a href="https://www.cloudflare.com/privacypolicy/" rel="noopener">Politique de confidentialité de Cloudflare</a>.'
        }
      ]
    },
    {
      id: "children",
      heading: "Enfants",
      blocks: [
        {
          kind: "paragraph",
          html: "Nos jeux sont destinés aux joueurs âgés de 13 ans et plus. Ils ne s’adressent pas aux enfants de moins de 13 ans, et nous ne collectons pas sciemment de données personnelles auprès d’enfants. En réalité, nos jeux ne collectent de données personnelles auprès de personne."
        }
      ]
    },
    {
      id: "rights",
      heading: "Vos droits",
      blocks: [
        {
          kind: "paragraph",
          html: "Selon l’endroit où vous vivez, par exemple en vertu du RGPD, du RGPD britannique (UK GDPR) ou du CCPA, vous avez le droit :"
        },
        {
          kind: "list",
          items: [
            "d’accéder aux données personnelles que nous détenons à votre sujet ;",
            "de les faire rectifier ;",
            "de les faire effacer ;",
            "de vous opposer à la manière dont nous les utilisons ;",
            "d’introduire une réclamation auprès d’une autorité de contrôle de la protection des données."
          ]
        },
        {
          kind: "paragraph",
          html: 'En pratique, les seules données personnelles que nous pourrions détenir sont celles d’un e-mail que vous nous avez envoyé. Pour exercer l’un de ces droits, écrivez à {email:support}. Pour supprimer vos données, consultez la page <a href="{route:deleteData}">Supprimer vos données</a>.'
        }
      ]
    },
    {
      id: "changes",
      heading: "Modifications de cette politique",
      blocks: [
        {
          kind: "paragraph",
          html: "Si nous modifions cette politique, nous mettons à jour cette page ainsi que la date de « Dernière mise à jour » indiquée en haut."
        }
      ]
    },
    {
      id: "contact",
      heading: "Contact",
      blocks: [
        {
          kind: "paragraph",
          html: "Des questions sur la confidentialité ? Écrivez à {email:support}."
        }
      ]
    }
  ]
};
