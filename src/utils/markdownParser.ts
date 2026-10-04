/**
 * Markdown to HTML parser
 * Delegates to the comprehensive renderMarkdownToHtml supporting
 * KaTeX (inline & block), Mermaid diagrams, tables, headings with IDs, and code blocks.
 */
import { renderMarkdownToHtml } from './markdownRenderer';

export function markdownToHtml(markdown: string): string {
  return renderMarkdownToHtml(markdown);
}
