/**
 * @file The address block of a postcard: the site address written on a ruled line. The support
 * card writes the support email large on a taller first line and the site address quietly under it.
 */
import type { ComponentChildren, VNode } from "preact";
import { COLOR } from "../tokens";

/** One ruled line: its height, the text's weight, size and colour. */
type Line = {
  /** Height of the line, px. */
  height: number;
  /** Font weight. */
  weight: 500 | 600;
  /** Font size, px. */
  size: number;
  /** Text colour. */
  color: string;
};

/** The ruled lines of the design. */
const LINES = {
  /** The site address. */
  address: { height: 58, weight: 600, size: 32, color: COLOR.ink },
  /** The support email, first line of the support card. */
  email: { height: 66, weight: 600, size: 40, color: COLOR.ink },
  /** The site address under the support email. */
  quiet: { height: 58, weight: 500, size: 30, color: COLOR.quiet }
} as const satisfies Record<string, Line>;

/** Ruled line props. */
type RuledLineProps = {
  /** The line's measures. */
  line: Line;
  /** `font-family` list of the text. */
  family: string;
  /** The text on the line. */
  children: ComponentChildren;
};

/**
 * Render one ruled line with its text sitting on the rule.
 *
 * @param props - Ruled line props.
 * @param props.line - The line's measures.
 * @param props.family - Font list.
 * @param props.children - The text.
 * @returns The line.
 */
function RuledLine({ line, family, children }: RuledLineProps): VNode {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        height: line.height,
        padding: "0 4px 8px",
        borderBottom: `2px solid ${COLOR.line}`,
        fontFamily: family,
        fontWeight: line.weight,
        fontSize: line.size,
        color: line.color
      }}
    >
      {children}
    </div>
  );
}

/** Address props. */
type AddressProps = {
  /** The site address, `kitto.studio`. */
  site: string;
  /** The support email; written first, large, when present. */
  email?: string | undefined;
  /** `font-family` list of the address and the email. */
  strong: string;
  /** `font-family` list of the quiet second line. */
  quiet: string;
};

/**
 * Render the address block.
 *
 * @param props - Address props.
 * @param props.site - The site address.
 * @param props.email - The support email, on the support card.
 * @param props.strong - Font list of the address and the email.
 * @param props.quiet - Font list of the quiet second line.
 * @returns The ruled address lines.
 * @example
 * ```tsx
 * <Address site="kitto.studio" email="support@kitto.studio" strong={families.strong} quiet={families.quiet} />
 * ```
 */
export function Address({ site, email, strong, quiet }: AddressProps): VNode {
  if (email === undefined) {
    return (
      <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <RuledLine line={LINES.address} family={strong}>
          {site}
        </RuledLine>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
      <RuledLine line={LINES.email} family={strong}>
        {email}
      </RuledLine>
      <RuledLine line={LINES.quiet} family={quiet}>
        {site}
      </RuledLine>
    </div>
  );
}
