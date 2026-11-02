/**
 * @file Brazilian Portuguese «Excluir seus dados», translated from `en.ts`.
 *
 * Same sections, blocks, slots and tags as `en.ts`; only the words are translated. Menu labels are
 * the ones Android and iOS show in Brazilian Portuguese. The mail subject stays «Delete my data», the
 * same as `deleteData.mailSubject` in `locales/pt.ts`.
 */
import type { LegalDocument } from "../../types";

/** The Brazilian Portuguese «Delete your data» document. */
export const deleteDataPt: LegalDocument = {
  intro: "Esta página explica como excluir seus dados dos jogos feitos pelo Kitto Studio.",
  inShort: [
    "Não há contas, então não há nenhuma conta para excluir.",
    "Não guardamos dados de jogos nos nossos servidores.",
    "Os dados dos jogos ficam apenas no seu dispositivo. Você pode excluí-los por conta própria com poucos toques.",
    "Se você escreveu para nós, excluímos seus e-mails em até 30 dias após o seu pedido."
  ],
  sections: [
    {
      id: "nothing",
      heading: "Sem contas, nada nos nossos servidores",
      blocks: [
        {
          kind: "paragraph",
          html: "Nossos jogos não têm contas e não nos enviam nenhum dado. Seu progresso e suas configurações ficam salvos apenas no seu dispositivo."
        },
        {
          kind: "paragraph",
          html: "Por isso, não há nada para excluirmos do nosso lado. Você tem controle total dos dados dos seus jogos."
        }
      ]
    },
    {
      id: "android",
      heading: "Excluir dados do jogo no Android",
      blocks: [
        {
          kind: "steps",
          items: [
            "Abra as <b>Configurações</b> do celular.",
            "Toque em <b>Apps</b>.",
            "Encontre o jogo e toque nele, por exemplo <b>A Memory Missing: Merge Game</b>.",
            "Toque em <b>Armazenamento</b>.",
            "Toque em <b>Limpar armazenamento</b>."
          ]
        },
        {
          kind: "paragraph",
          html: "Ou desinstale o jogo: isso remove todos os dados dele do seu celular. Os nomes dos menus podem variar um pouco de um celular para outro."
        }
      ]
    },
    {
      id: "iphone",
      heading: "Excluir dados do jogo no iPhone",
      blocks: [
        {
          kind: "steps",
          items: [
            "Toque e mantenha pressionado o ícone do jogo na Tela de Início.",
            "Toque em <b>Remover App</b>.",
            "Toque em <b>Apagar App</b> e depois em <b>Apagar</b>."
          ]
        },
        {
          kind: "paragraph",
          html: "Apagar o app remove todos os dados dele do seu iPhone."
        }
      ]
    },
    {
      id: "email",
      heading: "Se você escreveu para nós",
      blocks: [
        {
          kind: "paragraph",
          html: "Se você nos enviou um e-mail, temos seu endereço de e-mail e suas mensagens. Para que sejam excluídos:"
        },
        {
          kind: "steps",
          items: [
            "Escreva para {email:delete} usando o mesmo endereço que você usou antes.",
            "Use o assunto “Delete my data”.",
            "Excluímos suas mensagens em até 30 dias e enviamos uma confirmação."
          ]
        }
      ]
    },
    {
      id: "kept",
      heading: "O que é excluído e o que é mantido",
      blocks: [
        {
          kind: "list",
          items: [
            "O progresso e as configurações dos seus jogos. Você os exclui no seu dispositivo.",
            "Seus e-mails e seu endereço de e-mail. Nós os excluímos quando você pedir."
          ]
        }
      ]
    },
    {
      id: "questions",
      heading: "Dúvidas",
      blocks: [
        {
          kind: "paragraph",
          html: 'Escreva para {email:delete}. Como tratamos os dados está explicado na nossa <a href="{route:privacy}">Política de Privacidade</a>.'
        }
      ]
    }
  ]
};
