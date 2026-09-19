# Feature: Markdown Blog Storage & Retrieval Engine

## 1. End-to-End System Flow

Hệ thống blog đã được tái cấu trúc toàn diện từ mô hình lưu trữ JSON escaped (`09.json` phình to) sang **hệ thống tệp tin Markdown (.md) độc lập với YAML Frontmatter**. Luồng dữ liệu vận hành từ tầng lưu trữ đến giao diện người dùng như sau:

```mermaid
flowchart TD
    subgraph StorageLayer ["1. Tầng Lưu Trữ Tệp Tin (File Storage)"]
        VIPosts["src/data/blog/vi/*.md (39 Bài viết Tiếng Việt)"]
        ENPosts["src/data/blog/en/*.md (39 Bài viết Tiếng Anh)"]
    end

    subgraph ServiceLayer ["2. Tầng Phân Tích Cú Pháp & Dịch Vụ (Service & Parser)"]
        ViteGlob["Vite import.meta.glob(?raw, eager)"]
        Parser["markdownParser.ts (parseFrontmatter & markdownToHtml)"]
        BlogService["blogService.ts (getEagerPosts, loadInitialBlogPosts, loadAllArchivePosts)"]
        
        VIPosts --> ViteGlob
        ENPosts --> ViteGlob
        ViteGlob --> Parser
        Parser --> BlogService
    end

    subgraph PresentationLayer ["3. Tầng Giao Diện Người Dùng (React SPA UI)"]
        BlogSection["BlogSection.tsx (Lọc chuyên mục, Tìm kiếm, Phân trang)"]
        ModalArticle["ModalArticle.tsx (Mục lục TOC, Dark Mode, Render Bài Viết)"]
        MermaidViewer["ModalDiagramViewer.tsx (Pan & Zoom Sơ đồ 60 FPS)"]
        
        BlogService --> BlogSection
        BlogSection --> ModalArticle
        ModalArticle --> MermaidViewer
    end
```

1. **Khởi tạo dữ liệu:** Vite sử dụng `import.meta.glob('/src/data/blog/{vi,en}/*.md', { query: '?raw', eager: true })` để nạp toàn bộ mã nguồn Markdown dạng chuỗi thô (raw string) một cách đồng bộ khi khởi động.
2. **Bóc tách Metadata & Biên dịch HTML:** `markdownParser.ts` bóc tách phần YAML Frontmatter (`id`, `slug`, `title`, `summary`, `category`, `publishedAt`, `date`, `readTime`, `tags`) và biên dịch thân bài viết sang HTML chuẩn (hỗ trợ GFM tables, syntax highlight, Mermaid fences).
3. **Phục vụ UI & Tương tác:** `blogService.ts` cung cấp dữ liệu bài viết chuẩn `BlogPost` cho `BlogSection.tsx` (danh sách, phân trang, lọc theo 5 chuyên mục) và `ModalArticle.tsx` (mục lục tự động TOC, chuyển đổi theme, render sơ đồ Mermaid tương tác).

---

## 2. Database & Schema Changes

### Cấu trúc Thư mục & Quy chuẩn Đặt tên Tệp Tin Mới:
- **Cấu trúc đặt tên:** `YYYY-MM-DD-<slug>.md` (Trong đó tiền tố `YYYY-MM-DD` là ngày đăng `publishedAt`/`date` của bài viết).
- **Tiếng Việt:** `src/data/blog/vi/YYYY-MM-DD-<slug>.md` (ví dụ: `2026-09-14-3-tier-dry-frontend-architecture-business-service-layer.md`)
- **Tiếng Anh:** `src/data/blog/en/YYYY-MM-DD-<slug>.md` (ví dụ: `2026-09-14-3-tier-dry-frontend-architecture-business-service-layer.md`)
- Loại bỏ hoàn toàn các thư mục lồng nhau và các file JSON cồng kềnh `src/data/blog/{vi,en}/2026/09.json`.

### Chuẩn Schema YAML Frontmatter:
```yaml
---
id: "post-55"
slug: "demystifying-data-engineering-competency-map-modern-data-stack-roadmap"
title: "Toàn cảnh Nghề Data Engineer: Bản đồ Năng lực, Vòng đời Dữ liệu & Kiến trúc Modern Data Stack"
summary: "Hướng dẫn toàn diện về nghề Kỹ sư Dữ liệu (Data Engineer)..."
category: "tech-radar-career-insights"
publishedAt: "18/09/2026"
date: "2026-09-18"
readTime: "12 phút đọc"
tags:
  - "Data Engineering"
  - "Big Data"
  - "Data Pipeline"
  - "Modern Data Stack"
---
```
*(Ghi chú: Trường `author` đã được loại bỏ hoàn toàn khỏi Frontmatter).*

