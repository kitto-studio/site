import { describe, expect, it } from "vitest";
import { typeset } from "../../src/lib/typography";

const NBSP = "\u{A0}";
const NARROW = "\u{202F}";

describe("typeset: Russian and Ukrainian", () => {
  // Catches: a one- or two-letter word («в», «не») left hanging at the end of a line.
  it("binds a word of one or two letters to the next word", () => {
    expect(typeset("Мы не знаем, в чём дело", "ru")).toBe(
      `Мы${NBSP}не${NBSP}знаем, в${NBSP}чём дело`
    );
    expect(typeset("Ми не збираємо дані", "uk")).toBe(`Ми${NBSP}не${NBSP}збираємо дані`);
  });

  // Catches: a rule that consumes the separator, so only every second short word gets bound.
  it("binds a run of short words in one pass", () => {
    expect(typeset("и в доме", "ru")).toBe(`и${NBSP}в${NBSP}доме`);
  });

  // Catches: an off-by-one in the word length that also glues three-letter words.
  it("leaves words of three letters and more alone", () => {
    expect(typeset("Для вас все игры", "ru")).toBe("Для вас все игры");
  });

  // Catches: a spaced em dash that starts a new line.
  it("keeps an em dash on the line of the word before it", () => {
    expect(typeset("Kitto Studio — маленькая студия", "ru")).toBe(
      `Kitto Studio${NBSP}— маленькая студия`
    );
  });

  // Catches: no-break spaces written inside a tag, which breaks the markup of a legal string.
  it("changes text only, never tags or entities", () => {
    const html = '<a href="https://example.com/a b" rel="noopener">в доме</a> и&nbsp;<b>да</b>';
    expect(typeset(html, "ru")).toBe(
      `<a href="https://example.com/a b" rel="noopener">в${NBSP}доме</a> и&nbsp;<b>да</b>`
    );
  });

  // Catches: a second pass (or a string typeset twice on its way to the page) adding more spaces.
  it("is stable when applied twice", () => {
    const once = typeset("Он сказал — и в дом", "ru");
    expect(typeset(once, "ru")).toBe(once);
  });
});

describe("typeset: French", () => {
  // Catches: «?» or «!» wrapping onto its own line, the most visible French typography error.
  it("puts a narrow no-break space before ; : ! ?", () => {
    expect(typeset("Bonjour ! Ça va ? Oui ; merci", "fr")).toBe(
      `Bonjour${NARROW}! Ça va${NARROW}? Oui${NARROW}; merci`
    );
    expect(typeset("Note: lisez ceci", "fr")).toBe(`Note${NARROW}: lisez ceci`);
  });

  // Catches: the rule firing inside URLs, clock times or entities and corrupting them.
  it("leaves URLs, times and entities alone", () => {
    const text = "Voir https://kitto.studio à 10:30 et studio.kitto.&lt;game&gt;";
    expect(typeset(text, "fr")).toBe(text);
  });

  // Catches: guillemets that split from the quoted words at a line break.
  it("puts a narrow no-break space inside guillemets", () => {
    expect(typeset("« Supprimer mes données »", "fr")).toBe(
      `«${NARROW}Supprimer mes données${NARROW}»`
    );
    expect(typeset("«Supprimer»", "fr")).toBe(`«${NARROW}Supprimer${NARROW}»`);
  });

  // Catches: doubled narrow spaces when an already typeset string is typeset again.
  it("is stable when applied twice", () => {
    const once = typeset("« Quoi ?! » Oui : non", "fr");
    expect(typeset(once, "fr")).toBe(once);
  });

  // Catches: the brand name altered in French («A Memory Missing : Merge Game»), and a rule changing
  // text marked translate="no", while the text around both still gets its spaces.
  it("leaves the game name and translate=no text as written", () => {
    expect(typeset("A Memory Missing: Merge Game", "fr")).toBe("A Memory Missing: Merge Game");
    expect(typeset("Le jeu A Memory Missing: Merge Game. Note: oui", "fr")).toBe(
      `Le jeu A Memory Missing: Merge Game. Note${NARROW}: oui`
    );
    expect(typeset('<span translate="no">Note: id</span> Note: oui', "fr")).toBe(
      `<span translate="no">Note: id</span> Note${NARROW}: oui`
    );
  });
});

describe("typeset: other locales", () => {
  // Catches: Cyrillic or French rules leaking into English, German or Japanese text.
  it("returns the text unchanged", () => {
    const text = "We do — and so do I: a b ?";
    expect(typeset(text, "en")).toBe(text);
    expect(typeset(text, "de")).toBe(text);
    expect(typeset("私たちは — はい", "ja")).toBe("私たちは — はい");
  });
});
