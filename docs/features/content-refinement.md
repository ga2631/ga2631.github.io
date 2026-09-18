# Feature: content-refinement

## 1. End-to-End System Flow
Hệ thống quản lý dữ liệu CV và bản dịch đa ngôn ngữ (i18n) được tái cấu trúc nhằm phân tách triệt để giữa tầng **Dữ liệu Hồ sơ / Ứng viên (`cv.json`)** và tầng **Nhãn / Bản dịch Giao diện (`ui.json`)**:

1. **Client / Frontend Layer (React 19 + TypeScript + i18n JSON Data Model)**:
   - Hệ thống hỗ trợ song ngữ toàn diện (`en` và `vi`) với luồng nạp dữ liệu độc lập:
     - `src/data/locales/{lang}/ui.json`: Chỉ chứa các nhãn điều hướng, tiêu đề khu vực giao diện, placeholder, badge text, nút bấm và thông báo hệ thống.
     - `src/data/locales/{lang}/cv.json`: Chứa toàn bộ nội dung dữ liệu ứng viên: `personalInfo`, `principles` (4 triết lý kỹ thuật cốt lõi), `printCv` (`summaryExtension`, `academicDetails`), `experiences`, `projects`, `skillCategories`, `educations`, `certifications`.
     - `src/data/locales/{lang}/blog.json`: Chứa nội dung bài viết kỹ thuật.
   - `src/data/cvData.ts`:
     - Định nghĩa kiểu `UITranslation` chặt chẽ, loại bỏ hoàn toàn các trường dữ liệu nội dung bị lẫn trước đó.
     - Hàm `createSecuredPersonalInfo` tự động giải mã Base64 an toàn cho email/phone/zalo khi render.
     - Xuất `cvDataVi`, `cvDataEn`, và `uiTranslations`.
   - `src/App.tsx`:
     - Theo dõi ngôn ngữ hoạt động (`lang`), phân phối `currentCvData` và `t` (UI translation) tương ứng tới các component con:
       - `<About data={currentCvData.personalInfo} principles={currentCvData.principles} t={t.about} />`
       - `<PrintCV data={currentCvData} t={t.printCv} />`
   - `src/components/About.tsx`:
     - Nhận `principles` trực tiếp từ dữ liệu CV (`currentCvData.principles`), tự động cấu hình icon, màu sắc và render danh sách 4 thẻ triết lý kỹ thuật.
   - `src/components/PrintCV.tsx`:
     - Nạp `summaryExtension` và `academicDetails` trực tiếp từ `data.printCv` thuộc `CVData`, kết hợp với nhãn hiển thị từ `t`.

---

## 2. Database & Schema Changes
Cập nhật hợp đồng dữ liệu tĩnh (Static Data Contract) tại `src/types/index.ts`:
- **`PrincipleItem`** (mới):
  ```typescript
  export interface PrincipleItem {
    title: string;
    description: string;
  }
  ```
- **`PrintCvData`** (mới):
  ```typescript
  export interface PrintCvData {
    summaryExtension?: string;
    academicDetails?: string;
  }
  ```
- **`CVData`** (cập nhật):
  ```typescript
  export interface CVData {
    personalInfo: PersonalInfo;
    principles: PrincipleItem[];
    printCv?: PrintCvData;
    experiences: ExperienceItem[];
    projects: ProjectItem[];
    skillCategories: SkillCategory[];
    educations: EducationItem[];
    certifications: CertificationItem[];
    blogPosts?: BlogPost[];
  }
  ```

---

