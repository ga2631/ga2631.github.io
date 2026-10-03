# Feature: Supabase CMS Admin & Multi-View Architecture

## 1. End-to-End System Flow

The application architecture transitions to **Next.js 16 (App Router)** with a unified multi-language routing system, serving 3 distinct views with 3 dedicated layouts:

```
+---------------------------------------------------------------------------------------------------+
|                                      NEXT.JS 16 APP ROUTER                                        |
+---------------------------------------------------------------------------------------------------+
|  Root Layout (`src/app/layout.tsx`): ThemeProvider, LanguageProvider, Google Analytics 4 & GTM    |
+---------------------------------------------------------------------------------------------------+
                                                  │
                         ┌────────────────────────┼────────────────────────┐
                         ▼                        ▼                        ▼
                [View 1: Home / CV]       [View 2: Tech Blog]      [View 3: CMS Admin]
                 `/[lang]` & `/`           `/[lang]/blog`           `/[lang]/admin`
                         │                        │                        │
                         ▼                        ▼                        ▼
                ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
                │    CvLayout     │      │   BlogLayout    │      │    CmsLayout    │
                └─────────────────┘      └─────────────────┘      └─────────────────┘
                         │                        │                        │
                         ▼                        ▼                        ▼
                ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
                │    HomeView     │      │    BlogView     │      │     CmsView     │
                │  (ATS Resume &  │      │  (Listing &     │      │ (Posts, Cats,   │
                │  Case Studies)  │      │  Post Detail)   │      │ Tags, CV Editor)│
                └─────────────────┘      └─────────────────┘      └─────────────────┘
                         │                        │                        │
                         └────────────────────────┼────────────────────────┘
                                                  │
                                                  ▼
                                 ┌─────────────────────────────────┐
                                 │   Service & Telemetry Layer     │
                                 │   - cvService                   │
                                 │   - blogService                 │
                                 │   - blogAdminService            │
                                 │   - languageService             │
                                 │   - requestClient (auto-retry)  │
                                 │   - analytics (GA4 & GTM)       │
                                 └─────────────────────────────────┘
                                                  │
                                                  ▼
                                 ┌─────────────────────────────────┐
                                 │    Supabase Cloud PostgreSQL    │
                                 │    - languages                  │
                                 │    - cv_documents               │
                                 │    - categories & trans         │
                                 │    - tags & trans               │
                                 │    - posts, post_tags & trans   │
                                 └─────────────────────────────────┘
```

1. **Routing & Locale Layer (`src/app/[lang]`):**
   - Dynamic locale parameter `[lang]` supports active languages fetched from Supabase (defaults: `vi` and `en`).
   - `generateStaticParams` pre-renders static routes for zero latency and CDN caching (`output: 'export'`).
   - URL synchronization seamlessly updates the locale across all sub-paths (`/vi/blog` $\leftrightarrow$ `/en/blog`).

2. **3 Dedicated View Layouts:**
   - **`CvLayout`**: Glassmorphism navigation with profile identity, smooth section anchors (`#about`, `#experience`, `#projects`, `#skills`, `#contact`), PDF export action, theme switch, and links to Blog and CMS.
   - **`BlogLayout`**: Focus on technical writing with category filter pills, instant keyword search, tag filtering, sticky Table of Contents, and reading time estimation.
   - **`CmsLayout`**: Admin workspace with a collapsible sidebar, tabbed navigation (Dashboard, Posts, Categories, Tags, CV Editor, Settings), auth sign-in state, Supabase health checks, and live site preview.

3. **Multi-Language Engine (`src/i18n`):**
   - Type-safe dictionaries (`vi.ts`, `en.ts`) providing UI labels for all three views.
   - `LanguageContext` coordinates active language, in-memory caching, dynamic languages table resolution from Supabase, and telemetry tracking via `trackLanguageChange`.

---

## 2. Database & Schema Changes

