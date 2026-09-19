import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Exact Category Structure Definitions matching src/data/blog/blogTemplates.ts
const CATEGORY_STRUCTURE_DEFINITIONS = {
  'architecture-system-design': {
    sections: [
      { id: 'context-problem', order: 1, title: { vi: 'Bối cảnh & Vấn đề', en: 'Context & Problem Statement' } },
      { id: 'system-requirements', order: 2, title: { vi: 'Yêu cầu hệ thống', en: 'System Requirements' } },
      { id: 'architecture-design', order: 3, title: { vi: 'Thiết kế kiến trúc', en: 'Architecture Design' } },
      { id: 'trade-offs-analysis', order: 4, title: { vi: 'Phân tích đánh đổi', en: 'Trade-offs Analysis' } },
      { id: 'lessons-best-practices', order: 5, title: { vi: 'Bài học thực tế & Best Practices', en: 'Real-World Lessons & Best Practices' } },
    ],
  },
  'data-engineering-analytics': {
    sections: [
      { id: 'business-data-requirements', order: 1, title: { vi: 'Đề bài kinh doanh / Yêu cầu dữ liệu', en: 'Business Context & Data Requirements' } },
      { id: 'data-modeling', order: 2, title: { vi: 'Mô hình hóa dữ liệu', en: 'Data Modeling & Schema Design' } },
      { id: 'pipeline-construction', order: 3, title: { vi: 'Xây dựng Pipeline / Script xử lý', en: 'Pipeline Construction & Processing Logic' } },
      { id: 'testing-optimization', order: 4, title: { vi: 'Kiểm thử dữ liệu & Tối ưu hiệu năng', en: 'Data Validation & Performance Tuning' } },
      { id: 'summary-recommendations', order: 5, title: { vi: 'Tổng kết & Khuyến nghị', en: 'Summary & Recommendations' } },
    ],
  },
  'devops-cloud-tooling': {
    sections: [
      { id: 'article-objectives', order: 1, title: { vi: 'Mục tiêu bài viết', en: 'Article Objectives & Motivation' } },
      { id: 'architecture-principles', order: 2, title: { vi: 'Kiến trúc / Nguyên lý hoạt động', en: 'Architecture & Core Principles' } },
      { id: 'step-by-step-setup', order: 3, title: { vi: 'Từng bước thiết lập', en: 'Step-by-Step Setup & Implementation' } },
      { id: 'troubleshooting-pitfalls', order: 4, title: { vi: 'Troubleshooting & Common Pitfalls', en: 'Troubleshooting & Common Pitfalls' } },
      { id: 'evaluation-scaling', order: 5, title: { vi: 'Đánh giá & Mở rộng', en: 'Evaluation & Future Scaling' } },
    ],
  },
  'code-craftsmanship-languages': {
    sections: [
      { id: 'problem-statement', order: 1, title: { vi: 'Mô tả bài toán', en: 'Problem Statement & Objectives' } },
      { id: 'initial-approach', order: 2, title: { vi: 'Ý tưởng tiếp cận ban đầu', en: 'Initial Naive Approach' } },
      { id: 'optimization-thinking', order: 3, title: { vi: 'Tư duy tối ưu & Cấu trúc thuật toán', en: 'Optimization Thinking & Algorithm Design' } },
      { id: 'code-implementation', order: 4, title: { vi: 'Triển khai mã nguồn & Dry Run', en: 'Code Implementation & Execution Trace' } },
      { id: 'complexity-applications', order: 5, title: { vi: 'Đánh giá độ phức tạp & Ứng dụng thực tế', en: 'Complexity Evaluation & Real-world Applications' } },
    ],
  },
  'tech-radar-career-insights': {
    sections: [
      { id: 'introduction', order: 1, title: { vi: 'Đặt vấn đề & Tổng quan', en: 'Context & Executive Summary' } },
      { id: 'multi-dimensional-evaluation', order: 2, title: { vi: 'Đánh giá đa chiều / So sánh đối chuẩn', en: 'Multi-dimensional Evaluation & Benchmarking' } },
      { id: 'case-study-experience', order: 3, title: { vi: 'Kinh nghiệm thực chiến / Case Study', en: 'Real-world Experience & Case Studies' } },
      { id: 'actionable-recommendations', order: 4, title: { vi: 'Gợi ý hành động', en: 'Actionable Recommendations' } },
      { id: 'open-questions-discussion', order: 5, title: { vi: 'Câu hỏi mở, thảo luận', en: 'Open Questions & Discussion' } },
    ],
  },
};

/**
 * Converts HTML content of a section into clean Markdown.
 */
