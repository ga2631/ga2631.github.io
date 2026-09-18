# Feature: mobile-print-cv

## 1. End-to-End System Flow
Quy trình tối ưu hóa và chuẩn hóa trải nghiệm in ấn/lưu PDF của CV trên mọi nền tảng (Desktop Chrome, Safari, Firefox, Mobile iOS Safari, Android Chrome):

1. **Client / Frontend Trigger Flow**:
   - Người dùng nhấn nút **Save CV** từ thanh điều hướng, Drawer menu hoặc nút hành động nổi (**Floating Action Button - FAB**).
   - Hàm `window.print()` được kích hoạt.
2. **Media Query Isolation & Rendering Flow**:
   - Trình duyệt chuyển sang ngữ cảnh in ấn `@media print`.
   - Toàn bộ các thành phần web tương tác (`.web-only`, `.app-header`, `.drawer-wrapper`, `.floating-actions-container`, `.footer`, v.v.) được ẩn hoàn toàn (`display: none !important`).
   - Thành phần dành riêng cho in ấn (`.print-cv-document`) trong [PrintCV.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/PrintCV.tsx) được kích hoạt hiển thị với khổ A4 (`size: A4 portrait; margin: 6mm 10mm;`).
   - Các media queries responsive trên giao diện web trong [_responsive.scss](file:///Users/tanhn/Projects/ga2631.github.io/src/styles/responsive/_responsive.scss) đã được giới hạn với từ khóa `@media screen and (...)`, đảm bảo hoàn toàn không bị rò rỉ (leak) sang ngữ cảnh in ấn khi người dùng thao tác trên điện thoại màn hình nhỏ (< 576px / < 768px).
3. **Strict 2-Page ATS Layout Distribution**:
   - **Trang 1 (`.print-page-1`)**:
     - Header: Họ tên ứng viên, chức danh chuyên môn, 2 dòng thông tin liên hệ và liên kết mạng xã hội/portfolio.
     - Professional Summary: Tóm tắt kinh nghiệm chuyên môn và năng lực kiến trúc.
     - Core Technical Skills: Toàn bộ 4 nhóm kỹ năng cốt lõi.
     - Professional Experience: Toàn bộ 3 vị trí công việc gần nhất với 13 gạch đầu dòng chi tiết và các công nghệ sử dụng.
     - Cưỡng chế ngắt trang sau Trang 1: `page-break-after: always !important; break-after: page !important;`.
   - **Trang 2 (`.print-page-2`)**:
     - Featured Engineering Architecture Case Studies: 3 dự án kiến trúc tiêu biểu (E-Commerce Platform, Medallion Data Platform, Customer Data Platform) kèm vai trò, công ty, mô tả, bullet points và công nghệ.
     - Education & Certifications: Bằng cấp cử nhân Sư phạm Tin học - ĐH Sư Phạm TP.HCM (kèm chi tiết nền tảng CS) và chứng chỉ Google Cloud Professional Data Engineer.
     - Bắt đầu ở đầu trang 2: `page-break-before: always !important; break-before: page !important;`.

---

## 2. Database & Schema Changes
- **N/A** (Tính năng tập trung vào tầng giao diện trình diễn CSS / SCSS và cấu trúc component in ấn [PrintCV.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/PrintCV.tsx)).

---

## 3. Technical Optimizations
- **Mobile Viewport Print Isolation**: Thêm từ khóa `screen` cho toàn bộ media queries trong [_responsive.scss](file:///Users/tanhn/Projects/ga2631.github.io/src/styles/responsive/_responsive.scss), ngăn chặn triệt để tình trạng CSS responsive của mobile ghi đè lên cấu trúc in ấn khi save PDF trên smartphone.
- **Micro-Typography & Vertical Space Optimization**:
  - Điều chỉnh `font-size: 8pt`, `line-height: 1.26` và khoảng cách bullet `margin: 1px 0 1.5px 10px` để bảo đảm Trang 1 và Trang 2 có biên độ an toàn (safety margin ~25-30%), ngay cả khi trình duyệt điện thoại tự động chèn header/footer URL/ngày tháng.
  - Bổ sung `-webkit-text-size-adjust: 100% !important` và `text-size-adjust: 100% !important` ngăn WebKit trên iOS tự động phóng to kích thước chữ khi in.
- **Orphan Heading Elimination**: Áp dụng `break-after: avoid !important; page-break-after: avoid !important;` cho `.print-section-heading` để tiêu đề mục không bao giờ bị ngắt đơn độc ở cuối trang.
- **Flex Child Auto-Sizing & Wrapping Prevention**: Bổ sung class `.print-exp-title-group` và `.print-edu-title-group` với `flex: 1 1 auto; min-width: 0` cùng `.print-exp-meta` `white-space: nowrap`, giúp tên công ty/chức danh và mốc thời gian/địa điểm không bị chèn ép gây xuống dòng lỗi.

---

## 4. Impacted Files
- `src/styles/responsive/_responsive.scss`: Bổ sung phạm vi `screen` cho toàn bộ các breakpoint `@media screen and (max-width: ...)`.
- `src/styles/print/_print.scss`: Tinh chỉnh khổ in A4 (`6mm 10mm`), typography, padding, gap, căn lề và quy tắc ngắt trang cưỡng chế 2 trang chuẩn ATS.
- `src/components/PrintCV.tsx`: Chuẩn hóa cấu trúc header phân cấp với `print-exp-title-group` và `print-edu-title-group`.
- `docs/features/mobile-print-cv.md`: Tài liệu kỹ thuật chi tiết cho giải pháp chuẩn hóa hiển thị in CV 2 trang đồng nhất giữa Mobile và Desktop.
