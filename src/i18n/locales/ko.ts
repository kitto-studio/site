/** @file Korean UI strings: the {@link UIStrings} table in the friendly polite form (해요체). */
import type { UIStrings } from "../types";

/** Korean strings, translated from English. */
export const ko: UIStrings = {
  meta: {
    home: {
      title: "틀림없이 해 볼 만한 게임.",
      description: "저희는 작은 가족 스튜디오 Kitto Studio예요. 휴대폰용 퍼즐 게임을 만들어요."
    },
    about: {
      title: "스튜디오 소개",
      description:
        "Kitto Studio는 알렉스와 한나, 두 사람이에요. 휴대폰용 퍼즐 게임을 함께, 저희만의 속도로 만들어요."
    },
    games: {
      title: "게임",
      description: "휴대폰용 퍼즐 게임을 만들어요. 지금 작업 중인 게임을 소개할게요."
    },
    memoryMissing: {
      title: "A Memory Missing: Merge Game",
      description:
        "병원에서 깨어난 청년은 아무것도 기억하지 못해요. 침대 곁에는 이미 탐정이 기다리고 있어요."
    },
    support: {
      title: "고객 지원",
      description:
        "질문, 게임 속 문제, 아이디어, 데이터 관련 요청까지 모두 주소 하나로 받아요. 보내 주신 메일은 모두 읽어요."
    },
    privacy: {
      title: "개인정보 처리방침",
      description:
        "Kitto Studio 게임은 진행 상황을 기기에 저장해요. 계정도, 분석도, 광고도, 추적도 없어요."
    },
    terms: {
      title: "이용약관",
      description: "Kitto Studio 게임과 kitto.studio 웹사이트의 이용약관이에요."
    },
    deleteData: {
      title: "데이터 삭제",
      description:
        "Kitto Studio 게임에서 데이터를 삭제하는 방법이에요. 계정도 없고 저희 서버에도 아무것도 없어요. 기기에서 직접 지우면 돼요."
    },
    notFound: {
      title: "페이지를 찾을 수 없어요",
      description: "페이지가 없거나 다른 곳으로 옮겨졌어요."
    }
  },
  chrome: {
    skip: "본문으로 건너뛰기",
    homeLabel: "Kitto Studio 홈",
    navLabel: "주 메뉴",
    nav: { games: "게임", about: "소개", support: "고객 지원" },
    footer: {
      label: "약관 및 지원",
      privacy: "개인정보 처리방침",
      terms: "이용약관",
      deleteData: "데이터 삭제",
      support: "고객 지원",
      copyright: "© 2026 Kitto Studio"
    },
    theme: { label: "테마", system: "시스템", light: "라이트", dark: "다크" },
    language: { label: "언어" },
    menu: { open: "메뉴", close: "닫기" }
  },
  root: {
    heading: "언어를 선택하세요"
  },
  home: {
    hero: {
      title: "틀림없이 해 볼 만한 게임.",
      lead: "저희는 작은 가족 스튜디오 Kitto Studio예요. 휴대폰용 퍼즐 게임을 만들어요."
    },
    games: {
      title: "저희 게임",
      lead: "첫 번째 게임을 개발하고 있어요. 앞으로 더 많은 게임이 나올 거예요.",
      comingSoon: "출시 예정",
      slot: "새 게임",
      genre: "탐정 머지 게임",
      platforms: "iPhone과 Android용"
    },
    about: {
      title: "저희 소개",
      text: "Kitto Studio는 알렉스와 한나, 두 사람이에요. 모든 게임을 함께, 저희만의 속도로 만들어요.",
      kitto: "きっと(kitto)는 일본어로 ‘분명히’라는 뜻이에요.",
      more: "스튜디오 더 알아보기"
    },
    support: {
      title: "도움이 필요하세요?",
      text: "{email}로 메일을 보내 주세요. 보내 주신 메일은 모두 읽어요.",
      cta: "메일 보내기"
    }
  },
  about: {
    title: "작은 가족 스튜디오",
    lead: "Kitto Studio는 알렉스와 한나, 두 사람이에요. 휴대폰용 퍼즐 게임을 함께, 저희만의 속도로 만들어요.",
    who: {
      title: "저희 이야기",
      first: "저희는 두 사람이에요. 가족이고, 스튜디오는 둘이 함께하는 일이에요.",
      second:
        "모든 게임은 저희 식탁에서 시작돼요. 함께 구상하고, 만들고, 다른 누군가에게 보여 주기 전에 여러 번 직접 플레이해요.",
      dioramaAlt: "책상 두 개가 마주 보고, 노트북 두 대와 찻잔 두 개가 놓인 작은 종이 스튜디오 방."
    },
    name: {
      title: "왜 Kitto라는 이름일까요",
      first:
        "きっと(kitto)는 일본어로 ‘분명히’라는 뜻이에요. 무언가 이루어지리라 믿을 때 쓰는 말이에요. 분명히 잘될 거야, 하고요.",
      second:
        "저희는 그 조용한 확신이 좋아요. 게임 하나를 만드는 데는 오랜 시간이 걸려요. 그래도 모든 게임이 분명히 완성될 거라고 믿어요.",
      kana: "きっと",
      reading: "kitto"
    },
    how: {
      title: "저희가 일하는 방식",
      small: {
        title: "일부러 작게",
        text: "단 두 사람이라 모든 디테일이 저희 손을 거쳐요."
      },
      care: {
        title: "퍼즐 하나하나 꼼꼼하게",
        text: "공정하고 명확하다고 느낄 때까지 퍼즐을 하나하나 테스트해요. 아직 준비가 안 됐다면 기다려요."
      },
      pace: {
        title: "저희만의 속도로",
        text: "서두르지 않아요. 게임은 달력이 정한 날이 아니라, 좋아졌을 때 나와요."
      }
    },
    hello: {
      title: "연락하기",
      text: "질문, 아이디어, 따뜻한 한마디도 좋아요. {email}로 보내 주세요. 보내 주신 메일은 모두 읽어요.",
      support: "게임 관련 도움이 필요하세요? {link} 페이지를 확인하세요.",
      supportLink: "고객 지원"
    }
  },
  games: {
    title: "저희 게임",
    lead: "휴대폰용 퍼즐 게임을 만들어요. 지금 작업 중인 게임을 소개할게요.",
    card: {
      genre: "탐정 머지 게임",
      teaser:
        "병원에서 깨어난 청년은 아무것도 기억하지 못해요. 침대 곁에는 이미 탐정이 기다리고 있어요.",
      status: "iPhone과 Android 출시 예정",
      cta: "게임 소개"
    },
    slot: {
      name: "새 게임",
      soon: "출시 예정",
      note: "다음 게임은 준비되면 여기에 소개할게요."
    },
    help: "게임에 대해 궁금한 점이 있으세요? {link} 페이지를 확인하세요.",
    helpLink: "고객 지원"
  },
  game: {
    name: "A Memory Missing: Merge Game",
    breadcrumb: { label: "이동 경로", games: "게임" },
    tags: { genre: "탐정 머지 게임", status: "iPhone과 Android 출시 예정" },
    gallery: {
      title: "스크린샷과 아트",
      wardLabel: "키 아트",
      wardAlt: "키 아트: 밤의 병실. 침대에서 잠든 청년 곁에서 탐정과 한 여성이 이야기하고 있어요.",
      splashLabel: "로딩 화면",
      splashAlt:
        "게임 로딩 화면: 둥근 프레임 안에 병원 침대에서 잠든 청년이 보여요. 그 아래에는 게임 제목과 가득 찬 로딩 바가 있어요.",
      previous: "이전 이미지",
      next: "다음 이미지",
      open: "전체 화면으로 보기",
      show: "이미지 {n}/{total} 보기: {label}",
      count: "{n}/{total}",
      viewer: "이미지 뷰어",
      close: "닫기"
    },
    story: {
      title: "스토리",
      premise:
        "병원에서 깨어난 청년은 아무것도 기억하지 못해요. 침대 곁에는 이미 탐정이 기다리고 있어요. 단서를 합치고, 잃어버린 기억을 하나씩 되찾아, 그가 잊어버린 그날 밤에 무슨 일이 있었는지 밝혀내세요."
    },
    platforms: {
      title: "플랫폼",
      iphone: "iPhone",
      android: "Android",
      soon: "출시 예정",
      note: "아직 출시일은 정해지지 않았어요. 게임이 나오면 여기에 스토어 링크를 추가할게요."
    },
    features: {
      title: "게임 특징",
      merge: {
        title: "합쳐서 단서 찾기",
        text: "보드 위의 아이템을 합쳐 보세요. 작은 물건이 단서로 바뀌어요."
      },
      memories: {
        title: "기억을 하나씩",
        text: "단서 하나하나가 그가 잊어버린 밤의 한 조각을 되찾아 줘요."
      },
      solve: {
        title: "풀어야 할 이야기",
        text: "조각을 맞춰 실제로 무슨 일이 있었는지 알아내세요."
      },
      offline: {
        title: "오프라인 플레이",
        text: "인터넷 연결이 필요 없어요. 진행 상황은 기기에 저장돼요."
      }
    },
    help: {
      title: "도움말 및 개인정보",
      text: "게임에 대한 질문이나 문제가 있으세요? {supportLink}로 연락해 주세요. 게임이 데이터를 어떻게 다루는지는 {privacyLink}에서 확인할 수 있어요.",
      supportLink: "고객 지원 페이지",
      privacyLink: "개인정보 처리방침"
    },
    board: {
      title: "단서를 합쳐 보세요",
      lead: "아이템을 같은 아이템 위로 끌어다 놓아 합치세요. 세 가지 체인을 모두 완성하면 기억 하나를 되찾아요.",
      hint: "또는 아이템을 탭한 다음 같은 아이템을 탭하세요.",
      hintMouse: "또는 아이템을 클릭한 다음 같은 아이템을 클릭하세요.",
      keys: "화살표 키로 칸을 이동해요. Enter 또는 Space로 아이템을 집고 놓아요. Esc를 누르면 제자리로 돌아가요.",
      caseTitle: "찾아야 할 단서",
      progress: "찾은 단서: {n}/3",
      newBoard: "새 보드",
      empty: "빈칸",
      picked: "집은 아이템: {item}. 같은 아이템이나 빈칸을 고르세요.",
      merged: "합쳤어요: {item}.",
      found: "단서 발견: {item}.",
      missing: "{item}: 아직 찾지 못했어요",
      winTitle: "기억 하나가 돌아왔어요.",
      winText: "그가 잊어버린 밤의 한 조각. 나머지는 게임에서 만나요.",
      again: "다시 하기"
    },
    items: {
      note1: "찢어진 종잇조각",
      note2: "접힌 쪽지",
      note3: "봉인된 편지",
      key1: "낡은 열쇠",
      key2: "열쇠 꾸러미",
      key3: "잠긴 상자",
      photo1: "사진 귀퉁이",
      photo2: "반쪽 사진",
      photo3: "액자 사진",
      memory: "기억"
    }
  },
  support: {
    title: "도움이 필요하세요? 메일을 보내 주세요.",
    lead: "질문, 게임 속 문제, 아이디어, 데이터 관련 요청까지 모두 주소 하나로 받아요. 보내 주신 메일은 모두 읽어요.",
    mail: {
      title: "이메일 주소",
      write: "메일 쓰기",
      copy: "주소 복사",
      copied: "복사됨",
      copiedNote: "주소가 클립보드에 복사되었어요.",
      copyFail: "위의 주소를 선택해서 복사하세요."
    },
    letter: {
      title: "메일에 적어 주세요",
      lead: "몇 가지 정보가 있으면 문제를 더 빨리 찾을 수 있어요.",
      game: "게임 이름",
      device: "휴대폰 또는 태블릿 모델",
      os: "iOS 또는 Android 버전(설정에서 확인할 수 있어요)",
      what: "무슨 일이 있었는지, 원래 어떻게 될 거라 예상했는지. 스크린샷이 있으면 큰 도움이 돼요."
    },
    faq: {
      title: "자주 묻는 질문",
      progressQuestion: "진행 상황은 어디에 저장되나요?",
      progressAnswer:
        "기기에 저장돼요. 진행 상황은 플레이하는 휴대폰이나 태블릿에 남아요. 게임을 삭제하면 진행 상황도 함께 삭제돼요.",
      deleteQuestion: "데이터는 어떻게 삭제하나요?",
      deleteAnswer: "{link} 페이지의 안내를 따라 주세요. 메일을 보내 주셔도 도와드릴게요.",
      deleteLink: "데이터 삭제",
      privacyQuestion: "개인정보는 어떻게 다루나요?",
      privacyAnswer: "게임이 어떤 데이터를 왜 사용하는지는 {link}에서 설명해요.",
      privacyLink: "개인정보 처리방침"
    }
  },
  legal: {
    titles: {
      privacy: "개인정보 처리방침",
      terms: "이용약관",
      deleteData: "데이터 삭제"
    },
    contents: "목차",
    inShort: "요약",
    updated: "최종 업데이트: {date}",
    draft: "초안이에요. {placeholder}처럼 강조 표시된 항목은 아직 채워지지 않았어요.",
    fallback: "이 페이지는 영어로 제공돼요."
  },
  deleteData: {
    facts: {
      developer: "개발자",
      apps: "앱",
      appsValue: "A Memory Missing: Merge Game 및 앞으로 나올 Kitto 게임",
      ids: "앱 ID"
    },
    cta: "삭제 요청 메일 보내기",
    mailSubject: "내 데이터 삭제",
    deleted: "삭제됨",
    kept: "보관됨",
    nothing: "없음.",
    nothingNote: "삭제 후에는 어떤 데이터도 보관하지 않아요."
  },
  notFound: {
    title: "페이지를 찾을 수 없어요",
    text: "페이지가 없거나 다른 곳으로 옮겨졌어요.",
    home: "홈으로 가기"
  }
};
