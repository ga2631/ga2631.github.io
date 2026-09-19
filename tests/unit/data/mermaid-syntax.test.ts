import { describe, it, expect } from 'vitest';
import mermaid from 'mermaid';
import viBlogRaw from '../../../src/data/blog/vi/2026/09.json';
import enBlogRaw from '../../../src/data/blog/en/2026/09.json';

describe('TU-DATA-03: Data - Mermaid Diagrams Syntax Validation', () => {
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
  });

  const extractMermaidCode = (html: string): string[] => {
    const results: string[] = [];
    const regex = /<pre class="mermaid"><code>([\s\S]*?)<\/code><\/pre>/g;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(html)) !== null) {
      const clean = match[1]
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .trim();
      results.push(clean);
    }
    return results;
  };

  it('validates all Mermaid diagrams in Vietnamese blog posts', async () => {
    for (const post of viBlogRaw) {
      for (const [sectionKey, sectionContent] of Object.entries(post.sections)) {
        const diagrams = extractMermaidCode(sectionContent as string);
        for (const [idx, code] of diagrams.entries()) {
          const isValid = await mermaid.parse(code);
          expect(isValid, `Failed to parse VI post ${post.id} (${post.slug}) section "${sectionKey}" diagram #${idx + 1}:\n${code}`).toBeTruthy();
        }
      }
    }
  });

  it('validates all Mermaid diagrams in English blog posts', async () => {
    for (const post of enBlogRaw) {
      for (const [sectionKey, sectionContent] of Object.entries(post.sections)) {
        const diagrams = extractMermaidCode(sectionContent as string);
        for (const [idx, code] of diagrams.entries()) {
          const isValid = await mermaid.parse(code);
          expect(isValid, `Failed to parse EN post ${post.id} (${post.slug}) section "${sectionKey}" diagram #${idx + 1}:\n${code}`).toBeTruthy();
        }
      }
    }
  });
});
