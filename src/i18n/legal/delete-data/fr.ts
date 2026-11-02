/**
 * @file French «Supprimer vos données», translated from `en.ts`.
 *
 * Same sections, blocks, slots and tags as `en.ts`; only the words are translated. Menu labels are
 * the ones Android and iOS show in French. The mail subject stays «Delete my data», the same as
 * `deleteData.mailSubject` in `locales/fr.ts`.
 */
import type { LegalDocument } from "../../types";

/** The French «Delete your data» document. */
export const deleteDataFr: LegalDocument = {
  intro: "Cette page explique comment supprimer vos données des jeux créés par Kitto Studio.",
  inShort: [
    "Il n’y a pas de compte, donc aucun compte à supprimer.",
    "Nous ne conservons aucune donnée de jeu sur nos serveurs.",
    "Les données de jeu se trouvent uniquement sur votre appareil. Vous pouvez les supprimer vous-même en quelques gestes.",
    "Si vous nous avez écrit, nous supprimons vos e-mails dans les 30 jours suivant votre demande."
  ],
  sections: [
    {
      id: "nothing",
      heading: "Pas de compte, rien sur nos serveurs",
      blocks: [
        {
          kind: "paragraph",
          html: "Nos jeux n’ont pas de compte et ne nous envoient aucune donnée. Votre progression et vos réglages sont enregistrés uniquement sur votre appareil."
        },
        {
          kind: "paragraph",
          html: "Il n’y a donc rien à supprimer de notre côté. Vous gardez le contrôle total de vos données de jeu."
        }
      ]
    },
    {
      id: "android",
      heading: "Supprimer les données du jeu sur Android",
      blocks: [
        {
          kind: "steps",
          items: [
            "Ouvrez les <b>Paramètres</b> de votre téléphone.",
            "Appuyez sur <b>Applications</b>.",
            "Recherchez le jeu et appuyez dessus, par exemple <b>A Memory Missing: Merge Game</b>.",
            "Appuyez sur <b>Stockage</b>.",
            "Appuyez sur <b>Vider l’espace de stockage</b>."
          ]
        },
        {
          kind: "paragraph",
          html: "Vous pouvez aussi désinstaller le jeu : toutes ses données sont alors supprimées de votre téléphone. Le nom des menus peut varier légèrement d’un téléphone à l’autre."
        }
      ]
    },
    {
      id: "iphone",
      heading: "Supprimer les données du jeu sur iPhone",
      blocks: [
        {
          kind: "steps",
          items: [
            "Maintenez le doigt sur l’icône du jeu sur l’écran d’accueil.",
            "Touchez <b>Supprimer l’app</b>.",
            "Dans la fenêtre qui s’affiche, touchez <b>Supprimer l’app</b>, puis <b>Supprimer</b>."
          ]
        },
        {
          kind: "paragraph",
          html: "Supprimer l’app efface toutes ses données de votre iPhone."
        }
      ]
    },
    {
      id: "email",
      heading: "Si vous nous avez écrit",
      blocks: [
        {
          kind: "paragraph",
          html: "Si vous nous avez envoyé un e-mail, nous disposons de votre adresse e-mail et de vos messages. Pour les faire supprimer :"
        },
        {
          kind: "steps",
          items: [
            "Écrivez à {email:delete} depuis l’adresse que vous aviez utilisée.",
            "Indiquez l’objet « Delete my data ».",
            "Nous supprimons vos messages dans un délai de 30 jours et vous envoyons une confirmation."
          ]
        }
      ]
    },
    {
      id: "kept",
      heading: "Ce qui est supprimé et ce qui est conservé",
      blocks: [
        {
          kind: "list",
          items: [
            "Votre progression et vos réglages de jeu. Vous les supprimez sur votre appareil.",
            "Vos e-mails et votre adresse e-mail. Nous les supprimons à votre demande."
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
          html: 'Écrivez à {email:delete}. La manière dont nous traitons les données est expliquée dans notre <a href="{route:privacy}">Politique de confidentialité</a>.'
        }
      ]
    }
  ]
};
