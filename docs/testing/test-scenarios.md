# Master Test Plan & Testing Scenarios Matrix

**Project:** Executive Portfolio & ATS CV Application (`ga2631.github.io`)  
**Version:** 1.0.0  
**Target Environments:** Desktop Browsers, Mobile Emulation (iOS Safari, Android Chrome), Tablet Emulation (iPadOS Safari, Android Tablet Chrome), Docker Containers, CI/CD Pipeline  
**Standards:** WCAG 2.2 AA (Accessibility), Conventional Commits, Standard ATS 2-Page CV Architecture

---

## Table of Contents
1. [Device & Viewport Emulation Profiles](#1-device--viewport-emulation-profiles)
2. [Global Test Verification Checklist](#2-global-test-verification-checklist)
3. [Test Scenario Matrix by Module](#3-test-scenario-matrix-by-module)
   - [TS-01: Header & Navigation System](#ts-01-header--navigation-system)
   - [TS-02: Mobile & Tablet Drawer Menu](#ts-02-mobile--tablet-drawer-menu)
   - [TS-03: Multi-Language Localization Engine (VI / EN)](#ts-03-multi-language-localization-engine-vi--en)
   - [TS-04: Theme Switching System (Dark / Light Mode)](#ts-04-theme-switching-system-dark--light-mode)
   - [TS-05: Hero & Profile Highlights](#ts-05-hero--profile-highlights)
   - [TS-06: About & Engineering Principles](#ts-06-about--engineering-principles)
   - [TS-07: Professional Experience Timeline](#ts-07-professional-experience-timeline)
   - [TS-08: Engineering Architecture Case Studies (Projects)](#ts-08-engineering-architecture-case-studies-projects)
   - [TS-09: Core Technical Skills & Taxonomy Grid](#ts-09-core-technical-skills--taxonomy-grid)
   - [TS-10: Education & Professional Certifications](#ts-10-education--professional-certifications)
   - [TS-11: Contact Channels & Anti-Scraping Security Obfuscation](#ts-11-contact-channels--anti-scraping-security-obfuscation)
   - [TS-12: Technical Blog, Search & Article Reader with TOC](#ts-12-technical-blog-search--article-reader-with-toc)
   - [TS-13: Dedicated Print CV & PDF Export (Desktop & Mobile)](#ts-13-dedicated-print-cv--pdf-export-desktop--mobile)
   - [TS-14: Floating Action Buttons (FAB) & Micro-Interactions](#ts-14-floating-action-buttons-fab--micro-interactions)
   - [TS-15: Cross-Platform, Orientation & Touch Ergonomics](#ts-15-cross-platform-orientation--touch-ergonomics)
   - [TS-16: DevOps, Containerization & Build Verification](#ts-16-devops-containerization--build-verification)
4. [Test Execution & Bug Reporting Template](#4-test-execution--bug-reporting-template)

---

## 1. Device & Viewport Emulation Profiles

Use Chrome DevTools, Safari Web Inspector, or Playwright/Cypress device profiles to simulate the following test viewports:

| Profile Code | Device Profile | Resolution (CSS Px) | Pixel Ratio (DPR) | User Agent / Platform |
| :--- | :--- | :--- | :--- | :--- |
| **DEV-MOB-01** | Ultra-Compact Mobile (iPhone SE) | `375 x 667` | 2.0 | Mobile Safari / iOS |
| **DEV-MOB-02** | Compact Android (Galaxy S8 / Pixel 4a) | `360 x 740` | 3.0 | Chrome Mobile / Android |
| **DEV-MOB-03** | Standard Modern Mobile (iPhone 14/15/16) | `390 x 844` | 3.0 | Mobile Safari / iOS |
| **DEV-MOB-04** | Large Flagship Mobile (iPhone 15 Pro Max / Galaxy S24 Ultra) | `430 x 932` | 3.0 | Mobile Safari / iOS / Android |
| **DEV-TAB-01** | Compact Tablet Portrait (iPad Mini) | `768 x 1024` | 2.0 | iPadOS Safari / Touch |
| **DEV-TAB-02** | Standard Tablet Portrait (iPad 10th Gen / iPad Air) | `820 x 1180` | 2.0 | iPadOS Safari / Touch |
| **DEV-TAB-03** | Tablet Landscape / 2-in-1 (iPad Pro 11" Landscape) | `1194 x 834` | 2.0 | iPadOS Safari / Pointer |
| **DEV-DESK-01**| Standard Laptop Display | `1366 x 768` | 1.0 | Chrome / Firefox Desktop |
| **DEV-DESK-02**| Full HD Desktop Display | `1920 x 1080` | 1.0 | Chrome / Edge / Safari Desktop |
| **DEV-DESK-03**| Ultra-Wide / 4K Display | `2560 x 1440` / `3840 x 2160` | 1.0 - 2.0 | Chrome Desktop |

---

## 2. Global Test Verification Checklist

Every feature scenario must pass these universal criteria:
- [ ] **Zero Horizontal Overflow:** Page `document.documentElement.scrollWidth <= window.innerWidth` (no unintended x-axis scroll on mobile/tablet).
- [ ] **Touch Target Sizing:** Interactive targets (buttons, links, drawer items) measure $\ge 44 \times 44\text{px}$ (WCAG 2.2 AA).
- [ ] **Contrast Compliance:** All text elements have a minimum contrast ratio of `4.5:1` in both Dark and Light themes.
- [ ] **DOM Cleanup on Unmount:** Modals and drawers clean up event listeners (`keydown`, `click outside`) and reset `document.body.style.overflow = ''`.
- [ ] **Console Hygiene:** Zero unhandled JavaScript errors, React warning logs, or broken asset network 404s in DevTools Console.

---

## 3. Test Scenario Matrix by Module

### TS-01: Header & Navigation System

| Test ID | Target Profile | Preconditions | Action Steps | Expected Results | Verification Method |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TS-01-01** | `DEV-DESK-01`, `DEV-DESK-02` | User visits root URL `#/` | Observe desktop navigation bar | Header displays Logo, Navigation Links (About, Experience, Projects, Skills, Education, Contact, Blog), Theme Toggle, Language Switcher, and "Save CV" CTA button. | Visual Inspection |
| **TS-01-02** | `DEV-DESK-01`, `DEV-DESK-02` | Page loaded at top (`scrollY = 0`) | Scroll page down by `> 100px` | Header becomes sticky with subtle backdrop-blur effect and elevation border shadow. | Inspect `.header.scrolled` class |
| **TS-01-03** | `DEV-DESK-01`, `DEV-DESK-02` | User on home page | Click desktop nav item (e.g., `#projects`) | Page smoothly scrolls to `#projects` section; active link indicator updates; URL hash reflects section. | Check scroll position & active nav class |
| **TS-01-04** | `DEV-DESK-01`, `DEV-DESK-02` | User on home page | Click "Blog" nav item | Application route transitions to Blog Page (`#/blog`); main view swaps to Blog component; header remains sticky. | Check URL `window.location.hash === '#/blog'` |
| **TS-01-05** | `DEV-MOB-01` to `DEV-TAB-02` | Mobile/Tablet viewport (`width <= 992px`) | Inspect Header layout | Desktop navigation links and desktop language group are hidden (`display: none !important`); Hamburger button (`.mobile-menu-btn`) is visible. | CSS Computed Style check |

---

### TS-02: Mobile & Tablet Drawer Menu

| Test ID | Target Profile | Preconditions | Action Steps | Expected Results | Verification Method |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TS-02-01** | `DEV-MOB-01`, `DEV-MOB-03`, `DEV-TAB-01` | Mobile/Tablet viewport | Tap the Hamburger menu button | Drawer panel slides in smoothly from the right; darkened backdrop covers page; `body` scroll is locked (`overflow: hidden`). | Inspect `.drawer-panel.open` and `body` style |
| **TS-02-02** | `DEV-MOB-01`, `DEV-MOB-03` | Drawer open | Tap any navigation item (e.g., "Kinh nghiệm" / "Experience") | Drawer automatically slides closed; page smoothly scrolls to target section; body scroll lock is released. | Verify drawer closes & target section in viewport |
| **TS-02-03** | `DEV-MOB-01`, `DEV-MOB-03` | Drawer open | Tap outside the drawer panel on the backdrop overlay | Drawer smoothly closes; overlay fades out; body scroll is unlocked. | Touch event verification |
| **TS-02-04** | `DEV-MOB-01` to `DEV-TAB-02` | Drawer open | Press `Escape` key (physical or tablet keyboard) | Drawer closes immediately; focus returns to the hamburger trigger button. | Keyboard event test |
| **TS-02-05** | `DEV-MOB-01` to `DEV-TAB-02` | Drawer open | Tap the Theme toggle button inside the drawer | Theme switches between Dark/Light; drawer UI updates immediately without flickering or closing unexpectedly. | Inspect `html[data-theme]` |
| **TS-02-06** | `DEV-MOB-01` to `DEV-TAB-02` | Drawer open | Tap the Language switch buttons (VI / EN) inside drawer | Language switches instantly; drawer menu labels, section titles, and active indicators update to selected language. | Inspect `html[lang]` & text content |
| **TS-02-07** | `DEV-MOB-01` to `DEV-TAB-02` | Drawer open | Tap "Save CV / In CV" button inside drawer | Drawer closes; native `window.print()` dialog is triggered. | Verify print trigger |

---

### TS-03: Multi-Language Localization Engine (VI / EN)

| Test ID | Target Profile | Preconditions | Action Steps | Expected Results | Verification Method |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TS-03-01** | `DEV-DESK-01`, `DEV-MOB-03` | Fresh session (no `localStorage`) | Load website | Default language is English (`en`); `<html>` has `lang="en"`; content displays English text. | `localStorage.getItem('app-lang')` check |
| **TS-03-02** | `DEV-DESK-01`, `DEV-MOB-03` | Language is English | Click/Tap language toggle to "VI" | All text instantly switches to Vietnamese (Hero, About, Experience, Projects, Skills, Education, Contact, Footer, PrintCV, Blog); `html[lang="vi"]` is set; `localStorage` stores `'vi'`. | DOM text validation across all sections |
| **TS-03-03** | `DEV-DESK-01`, `DEV-MOB-03` | Language switched to "VI" | Refresh browser tab (`Cmd+R` / `F5`) | Page loads directly in Vietnamese with zero flash of English content (FOUC). | Persistence check on page reload |
| **TS-03-04** | `DEV-DESK-01`, `DEV-MOB-03` | In Blog Page (`#/blog`) | Switch language between VI and EN | Blog article listings, categories, reading times, search placeholder, and empty state messages translate accurately. | Verify blog post titles and tags |

---

### TS-04: Theme Switching System (Dark / Light Mode)

| Test ID | Target Profile | Preconditions | Action Steps | Expected Results | Verification Method |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TS-04-01** | `DEV-DESK-01`, `DEV-MOB-03` | OS set to Dark Mode | Open application for first time | Application defaults to Dark Mode; `html[data-theme="dark"]` is applied; background is deep slate (`#0b0f19`/`#0f172a`), accent red is vibrant. | Inspect `html[data-theme]` |
| **TS-04-02** | `DEV-DESK-01`, `DEV-MOB-03` | Current theme is Dark | Click/Tap Theme Toggle button | Theme smoothly transitions to Light Mode; `html[data-theme="light"]` is applied; background becomes crisp white/off-white; text color is high-contrast slate (`#0f172a`); `localStorage` records `'light'`. | CSS variable check & `localStorage` |
| **TS-04-03** | `DEV-DESK-01`, `DEV-MOB-03` | Light Mode active | Inspect Project Modal, Article Modal, and Drawer in Light Mode | Modals feature clean white surfaces, subtle borders, crisp typography, and readable code blocks with proper syntax contrast. | Visual & contrast ratio test |
| **TS-04-04** | `DEV-DESK-01`, `DEV-MOB-03` | Theme toggled | Refresh browser | Selected theme persists across reload without flicker. | Reload validation |

---

### TS-05: Hero & Profile Highlights

| Test ID | Target Profile | Preconditions | Action Steps | Expected Results | Verification Method |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TS-05-01** | `DEV-DESK-02` | Desktop viewport | Observe Hero section layout | 2-column layout: Left column contains Greeting, Full Name, Title Badge, Bio, CTA button group (View Projects, Contact, Save CV); Right column contains Avatar Card with experience/credential floating tags. | Layout grid inspection |
| **TS-05-02** | `DEV-DESK-01`, `DEV-DESK-02` | Desktop viewport | Hover mouse over Avatar Card | Card performs smooth 3D tilt / elevation transform with subtle red glow border micro-animation. | Inspect `:hover` CSS transform |
| **TS-05-03** | `DEV-MOB-01` to `DEV-MOB-04` | Mobile emulation (375px - 430px) | Observe Hero section layout | Layout collapses to single-column centered hierarchy; Avatar card width scales fluidly (`max-width: 100%`); CTA buttons stack cleanly; zero horizontal overflow. | Verify `scrollWidth <= clientWidth` |
| **TS-05-04** | `DEV-MOB-01`, `DEV-MOB-03`, `DEV-TAB-01` | Mobile/Tablet viewport | Observe Key Stats Banner | Stats banner adapts: 2-column grid on tablet, single-column or compact 2x2 grid on mobile; values and labels remain legible with no text truncation. | Check grid layout at breakpoints |
| **TS-05-05** | Any profile | Hero section loaded | Click "View Projects" CTA | Smoothly scrolls viewport to `#projects` section. | Click event & scroll test |

---

### TS-06: About & Engineering Principles

| Test ID | Target Profile | Preconditions | Action Steps | Expected Results | Verification Method |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TS-06-01** | `DEV-DESK-01`, `DEV-DESK-02` | Desktop viewport | View About section | Detailed engineering biography followed by 4 Core Engineering Principles cards (High Availability, Medallion Architecture, Clean Code, Cloud Cost Optimization) in a 4-column or 2x2 grid. | Grid verification |
| **TS-06-02** | `DEV-MOB-01` to `DEV-MOB-04` | Mobile viewport | Scroll through Principles cards | Cards stack vertically in 1 column; icon badges, titles, and descriptions maintain adequate padding (`16px-20px`) and line height. | Check padding & touch ergonomics |
| **TS-06-03** | `DEV-MOB-01`, `DEV-DESK-01` | Any device | Tap/Hover on a Principle card | Subtle card elevation and border accent highlight appear smoothly without causing layout shifting. | CSS transition verification |

---

### TS-07: Professional Experience Timeline

| Test ID | Target Profile | Preconditions | Action Steps | Expected Results | Verification Method |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TS-07-01** | `DEV-DESK-01`, `DEV-DESK-02` | Desktop viewport | View Experience section | Chronological timeline items display company name, role, period badge, location, highlighted accomplishment bullet points, and tech stack chips. | DOM & layout check |
| **TS-07-02** | `DEV-MOB-01` to `DEV-MOB-04` | Mobile viewport (320px - 430px) | Inspect Experience cards | Timeline node badges align cleanly; company header and period wrap gracefully without overlapping; tech stack chips wrap onto multiple lines without overflow. | Viewport overflow test |
| **TS-07-03** | Any profile | Vietnamese language | Inspect Experience descriptions | Bullet points render Vietnamese technical terminology accurately with highlighted metrics (e.g., `-40% latency`, `99.9% SLA`). | Text formatting check |

---

### TS-08: Engineering Architecture Case Studies (Projects)

| Test ID | Target Profile | Preconditions | Action Steps | Expected Results | Verification Method |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TS-08-01** | `DEV-DESK-01`, `DEV-MOB-03` | User on Projects section | Observe Category Filter Bar | Filter pills are available ("All", "Data Engineering", "Cloud / DevOps", "Backend", etc.). | Filter DOM verification |
| **TS-08-02** | `DEV-DESK-01`, `DEV-MOB-03` | Filter bar visible | Click/Tap category (e.g., "Data Engineering") | Project grid animates and displays only matching projects; active filter pill receives accent red styling. | State & item count check |
| **TS-08-03** | `DEV-DESK-01`, `DEV-DESK-02` | Project card visible | Click "View Case Study / Architecture Details" | Project Architecture Modal opens: displays architecture flow, challenges, solutions, quantifiable metrics, and tech badges; backdrop blurs; body scroll locks. | Modal DOM & scroll lock check |
| **TS-08-04** | `DEV-MOB-01` to `DEV-MOB-04` | Mobile viewport | Open Project Architecture Modal | Modal dialog occupies full mobile viewport (`width: 100%`, `max-height: calc(100vh - 40px)`); modal header with close button remains sticky at top; modal body scrolls smoothly with touch momentum. | Touch scroll & sticky header check |
| **TS-08-05** | Any profile | Modal is open | Tap close button `(×)`, click backdrop, or press `Escape` | Modal closes smoothly; focus returns to trigger; `body` scroll lock is removed. | Modal teardown test |

---

### TS-09: Core Technical Skills & Taxonomy Grid

| Test ID | Target Profile | Preconditions | Action Steps | Expected Results | Verification Method |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TS-09-01** | `DEV-DESK-01`, `DEV-DESK-02` | Skills section loaded | Observe Skills layout | Visual Legend bar displays proficiency levels (Core/Advanced/Proficient); skill categories (Languages, Big Data & Cloud, Backend, Databases, DevOps) render skill badges with level indicators. | Taxonomy grid check |
| **TS-09-02** | `DEV-MOB-01` to `DEV-MOB-04` | Mobile viewport (320px - 430px) | Inspect Skills section | Legend bar wraps neatly; category cards stack in 1 column; skill chips wrap without overflowing container boundaries. | Check `scrollWidth <= clientWidth` |
| **TS-09-03** | Any profile | Skills section loaded | Tap/Hover over skill chip | Chip displays tooltip or highlight indicating proficiency rating and core usage areas. | Interaction test |

---

### TS-10: Education & Professional Certifications

| Test ID | Target Profile | Preconditions | Action Steps | Expected Results | Verification Method |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TS-10-01** | `DEV-DESK-01`, `DEV-MOB-03` | Education section loaded | Inspect Academic Card | Displays Degree (Bachelor of CS Education - HCMUE), Academic Foundation bullets, and Honors/GPA details. | Content validation |
| **TS-10-02** | `DEV-DESK-01`, `DEV-MOB-03` | Education section loaded | Inspect Professional Certifications | Displays Google Cloud Professional Data Engineer (and other certificates) with verification badge, issuer, issue date, and active credential status. | Badge & metadata check |
| **TS-10-03** | `DEV-MOB-01` to `DEV-TAB-02` | Mobile/Tablet viewport | Inspect cards layout | Cards adapt to responsive single-column layout; credential badges wrap cleanly. | Layout check |

---

### TS-11: Contact Channels & Anti-Scraping Security Obfuscation

| Test ID | Target Profile | Preconditions | Action Steps | Expected Results | Verification Method |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TS-11-01** | Any profile | Contact section loaded | Inspect rendered HTML source (View Page Source) | Static HTML does NOT contain raw email address (`tanhuyng2631@gmail.com`) or raw phone number; sensitive strings are stored in chunked Base64 tokens. | Search raw source code |
| **TS-11-02** | Any profile | JavaScript executing in browser | Inspect DOM in DevTools Element inspector | `SecureEmail` and `SecurePhone` components decode dynamically at runtime; characters are split into separated `<span>` elements preventing simple scraper regex matches. | Element inspector validation |
| **TS-11-03** | `DEV-MOB-01` to `DEV-MOB-04` | Mobile viewport | Tap the Phone contact button / link | Phone dialer opens with correctly formatted `tel:+84963684520` URL. | Check `window.location.href` / anchor `href` |
| **TS-11-04** | `DEV-MOB-01` to `DEV-DESK-01` | Any viewport | Tap/Click the Email contact button | Default mail client opens with dynamically constructed `mailto:tanhuyng2631@gmail.com?subject=...` URL. | Anchor click test |
| **TS-11-05** | Any profile | Contact section loaded | Tap/Click LinkedIn, GitHub, Zalo links | Links open in new tab with `target="_blank"` and secure `rel="noopener noreferrer"`. | Anchor attribute check |

---

### TS-12: Technical Blog, Search & Article Reader with TOC

| Test ID | Target Profile | Preconditions | Action Steps | Expected Results | Verification Method |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TS-12-01** | `DEV-DESK-01`, `DEV-MOB-03` | User visits `#/blog` | Observe Blog Page | Blog header, Search bar, Category tag pills, and Article cards list render correctly. | Blog listing DOM verification |
| **TS-12-02** | `DEV-DESK-01`, `DEV-MOB-03` | Blog Page loaded | Type keyword into Search input (e.g., "Medallion" or "Rust") | Article list filters in real-time; only matching posts are shown; post count badge updates. | Real-time filter verification |
| **TS-12-03** | `DEV-MOB-01` to `DEV-MOB-04` | Mobile viewport | Tap search input and type keyword | Virtual keyboard opens without pushing layout off-screen; clear button resets query smoothly. | Mobile keyboard test |
| **TS-12-04** | `DEV-DESK-01`, `DEV-MOB-03` | Filter with non-matching term | Type "xyznonexistent123" | Friendly "No articles found" empty state with a "Reset Search" button is displayed. | Empty state verification |
| **TS-12-05** | `DEV-DESK-01`, `DEV-DESK-02` | Click an Article Card | Article Modal opens on Desktop | Modal opens with 2-column reader layout: Left column features Table of Contents (TOC) with active anchor tracking; Right column displays full article Markdown, headings, code snippets with syntax highlighting. | Reader layout check |
| **TS-12-06** | `DEV-MOB-01` to `DEV-MOB-04` | Tap an Article Card on Mobile | Article Modal opens on Mobile | Modal opens in single-column reading mode; TOC collapses into a compact collapsible menu or top anchor bar; sticky close button is easily tappable ($\ge 44\text{px}$). | Mobile reader inspection |
| **TS-12-07** | Any profile | Article modal open | Click TOC anchor link (e.g., "3. Architecture Flow") | Article content scrolls smoothly to target section heading. | Scroll anchor test |
| **TS-12-08** | Any profile | Article modal open | Press `Escape` key or tap close button | Modal closes smoothly; URL hash returns to `#/blog`; body scroll unlocked. | Teardown test |

---

### TS-13: Dedicated Print CV & PDF Export (Desktop & Mobile)

| Test ID | Target Profile | Preconditions | Action Steps | Expected Results | Verification Method |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TS-13-01** | `DEV-DESK-01`, `DEV-DESK-02` | Desktop Chrome / Safari | Click "Save CV" in header or press `Cmd+P` / `Ctrl+P` | Print Preview displays dedicated `.print-cv-document`; all web UI (`.web-only`, header, footer, floating buttons) is 100% hidden; document fits **exactly 2 pages A4 portrait**. | Print preview inspection |
| **TS-13-02** | `DEV-DESK-01`, `DEV-DESK-02` | Desktop Print Preview | Verify Page 1 content | **Page 1** contains Header + Contact row + Summary + Core Technical Skills + 3 Experience entries. Ends cleanly with forced page break. | Verify page 1 boundaries |
| **TS-13-03** | `DEV-DESK-01`, `DEV-DESK-02` | Desktop Print Preview | Verify Page 2 content | **Page 2** begins at the top with Featured Architecture Projects + Education & Certifications. No 3rd overflow page generated. | Verify page 2 boundaries |
| **TS-13-04** | `DEV-MOB-01`, `DEV-MOB-03` | Mobile viewport (iPhone Safari / Android Chrome) | Tap "Save CV" in drawer or Floating Action Button | Native mobile print preview opens; layout is identical to desktop print output; `@media screen` mobile styles do **not** leak or distort print styles; document renders exactly 2 A4 pages. | Mobile print simulation test |
| **TS-13-05** | `DEV-MOB-01` | iOS Safari Mobile | Save PDF from mobile print dialog | Text size is locked (`-webkit-text-size-adjust: 100%`); headings do not orphan (`break-after: avoid`); typography remains crisp. | Exported PDF inspection |

---

### TS-14: Floating Action Buttons (FAB) & Micro-Interactions

| Test ID | Target Profile | Preconditions | Action Steps | Expected Results | Verification Method |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TS-14-01** | Any profile | Page at top (`scrollY = 0`) | Observe bottom right corner | "Scroll to Top" button is hidden (`opacity: 0` or unmounted); "Save CV" quick button is visible with tooltips. | FAB visibility check |
| **TS-14-02** | Any profile | Scroll down `> 300px` | Observe FAB container | "Scroll to Top" button smoothly fades in. | Inspect `.floating-btn-scroll-top.visible` |
| **TS-14-03** | Any profile | Scrolled down | Tap/Click "Scroll to Top" button | Window smoothly scrolls back to `scrollY = 0`. | Verify `window.scrollY === 0` |
| **TS-14-04** | `DEV-MOB-01` to `DEV-MOB-04` | Mobile viewport with bottom gesture bar | Inspect FAB bottom margin | FAB has safe-area inset padding (`calc(20px + env(safe-area-inset-bottom))`), avoiding overlap with iOS Home indicator bar. | Computed CSS inspection |

---

### TS-15: Cross-Platform, Orientation & Touch Ergonomics

| Test ID | Target Profile | Preconditions | Action Steps | Expected Results | Verification Method |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TS-15-01** | `DEV-MOB-01` to `DEV-MOB-04` | Mobile Portrait | Rotate device to Mobile Landscape (`667 x 375` / `844 x 390`) | Layout reflows cleanly; Header sticky height adjusts; modal dialogs maintain scrollable viewing area; zero horizontal scroll leak. | Orientation change test |
| **TS-15-02** | `DEV-TAB-01` to `DEV-TAB-03` | Tablet Portrait | Rotate device to Tablet Landscape (`1024 x 768` / `1180 x 820`) | Navigation automatically upgrades from Hamburger Drawer to Desktop Navbar if width `> 992px`; grids transition from 2-column to 3-column smoothly. | Breakpoint transition test |
| **TS-15-03** | `DEV-MOB-01` to `DEV-TAB-02` | Touch device | Tap all interactive buttons, chips, links, and switches | All interactive elements meet minimum tap target size of $44 \times 44\text{px}$; touch ripple/active visual feedback is apparent. | Touch target inspection |

---

### TS-16: DevOps, Containerization & Build Verification

| Test ID | Target Profile | Preconditions | Action Steps | Expected Results | Verification Method |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TS-16-01** | Node.js Environment | Repo root | Execute `npm run typecheck` | TypeScript compiler (`tsc --noEmit`) passes with 0 errors. | Command exit code `0` |
| **TS-16-02** | Node.js Environment | Repo root | Execute `npm run build` | Vite builds production bundle into `dist/` with optimized chunks, assets, and 0 syntax warnings. | Command exit code `0` |
| **TS-16-03** | Docker Environment | Docker daemon running | Execute `docker compose -f docker-compose.dev.yml up -d` | Development container boots Vite dev server on port `5173`; HMR functions correctly when modifying source code. | Container health & HTTP `200` |
| **TS-16-04** | Docker Environment | Docker daemon running | Execute `docker compose up -d` | Production multi-stage build creates optimized Nginx alpine container on port `80`; static assets are served with gzip compression and cache headers. | Container health & HTTP `200` |
| **TS-16-05** | Production Nginx | Nginx running | Direct request to deep route (e.g., `http://localhost/index.html`) | Nginx SPA fallback `try_files $uri $uri/ /index.html;` returns `index.html` with HTTP 200 without 404 error. | Curl request verification |

---

## 4. Test Execution & Bug Reporting Template

When executing manual or automated test runs, record results using the following template:

```markdown
### Test Execution Log: [Module / Feature Name]
- **Date & Time:** YYYY-MM-DD HH:MM
- **Tester / Agent:** [Name / Agent ID]
- **Environment:** [Device Profile / Browser Version / OS]
- **Theme & Language:** [Dark/Light] | [VI/EN]

| Test ID | Status (PASS / FAIL / BLOCK) | Observed Behavior | Screenshots / Logs | Notes / Action Items |
| :--- | :--- | :--- | :--- | :--- |
| TS-XX-YY | PASS | Exactly as expected | N/A | Ready for release |
| TS-XX-ZZ | FAIL | Button overlaps text | `screenshot_01.png` | Adjust padding in `_responsive.scss` |
```
