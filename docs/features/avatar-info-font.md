# Feature: avatar-info-font

## 1. End-to-End System Flow
- **Client / DOM Layer:**
  - `index.html` loads Google Fonts with the Latin & Vietnamese subset including `Source Code Pro` (`weights: 400, 500, 600, 700`), `Fira Code`, `Inter`, and `Outfit`.
  - In `Hero.tsx`, the `.avatar-info-box` terminal-styled widget renders status information such as `$ git status`, `t.workingTreeClean` ("Thư mục làm việc sạch sẽ"), and `t.focusPrompt` ("Tập trung vào giải pháp kiến trúc & hiệu năng").
  - `src/styles/components/_hero.scss` applies `font-family: 'Source Code Pro', var(--font-mono);` directly to `.avatar-info-box`, guaranteeing that all Vietnamese unicode glyphs and diacritics (dấu thanh, dấu mũ, ơ, ư, ă, ê, ô) are rendered uniformly without falling back to mixed system fonts.
  - `src/styles/abstracts/_variables.scss` updates `--font-mono` to prioritize `'Source Code Pro'`, ensuring consistent monospace typography across code blocks, terminal prompts, and technical metadata.
- **API & Data Layer:** N/A (Static SPA Client rendering).

## 2. Database & Schema Changes
- N/A (Client-side typography and styling enhancement).

## 3. Technical Optimizations
- **Vietnamese Typography Diacritics Parity:** `Source Code Pro` possesses full native OpenType glyph coverage for Vietnamese diacritics, eliminating visual baseline shifts (glyph replacement jitter) between Latin characters and accented Vietnamese characters.
- **Font Display Optimization:** Configured `display=swap` in the Google Fonts API query to ensure text is rendered immediately using fallback fonts and upgraded seamlessly when Google Font assets finish loading (preventing FOIT - Flash of Invisible Text).
- **CSS Variable Cascading:** Inherits through `--font-mono` with graceful fallbacks: `'Source Code Pro', 'Fira Code', 'JetBrains Mono', monospace`.

## 4. Impacted Files
- `index.html`: Added Google Fonts stylesheet link parameter for `Source+Code+Pro:wght@400;500;600;700`.
- `src/styles/abstracts/_variables.scss`: Updated `--font-mono` token definition to prioritize `'Source Code Pro'`.
- `src/styles/components/_hero.scss`: Explicitly styled `.avatar-info-box` with `font-family: 'Source Code Pro', var(--font-mono)`.
- `docs/features/avatar-info-font.md`: Technical documentation for this enhancement.
