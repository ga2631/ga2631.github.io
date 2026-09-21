# Feature: architecture-system-design

## 1. End-to-End System Flow
- **Markdown Data Source:** Articles are authored as Markdown files under `src/data/blog/vi/*.md` and `src/data/blog/en/*.md` with YAML frontmatter specifying `date` (ISO `YYYY-MM-DD`) and/or `publishedAt` (`DD/MM/YYYY`).
- **Storage & Parsing Layer (`blogService.ts`):** 
  - Raw markdown files are gathered via Vite eager glob loaders (`import.meta.glob`).
  - `parseMarkdownToBlogPost` extracts frontmatter and generates HTML content.
  - `isPostPublished` evaluates the post's date against the current local date / timestamp (`referenceDate`, defaulting to `new Date()`).
  - Articles scheduled for future dates (`date > today`) are automatically excluded from the eager collection (`getEagerPosts`), archive index (`getAvailableMonthArchives`), initial batch loader (`loadInitialBlogPosts`), and search index (`loadAllArchivePosts`).
  - `loadInitialBlogPosts` slices only the first batch (up to 20 articles) and calculates `hasMore = totalPublished > 20`.
  - `loadNextMonthBatch` steps through successive batches (offset + 20) on demand.
- **UI & State Layer (`Blog.tsx`, `App.tsx`):**
  - Renders initially only the top 20 recent articles to maximize DOM performance and initial render speed.
  - Shows a "Tải thêm bài viết" (Load More Articles) button when `hasMore` is true.
  - Clicking "Tải thêm bài viết" fetches and appends the next batch without full-page reloads.
  - Automatically loads full archives when a user engages active search keywords or category filters.
  - Renders unique list items keyed by `post.slug || post.id`.

## 2. Database & Schema Changes
- N/A (Static Markdown storage with Frontmatter schema: `date` / `publishedAt` ISO format comparison).

## 3. Technical Optimizations
- **Initial Batch Slicing & DOM Optimization:** Limits initial DOM node count to 20 articles instead of injecting all 40+ posts at once, significantly reducing initial layout and rendering overhead.
- **Dynamic Incremental Batching:** Incremental loading (`loadNextMonthBatch`) fetches 20 articles per step, updating `hasMore` dynamically until the collection is fully exhausted.
- **Timezone-Resilient Calendar Comparison:** `getLocalDateString` formats the reference date into `YYYY-MM-DD` in the user's local timezone, ensuring scheduled posts become accessible from 00:00 on their designated publish day.
- **Dependency Injection for Testability:** All loader functions (`getEagerPosts`, `loadInitialBlogPosts`, `getAvailableMonthArchives`, etc.) accept an optional `referenceDate?: Date` parameter, enabling deterministic test verification without mutating global timers.
- **Zero-Ghost Archive Overhead:** `getAvailableMonthArchives` only indexes months that have at least one active, published post, eliminating empty tabs in the archive navigator.
- **React Key Reconciliation:** Replaced non-unique ID keys with `post.slug || post.id` to prevent unnecessary DOM recreation and key collisions.

## 4. Impacted Files
- [src/services/blogService.ts](file:///Users/tanhn/Projects/ga2631.github.io/src/services/blogService.ts): Implemented initial 20-post batch slicing, incremental batch loading, `isPostPublished`, and future post filtering.
- [src/pages/Blog.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/pages/Blog.tsx): Initialized state to 20 articles, updated `handleLoadMore` with incremental pagination, and set unique `key={post.slug || post.id}`.
- [src/data/blogData.ts](file:///Users/tanhn/Projects/ga2631.github.io/src/data/blogData.ts): Exported helper functions for date checking.
- [tests/unit/services/blog-service.test.ts](file:///Users/tanhn/Projects/ga2631.github.io/tests/unit/services/blog-service.test.ts): Added unit tests for 20-post batch slicing and pagination stepping.
- [tests/integration/blog-reader.test.tsx](file:///Users/tanhn/Projects/ga2631.github.io/tests/integration/blog-reader.test.tsx): Added integration test for the Load More button rendering and interaction.
- [docs/features/architecture-system-design.md](file:///Users/tanhn/Projects/ga2631.github.io/docs/features/architecture-system-design.md): Technical documentation for the feature.
