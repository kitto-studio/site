/**
 * @file The logo's own dot, alone: the brand's «current» marker (brand-system §2).
 *
 * The path and transform are the wordmark's dot, byte for byte, framed by the dot's own box
 * (`viewBox="320 392 75 74"`). Never redrawn. It carries no size or colour: the component it sits
 * in sizes it and fills its path with `--dot`.
 */
import type { VNode } from "preact";

/**
 * Render the dot marker, hidden from assistive technology (the state it marks is in `aria-current`
 * or `aria-checked`).
 *
 * @returns The dot SVG.
 * @example
 * ```tsx
 * <a href={href} aria-current="page"><DotMark /><span>{label}</span></a>
 * ```
 */
export function DotMark(): VNode {
  return (
    <svg viewBox="320 392 75 74" data-dot-mark aria-hidden="true">
      <g transform="translate(0,1024) scale(0.1,-0.1)">
        <path
          d="M3455 6307 c-213 -70 -317 -317 -217 -519 145 -295 587 -258 687 58
53 168 -40 374 -202 446 -59 27 -207 35 -268 15z"
        />
      </g>
    </svg>
  );
}