## 3. Technical Optimizations
- **Strict Separation of Concerns (SoC)**: Tách bạch rõ ràng giữa UI Strings (nhãn cố định) và CV Content Data (dữ liệu hồ sơ). Giúp việc quản trị nội dung, cập nhật hồ sơ năng lực hoặc thay đổi giao diện không ảnh hưởng lẫn nhau.
- **Full Type-Safety Guarantee**: Mọi thay đổi schema được xác thực toàn bộ qua trình biên dịch TypeScript (`tsc --noEmit`), ngăn ngừa runtime undefined errors khi truy cập các trường dữ liệu.
- **Zero Layout Shift & Backward Compatibility**: Đảm bảo toàn bộ logic hiển thị hiện có của trang chính, trang bài viết và định dạng in A4 ([PrintCV.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/PrintCV.tsx)) hoạt động mượt mà, không gián đoạn.
- **ATS Print Layout Optimization**: Tối ưu định dạng in A4 trong [PrintCV.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/PrintCV.tsx):
  - Chuẩn hóa lề in `@page { size: A4 portrait; margin: 8mm 12mm; }`.
  - Đồng bộ họ và tên (`.print-name`) cùng các tiêu đề phân mục chính (`.print-section-heading` như *PROFESSIONAL SUMMARY*, *CORE TECHNICAL SKILLS*, *PROFESSIONAL EXPERIENCE*, *FEATURED ENGINEERING ARCHITECTURE CASE STUDIES*, *EDUCATION & CERTIFICATIONS*) sang tông màu đỏ thương hiệu chủ đạo (`#b91c1c`) kèm viền gạch chân hài hòa (`border-bottom: 1.2px solid rgba(185, 28, 28, 0.45)`).
  - Tách thanh thông tin liên hệ (`.print-contact-row`) thành 2 dòng chuyên nghiệp: Dòng 1 chứa Email, Số điện thoại và Địa chỉ; Dòng 2 chứa liên kết GitHub, LinkedIn và Portfolio Website.
  - Chuẩn hóa hệ thống màu chữ phân cấp (Color Hierarchy): Các thông tin chức danh (Job Title), tên dự án (Project Title), vai trò (Project Role), tên bằng cấp (Degree) và chứng chỉ (Certifications) sử dụng màu chủ đạo (`#b91c1c`); tên công ty, đơn vị đào tạo, tổ chức cấp chứng chỉ sử dụng màu chữ thông thường (`#0f172a`).
  - Tối ưu cấu trúc phân mục Dự án: Vai trò hiển thị trước bên trái, tên công ty đặt bên phải vai trò (`<Vai trò> | <Tên công ty>`).
  - Tách bạch phần Học vấn / Nền tảng chuyên môn (`Academic Background`) thành từng dòng/bullet point rõ ràng (`.print-edu-gpa`, `.print-edu-bullets`) thay vì gộp thành đoạn văn liền khối.
