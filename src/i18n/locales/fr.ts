/** @file French UI strings, from the prototype draft copy reviewed against `en.ts`; the rest translated by hand. */
import type { UIStrings } from "../types";

/** French strings. */
export const fr: UIStrings = {
  meta: {
    root: {
      title: "Choisissez votre langue",
      description:
        "Kitto Studio est un petit studio familial. Nous créons des jeux de réflexion pour téléphone."
    },
    home: {
      title: "Ça vaut sûrement le coup d’y jouer.",
      description:
        "Nous sommes Kitto Studio, un petit studio familial. Nous créons des jeux de réflexion pour téléphone."
    },
    about: {
      title: "À propos",
      description:
        "Kitto Studio, c’est Alex et Hanna. Nous créons des jeux de réflexion pour téléphone, ensemble et à notre rythme."
    },
    games: {
      title: "Jeux",
      description:
        "Nous créons des jeux de réflexion pour téléphone. Voici ce sur quoi nous travaillons en ce moment."
    },
    memoryMissing: {
      title: "A Memory Missing: Merge Game",
      description:
        "Un jeune homme se réveille à l’hôpital et ne se souvient de rien. Un détective l’attend déjà à son chevet."
    },
    support: {
      title: "Assistance",
      description:
        "Une seule adresse pour tout : questions, problèmes dans un jeu, idées et demandes concernant vos données. Nous lisons chaque message."
    },
    privacy: {
      title: "Politique de confidentialité",
      description:
        "Les jeux de Kitto Studio conservent votre progression sur votre appareil. Pas de compte, pas de mesure d’audience, pas de publicité, pas de suivi."
    },
    terms: {
      title: "Conditions d’utilisation",
      description: "Les conditions d’utilisation des jeux de Kitto Studio et du site kitto.studio."
    },
    deleteData: {
      title: "Supprimer vos données",
      description:
        "Comment supprimer vos données des jeux de Kitto Studio : pas de compte, rien sur nos serveurs, effacez-les sur votre appareil."
    },
    notFound: {
      title: "Page introuvable",
      description: "Cette page n’existe pas ou a été déplacée."
    }
  },
  chrome: {
    skip: "Aller au contenu",
    homeLabel: "Kitto Studio, accueil",
    navLabel: "Menu principal",
    nav: { games: "Jeux", about: "À propos", support: "Assistance" },
    footer: {
      label: "Informations juridiques et assistance",
      privacy: "Politique de confidentialité",
      terms: "Conditions d’utilisation",
      deleteData: "Supprimer vos données",
      support: "Assistance",
      copyright: "© 2026 Kitto Studio"
    },
    theme: { label: "Thème", system: "Système", light: "Clair", dark: "Sombre" },
    language: { label: "Langue" },
    menu: { open: "Menu", close: "Fermer" }
  },
  root: {
    heading: "Choisissez votre langue"
  },
  home: {
    hero: {
      title: "Ça vaut sûrement le coup d’y jouer.",
      lead: "Nous sommes Kitto Studio, un petit studio familial. Nous créons des jeux de réflexion pour téléphone."
    },
    games: {
      title: "Nos jeux",
      lead: "Notre premier jeu est en développement. D’autres suivront.",
      comingSoon: "Bientôt",
      slot: "Nouveau jeu",
      genre: "Un jeu d’enquête où l’on assemble les indices",
      platforms: "Sur iPhone et Android"
    },
    about: {
      title: "Qui sommes-nous ?",
      text: "Kitto Studio, c’est Alex et Hanna. Nous faisons chaque jeu ensemble, à notre rythme.",
      kitto: "きっと (kitto) signifie « sûrement » en japonais.",
      more: "En savoir plus sur le studio"
    },
    support: {
      title: "Besoin d’aide ?",
      text: "Écrivez-nous à {email}. Nous lisons chaque message.",
      cta: "Nous écrire"
    }
  },
  about: {
    title: "Un petit studio familial",
    lead: "Kitto Studio, c’est Alex et Hanna. Nous créons des jeux de réflexion pour téléphone, ensemble et à notre rythme.",
    who: {
      title: "Qui sommes-nous ?",
      first:
        "Nous sommes deux. Nous formons une famille, et le studio est le travail que nous partageons.",
      second:
        "Chaque jeu commence à notre table. Nous l’imaginons ensemble, nous le construisons et nous y jouons de nombreuses fois avant que quiconque le voie.",
      dioramaAlt:
        "Une petite pièce de studio en papier : deux bureaux face à face, deux ordinateurs portables et deux tasses de thé."
    },
    name: {
      title: "Pourquoi le nom Kitto ?",
      first:
        "En japonais, きっと (kitto) signifie « sûrement ». On le dit quand on croit qu’une chose va arriver : ça va sûrement s’arranger.",
      second:
        "Nous aimons cette confiance tranquille. Un jeu demande beaucoup de temps. Nous croyons que chacun arrivera sûrement au bout.",
      kana: "きっと",
      reading: "kitto"
    },
    how: {
      title: "Notre façon de travailler",
      small: {
        title: "Petits, par choix",
        text: "Nous ne sommes que deux, alors chaque détail passe entre nos mains."
      },
      care: {
        title: "Du soin pour chaque énigme",
        text: "Nous testons chaque énigme jusqu’à ce qu’elle soit juste et claire. Si elle n’est pas encore prête, elle attend."
      },
      pace: {
        title: "À notre rythme",
        text: "Nous ne nous pressons pas. Un jeu sort quand il est bon, pas quand le calendrier le dit."
      }
    },
    hello: {
      title: "Dites-nous bonjour",
      text: "Une question, une idée ou juste un mot gentil : écrivez à {email}. Nous lisons chaque message.",
      support: "Besoin d’aide avec un jeu ? Consultez la page {link}.",
      supportLink: "Assistance"
    }
  },
  games: {
    title: "Nos jeux",
    lead: "Nous créons des jeux de réflexion pour téléphone. Voici ce sur quoi nous travaillons en ce moment.",
    card: {
      genre: "Un jeu d’enquête et de fusion",
      teaser:
        "Un jeune homme se réveille à l’hôpital et ne se souvient de rien. Un détective l’attend déjà à son chevet.",
      status: "Bientôt sur iPhone et Android",
      cta: "Découvrir le jeu"
    },
    slot: {
      name: "Nouveau jeu",
      soon: "Bientôt",
      note: "D’autres jeux apparaîtront ici quand ils seront prêts."
    },
    help: "Des questions sur nos jeux ? Consultez la page {link}.",
    helpLink: "Assistance"
  },
  game: {
    name: "A Memory Missing: Merge Game",
    breadcrumb: { label: "Fil d’Ariane", games: "Jeux" },
    tags: { genre: "Jeu d’enquête et de fusion", status: "Bientôt sur iPhone et Android" },
    gallery: {
      title: "Captures et illustrations",
      wardLabel: "Illustration principale",
      wardAlt:
        "Illustration principale : une chambre d’hôpital la nuit. Un jeune homme dort dans son lit pendant qu’un détective et une femme discutent à côté de lui.",
      splashLabel: "Écran de chargement",
      splashAlt:
        "L’écran de chargement du jeu : le jeune homme dort dans un lit d’hôpital, vu dans un cadre rond. En dessous, le titre du jeu et une barre de chargement pleine.",
      previous: "Image précédente",
      next: "Image suivante",
      open: "Ouvrir en plein écran",
      show: "Afficher l’image {n} sur {total} : {label}",
      count: "{n} sur {total}",
      viewer: "Visionneuse d’images",
      close: "Fermer"
    },
    story: {
      title: "L’histoire",
      premise:
        "Un jeune homme se réveille à l’hôpital et ne se souvient de rien. Un détective l’attend déjà à son chevet. Fusionnez des indices, retrouvez morceau par morceau les souvenirs perdus et découvrez ce qui s’est passé la nuit qu’il a oubliée."
    },
    platforms: {
      title: "Où jouer",
      iphone: "iPhone",
      android: "Android",
      soon: "Bientôt",
      note: "Pas encore de date de sortie. Nous ajouterons ici les liens vers les boutiques à la sortie du jeu."
    },
    features: {
      title: "Dans le jeu",
      merge: {
        title: "Fusionnez pour trouver des indices",
        text: "Combinez des objets sur le plateau. Les petites choses deviennent des indices."
      },
      memories: {
        title: "Des souvenirs, morceau par morceau",
        text: "Chaque indice fait revenir une partie de la nuit qu’il a oubliée."
      },
      solve: {
        title: "Une histoire à élucider",
        text: "Rassemblez les pièces et découvrez ce qui s’est vraiment passé."
      },
      offline: {
        title: "Jouable hors ligne",
        text: "Aucune connexion nécessaire. Votre progression est enregistrée sur votre appareil."
      }
    },
    help: {
      title: "Aide et confidentialité",
      text: "Des questions ou un problème avec le jeu ? Écrivez-nous depuis la {supportLink}. La façon dont le jeu traite vos données est expliquée dans la {privacyLink}.",
      supportLink: "page d’assistance",
      privacyLink: "Politique de confidentialité"
    },
    board: {
      title: "Fusionnez quelques indices",
      lead: "Faites glisser un objet sur son double pour les fusionner, et terminez les trois chaînes pour faire revenir un souvenir.",
      hint: "Ou touchez un objet, puis son double.",
      hintMouse: "Ou cliquez sur un objet, puis sur son double.",
      keys: "Les flèches permettent de passer d’une case à l’autre. Entrée ou Espace prend un objet et le pose. Échap le remet à sa place.",
      caseTitle: "Indices à trouver",
      progress: "Indices trouvés : {n} sur 3",
      newBoard: "Nouveau plateau",
      empty: "Case vide",
      picked: "Objet pris : {item}. Choisissez son double ou une case vide.",
      merged: "Nouvel objet : {item}.",
      found: "Indice trouvé : {item}.",
      missing: "{item} : reste à trouver",
      winTitle: "Un souvenir est revenu.",
      winText: "Un morceau de la nuit qu’il a oubliée. La suite est dans le jeu.",
      again: "Rejouer"
    },
    items: {
      note1: "Bout de papier déchiré",
      note2: "Note pliée",
      note3: "Lettre cachetée",
      key1: "Vieille clé",
      key2: "Trousseau de clés",
      key3: "Coffret verrouillé",
      photo1: "Coin de photo",
      photo2: "Moitié de photo",
      photo3: "Photo encadrée",
      memory: "Souvenir"
    }
  },
  support: {
    title: "Besoin d’aide ? Écrivez-nous.",
    lead: "Une seule adresse pour tout : questions, problèmes dans un jeu, idées et demandes concernant vos données. Nous lisons chaque message.",
    mail: {
      title: "Notre adresse e-mail",
      write: "Écrire un e-mail",
      copy: "Copier l’adresse",
      copied: "Copiée",
      copiedNote: "L’adresse est dans votre presse-papiers.",
      copyFail: "Sélectionnez l’adresse ci-dessus et copiez-la."
    },
    letter: {
      title: "Que mettre dans votre message",
      lead: "Quelques détails nous aident à trouver le problème plus vite.",
      game: "Le nom du jeu",
      device: "Le modèle de votre téléphone ou de votre tablette",
      os: "La version d’iOS ou d’Android (dans les réglages de l’appareil)",
      what: "Ce qui s’est passé et ce à quoi vous vous attendiez. Une capture d’écran aide beaucoup."
    },
    faq: {
      title: "Questions fréquentes",
      progressQuestion: "Où ma progression est-elle enregistrée ?",
      progressAnswer:
        "Sur votre appareil. Votre progression reste sur le téléphone ou la tablette où vous jouez. Si vous supprimez le jeu, votre progression est supprimée avec lui.",
      deleteQuestion: "Comment supprimer mes données ?",
      deleteAnswer:
        "Suivez les étapes de la page {link}. Vous pouvez aussi nous écrire, nous vous aiderons.",
      deleteLink: "Supprimer vos données",
      privacyQuestion: "Comment protégez-vous ma vie privée ?",
      privacyAnswer: "Notre {link} explique quelles données nos jeux utilisent et pourquoi.",
      privacyLink: "Politique de confidentialité"
    }
  },
  legal: {
    titles: {
      privacy: "Politique de confidentialité",
      terms: "Conditions d’utilisation",
      deleteData: "Supprimer vos données"
    },
    contents: "Sommaire",
    inShort: "En bref",
    updated: "Dernière mise à jour : {date}",
    draft: "Brouillon. Les champs surlignés, comme {placeholder}, ne sont pas encore remplis.",
    fallback: "Cette page est disponible en anglais."
  },
  deleteData: {
    facts: {
      developer: "Développeur",
      apps: "Applications",
      appsValue: "A Memory Missing: Merge Game et les futurs jeux Kitto",
      ids: "Identifiants des apps"
    },
    cta: "Demander la suppression",
    mailSubject: "Delete my data",
    deleted: "Supprimé",
    kept: "Conservé",
    nothing: "Rien.",
    nothingNote: "Après la suppression, nous ne conservons aucune de vos données."
  },
  notFound: {
    title: "Page introuvable",
    text: "Cette page n’existe pas ou a été déplacée.",
    home: "Aller à l’accueil"
  }
};
