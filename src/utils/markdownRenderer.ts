import katex from 'katex';

/**
 * Escapes HTML characters to prevent XSS.
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Parses inline formatting: bold, italic, strikethrough, inline code, inline math, links.
 */
export function parseInlineMarkdown(text: string): string {
  // 1. Inline KaTeX math: $...$
  text = text.replace(/\$([^\$\n]+?)\$/g, (_match, math) => {
    try {
      return katex.renderToString(math.trim(), {
        displayMode: false,
        throwOnError: false,
      });
    } catch {
      return `<code class="katex-error text-red-500 font-mono text-xs">$${escapeHtml(math)}$</code>`;
    }
  });

  // 2. Inline code: `code`
  text = text.replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>');

  // 3. Bold: **text** or __text__
  text = text.replace(/(\*\*|__)(.*?)\1/g, '<strong class="font-bold text-gray-900">$2</strong>');

  // 4. Italic: *text* or _text_
  text = text.replace(/(\*|_)(.*?)\1/g, '<em class="italic text-gray-800">$2</em>');

  // 5. Strikethrough: ~~text~~
  text = text.replace(/~~(.*?)~~/g, '<del class="line-through text-gray-400">$1</del>');

  // 6. Links: [label](url)
  text = text.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-red-600 hover:text-red-700 underline font-medium">$1</a>'
  );

  return text;
}

/**
 * Converts markdown text into rich HTML with support for:
 * - Mermaid diagrams (```mermaid ... ```)
 * - KaTeX block & inline math ($$ ... $$)
 * - Headings (#, ##, ###, ####)
 * - Code blocks
 * - Blockquotes & callouts
 * - Tables
 * - Lists (bullet & ordered)
 * - Horizontal dividers
 */
