# Feature: cv-portfolio-setup

## 1. End-to-End System Flow
Hệ thống CV Portfolio & Blog Engine được thiết kế theo mô hình Static Site Generation (SSG) / Single Page Application (SPA) với quy trình End-to-End từ Development, CI/CD đến Production Hosting:

1. **Client / Frontend Layer (React 19 + TypeScript + CSS Design Tokens)**:
   - Ứng dụng khởi động tại `src/main.tsx`, render `src/App.tsx` vào DOM container (`#root`).
   - `App.tsx` quản lý Dark/Light Theme state đồng bộ với `localStorage` và `prefers-color-scheme`.
   - Dữ liệu CV và Blog được cấu trúc tập trung, kiểu dữ liệu an toàn tại `src/data/cvData.ts` thông qua các TypeScript interfaces trong `src/types/index.ts`.
   - Các component hiển thị chuyên biệt:
     - `Header.tsx`: Điều hướng mượt (smooth scroll), chuyển đổi theme, kích hoạt Print/PDF engine.
     - `Hero.tsx`: Headline, quick stats, action CTA và terminal visual card.
     - `About.tsx`: Triết lý phát triển phần mềm và năng lực kỹ thuật cốt lõi.
     - `Experience.tsx`: Timeline kinh nghiệm nghề nghiệp với achievements và tech tags.
     - `Projects.tsx`: Danh mục dự án tích hợp tải song song các Public GitHub Repositories (`api.github.com/users/ga2631/repos`) trực tiếp cùng 4 Enterprise Architecture Case Studies với bộ lọc tab đa năng (All Works, Architecture Case Studies, GitHub Repositories, Fullstack, Backend/Cloud, Data/AI) và modal phân tích kiến trúc chuyên sâu.
     - `Skills.tsx`: Ma trận kỹ năng dạng compact pill clusters với glow dot chỉ báo mức độ thành thạo.
     - `EducationCertifications.tsx`: Bằng cấp đại học và chứng chỉ quốc tế (AWS, Docker, PSM).
     - `BlogSection.tsx`: Module hiển thị và đọc bài viết kỹ thuật (HTML Blog Reader) với modal view, sẵn sàng cho việc xuất bản bài viết và mở rộng thành blog độc lập.
     - `Contact.tsx`: Kênh liên hệ, tính năng 1-click Copy Email và form gửi tin nhắn.
     - `Footer.tsx`: Copyright, live status và repository reference.

2. **Containerization & Web Server Layer (Docker + Nginx)**:
   - `Dockerfile` sử dụng kỹ thuật Multi-Stage Build:
     - Stage 1 (Builder): Sử dụng image `node:22-alpine` biên dịch TypeScript và đóng gói tĩnh với Vite 6 thành bundle `dist/`.
     - Stage 2 (Runner): Sử dụng image `nginx:1.27-alpine` siêu nhẹ (<25MB), nạp cấu hình `nginx.conf` hỗ trợ SPA fallback (`try_files $uri $uri/ /index.html`), nén Gzip và thiết lập HTTP caching headers.
   - `docker-compose.yml` cho phép chạy dịch vụ cục bộ qua cổng `8080:80`.

3. **CI/CD Pipeline & GitHub Pages Deployment Layer (GitHub Actions)**:
   - Khi commit/push lên branch `master` hoặc `main`, workflow `.github/workflows/deploy.yml` tự động kích hoạt:
     - Kiểm tra kiểu dữ liệu tĩnh (`npm run typecheck`).
     - Biên dịch mã nguồn (`npm run build`).
     - Đóng gói artifact và phát hành trực tiếp lên GitHub Pages tại domain `ga2631.github.io` thông qua `actions/deploy-pages@v4`.

---

## 2. Database & Schema Changes
Hệ thống sử dụng Static Structured Data Schema định nghĩa qua TypeScript (`src/types/index.ts`):
- `PersonalInfo`: Lưu trữ thông tin cá nhân, định danh, bio, liên hệ, stats.
- `ExperienceItem`: Schema lưu trữ lịch sử làm việc, công ty, thời gian, thành tích và danh sách công nghệ.
- `ProjectItem`: Schema dự án với phân loại danh mục, highlight bullets, link demo và GitHub.
- `SkillCategory`: Phân loại kỹ năng và mức độ thành thạo (Expert / Advanced / Proficient).
- `EducationItem` & `CertificationItem`: Schema học vấn và chứng chỉ chuyên ngành.
- `BlogPost`: Schema bài viết kỹ thuật hỗ trợ định dạng HTML/Markdown (`slug`, `title`, `summary`, `publishedAt`, `readTime`, `tags`, `author`, `contentHtml`).

