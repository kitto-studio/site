/**
 * @file French «Conditions d’utilisation», translated from `en.ts`.
 *
 * Same sections, blocks, slots and tags as `en.ts`; only the words are translated. Spaces before
 * `; : ! ?` and inside « » are plain: `src/lib/typography.ts` makes them narrow no-break spaces.
 */
import type { LegalDocument } from "../../types";

/** The French «Terms of Use» document. */
export const termsFr: LegalDocument = {
  intro:
    "Les présentes conditions s’appliquent lorsque vous utilisez les jeux Kitto et le site web kitto.studio. En les utilisant, vous acceptez ces conditions. Elles sont courtes : prenez le temps de les lire.",
  inShort: [
    "Vous pouvez utiliser nos jeux et notre site à des fins personnelles et non commerciales.",
    "Les jeux et tout leur contenu appartiennent à Kitto Studio.",
    "Les achats passent par l’App Store ou Google Play, selon leurs conditions.",
    "Jouez franc-jeu et n’utilisez pas les jeux ou le site de manière abusive."
  ],
  sections: [
    {
      id: "who",
      heading: "Qui sommes-nous ?",
      blocks: [
        {
          kind: "paragraph",
          html: "Kitto Studio est un petit studio familial qui crée des jeux de réflexion pour téléphone. Kitto Studio est exploité par une personne physique, Hanna Kucherenko, Calle Ventura Selva González 9, Bungalow 28, 03130 Gran Alacant, Santa Pola (Alicante), Espagne. Les présentes conditions constituent un accord entre vous et nous. Vous pouvez nous contacter à l’adresse {email:support}."
        }
      ]
    },
    {
      id: "licence",
      heading: "Votre licence",
      blocks: [
        {
          kind: "paragraph",
          html: "Nous vous accordons une licence personnelle, non exclusive et non transférable pour télécharger et utiliser nos jeux et notre site web, pour votre usage personnel et non commercial."
        },
        {
          kind: "paragraph",
          html: "Vous ne pouvez pas les utiliser à des fins commerciales sans notre autorisation écrite."
        }
      ]
    },
    {
      id: "content",
      heading: "Notre contenu",
      blocks: [
        {
          kind: "paragraph",
          html: "Nos jeux, notre site web et tout leur contenu, y compris les illustrations, les personnages, la musique, les textes, le code ainsi que le nom et le logo Kitto, appartiennent à Kitto Studio. Ils sont protégés par les lois sur la propriété intellectuelle."
        },
        {
          kind: "paragraph",
          html: "Les présentes conditions ne vous confèrent aucun droit sur ces éléments au-delà de la licence ci-dessus."
        }
      ]
    },
    {
      id: "purchases",
      heading: "Achats",
      blocks: [
        {
          kind: "paragraph",
          html: "Si un jeu propose des achats, ils sont vendus et traités par l’App Store d’Apple ou par Google Play. Leurs conditions s’appliquent aux paiements et aux remboursements. Pour demander un remboursement, contactez la boutique où vous avez effectué l’achat."
        },
        { kind: "paragraph", html: "Nous ne recevons jamais vos informations de paiement." }
      ]
    },
    {
      id: "use",
      heading: "Utilisation acceptable",
      blocks: [
        {
          kind: "paragraph",
          html: "Lorsque vous utilisez nos jeux et notre site web, merci de ne pas :"
        },
        {
          kind: "list",
          items: [
            "copier, vendre, louer ou redistribuer nos jeux ou leur contenu ;",
            "procéder à l’ingénierie inverse des jeux, les décompiler ou les modifier, sauf lorsque la loi l’autorise ;",
            "utiliser des outils qui perturbent le fonctionnement des jeux ;",
            "utiliser nos jeux ou notre site web pour enfreindre la loi ou nuire à autrui ;",
            "tenter de perturber notre site web ou d’y accéder sans autorisation."
          ]
        }
      ]
    },
    {
      id: "as-is",
      heading: "Jeux fournis « en l’état »",
      blocks: [
        {
          kind: "paragraph",
          html: "Nous créons nos jeux avec soin. Dans la mesure permise par la loi, nous les fournissons « en l’état » et « selon leur disponibilité ». Nous ne garantissons pas qu’ils seront exempts d’erreurs ni toujours disponibles."
        },
        {
          kind: "paragraph",
          html: "Rien dans les présentes conditions ne limite les droits dont vous disposez en tant que consommateur et que la loi ne permet pas de limiter."
        }
      ]
    },
    {
      id: "liability",
      heading: "Limitation de responsabilité",
      blocks: [
        {
          kind: "paragraph",
          html: "Dans la mesure permise par la loi, Kitto Studio n’est pas responsable des dommages indirects ou consécutifs résultant de votre utilisation de nos jeux ou de notre site web."
        },
        {
          kind: "paragraph",
          html: "Votre progression est enregistrée uniquement sur votre appareil. Si vous supprimez un jeu ou effacez ses données, votre progression est perdue, et nous ne pouvons pas la restaurer."
        },
        {
          kind: "paragraph",
          html: "Rien dans les présentes conditions n’exclut une responsabilité qui ne peut pas être exclue par la loi."
        }
      ]
    },
    {
      id: "law",
      heading: "Droit applicable",
      blocks: [
        { kind: "paragraph", html: "Les présentes conditions sont régies par le droit espagnol." },
        {
          kind: "paragraph",
          html: "Si vous êtes un consommateur, vous conservez en outre la protection que vous accordent les dispositions impératives de la loi du pays où vous résidez."
        }
      ]
    },
    {
      id: "privacy",
      heading: "Confidentialité",
      blocks: [
        {
          kind: "paragraph",
          html: 'La manière dont nous traitons les informations est expliquée dans notre <a href="{route:privacy}">Politique de confidentialité</a>. En bref : nos jeux conservent tout sur votre appareil, et nous ne collectons aucune donnée personnelle.'
        }
      ]
    },
    {
      id: "changes",
      heading: "Modifications des présentes conditions",
      blocks: [
        {
          kind: "paragraph",
          html: "Nous pouvons mettre à jour ces conditions. Dans ce cas, nous mettons à jour cette page ainsi que la date de « Dernière mise à jour » indiquée en haut. Si vous continuez à utiliser nos jeux après une modification, les conditions mises à jour s’appliquent."
        }
      ]
    },
    {
      id: "contact",
      heading: "Contact",
      blocks: [
        {
          kind: "paragraph",
          html: "Des questions sur ces conditions ? Écrivez à {email:support}."
        }
      ]
    }
  ]
};