export function renderMarkdownToHtml(markdown: string): string {
  if (!markdown) return '';

  const lines = markdown.split('\n');
  const htmlParts: string[] = [];
  let inCodeBlock = false;
  let codeBlockLang = '';
  let codeBlockContent: string[] = [];
  let inList: 'ul' | 'ol' | null = null;
  let inTable = false;
  let tableHeaderProcessed = false;

  const closeListIfOpen = () => {
    if (inList) {
      htmlParts.push(inList === 'ul' ? '</ul>' : '</ol>');
      inList = null;
    }
  };

  const closeTableIfOpen = () => {
    if (inTable) {
      htmlParts.push('</tbody></table></div>');
      inTable = false;
      tableHeaderProcessed = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // 1. Fenced Code Blocks (```lang ... ```)
    if (trimmed.startsWith('```')) {
      closeListIfOpen();
      closeTableIfOpen();

      if (inCodeBlock) {
        // End of code block
        const codeText = codeBlockContent.join('\n');
        if (codeBlockLang.toLowerCase() === 'mermaid') {
          // Mermaid block placeholder for client rendering
          const diagramId = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
          htmlParts.push(
            `<div class="my-6 p-4 rounded-2xl bg-white border border-gray-200 shadow-xs overflow-x-auto text-center">
              <div class="text-[11px] font-mono font-bold text-gray-400 mb-2 uppercase tracking-wider flex items-center justify-between">
                <span>📐 Kiến trúc Mermaid Diagram</span>
              </div>
              <div class="mermaid-diagram" id="${diagramId}" data-mermaid="${encodeURIComponent(codeText)}">
                <pre class="text-xs font-mono text-gray-700 bg-gray-50 p-3 rounded-xl text-left overflow-x-auto">${escapeHtml(codeText)}</pre>
              </div>
            </div>`
          );
        } else {
          // Standard syntax code block
          htmlParts.push(
            `<div class="my-5 rounded-2xl bg-gray-900 text-gray-100 overflow-hidden shadow-md">
              <div class="px-4 py-2 bg-gray-800/80 border-b border-gray-700/60 flex items-center justify-between text-xs font-mono text-gray-400">
                <span class="uppercase">${escapeHtml(codeBlockLang || 'code')}</span>
              </div>
              <pre class="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-gray-200"><code>${escapeHtml(codeText)}</code></pre>
            </div>`
          );
        }
        inCodeBlock = false;
        codeBlockLang = '';
        codeBlockContent = [];
      } else {
        // Start of code block
        inCodeBlock = true;
        codeBlockLang = trimmed.substring(3).trim();
        codeBlockContent = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(rawLine);
      continue;
    }

    // 2. KaTeX Block Math ($$ ... $$)
    if (trimmed.startsWith('$$') && trimmed.endsWith('$$') && trimmed.length > 4) {
      closeListIfOpen();
      closeTableIfOpen();
      const math = trimmed.substring(2, trimmed.length - 2).trim();
      try {
        const renderedMath = katex.renderToString(math, {
          displayMode: true,
          throwOnError: false,
        });
        htmlParts.push(`<div class="my-5 p-4 rounded-2xl bg-gray-50/80 border border-gray-100 overflow-x-auto text-center">${renderedMath}</div>`);
      } catch {
        htmlParts.push(`<div class="my-5 p-3 rounded-xl bg-red-50 text-red-600 font-mono text-xs overflow-x-auto">$$ ${escapeHtml(math)} $$</div>`);
      }
      continue;
    }

    // 3. Headings (#, ##, ###, ####)
    if (trimmed.startsWith('#')) {
      closeListIfOpen();
      closeTableIfOpen();
      const match = trimmed.match(/^(#{1,6})\s+(.*)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2];
        const inlineHtml = parseInlineMarkdown(text);
        const headingId = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');

        if (level === 1) {
          htmlParts.push(`<h1 id="${headingId}" class="text-2xl sm:text-3xl font-black text-gray-900 mt-8 mb-4 tracking-tight leading-tight">${inlineHtml}</h1>`);
        } else if (level === 2) {
          htmlParts.push(`<h2 id="${headingId}" class="text-xl sm:text-2xl font-black text-gray-900 mt-8 mb-3 pt-4 border-t border-gray-100 tracking-tight leading-snug">${inlineHtml}</h2>`);
        } else if (level === 3) {
          htmlParts.push(`<h3 id="${headingId}" class="text-base sm:text-lg font-bold text-gray-900 mt-6 mb-2 tracking-tight">${inlineHtml}</h3>`);
        } else {
          htmlParts.push(`<h4 id="${headingId}" class="text-sm font-bold text-gray-800 mt-4 mb-2">${inlineHtml}</h4>`);
        }
        continue;
      }
    }

    // 4. Horizontal Rule (---, ***)
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      closeListIfOpen();
      closeTableIfOpen();
      htmlParts.push('<hr class="my-8 border-gray-200" />');
      continue;
    }

    // 5. Blockquotes and Callout Notes (> [!NOTE], > [!TIP], > quote)
    if (trimmed.startsWith('>')) {
      closeListIfOpen();
      closeTableIfOpen();
      const quoteBody = trimmed.replace(/^>\s?/, '');
      
      // GitHub style Callout Notes: > [!NOTE], > [!TIP], > [!WARNING], > [!IMPORTANT]
      const calloutMatch = quoteBody.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](.*)$/i);
      if (calloutMatch) {
        const type = calloutMatch[1].toUpperCase();
        const calloutStyles: Record<string, { border: string; bg: string; title: string; icon: string }> = {
          NOTE: { border: 'border-blue-500', bg: 'bg-blue-50/60 text-blue-900', title: 'Ghi chú (Note)', icon: 'ℹ️' },
          TIP: { border: 'border-emerald-500', bg: 'bg-emerald-50/60 text-emerald-900', title: 'Mẹo kỹ thuật (Tip)', icon: '💡' },
          IMPORTANT: { border: 'border-purple-500', bg: 'bg-purple-50/60 text-purple-900', title: 'Quan trọng (Important)', icon: '📌' },
          WARNING: { border: 'border-amber-500', bg: 'bg-amber-50/60 text-amber-900', title: 'Cảnh báo (Warning)', icon: '⚠️' },
          CAUTION: { border: 'border-red-500', bg: 'bg-red-50/60 text-red-900', title: 'Lưu ý rủi ro (Caution)', icon: '🚨' },
        };
        const style = calloutStyles[type] || calloutStyles.NOTE;
        htmlParts.push(
          `<div class="my-5 p-4 rounded-2xl border-l-4 ${style.border} ${style.bg} space-y-1">
            <div class="text-xs font-bold flex items-center gap-1.5 uppercase tracking-wider">
              <span>${style.icon}</span>
              <span>${style.title}</span>
            </div>
            <div class="text-xs sm:text-sm leading-relaxed">${parseInlineMarkdown(calloutMatch[2].trim())}</div>
          </div>`
        );
      } else {
        htmlParts.push(
          `<blockquote class="my-4 border-l-4 border-red-500 bg-red-50/40 p-4 rounded-r-xl italic text-gray-700 text-xs sm:text-sm leading-relaxed">${parseInlineMarkdown(quoteBody)}</blockquote>`
        );
      }
      continue;
    }

    // 6. Tables (| Col 1 | Col 2 |)
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      closeListIfOpen();
      const cells = trimmed
        .slice(1, -1)
        .split('|')
        .map((c) => c.trim());

      // Check if it's separator row: | --- | --- |
      if (cells.every((c) => /^:?-+:?$/.test(c))) {
        // Table header separator, skip outputting
        continue;
      }

      if (!inTable) {
        inTable = true;
        tableHeaderProcessed = true;
        htmlParts.push(
          '<div class="my-5 overflow-x-auto rounded-2xl border border-gray-200 shadow-2xs"><table class="w-full text-left text-xs border-collapse"><thead class="bg-gray-50 border-b border-gray-200 text-gray-700 font-semibold"><tr>' +
            cells.map((c) => `<th class="p-3">${parseInlineMarkdown(c)}</th>`).join('') +
            '</tr></thead><tbody class="divide-y divide-gray-100 bg-white text-gray-700">'
        );
      } else {
        htmlParts.push('<tr>' + cells.map((c) => `<td class="p-3">${parseInlineMarkdown(c)}</td>`).join('') + '</tr>');
      }
      continue;
    } else {
      closeTableIfOpen();
    }

    // 7. Bullet Lists (- Item or * Item)
    const bulletMatch = trimmed.match(/^[-*]\s+(.*)$/);
    if (bulletMatch) {
      if (inList !== 'ul') {
        closeListIfOpen();
        inList = 'ul';
        htmlParts.push('<ul class="my-3 list-disc pl-5 space-y-1 text-xs sm:text-sm text-gray-700 leading-relaxed">');
      }
      htmlParts.push(`<li>${parseInlineMarkdown(bulletMatch[1])}</li>`);
      continue;
    }

    // 8. Numbered Lists (1. Item)
    const numberMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numberMatch) {
      if (inList !== 'ol') {
        closeListIfOpen();
        inList = 'ol';
        htmlParts.push('<ol class="my-3 list-decimal pl-5 space-y-1 text-xs sm:text-sm text-gray-700 leading-relaxed">');
      }
      htmlParts.push(`<li>${parseInlineMarkdown(numberMatch[2])}</li>`);
      continue;
    }

    // End list if non-list line encountered
    closeListIfOpen();

    // 9. Empty lines
    if (!trimmed) {
      continue;
    }

    // 10. Paragraphs
    htmlParts.push(`<p class="my-3 text-xs sm:text-sm text-gray-700 leading-relaxed">${parseInlineMarkdown(trimmed)}</p>`);
  }

  closeListIfOpen();
  closeTableIfOpen();

  return htmlParts.join('\n');
}

