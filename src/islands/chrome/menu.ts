/**
 * @file Phone menu: the paper sheet under the header, modal while open. The rest of the page is
 * made inert, Tab cycles through the logo, the Menu button and the sheet, and Esc, the scrim, a
 * link or a wide screen close it. The scroll lock is CSS, keyed on `data-menu-open` of the header.
 */

/** Tab stops of the sheet: links, buttons, and the checked radio of the theme switch. */
const FOCUSABLE = "a[href], button, input:checked";

/** The elements each open menu made inert, to give back exactly those on close. */
const madeInert = new WeakMap<Element, Element[]>();

/**
 * The menu's button and sheet inside the header.
 *
 * @param root - The header.
 * @returns The Menu button and the sheet, when the header has them.
 */
function menuOf(root: Element): { toggle: HTMLElement; sheet: HTMLElement } | undefined {
  const toggle = root.querySelector<HTMLElement>("[data-menu-toggle]");
  const sheet = root.querySelector<HTMLElement>("[data-menu-sheet]");
  return toggle && sheet ? { toggle, sheet } : undefined;
}

/**
 * Whether the phone menu is open.
 *
 * @param root - The header.
 * @returns True while the sheet shows.
 */
export function isMenuOpen(root: HTMLElement): boolean {
  return "menuOpen" in root.dataset;
}

/**
 * Whether a sibling is left as it is: the branch that holds the header, a script, or an element
 * that is inert already (not this menu's to give back).
 *
 * @param sibling - A child of the branch's parent.
 * @param branch - The child that holds the header.
 * @returns True when the sibling must not be made inert.
 */
function isSkipped(sibling: Element, branch: Element): boolean {
  return sibling === branch || sibling.tagName === "SCRIPT" || sibling.hasAttribute("inert");
}

/**
 * Make the siblings of one branch inert.
 *
 * @param branch - The element that holds the header, at this level.
 * @param parent - Its parent.
 * @returns The siblings this call made inert, in document order.
 */
function inertSiblings(branch: Element, parent: Element): Element[] {
  const changed: Element[] = [];
  for (const sibling of parent.children) {
    if (isSkipped(sibling, branch)) continue;
    sibling.setAttribute("inert", "");
    changed.push(sibling);
  }
  return changed;
}

/**
 * Make everything outside `root` inert: its siblings, and its ancestors' siblings up to `<body>`.
 *
 * @param root - The header.
 * @returns The elements this call made inert.
 */
function makeOutsideInert(root: Element): Element[] {
  const changed: Element[] = [];
  let node: Element = root;
  while (node !== document.body && node.parentElement) {
    const parent: Element = node.parentElement;
    changed.push(...inertSiblings(node, parent));
    node = parent;
  }
  return changed;
}

/**
 * Open the phone menu: the sheet shows, the page under it goes inert and focus moves to the
 * first link of the sheet.
 *
 * @param root - The header.
 * @returns {void} Nothing; the menu is open and modal.
 */
function openMenu(root: HTMLElement): void {
  // Open the sheet, make the page behind it inert and move the focus into the sheet.
  const menu = menuOf(root);
  if (menu === undefined || isMenuOpen(root)) return;
  root.dataset.menuOpen = "";
  menu.toggle.setAttribute("aria-expanded", "true");
  menu.sheet.removeAttribute("inert");
  madeInert.set(root, makeOutsideInert(root));
  menu.sheet.querySelector<HTMLElement>(FOCUSABLE)?.focus({ preventScroll: true });
}

/**
 * Close the phone menu and give the page back.
 *
 * @param root - The header.
 * @param returnFocus - Move focus back to the Menu button (Esc, the scrim, the button itself).
 * @returns {void} Nothing; the menu is closed and the page is live again.
 */
export function closeMenu(root: HTMLElement, returnFocus: boolean): void {
  const menu = menuOf(root);
  if (menu === undefined || !isMenuOpen(root)) return;
  delete root.dataset.menuOpen;
  menu.toggle.setAttribute("aria-expanded", "false");
  menu.sheet.setAttribute("inert", "");
  for (const element of madeInert.get(root) ?? []) element.removeAttribute("inert");
  madeInert.delete(root);
  if (returnFocus) menu.toggle.focus();
}

/**
 * Close the phone menu because the screen is now wide enough for the full header. The sheet and the
 * Menu button are hidden there, so focus they held moves to the current nav link, else the logo,
 * instead of falling back to `<body>`.
 *
 * @param root - The header.
 * @returns {void} Nothing; the menu is closed and the focus is on a visible header control.
 */
export function closeMenuForWideScreen(root: HTMLElement): void {
  const menu = menuOf(root);
  if (menu === undefined || !isMenuOpen(root)) return;
  // The browser may hide the sheet, and drop its focus to <body>, before this change runs. The
  // rest of the page is inert while the menu is open, so focus on <body> was the menu's too.
  const active = document.activeElement;
  const isLost = active === null || active === document.body;
  const hadFocus = isLost || active === menu.toggle || menu.sheet.contains(active);
  closeMenu(root, false);
  if (!hadFocus) return;
  const target =
    root.querySelector<HTMLElement>('[data-nav] a[aria-current="page"]') ??
    root.querySelector<HTMLElement>("[data-brand]");
  target?.focus({ preventScroll: true });
}

/**
 * Open or close the phone menu from the Menu button.
 *
 * @param root - The header.
 * @returns {void} Nothing; the menu is toggled.
 */
export function toggleMenu(root: HTMLElement): void {
  if (isMenuOpen(root)) closeMenu(root, true);
  else openMenu(root);
}

/**
 * Keep Tab inside the open menu: past the last element of the sheet it returns to the logo, and
 * Shift+Tab from the logo goes to the last element.
 *
 * @param root - The header.
 * @param event - The Tab key press.
 * @returns {void} Nothing; the focus wraps around at either end of the loop.
 */
export function trapFocus(root: HTMLElement, event: KeyboardEvent): void {
  // Guard: a header with a menu.
  const menu = menuOf(root);
  if (menu === undefined) return;

  // The loop of tab stops: the logo, the Menu button, then the sheet.
  const loop = [
    root.querySelector("[data-brand]"),
    menu.toggle,
    ...menu.sheet.querySelectorAll(FOCUSABLE)
  ].filter((element): element is HTMLElement => element instanceof HTMLElement);
  const first = loop[0];
  const last = loop.at(-1);
  if (first === undefined || last === undefined) return;

  // Whether this Tab would leave the loop at its start or at its end.
  const active = document.activeElement;
  const focused = active instanceof HTMLElement ? loop.indexOf(active) : -1;
  const isLeavingStart = event.shiftKey && focused <= 0;
  const isLeavingEnd = !event.shiftKey && (focused === -1 || focused === loop.length - 1);

  // Wrap around instead of leaving.
  if (isLeavingStart) {
    event.preventDefault();
    last.focus();
  } else if (isLeavingEnd) {
    event.preventDefault();
    first.focus();
  }
}
