---
id: "post-23"
slug: "mastering-css-sticky-grid-filter-drift-containment"
title: "Làm chủ CSS Sticky trong CSS Grid: Khắc phục Lỗi Trôi Filter Bar & Giới hạn Chiều cao Container khi Cuộn Danh sách Sâu"
summary: "Phân tích cơ chế Containing Block của CSS Sticky, giải quyết triệt để hiện tượng trôi thanh công cụ lọc khi cuộn qua hàng chục bài viết và tối ưu hóa hiệu năng render 60fps trong React."
category: "code-craftsmanship-languages"
publishedAt: "17/09/2026"
date: "2026-09-17"
readTime: "6 phút đọc"
tags:
  - "CSS Grid"
  - "React"
  - "Frontend Craftsmanship"
  - "Web Performance"
  - "UI Engineering"
---

## 1. Mô tả bài toán

Khi xây dựng giao diện Catalog hoặc trang Blog kỹ thuật với bố cục 2 cột (Left Sidebar + Right Content Area), thanh tìm kiếm và bộ lọc nhanh (Filter Controls Bar) thường được thiết kế với hiệu ứng ghim đầu trang (`position: sticky; top: 16px;`) để người dùng có thể lọc theo chuyên đề hoặc từ khóa bất cứ lúc nào.

Tuy nhiên, trong quá trình thử nghiệm thực tế với danh sách hơn 20 bài viết (chiều cao cuộn vượt trên 3,000px), một lỗi khó chịu xuất hiện: Khi người dùng cuộn tới khoảng bài viết thứ 15 trở đi, thanh Filter Bar bỗng nhiên bị trôi dần lên trên và biến mất khỏi khung nhìn (viewport) thay vì giữ vị trí cố định trên đầu trang. Mục tiêu bài viết là phân tích nguyên nhân gốc rễ về ranh giới chứa (Containing Block) của CSS Sticky và đưa ra giải pháp kiến trúc layout chuẩn xác.

## 2. Ý tưởng tiếp cận ban đầu

Cách tiếp cận ban đầu thường thấy trong các ứng dụng React:

- Đặt `.blog-controls-panel` làm phần tử anh em (sibling) cùng cấp với danh sách bài viết `.blog-grid` bên trong container cha chung `.blog-main-inner-content` (được cấu hình dạng Flexbox: `display: flex; flex-direction: column; gap: 20px;`).
- Gán CSS `position: sticky; top: 16px;` cho `.blog-controls-panel`.

**Tại sao cách này thất bại?** Theo đặc tả CSS Positioning, một phần tử `position: sticky` chỉ có thể hoạt động trong phạm vi chiều cao của _Containing Block_ (phần tử cha trực tiếp) của nó. Khi cuộn sâu xuống dưới, nếu container cha có các ràng buộc về flex alignment hoặc khi vùng nhìn cuộn chạm tới giới hạn biên dưới của container cha, phần tử sticky sẽ bị đẩy trôi theo dòng chảy tự nhiên của trang.

## 3. Tư duy tối ưu & Cấu trúc thuật toán

Để giải quyết triệt để vấn đề mà không làm phức tạp hóa mã nguồn, tôi phân tích các phương án:

- **Phương án 1 (JavaScript Scroll Listener + `position: fixed`):** Lắng nghe sự kiện scroll và gán `position: fixed` khi chạm ngưỡng. _Nhược điểm:_ Gây hiện tượng nhảy layout (Layout Shift) do phần tử bị rút khỏi DOM flow, buộc phải tính toán lại kích thước thủ công và dễ gây giật khung hình (Layout Thrashing / Reflow).
- **Phương án 2 (Đưa Filter Bar vào trong CSS Grid Container):** Di chuyển `.blog-controls-panel` vào làm phần tử con trực tiếp đầu tiên của `.blog-grid`. Vì `.blog-grid` chứa toàn bộ 20+ card bài viết nên chiều cao của nó trải dài suốt toàn bộ hành trình cuộn của người dùng.

Trong CSS Grid, các phần tử con mặc định sẽ chiếm 1 ô (cell). Do đó, bí quyết mấu chốt để thanh Filter vẫn hiển thị toàn chiều ngang (full-width banner) nằm trên tất cả các cột card là áp dụng thuộc tính: `grid-column: 1 / -1;`.

## 4. Triển khai mã nguồn & Dry Run

Triển khai giải pháp chuẩn trong JSX và SCSS:

- **Cấu trúc JSX trong BlogPage.tsx:** Đưa `.blog-controls-panel` vào làm phần tử con trực tiếp đầu tiên bên trong `.blog-grid`.
- **Cấu hình CSS Grid & Sticky:** Gán `grid-column: 1 / -1; position: sticky; top: 16px; z-index: 25;` cho `.blog-controls-panel` để bao trọn toàn bộ chiều rộng grid và ghim cố định ở đầu trang suốt hành trình cuộn.
- **Hiệu ứng chuyển đổi mượt mà:** Kết hợp `backdrop-filter: blur(16px)` và tự động kích hoạt class `.is-stuck` với hiệu ứng đổ bóng khi cuộn vượt ngưỡng 40px.

## 5. Đánh giá độ phức tạp & Ứng dụng thực tế

**Phân tích hiệu năng & Độ phức tạp:**

- **Độ phức tạp DOM:** O(1) - Không cần tạo thêm wrapper div trung gian hay logic tính toán vị trí bằng JavaScript phức tạp.
- **Hiệu năng dựng hình (Rendering Performance):** Cơ chế sticky thuần CSS được xử lý trực tiếp trên GPU Compositing Layer của trình duyệt, duy trì tốc độ khung hình **60 FPS** ổn định ngay cả khi cuộn nhanh trên màn hình di động hoặc thiết bị có cấu hình thấp.
- **Trải nghiệm người dùng (UX):** Thanh tìm kiếm và bộ lọc luôn hiển thị trong tầm mắt tại mọi vị trí cuộn, kết hợp nền mờ glassmorphism và đổ bóng khi ghim cố định giúp nội dung bên dưới cuộn qua thanh thoát và chuyên nghiệp.

**Ứng dụng mở rộng:** Mô hình `position: sticky` kết hợp `grid-column: 1 / -1` là kiến trúc mẫu mực cho các ứng dụng E-Commerce (bộ lọc sản phẩm), Bảng dữ liệu Analytics (Data Tables ghim tiêu đề cột) và các trang Dashboard quản trị hiện đại.
