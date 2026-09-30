import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load environment variables from .env.local
function loadEnv() {
  const envPath = path.join(rootDir, '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...vals] = trimmed.split('=');
        if (key && vals.length > 0) {
          process.env[key.trim()] = vals.join('=').trim();
        }
      }
    });
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || !supabaseUrl.startsWith('https://')) {
  console.error('❌ Error: Supabase URL or Key is missing. Please configure .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Frontmatter parser for markdown files
function parseMarkdown(content) {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, body: content };
  }

  const frontmatterLines = match[1].split('\n');
  const body = match[2];
  const frontmatter = {};

  let currentKey = null;
  let isArray = false;

  for (const line of frontmatterLines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    if (trimmed.startsWith('- ') && currentKey && isArray) {
      frontmatter[currentKey].push(trimmed.substring(2).replace(/^["']|["']$/g, '').trim());
      continue;
    }

    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.substring(0, colonIndex).trim();
      const val = line.substring(colonIndex + 1).trim();

      if (val === '') {
        currentKey = key;
        isArray = true;
        frontmatter[key] = [];
      } else {
        currentKey = null;
        isArray = false;
        let parsedVal = val.replace(/^["']|["']$/g, '');
        if (parsedVal === 'true') parsedVal = true;
        else if (parsedVal === 'false') parsedVal = false;
        frontmatter[key] = parsedVal;
      }
    }
  }

  return { frontmatter, body };
}

function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function seedLanguages() {
  console.log('\n🌐 1. Seeding Languages (LANGUAGES)...');
  const { error } = await supabase.from('languages').upsert([
    { code: 'vi', name: 'Tiếng Việt', is_active: true },
    { code: 'en', name: 'English', is_active: true }
  ], { onConflict: 'code' });

  if (error) console.error('  ❌ Error seeding languages:', error.message);
  else console.log('  ✅ Languages seeded (vi, en)');
}

async function seedCvDocuments() {
  console.log('\n📄 2. Seeding CV Documents (CV_DOCUMENTS)...');
  for (const lang of ['vi', 'en']) {
    let cvPath = path.join(rootDir, 'scripts', 'seeds', `${lang}_cv.json`);
    if (!fs.existsSync(cvPath)) {
      cvPath = path.join(rootDir, 'src', 'data', 'locales', lang, 'cv.json');
    }
    if (!fs.existsSync(cvPath)) {
      console.warn(`  ⚠️ File not found: ${cvPath}`);
      continue;
    }

    const cvData = JSON.parse(fs.readFileSync(cvPath, 'utf8'));

    const { error } = await supabase.from('cv_documents').upsert({
      lang_code: lang,
      personal_info: cvData.personalInfo || {},
      principles: cvData.principles || [],
      experiences: cvData.experiences || [],
      projects: cvData.projects || [],
      skill_categories: cvData.skillCategories || [],
      educations: cvData.educations || [],
      certifications: cvData.certifications || [],
    }, { onConflict: 'lang_code' });

    if (error) console.error(`  ❌ Error seeding CV [${lang}]:`, error.message);
    else console.log(`  ✅ CV document [${lang.toUpperCase()}] seeded`);
  }
}

const CATEGORY_DEFINITIONS = [
  {
    slug: 'architecture-system-design',
    post_schedule: 1,
    icon: 'LayersIcon',
    color: '#3B82F6',
    translations: {
      vi: { name: 'Kiến trúc Hệ thống', description: 'Thiết kế phân tán, High Load, Microservices và Cơ sở dữ liệu quy mô lớn.' },
      en: { name: 'Architecture & System Design', description: 'Distributed systems, High Load, Microservices, and Large-Scale DBs.' }
    }
  },
  {
    slug: 'core-algorithms-series',
    post_schedule: 2,
    icon: 'CpuIcon',
    color: '#10B981',
    translations: {
      vi: { name: 'Thuật toán & Hiệu năng Core', description: 'Giải thuật cốt lõi, tối ưu hoá bộ nhớ và cấu trúc dữ liệu hiệu năng cao.' },
      en: { name: 'Core Algorithms & Performance', description: 'Core algorithms, memory optimizations, and high-performance data structures.' }
    }
  },
  {
    slug: 'database-data-engineering',
    post_schedule: 3,
    icon: 'DatabaseIcon',
    color: '#F59E0B',
    translations: {
      vi: { name: 'Cơ sở Dữ liệu & Data Engineering', description: 'CDC, PostgreSQL, DuckDB, Medallion Architecture và tối ưu hóa truy vấn.' },
      en: { name: 'Databases & Data Engineering', description: 'CDC, PostgreSQL, DuckDB, Medallion Architecture, and query tuning.' }
    }
  },
  {
    slug: 'dry-reusable-ui-components',
    post_schedule: 4,
    icon: 'ComponentIcon',
    color: '#8B5CF6',
    translations: {
      vi: { name: 'Frontend & UI Tái sử dụng', description: 'Thiết kế Component tái sử dụng cao, CSS Modular và tối ưu UX.' },
      en: { name: 'Frontend & Reusable UI', description: 'Highly reusable components, Modular CSS, and UX optimization.' }
    }
  },
  {
    slug: 'tech-radar-career-insights',
    post_schedule: 5,
    icon: 'CompassIcon',
    color: '#EC4899',
    translations: {
      vi: { name: 'Tech Radar & Góc nhìn Nghề nghiệp', description: 'Xu hướng công nghệ, tư duy kỹ sư và bài học lãnh đạo kỹ thuật.' },
      en: { name: 'Tech Radar & Career Insights', description: 'Technology radar, engineering mindset, and technical leadership insights.' }
    }
  }
];

async function seedCategories() {
  console.log('\n🗂️ 3. Seeding Categories & Category Translations...');
  const categoryMap = new Map(); // slug -> id

  for (const cat of CATEGORY_DEFINITIONS) {
    // 1. Upsert category
    const { data, error } = await supabase
      .from('categories')
      .upsert({
        slug: cat.slug,
        post_schedule: cat.post_schedule,
        icon: cat.icon,
        color: cat.color,
      }, { onConflict: 'slug' })
      .select('id, slug')
      .single();

    if (error) {
      console.error(`  ❌ Error seeding category [${cat.slug}]:`, error.message);
      continue;
    }

    categoryMap.set(cat.slug, data.id);

    // 2. Upsert translations
    for (const [langCode, trans] of Object.entries(cat.translations)) {
      const { error: transErr } = await supabase
        .from('category_translations')
        .upsert({
          category_id: data.id,
          lang_code: langCode,
          name: trans.name,
          description: trans.description,
        }, { onConflict: 'category_id,lang_code' });

      if (transErr) console.error(`  ❌ Error seeding category translation [${cat.slug}:${langCode}]:`, transErr.message);
    }
  }

  console.log(`  ✅ Categories & Translations seeded (${categoryMap.size} categories)`);
  return categoryMap;
}

async function seedPostsAndTags(categoryMap) {
  console.log('\n📝 4. Seeding Tags, Posts & Post Translations...');
  const tagMap = new Map(); // tag_slug -> id

  // Helper to ensure tag exists
  async function getOrCreateTag(tagName) {
    const tagSlug = slugify(tagName);
    if (tagMap.has(tagSlug)) return tagMap.get(tagSlug);

    const { data: tag, error: tagErr } = await supabase
      .from('tags')
      .upsert({ slug: tagSlug }, { onConflict: 'slug' })
      .select('id')
      .single();

    if (tagErr) {
      console.error(`  ❌ Error creating tag [${tagName}]:`, tagErr.message);
      return null;
    }

    tagMap.set(tagSlug, tag.id);

    // Insert translation for tag in both vi and en
    for (const lang of ['vi', 'en']) {
      await supabase.from('tag_translations').upsert({
        tag_id: tag.id,
        lang_code: lang,
        name: tagName,
      }, { onConflict: 'tag_id,lang_code' });
    }

    return tag.id;
  }

  // Load all posts from vi & en directories
  const postsMap = new Map(); // slug -> { viPost, enPost }

  for (const lang of ['vi', 'en']) {
    const blogDir = path.join(rootDir, 'src', 'data', 'blog', lang);
    if (!fs.existsSync(blogDir)) continue;

    const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));
    for (const filename of files) {
      const content = fs.readFileSync(path.join(blogDir, filename), 'utf8');
      const { frontmatter, body } = parseMarkdown(content);
      const slug = frontmatter.slug || filename.replace(/^\d+-/, '').replace(/\.md$/, '');

      if (!postsMap.has(slug)) {
        postsMap.set(slug, {});
      }
      postsMap.get(slug)[lang] = {
        frontmatter,
        body,
        filename
      };
    }
  }

  let postCount = 0;

  for (const [slug, pair] of postsMap.entries()) {
    const primary = pair.vi || pair.en;
    const catSlug = primary.frontmatter.category || 'tech-radar-career-insights';
    const categoryId = categoryMap.get(catSlug) || null;
    const readTime = parseInt(primary.frontmatter.readTime) || 5;
    const publishedAt = primary.frontmatter.publishedAt || primary.frontmatter.date || new Date().toISOString();

    // 1. Upsert Post
    const { data: post, error: postErr } = await supabase
      .from('posts')
      .upsert({
        slug,
        category_id: categoryId,
        read_time: readTime,
        published_at: new Date(publishedAt).toISOString(),
      }, { onConflict: 'slug' })
      .select('id')
      .single();

    if (postErr) {
      console.error(`  ❌ Error creating post [${slug}]:`, postErr.message);
      continue;
    }

    // 2. Link Tags
    const tags = primary.frontmatter.tags || [];
    for (const tagName of tags) {
      const tagId = await getOrCreateTag(tagName);
      if (tagId) {
        await supabase.from('post_tags').upsert({
          post_id: post.id,
          tag_id: tagId,
        }, { onConflict: 'post_id,tag_id' });
      }
    }

    // 3. Upsert Post Translations
    for (const lang of ['vi', 'en']) {
      const item = pair[lang];
      if (item) {
        const { error: transErr } = await supabase
          .from('post_translations')
          .upsert({
            post_id: post.id,
            lang_code: lang,
            title: item.frontmatter.title || 'Untitled',
            summary: item.frontmatter.summary || '',
            content_md: item.body.trim(),
            content_html: null,
          }, { onConflict: 'post_id,lang_code' });

        if (transErr) console.error(`  ❌ Error creating post translation [${slug}:${lang}]:`, transErr.message);
      }
    }

    postCount++;
  }

  console.log(`  ✅ Posts & Translations seeded (${postCount} posts)`);
}

async function main() {
  console.log('🚀 Starting Supabase Database Migration & Seeding...');
  try {
    await seedLanguages();
    await seedCvDocuments();
    const categoryMap = await seedCategories();
    await seedPostsAndTags(categoryMap);
    console.log('\n🎉 Supabase Database Migration & Seeding completed successfully!\n');
  } catch (err) {
    console.error('Fatal error during seeding:', err);
    process.exit(1);
  }
}

main();
