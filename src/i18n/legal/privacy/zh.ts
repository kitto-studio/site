/**
 * @file Simplified Chinese «Privacy Policy», translated from the English text (formal 您).
 *
 * Keeps every slot of the English document: `{email:support}` and `{route:deleteData}`.
 */
import type { LegalDocument } from "../../types";

/** The Simplified Chinese «Privacy Policy» document. */
export const privacyZh: LegalDocument = {
  intro:
    "本政策说明当您玩 Kitto 游戏、访问 kitto.studio 或给我们写信时，您的信息会如何处理。简单来说：我们的游戏把所有数据都保存在您的设备上，我们不收集个人数据。",
  inShort: [
    "我们的游戏仅在您的设备上保存进度和设置。",
    "没有账号，没有数据分析，没有广告，没有追踪。",
    "我们不收集也不出售个人数据。",
    "如果您给我们发邮件，我们只会用您的邮箱地址回复您。"
  ],
  sections: [
    {
      id: "who",
      heading: "我们是谁",
      blocks: [
        {
          kind: "paragraph",
          html: "Kitto Studio 是一家小小的家庭工作室，专为手机制作益智游戏。Kitto Studio 由个人 Hanna Kucherenko 运营，地址：Calle Ventura Selva González 9, Bungalow 28, 03130 Gran Alacant, Santa Pola (Alicante), Spain。运营者对本政策所述的信息负责。您可以通过 {email:support} 联系我们。"
        }
      ]
    },
    {
      id: "scope",
      heading: "本政策的适用范围",
      blocks: [
        { kind: "paragraph", html: "本政策适用于：" },
        {
          kind: "list",
          items: [
            '我们的游戏。其应用 ID 以 studio.kitto 开头，例如 <span translate="no">studio.kitto.memorymissing</span>。我们的第一款游戏是 A Memory Missing: Merge Game，尚未发布。',
            "我们的网站 kitto.studio。",
            "您发送到 {email:support} 的邮件。"
          ]
        }
      ]
    },
    {
      id: "games",
      heading: "我们的游戏",
      blocks: [
        {
          kind: "paragraph",
          html: "我们的游戏仅在您的设备上保存您的进度和设置，不会将其发送给我们或任何其他人。"
        },
        {
          kind: "list",
          items: [
            "<strong>没有账号。</strong>您无需注册或登录。",
            "<strong>没有数据分析。</strong>我们不统计您如何游玩。",
            "<strong>没有广告。</strong>我们的游戏不显示广告。",
            "<strong>没有追踪。</strong>我们不会跨应用或网站追踪您。",
            "<strong>没有收集数据的 SDK。</strong>我们不使用收集个人数据的第三方 SDK。"
          ]
        },
        {
          kind: "paragraph",
          html: "我们不通过游戏收集个人数据，因此也没有任何数据可以出售或分享。"
        }
      ]
    },
    {
      id: "purchases",
      heading: "购买",
      blocks: [
        {
          kind: "paragraph",
          html: "如果游戏提供购买项目，将由 Apple App Store 或 Google Play 按照其各自的条款进行处理。我们永远不会收到您的支付信息。"
        },
        {
          kind: "paragraph",
          html: '如需了解 Apple 和 Google 如何处理您的数据，请阅读<a href="https://www.apple.com/legal/privacy/" rel="noopener">Apple 隐私政策</a>和<a href="https://policies.google.com/privacy" rel="noopener">Google 隐私权政策</a>。'
        }
      ]
    },
    {
      id: "email",
      heading: "当您给我们写信时",
      blocks: [
        {
          kind: "paragraph",
          html: "如果您发邮件至 {email:support}，我们会收到您的邮箱地址和邮件内容。我们仅将其用于回复您。"
        },
        {
          kind: "paragraph",
          html: "我们只在帮助您所需的期限内保留这些信息，并会应您的要求将其删除。"
        }
      ]
    },
    {
      id: "website",
      heading: "我们的网站",
      blocks: [
        {
          kind: "paragraph",
          html: "kitto.studio 是一个静态网站，不使用 Cookie，也不进行数据分析。"
        },
        {
          kind: "paragraph",
          html: "网站会在您浏览器的本地存储中记住您选择的主题和语言。这些信息只保存在您的浏览器中，我们无法看到。您可以随时在浏览器设置中清除。"
        },
        {
          kind: "paragraph",
          html: '我们的托管服务提供商 Cloudflare 可能会在服务器日志中处理 IP 地址等技术数据，以保障网站安全并向您提供网站。请阅读<a href="https://www.cloudflare.com/privacypolicy/" rel="noopener">Cloudflare 隐私政策</a>。'
        }
      ]
    },
    {
      id: "children",
      heading: "儿童",
      blocks: [
        {
          kind: "paragraph",
          html: "我们的游戏面向 13 岁及以上的玩家，并非针对 13 岁以下的儿童，我们也不会在知情的情况下收集儿童的个人数据。事实上，我们的游戏不收集任何人的个人数据。"
        }
      ]
    },
    {
      id: "rights",
      heading: "您的权利",
      blocks: [
        {
          kind: "paragraph",
          html: "根据您所在的地区，例如依据 GDPR、UK GDPR 或 CCPA，您有权："
        },
        {
          kind: "list",
          items: [
            "访问我们持有的关于您的个人数据；",
            "更正这些数据；",
            "要求删除这些数据；",
            "反对我们使用这些数据的方式；",
            "向数据保护监管机构投诉。"
          ]
        },
        {
          kind: "paragraph",
          html: '实际上，我们可能持有的唯一个人数据就是您发给我们的邮件。如需行使上述任何权利，请写信至 {email:support}。如需删除您的数据，请参阅<a href="{route:deleteData}">删除数据</a>。'
        }
      ]
    },
    {
      id: "changes",
      heading: "本政策的变更",
      blocks: [
        {
          kind: "paragraph",
          html: "如果我们修改本政策，会更新本页面以及页面顶部的“最后更新”日期。"
        }
      ]
    },
    {
      id: "contact",
      heading: "联系我们",
      blocks: [{ kind: "paragraph", html: "对隐私有疑问？请写信至 {email:support}。" }]
    }
  ]
};
