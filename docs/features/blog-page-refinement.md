# Blog Page Refinement & Sticky Filter Controls

## Overview
This document summarizes the architectural and visual refinements applied to the Blog Page (`src/pages/BlogPage.tsx` and `src/styles/pages/_blog.scss`) in branch `refactor/blog-page-refinement`.

## Key Changes & Behaviors

### 1. Sticky Filter Panel with Dynamic Elevated Shadow
- **Resting State (Unscrolled):** The filter search panel (`.blog-controls-panel`) stays flush with a neutral appearance (`box-shadow: none;` and border `var(--border-color)`), maintaining harmony with the rest of the flat UI panels.
- **Scrolled / Stuck State (`.is-stuck`):** When the user scrolls past the hero header (`scrollTop > 40px`), the panel anchors at `top: 16px` and dynamically transitions to an elevated glassmorphic floating shadow:
  - **Dark Mode:** `box-shadow: 0 14px 36px rgba(0, 0, 0, 0.45); background: rgba(17, 24, 39, 0.92); backdrop-filter: blur(24px); border-color: var(--border-color);`
  - **Light Mode:** `box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08); background: rgba(255, 255, 255, 0.95); border-color: var(--border-color);`
  - **Border Preservation:** Border color remains consistently `var(--border-color)` across both resting and stuck states.

### 2. Full-Height Split Viewport Layout
- **Left Sidebar:** Pinned at 280px with independent scrolling for the tag cloud. Categories and header remain fixed at the top. Removed unnecessary "Xoá bộ lọc" button.
- **Right Scroll Container:** Handles the scroll events for articles independently without causing full-page or horizontal layout shifts.

### 3. Category & Card Aesthetics
- Clean card design with animated corner border tracing in category-themed accent colors.
- Removed explicit "Đọc bài viết" button; clicking anywhere on the card opens the article modal.
- Simplified badge titles by showing only the category name.

## Verification
- Unit and integration test suite passing (10 tests in `tests/integration/blog-reader.test.tsx`, 49 total).
- Clean TypeScript and Sass build with Vite.
