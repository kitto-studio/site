/**
 * @file LegalSection: one numbered section of a legal document (G «numbered legal section»). The
 * number hangs in the margin on wide screens and leads the heading on narrow ones.
 *
 * The section renders its blocks; a page can adjust one section through {@link SectionOptions}
 * (dot bullets, content after the blocks, or a wrapper around them).
 */
import type { ComponentChildren, VNode } from "preact";
import type { LegalBlock, LegalSection as LegalSectionData } from "../i18n/types";
import { StepList } from "./StepList";

/** How a page adjusts one section of its document. */
export type SectionOptions = {
  /** `dot`: bullet lists use the kitto dot instead of plain markers. */
  bullets?: "dot";
  /** Content after the section's own blocks, such as an address or a button. */
  after?: ComponentChildren;
  /** Wrap the rendered blocks, such as into the delete page's deleted-and-kept ledger. */
  wrap?: (blocks: ComponentChildren) => ComponentChildren;
};

/** Turns a legal string into ready HTML or text in the page's locale. */
type Render = (raw: string) => string;

/** LegalSection props. */
type LegalSectionProps = {
  /** The section's content. */
  section: LegalSectionData;
  /** Its number, from 1. */
  number: number;
  /** Turns a legal HTML string into ready HTML. */
  renderHtml: Render;
  /** Sets a plain string, such as the heading, in the locale's typography. */
  renderText: Render;
  /** The page's adjustments of this section. */
  options?: SectionOptions | undefined;
};

/** Block props. */
type BlockProps = {
  /** One block of a section. */
  block: LegalBlock;
  /** Turns a legal HTML string into ready HTML. */
  renderHtml: Render;
};

/**
 * A stable key for a block: its own text.
 *
 * @param block - One block of a section.
 * @returns The block's text, unique within a section.
 */
function blockKey(block: LegalBlock): string {
  return block.kind === "paragraph" ? block.html : block.items.join("\n");
}

/**
 * Render one block: a paragraph, a bullet list or numbered steps.
 *
 * @param props - Block props.
 * @param props.block - The block.
 * @param props.renderHtml - Turns a legal HTML string into ready HTML.
 * @returns The block's element.
 */
function Block({ block, renderHtml }: BlockProps): VNode {
  switch (block.kind) {
    case "paragraph": {
      return <p dangerouslySetInnerHTML={{ __html: renderHtml(block.html) }} />;
    }
    case "list": {
      return (
        <ul>
          {block.items.map(item => (
            <li key={item} dangerouslySetInnerHTML={{ __html: renderHtml(item) }} />
          ))}
        </ul>
      );
    }
    case "steps": {
      return <StepList steps={block.items.map(item => renderHtml(item))} />;
    }
  }
}

/**
 * Render one numbered section.
 *
 * @param props - LegalSection props.
 * @param props.section - The section's content.
 * @param props.number - Its number, from 1.
 * @param props.renderHtml - Turns a legal HTML string into ready HTML.
 * @param props.renderText - Sets a plain string in the locale's typography.
 * @param props.options - The page's adjustments of this section.
 * @returns A `<section>` with the section id, labelled by its heading.
 * @example
 * ```tsx
 * <LegalSection section={privacy.sections[0]} number={1} renderHtml={html} renderText={text} />
 * ```
 */
export function LegalSection({
  section,
  number,
  renderHtml,
  renderText,
  options
}: LegalSectionProps): VNode {
  const headingId = `${section.id}-title`;
  const blocks = section.blocks.map(block => (
    <Block key={blockKey(block)} block={block} renderHtml={renderHtml} />
  ));

  return (
    <section
      id={section.id}
      aria-labelledby={headingId}
      data-component="legal-section"
      data-bullets={options?.bullets}
    >
      <h2 id={headingId}>
        <span data-number>{number}</span> {renderText(section.heading)}
      </h2>
      {options?.wrap ? options.wrap(blocks) : blocks}
      {options?.after}
    </section>
  );
}
