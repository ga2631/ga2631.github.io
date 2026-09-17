# Feature: red-color-palette

## 1. End-to-End System Flow
Hệ thống toàn bộ giao diện Portfolio, Technical Blog và bản in Executive Print CV đã được chuyển đổi toàn diện sang tông màu chủ đạo **Đỏ Ruby & Crimson** sang trọng, hiện đại:

1. **Design System Tokens & Theme Hierarchy (`index.css`)**:
   - **Dark Theme Palette (Default)**:
     - Biến màu nhấn `--text-accent`: `#ff4d6d` (Ruby Red rực rỡ, độ tương phản cao trên nền đen xám `var(--bg-primary): #0b0f19`).
     - Bảng màu bổ trợ: `--accent-red: #ff385c`, `--accent-crimson: #e11d48`, `--accent-rose: #fb7185`.
     - Dải gradient chính `--gradient-primary`: `linear-gradient(135deg, #ff385c 0%, #e11d48 50%, #991b1b 100%)`.
     - Hiệu ứng đổ bóng phát sáng `--border-color-hover: rgba(239, 68, 68, 0.45)`, `--border-glow: 0 0 20px rgba(239, 68, 68, 0.2)`.
     - Hiệu ứng ánh sáng nền ambient `body::before`: `radial-gradient(circle, rgba(239, 68, 68, 0.16) 0%, rgba(225, 29, 72, 0.1) 40%, transparent 70%)`.
     - Hiệu ứng chữ chuyển màu shimmer `.gradient-text`: `linear-gradient(135deg, #ff4d6d 0%, #ef4444 35%, #fb7185 70%, #ff4d6d 100%)`.
   - **Light Theme Palette**:
     - Biến màu nhấn `--text-accent`: `#dc2626` (Đỏ đậm Crimson bảo đảm tiêu chuẩn tương phản WCAG trên nền trắng sáng).
     - Dải gradient chính `--gradient-primary`: `linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #991b1b 100%)`.
     - Viền sáng hover `--border-color-hover: rgba(220, 38, 38, 0.4)`.

2. **Component & Interactive Elements Integration**:
   - Logo thương hiệu `TN` và thanh quét sáng trên các Glass Panel Card (`.glass-panel::before`) quét tia sáng đỏ Ruby sang trọng.
   - Nút bấm chính `.btn-primary` và Floating Action Button `.floating-btn-primary` áp dụng box shadow phát sáng đỏ (`rgba(225, 29, 72, 0.45)`).
   - Timeline kinh nghiệm nghề nghiệp: Line nối timeline và timeline dot chuyển sang dải đỏ crimson với glow ring nổi bật.
   - Ma trận kỹ năng (Skills): Điểm sáng cấp độ chuyên gia (Expert) sử dụng đỏ ruby rực sáng.
   - GitHub Cards, Tag filter, Search input và Contact Cards: Toàn bộ border focus, active pill và icons chuyển sang ánh đỏ ruby.

3. **Print CV Stylesheet Synchronization (`@media print`)**:
   - Toàn bộ tiêu đề chức danh, tên công ty kinh nghiệm, vai trò dự án và trường học trong bản in Executive Print CV chuyển từ màu xanh cũ sang **`#b91c1c` (Đỏ Burgundy/Crimson sâu lắng)**, tạo nên một bản in A4 PDF chuyên nghiệp, chuẩn phong cách executive.

4. **Brand Asset (`favicon.svg`)**:
   - Cập nhật gradient fill trong biểu tượng vector Favicon từ cyan sang đỏ ruby (`#ff385c` -> `#991b1b`).

---

## 2. Database & Schema Changes
- **Không có thay đổi database quan hệ hoặc schema backend**.
- Tinh chỉnh tập trung trong CSS design tokens và SVG brand assets.

---

## 3. Technical Optimizations
- **Tối ưu tương phản WCAG AA/AAA**: Màu đỏ trong Dark Mode (`#ff4d6d`) và Light Mode (`#dc2626`, `#b91c1c`) được chọn lựa theo tỷ lệ tương phản chuẩn, giúp văn bản sắc nét và không gây mỏi mắt cho người xem.
- **Single Source of Truth cho Design Tokens**: Mọi thành phần UI từ Header, Hero, Timeline, Project cards, Drawer Menu đến Floating Action Buttons đều kế thừa từ các CSS Variables (`--text-accent`, `--gradient-primary`, `--border-glow`), giúp hệ thống màu sắc đồng nhất tuyệt đối và dễ dàng mở rộng.

---

## 4. Impacted Files
- `src/styles/index.css`: Cập nhật toàn diện tokens, ambient glow, buttons, badges, cards, drawer, FAB và bản in print stylesheet sang hệ màu Đỏ.
- `public/favicon.svg`: Cập nhật gradient màu đỏ cho biểu tượng favicon thương hiệu.
- `docs/features/red-color-palette.md`: Tài liệu kỹ thuật chi tiết của tính năng.
