/**
 * @file InShort: the «In short» box of a legal page, a window cut into the sheet with the kitto dot
 * as bullets (G «In short box»).
 */
import type { VNode } from "preact";

/** InShort props. */
type InShortProps = {
  /** Box heading, already typeset. */
  title: string;
  /** Bullet items as ready HTML. */
  items: readonly string[];
  /** Language of the items when it differs from the page (the English fallback). */
  lang?: string | undefined;
};

/**
 * Render the «In short» box.
 *
 * @param props - InShort props.
 * @param props.title - Box heading.
 * @param props.items - Bullet items as ready HTML.
 * @param props.lang - Language of the items when it differs from the page.
 * @returns The box, labelled by its heading.
 * @example
 * ```tsx
 * <InShort title="In short" items={["No accounts, no analytics, no advertising, no tracking."]} />
 * ```
 */
export function InShort({ title, items, lang }: InShortProps): VNode {
  return (
    <aside data-component="in-short" aria-labelledby="in-short-title">
      <h2 id="in-short-title">{title}</h2>
      <ul lang={lang}>
        {items.map(item => (
          <li key={item} dangerouslySetInnerHTML={{ __html: item }} />
        ))}
      </ul>
    </aside>
  );
}
