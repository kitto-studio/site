/**
 * @file Japanese «Terms of Use», translated from the English text.
 *
 * Keeps every slot of the English document: `{email:support}` and `{route:privacy}`.
 */
import type { LegalDocument } from "../../types";

/** The Japanese «Terms of Use» document. */
export const termsJa: LegalDocument = {
  intro:
    "この規約は、Kitto のゲームとウェブサイト kitto.studio をご利用いただく際に適用されます。ご利用いただくことで、この規約に同意したものとみなされます。短い規約ですので、ぜひお読みください。",
  inShort: [
    "ゲームとサイトは、個人的かつ非商用の目的で利用できます。",
    "ゲームとその中のすべてのものは、Kitto Studio に帰属します。",
    "購入は App Store または Google Play を通じて、それぞれの規約に基づいて行われます。",
    "フェアにプレイし、ゲームやサイトを不正に利用しないでください。"
  ],
  sections: [
    {
      id: "who",
      heading: "私たちについて",
      blocks: [
        {
          kind: "paragraph",
          html: "Kitto Studio は、スマートフォン向けのパズルゲームを作る、家族で営む小さなスタジオです。Kitto Studio は個人である Hanna Kucherenko（住所：Calle Ventura Selva González 9, Bungalow 28, 03130 Gran Alacant, Santa Pola (Alicante), Spain）が運営しています。この規約は、お客様と私たちとの間の合意です。ご連絡は {email:support} までお願いします。"
        }
      ]
    },
    {
      id: "licence",
      heading: "利用許諾",
      blocks: [
        {
          kind: "paragraph",
          html: "私たちは、お客様が個人的かつ非商用の目的でゲームとウェブサイトをダウンロードし、利用するための、個人的、非独占的かつ譲渡不能なライセンスを付与します。"
        },
        {
          kind: "paragraph",
          html: "私たちの書面による許可なく、これらを商用目的で利用することはできません。"
        }
      ]
    },
    {
      id: "content",
      heading: "コンテンツの権利",
      blocks: [
        {
          kind: "paragraph",
          html: "ゲーム、ウェブサイト、およびそれらに含まれるすべてのもの（アートワーク、キャラクター、音楽、テキスト、コード、Kitto の名称とロゴを含む）は、Kitto Studio に帰属し、知的財産法によって保護されています。"
        },
        {
          kind: "paragraph",
          html: "この規約は、上記のライセンスを超える権利をお客様に与えるものではありません。"
        }
      ]
    },
    {
      id: "purchases",
      heading: "購入",
      blocks: [
        {
          kind: "paragraph",
          html: "ゲーム内で購入ができる場合、販売と処理は Apple の App Store または Google Play が行います。支払いと返金には、それぞれのストアの規約が適用されます。返金をご希望の場合は、購入したストアにお問い合わせください。"
        },
        {
          kind: "paragraph",
          html: "私たちがお客様の支払い情報を受け取ることはありません。"
        }
      ]
    },
    {
      id: "use",
      heading: "適切な利用",
      blocks: [
        {
          kind: "paragraph",
          html: "ゲームとウェブサイトをご利用の際は、次の行為をしないでください。"
        },
        {
          kind: "list",
          items: [
            "ゲームやそのコンテンツを複製、販売、貸与、再配布すること",
            "法律で認められている場合を除き、ゲームをリバースエンジニアリング、逆コンパイル、改変すること",
            "ゲームの動作を妨げるツールを使用すること",
            "ゲームやウェブサイトを、法律に違反するため、または他人に害を与えるために使用すること",
            "ウェブサイトの運営を妨害したり、ウェブサイトに不正にアクセスしようとしたりすること"
          ]
        }
      ]
    },
    {
      id: "as-is",
      heading: "ゲームの「現状のまま」での提供",
      blocks: [
        {
          kind: "paragraph",
          html: "私たちは心を込めてゲームを作っています。法律で認められる範囲で、ゲームは「現状のまま」かつ「提供可能な範囲で」提供されます。エラーがないこと、常に利用できることは保証しません。"
        },
        {
          kind: "paragraph",
          html: "この規約のいかなる内容も、法律で制限できない消費者としてのお客様の権利を制限するものではありません。"
        }
      ]
    },
    {
      id: "liability",
      heading: "責任の制限",
      blocks: [
        {
          kind: "paragraph",
          html: "法律で認められる範囲で、Kitto Studio は、ゲームまたはウェブサイトの利用から生じる間接的損害または結果的損害について責任を負いません。"
        },
        {
          kind: "paragraph",
          html: "進行状況はお使いの端末にのみ保存されます。ゲームを削除したり、そのデータを消去したりすると、進行状況は失われ、私たちが復元することはできません。"
        },
        {
          kind: "paragraph",
          html: "この規約のいかなる内容も、法律で免除できない責任を免除するものではありません。"
        }
      ]
    },
    {
      id: "law",
      heading: "準拠法",
      blocks: [
        { kind: "paragraph", html: "この規約は、スペインの法律に準拠します。" },
        {
          kind: "paragraph",
          html: "消費者の方は、お住まいの国の強行法規による保護も引き続き受けられます。"
        }
      ]
    },
    {
      id: "privacy",
      heading: "プライバシー",
      blocks: [
        {
          kind: "paragraph",
          html: '情報の取り扱いについては、<a href="{route:privacy}">プライバシーポリシー</a>で説明しています。簡単に言えば、私たちのゲームはすべてのデータをお使いの端末に保存し、私たちは個人データを収集しません。'
        }
      ]
    },
    {
      id: "changes",
      heading: "この規約の変更",
      blocks: [
        {
          kind: "paragraph",
          html: "私たちは、この規約を更新することがあります。その場合は、このページと、ページ上部の「最終更新日」を更新します。変更後もゲームを利用し続けた場合は、更新後の規約が適用されます。"
        }
      ]
    },
    {
      id: "contact",
      heading: "お問い合わせ",
      blocks: [
        {
          kind: "paragraph",
          html: "この規約に関するご質問は、{email:support} までお寄せください。"
        }
      ]
    }
  ]
};
