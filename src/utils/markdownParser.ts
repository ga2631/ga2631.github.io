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
 * Zero-dependency, lightweight syntax highlighter for Markdown code blocks.
 * Supports SQL, C++, Python, TypeScript, JavaScript, JSON, Shell, HTML/CSS.
 */
export function highlightCode(code: string, lang: string): string {
  const language = (lang || '').toLowerCase().trim();
  if (!code) return '';

  const tokens: string[] = [];
  const addToken = (html: string): string => {
    const placeholder = `\x1aTK${tokens.length}\x1a`;
    tokens.push(html);
    return placeholder;
  };

  let processed = code;

  // 1. Comments
  if (['cpp', 'c++', 'c', 'javascript', 'typescript', 'js', 'ts', 'jsx', 'tsx', 'css', 'scss', 'json'].includes(language)) {
    processed = processed.replace(/\/\*[\s\S]*?\*\//g, (m) => addToken(`<span class="token-comment">${escapeHtml(m)}</span>`));
    processed = processed.replace(/\/\/.*$/gm, (m) => addToken(`<span class="token-comment">${escapeHtml(m)}</span>`));
  } else if (['python', 'py', 'sh', 'bash', 'yaml', 'yml'].includes(language)) {
    processed = processed.replace(/#.*$/gm, (m) => addToken(`<span class="token-comment">${escapeHtml(m)}</span>`));
  } else if (language === 'sql') {
    processed = processed.replace(/--.*$/gm, (m) => addToken(`<span class="token-comment">${escapeHtml(m)}</span>`));
    processed = processed.replace(/\/\*[\s\S]*?\*\//g, (m) => addToken(`<span class="token-comment">${escapeHtml(m)}</span>`));
  } else {
    processed = processed.replace(/\/\*[\s\S]*?\*\//g, (m) => addToken(`<span class="token-comment">${escapeHtml(m)}</span>`));
    processed = processed.replace(/\/\/.*$/gm, (m) => addToken(`<span class="token-comment">${escapeHtml(m)}</span>`));
    processed = processed.replace(/#.*$/gm, (m) => addToken(`<span class="token-comment">${escapeHtml(m)}</span>`));
    processed = processed.replace(/--.*$/gm, (m) => addToken(`<span class="token-comment">${escapeHtml(m)}</span>`));
  }

  // 2. Strings
  processed = processed.replace(/"(?:\\.|[^"\\\r\n])*"/g, (m) => addToken(`<span class="token-string">${escapeHtml(m)}</span>`));
  processed = processed.replace(/'(?:\\.|[^'\\\r\n])*'/g, (m) => addToken(`<span class="token-string">${escapeHtml(m)}</span>`));
  if (['javascript', 'typescript', 'js', 'ts', 'jsx', 'tsx'].includes(language)) {
    processed = processed.replace(/`[\s\S]*?`/g, (m) => addToken(`<span class="token-string">${escapeHtml(m)}</span>`));
  }

  // 3. Numbers
  processed = processed.replace(/\b(?:0x[0-9a-fA-F]+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?[fFlLuU]?)\b/g, (m) => addToken(`<span class="token-number">${escapeHtml(m)}</span>`));

  // 4. SQL Keywords & Data Types
  if (language === 'sql') {
    const sqlKeywords = /\b(SELECT|FROM|WHERE|JOIN|LEFT|RIGHT|INNER|FULL|OUTER|CROSS|ON|GROUP\s+BY|ORDER\s+BY|HAVING|LIMIT|OFFSET|UNION|ALL|AS|AND|OR|NOT|IN|EXISTS|BETWEEN|LIKE|IS|NULL|TRUE|FALSE|CASE|WHEN|THEN|ELSE|END|WITH|RECURSIVE|CREATE|TABLE|VIEW|INDEX|DROP|ALTER|ADD|COLUMN|INSERT|INTO|VALUES|UPDATE|SET|DELETE|PARTITION\s+BY|CLUSTER\s+BY|DISTSTYLE|SORTKEY|ENGINE|PRIMARY\s+KEY|FOREIGN\s+KEY|REFERENCES|CASCADE|OVER|FILTER|ROW_NUMBER|RANK|DENSE_RANK|SUM|AVG|COUNT|MIN|MAX|COALESCE|CAST|DATE_TRUNC|EXTRACT|NOW|TO_DATE|TIMESTAMP|VARCHAR|TEXT|INTEGER|INT|BIGINT|DECIMAL|NUMERIC|FLOAT|BOOLEAN|DATE|JSONB|ARRAY|SETTINGS|MergeTree|ReplacingMergeTree|SummingMergeTree|AggregatingMergeTree)\b/gi;
    processed = processed.replace(sqlKeywords, (m) => addToken(`<span class="token-keyword">${escapeHtml(m.toUpperCase())}</span>`));
  }

  // 5. C / C++ Keywords & Types
  if (['cpp', 'c++', 'c'].includes(language) || !language) {
    const cppKeywords = /\b(auto|bool|break|case|catch|char|class|const|constexpr|continue|default|delete|do|double|else|enum|explicit|export|extern|false|float|for|friend|goto|if|inline|int|long|mutable|namespace|new|noexcept|nullptr|operator|private|protected|public|register|reinterpret_cast|return|short|signed|sizeof|static|static_cast|struct|switch|template|this|throw|true|try|typedef|typeid|typename|union|unsigned|using|virtual|void|volatile|while|include|define|ifdef|ifndef|endif)\b/g;
    processed = processed.replace(cppKeywords, (m) => addToken(`<span class="token-keyword">${escapeHtml(m)}</span>`));

    const cppStdTypes = /\b(std|vector|string|pair|tuple|map|unordered_map|set|unordered_set|queue|priority_queue|stack|deque|list|array|unique_ptr|shared_ptr|size_t|int64_t|int32_t|uint64_t|uint32_t|cin|cout|endl|min|max|sort|reverse|find|swap|memset|push_back|emplace_back|pop|push|top|front|back|size|empty|clear|begin|end)\b/g;
    processed = processed.replace(cppStdTypes, (m) => addToken(`<span class="token-type">${escapeHtml(m)}</span>`));
  }

  // 6. Python Keywords & Built-ins
  if (['python', 'py'].includes(language) || !language) {
    const pyKeywords = /\b(and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield|True|False|None)\b/g;
    processed = processed.replace(pyKeywords, (m) => addToken(`<span class="token-keyword">${escapeHtml(m)}</span>`));

    const pyBuiltins = /\b(print|len|range|enumerate|zip|map|filter|sum|min|max|abs|round|int|float|str|bool|list|dict|set|tuple|type|isinstance|open|read|write|close|self|cls)\b/g;
    processed = processed.replace(pyBuiltins, (m) => addToken(`<span class="token-type">${escapeHtml(m)}</span>`));
  }

  // 7. JavaScript / TypeScript Keywords
  if (['javascript', 'typescript', 'js', 'ts', 'jsx', 'tsx'].includes(language)) {
    const jsKeywords = /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|default|class|extends|new|this|super|import|export|from|as|default|typeof|instanceof|void|delete|in|of|try|catch|finally|throw|async|await|yield|null|undefined|true|false|interface|type|enum|implements|public|private|protected|readonly|static|declare|namespace|abstract)\b/g;
    processed = processed.replace(jsKeywords, (m) => addToken(`<span class="token-keyword">${escapeHtml(m)}</span>`));

    const jsTypes = /\b(React|FC|Component|useState|useEffect|useMemo|useCallback|useRef|useContext|Promise|Array|Object|String|Number|Boolean|Function|Set|Map|Record|Partial|Omit|Pick|HTMLElement|HTMLDivElement|document|window|console)\b/g;
    processed = processed.replace(jsTypes, (m) => addToken(`<span class="token-type">${escapeHtml(m)}</span>`));
  }

  // 8. Function Calls
  processed = processed.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, (_m, fnName) => addToken(`<span class="token-function">${escapeHtml(fnName)}</span>`));

  // Escape any remaining raw characters
  processed = escapeHtml(processed);

  // Restore tokens
  tokens.forEach((tkHtml, idx) => {
    processed = processed.replace(`\x1aTK${idx}\x1a`, () => tkHtml);
  });

  return processed;
}

/**
 * Renders Markdown body text into clean HTML.
 * Preserves code fences, Mermaid diagrams, GFM tables, and existing HTML tags.
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown) return '';

  // Extract and stash code blocks to protect them from inline formatting
  const codeBlocks: string[] = [];
  let processed = markdown.replace(/```([a-zA-Z0-9_+#-]*)\r?\n([\s\S]*?)```/g, (_match, lang, code) => {
    const trimmedCode = code.replace(/\r?\n$/, '');
    const cleanLang = (lang || '').trim().toLowerCase();
    let blockHtml = '';

    if (cleanLang === 'mermaid') {
      blockHtml = `<pre class="mermaid"><code>${escapeHtml(trimmedCode)}</code></pre>`;
    } else {
      const highlighted = highlightCode(trimmedCode, cleanLang);
      const displayLang = cleanLang ? cleanLang.toUpperCase() : 'CODE';
      blockHtml = `<div class="code-block-wrapper"><div class="code-block-header"><div class="code-mac-dots"><span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span></div><span class="code-lang-tag">${displayLang}</span></div><pre><code class="language-${cleanLang}">${highlighted}</code></pre></div>`;
    }

    const placeholder = `\x1aCB${codeBlocks.length}\x1a`;
    codeBlocks.push(blockHtml);
    return `\n\n${placeholder}\n\n`;
  });

  // Split into block paragraphs
  const rawParagraphs = processed.split(/\r?\n\r?\n+/);
  const htmlParagraphs: string[] = [];

  for (const block of rawParagraphs) {
    const trimmedBlock = block.trim();
    if (!trimmedBlock) continue;

    // Check if it's a code block placeholder
    if (trimmedBlock.startsWith('\x1aCB') && trimmedBlock.endsWith('\x1a')) {
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
    if (/^\s*[-*]\s+/.test(trimmedBlock)) {
      const items = trimmedBlock
        .split(/\r?\n/)
        .filter((l) => /^\s*[-*]\s+/.test(l))
        .map((l) => `<li>${formatInlineMarkdown(l.replace(/^\s*[-*]\s+/, '').trim())}</li>`);
      htmlParagraphs.push(`<ul>\n${items.join('\n')}\n</ul>`);
      continue;
    }

    // Check Ordered List (1. item)
    if (/^\s*\d+\.\s+/.test(trimmedBlock)) {
      const items = trimmedBlock
        .split(/\r?\n/)
        .filter((l) => /^\s*\d+\.\s+/.test(l))
        .map((l) => `<li>${formatInlineMarkdown(l.replace(/^\s*\d+\.\s+/, '').trim())}</li>`);
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
    finalHtml = finalHtml.replace(`\x1aCB${idx}\x1a`, () => block);
  });

  return finalHtml;
}

/**
 * Converts inline Markdown (bold, italic, links, code) to HTML.
 * Stashes and escapes inline code to prevent raw HTML evaluation.
 */
export function formatInlineMarkdown(text: string): string {
  if (!text) return '';

  // 1. Stash and HTML-escape inline code snippets (`code`)
  const inlineCodes: string[] = [];
  let stashed = text.replace(/`([^`]+)`/g, (_match, code) => {
    const placeholder = `\x1aIC${inlineCodes.length}\x1a`;
    inlineCodes.push(`<code>${escapeHtml(code)}</code>`);
    return placeholder;
  });

  // 2. Format links, bold, italic on text outside of code
  stashed = stashed
    // Links: [label](url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label, url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`)
    // Bold: **text** or __text__
    .replace(/\*\*([^*]+)\*\*/g, (_m, p1) => `<strong>${p1}</strong>`)
    .replace(/__([^_]+)__/g, (_m, p1) => `<strong>${p1}</strong>`)
    // Italic: *text* or _text_
    .replace(/(^|[^*])\*([^*]+)\*([^*]|$)/g, (_m, p1, p2, p3) => `${p1}<em>${p2}</em>${p3}`)
    .replace(/(^|[^_])_([^_]+)_([^_]|$)/g, (_m, p1, p2, p3) => `${p1}<em>${p2}</em>${p3}`);

  // 3. Restore stashed inline code
  inlineCodes.forEach((codeHtml, idx) => {
    stashed = stashed.replace(`\x1aIC${idx}\x1a`, () => codeHtml);
  });

  return stashed;
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
