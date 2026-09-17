# Feature: ui-optimization

## 1. End-to-End System Flow
Hệ thống UI/UX được tối ưu hóa toàn diện, đưa toàn bộ các section có 4 box cố định hiển thị trên cùng 1 hàng duy nhất trên màn hình Desktop, đồng thời chuẩn hóa kích thước nút hành động, sửa lỗi tràn layout và tích hợp đầy đủ các kênh kết nối nghề nghiệp trực tiếp gồm **LinkedIn** (`https://www.linkedin.com/in/tan-huynh-nhat/`) và **Zalo** (`https://zalo.me/0963684520`):

1. **Client / Desktop 4-Box Section Single-Row Alignment Flow (`index.css`, `About.tsx`, `Skills.tsx`, `Contact.tsx`, `Hero.tsx`)**:
   - Toàn bộ 4 section có cấu trúc 4 box cố định trên trang được đồng bộ hóa hiển thị trên **1 hàng duy nhất (4 cột `repeat(4, 1fr)`)** trên màn hình Desktop (`>= 993px`):
     - **Hero Stats Banner (`.hero-stats-banner`)**: 4 chỉ số thống kê (Năm kinh nghiệm, Khớp nối dữ liệu, Hiệu năng truy vấn, Tải đồng thời) nằm trên 1 hàng.
     - **About Principles Grid (`.principles-grid`)**: 4 triết lý kỹ thuật (Kiến trúc Bền bỉ, An toàn Kiểu dữ liệu, DevOps & Tự động hóa, Tối ưu hóa Dữ liệu) nằm trên 1 hàng.
     - **Skills Matrix Grid (`.skills-compact-grid`)**: 4 danh mục kỹ năng (Core Engineering, Database & Infrastructure, Product Analytics & Data Engineering, Product/Agile/AI) nằm trên 1 hàng.
     - **Contact Cards Grid (`.contact-cards-grid`)**: 4 thẻ liên hệ (Direct Email, Phone & Zalo, Location & Birthday, LinkedIn) nằm trên 1 hàng.
   - **Cơ chế Responsive linh hoạt**:
     - Màn hình Tablet (`577px <= viewport <= 992px`): Chuyển đổi mượt mà sang lưới 2x2 (`repeat(2, 1fr)`).
     - Màn hình Mobile (`viewport <= 576px`): Xếp chồng 1 cột (`1fr`).

2. **Client / Contact Section - Action Button Sizing & Alignment Standardization Flow (`Contact.tsx` & `index.css`)**:
   - Đồng bộ hóa toàn bộ kích cỡ, chiều cao và tỷ lệ căn chỉnh cho tất cả các nút hành động và huy hiệu (`badge`) trên 4 thẻ liên hệ:
     - **Email Card (Direct Email)**: 2 nút (**Sao chép Email / Copy Email** & **Soạn thư / Compose**) phân chia chuẩn xác 50% - 50% chiều rộng card, chiều cao cố định `40px` và font chữ `0.85rem / 600`.
     - **Phone & Zalo Card**: 2 nút (**Gọi điện / Call** & **Nhắn Zalo / Chat Zalo**) phân chia chuẩn xác 50% - 50% chiều rộng card với cùng chiều cao `40px`.
     - **Location & Birthday Card**: Huy hiệu trạng thái sẵn sàng nhận việc (`badge-emerald`) chuẩn hóa chiều cao `40px` và căn giữa hoàn hảo.
     - **LinkedIn Profile Card**: Nút **"Xem hồ sơ / View Profile"** chiếm 100% chiều rộng với cùng chiều cao `40px`.

3. **Client / Projects Section - Action Button Layout Protection Flow (`Projects.tsx` & `index.css`)**:
   - Khắc phục triệt để lỗi tràn viền thẻ dự án của nút **"Demo"** trên các kho mã nguồn GitHub có cấu hình `homepage` (ví dụ: `ga2631.github.io`).
   - Tái cấu trúc CSS Flexbox cho `.project-actions-compact` với `width: 100%` và `.project-actions-compact .btn` chuyển sang cơ chế `flex: 1 1 0`, `min-width: 0`, `width: auto`, `padding: 0 12px`.

4. **Client / Hero Profile Card Flow (`Hero.tsx`)**:
   - Dữ liệu `linkedinUrl` và `zaloUrl` được định nghĩa tập trung trong `src/data/cvData.ts` (cho cả `cvDataEn` và `cvDataVi`).
   - Component [Hero.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/Hero.tsx) tự động hiển thị đầy đủ bộ 4 nút kết nối xã hội trong Profile Card bên trái: **GitHub**, **LinkedIn**, **Zalo**, và **Email**.

