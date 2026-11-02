/**
 * @file Brazilian Portuguese «Termos de Uso», translated from `en.ts`.
 *
 * Same sections, blocks, slots and tags as `en.ts`; only the words are translated.
 */
import type { LegalDocument } from "../../types";

/** The Brazilian Portuguese «Terms of Use» document. */
export const termsPt: LegalDocument = {
  intro:
    "Estes termos se aplicam quando você usa os jogos do Kitto Studio e o site kitto.studio. Ao usá-los, você concorda com estes termos. Eles são curtos, então leia, por favor.",
  inShort: [
    "Você pode usar nossos jogos e nosso site para uso pessoal e não comercial.",
    "Os jogos e tudo o que há neles pertencem ao Kitto Studio.",
    "As compras são feitas pela App Store ou pelo Google Play, de acordo com os termos deles.",
    "Jogue limpo e não faça mau uso dos jogos nem do site."
  ],
  sections: [
    {
      id: "who",
      heading: "Quem somos",
      blocks: [
        {
          kind: "paragraph",
          html: "O Kitto Studio é um pequeno estúdio familiar que faz jogos de quebra-cabeça para celular. O Kitto Studio é administrado por uma pessoa física, Hanna Kucherenko, Calle Ventura Selva González 9, Bungalow 28, 03130 Gran Alacant, Santa Pola (Alicante), Espanha. Estes termos são um acordo entre você e nós. Você pode entrar em contato conosco pelo {email:support}."
        }
      ]
    },
    {
      id: "licence",
      heading: "Sua licença",
      blocks: [
        {
          kind: "paragraph",
          html: "Concedemos a você uma licença pessoal, não exclusiva e intransferível para baixar e usar nossos jogos e nosso site para uso pessoal e não comercial."
        },
        {
          kind: "paragraph",
          html: "Você não pode usá-los para nenhuma finalidade comercial sem nossa autorização por escrito."
        }
      ]
    },
    {
      id: "content",
      heading: "Nosso conteúdo",
      blocks: [
        {
          kind: "paragraph",
          html: "Nossos jogos, nosso site e tudo o que há neles, incluindo artes, personagens, músicas, textos, código e o nome e o logotipo Kitto, pertencem ao Kitto Studio. Eles são protegidos pelas leis de propriedade intelectual."
        },
        {
          kind: "paragraph",
          html: "Estes termos não dão a você nenhum direito sobre eles além da licença acima."
        }
      ]
    },
    {
      id: "purchases",
      heading: "Compras",
      blocks: [
        {
          kind: "paragraph",
          html: "Se um jogo oferecer compras, elas são vendidas e processadas pela App Store da Apple ou pelo Google Play. Os termos deles se aplicam a pagamentos e reembolsos. Para pedir um reembolso, entre em contato com a loja em que você fez a compra."
        },
        { kind: "paragraph", html: "Nunca recebemos seus dados de pagamento." }
      ]
    },
    {
      id: "use",
      heading: "Uso aceitável",
      blocks: [
        {
          kind: "paragraph",
          html: "Ao usar nossos jogos e nosso site, pedimos que você não:"
        },
        {
          kind: "list",
          items: [
            "copie, venda, alugue ou redistribua nossos jogos ou o conteúdo deles;",
            "faça engenharia reversa, descompile ou modifique os jogos, exceto quando a lei permitir;",
            "use ferramentas que interfiram no funcionamento dos jogos;",
            "use nossos jogos ou nosso site para violar a lei ou prejudicar outras pessoas;",
            "tente prejudicar o funcionamento do nosso site ou obter acesso não autorizado a ele."
          ]
        }
      ]
    },
    {
      id: "as-is",
      heading: "Jogos “no estado em que se encontram”",
      blocks: [
        {
          kind: "paragraph",
          html: "Fazemos nossos jogos com cuidado. Na medida permitida por lei, nós os oferecemos “no estado em que se encontram” e “conforme disponíveis”. Não prometemos que eles estarão livres de erros ou sempre disponíveis."
        },
        {
          kind: "paragraph",
          html: "Nada nestes termos limita os seus direitos como consumidor que não possam ser limitados por lei."
        }
      ]
    },
    {
      id: "liability",
      heading: "Limitação de responsabilidade",
      blocks: [
        {
          kind: "paragraph",
          html: "Na medida permitida por lei, o Kitto Studio não se responsabiliza por danos indiretos ou consequentes decorrentes do uso dos nossos jogos ou do nosso site."
        },
        {
          kind: "paragraph",
          html: "Seu progresso fica salvo apenas no seu dispositivo. Se você excluir um jogo ou apagar os dados dele, seu progresso será perdido, e não conseguimos recuperá-lo."
        },
        {
          kind: "paragraph",
          html: "Nada nestes termos exclui a responsabilidade que não possa ser excluída por lei."
        }
      ]
    },
    {
      id: "law",
      heading: "Lei aplicável",
      blocks: [
        { kind: "paragraph", html: "Estes termos são regidos pelas leis da Espanha." },
        {
          kind: "paragraph",
          html: "Se você for consumidor, também mantém a proteção das normas obrigatórias do país onde mora."
        }
      ]
    },
    {
      id: "privacy",
      heading: "Privacidade",
      blocks: [
        {
          kind: "paragraph",
          html: 'Como tratamos as informações está explicado na nossa <a href="{route:privacy}">Política de Privacidade</a>. Resumindo: nossos jogos guardam tudo no seu dispositivo, e não coletamos dados pessoais.'
        }
      ]
    },
    {
      id: "changes",
      heading: "Alterações nestes termos",
      blocks: [
        {
          kind: "paragraph",
          html: "Podemos atualizar estes termos. Quando isso acontecer, atualizaremos esta página e a data de “Última atualização” no topo. Se você continuar usando nossos jogos depois de uma alteração, os termos atualizados passam a valer."
        }
      ]
    },
    {
      id: "contact",
      heading: "Contato",
      blocks: [
        { kind: "paragraph", html: "Dúvidas sobre estes termos? Escreva para {email:support}." }
      ]
    }
  ]
};
