/**
 * @file Tag (design-context §6 G «Tag / pill»): a small label cut into the paper, for a genre, a
 * status or a platform. A status carries the orange dot. Two looks: `well`, a recess pressed into
 * the paper, and `line`, a thin outline for tags that sit on the page itself.
 */
import type { ComponentChildren, VNode } from "preact";

/** Look of a tag: a recess in the paper, or a hairline outline. */
export type TagTone = "well" | "line";

/** Tag props. */
export type TagProps = {
  /** The label. */
  children: ComponentChildren;
  /** Look of the tag, `well` by default. */
  tone?: TagTone;
  /** Lead the label with the orange dot, for a status. */
  dot?: boolean;
  /** The smaller size, for a tag at the end of a list row. */
  compact?: boolean;
};

/**
 * Render a tag.
 *
 * @param props - Tag props.
 * @param props.children - The label.
 * @param props.tone - `well` (default) or `line`.
 * @param props.dot - Show the orange status dot.
 * @param props.compact - Use the smaller size.
 * @returns The tag as phrasing content.
 * @example
 * ```tsx
 * <Tag tone="line" dot>{strings.game.tags.status}</Tag>
 * ```
 */
export function Tag({ children, tone = "well", dot = false, compact = false }: TagProps): VNode {
  return (
    <span data-component="tag" data-tone={tone} data-compact={compact ? "" : undefined}>
      {dot ? <span data-tag-dot aria-hidden="true" /> : undefined}
      {children}
    </span>
  );
}