The architecture leverages the Supabase database schema designed for multi-language relational entities:
- **`languages`**: Stores active languages (`code`, `name`, `is_active`).
- **`cv_documents`**: Stores JSONB CV structure per language (`lang_code`, `personal_info`, `principles`, `experiences`, `projects`, `skill_categories`, `educations`, `certifications`).
- **`categories` & `category_translations`**: Chained relations for blog topics with weekly publishing schedule metadata (`post_schedule`: 1–5).
- **`tags` & `tag_translations`**: Multi-language technical tag metadata.
- **`posts`, `post_tags`, `post_translations`**: Blog articles with Markdown content (`content_md`), generated HTML (`content_html`), read time, and publish dates.

---

## 3. Technical Optimizations

- **Static Generation with Next.js 16:** Every route exports static parameters with `generateStaticParams` allowing ultra-fast static HTML generation with dynamic client hydration.
- **Robust Auto-Retry Policy (`requestClient`):** Implements exponential backoff retry (3 retries for GET queries, 1 retry for mutation operations) to handle transient network blips gracefully.
- **Dual Telemetry Dispatch (`analytics.ts`):** Dispatches user events and language switches to both `window.dataLayer` (GTM) and `gtag` (GA4) with strict TypeScript typing.
- **Zero-Dependency Safe Markdown Parser (`markdownParser.ts`):** Custom parser generating automated slug IDs for headings, code syntax blocks, and fast in-memory HTML conversion.
- **Full-Height Adaptive Blog Sidebar Layout (`BlogView` & `globals.css`):** Zero-drift sticky layout with scheduled Categories locked (`shrink-0`), while Tags & Keywords dynamically flexes (`lg:flex-1 min-h-0`) with a custom slim scrollbar (`.custom-scrollbar`).
- **Symmetric Viewbox, Viewport Lock & Isolated Article Scroll (`BlogLayout` & `BlogView`):** Entire window/page scrolling is locked on desktop (`lg:h-screen lg:overflow-hidden`), ensuring Header, Search, Sidebar, and Pagination remain 100% fixed with ZERO drift. Only the article card grid (`flex-1 min-h-0 overflow-y-auto custom-scrollbar`) scrolls independently, configured with a 20-post per page limit (`POSTS_PER_PAGE = 20`) and smart page navigation.

---

## 4. Impacted Files

