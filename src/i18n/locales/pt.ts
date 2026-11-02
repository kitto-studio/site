/** @file Brazilian Portuguese UI strings, from the prototype draft copy reviewed against `en.ts`; the rest translated by hand. */
import type { UIStrings } from "../types";

/** Brazilian Portuguese strings. */
export const pt: UIStrings = {
  meta: {
    root: {
      title: "Escolha seu idioma",
      description:
        "O Kitto Studio é um pequeno estúdio familiar. Fazemos jogos de quebra-cabeça para celular."
    },
    home: {
      title: "Com certeza vale a pena jogar.",
      description:
        "Somos o Kitto Studio, um pequeno estúdio familiar. Fazemos jogos de quebra-cabeça para celular."
    },
    about: {
      title: "Sobre nós",
      description:
        "O Kitto Studio é feito por Alex e Hanna. Fazemos jogos de quebra-cabeça para celular, juntos e no nosso ritmo."
    },
    games: {
      title: "Jogos",
      description:
        "Fazemos jogos de quebra-cabeça para celular. Veja no que estamos trabalhando agora."
    },
    memoryMissing: {
      title: "A Memory Missing: Merge Game",
      description:
        "Um jovem acorda em um hospital e não se lembra de nada. Um detetive já o espera ao lado da cama."
    },
    support: {
      title: "Suporte",
      description:
        "Um endereço para tudo: dúvidas, problemas em um jogo, ideias e pedidos sobre seus dados. Lemos todas as mensagens."
    },
    privacy: {
      title: "Política de Privacidade",
      description:
        "Os jogos do Kitto Studio guardam seu progresso no seu dispositivo. Sem contas, sem análises, sem anúncios, sem rastreamento."
    },
    terms: {
      title: "Termos de Uso",
      description: "Os termos para usar os jogos do Kitto Studio e o site kitto.studio."
    },
    deleteData: {
      title: "Excluir seus dados",
      description:
        "Como excluir seus dados dos jogos do Kitto Studio: sem conta, nada nos nossos servidores, apague tudo no seu dispositivo."
    },
    notFound: {
      title: "Página não encontrada",
      description: "Esta página não existe ou foi movida."
    }
  },
  chrome: {
    skip: "Pular para o conteúdo",
    homeLabel: "Kitto Studio, início",
    navLabel: "Principal",
    nav: { games: "Jogos", about: "Sobre", support: "Suporte" },
    footer: {
      label: "Informações legais e suporte",
      privacy: "Política de Privacidade",
      terms: "Termos de Uso",
      deleteData: "Excluir seus dados",
      support: "Suporte",
      copyright: "© 2026 Kitto Studio"
    },
    theme: { label: "Tema", system: "Sistema", light: "Claro", dark: "Escuro" },
    language: { label: "Idioma" },
    menu: { open: "Menu", close: "Fechar" }
  },
  root: {
    heading: "Escolha seu idioma"
  },
  home: {
    hero: {
      title: "Com certeza vale a pena jogar.",
      lead: "Somos o Kitto Studio, um pequeno estúdio familiar. Fazemos jogos de quebra-cabeça para celular."
    },
    games: {
      title: "Nossos jogos",
      lead: "Nosso primeiro jogo está em desenvolvimento. Outros virão.",
      comingSoon: "Em breve",
      slot: "Novo jogo",
      genre: "Um jogo de detetive em que você combina pistas",
      platforms: "Para iPhone e Android"
    },
    about: {
      title: "Sobre nós",
      text: "O Kitto Studio é feito por Alex e Hanna. Fazemos cada jogo juntos, no nosso ritmo.",
      kitto: "きっと (kitto) significa “com certeza” em japonês.",
      more: "Mais sobre o estúdio"
    },
    support: {
      title: "Precisa de ajuda?",
      text: "Escreva para {email}. Lemos todas as mensagens.",
      cta: "Fale com a gente"
    }
  },
  about: {
    title: "Um pequeno estúdio familiar",
    lead: "O Kitto Studio é feito por Alex e Hanna. Fazemos jogos de quebra-cabeça para celular, juntos e no nosso ritmo.",
    who: {
      title: "Quem somos",
      first: "Somos dois. Somos uma família, e o estúdio é o trabalho que compartilhamos.",
      second:
        "Todo jogo começa na nossa mesa. A gente pensa nele junto, desenvolve e joga muitas vezes antes de qualquer outra pessoa ver.",
      dioramaAlt:
        "Um pequeno estúdio de papel com duas mesas frente a frente, dois notebooks e duas xícaras de chá."
    },
    name: {
      title: "Por que o nome Kitto",
      first:
        "Em japonês, きっと (kitto) quer dizer “com certeza”. As pessoas dizem isso quando acreditam que algo vai acontecer: com certeza vai dar certo.",
      second:
        "Gostamos dessa confiança tranquila. Um jogo leva muito tempo para ficar pronto. Acreditamos que cada um, com certeza, vai chegar lá.",
      kana: "きっと",
      reading: "kitto"
    },
    how: {
      title: "Como trabalhamos",
      small: {
        title: "Pequenos de propósito",
        text: "Somos só nós dois, então cada detalhe passa pelas nossas mãos."
      },
      care: {
        title: "Cuidado com cada quebra-cabeça",
        text: "Testamos cada quebra-cabeça até ele ficar justo e claro. Se ainda não estiver pronto, ele espera."
      },
      pace: {
        title: "No nosso ritmo",
        text: "Não temos pressa. Um jogo sai quando está bom, não quando o calendário manda."
      }
    },
    hello: {
      title: "Diga oi",
      text: "Dúvidas, ideias ou só uma palavra gentil: escreva para {email}. Lemos todas as mensagens.",
      support: "Precisa de ajuda com um jogo? Veja a página de {link}.",
      supportLink: "Suporte"
    }
  },
  games: {
    title: "Nossos jogos",
    lead: "Fazemos jogos de quebra-cabeça para celular. Veja no que estamos trabalhando agora.",
    card: {
      genre: "Um jogo de detetive de mesclar",
      teaser:
        "Um jovem acorda em um hospital e não se lembra de nada. Um detetive já o espera ao lado da cama.",
      status: "Em breve para iPhone e Android",
      cta: "Sobre o jogo"
    },
    slot: {
      name: "Novo jogo",
      soon: "Em breve",
      note: "Mais jogos vão aparecer aqui quando estiverem prontos."
    },
    help: "Dúvidas sobre nossos jogos? Veja a página de {link}.",
    helpLink: "Suporte"
  },
  game: {
    name: "A Memory Missing: Merge Game",
    breadcrumb: { label: "Trilha de navegação", games: "Jogos" },
    tags: { genre: "Jogo de detetive de mesclar", status: "Em breve para iPhone e Android" },
    gallery: {
      title: "Capturas de tela e arte",
      wardLabel: "Arte principal",
      wardAlt:
        "Arte principal: um quarto de hospital à noite. Um jovem dorme na cama enquanto um detetive e uma mulher conversam ao lado dele.",
      splashLabel: "Tela de carregamento",
      splashAlt:
        "A tela de carregamento do jogo: o jovem dorme em uma cama de hospital, dentro de uma moldura redonda. Abaixo ficam o título do jogo e uma barra de carregamento cheia.",
      previous: "Imagem anterior",
      next: "Próxima imagem",
      open: "Abrir em tela cheia",
      show: "Mostrar a imagem {n} de {total}: {label}",
      count: "{n} de {total}",
      viewer: "Visualizador de imagens",
      close: "Fechar"
    },
    story: {
      title: "A história",
      premise:
        "Um jovem acorda em um hospital e não se lembra de nada. Um detetive já o espera ao lado da cama. Mescle pistas, recupere pedaço por pedaço as memórias perdidas e descubra o que aconteceu na noite que ele esqueceu."
    },
    platforms: {
      title: "Onde jogar",
      iphone: "iPhone",
      android: "Android",
      soon: "Em breve",
      note: "Ainda não há data de lançamento. Vamos colocar os links das lojas aqui quando o jogo for lançado."
    },
    features: {
      title: "No jogo",
      merge: {
        title: "Mescle para achar pistas",
        text: "Combine itens no tabuleiro. Coisas pequenas viram pistas."
      },
      memories: {
        title: "Memórias, pedaço por pedaço",
        text: "Cada pista traz de volta uma parte da noite que ele esqueceu."
      },
      solve: {
        title: "Uma história para desvendar",
        text: "Junte as peças e descubra o que realmente aconteceu."
      },
      offline: {
        title: "Dá para jogar offline",
        text: "Não precisa de conexão. Seu progresso fica salvo no seu dispositivo."
      }
    },
    help: {
      title: "Ajuda e privacidade",
      text: "Dúvidas ou problemas com o jogo? Fale com a gente pela {supportLink}. Como o jogo trata seus dados está explicado na {privacyLink}.",
      supportLink: "página de suporte",
      privacyLink: "Política de Privacidade"
    },
    board: {
      title: "Mescle algumas pistas",
      lead: "Arraste um item até o par dele para mesclar os dois e complete as três cadeias para trazer de volta uma memória.",
      hint: "Ou toque em um item e depois no par dele.",
      hintMouse: "Ou clique em um item e depois no par dele.",
      keys: "As setas movem entre as casas. Enter ou Espaço pega um item e o solta. Esc devolve o item ao lugar.",
      caseTitle: "Pistas para encontrar",
      progress: "{n} de 3 pistas encontradas",
      newBoard: "Novo tabuleiro",
      empty: "Casa vazia",
      picked: "Você pegou: {item}. Escolha o par ou uma casa vazia.",
      merged: "Novo item: {item}.",
      found: "Pista encontrada: {item}.",
      missing: "{item}: ainda por encontrar",
      winTitle: "Uma memória voltou.",
      winText: "Um pedaço da noite que ele esqueceu. O resto está no jogo.",
      again: "Jogar de novo"
    },
    items: {
      note1: "Papel rasgado",
      note2: "Bilhete dobrado",
      note3: "Carta lacrada",
      key1: "Chave antiga",
      key2: "Chaveiro",
      key3: "Caixa trancada",
      photo1: "Canto de foto",
      photo2: "Metade de foto",
      photo3: "Foto emoldurada",
      memory: "Memória"
    }
  },
  support: {
    title: "Precisa de ajuda? Fale com a gente.",
    lead: "Um endereço para tudo: dúvidas, problemas em um jogo, ideias e pedidos sobre seus dados. Lemos todas as mensagens.",
    mail: {
      title: "Nosso e-mail",
      write: "Escrever um e-mail",
      copy: "Copiar endereço",
      copied: "Copiado",
      copiedNote: "O endereço está na sua área de transferência.",
      copyFail: "Selecione o endereço acima e copie."
    },
    letter: {
      title: "O que colocar na mensagem",
      lead: "Alguns detalhes ajudam a gente a achar o problema mais rápido.",
      game: "O nome do jogo",
      device: "O modelo do seu celular ou tablet",
      os: "A versão do iOS ou do Android (fica nas configurações do aparelho)",
      what: "O que aconteceu e o que você esperava. Uma captura de tela ajuda muito."
    },
    faq: {
      title: "Perguntas frequentes",
      progressQuestion: "Onde meu progresso fica salvo?",
      progressAnswer:
        "No seu dispositivo. Seu progresso fica no celular ou tablet em que você joga. Se você excluir o jogo, o progresso é excluído junto.",
      deleteQuestion: "Como excluo meus dados?",
      deleteAnswer:
        "Siga os passos da página {link}. Você também pode escrever para a gente, e nós ajudamos.",
      deleteLink: "Excluir seus dados",
      privacyQuestion: "Como vocês cuidam da minha privacidade?",
      privacyAnswer: "Nossa {link} explica quais dados nossos jogos usam e por quê.",
      privacyLink: "Política de Privacidade"
    }
  },
  legal: {
    titles: {
      privacy: "Política de Privacidade",
      terms: "Termos de Uso",
      deleteData: "Excluir seus dados"
    },
    contents: "Sumário",
    inShort: "Em resumo",
    updated: "Última atualização: {date}",
    draft: "Rascunho. Campos destacados, como {placeholder}, ainda não foram preenchidos.",
    fallback: "Esta página está disponível em inglês."
  },
  deleteData: {
    facts: {
      developer: "Desenvolvedor",
      apps: "Apps",
      appsValue: "A Memory Missing: Merge Game e os futuros jogos do Kitto Studio",
      ids: "IDs dos apps"
    },
    cta: "Pedir exclusão por e-mail",
    mailSubject: "Delete my data",
    deleted: "Excluído",
    kept: "Mantido",
    nothing: "Nada.",
    nothingNote: "Depois da exclusão, não guardamos nenhum dado seu."
  },
  notFound: {
    title: "Página não encontrada",
    text: "Esta página não existe ou foi movida.",
    home: "Ir para a página inicial"
  }
};
