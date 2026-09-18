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

### 4. Standardized 5-Section Structure per Category
Each article in `src/data/locales/vi/blog.json` and `src/data/locales/en/blog.json` organizes content as a structured dictionary of key-value pairs:
```json
"sections": {
  "business-data-requirements": "<p>...</p>",
  "data-modeling": "<p>...</p>",
  "pipeline-construction": "<p>...</p>",
  "testing-optimization": "<p>...</p>",
  "summary-recommendations": "<p>...</p>"
}
```

The 5 standard section keys per category:
1. **System Design & Architecture (`architecture-system-design`):**
   - `context-problem`: Bối cảnh & Vấn đề (Context & Problem Statement)
   - `system-requirements`: Yêu cầu hệ thống (System Requirements)
   - `architecture-design`: Thiết kế kiến trúc (Architecture Design)
   - `trade-offs-analysis`: Phân tích đánh đổi (Trade-offs Analysis)
   - `lessons-best-practices`: Bài học thực tế & Best Practices (Real-World Lessons & Best Practices)
2. **Data Engineering & Analytics (`data-engineering-analytics`):**
   - `business-data-requirements`: Đề bài kinh doanh / Yêu cầu dữ liệu (Business Context & Data Requirements)
   - `data-modeling`: Mô hình hóa dữ liệu (Data Modeling & Schema Design)
   - `pipeline-construction`: Xây dựng Pipeline / Script xử lý (Pipeline Construction & Processing Logic)
   - `testing-optimization`: Kiểm thử dữ liệu & Tối ưu hiệu năng (Data Validation & Performance Tuning)
   - `summary-recommendations`: Tổng kết & Khuyến nghị (Summary & Recommendations)
3. **DevOps, Infra & Tooling (`devops-cloud-tooling`):**
   - `article-objectives`: Mục tiêu bài viết (Article Objectives & Motivation)
   - `architecture-principles`: Kiến trúc / Nguyên lý hoạt động (Architecture & Core Principles)
   - `step-by-step-setup`: Từng bước thiết lập (Step-by-Step Setup & Implementation)
   - `troubleshooting-pitfalls`: Troubleshooting & Common Pitfalls (Troubleshooting & Common Pitfalls)
   - `evaluation-scaling`: Đánh giá & Mở rộng (Evaluation & Future Scaling)
4. **Algorithms & Data Structures (`code-craftsmanship-languages`):**
   - `problem-statement`: Mô tả bài toán (Problem Statement & Objectives)
   - `initial-approach`: Ý tưởng tiếp cận ban đầu (Initial Naive Approach)
   - `optimization-thinking`: Tư duy tối ưu hóa (Optimization Thinking)
   - `code-implementation`: Triển khai Code (Code Implementation)
   - `complexity-applications`: Phân tích độ phức tạp & Ứng dụng (Complexity Analysis & Real-World Applications)
5. **Languages, Tech Radar & Career (`tech-radar-career-insights`):**
   - `introduction`: Mở đầu (Introduction & Perspective)
   - `multi-dimensional-evaluation`: So sánh / Đánh giá đa chiều (Multi-Dimensional Evaluation & Comparison)
   - `case-study-experience`: Case Study / Trải nghiệm thực tế (Case Study & Practical Lessons)
   - `actionable-recommendations`: Gợi ý hành động (Actionable Recommendations)
   - `open-questions-discussion`: Câu hỏi mở, thảo luận (Open Questions & Discussion)

## Verification
- Unit and integration test suite passing (55 tests across 9 test files):
  - `tests/unit/blog-post-structure.test.ts` (6 tests)
  - `tests/unit/data-integrity.test.ts` (7 tests)
  - `tests/integration/blog-reader.test.tsx` (10 tests)
- Clean TypeScript and Sass build with Vite.