---

## 3. Technical Optimizations

1. **Zero-Dependency Markdown Parser:** Xây dựng `markdownParser.ts` thuần túy với TypeScript/RegExp, không phụ thuộc vào các thư viện nặng nề bên ngoài, giảm tải bundle size tối đa cho client.
2. **Mermaid Code Block Preservation:** Bảo toàn cấu trúc sơ đồ ```` ```mermaid ```` sang `<pre class="mermaid"><code>` chuẩn để kết hợp hoàn hảo với engine Mermaid động và cơ chế Pan/Zoom 60 FPS hiện có.
3. **Tự động hóa Kiểm thử Tính Toàn vẹn & Thống kê (Automated Verification & Exact Statistics):**
   - Viết script `scripts/verify-markdown-articles.mjs` kiểm tra 100% các file Markdown về Frontmatter, đủ 5 mục tiêu chuẩn (headings), không trùng ID/Slug và độ dài nội dung hợp lệ.
   - Thống kê chính xác số lượng bài viết theo từng Chuyên đề (5 categories) và Thẻ / Từ khoá (135 unique tags), loại bỏ giới hạn làm tròn `20+` trước đây để hiển thị số lượng bài viết thực tế (39 bài viết cho mỗi ngôn ngữ).
4. **Trải nghiệm Phát triển (DX):** Viết bài trực tiếp bằng Markdown tự nhiên, dễ đọc, không cần escape chuỗi JSON, hỗ trợ Git diff rõ ràng theo từng bài viết.

---

## 4. Impacted Files

| File | Trạng thái | Vai trò & Trách nhiệm |
| :--- | :--- | :--- |
| `src/utils/markdownParser.ts` | **NEW** | Module bóc tách Frontmatter và biên dịch Markdown body sang HTML chuẩn. |
| `scripts/migrate-json-to-md.mjs` | **NEW** | Script tự động chuyển đổi toàn bộ 78 bài viết từ JSON sang Markdown. |
| `scripts/verify-markdown-articles.mjs` | **NEW** | Script kiểm tra tính toàn vẹn 100% và xuất bảng thống kê chi tiết cho bài viết. |
| `src/data/blog/vi/*.md` (39 files) | **NEW** | Toàn bộ 39 bài viết tiếng Việt định dạng `YYYY-MM-DD-<slug>.md`. |
| `src/data/blog/en/*.md` (39 files) | **NEW** | Toàn bộ 39 bài viết tiếng Anh định dạng `YYYY-MM-DD-<slug>.md`. |
| `src/services/blogService.ts` | **MODIFIED** | Nạp và phân tích dữ liệu trực tiếp từ các file `.md` qua Vite eager glob. |
| `src/components/composite/BlogTopic.tsx` | **MODIFIED** | Hiển thị chính xác số lượng bài viết cho từng chuyên đề, bỏ giới hạn `20+`. |
| `src/components/composite/BlogTagsKeyword.tsx` | **MODIFIED** | Hiển thị chính xác số lượng bài viết theo từng thẻ/từ khoá và tổng số bài viết. |
| `src/pages/Blog.tsx` | **MODIFIED** | Tính toán thống kê chuyên mục, thẻ bài viết và cập nhật badge bộ lọc di động. |
| `tests/unit/data/blog-post-structure.test.ts` | **MODIFIED** | Cập nhật kiểm thử cấu trúc, schema và thống kê bài viết từ nguồn Markdown. |
| `tests/unit/data/mermaid-syntax.test.ts` | **MODIFIED** | Cập nhật kiểm thử cú pháp Mermaid diagrams từ nguồn Markdown. |
| `src/data/blog/vi/2026/09.json` | **DELETED** | Loại bỏ file JSON cũ sau khi đã di trú toàn bộ dữ liệu an toàn. |
| `src/data/blog/en/2026/09.json` | **DELETED** | Loại bỏ file JSON cũ sau khi đã di trú toàn bộ dữ liệu an toàn. |
| `docs/features/markdown-blog-storage.md` | **NEW** | Tài liệu kỹ thuật chi tiết theo quy chuẩn dự án. |
