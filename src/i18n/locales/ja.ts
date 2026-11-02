/** @file Japanese UI strings: the {@link UIStrings} table in polite form (です/ます). */
import type { UIStrings } from "../types";

/** Japanese strings, translated from English. */
export const ja: UIStrings = {
  meta: {
    home: {
      title: "きっと、遊ぶ価値がある。",
      description:
        "私たちは Kitto Studio、家族で営む小さなスタジオです。スマートフォン向けのパズルゲームを作っています。"
    },
    about: {
      title: "スタジオについて",
      description:
        "Kitto Studio は、アレックスとハンナのふたりです。スマートフォン向けのパズルゲームを、ふたりで自分たちのペースで作っています。"
    },
    games: {
      title: "ゲーム",
      description:
        "スマートフォン向けのパズルゲームを作っています。いま取り組んでいるゲームはこちらです。"
    },
    memoryMissing: {
      title: "A Memory Missing: Merge Game",
      description:
        "病院で目を覚ました青年は、何も覚えていません。ベッドのそばでは、探偵がすでに待っていました。"
    },
    support: {
      title: "サポート",
      description:
        "ご質問、ゲームの不具合、アイデア、データに関するご依頼まで、ひとつのアドレスで受け付けています。いただいたメールにはすべて目を通しています。"
    },
    privacy: {
      title: "プライバシーポリシー",
      description:
        "Kitto Studio のゲームは、進行状況をお使いの端末に保存します。アカウントなし、分析なし、広告なし、トラッキングなし。"
    },
    terms: {
      title: "利用規約",
      description: "Kitto Studio のゲームと kitto.studio ウェブサイトの利用規約です。"
    },
    deleteData: {
      title: "データの削除",
      description:
        "Kitto Studio のゲームのデータを削除する方法。アカウントはなく、サーバーにも何も保存していません。データはお使いの端末で消去できます。"
    },
    notFound: {
      title: "ページが見つかりません",
      description: "このページは存在しないか、移動しました。"
    }
  },
  chrome: {
    skip: "本文へスキップ",
    homeLabel: "Kitto Studio ホーム",
    navLabel: "メインメニュー",
    nav: { games: "ゲーム", about: "スタジオ", support: "サポート" },
    footer: {
      label: "規約とサポート",
      privacy: "プライバシーポリシー",
      terms: "利用規約",
      deleteData: "データの削除",
      support: "サポート",
      copyright: "© 2026 Kitto Studio"
    },
    theme: { label: "テーマ", system: "システム", light: "ライト", dark: "ダーク" },
    language: { label: "言語" },
    menu: { open: "メニュー", close: "閉じる" }
  },
  root: {
    heading: "言語を選んでください"
  },
  home: {
    hero: {
      title: "きっと、遊ぶ価値がある。",
      lead: "私たちは Kitto Studio、家族で営む小さなスタジオです。スマートフォン向けのパズルゲームを作っています。"
    },
    games: {
      title: "私たちのゲーム",
      lead: "最初のゲームを開発中です。これからもゲームを増やしていきます。",
      comingSoon: "近日公開",
      slot: "新しいゲーム",
      genre: "探偵マージゲーム",
      platforms: "iPhone と Android 向け"
    },
    about: {
      title: "私たちについて",
      text: "Kitto Studio は、アレックスとハンナのふたりです。どのゲームも、ふたりで自分たちのペースで作っています。",
      kitto: "スタジオ名の Kitto は、「きっとうまくいく」の「きっと」です。",
      more: "スタジオについて詳しく"
    },
    support: {
      title: "お困りですか？",
      text: "{email} までご連絡ください。いただいたメールにはすべて目を通しています。",
      cta: "メールを送る"
    }
  },
  about: {
    title: "家族で営む小さなスタジオ",
    lead: "Kitto Studio は、アレックスとハンナのふたりです。スマートフォン向けのパズルゲームを、ふたりで自分たちのペースで作っています。",
    who: {
      title: "私たちのこと",
      first: "私たちはふたりです。家族であり、このスタジオはふたりで分かち合う仕事です。",
      second:
        "どのゲームも、私たちのテーブルから生まれます。ふたりで考え、作り、ほかの誰かが見る前に何度も遊びます。",
      dioramaAlt:
        "向かい合わせの机がふたつ、ノートパソコンが2台、紅茶のカップがふたつある、紙でできた小さなスタジオの部屋。"
    },
    name: {
      title: "Kitto という名前の由来",
      first:
        "「きっと」は、何かが起こると信じているときに使う言葉です。「きっと、うまくいく」のように。",
      second:
        "私たちは、その静かな自信が好きです。ゲームを作るには長い時間がかかります。それでも、どのゲームもきっと完成すると信じています。",
      kana: "きっと",
      reading: "kitto"
    },
    how: {
      title: "私たちの働き方",
      small: {
        title: "あえて小さく",
        text: "ふたりだけなので、細かいところまですべて私たちの手を通ります。"
      },
      care: {
        title: "パズルひとつひとつを丁寧に",
        text: "公平でわかりやすいと感じられるまで、パズルをひとつずつテストします。まだ仕上がっていなければ、待ちます。"
      },
      pace: {
        title: "自分たちのペースで",
        text: "急ぎません。ゲームを出すのは、カレンダーが決めたときではなく、良いものになったときです。"
      }
    },
    hello: {
      title: "ご連絡はこちら",
      text: "ご質問、アイデア、ひとことの感想も、{email} までお送りください。いただいたメールにはすべて目を通しています。",
      support: "ゲームについてお困りですか？　{link}をご覧ください。",
      supportLink: "サポート"
    }
  },
  games: {
    title: "私たちのゲーム",
    lead: "スマートフォン向けのパズルゲームを作っています。いま取り組んでいるゲームはこちらです。",
    card: {
      genre: "探偵マージゲーム",
      teaser:
        "病院で目を覚ました青年は、何も覚えていません。ベッドのそばでは、探偵がすでに待っていました。",
      status: "iPhone と Android で近日公開",
      cta: "ゲームについて"
    },
    slot: {
      name: "新しいゲーム",
      soon: "近日公開",
      note: "次のゲームは、準備ができたらここに追加します。"
    },
    help: "ゲームについてのご質問は、{link}をご覧ください。",
    helpLink: "サポート"
  },
  game: {
    name: "A Memory Missing: Merge Game",
    breadcrumb: { label: "パンくずリスト", games: "ゲーム" },
    tags: { genre: "探偵マージゲーム", status: "iPhone と Android で近日公開" },
    gallery: {
      title: "スクリーンショットとアート",
      wardLabel: "キーアート",
      wardAlt: "キーアート：夜の病室。ベッドで眠る青年のそばで、探偵と女性が話しています。",
      splashLabel: "ロード画面",
      splashAlt:
        "ゲームのロード画面：丸い枠の中に、病院のベッドで眠る青年。その下に、ゲームのタイトルといっぱいになったロードバーがあります。",
      previous: "前の画像",
      next: "次の画像",
      open: "全画面で開く",
      show: "画像 {n}/{total} を表示：{label}",
      count: "{n} / {total}",
      viewer: "画像ビューアー",
      close: "閉じる"
    },
    story: {
      title: "ストーリー",
      premise:
        "病院で目を覚ました青年は、何も覚えていません。ベッドのそばでは、探偵がすでに待っていました。手がかりをマージして、失われた記憶をひとつずつ取り戻し、彼が忘れてしまったあの夜に何があったのかを突き止めましょう。"
    },
    platforms: {
      title: "対応機種",
      iphone: "iPhone",
      android: "Android",
      soon: "近日公開",
      note: "リリース日はまだ決まっていません。公開されたら、ここにストアへのリンクを追加します。"
    },
    features: {
      title: "ゲームの特徴",
      merge: {
        title: "マージして手がかりを探す",
        text: "ボード上のアイテムを組み合わせると、小さなものが手がかりに変わります。"
      },
      memories: {
        title: "記憶をひとつずつ",
        text: "手がかりを見つけるたびに、彼が忘れた夜の一部がよみがえります。"
      },
      solve: {
        title: "解き明かす物語",
        text: "かけらをつなぎ合わせて、本当は何があったのかを突き止めましょう。"
      },
      offline: {
        title: "オフラインで遊べる",
        text: "インターネット接続は不要です。進行状況はお使いの端末に保存されます。"
      }
    },
    help: {
      title: "サポートとプライバシー",
      text: "ゲームについてのご質問や不具合は、{supportLink}からご連絡ください。ゲームでのデータの扱いについては、{privacyLink}をご覧ください。",
      supportLink: "サポートページ",
      privacyLink: "プライバシーポリシー"
    },
    board: {
      title: "手がかりをマージしてみましょう",
      lead: "アイテムを同じアイテムの上にドラッグしてマージします。3つのチェーンをすべて完成させると、記憶がひとつ戻ります。",
      hint: "または、アイテムをタップしてから、同じアイテムをタップします。",
      hintMouse: "または、アイテムをクリックしてから、同じアイテムをクリックします。",
      keys: "矢印キーでマスを移動します。Enter キーまたはスペースキーでアイテムを持ち上げ、置きます。Esc キーで元に戻します。",
      caseTitle: "見つける手がかり",
      progress: "見つけた手がかり：{n} / 3",
      newBoard: "新しいボード",
      empty: "空きマス",
      picked: "{item}を持ち上げました。同じアイテムか空きマスを選んでください。",
      merged: "マージしました：{item}",
      found: "手がかりを発見：{item}",
      missing: "{item}：まだ見つかっていません",
      winTitle: "記憶がひとつ戻りました。",
      winText: "彼が忘れたあの夜の、ひとかけら。続きはゲームで。",
      again: "もう一度遊ぶ"
    },
    items: {
      note1: "破れた紙切れ",
      note2: "折りたたんだメモ",
      note3: "封をした手紙",
      key1: "古い鍵",
      key2: "キーリング",
      key3: "鍵のかかった箱",
      photo1: "写真の角",
      photo2: "半分の写真",
      photo3: "額入りの写真",
      memory: "記憶"
    }
  },
  support: {
    title: "お困りですか？　メールでご連絡ください。",
    lead: "ご質問、ゲームの不具合、アイデア、データに関するご依頼まで、ひとつのアドレスで受け付けています。いただいたメールにはすべて目を通しています。",
    mail: {
      title: "メールアドレス",
      write: "メールを書く",
      copy: "アドレスをコピー",
      copied: "コピーしました",
      copiedNote: "アドレスをクリップボードにコピーしました。",
      copyFail: "上のアドレスを選択して、コピーしてください。"
    },
    letter: {
      title: "メールに書いていただきたいこと",
      lead: "次の情報があると、問題を早く見つけられます。",
      game: "ゲームの名前",
      device: "お使いのスマートフォンまたはタブレットの機種",
      os: "iOS または Android のバージョン（「設定」で確認できます）",
      what: "何が起きたか、本来どうなるはずだったか。スクリーンショットがあると、とても助かります。"
    },
    faq: {
      title: "よくある質問",
      progressQuestion: "進行状況はどこに保存されますか？",
      progressAnswer:
        "お使いの端末です。進行状況は、プレイしているスマートフォンやタブレットに保存されます。ゲームを削除すると、進行状況も一緒に削除されます。",
      deleteQuestion: "データはどうやって削除できますか？",
      deleteAnswer:
        "{link}ページの手順に従ってください。メールでご連絡いただければ、お手伝いします。",
      deleteLink: "データの削除",
      privacyQuestion: "プライバシーはどのように扱われますか？",
      privacyAnswer: "ゲームが使うデータとその理由は、{link}で説明しています。",
      privacyLink: "プライバシーポリシー"
    }
  },
  legal: {
    titles: {
      privacy: "プライバシーポリシー",
      terms: "利用規約",
      deleteData: "データの削除"
    },
    contents: "目次",
    inShort: "要点",
    updated: "最終更新日：{date}",
    draft: "下書きです。{placeholder} のように強調表示された項目は、まだ入力されていません。",
    fallback: "このページは英語でご覧いただけます。"
  },
  deleteData: {
    facts: {
      developer: "開発者",
      apps: "アプリ",
      appsValue: "A Memory Missing: Merge Game、および今後の Kitto のゲーム",
      ids: "アプリ ID"
    },
    cta: "削除依頼をメールで送る",
    mailSubject: "データの削除依頼",
    deleted: "削除されるもの",
    kept: "残るもの",
    nothing: "ありません。",
    nothingNote: "削除後は、データを一切保持しません。"
  },
  notFound: {
    title: "ページが見つかりません",
    text: "このページは存在しないか、移動しました。",
    home: "トップページへ"
  }
};
