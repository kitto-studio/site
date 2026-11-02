/**
 * @file Brazilian Portuguese «Política de Privacidade», translated from `en.ts`.
 *
 * Same sections, blocks, slots and tags as `en.ts`; only the words are translated.
 */
import type { LegalDocument } from "../../types";

/** The Brazilian Portuguese «Privacy Policy» document. */
export const privacyPt: LegalDocument = {
  intro:
    "Esta política explica o que acontece com suas informações quando você joga os jogos do Kitto Studio, visita kitto.studio ou escreve para nós. Resumindo: nossos jogos guardam tudo no seu dispositivo, e não coletamos dados pessoais.",
  inShort: [
    "Nossos jogos salvam o progresso e as configurações apenas no seu dispositivo.",
    "Sem contas, sem análises, sem publicidade, sem rastreamento.",
    "Não coletamos nem vendemos dados pessoais.",
    "Se você nos enviar um e-mail, usamos seu endereço apenas para responder."
  ],
  sections: [
    {
      id: "who",
      heading: "Quem somos",
      blocks: [
        {
          kind: "paragraph",
          html: "O Kitto Studio é um pequeno estúdio familiar. Fazemos jogos de quebra-cabeça para celular. O Kitto Studio é administrado por uma pessoa física, Hanna Kucherenko, Calle Ventura Selva González 9, Bungalow 28, 03130 Gran Alacant, Santa Pola (Alicante), Espanha, que é a responsável pelo tratamento das informações descritas nesta política. Você pode entrar em contato conosco pelo {email:support}."
        }
      ]
    },
    {
      id: "scope",
      heading: "O que esta política abrange",
      blocks: [
        { kind: "paragraph", html: "Esta política se aplica a:" },
        {
          kind: "list",
          items: [
            'Nossos jogos. Os IDs dos apps começam com studio.kitto, por exemplo <span translate="no">studio.kitto.memorymissing</span>. Nosso primeiro jogo é A Memory Missing: Merge Game. Ele ainda não foi lançado.',
            "Nosso site, kitto.studio.",
            "E-mails que você envia para {email:support}."
          ]
        }
      ]
    },
    {
      id: "games",
      heading: "Nossos jogos",
      blocks: [
        {
          kind: "paragraph",
          html: "Nossos jogos salvam seu progresso e suas configurações apenas no seu dispositivo. Eles não enviam esses dados para nós nem para ninguém."
        },
        {
          kind: "list",
          items: [
            "<strong>Sem contas.</strong> Você nunca precisa se cadastrar nem fazer login.",
            "<strong>Sem análises.</strong> Não medimos como você joga.",
            "<strong>Sem publicidade.</strong> Nossos jogos não exibem anúncios.",
            "<strong>Sem rastreamento.</strong> Não acompanhamos você em outros apps ou sites.",
            "<strong>Sem SDKs que coletam dados.</strong> Não usamos SDKs de terceiros que coletam dados pessoais."
          ]
        },
        {
          kind: "paragraph",
          html: "Não coletamos dados pessoais pelos nossos jogos, então não temos nenhum para vender ou compartilhar."
        }
      ]
    },
    {
      id: "purchases",
      heading: "Compras",
      blocks: [
        {
          kind: "paragraph",
          html: "Se um jogo oferecer compras, elas são processadas pela App Store da Apple ou pelo Google Play, de acordo com os termos deles. Nunca recebemos seus dados de pagamento."
        },
        {
          kind: "paragraph",
          html: 'Para saber como a Apple e o Google tratam seus dados, leia a <a href="https://www.apple.com/legal/privacy/" rel="noopener">Política de Privacidade da Apple</a> e a <a href="https://policies.google.com/privacy" rel="noopener">Política de Privacidade do Google</a>.'
        }
      ]
    },
    {
      id: "email",
      heading: "Quando você escreve para nós",
      blocks: [
        {
          kind: "paragraph",
          html: "Se você enviar um e-mail para {email:support}, recebemos seu endereço de e-mail e sua mensagem. Usamos esses dados apenas para responder a você."
        },
        {
          kind: "paragraph",
          html: "Guardamos esses dados apenas pelo tempo necessário para ajudar você. Nós os excluímos quando você pedir."
        }
      ]
    },
    {
      id: "website",
      heading: "Nosso site",
      blocks: [
        {
          kind: "paragraph",
          html: "kitto.studio é um site estático. Ele não usa cookies nem ferramentas de análise."
        },
        {
          kind: "paragraph",
          html: "Ele lembra o tema e o idioma que você escolheu no armazenamento local do seu navegador. Essa informação fica no seu navegador, e nós não conseguimos vê-la. Você pode apagá-la a qualquer momento nas configurações do navegador."
        },
        {
          kind: "paragraph",
          html: 'Nosso provedor de hospedagem, a Cloudflare, pode tratar dados técnicos, como endereços IP, em registros do servidor, para manter o site seguro e entregá-lo a você. Leia a <a href="https://www.cloudflare.com/privacypolicy/" rel="noopener">Política de Privacidade da Cloudflare</a>.'
        }
      ]
    },
    {
      id: "children",
      heading: "Crianças",
      blocks: [
        {
          kind: "paragraph",
          html: "Nossos jogos são destinados a jogadores a partir de 13 anos. Eles não são direcionados a crianças menores de 13 anos, e não coletamos intencionalmente dados pessoais de crianças. Na verdade, nossos jogos não coletam dados pessoais de ninguém."
        }
      ]
    },
    {
      id: "rights",
      heading: "Seus direitos",
      blocks: [
        {
          kind: "paragraph",
          html: "Dependendo de onde você mora, por exemplo, pelo GDPR, pelo UK GDPR ou pela CCPA, você tem o direito de:"
        },
        {
          kind: "list",
          items: [
            "acessar os dados pessoais que mantemos sobre você;",
            "corrigi-los;",
            "pedir a exclusão deles;",
            "se opor à forma como os usamos;",
            "apresentar reclamação a uma autoridade supervisora de proteção de dados."
          ]
        },
        {
          kind: "paragraph",
          html: 'Na prática, o único dado pessoal que podemos ter é um e-mail que você nos enviou. Para exercer qualquer um desses direitos, escreva para {email:support}. Para excluir seus dados, veja <a href="{route:deleteData}">Excluir seus dados</a>.'
        }
      ]
    },
    {
      id: "changes",
      heading: "Alterações nesta política",
      blocks: [
        {
          kind: "paragraph",
          html: "Se alterarmos esta política, atualizaremos esta página e a data de “Última atualização” no topo."
        }
      ]
    },
    {
      id: "contact",
      heading: "Contato",
      blocks: [
        { kind: "paragraph", html: "Dúvidas sobre privacidade? Escreva para {email:support}." }
      ]
    }
  ]
};