*(Không có thay đổi database quan hệ hoặc migration ngoài schema tĩnh).*

---

## 3. Technical Optimizations
- **React 19 & Zero-Runtime CSS**: Sử dụng React 19 tối ưu hóa vòng đời render kết hợp CSS Variables và Glassmorphism, loại bỏ hoàn toàn chi phí runtime của các thư viện CSS-in-JS cồng kềnh.
- **Zero-Dependency SVG Icon Registry (`Icons.tsx`)**: Tích hợp trực tiếp các biểu tượng vector SVG không phụ thuộc thư viện bên ngoài, giảm thiểu đáng kể kích thước bundle và ngăn ngừa layout shift.
- **Dedicated Print Stylesheet (`@media print`)**: Tích hợp sẵn CSS Print Engine chuẩn A4, cho phép người dùng hoặc nhà tuyển dụng xuất CV ra file PDF hoàn hảo bằng cách nhấn nút "Print CV" (`window.print()`).
- **Nginx Gzip & Long-term Asset Caching**: Cấu hình gzip compression cho HTML/CSS/JS/SVG và thiết lập `Cache-Control: public, immutable` (1 năm) cho static assets.
- **Multi-Stage Docker Optimization**: Tách biệt môi trường build và runtime giúp giảm kích thước image xuống mức tối thiểu và loại bỏ rủi ro bảo mật từ node_modules trong runtime.

---

## 4. Impacted Files
- `package.json`: Khai báo cấu hình dự án, scripts và dependencies (React 19, TypeScript, Vite).
- `tsconfig.json` & `tsconfig.node.json`: Cấu hình TypeScript Strict Mode.
- `vite.config.ts`: Cấu hình Vite 6 với React plugin và base path `/`.
- `index.html`: Cấu hình SEO meta tags, OpenGraph, Favicon và Google Fonts.
- `public/favicon.svg`: Icon nhận diện thương hiệu SVG vector.
- `public/robots.txt`: Cấu hình cho SEO crawlers.
- `src/types/index.ts`: Định nghĩa TypeScript interfaces cho toàn bộ hệ thống.
- `src/data/cvData.ts`: Dữ liệu CV và Blog mẫu tập trung.
- `src/styles/index.css`: Design tokens, dark/light theme, responsive styles và CSS Print.
- `src/components/Icons.tsx`: Bộ sưu tập icon SVG hiệu năng cao.
- `src/components/Header.tsx`: Navbar, Theme Switcher, Print CV.
- `src/components/Hero.tsx`: Hero section, quick stats, CTA buttons.
- `src/components/About.tsx`: Giới thiệu bản thân và triết lý kỹ thuật.
- `src/components/Experience.tsx`: Timeline lịch sử làm việc.
- `src/components/Projects.tsx`: Danh mục dự án và bộ lọc.
- `src/components/Skills.tsx`: Ma trận kỹ năng phân nhóm.
- `src/components/EducationCertifications.tsx`: Học vấn và chứng chỉ.
- `src/components/BlogSection.tsx`: Module bài viết kỹ thuật & HTML Blog Reader mở rộng.
- `src/components/Contact.tsx`: Kênh liên hệ trực tiếp với 1-Click Copy Email, Phone Call, Location & Birthday, GitHub Action cards.
- `src/components/Footer.tsx`: Chân trang và repository link.
- `src/App.tsx`: Component gốc quản lý theme và bố cục.
- `src/main.tsx`: Entry point khởi tạo React 19.
- `Dockerfile`: Multi-stage build (Node 22 -> Nginx 1.27 Alpine) phục vụ môi trường production.
- `Dockerfile.dev`: Image phát triển Node 22 hỗ trợ live server.
- `nginx.conf`: Cấu hình Nginx phục vụ SPA, gzip và caching.
- `docker-compose.yml`: Cấu hình chạy container production cục bộ (`port 8080`).
- `docker-compose.dev.yml`: Cấu hình chạy live development với Hot Module Replacement (HMR) và volume sync (`port 3000`).
- `.dockerignore` & `.gitignore`: Loại bỏ các file tạm và dependencies.
- `.github/workflows/deploy.yml`: Workflow CI/CD tự động deploy lên GitHub Pages (`ga2631.github.io`).
