/**
 * Lightweight, resilient Markdown and YAML Frontmatter parser for blog articles.
 * Zero external dependency overhead, fully compatible with React SPA, Mermaid.js and GFM.
 */

export interface ParsedMarkdownArticle<T = Record<string, any>> {
  metadata: T;
  content: string;
  html: string;
}

/**
 * Parses YAML frontmatter from raw Markdown text.
 */
export function parseFrontmatter<T = Record<string, any>>(rawText: string): { metadata: T; content: string } {
  if (!rawText || typeof rawText !== 'string') {
    return { metadata: {} as T, content: '' };
  }

  const trimmed = rawText.trim();
  if (!trimmed.startsWith('---')) {
    return { metadata: {} as T, content: rawText };
  }

  const match = trimmed.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { metadata: {} as T, content: rawText };
  }

  const frontmatterStr = match[1];
  const content = match[2].trim();
  const metadata: Record<string, any> = {};

  const lines = frontmatterStr.split(/\r?\n/);
  let currentKey = '';
  let inArray = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith('#')) continue;

    const arrayItemMatch = line.match(/^\s*-\s+(.*)$/);
    if (arrayItemMatch && currentKey && inArray) {
      let val = arrayItemMatch[1].trim();
      val = stripQuotes(val);
      metadata[currentKey].push(val);
      continue;
    }

    const keyValMatch = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (keyValMatch) {
      currentKey = keyValMatch[1].trim();
      let value = keyValMatch[2].trim();

      if (value === '' || value === '[]') {
        // May start an array on subsequent lines
        metadata[currentKey] = [];
        inArray = true;
      } else if (value.startsWith('[') && value.endsWith(']')) {
        // Inline array: ["tag1", "tag2"]
        inArray = false;
        const inner = value.slice(1, -1).trim();
        metadata[currentKey] = inner
          ? inner.split(',').map((s) => stripQuotes(s.trim()))
          : [];
      } else {
        inArray = false;
        value = stripQuotes(value);
        if (value === 'true') metadata[currentKey] = true;
        else if (value === 'false') metadata[currentKey] = false;
        else if (/^\d+$/.test(value)) metadata[currentKey] = parseInt(value, 10);
        else metadata[currentKey] = value;
      }
    }
  }

  return { metadata: metadata as T, content };
}

function stripQuotes(str: string): string {
  if (!str) return '';
  if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) {
    return str.slice(1, -1).trim();
  }
  return str;
}

