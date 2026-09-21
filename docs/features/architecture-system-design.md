# Feature: architecture-system-design

## 1. End-to-End System Flow
- **Markdown Data Source:** Articles are authored as Markdown files under `src/data/blog/vi/*.md` and `src/data/blog/en/*.md` with YAML frontmatter specifying `date` (ISO `YYYY-MM-DD`) and/or `publishedAt` (`DD/MM/YYYY`).
- **Storage & Parsing Layer (`blogService.ts`):** 
  - Raw markdown files are gathered via Vite eager glob loaders (`import.meta.glob`).
  - `parseMarkdownToBlogPost` extracts frontmatter and generates HTML content.
  - `isPostPublished` evaluates the post's date against the current local date / timestamp (`referenceDate`, defaulting to `new Date()`).
  - Articles scheduled for future dates (`date > today`) are automatically excluded from the eager collection (`getEagerPosts`), archive index (`getAvailableMonthArchives`), initial batch loader (`loadInitialBlogPosts`), and search index (`loadAllArchivePosts`).
- **UI & State Layer (`Blog.tsx`, `App.tsx`):**
  - Consumes filtered, chronological `BlogPost[]` collections without encountering ghost future posts or empty month archives.
  - Renders unique list items keyed by `post.slug || post.id`.

## 2. Database & Schema Changes
- N/A (Static Markdown storage with Frontmatter schema: `date` / `publishedAt` ISO format comparison).

## 3. Technical Optimizations
- **Timezone-Resilient Calendar Comparison:** `getLocalDateString` formats the reference date into `YYYY-MM-DD` in the user's local timezone, ensuring scheduled posts become accessible from 00:00 on their designated publish day.
- **Dependency Injection for Testability:** All loader functions (`getEagerPosts`, `loadInitialBlogPosts`, `getAvailableMonthArchives`, etc.) accept an optional `referenceDate?: Date` parameter, enabling deterministic test verification without mutating global timers.
- **Zero-Ghost Archive Overhead:** `getAvailableMonthArchives` only indexes months that have at least one active, published post, eliminating empty tabs in the archive navigator.
- **React Key Reconciliation:** Replaced non-unique ID keys with `post.slug || post.id` to prevent unnecessary DOM recreation and key collisions.

## 4. Impacted Files
- [src/services/blogService.ts](file:///Users/tanhn/Projects/ga2631.github.io/src/services/blogService.ts): Added `isPostPublished`, `getLocalDateString`, and filtered future scheduled posts in all eager & archive retrieval functions.
- [src/data/blogData.ts](file:///Users/tanhn/Projects/ga2631.github.io/src/data/blogData.ts): Exported `isPostPublished` and `getLocalDateString` for cross-component and test consumption.
- [src/pages/Blog.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/pages/Blog.tsx): Updated `BlogItem` rendering key to `post.slug || post.id`.
- [tests/unit/services/blog-service.test.ts](file:///Users/tanhn/Projects/ga2631.github.io/tests/unit/services/blog-service.test.ts): Added unit tests for date filtering, future post exclusion, and publish date evaluation.
- [docs/features/architecture-system-design.md](file:///Users/tanhn/Projects/ga2631.github.io/docs/features/architecture-system-design.md): Technical documentation for the feature.