function cleanSectionContent(html) {
  if (!html) return '';

  let md = html;

  // 1. Mermaid code blocks: <pre class="mermaid"><code>...</code></pre>
  md = md.replace(/<pre\s+class=["']mermaid["']><code>([\s\S]*?)<\/code><\/pre>/gi, (_m, code) => {
    const unescaped = unescapeHtml(code).trim();
    return `\n\n\`\`\`mermaid\n${unescaped}\n\`\`\`\n\n`;
  });

  // 2. Generic Code blocks: <pre><code(?: class=["']language-([a-zA-Z0-9_-]+)["'])?>([\s\S]*?)<\/code><\/pre>
  md = md.replace(/<pre><code(?:\s+class=["']language-([a-zA-Z0-9_-]+)["'])?>([\s\S]*?)<\/code><\/pre>/gi, (_m, lang, code) => {
    const language = lang || '';
    const unescaped = unescapeHtml(code).trim();
    return `\n\n\`\`\`${language}\n${unescaped}\n\`\`\`\n\n`;
  });

  // 3. Fallback other pre tags
  md = md.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/gi, (_m, code) => {
    const unescaped = unescapeHtml(code).trim();
    return `\n\n\`\`\`\n${unescaped}\n\`\`\`\n\n`;
  });

  // 4. Paragraphs: <p>...</p>
  md = md.replace(/<p>([\s\S]*?)<\/p>/gi, (_m, p) => `\n\n${p.trim()}\n\n`);

  // 5. Unordered List Items: <li>...</li> inside <ul>
  md = md.replace(/<ul>([\s\S]*?)<\/ul>/gi, (_m, list) => {
    const items = list.match(/<li>([\s\S]*?)<\/li>/gi) || [];
    const formatted = items.map((it) => {
      const text = it.replace(/<\/?li>/gi, '').trim();
      return `- ${text}`;
    }).join('\n');
    return `\n\n${formatted}\n\n`;
  });

  // 6. Ordered List Items: <li>...</li> inside <ol>
  md = md.replace(/<ol>([\s\S]*?)<\/ol>/gi, (_m, list) => {
    const items = list.match(/<li>([\s\S]*?)<\/li>/gi) || [];
    const formatted = items.map((it, idx) => {
      const text = it.replace(/<\/?li>/gi, '').trim();
      return `${idx + 1}. ${text}`;
    }).join('\n');
    return `\n\n${formatted}\n\n`;
  });

  // 7. Inline tags: <strong>, <em>, <code>
  md = md.replace(/<strong>([\s\S]*?)<\/strong>/gi, '**$1**');
  md = md.replace(/<b>([\s\S]*?)<\/b>/gi, '**$1**');
  md = md.replace(/<em>([\s\S]*?)<\/em>/gi, '*$1*');
  md = md.replace(/<i>([\s\S]*?)<\/i>/gi, '*$1*');
  md = md.replace(/<code>([\s\S]*?)<\/code>/gi, (_m, c) => `\`${unescapeHtml(c)}\``);

  // 8. Clean excess whitespace and newlines
  md = md.replace(/\n{3,}/g, '\n\n').trim();

  return md;
}

function unescapeHtml(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&rarr;/g, '->')
    .replace(/&le;/g, '<=')
    .replace(/&ge;/g, '>=')
    .replace(/&ne;/g, '!=')
    .replace(/&times;/g, 'x')
    .replace(/&radic;/g, 'sqrt')
    .replace(/&alpha;/g, 'alpha')
    .replace(/&sum;/g, 'sum')
    .replace(/&isin;/g, 'in')
    .replace(/&approx;/g, '~');
}

/**
 * Converts a raw JSON blog post object into Markdown text with Frontmatter (NO author).
 */
function convertPostToMarkdown(post, lang) {
  const frontmatterLines = [
    '---',
    `id: "${post.id}"`,
    `slug: "${post.slug}"`,
    `title: ${JSON.stringify(post.title)}`,
    `summary: ${JSON.stringify(post.summary || '')}`,
    `category: "${post.category || ''}"`,
    `publishedAt: "${post.publishedAt || ''}"`,
    `date: "${post.date || ''}"`,
    `readTime: "${post.readTime || ''}"`,
    'tags:',
    ...(post.tags || []).map((t) => `  - ${JSON.stringify(t)}`),
    '---',
  ];

  const categoryDef = CATEGORY_STRUCTURE_DEFINITIONS[post.category];
  const bodySections = [];

  if (post.sections && typeof post.sections === 'object') {
    if (categoryDef) {
      categoryDef.sections.forEach((sec) => {
        const secContent = post.sections[sec.id] || '';
        const secTitle = sec.title[lang] || sec.title.vi;
        const cleanedContent = cleanSectionContent(secContent);
        bodySections.push(`## ${sec.order}. ${secTitle}\n\n${cleanedContent}`);
      });
    } else {
      // Fallback for custom sections
      let order = 1;
      Object.entries(post.sections).forEach(([key, content]) => {
        const cleanedContent = cleanSectionContent(content);
        bodySections.push(`## ${order}. ${key}\n\n${cleanedContent}`);
        order++;
      });
    }
  } else if (post.contentHtml) {
    bodySections.push(cleanSectionContent(post.contentHtml));
  } else if (post.content) {
    bodySections.push(post.content);
  }

  return `${frontmatterLines.join('\n')}\n\n${bodySections.join('\n\n')}\n`;
}

/**
 * Migration runner for a given language.
 */
function migrateLanguage(lang) {
  const srcJsonPath = path.join(rootDir, 'src', 'data', 'blog', lang, '2026', '09.json');
  const targetDir = path.join(rootDir, 'src', 'data', 'blog', lang);

  if (!fs.existsSync(srcJsonPath)) {
    console.error(`Source file not found: ${srcJsonPath}`);
    return 0;
  }

  const rawJson = fs.readFileSync(srcJsonPath, 'utf8');
  const posts = JSON.parse(rawJson);

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  let count = 0;
  posts.forEach((post) => {
    const mdContent = convertPostToMarkdown(post, lang);
    const fileName = `${post.slug}.md`;
    const targetFilePath = path.join(targetDir, fileName);
    fs.writeFileSync(targetFilePath, mdContent, 'utf8');
    count++;
  });

  console.log(`[${lang.toUpperCase()}] Successfully converted and wrote ${count} posts to ${targetDir}`);
  return count;
}

// Run migration for both VI and EN
console.log('Starting Blog Migration: JSON -> Markdown (YAML Frontmatter)...');
const viCount = migrateLanguage('vi');
const enCount = migrateLanguage('en');
console.log(`Migration complete! Total: ${viCount} Vietnamese posts, ${enCount} English posts.`);
