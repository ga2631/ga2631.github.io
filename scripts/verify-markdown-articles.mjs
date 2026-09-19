import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseFrontmatter, markdownToHtml } from '../src/utils/markdownParser.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const REQUIRED_CATEGORIES = [
  'architecture-system-design',
  'data-engineering-analytics',
  'devops-cloud-tooling',
  'code-craftsmanship-languages',
  'tech-radar-career-insights',
];

function verifyPostsInDir(lang) {
  const dirPath = path.join(rootDir, 'src', 'data', 'blog', lang);
  const files = fs.readdirSync(dirPath).filter((f) => f.endsWith('.md'));

  console.log(`[${lang.toUpperCase()}] Verifying ${files.length} Markdown files in ${dirPath}...`);
  if (files.length === 0) {
    throw new Error(`No markdown files found in ${dirPath}`);
  }

  const seenIds = new Set();
  const seenSlugs = new Set();

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    const content = fs.readFileSync(fullPath, 'utf8');

    // 1. Parse Frontmatter
    const { metadata, content: mdBody } = parseFrontmatter(content);
    if (!metadata || typeof metadata !== 'object') {
      throw new Error(`[${file}] Invalid Frontmatter`);
    }

    // 2. Validate metadata fields
    const requiredFields = ['id', 'slug', 'title', 'summary', 'category', 'publishedAt', 'date', 'readTime', 'tags'];
    requiredFields.forEach((field) => {
      if (!metadata[field]) {
        throw new Error(`[${file}] Missing required metadata field: "${field}"`);
      }
    });

    if (metadata.author) {
      throw new Error(`[${file}] "author" field must be omitted from Frontmatter`);
    }

    if (!Array.isArray(metadata.tags) || metadata.tags.length === 0) {
      throw new Error(`[${file}] "tags" must be a non-empty array`);
    }

    if (!REQUIRED_CATEGORIES.includes(metadata.category)) {
      throw new Error(`[${file}] Unknown category: "${metadata.category}"`);
    }

    if (seenIds.has(metadata.id)) {
      throw new Error(`[${file}] Duplicate id: "${metadata.id}"`);
    }
    seenIds.add(metadata.id);

    if (seenSlugs.has(metadata.slug)) {
      throw new Error(`[${file}] Duplicate slug: "${metadata.slug}"`);
    }
    seenSlugs.add(metadata.slug);

    // 3. Render Markdown to HTML and check sections
    const html = markdownToHtml(mdBody);
    if (!html || html.length < 100) {
      throw new Error(`[${file}] Rendered HTML is too short or empty`);
    }

    const headingMatches = html.match(/<h[1-6][^>]*>/gi) || [];
    if (headingMatches.length < 5) {
      throw new Error(`[${file}] Expected at least 5 section headings, found ${headingMatches.length}`);
    }
  });

  // Statistics calculation
  const categoryCounts = {};
  REQUIRED_CATEGORIES.forEach((cat) => { categoryCounts[cat] = 0; });
  const tagCounts = {};

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    const content = fs.readFileSync(fullPath, 'utf8');
    const { metadata } = parseFrontmatter(content);
    if (metadata.category) {
      categoryCounts[metadata.category] = (categoryCounts[metadata.category] || 0) + 1;
    }
    if (Array.isArray(metadata.tags)) {
      metadata.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });

  console.log(`[${lang.toUpperCase()}] Category breakdown (Total ${files.length} articles):`);
  Object.entries(categoryCounts).forEach(([cat, count]) => {
    console.log(`  - ${cat}: ${count} bài viết`);
  });

  console.log(`[${lang.toUpperCase()}] Tags breakdown (${Object.keys(tagCounts).length} unique tags):`);
  const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
  sortedTags.forEach(([tag, count]) => {
    console.log(`  - #${tag}: ${count} bài`);
  });

  console.log(`[${lang.toUpperCase()}] All ${files.length} posts passed integrity & structure validation!\n`);
  return { count: files.length, categoryCounts, tagCounts };
}

console.log('--- BLOG MARKDOWN INTEGRITY VERIFICATION ---');
const viRes = verifyPostsInDir('vi');
const enRes = verifyPostsInDir('en');

if (viRes.count !== enRes.count) {
  throw new Error(`Mismatch between VI count (${viRes.count}) and EN count (${enRes.count})`);
}

console.log(`SUCCESS: Total ${viRes.count + enRes.count} Markdown articles (${viRes.count} VI, ${enRes.count} EN) verified with 100% integrity and accurate statistics!`);
