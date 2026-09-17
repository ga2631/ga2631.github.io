# Feature: mobile-tablet-navigation

## 1. End-to-End System Flow
Hệ thống điều hướng và tương tác người dùng trên thiết bị Mobile và Tablet được tái cấu trúc nhằm giải quyết triệt để lỗi rớt dòng chữ "Tan Huynh Nhat" và nâng cấp trải nghiệm người dùng với Drawer Menu trượt mượt mà kết hợp Floating Action Button (FAB):

1. **Client / Header & Brand Protection Flow (`Header.tsx` & `index.css`)**:
   - Khi render trên thiết bị di động và tablet (màn hình có viewport `< 992px`, ví dụ: 375px, 390px, 414px, 768px):
     - Các phần tử chiếm không gian lớn trên Header gồm Cụm chuyển đổi ngôn ngữ (`header-lang-group`) và Nút lưu CV (`header-save-cv-btn`) tự động ẩn khỏi Navbar.
     - Brand logo được áp dụng quy tắc `white-space: nowrap`, `flex-shrink: 0`, bảo vệ toàn diện chuỗi text `"Tan Huynh Nhat"` không bị ép rớt dòng trong bất kỳ điều kiện co giãn màn hình nào.
     - Navbar chỉ giữ lại 3 thành phần cốt lõi: Logo thương hiệu + Tên, Nút Theme Toggle nhanh, và Nút mở Drawer Menu (Hamburger Menu Button).

2. **Drawer Menu Interaction Flow (`DrawerMenu.tsx`)**:
   - Khi người dùng nhấn vào Hamburger Menu button trên Header:
     - State `mobileMenuOpen` chuyển sang `true`, kích hoạt component `DrawerMenu.tsx`.
     - Lớp phủ mờ nền (Backdrop Blur) xuất hiện với độ mờ `backdrop-filter: blur(8px)`.
     - Panel Drawer cố định trượt mượt mà từ cạnh phải màn hình sang trái (`translateX(100%)` -> `translateX(0)`) nhờ hiệu ứng cubic-bezier tối ưu.
     - Cơ chế khóa cuộn tự động gán `document.body.style.overflow = 'hidden'` để ngăn cuộn trang nền khi drawer đang mở.
     - Danh sách điều hướng hiển thị trực quan các mục (`About`, `Experience`, `Projects`, `Skills`, `Education`, `Contact`, `Blog`) kèm icons vector và hiệu ứng hover/active hiện đại.
     - Khi người dùng click vào mục **Blog (`#/blog`)** trong Drawer Menu, hàm `handleNavClick` tự động cập nhật hash `#/blog`, cuộn mượt về đầu trang và kích hoạt chuyển sang trang Blog. Ngược lại, khi đang ở Blog và click vào các mục section trang chủ (`#about`, `#projects`, ...), hệ thống chuyển hash về `#/'` và cuộn mượt đến section tương ứng.
     - Cụm điều khiển tích hợp bên trong Drawer cung cấp đầy đủ: Nút **Save CV (PDF)** kích hoạt in/xuất PDF, Bộ chọn ngôn ngữ **🇻🇳 Tiếng Việt / 🇬🇧 English**, và Nút chuyển đổi giao diện **Dark / Light Mode**.
     - Khi người dùng chọn một mục điều hướng, nhấn nút đóng (X), click vào backdrop, hoặc nhấn phím `Escape`, Drawer sẽ đóng lại ngay lập tức và chuyển trang/cuộn mượt tương ứng.

3. **Floating Action Button Flow (`FloatingActions.tsx`)**:
   - Component `FloatingActions.tsx` được định vị cố định tại góc dưới bên phải màn hình (`bottom: 24px; right: 20px; z-index: 990`).
   - Cung cấp nút thao tác nổi 1 chạm **Save CV (PDF)** với gradient phát sáng và icon tải xuống, giúp người dùng mobile/tablet dễ dàng xuất CV PDF mọi lúc mà không cần mở menu.
   - Tích hợp nút **Scroll to top (Cuộn lên đầu trang)** tự động xuất hiện khi người dùng cuộn trang xuống quá `320px`, hỗ trợ quay lại đầu trang tức thì.
   - Trong chế độ in ấn (`@media print`), toàn bộ thành phần Drawer Menu và Floating Actions đều được ẩn hoàn toàn (`display: none !important;`), đảm bảo bản in CV PDF chuẩn A4 sạch đẹp, chuẩn ATS.

---

## 2. Database & Schema Changes
- **Không có thay đổi database quan hệ hoặc migration schema backend**.
- Toàn bộ giao diện sử dụng các hợp đồng dữ liệu tĩnh TypeScript đã định nghĩa (`UITranslation`, `NavItem`) và quản lý state tương thích với React 19.

---

## 3. Technical Optimizations
- **CSS Hardware Acceleration & Transitions**: Drawer panel sử dụng `transform: translateX(...)` kết hợp `will-change: transform` và cubic-bezier curve (`0.16, 1, 0.3, 1`) giúp animation đạt 60fps mượt mà trên cả các thiết bị cấu hình thấp.
- **Scroll Lock & Memory Cleanup**: Sử dụng React `useEffect` quản lý khóa cuộn trang nền và lắng nghe sự kiện phím `Escape`, tự động gỡ bỏ event listeners và khôi phục `body.overflow` khi component unmount, chống rò rỉ bộ nhớ.
- **Zero Layout Shift (CLS Optimization)**: Cố định kích thước `min-width: max-content` và `white-space: nowrap` cho logo header, ngăn hiện tượng layout shifting hoặc giật cục khi tải font/chuyển đổi viewport.
- **Dedicated Print Stylesheet Protection**: Thêm toàn bộ các class của Drawer (`.drawer-wrapper`, `.drawer-backdrop`, `.drawer-panel`) và Floating Actions (`.floating-actions-container`, `.floating-btn`) vào danh sách ẩn bắt buộc trong `@media print`.

---

## 4. Impacted Files
- `src/components/Icons.tsx`: Bổ sung các SVG Icon vector nhẹ: `UserIcon`, `ChevronRightIcon`, `ArrowUpIcon`.
- `src/components/DrawerMenu.tsx`: Tạo mới component Drawer Menu chuyên dụng cho Mobile & Tablet trượt từ bên phải kèm backdrop blur và bộ tùy chọn đầy đủ.
- `src/components/FloatingActions.tsx`: Tạo mới component Floating Action Button (FAB) góc dưới màn hình hỗ trợ Save CV và Back-to-top.
- `src/components/Header.tsx`: Cập nhật cấu trúc Header, bảo vệ logo không rớt dòng, ẩn các nút chiếm diện tích khi ở mobile/tablet, tích hợp kích hoạt DrawerMenu.
- `src/App.tsx`: Tích hợp và mount `FloatingActions` trong vùng hiển thị web-only.
- `src/styles/index.css`: Bổ sung styles hoàn chỉnh cho Drawer Menu, Floating Actions (FAB), tinh chỉnh responsive breakpoints cho Header trên Mobile/Tablet (`<= 992px`, `<= 768px`, `<= 576px`) và đảm bảo tương thích bản in `@media print`.
- `docs/features/mobile-tablet-navigation.md`: Tài liệu kỹ thuật chi tiết của tính năng.
