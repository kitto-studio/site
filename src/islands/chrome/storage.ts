/**
 * @file The reader's saved choices (`kitto-theme`, `kitto-lang`) in localStorage. Private modes and
 * blocked storage throw; a choice then lasts for the current page only.
 */

/**
 * Read a saved choice.
 *
 * @param key - Storage key.
 * @returns The saved value, or undefined when nothing is saved or storage is blocked.
 */
export function readChoice(key: string): string | undefined {
  try {
    return localStorage.getItem(key) ?? undefined;
  } catch {
    return undefined;
  }
}

/**
 * Save a choice. Blocked storage keeps it for the current page only.
 *
 * @param key - Storage key.
 * @param value - The value to save.
 * @returns {void} Nothing; the choice is in localStorage, when storage allows it.
 */
export function saveChoice(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage is blocked (private mode): the choice lasts for this page only.
  }
}
