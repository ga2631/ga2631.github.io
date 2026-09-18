<div align="center">

# 🌐 Tan Huynh Nhat — Interactive Portfolio & Engineering CV

[![Deploy to GitHub Pages](https://github.com/ga2631/ga2631.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/ga2631/ga2631.github.io/actions/workflows/deploy.yml)
[![React 19](https://img.shields.io/badge/React-19.0-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Docker](https://img.shields.io/badge/Docker-Multi--Stage-2496ed?logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**[🚀 Live Portfolio Website](https://ga2631.github.io)** • **[📄 Read Architecture Case Studies](https://ga2631.github.io/#projects)** • **[📚 Engineering Blog](https://ga2631.github.io/#/blog)**

---

<p align="center">
  <em>Modern, high-performance personal portfolio, engineering CV, and technical blog built with React 19, TypeScript, Vanilla CSS design system, and multi-stage Docker containerization.</em>
</p>

</div>

---

## 🌟 Key Highlights & Engineering Features

- ⚡ **High-Performance Architecture**: Built on React 19 with Vite 6 for sub-second hot-reloads, zero bloat, and fast Core Web Vitals.
- 🌐 **Full Bilingual Support (EN / VI)**: Seamless real-time language switching between English (default) and Vietnamese with `localStorage` state persistence.
- 📄 **Executive / ATS-Compliant 2-Page Print CV (`Save CV`)**: Precision print stylesheet (`@media print`) rendering a clean, recruiter-friendly 2-page A4 PDF synchronized with the active language.
- 📚 **Dedicated Engineering Blog (`#/blog`)**: Independent SPA routing with real-time keyword search, topic tag filtering, deep-linking (`#/blog/:slug`), and formatted technical article reading view.
- 🐙 **Live GitHub Sync**: Automatically fetches and showcases public open-source repositories live from GitHub API (`@ga2631`).
- 🎨 **Tailored Design System**: Pure Vanilla CSS design tokens with Glassmorphism, Dark & Light mode toggle, and micro-interactions.
- 🐳 **Docker & Production Ready**: Multi-stage Docker build (`node:22-alpine` -> `nginx:1.27-alpine` < 25MB) with gzip compression and security caching.
- 🤖 **Automated CI/CD**: GitHub Actions workflow verifying typecheck (`tsc --noEmit`), bundling, and deploying zero-downtime to GitHub Pages on commit.

---

## 🛠️ Technology Stack

| Layer | Technologies & Tools |
| :--- | :--- |
| **Frontend Core** | React 19, TypeScript 5.7, Vite 6, Modern HTML5 Semantic Elements |
| **Styling & Theme** | Vanilla CSS3 (Custom Design Tokens, HSL Color Palettes, Glassmorphism, Print CSS) |
| **Icons & Assets** | Self-contained, tree-shakeable SVG Icon Component Library (Zero runtime bloat) |
| **Containerization** | Docker, Docker Compose, Multi-Stage Build, Nginx 1.27 Alpine |
| **CI/CD & Hosting** | GitHub Actions Workflow (`deploy.yml`), GitHub Pages (`https://ga2631.github.io`) |

---

## 🏗️ Architecture & Project Structure

```
ga2631.github.io/
├── .github/workflows/
│   └── deploy.yml              # CI/CD pipeline (Typecheck, Build & Deploy to GitHub Pages)
├── public/
│   ├── favicon.svg             # SVG Favicon & brand mark
│   └── robots.txt              # SEO crawler optimization
├── src/
│   ├── components/
│   │   ├── Header.tsx          # Navigation, Theme toggle, Language switcher, Save CV
│   │   ├── Hero.tsx            # Visual Developer Profile, Headline, Hero Stats banner
│   │   ├── About.tsx           # Engineering philosophy & architectural principles
│   │   ├── Experience.tsx      # Chronological career timeline & tech tags
│   │   ├── Projects.tsx        # Enterprise architecture case studies & GitHub sync
│   │   ├── Skills.tsx          # Categorized technical skills matrix
│   │   ├── EducationCertifications.tsx # CS education & professional credentials
│   │   ├── Contact.tsx         # Contact hub & 1-click clipboard copy
│   │   ├── Footer.tsx          # Site footer & copyright
│   │   ├── PrintCV.tsx         # ATS 2-page A4 print stylesheet and layout
│   │   └── Icons.tsx           # Self-contained SVG icon library
│   ├── pages/
│   │   └── BlogPage.tsx        # Dedicated Blog page with Search, Filter & Reader
│   ├── data/
│   │   ├── cvData.ts           # Bilingual CV data & UI translation dictionaries
│   │   └── blogData.ts         # Bilingual technical blog posts
│   ├── types/
│   │   └── index.ts            # TypeScript data contracts & type definitions
│   ├── styles/
│   │   ├── abstracts/          # Variables, design tokens & SCSS mixins
│   │   ├── base/               # Reset, typography, glass panels & layout utilities
│   │   ├── components/         # Modular component partials (Header, Hero, Drawer, FAB, etc.)
│   │   ├── pages/              # Blog page & Article modal reader
│   │   ├── print/              # ATS 2-page A4 print stylesheet
│   │   ├── responsive/         # Media query breakpoints for Mobile & Tablet
│   │   └── index.scss          # Master Sass entry point
│   ├── App.tsx                 # Root SPA router & state management
│   └── main.tsx                # React 19 bootstrap entry
├── Dockerfile                  # Multi-stage production container
├── nginx.conf                  # Nginx SPA fallback routing & caching configuration
├── docker-compose.yml          # Production container orchestration
├── docker-compose.dev.yml      # Development container orchestration
├── vite.config.ts              # Vite build config
├── tsconfig.json               # TypeScript strict configuration
└── package.json
```

---

## 💻 Local Development Setup

### Option 1: Using Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/ga2631/ga2631.github.io.git
cd ga2631.github.io

# Start development server with hot-reload
docker compose -f docker-compose.dev.yml up

# Access the application at http://localhost:3000
```

### Option 2: Using Node.js locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run TypeScript typecheck
npm run typecheck

# Build production bundle
npm run build
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Built with ❤️ by <strong>Tan Huynh Nhat</strong> • Connect on <a href="https://github.com/ga2631">GitHub</a> • <a href="https://ga2631.github.io">Live Site</a></sub>
</div>