- **Language & Tech Stack Color Identification System**: Xây dựng bộ quy chuẩn màu sắc nhận diện trực quan cho toàn bộ ngôn ngữ lập trình và công nghệ (TypeScript, Go, Python, Java, PHP, JavaScript, React, Vue, PostgreSQL, MySQL, Redis, RabbitMQ, Docker, Linux, SQL, Rust, C++, C#, v.v.). Mỗi tag được áp dụng màu chữ, màu nền pastel tinh tế, viền đồng bộ kèm chấm tròn màu (`lang-color-dot`) phát sáng nhẹ, giúp người xem dễ dàng phân biệt và nhận diện nhanh các ngôn ngữ/công nghệ sử dụng trong các kho mã nguồn GitHub và dự án kiến trúc.
- **Project Card UI Streamlining**: Loại bỏ phần tóm tắt chỉ số tác động (Success Metrics / Impact Pills) trên bề mặt các thẻ dự án (Project Cards) ở trang chủ để tránh lặp lại thông tin, giúp bố cục thẻ dự án thanh thoát, đồng đều hơn; toàn bộ chỉ số định lượng chi tiết được tập trung đầy đủ trong cửa sổ Case Study Kiến trúc Hệ thống (Modal Reader).
- **Sass (SCSS) Modular Stylesheet Architecture**: Tái cấu trúc file đơn khối `src/styles/index.css` (~3,600 dòng) thành kiến trúc Sass module hóa chuẩn 7-1 pattern:
  - `abstracts/`: `_variables.scss` (Design tokens, Dark/Light mode theme tokens, skill level colors), `_mixins.scss` (Responsive mixins, glassmorphism helper).
  - `base/`: `_reset.scss` (HTML/body reset, ambient glow keyframes, typography reset), `_layout.scss` (Container, section titles, badges, glass-panel borders & animations, button styles).
  - `components/`: `_header.scss`, `_drawer.scss`, `_floating-actions.scss`, `_hero.scss`, `_about.scss`, `_experience.scss`, `_projects.scss`, `_skills.scss`, `_education.scss`, `_contact.scss`, `_footer.scss`.
  - `pages/`: `_blog.scss`, `_article-modal.scss`.
  - `print/`: `_print.scss` (Định dạng in ấn ATS 2-page A4 print stylesheet).
  - `responsive/`: `_responsive.scss` (Media queries cho Mobile & Tablet breakpoints).
  - `index.scss`: Master SCSS entry point nạp toàn bộ partials theo thứ tự cascade chuẩn xác.

---

## 4. Impacted Files
- `src/components/Projects.tsx`: Tinh giản thẻ dự án, tích hợp hàm `getTechColorInfo` ánh xạ mã màu thương hiệu chuẩn xác cho toàn bộ ngôn ngữ/công nghệ trên thẻ GitHub, thẻ dự án và Modal Reader.
- `src/styles/components/_projects.scss`: Bổ sung class `.badge-tech-tag` với hiệu ứng tương tác làm nổi bật khi hover.
- `package.json`: Bổ sung dependency `sass` vào `devDependencies`.
- `src/main.tsx`: Chuyển đổi import từ `src/styles/index.css` sang `src/styles/index.scss`.
- `src/styles/index.scss`: Master entry point cho Sass stylesheet.
- `src/styles/abstracts/_variables.scss`: Tokens màu sắc, font, radius, transitions, dark/light theme variables.
- `src/styles/abstracts/_mixins.scss`: Breakpoints và glassmorphism mixins.
- `src/styles/base/_reset.scss`: Reset rules và ambient background glow animation.
- `src/styles/base/_layout.scss`: Glass panel, clockwise border animations, button & badge styles.
- `src/styles/components/_header.scss`: Header navbar, navigation links, brand logo.
- `src/styles/components/_drawer.scss`: Mobile drawer slide-over navigation và settings.
- `src/styles/components/_floating-actions.scss`: Floating action buttons (FAB) và scroll-to-top.
- `src/styles/components/_hero.scss`: Hero visual profile, stats banner và headline typography.
- `src/styles/components/_about.scss`: About principles grid và principle cards.
- `src/styles/components/_experience.scss`: Experience timeline, badges và achievement bullets.
- `src/styles/components/_projects.scss`: Project cards, filter tabs, repo cards và case study dialog.
- `src/styles/components/_skills.scss`: Skills matrix, level badges và legend filter.
- `src/styles/components/_education.scss`: Education và certifications cards.
- `src/styles/components/_contact.scss`: Contact cards và interactive actions.
- `src/styles/components/_footer.scss`: Footer và screen-view print-cv-document toggle.
- `src/styles/pages/_blog.scss`: Blog page, search bar và topic tags.
- `src/styles/pages/_article-modal.scss`: Modal reader popup và sticky table of contents.
- `src/styles/print/_print.scss`: ATS 2-page print layout rules.
- `src/styles/responsive/_responsive.scss`: Mobile/tablet responsive breakpoints.
- `src/types/index.ts`: Bổ sung `PrincipleItem`, `PrintCvData` và cập nhật `CVData`.
- `src/data/locales/vi/cv.json`: Bổ sung `principles` và `printCv` (nội dung tiếng Việt); cập nhật thông tin học vấn.
- `src/data/locales/en/cv.json`: Bổ sung `principles` và `printCv` (nội dung tiếng Anh); cập nhật thông tin học vấn.
- `src/data/locales/vi/ui.json`: Loại bỏ `principles`, `summaryExtension`, `academicDetails` để chuẩn hóa chỉ chứa UI tokens.
- `src/data/locales/en/ui.json`: Loại bỏ `principles`, `summaryExtension`, `academicDetails` để chuẩn hóa chỉ chứa UI tokens.
- `src/data/cvData.ts`: Cập nhật interface `UITranslation` tương ứng.
- `src/components/About.tsx`: Cập nhật props để nhận `principles` từ `CVData`.
- `src/components/PrintCV.tsx`: Đọc `summaryExtension` và `academicDetails` từ `data.printCv`; tách thông tin liên hệ thành 2 dòng; sắp xếp `<Vai trò> | <Tên công ty>`; tách Academic Background thành các dòng bullet; chuẩn hóa hiển thị Certification đồng bộ với Education.
- `src/App.tsx`: Truyền `principles` từ `currentCvData` vào `<About />`.
- `docs/features/content-refinement.md`: Tài liệu kỹ thuật chi tiết cho tính năng tái cấu trúc dữ liệu, tối ưu in ấn và module hóa Sass.
