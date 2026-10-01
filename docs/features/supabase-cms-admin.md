# Supabase CMS Admin Portal Architecture & Implementation

## 1. Overview

The Admin Portal (`/admin`) provides a secure, reactive content management interface for managing both the **CV Profile** and **Blog System** (Articles, Categories, and Tags). It integrates directly with **Supabase Authentication** and the underlying Supabase PostgreSQL database tables.

---

## 2. Authentication Flow

- **Provider**: Supabase Auth Direct GitHub OAuth (`signInWithOAuth` via `provider: 'github'`).
- **Session Handling**: Real-time auth listener in [`src/services/authService.ts`](file:///Users/tanhn/Projects/ga2631.github.io/src/services/authService.ts) with automatic OAuth token exchange and session persistence.
- **Access Guard**: [`src/views/admin/AdminDashboard.tsx`](file:///Users/tanhn/Projects/ga2631.github.io/src/views/admin/AdminDashboard.tsx) automatically renders [`AdminLogin`](file:///Users/tanhn/Projects/ga2631.github.io/src/views/admin/AdminLogin.tsx) when no active Supabase session is detected, and transitions to the admin workspace once authenticated.

---

## 3. Navigation Modules

### 3.1. CV Management (`/admin` -> Nav: `CV`)

Located at [`src/views/admin/AdminCvEditor.tsx`](file:///Users/tanhn/Projects/ga2631.github.io/src/views/admin/AdminCvEditor.tsx):

- **Multi-Language Support**: Switch seamlessly between supported languages (`vi`, `en`, etc.) loaded dynamically from Supabase `languages` table.
- **Section Controls**:
  - **Personal Info**: Full name, job title, tagline, bio, contact links, stats counter.
  - **Engineering Principles**: Reorder, add, edit, or delete core engineering tenets.
  - **Career Experience**: Company, role, period, location, responsibilities, and achievements.
  - **Enterprise Projects**: Project titles, roles, team sizes, descriptions, technical stack, metrics, live/repo links.
  - **Technical Skills Matrix**: Categorized skill groups with skill items.
  - **Education & Certifications**: Degrees, universities, issue dates, and credentials.
- **Dual Edit Mode**:
  - **Visual Form Mode**: User-friendly form inputs with real-time state updates.
  - **Raw JSON Editor Mode**: Direct JSON structure editing with syntax parsing and validation.
- **Persistence & Cache Invalidation**: Persists to `cv_documents` table via `upsert` and clears memory caches in [`src/services/requestClient.ts`](file:///Users/tanhn/Projects/ga2631.github.io/src/services/requestClient.ts).

### 3.2. Blog CMS (`/admin` -> Nav: `Blog`)

Located at [`src/views/admin/AdminBlogManager.tsx`](file:///Users/tanhn/Projects/ga2631.github.io/src/views/admin/AdminBlogManager.tsx):

- **Articles / Posts Management**:
  - Search by title or slug; filter by category.
  - Create, edit, and delete posts.
  - Metadata controls: Slug, Category assignment, Multiple Tag assignments, Read time, Publication date/status.
  - **Split-Screen Markdown Editor**: Side-by-side editing with live HTML rendering via [`src/utils/markdownParser.ts`](file:///Users/tanhn/Projects/ga2631.github.io/src/utils/markdownParser.ts).
  - Multi-language tabs (`Tiếng Việt` vs `English`) for post title, summary, and markdown content.
- **Categories Management**:
  - Add, edit, delete categories.
  - Schedule Day (e.g. 1 = Monday, 2 = Tuesday, etc.).
  - Icon selection & accent color picker.
  - Multi-language name & description translations.
- **Tags Management**:
  - Add, edit, delete tags with multi-language name translations.

---

## 4. Key Files

- Route Entry: [`src/app/admin/page.tsx`](file:///Users/tanhn/Projects/ga2631.github.io/src/app/admin/page.tsx) & [`src/app/admin/layout.tsx`](file:///Users/tanhn/Projects/ga2631.github.io/src/app/admin/layout.tsx)
- Auth Service: [`src/services/authService.ts`](file:///Users/tanhn/Projects/ga2631.github.io/src/services/authService.ts)
- Blog Admin Service: [`src/services/blogAdminService.ts`](file:///Users/tanhn/Projects/ga2631.github.io/src/services/blogAdminService.ts)
- CV Service: [`src/services/cvService.ts`](file:///Users/tanhn/Projects/ga2631.github.io/src/services/cvService.ts)
- Admin Views: [`src/views/admin/`](file:///Users/tanhn/Projects/ga2631.github.io/src/views/admin/)
- Stylesheet: [`src/styles/pages/_admin.scss`](file:///Users/tanhn/Projects/ga2631.github.io/src/styles/pages/_admin.scss)
