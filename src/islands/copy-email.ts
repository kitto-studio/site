/**
 * @file The `copy-email` island (design-context §6 F3): «Copy address» on the support page.
 *
 * The async clipboard first: on success the button says «Copied» with a check and the status line
 * confirms it, then both reset. When the clipboard refuses (or does not exist, as on plain http),
 * the address is selected so the reader can copy it by hand, and the status line says so. The
 * translated texts come from the host's data attributes, written by `EmailCard`.
 */
import { createIsland, type Spa } from "@moku-labs/web/browser";

/** How long «Copied» stays before the button resets, ms. */
const RESET_DELAY = 2400;

/** Per-instance state. */
type CopyState = {
  /** The pending reset of the «Copied» state. */
  resetTimer: ReturnType<typeof setTimeout> | undefined;
};

/** The parts of the email card the island drives. */
type CopyView = {
  /** The island host, carrying the translated texts. */
  host: HTMLElement;
  /** The address text. */
  address: HTMLElement;
  /** The copy button. */
  button: HTMLElement;
  /** The button's label. */
  label: HTMLElement;
  /** The polite status line. */
  note: HTMLElement;
};

/** The idle label of each button, read once from the server markup. */
const idleLabels = new WeakMap<HTMLElement, string>();

/**
 * Find the parts of the card inside the island host.
 *
 * @param host - The island host.
 * @returns The parts, or undefined when the markup is not the email card's.
 */
function viewOf(host: Element): CopyView | undefined {
  const address = host.querySelector("[data-email-address]");
  const button = host.querySelector("[data-copy-button]");
  const label = host.querySelector("[data-copy-label]");
  const note = host.querySelector("[data-copy-note]");
  const isComplete =
    host instanceof HTMLElement &&
    address instanceof HTMLElement &&
    button instanceof HTMLElement &&
    label instanceof HTMLElement &&
    note instanceof HTMLElement;
  return isComplete ? { host, address, button, label, note } : undefined;
}

/**
 * Put the button back to «Copy address» and clear the status line.
 *
 * @param view - The card parts.
 * @returns {void} Nothing; the button and the status line are idle.
 */
function showIdle(view: CopyView): void {
  view.label.textContent = idleLabels.get(view.label) ?? view.label.textContent;
  delete view.button.dataset.state;
  view.note.textContent = "";
}

/**
 * Select the whole address, for a copy by hand.
 *
 * @param address - The address element.
 * @returns {void} Nothing; the address is the page's selection.
 */
function selectAddress(address: HTMLElement): void {
  const range = document.createRange();
  range.selectNodeContents(address);
  const selection = document.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
}

/**
 * Copy the address. Success shows «Copied» until the reset; a refusal selects the address and
 * shows how to copy it.
 *
 * @param ctx - The island context.
 * @returns Resolves when the clipboard has answered.
 */
async function copyAddress(ctx: Spa.IslandContext<CopyState>): Promise<void> {
  const view = viewOf(ctx.el);
  if (view === undefined) return;
  clearTimeout(ctx.state.resetTimer);
  try {
    await navigator.clipboard.writeText(view.address.textContent?.trim() ?? "");
  } catch {
    showIdle(view);
    selectAddress(view.address);
    view.note.textContent = view.host.dataset.failNote ?? "";
    return;
  }
  view.label.textContent = view.host.dataset.copiedLabel ?? "";
  view.button.dataset.state = "done";
  view.note.textContent = view.host.dataset.copiedNote ?? "";
  ctx.state.resetTimer = setTimeout(() => showIdle(view), RESET_DELAY);
}

/** Support page: copy the email address, with a fallback when the clipboard refuses. */
export const copyEmailIsland = createIsland("copy-email", {
  state: (): CopyState => ({ resetTimer: undefined }),
  /**
   * Remember the idle label, reveal the copy button and clear a pending reset on teardown.
   *
   * @param ctx - The island context.
   * @returns {void} Nothing; the copy button shows and works until the page leaves.
   */
  onMount(ctx) {
    const view = viewOf(ctx.el);
    if (view === undefined) return;
    idleLabels.set(view.label, view.label.textContent);
    view.host.dataset.ready = "";
    ctx.cleanup(() => clearTimeout(ctx.state.resetTimer));
  },
  events: {
    "click [data-copy-button]": ctx => {
      void copyAddress(ctx);
    }
  }
});
