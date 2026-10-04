-- ==============================================================================
-- Migration: Chuyển cột slug từ bảng categories sang bảng category_translations
-- Ngày tạo: 2026-10-04
-- Hệ quản trị CSDL: Supabase PostgreSQL (ga2631.github.io)
-- Mục tiêu:
--   1. Tối ưu hoá SEO đa ngôn ngữ: Mỗi ngôn ngữ (Tiếng Việt, Tiếng Anh, ...) 
--      sở hữu một đường dẫn slug chuyên mục thân thiện và chuẩn SEO riêng biệt.
--      Ví dụ:
--        - Tiếng Việt: /vi/blog?category=kien-truc-he-thong
--        - Tiếng Anh:  /en/blog?category=system-architecture
--   2. Di chuyển dữ liệu (Data Migration / Backfill) an toàn không mất dữ liệu cũ.
--   3. Tạo ràng buộc và chỉ mục Unique trên cặp (lang_code, slug).
--   4. Loại bỏ ràng buộc và cột slug trên bảng categories.
-- ==============================================================================

BEGIN;

-- ------------------------------------------------------------------------------
-- BƯỚC 1: Thêm cột `slug` vào bảng `category_translations` (nếu chưa có)
-- ------------------------------------------------------------------------------
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'category_translations' AND column_name = 'slug'
    ) THEN
        ALTER TABLE category_translations ADD COLUMN slug TEXT;
        RAISE NOTICE 'Đã thêm cột "slug" vào bảng "category_translations".';
    ELSE
        RAISE NOTICE 'Cột "slug" đã tồn tại trong bảng "category_translations".';
    END IF;
END $$;

-- ------------------------------------------------------------------------------
-- BƯỚC 2: Di chuyển (Backfill) dữ liệu slug từ bảng `categories` sang `category_translations`
-- ------------------------------------------------------------------------------
-- 2.1. Cập nhật slug từ categories sang các bản dịch tương ứng đang thiếu slug
UPDATE category_translations ct
SET slug = c.slug
FROM categories c
WHERE ct.category_id = c.id
  AND (ct.slug IS NULL OR TRIM(ct.slug) = '')
  AND c.slug IS NOT NULL;

-- 2.2. Xử lý trường hợp ngoại lệ: Nếu bản dịch vẫn chưa có slug (do categories.slug bị rỗng)
-- Tạo slug tự động từ tên chuyên mục hoặc mã category_id
UPDATE category_translations
SET slug = LOWER(
    REGEXP_REPLACE(
        REGEXP_REPLACE(
            COALESCE(NULLIF(TRIM(name), ''), 'category-' || SUBSTRING(category_id::text, 1, 8)),
            '[^a-zA-Z0-9]+', '-', 'g'
        ),
        '^-+|-+$', '', 'g'
    )
)
WHERE slug IS NULL OR TRIM(slug) = '';

-- 2.3. Fallback dự phòng cuối cùng nếu vẫn còn null
UPDATE category_translations
SET slug = 'category-' || SUBSTRING(category_id::text, 1, 8) || '-' || lang_code
WHERE slug IS NULL OR TRIM(slug) = '';

-- 2.4. Xử lý xung đột trùng lặp slug trong cùng một ngôn ngữ (nếu có trước khi tạo UNIQUE)
DO $$
DECLARE
    r RECORD;
    new_slug TEXT;
BEGIN
    FOR r IN (
        SELECT category_id, lang_code, slug, 
               ROW_NUMBER() OVER(PARTITION BY lang_code, slug ORDER BY category_id) as rn
        FROM category_translations
    ) LOOP
        IF r.rn > 1 THEN
            new_slug := r.slug || '-' || r.rn;
            UPDATE category_translations
            SET slug = new_slug
            WHERE category_id = r.category_id AND lang_code = r.lang_code;
            RAISE NOTICE 'Đã đổi tên slug chuyên mục bị trùng: % -> % (lang: %)', r.slug, new_slug, r.lang_code;
        END IF;
    END LOOP;
END $$;

-- ------------------------------------------------------------------------------
-- BƯỚC 3: Thiết lập ràng buộc NOT NULL và chỉ mục UNIQUE trên `category_translations`
-- ------------------------------------------------------------------------------
ALTER TABLE category_translations ALTER COLUMN slug SET NOT NULL;

-- Tạo unique index trên (lang_code, slug) đảm bảo mỗi ngôn ngữ có slug chuyên mục duy nhất
CREATE UNIQUE INDEX IF NOT EXISTS idx_category_translations_lang_slug 
ON category_translations(lang_code, slug);

-- Tạo index phụ trên cột slug để tăng tốc truy vấn tìm kiếm/lọc chuyên mục theo slug
CREATE INDEX IF NOT EXISTS idx_category_translations_slug 
ON category_translations(slug);

-- ------------------------------------------------------------------------------
-- BƯỚC 4: Dọn dẹp chỉ mục và cột `slug` trên bảng `categories`
-- ------------------------------------------------------------------------------
-- Xoá index cũ trên categories(slug)
DROP INDEX IF EXISTS idx_categories_slug;

-- Tìm và xoá ràng buộc UNIQUE trên cột categories.slug (nếu có)
DO $$
DECLARE
    con_name TEXT;
BEGIN
    FOR con_name IN (
        SELECT con.conname
        FROM pg_constraint con
        JOIN pg_class rel ON rel.oid = con.conrelid
        WHERE rel.relname = 'categories' 
          AND con.contype = 'u'
          AND EXISTS (
              SELECT 1 FROM pg_attribute att 
              WHERE att.attrelid = rel.oid 
                AND att.attnum = ANY(con.conkey) 
                AND att.attname = 'slug'
          )
    ) LOOP
        EXECUTE 'ALTER TABLE categories DROP CONSTRAINT ' || quote_ident(con_name);
        RAISE NOTICE 'Đã xoá ràng buộc unique constraint "%" trên bảng categories.', con_name;
    END LOOP;
END $$;

-- Xoá cột slug khỏi bảng categories
ALTER TABLE categories DROP COLUMN IF EXISTS slug CASCADE;

COMMIT;

-- ==============================================================================
-- HƯỚNG DẪN ROLLBACK (Khôi phục nếu cần):
-- ==============================================================================
-- BEGIN;
-- ALTER TABLE categories ADD COLUMN IF NOT EXISTS slug TEXT;
-- UPDATE categories c 
-- SET slug = ct.slug 
-- FROM category_translations ct 
-- WHERE c.id = ct.category_id AND ct.lang_code = 'vi';
-- ALTER TABLE categories ALTER COLUMN slug SET NOT NULL;
-- CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
-- DROP INDEX IF EXISTS idx_category_translations_lang_slug;
-- DROP INDEX IF EXISTS idx_category_translations_slug;
-- ALTER TABLE category_translations DROP COLUMN IF EXISTS slug;
-- COMMIT;