5. **Drawer Menu & Mobile Touchpoints (`DrawerMenu.tsx`)**:
   - Cập nhật footer của Drawer Menu trên thiết bị di động và tablet với đầy đủ 3 liên kết nhanh: **GitHub**, **LinkedIn**, và **Zalo**.

6. **Print CV & ATS Compatibility (`PrintCV.tsx`)**:
   - Bản in PDF chuẩn ATS tự động tích hợp thông tin LinkedIn trong thanh liên hệ đầu trang (`💼 linkedin.com/in/tan-huynh-nhat`).

---

## 2. Database & Schema Changes
- Cập nhật hợp đồng dữ liệu [src/types/index.ts](file:///Users/tanhn/Projects/ga2631.github.io/src/types/index.ts):
  - Bổ sung trường `zaloUrl?: string;` vào interface `PersonalInfo`.
- Cập nhật dữ liệu tĩnh trong [src/data/cvData.ts](file:///Users/tanhn/Projects/ga2631.github.io/src/data/cvData.ts):
  - Bổ sung `call: string;` và `zalo: string;` vào interface `UITranslation['contact']` và từ điển bản dịch EN/VI.
  - Khai báo `linkedinUrl: 'https://www.linkedin.com/in/tan-huynh-nhat/'` và `zaloUrl: 'https://zalo.me/0963684520'` vào `personalInfo` của cả `cvDataEn` và `cvDataVi`.

---

## 3. Technical Optimizations
- **Single-Row 4-Column Desktop Grid Consistency**: Đồng bộ `grid-template-columns: repeat(4, 1fr)` cho tất cả các vùng chứa 4 box trên Desktop (`.hero-stats-banner`, `.principles-grid`, `.skills-compact-grid`, `.contact-cards-grid`), tối ưu hóa không gian hiển thị màn hình rộng và đem lại trải nghiệm cân xứng thị giác.
- **Unified Action Element Geometry**: Thiết lập quy chuẩn kích thước hình học đồng nhất (`height: 40px`, `border-radius: var(--radius-sm)`, `box-sizing: border-box`) cho toàn bộ các nút bấm và thẻ huy hiệu trong `.contact-card-actions`.
- **Flexbox Equal Distribution & Zero Overflow**: Tối ưu `.project-actions-compact` và `.contact-card-actions` với thuộc tính `flex: 1 1 0` và `min-width: 0`, đảm bảo phân chia không gian đồng đều và ngăn chặn tràn layout.
- **Feather-consistent Vector Icons**: Bổ sung `PhoneIcon` và `ZaloIcon` với chuẩn SVG vector `strokeWidth="2"` đồng bộ với toàn bộ bộ icon hệ thống.

---

## 4. Impacted Files
- [src/styles/index.css](file:///Users/tanhn/Projects/ga2631.github.io/src/styles/index.css): Cấu hình `repeat(4, 1fr)` trên Desktop và quy tắc responsive 2x2 / 1-column cho `.principles-grid`, `.skills-compact-grid`, `.contact-cards-grid`, `.hero-stats-banner`.
- [src/components/About.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/About.tsx): Thay thế inline styles bằng CSS class `.principles-grid` và `.principle-card`.
- [src/components/Contact.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/Contact.tsx): Chuẩn hóa cấu trúc nút bấm, loại bỏ inline styles dư thừa, đảm bảo các nút trong Direct Email và Phone & Zalo phân chia 50/50 đồng nhất.
- [src/components/Projects.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/Projects.tsx): Loại bỏ inline style cố định `flex: 0 0 auto` trên nút Demo.
- [src/types/index.ts](file:///Users/tanhn/Projects/ga2631.github.io/src/types/index.ts): Khai báo kiểu `zaloUrl?: string;` trong `PersonalInfo`.
- [src/components/Icons.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/Icons.tsx): Tạo mới và export component `ZaloIcon` và `PhoneIcon`.
- [src/data/cvData.ts](file:///Users/tanhn/Projects/ga2631.github.io/src/data/cvData.ts): Khai báo `linkedinUrl`, `zaloUrl` và các nhãn song ngữ `call`, `zalo`.
- [src/components/Hero.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/Hero.tsx): Bổ sung nút liên kết Zalo vào Profile Card.
- [src/components/DrawerMenu.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/DrawerMenu.tsx): Tích hợp nút Zalo trong footer của Drawer menu mobile/tablet.
- [src/components/PrintCV.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/PrintCV.tsx): Bổ sung liên kết LinkedIn trên thanh tiêu đề in ấn ATS.
- [docs/features/ui-optimization.md](file:///Users/tanhn/Projects/ga2631.github.io/docs/features/ui-optimization.md): Tài liệu kỹ thuật chi tiết của task tối ưu hóa giao diện.