/**
 * Calculates estimated read time (minutes) from text.
 */
export function calculateReadingTime(text: string): { words: number; minutes: number; characters: number } {
  if (!text) return { words: 0, minutes: 1, characters: 0 };
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  const characters = text.length;
  return { words, minutes, characters };
}

/**
 * Calculates SEO score (0-100) and provides actionable feedback.
 */
export interface SeoAnalysisResult {
  score: number;
  status: 'excellent' | 'good' | 'needs-work';
  checks: {
    label: string;
    passed: boolean;
    recommendation: string;
  }[];
}

export function analyzePostSeo(
  title: string,
  summary: string,
  content: string,
  slug: string
): SeoAnalysisResult {
  const titleLen = (title || '').trim().length;
  const summaryLen = (summary || '').trim().length;
  const wordCount = (content || '').trim().split(/\s+/).filter(Boolean).length;
  const headingCount = (content || '').match(/^##\s+/gm)?.length || 0;
  const hasSlug = Boolean((slug || '').trim() && !slug.includes(' '));

  const checks = [
    {
      label: 'Độ dài Tiêu đề (SEO Title)',
      passed: titleLen >= 30 && titleLen <= 70,
      recommendation: titleLen < 30 ? 'Tiêu đề quá ngắn (< 30 ký tự), hãy bổ sung từ khóa cụ thể.' : titleLen > 70 ? 'Tiêu đề hơi dài (> 70 ký tự), có thể bị cắt bớt trên Google.' : 'Độ dài tiêu đề tối ưu cho Google SERP (30-70 ký tự).',
    },
    {
      label: 'Đoạn Tóm tắt / Meta Description',
      passed: summaryLen >= 70 && summaryLen <= 170,
      recommendation: summaryLen < 70 ? 'Tóm tắt bài viết hơi ngắn (< 70 ký tự), nên bổ sung để làm thẻ meta.' : summaryLen > 170 ? 'Tóm tắt vượt quá 170 ký tự, sẽ bị Google rút gọn bằng dấu "...".' : 'Đoạn tóm tắt lý tưởng cho Meta Snippet (70-170 ký tự).',
    },
    {
      label: 'Độ dài Nội dung (Content Depth)',
      passed: wordCount >= 300,
      recommendation: wordCount < 300 ? `Bài viết hiện có ${wordCount} từ. Bài kỹ thuật chuyên sâu nên đạt tối thiểu 300 từ.` : `Nội dung đạt độ dài chất lượng (${wordCount} từ).`,
    },
    {
      label: 'Cấu trúc Đầu mục (Headings H2)',
      passed: headingCount >= 2,
      recommendation: headingCount < 2 ? 'Nên có ít nhất 2 đầu mục (##) để chia tách ý và cải thiện mục lục TOC.' : `Bài viết có cấu trúc rõ ràng với ${headingCount} tiêu đề phân đoạn.`,
    },
    {
      label: 'Đường dẫn Slug chuẩn SEO',
      passed: hasSlug && /^[a-z0-9-]+$/.test(slug),
      recommendation: !hasSlug ? 'Cần nhập slug URL không dấu.' : 'Slug URL chuẩn SEO dạng kebab-case.',
    },
  ];

  const passedCount = checks.filter((c) => c.passed).length;
  const score = Math.round((passedCount / checks.length) * 100);
  const status = score >= 80 ? 'excellent' : score >= 60 ? 'good' : 'needs-work';

  return { score, status, checks };
}
