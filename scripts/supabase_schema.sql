-- ==============================================================================
-- Schema Definition for Portfolio & Blog CMS (Supabase PostgreSQL)
-- Target: ga2631.github.io
-- Architecture: Normalized Multi-Language Blog + Document-based Multi-Language CV
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. Helper function for updated_at timestamps
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------------------------
-- 2. Core: LANGUAGES Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS languages (
    code TEXT PRIMARY KEY, -- 'vi', 'en', etc.
    name TEXT NOT NULL,    -- 'Tiếng Việt', 'English'
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Seed initial languages
INSERT INTO languages (code, name)
VALUES 
    ('vi', 'Tiếng Việt'),
    ('en', 'English')
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name;

-- ------------------------------------------------------------------------------
-- 3. Phân Hệ Blog: CATEGORIES & CATEGORY_TRANSLATIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    post_schedule INT,               -- Schedule day code / sequence (e.g. 1=Mon, 2=Tue, ...)
    icon TEXT,                       -- Lucide / custom icon name
    color TEXT,                      -- Hex or CSS color string
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TRIGGER trg_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS category_translations (
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    lang_code TEXT NOT NULL REFERENCES languages(code) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    PRIMARY KEY (category_id, lang_code)
);

-- ------------------------------------------------------------------------------
-- 4. Phân Hệ Blog: TAGS & TAG_TRANSLATIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TRIGGER trg_tags_updated_at
    BEFORE UPDATE ON tags
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS tag_translations (
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    lang_code TEXT NOT NULL REFERENCES languages(code) ON DELETE CASCADE,
    name TEXT NOT NULL,
    PRIMARY KEY (tag_id, lang_code)
);

-- ------------------------------------------------------------------------------
-- 5. Phân Hệ Blog: POSTS, POST_TAGS & POST_TRANSLATIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    slug TEXT UNIQUE NOT NULL,
    read_time INT NOT NULL DEFAULT 5,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
    published_at TIMESTAMPTZ
);

CREATE TRIGGER trg_posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS post_tags (
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

CREATE TABLE IF NOT EXISTS post_translations (
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    lang_code TEXT NOT NULL REFERENCES languages(code) ON DELETE CASCADE,
    title TEXT NOT NULL,
    summary TEXT,
    content_md TEXT NOT NULL,
    content_html TEXT,
    PRIMARY KEY (post_id, lang_code)
);

-- ------------------------------------------------------------------------------
-- 6. Phân Hệ CV: CV_DOCUMENTS (Rút gọn JSONB per Language)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cv_documents (
    lang_code TEXT PRIMARY KEY REFERENCES languages(code) ON DELETE CASCADE,
    personal_info JSONB NOT NULL DEFAULT '{}'::jsonb,
    principles JSONB NOT NULL DEFAULT '[]'::jsonb,
    experiences JSONB NOT NULL DEFAULT '[]'::jsonb,
    projects JSONB NOT NULL DEFAULT '[]'::jsonb,
    skill_categories JSONB NOT NULL DEFAULT '[]'::jsonb,
    educations JSONB NOT NULL DEFAULT '[]'::jsonb,
    certifications JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TRIGGER trg_cv_documents_updated_at
    BEFORE UPDATE ON cv_documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 7. High-Performance Indexes
-- ------------------------------------------------------------------------------
-- Posts & Categories
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_posts_category_id ON posts(category_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);

-- Post Tags Junction
CREATE INDEX IF NOT EXISTS idx_post_tags_tag_id ON post_tags(tag_id);

-- Translations Indexes
CREATE INDEX IF NOT EXISTS idx_category_translations_lang ON category_translations(lang_code);
CREATE INDEX IF NOT EXISTS idx_tag_translations_lang ON tag_translations(lang_code);
CREATE INDEX IF NOT EXISTS idx_post_translations_lang ON post_translations(lang_code);

-- Fulltext / GIN Indexes for fast search
CREATE INDEX IF NOT EXISTS idx_cv_documents_gin_personal ON cv_documents USING GIN (personal_info);
CREATE INDEX IF NOT EXISTS idx_cv_documents_gin_projects ON cv_documents USING GIN (projects);

-- ------------------------------------------------------------------------------
-- 8. Row Level Security (RLS) Configuration & Policies
-- ------------------------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE tag_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_documents ENABLE ROW LEVEL SECURITY;

-- 8.1. Public / Anon Read Policies
CREATE POLICY "Public languages are viewable by everyone" 
    ON languages FOR SELECT USING (true);

CREATE POLICY "Public categories are viewable by everyone" 
    ON categories FOR SELECT USING (true);

CREATE POLICY "Public category_translations are viewable by everyone" 
    ON category_translations FOR SELECT USING (true);

CREATE POLICY "Public tags are viewable by everyone" 
    ON tags FOR SELECT USING (true);

CREATE POLICY "Public tag_translations are viewable by everyone" 
    ON tag_translations FOR SELECT USING (true);

CREATE POLICY "Published posts are viewable by everyone" 
    ON posts FOR SELECT 
    USING (published_at IS NOT NULL AND published_at <= TIMEZONE('utc'::text, NOW()) OR auth.role() = 'authenticated');

CREATE POLICY "Public post_tags are viewable by everyone" 
    ON post_tags FOR SELECT USING (true);

CREATE POLICY "Public post_translations are viewable by everyone" 
    ON post_translations FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM posts p 
            WHERE p.id = post_translations.post_id 
              AND (p.published_at IS NOT NULL AND p.published_at <= TIMEZONE('utc'::text, NOW()) OR auth.role() = 'authenticated')
        )
    );

CREATE POLICY "Public cv_documents are viewable by everyone" 
    ON cv_documents FOR SELECT USING (true);

-- 8.2. Authenticated Admin Full Access Policies (INSERT, UPDATE, DELETE, SELECT)
CREATE POLICY "Admin full access languages" 
    ON languages FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access categories" 
    ON categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access category_translations" 
    ON category_translations FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access tags" 
    ON tags FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access tag_translations" 
    ON tag_translations FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access posts" 
    ON posts FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access post_tags" 
    ON post_tags FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access post_translations" 
    ON post_translations FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access cv_documents" 
    ON cv_documents FOR ALL TO authenticated USING (true) WITH CHECK (true);