/**
 * Renders Markdown body text into clean HTML.
 * Preserves code fences, Mermaid diagrams, GFM tables, and existing HTML tags.
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown) return '';

  // Extract and stash code blocks to protect them from inline formatting
  const codeBlocks: string[] = [];
  let processed = markdown.replace(/```([a-zA-Z0-9_-]*)\r?\n([\s\S]*?)```/g, (_match, lang, code) => {
    const trimmedCode = code.replace(/\r?\n$/, '');
    const cleanLang = (lang || '').trim().toLowerCase();
    let blockHtml = '';

    if (cleanLang === 'mermaid') {
      blockHtml = `<pre class="mermaid"><code>${escapeHtml(trimmedCode)}</code></pre>`;
    } else if (cleanLang) {
      blockHtml = `<pre><code class="language-${cleanLang}">${escapeHtml(trimmedCode)}</code></pre>`;
    } else {
      blockHtml = `<pre><code>${escapeHtml(trimmedCode)}</code></pre>`;
    }

    const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
    codeBlocks.push(blockHtml);
    return placeholder;
  });

  // Split into block paragraphs
  const rawParagraphs = processed.split(/\r?\n\r?\n+/);
  const htmlParagraphs: string[] = [];

  for (const block of rawParagraphs) {
    const trimmedBlock = block.trim();
    if (!trimmedBlock) continue;

    // Check if it's a code block placeholder
    if (trimmedBlock.startsWith('__CODE_BLOCK_') && trimmedBlock.endsWith('__')) {
      htmlParagraphs.push(trimmedBlock);
      continue;
    }

    // Check if it's already an HTML block (e.g. <table>, <pre>, <div>, <p>)
    if (/^<(table|pre|div|p|ul|ol|h[1-6]|blockquote|section|article)\b/i.test(trimmedBlock)) {
      htmlParagraphs.push(trimmedBlock);
      continue;
    }

    // Check if it's a Table in GFM Markdown format (| col1 | col2 |)
    if (trimmedBlock.startsWith('|') && trimmedBlock.includes('\n|')) {
      htmlParagraphs.push(renderMarkdownTable(trimmedBlock));
      continue;
    }

    // Check Headings: # H1, ## H2, ### H3
    if (/^#{1,6}\s+/.test(trimmedBlock)) {
      const headingMatch = trimmedBlock.match(/^(#{1,6})\s+(.*)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const text = formatInlineMarkdown(headingMatch[2].trim());
        htmlParagraphs.push(`<h${level}>${text}</h${level}>`);
        continue;
      }
    }

    // Check Blockquote (> Quote)
    if (trimmedBlock.startsWith('>')) {
      const quoteContent = trimmedBlock
        .split(/\r?\n/)
        .map((l) => l.replace(/^>\s?/, ''))
        .join(' ');
      htmlParagraphs.push(`<blockquote><p>${formatInlineMarkdown(quoteContent)}</p></blockquote>`);
      continue;
    }

    // Check Unordered List (- item or * item)
    if (/^[-*]\s+/.test(trimmedBlock)) {
      const items = trimmedBlock
        .split(/\r?\n/)
        .filter((l) => /^[-*]\s+/.test(l))
        .map((l) => `<li>${formatInlineMarkdown(l.replace(/^[-*]\s+/, '').trim())}</li>`);
      htmlParagraphs.push(`<ul>\n${items.join('\n')}\n</ul>`);
      continue;
    }

    // Check Ordered List (1. item)
    if (/^\d+\.\s+/.test(trimmedBlock)) {
      const items = trimmedBlock
        .split(/\r?\n/)
        .filter((l) => /^\d+\.\s+/.test(l))
        .map((l) => `<li>${formatInlineMarkdown(l.replace(/^\d+\.\s+/, '').trim())}</li>`);
      htmlParagraphs.push(`<ol>\n${items.join('\n')}\n</ol>`);
      continue;
    }

    // Standard paragraph with inline formatting
    const formattedLines = trimmedBlock
      .split(/\r?\n/)
      .map((l) => formatInlineMarkdown(l))
      .join('<br />\n');
    htmlParagraphs.push(`<p>${formattedLines}</p>`);
  }

  let finalHtml = htmlParagraphs.join('\n\n');

  // Restore code blocks
  codeBlocks.forEach((block, idx) => {
    finalHtml = finalHtml.replace(`__CODE_BLOCK_${idx}__`, block);
  });

  return finalHtml;
}

/**
 * Converts inline Markdown (bold, italic, links, code) to HTML.
 */
function formatInlineMarkdown(text: string): string {
  if (!text) return '';

  return text
    // Inline code: `code`
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Bold: **text** or __text__
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/__([^_]+)__/g, '<strong>$1</strong>')
    // Italic: *text* or _text_
    .replace(/(^|[^*])\*([^*]+)\*([^*]|$)/g, '$1<em>$2</em>$3')
    .replace(/(^|[^_])_([^_]+)_([^_]|$)/g, '$1<em>$2</em>$3')
    // Links: [label](url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}

/**
 * Converts a GFM Markdown Table (| header |) into HTML table.
 */
function renderMarkdownTable(tableStr: string): string {
  const lines = tableStr.trim().split(/\r?\n/).filter((l) => l.includes('|'));
  if (lines.length < 2) return tableStr;

  const parseRow = (line: string) => {
    const rawCells = line.split('|');
    if (rawCells.length > 2) {
      return rawCells.slice(1, -1).map((c) => c.trim());
    }
    return rawCells.map((c) => c.trim());
  };

  const headerCells = parseRow(lines[0]);
  // line 1 is usually the separator: | --- | --- |
  const isSeparator = /^[\s|:-]+$/.test(lines[1]);
  const bodyRows = lines.slice(isSeparator ? 2 : 1);

  const theadHtml = `<thead>\n  <tr>\n${headerCells.map((c) => `    <th>${formatInlineMarkdown(c)}</th>`).join('\n')}\n  </tr>\n</thead>`;
  const tbodyRowsHtml = bodyRows
    .map((row) => {
      const cells = parseRow(row);
      return `  <tr>\n${cells.map((c) => `    <td>${formatInlineMarkdown(c)}</td>`).join('\n')}\n  </tr>`;
    })
    .join('\n');

  return `<table style="width:100%; border-collapse: collapse; margin-bottom: 20px;">\n${theadHtml}\n<tbody>\n${tbodyRowsHtml}\n</tbody>\n</table>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
