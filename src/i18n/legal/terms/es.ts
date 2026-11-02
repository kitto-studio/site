/**
 * @file Spanish (Spain) «Condiciones de uso», translated from `en.ts`.
 *
 * Same sections, blocks, slots and tags as `en.ts`; only the words are translated.
 */
import type { LegalDocument } from "../../types";

/** The Spanish «Terms of Use» document. */
export const termsEs: LegalDocument = {
  intro:
    "Estas condiciones se aplican cuando usas los juegos de Kitto y el sitio web kitto.studio. Al usarlos, aceptas estas condiciones. Son breves, así que te pedimos que las leas.",
  inShort: [
    "Puedes usar nuestros juegos y nuestro sitio para uso personal y no comercial.",
    "Los juegos y todo lo que contienen pertenecen a Kitto Studio.",
    "Las compras se hacen a través del App Store o Google Play, según sus condiciones.",
    "Juega limpio y no hagas un mal uso de los juegos ni del sitio."
  ],
  sections: [
    {
      id: "who",
      heading: "Quiénes somos",
      blocks: [
        {
          kind: "paragraph",
          html: "Kitto Studio es un pequeño estudio familiar que hace juegos de puzles para móviles. Kitto Studio está gestionado por una persona física, Hanna Kucherenko, Calle Ventura Selva González 9, Bungalow 28, 03130 Gran Alacant, Santa Pola (Alicante), España. Estas condiciones son un acuerdo entre tú y nosotros. Puedes contactar con nosotros en {email:support}."
        }
      ]
    },
    {
      id: "licence",
      heading: "Tu licencia",
      blocks: [
        {
          kind: "paragraph",
          html: "Te concedemos una licencia personal, no exclusiva e intransferible para descargar y usar nuestros juegos y nuestro sitio web para tu uso personal y no comercial."
        },
        {
          kind: "paragraph",
          html: "No puedes usarlos con fines comerciales sin nuestro permiso por escrito."
        }
      ]
    },
    {
      id: "content",
      heading: "Nuestro contenido",
      blocks: [
        {
          kind: "paragraph",
          html: "Nuestros juegos, nuestro sitio web y todo lo que contienen, incluidas las ilustraciones, los personajes, la música, los textos, el código y el nombre y el logotipo de Kitto, pertenecen a Kitto Studio. Están protegidos por las leyes de propiedad intelectual."
        },
        {
          kind: "paragraph",
          html: "Estas condiciones no te otorgan ningún derecho sobre ellos más allá de la licencia anterior."
        }
      ]
    },
    {
      id: "purchases",
      heading: "Compras",
      blocks: [
        {
          kind: "paragraph",
          html: "Si un juego ofrece compras, las vende y las procesa el App Store de Apple o Google Play. Sus condiciones se aplican a los pagos y reembolsos. Para pedir un reembolso, ponte en contacto con la tienda donde hiciste la compra."
        },
        { kind: "paragraph", html: "Nunca recibimos tus datos de pago." }
      ]
    },
    {
      id: "use",
      heading: "Uso aceptable",
      blocks: [
        {
          kind: "paragraph",
          html: "Cuando uses nuestros juegos y nuestro sitio web, te pedimos que no:"
        },
        {
          kind: "list",
          items: [
            "copies, vendas, alquiles ni redistribuyas nuestros juegos o su contenido;",
            "apliques ingeniería inversa, descompiles ni modifiques los juegos, salvo cuando la ley lo permita;",
            "uses herramientas que interfieran en el funcionamiento de los juegos;",
            "uses nuestros juegos o nuestro sitio web para infringir la ley o perjudicar a otras personas;",
            "intentes alterar el funcionamiento de nuestro sitio web ni acceder a él sin autorización."
          ]
        }
      ]
    },
    {
      id: "as-is",
      heading: "Juegos «tal cual»",
      blocks: [
        {
          kind: "paragraph",
          html: "Hacemos nuestros juegos con cuidado. En la medida en que la ley lo permita, los ofrecemos «tal cual» y «según disponibilidad». No garantizamos que estén libres de errores ni que estén siempre disponibles."
        },
        {
          kind: "paragraph",
          html: "Nada de lo dispuesto en estas condiciones limita los derechos que te corresponden como consumidor y que la ley no permite limitar."
        }
      ]
    },
    {
      id: "liability",
      heading: "Limitación de responsabilidad",
      blocks: [
        {
          kind: "paragraph",
          html: "En la medida en que la ley lo permita, Kitto Studio no será responsable de los daños indirectos o consecuentes derivados del uso de nuestros juegos o de nuestro sitio web."
        },
        {
          kind: "paragraph",
          html: "Tu progreso se guarda solo en tu dispositivo. Si eliminas un juego o borras sus datos, tu progreso se pierde y no podemos recuperarlo."
        },
        {
          kind: "paragraph",
          html: "Nada de lo dispuesto en estas condiciones excluye la responsabilidad que la ley no permite excluir."
        }
      ]
    },
    {
      id: "law",
      heading: "Legislación aplicable",
      blocks: [
        { kind: "paragraph", html: "Estas condiciones se rigen por las leyes de España." },
        {
          kind: "paragraph",
          html: "Si eres consumidor, conservas además la protección que te otorgan las normas imperativas del país en el que resides."
        }
      ]
    },
    {
      id: "privacy",
      heading: "Privacidad",
      blocks: [
        {
          kind: "paragraph",
          html: 'Cómo tratamos la información se explica en nuestra <a href="{route:privacy}">Política de privacidad</a>. En pocas palabras: nuestros juegos guardan todo en tu dispositivo y no recopilamos datos personales.'
        }
      ]
    },
    {
      id: "changes",
      heading: "Cambios en estas condiciones",
      blocks: [
        {
          kind: "paragraph",
          html: "Podemos actualizar estas condiciones. Cuando lo hagamos, actualizaremos esta página y la fecha de «Última actualización» que aparece arriba. Si sigues usando nuestros juegos después de un cambio, se aplicarán las condiciones actualizadas."
        }
      ]
    },
    {
      id: "contact",
      heading: "Contacto",
      blocks: [
        {
          kind: "paragraph",
          html: "¿Preguntas sobre estas condiciones? Escribe a {email:support}."
        }
      ]
    }
  ]
};
