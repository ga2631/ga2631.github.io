# Feature: architecture-system-design

## 1. End-to-End System Flow
- **Markdown Data Source:** Articles are authored as Markdown files under `src/data/blog/vi/*.md` and `src/data/blog/en/*.md` with YAML frontmatter specifying `date` (ISO `YYYY-MM-DD`) and/or `publishedAt` (`DD/MM/YYYY`).
- **Storage & Parsing Layer (`blogService.ts`):** 
  - Raw markdown files are gathered via Vite eager glob loaders (`import.meta.glob`).
  - `parseMarkdownToBlogPost` extracts frontmatter and generates HTML content.
  - `isPostPublished` evaluates the post's date against the current local date / timestamp (`referenceDate`, defaulting to `new Date()`).
  - Articles scheduled for future dates (`date > today`) are automatically excluded from the eager collection (`getEagerPosts`), archive index (`getAvailableMonthArchives`), initial batch loader (`loadInitialBlogPosts`), and search index (`loadAllArchivePosts`).
  - `getBlogStatistics` aggregates exact global counts for "All Topics", each specific category, and all individual tags across the entire published library.
  - `loadInitialBlogPosts` slices only the first batch (up to 20 articles) and calculates `hasMore = totalPublished > 20`.
  - `loadNextMonthBatch` steps through successive batches (offset + 20) on demand.
- **UI & State Layer (`Blog.tsx`, `App.tsx`):**
  - Maintains `fullCatalog` for global statistics (Sidebar category pills, tag cloud, total post count, and URL hash deep-linking).
  - Maintains `displayedPosts` to render ONLY the initial 20 articles in the HTML DOM during default browsing, completely avoiding hidden or superfluous DOM elements.
  - Shows the "Tải thêm bài viết" (Load More Articles) button when `hasMore` is true in the default view.
  - When the user searches or clicks a category/tag, queries `fullCatalog` to immediately display all matching articles without missing unpaginated items.
  - Renders unique list items keyed by `post.slug || post.id`.

## 2. Database & Schema Changes
- N/A (Static Markdown storage with Frontmatter schema: `date` / `publishedAt` ISO format comparison).

## 3. Technical Optimizations
- **Global Catalog vs DOM Slice Decoupling:** Global statistics (categories, tags, total counts) are computed across the full in-memory collection (`fullCatalog`), while DOM rendering is restricted strictly to the current paginated slice (`displayedPosts` = 20 items initially). This provides complete, accurate metrics without bloating the DOM tree with extra HTML nodes.
- **Initial Batch Slicing & DOM Performance:** Limits initial DOM node count to 20 articles instead of injecting all 40+ posts at once, significantly improving initial paint times and memory footprint.
- **Dynamic Incremental Batching:** Incremental loading (`loadNextMonthBatch`) fetches 20 articles per step, updating `hasMore` dynamically until the collection is fully exhausted.
- **Timezone-Resilient Calendar Comparison:** `getLocalDateString` formats the reference date into `YYYY-MM-DD` in the user's local timezone, ensuring scheduled posts become accessible from 00:00 on their designated publish day.
- **Dependency Injection for Testability:** All loader and statistical functions accept an optional `referenceDate?: Date` parameter, enabling deterministic test verification without mutating global timers.
- **Zero-Ghost Archive Overhead:** `getAvailableMonthArchives` only indexes months that have at least one active, published post, eliminating empty tabs in the archive navigator.
- **React Key Reconciliation:** Replaced non-unique ID keys with `post.slug || post.id` to prevent unnecessary DOM recreation and key collisions.

## 4. Impacted Files
- [src/services/blogService.ts](file:///Users/tanhn/Projects/ga2631.github.io/src/services/blogService.ts): Added `getBlogStatistics`, `isPostPublished`, `getLocalDateString`, and batch pagination functions.
- [src/pages/Blog.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/pages/Blog.tsx): Decoupled `fullCatalog` (for global stats) from `displayedPosts` (for DOM rendering), updated `handleLoadMore` and Load More button condition.
- [src/data/blogData.ts](file:///Users/tanhn/Projects/ga2631.github.io/src/data/blogData.ts): Exported `getBlogStatistics` and date helpers.
- [tests/unit/services/blog-service.test.ts](file:///Users/tanhn/Projects/ga2631.github.io/tests/unit/services/blog-service.test.ts): Added unit tests for `getBlogStatistics`, 20-post batch slicing, and pagination stepping.
- [tests/integration/blog-reader.test.tsx](file:///Users/tanhn/Projects/ga2631.github.io/tests/integration/blog-reader.test.tsx): Added integration tests verifying exact 20-card DOM rendering, 41-article total sidebar badge, and load more interaction.
- [docs/features/architecture-system-design.md](file:///Users/tanhn/Projects/ga2631.github.io/docs/features/architecture-system-design.md): Technical documentation for the feature.
