/**
 * @file Placeholder: a field of a legal page that is not filled in yet, highlighted (F4).
 *
 * The same `<mark data-component="placeholder">` that `renderLegalHtml` writes around a placeholder
 * inside legal HTML, so one sheet styles both.
 */
import type { VNode } from "preact";

/** Placeholder props. */
type PlaceholderProps = {
  /** The placeholder with its brackets, such as `[ADDRESS]`. */
  text: string;
};

/**
 * Render an unfilled field.
 *
 * @param props - Placeholder props.
 * @param props.text - The placeholder with its brackets.
 * @returns The highlighted placeholder.
 * @example
 * ```tsx
 * <p>Draft. Highlighted fields such as <Placeholder text="[ADDRESS]" /> are not filled in yet.</p>
 * ```
 */
export function Placeholder({ text }: PlaceholderProps): VNode {
  return <mark data-component="placeholder">{text}</mark>;
}
