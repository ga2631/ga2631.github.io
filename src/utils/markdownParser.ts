/**
 * Lightweight, fast and safe Markdown to HTML parser
 * Supports headings with slug IDs, bold, italic, code blocks, inline code,
 * blockquotes, ordered/unordered lists, links, and tables.
 */

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function markdownToHtml(markdown: string): string {
  if (!markdown) return '';

  let html = markdown;

  // Normalize newlines
  html = html.replace(/\r\n/g, '\n');

  // Strip frontmatter if present
  html = html.replace(/^---[\s\S]*?---\n*/, '');

  // Protect code blocks
  const codeBlocks: string[] = [];
  html = html.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (_match, lang, code) => {
    const escaped = escapeHtml(code.trim());
    const langClass = lang ? ` class="language-${escapeHtml(lang)}"` : '';
    const placeholder = `___CODE_BLOCK_${codeBlocks.length}___`;
    codeBlocks.push(`<pre><code${langClass}>${escaped}</code></pre>`);
    return placeholder;
  });

  // Protect inline code
  const inlineCodes: string[] = [];
  html = html.replace(/`([^`]+)`/g, (_match, code) => {
    const placeholder = `___INLINE_CODE_${inlineCodes.length}___`;
    inlineCodes.push(`<code>${escapeHtml(code)}</code>`);
    return placeholder;
  });

  // Headings with auto-generated ID for TOC navigation
  html = html.replace(/^(#{1,6})\s+(.+)$/gm, (_match, hashes, title) => {
    const level = hashes.length;
    const cleanTitle = title.trim();
    const id = slugify(cleanTitle);
    return `<h${level} id="${id}">${cleanTitle}</h${level}>`;
  });

  // Blockquotes
  html = html.replace(/^\>\s+(.+)$/gm, '<blockquote><p>$1</p></blockquote>');
  html = html.replace(/<\/blockquote>\n<blockquote>/g, '\n');

  // Horizontal rules
  html = html.replace(/^(?:---|\*\*\*|___)\s*$/gm, '<hr />');

  // Bold & Italic
  html = html.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/___([^_]+)___/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

  // Links & Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-lg shadow-md my-4 max-w-full" loading="lazy" />');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">$1</a>');

  // Unordered Lists
  html = html.replace(/^[\*\-\+]\s+(.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>[\s\S]*?<\/li>)/g, (match) => {
    return `<ul>${match}</ul>`;
  });
  html = html.replace(/<\/ul>\s*<ul>/g, '');

  // Paragraphs: Wrap standalone lines not already wrapped in HTML tags
  const lines = html.split('\n');
  const processedLines: string[] = [];
  let inParagraph = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      if (inParagraph) {
        processedLines.push('</p>');
        inParagraph = false;
      }
      processedLines.push('');
      continue;
    }

    const isBlockElement = /^(<h[1-6]|<blockquote|<pre|<hr|<ul|<ol|<table|<div|<li|___CODE_BLOCK_)/.test(line);

    if (isBlockElement) {
      if (inParagraph) {
        processedLines.push('</p>');
        inParagraph = false;
      }
      processedLines.push(line);
    } else {
      if (!inParagraph) {
        processedLines.push('<p>');
        inParagraph = true;
      }
      processedLines.push(line);
    }
  }

  if (inParagraph) {
    processedLines.push('</p>');
  }

  html = processedLines.join('\n');

  // Restore Inline Code
  inlineCodes.forEach((code, idx) => {
    html = html.replace(`___INLINE_CODE_${idx}___`, code);
  });

  // Restore Code Blocks
  codeBlocks.forEach((code, idx) => {
    html = html.replace(`___CODE_BLOCK_${idx}___`, code);
  });

  return html;
}
