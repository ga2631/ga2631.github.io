# Feature: feature-testing-scenarios

## 1. End-to-End System Flow
Quy trình kiểm thử toàn diện (End-to-End System Verification Flow) được thiết kế và chuẩn hóa nhằm bảo đảm chất lượng hoạt động, tính thẩm mỹ, độ ổn định và tính tương thích trên mọi nền tảng thiết bị:

1. **Client & Viewport Emulation Layer**:
   - Khởi tạo ma trận giả lập thiết bị đa dạng từ Mobile siêu nhỏ (320px - 375px: iPhone SE), Mobile tiêu chuẩn / cỡ lớn (390px - 430px: iPhone 14/15/16 Pro Max, Samsung Galaxy Ultra), Tablet Portrait & Landscape (768px - 1180px: iPad Mini, iPad Air, iPad Pro) cho đến Desktop/4K Display.
   - Xác thực điều hướng đa kênh: Desktop Navbar, Mobile Drawer Sidebar với backdrop click, phím `ESC`, cử chỉ chạm (Touch/Tap Target $\ge 44 \times 44\text{px}$ theo chuẩn WCAG 2.2 AA).
   - Kiểm soát tính năng cuộn mượt (Smooth Scrolling), khoá cuộn nền khi mở Modal (`body` scroll lock), và các nút hành động nổi (Floating Action Buttons - FAB).
2. **Dynamic State & Presentation Engine Flow**:
   - **Đa ngôn ngữ (VI / EN)**: Kiểm thử bộ máy chuyển đổi ngôn ngữ tức thời trên toàn bộ các thành phần (Hero, About, Timeline, Projects, Skills, Education, Contact, Blog, PrintCV) cùng khả năng lưu trữ trạng thái bền vững trong `localStorage` và thẻ `<html lang="...">`.
   - **Giao diện sáng/tối (Dark / Light Theme)**: Xác thực việc tự động phát hiện `prefers-color-scheme`, hoán đổi biến màu CSS (`data-theme`), bảo đảm độ tương phản văn bản đạt chuẩn và không gây nhấp nháy giao diện khi tải lại trang (Zero FOUC).
   - **Bảo mật thông tin liên hệ (Contact Obfuscation)**: Kiểm thử thuật toán giải mã runtime động Base64 chunked tokens, chia tách thẻ `<span>` chống bot cào dữ liệu tĩnh, đồng thời kích hoạt chính xác `mailto:` và `tel:`.
   - **Bài viết kỹ thuật & SPA Routing (`#/blog`)**: Kiểm thử bộ máy tìm kiếm thời gian thực, lọc theo danh mục, giao diện đọc bài 2 cột với mục lục động (Table of Contents - TOC) trên Desktop và chế độ đọc tối ưu trên Mobile/Tablet.
3. **Print Engine & ATS PDF Export Flow**:
   - Kiểm tra cách ly môi trường in `@media print`, triệt tiêu hoàn toàn mã CSS màn hình (`@media screen and (...)`) khi thực hiện in từ điện thoại di động hoặc máy tính bảng.
   - Bảo đảm cấu trúc CV in ấn chính xác tuyệt đối 2 trang A4 chuẩn ATS (Trang 1: Header + Summary + Skills + 3 Vị trí công việc; Trang 2: Case Studies + Education & Certifications), ngăn chặn ngắt trang mồ côi (`break-after: avoid`).
4. **DevOps & Container Verification Flow**:
   - Kiểm tra tính đúng đắn của trình biên dịch TypeScript (`npm run typecheck`).
   - Kiểm tra quá trình đóng gói production bundle của Vite (`npm run build`).
   - Kiểm tra hoạt động của Docker Compose cho môi trường phát triển (Hot Module Replacement) và Nginx Alpine cho môi trường production với cơ chế SPA fallback `try_files $uri $uri/ /index.html;`.

---

## 2. Database & Schema Changes
- **N/A** (Tác vụ tập trung vào tài liệu hóa đặc tả kiểm thử, ma trận kịch bản kiểm thử thiết bị và quy trình xác thực chất lượng toàn diện của hệ thống).

---

## 3. Technical Optimizations
- **Comprehensive Device Profile Taxonomy**: Xây dựng 10 cấu hình giả lập thiết bị chi tiết với độ phân giải CSS, tỷ lệ điểm ảnh (DPR), và user agent đại diện cho toàn bộ hệ sinh thái iOS, Android, iPadOS và Desktop.
- **Zero Horizontal Overflow Enforcement**: Đặt tiêu chuẩn kiểm tra bất biến `document.documentElement.scrollWidth <= window.innerWidth` trên tất cả các breakpoint từ 320px đến 4K.
- **Micro-Interaction & Touch Ergonomics Verification**: Đảm bảo toàn bộ các điểm chạm tương tác đạt diện tích tối thiểu $44 \times 44\text{px}$ / $48 \times 48\text{px}$, khoảng cách an toàn với thanh điều hướng cử chỉ iOS (`env(safe-area-inset-bottom)`).
- **Structured Test Case Schema**: Chuẩn hóa 16 bộ kịch bản kiểm thử (TS-01 đến TS-16) gồm: Mã kịch bản (Test ID), Cấu hình thiết bị mục tiêu (Target Profile), Điều kiện tiên quyết (Preconditions), Các bước thực hiện (Action Steps), Kết quả kỳ vọng (Expected Results), và Phương pháp kiểm chứng (Verification Method).

---

## 4. Impacted Files
- `docs/testing/test-scenarios.md`: Tài liệu đặc tả Master Test Plan & Testing Scenarios Matrix bao phủ toàn diện 16 module với 45+ kịch bản kiểm thử chi tiết và giả lập Mobile/Tablet.
- `docs/features/feature-testing-scenarios.md`: Tài liệu kỹ thuật tổng hợp quy trình kiểm thử, luồng hoạt động end-to-end, tối ưu hóa và danh sách các tệp tin liên quan theo quy chuẩn hệ thống.
