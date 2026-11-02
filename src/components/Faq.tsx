/**
 * @file Faq (design-context §6 A5): a heading and short questions with their answers, set on the
 * paper as a description list, each pair under a hairline.
 */
import type { ComponentChildren, VNode } from "preact";

/** One question and its answer. */
export type FaqItem = {
  /** The question, already typeset. */
  question: string;
  /** The answer: text, or text with a link in it. */
  answer: ComponentChildren;
};

/** Faq props. */
type FaqProps = {
  /** Id of the heading, which names the section. */
  id: string;
  /** Section heading, already typeset. */
  title: string;
  /** The questions in reading order. */
  items: FaqItem[];
};

/**
 * Render a list of questions and answers.
 *
 * @param props - Faq props.
 * @param props.id - Id of the heading.
 * @param props.title - Section heading.
 * @param props.items - The questions and answers.
 * @returns A `<section>` with the heading and a `<dl>` of the pairs.
 * @example
 * ```tsx
 * <Faq id="support-faq" title={faq.title} items={[{ question: faq.progressQuestion, answer: faq.progressAnswer }]} />
 * ```
 */
export function Faq({ id, title, items }: FaqProps): VNode {
  return (
    <section data-component="faq" aria-labelledby={id}>
      <h2 id={id}>{title}</h2>
      <dl>
        {items.map(item => (
          <div key={item.question} data-faq-item>
            <dt>{item.question}</dt>
            <dd>{item.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
