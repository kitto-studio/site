/**
 * @file Korean «Privacy Policy», translated from the English text in the formal style (합니다체).
 *
 * Keeps every slot of the English document: `{email:support}` and `{route:deleteData}`.
 */
import type { LegalDocument } from "../../types";

/** The Korean «Privacy Policy» document. */
export const privacyKo: LegalDocument = {
  intro:
    "이 방침은 Kitto 게임을 플레이하거나 kitto.studio를 방문하거나 저희에게 메일을 보낼 때 이용자의 정보가 어떻게 처리되는지 설명합니다. 간단히 말해, 저희 게임은 모든 데이터를 기기에 보관하며 저희는 개인정보를 수집하지 않습니다.",
  inShort: [
    "저희 게임은 진행 상황과 설정을 기기에만 저장합니다.",
    "계정, 분석, 광고, 추적이 없습니다.",
    "개인정보를 수집하거나 판매하지 않습니다.",
    "메일을 보내시면 그 주소는 답장하는 데에만 사용합니다."
  ],
  sections: [
    {
      id: "who",
      heading: "저희 소개",
      blocks: [
        {
          kind: "paragraph",
          html: "Kitto Studio는 휴대폰용 퍼즐 게임을 만드는 작은 가족 스튜디오입니다. Kitto Studio는 개인인 Hanna Kucherenko(주소: Calle Ventura Selva González 9, Bungalow 28, 03130 Gran Alacant, Santa Pola (Alicante), Spain)가 운영하며, 운영자는 이 방침에 설명된 정보에 대한 책임을 집니다. {email:support}로 연락하실 수 있습니다."
        }
      ]
    },
    {
      id: "scope",
      heading: "이 방침의 적용 범위",
      blocks: [
        { kind: "paragraph", html: "이 방침은 다음에 적용됩니다." },
        {
          kind: "list",
          items: [
            '저희 게임. 앱 ID는 studio.kitto로 시작합니다(예: <span translate="no">studio.kitto.memorymissing</span>). 첫 번째 게임은 A Memory Missing: Merge Game이며 아직 출시되지 않았습니다.',
            "저희 웹사이트 kitto.studio.",
            "{email:support}로 보내신 메일."
          ]
        }
      ]
    },
    {
      id: "games",
      heading: "저희 게임",
      blocks: [
        {
          kind: "paragraph",
          html: "저희 게임은 진행 상황과 설정을 기기에만 저장합니다. 이를 저희나 다른 누구에게도 전송하지 않습니다."
        },
        {
          kind: "list",
          items: [
            "<strong>계정 없음.</strong> 가입하거나 로그인할 필요가 없습니다.",
            "<strong>분석 없음.</strong> 플레이 방식을 측정하지 않습니다.",
            "<strong>광고 없음.</strong> 저희 게임에는 광고가 표시되지 않습니다.",
            "<strong>추적 없음.</strong> 앱이나 웹사이트를 넘나들며 이용자를 추적하지 않습니다.",
            "<strong>데이터 수집 SDK 없음.</strong> 개인정보를 수집하는 서드파티 SDK를 사용하지 않습니다."
          ]
        },
        {
          kind: "paragraph",
          html: "저희는 게임을 통해 개인정보를 수집하지 않으므로, 판매하거나 공유할 개인정보도 없습니다."
        }
      ]
    },
    {
      id: "purchases",
      heading: "구매",
      blocks: [
        {
          kind: "paragraph",
          html: "게임에서 구매를 제공하는 경우, Apple App Store 또는 Google Play가 각자의 약관에 따라 이를 처리합니다. 저희는 이용자의 결제 정보를 받지 않습니다."
        },
        {
          kind: "paragraph",
          html: 'Apple과 Google이 데이터를 처리하는 방식은 <a href="https://www.apple.com/legal/privacy/" rel="noopener">Apple 개인정보 처리방침</a>과 <a href="https://policies.google.com/privacy" rel="noopener">Google 개인정보처리방침</a>에서 확인하십시오.'
        }
      ]
    },
    {
      id: "email",
      heading: "저희에게 메일을 보내실 때",
      blocks: [
        {
          kind: "paragraph",
          html: "{email:support}로 메일을 보내시면 저희는 이용자의 이메일 주소와 메시지를 받습니다. 이는 답장하는 데에만 사용합니다."
        },
        {
          kind: "paragraph",
          html: "도움을 드리는 데 필요한 기간 동안만 보관하며, 요청하시면 삭제합니다."
        }
      ]
    },
    {
      id: "website",
      heading: "저희 웹사이트",
      blocks: [
        {
          kind: "paragraph",
          html: "kitto.studio는 정적 웹사이트입니다. 쿠키와 분석 도구를 사용하지 않습니다."
        },
        {
          kind: "paragraph",
          html: "테마와 언어 선택은 브라우저의 로컬 스토리지에 저장됩니다. 이 정보는 브라우저 안에만 남으며 저희는 볼 수 없습니다. 브라우저 설정에서 언제든지 지울 수 있습니다."
        },
        {
          kind: "paragraph",
          html: '호스팅 제공업체인 Cloudflare는 사이트를 안전하게 유지하고 이용자에게 전달하기 위해 서버 로그에서 IP 주소 등 기술적 데이터를 처리할 수 있습니다. <a href="https://www.cloudflare.com/privacypolicy/" rel="noopener">Cloudflare 개인정보 처리방침</a>을 확인하십시오.'
        }
      ]
    },
    {
      id: "children",
      heading: "아동",
      blocks: [
        {
          kind: "paragraph",
          html: "저희 게임은 만 13세 이상 플레이어를 대상으로 합니다. 만 13세 미만 아동을 대상으로 하지 않으며, 아동의 개인정보를 고의로 수집하지 않습니다. 사실 저희 게임은 누구의 개인정보도 수집하지 않습니다."
        }
      ]
    },
    {
      id: "rights",
      heading: "이용자의 권리",
      blocks: [
        {
          kind: "paragraph",
          html: "거주 지역에 따라, 예를 들어 GDPR, UK GDPR 또는 CCPA에 따라 이용자에게는 다음과 같은 권리가 있습니다."
        },
        {
          kind: "list",
          items: [
            "저희가 보유한 이용자의 개인정보에 접근할 권리",
            "이를 정정할 권리",
            "이를 삭제하도록 할 권리",
            "저희의 이용 방식에 이의를 제기할 권리",
            "개인정보 보호 감독기관에 민원을 제기할 권리"
          ]
        },
        {
          kind: "paragraph",
          html: '실제로 저희가 보유할 수 있는 개인정보는 이용자가 보낸 메일뿐입니다. 이러한 권리를 행사하려면 {email:support}로 메일을 보내 주십시오. 데이터를 삭제하려면 <a href="{route:deleteData}">데이터 삭제</a>를 참고하십시오.'
        }
      ]
    },
    {
      id: "changes",
      heading: "방침 변경",
      blocks: [
        {
          kind: "paragraph",
          html: "이 방침을 변경하면 이 페이지와 상단의 ‘최종 업데이트’ 날짜를 업데이트합니다."
        }
      ]
    },
    {
      id: "contact",
      heading: "문의",
      blocks: [
        {
          kind: "paragraph",
          html: "개인정보에 관한 질문이 있으신가요? {email:support}로 메일을 보내 주십시오."
        }
      ]
    }
  ]
};
