-- ==============================================================================
-- Migration: Chuyển cột slug từ bảng posts sang bảng post_translations
-- Ngày tạo: 2026-10-04
-- Hệ quản trị CSDL: Supabase PostgreSQL (ga2631.github.io)
-- Mục tiêu:
--   1. Tối ưu hoá SEO đa ngôn ngữ: Mỗi ngôn ngữ (Tiếng Việt, Tiếng Anh, ...) 
--      sở hữu một đường dẫn slug thân thiện và chuẩn SEO riêng biệt.
--      Ví dụ:
--        - Tiếng Việt: /vi/blog/kien-truc-microservices-thuc-chien
--        - Tiếng Anh:  /en/blog/microservices-architecture-in-practice
--   2. Di chuyển dữ liệu (Data Migration / Backfill) an toàn không mất dữ liệu cũ.
--   3. Tạo ràng buộc và chỉ mục Unique trên cặp (lang_code, slug).
--   4. Loại bỏ ràng buộc và cột slug trên bảng posts.
-- ==============================================================================

BEGIN;

-- ------------------------------------------------------------------------------
-- BƯỚC 1: Thêm cột `slug` vào bảng `post_translations` (nếu chưa có)
-- ------------------------------------------------------------------------------
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'post_translations' AND column_name = 'slug'
    ) THEN
        ALTER TABLE post_translations ADD COLUMN slug TEXT;
        RAISE NOTICE 'Đã thêm cột "slug" vào bảng "post_translations".';
    ELSE
        RAISE NOTICE 'Cột "slug" đã tồn tại trong bảng "post_translations".';
    END IF;
END $$;

-- ------------------------------------------------------------------------------
-- BƯỚC 2: Di chuyển (Backfill) dữ liệu slug từ bảng `posts` sang `post_translations`
-- ------------------------------------------------------------------------------
-- 2.1. Cập nhật slug từ posts sang các bản dịch tương ứng đang thiếu slug
UPDATE post_translations pt
SET slug = p.slug
FROM posts p
WHERE pt.post_id = p.id
  AND (pt.slug IS NULL OR TRIM(pt.slug) = '')
  AND p.slug IS NOT NULL;

-- 2.2. Xử lý trường hợp ngoại lệ: Nếu bản dịch vẫn chưa có slug (do posts.slug bị rỗng)
-- Tạo slug tự động từ tiêu đề hoặc mã post_id
UPDATE post_translations
SET slug = LOWER(
    REGEXP_REPLACE(
        REGEXP_REPLACE(
            COALESCE(NULLIF(TRIM(title), ''), 'post-' || SUBSTRING(post_id::text, 1, 8)),
            '[^a-zA-Z0-9]+', '-', 'g'
        ),
        '^-+|-+$', '', 'g'
    )
)
WHERE slug IS NULL OR TRIM(slug) = '';

-- 2.3. Fallback dự phòng cuối cùng nếu vẫn còn null
UPDATE post_translations
SET slug = 'post-' || SUBSTRING(post_id::text, 1, 8) || '-' || lang_code
WHERE slug IS NULL OR TRIM(slug) = '';

-- 2.4. Xử lý xung đột trùng lặp slug trong cùng một ngôn ngữ (nếu có trước khi tạo UNIQUE)
DO $$
DECLARE
    r RECORD;
    new_slug TEXT;
BEGIN
    FOR r IN (
        SELECT post_id, lang_code, slug, 
               ROW_NUMBER() OVER(PARTITION BY lang_code, slug ORDER BY post_id) as rn
        FROM post_translations
    ) LOOP
        IF r.rn > 1 THEN
            new_slug := r.slug || '-' || r.rn;
            UPDATE post_translations
            SET slug = new_slug
            WHERE post_id = r.post_id AND lang_code = r.lang_code;
            RAISE NOTICE 'Đã đổi tên slug bị trùng: % -> % (lang: %)', r.slug, new_slug, r.lang_code;
        END IF;
    END LOOP;
END $$;

-- ------------------------------------------------------------------------------
-- BƯỚC 3: Thiết lập ràng buộc NOT NULL và chỉ mục UNIQUE trên `post_translations`
-- ------------------------------------------------------------------------------
ALTER TABLE post_translations ALTER COLUMN slug SET NOT NULL;

-- Tạo unique index trên (lang_code, slug) đảm bảo mỗi ngôn ngữ có slug duy nhất
CREATE UNIQUE INDEX IF NOT EXISTS idx_post_translations_lang_slug 
ON post_translations(lang_code, slug);

-- Tạo index phụ trên cột slug để tăng tốc truy vấn tìm kiếm bài viết theo slug
CREATE INDEX IF NOT EXISTS idx_post_translations_slug 
ON post_translations(slug);

-- ------------------------------------------------------------------------------
-- BƯỚC 4: Dọn dẹp chỉ mục và cột `slug` trên bảng `posts`
-- ------------------------------------------------------------------------------
-- Xoá index cũ trên posts(slug)
DROP INDEX IF EXISTS idx_posts_slug;

-- Tìm và xoá ràng buộc UNIQUE trên cột posts.slug (nếu có)
DO $$
DECLARE
    con_name TEXT;
BEGIN
    FOR con_name IN (
        SELECT con.conname
        FROM pg_constraint con
        JOIN pg_class rel ON rel.oid = con.conrelid
        WHERE rel.relname = 'posts' 
          AND con.contype = 'u'
          AND EXISTS (
              SELECT 1 FROM pg_attribute att 
              WHERE att.attrelid = rel.oid 
                AND att.attnum = ANY(con.conkey) 
                AND att.attname = 'slug'
          )
    ) LOOP
        EXECUTE 'ALTER TABLE posts DROP CONSTRAINT ' || quote_ident(con_name);
        RAISE NOTICE 'Đã xoá ràng buộc unique constraint "%" trên bảng posts.', con_name;
    END LOOP;
END $$;

-- Xoá cột slug khỏi bảng posts
ALTER TABLE posts DROP COLUMN IF EXISTS slug CASCADE;

COMMIT;

-- ==============================================================================
-- HƯỚNG DẪN ROLLBACK (Khôi phục nếu cần):
-- ==============================================================================
-- BEGIN;
-- ALTER TABLE posts ADD COLUMN IF NOT EXISTS slug TEXT;
-- UPDATE posts p 
-- SET slug = pt.slug 
-- FROM post_translations pt 
-- WHERE p.id = pt.post_id AND pt.lang_code = 'vi';
-- ALTER TABLE posts ALTER COLUMN slug SET NOT NULL;
-- CREATE UNIQUE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
-- DROP INDEX IF EXISTS idx_post_translations_lang_slug;
-- DROP INDEX IF EXISTS idx_post_translations_slug;
-- ALTER TABLE post_translations DROP COLUMN IF EXISTS slug;
-- COMMIT;
