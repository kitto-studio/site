/**
 * @file StepList: numbered instructions, each number a paper token (G «step token»), joined by a
 * dashed line. Used by the Android, iPhone and email steps of the delete page.
 */
import type { VNode } from "preact";

/** StepList props. */
type StepListProps = {
  /** One step per item, as ready HTML. */
  steps: readonly string[];
};

/**
 * Render numbered steps.
 *
 * @param props - StepList props.
 * @param props.steps - The steps as ready HTML.
 * @returns An ordered list drawn as step tokens.
 * @example
 * ```tsx
 * <StepList steps={["Open <b>Settings</b> on your phone.", "Tap <b>Apps</b>."]} />
 * ```
 */
export function StepList({ steps }: StepListProps): VNode {
  return (
    <ol data-component="step-list">
      {steps.map(step => (
        <li key={step} dangerouslySetInnerHTML={{ __html: step }} />
      ))}
    </ol>
  );
}
