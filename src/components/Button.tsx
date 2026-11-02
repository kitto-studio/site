/**
 * @file Button (design-context §6 G): the one filled orange button of a screen, or the quiet
 * paper button beside it. A link when it has an `href`, otherwise a `<button>`.
 */
import type { ComponentChildren, VNode } from "preact";

/** Look of a button: `primary` is the filled orange one (one per screen), `paper` the quiet one. */
export type ButtonVariant = "primary" | "paper";

/** Button props. Extra `data-*` attributes pass through for the islands that drive a button. */
export type ButtonProps = {
  /** The label. */
  children: ComponentChildren;
  /** Link target; without it the button is a `<button type="button">`. */
  href?: string;
  /** Look of the button, `primary` by default. */
  variant?: ButtonVariant;
  /** Element id, for labels and islands. */
  id?: string;
  /** Hooks for islands, such as `data-copy`. */
  [data: `data-${string}`]: string | undefined;
};

/**
 * Render a button or a button-styled link.
 *
 * @param props - Button props.
 * @param props.children - The label.
 * @param props.href - Link target; omitted for an action button.
 * @param props.variant - `primary` (filled orange) or `paper`.
 * @returns An `<a>` with an `href`, otherwise a `<button type="button">`.
 * @example
 * ```tsx
 * <Button href={`mailto:${EMAILS.support}`}>{strings.home.support.cta}</Button>
 * ```
 */
export function Button({ children, href, variant = "primary", ...rest }: ButtonProps): VNode {
  if (href === undefined) {
    return (
      <button type="button" data-component="button" data-variant={variant} {...rest}>
        {children}
      </button>
    );
  }
  return (
    <a href={href} data-component="button" data-variant={variant} {...rest}>
      {children}
    </a>
  );
}