| File Path | Description / Responsibility |
|---|---|
| [`src/app/layout.tsx`](file:///Users/tanhn/Projects/ga2631.github.io/src/app/layout.tsx) | Root application layout with LanguageProvider, Google Analytics/GTM, Roboto font, and Flowbite CSS |
| [`src/app/page.tsx`](file:///Users/tanhn/Projects/ga2631.github.io/src/app/page.tsx) | Root page loading default language (`vi`) with zero redirection latency |
| [`src/app/[lang]/layout.tsx`](file:///Users/tanhn/Projects/ga2631.github.io/src/app/[lang]/layout.tsx) | Locale wrapper layout with `generateStaticParams` |
| [`src/app/[lang]/page.tsx`](file:///Users/tanhn/Projects/ga2631.github.io/src/app/[lang]/page.tsx) | Home / CV View route with dynamic SEO metadata |
| [`src/app/[lang]/blog/page.tsx`](file:///Users/tanhn/Projects/ga2631.github.io/src/app/[lang]/blog/page.tsx) | Tech Blog listing route with BlogLayout |
| [`src/app/[lang]/blog/[slug]/page.tsx`](file:///Users/tanhn/Projects/ga2631.github.io/src/app/[lang]/blog/[slug]/page.tsx) | Tech Blog detail reader route with Table of Contents |
| [`src/app/[lang]/admin/page.tsx`](file:///Users/tanhn/Projects/ga2631.github.io/src/app/[lang]/admin/page.tsx) | CMS Admin Studio route with CmsLayout |
| [`src/components/layouts/CvLayout.tsx`](file:///Users/tanhn/Projects/ga2631.github.io/src/components/layouts/CvLayout.tsx) | Dedicated layout for Portfolio / CV |
| [`src/components/layouts/BlogLayout.tsx`](file:///Users/tanhn/Projects/ga2631.github.io/src/components/layouts/BlogLayout.tsx) | Dedicated layout for Tech Blog |
| [`src/components/layouts/CmsLayout.tsx`](file:///Users/tanhn/Projects/ga2631.github.io/src/components/layouts/CmsLayout.tsx) | Dedicated layout with collapsible sidebar for CMS Studio |
| [`src/views/Home/index.tsx`](file:///Users/tanhn/Projects/ga2631.github.io/src/views/Home/index.tsx) | Main Home / CV View assembling modular section components |
| [`src/views/Home/components/HeroSection.tsx`](file:///Users/tanhn/Projects/ga2631.github.io/src/views/Home/components/HeroSection.tsx) | Profile Card with spinning conic-gradient, Avatar, Bio, and 4 Key Metric cards |
| [`src/views/Home/components/PrinciplesSection.tsx`](file:///Users/tanhn/Projects/ga2631.github.io/src/views/Home/components/PrinciplesSection.tsx) | Engineering Excellence section with 4 color-themed architecture pillars |
| [`src/views/Home/components/ExperienceSection.tsx`](file:///Users/tanhn/Projects/ga2631.github.io/src/views/Home/components/ExperienceSection.tsx) | Professional Experience timeline with colored tech badges |
| [`src/views/Home/components/ProjectsSection.tsx`](file:///Users/tanhn/Projects/ga2631.github.io/src/views/Home/components/ProjectsSection.tsx) | Featured Projects cards with Public/Enterprise badges and NDA case study modal |
| [`src/views/Home/components/SkillsSection.tsx`](file:///Users/tanhn/Projects/ga2631.github.io/src/views/Home/components/SkillsSection.tsx) | Tech Stack & Tools Matrix with Proficiency scale legend and categorized badges |
| [`src/views/Home/components/EducationSection.tsx`](file:///Users/tanhn/Projects/ga2631.github.io/src/views/Home/components/EducationSection.tsx) | Education details & Certifications verification card |
| [`src/views/Home/components/ContactSection.tsx`](file:///Users/tanhn/Projects/ga2631.github.io/src/views/Home/components/ContactSection.tsx) | Let's Connect grid (Email, Phone/Zalo, Location, LinkedIn) |
| [`src/views/Home/components/FloatDownloadButton.tsx`](file:///Users/tanhn/Projects/ga2631.github.io/src/views/Home/components/FloatDownloadButton.tsx) | Floating Save / Download CV action button |
| [`src/views/Blog/index.tsx`](file:///Users/tanhn/Projects/ga2631.github.io/src/views/Blog/index.tsx) | Blog listing component with live search and category/tag filtering |
| [`src/views/Blog/BlogPostDetail.tsx`](file:///Users/tanhn/Projects/ga2631.github.io/src/views/Blog/BlogPostDetail.tsx) | Single article reader with markdown rendering and auto-TOC |
| [`src/views/Cms/index.tsx`](file:///Users/tanhn/Projects/ga2631.github.io/src/views/Cms/index.tsx) | CMS Admin panel with CRUD for Posts, Categories, Tags, and CV JSON editor |
| [`src/i18n/config.ts`](file:///Users/tanhn/Projects/ga2631.github.io/src/i18n/config.ts) | Supported locales configuration and metadata |
| [`src/i18n/dictionaries/vi.ts`](file:///Users/tanhn/Projects/ga2631.github.io/src/i18n/dictionaries/vi.ts) | Vietnamese translation dictionary |
| [`src/i18n/dictionaries/en.ts`](file:///Users/tanhn/Projects/ga2631.github.io/src/i18n/dictionaries/en.ts) | English translation dictionary |
| [`src/i18n/LanguageContext.tsx`](file:///Users/tanhn/Projects/ga2631.github.io/src/i18n/LanguageContext.tsx) | Multi-language React Provider integrated with Supabase languages table |
| [`src/utils/markdownParser.ts`](file:///Users/tanhn/Projects/ga2631.github.io/src/utils/markdownParser.ts) | Lightweight Markdown parser with slug heading anchor generation |
| [`src/styles/globals.css`](file:///Users/tanhn/Projects/ga2631.github.io/src/styles/globals.css) | Global design system, glassmorphism utilities, and typography styles |
