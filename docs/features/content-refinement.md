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

---

## 4. Impacted Files
- `src/types/index.ts`: Bổ sung `PrincipleItem`, `PrintCvData` và cập nhật `CVData`.
- `src/data/locales/vi/cv.json`: Bổ sung `principles` và `printCv` (nội dung tiếng Việt).
- `src/data/locales/en/cv.json`: Bổ sung `principles` và `printCv` (nội dung tiếng Anh).
- `src/data/locales/vi/ui.json`: Loại bỏ `principles`, `summaryExtension`, `academicDetails` để chuẩn hóa chỉ chứa UI tokens.
- `src/data/locales/en/ui.json`: Loại bỏ `principles`, `summaryExtension`, `academicDetails` để chuẩn hóa chỉ chứa UI tokens.
- `src/data/cvData.ts`: Cập nhật interface `UITranslation` tương ứng.
- `src/components/About.tsx`: Cập nhật props để nhận `principles` từ `CVData`.
- `src/components/PrintCV.tsx`: Đọc `summaryExtension` và `academicDetails` từ `data.printCv`.
- `src/App.tsx`: Truyền `principles` từ `currentCvData` vào `<About />`.
- `docs/features/content-refinement.md`: Tài liệu kỹ thuật chi tiết cho tính năng tái cấu trúc dữ liệu.
