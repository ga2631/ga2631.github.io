# Feature: ui-optimization

## 1. End-to-End System Flow
Hệ thống UI/UX được tối ưu hóa toàn diện, tinh gọn các nút điều hướng đóng bài viết Blog (chỉ giữ lại 2 vị trí chuẩn: **Góc phải trên** và **Góc phải dưới**), chuyển đổi chế độ xem chi tiết bài viết Blog sang dạng **Popup / Modal Dialog** trượt mượt mà (không làm mất ngữ cảnh danh sách bài viết), đưa toàn bộ các section có 4 box cố định hiển thị trên cùng 1 hàng duy nhất trên màn hình Desktop, đồng thời chuẩn hóa kích thước nút hành động, sửa lỗi tràn layout và tích hợp đầy đủ các kênh kết nối nghề nghiệp trực tiếp gồm **LinkedIn** (`https://www.linkedin.com/in/tan-huynh-nhat/`) và **Zalo** (`https://zalo.me/0963684520`):

1. **Client / Blog Modal - Streamlined Close Button Layout Flow (`BlogPage.tsx` & `BlogSection.tsx`)**:
   - Loại bỏ các nút đóng dư thừa trong thanh điều hướng trên và các nút trùng lặp ở cuối bài viết.
   - **Chỉ giữ lại chính xác 2 vị trí nút đóng**:
     - **Vị trí 1 (Góc phải trên)**: Nút đóng biểu tượng tròn (**X**) `.modal-close-btn` giúp người dùng đóng nhanh bất kỳ lúc nào.
     - **Vị trí 2 (Góc phải dưới)**: Nút hành động **"Đóng bài viết / Close Article"** (`.btn .btn-secondary .btn-sm` kèm `CloseIcon`) được căn phải tuyệt đối (`justify-content: flex-end`) ở cuối bài viết.
   - Giữ lại nút tiện ích **Share / Copy Link** ở đầu bài viết để chia sẻ đường dẫn trực tiếp.

2. **Client / Blog Page - Interactive Article Modal Popup, Table of Contents & React Portal Flow (`BlogPage.tsx`, `BlogSection.tsx`, `ArticleToc.tsx`, `index.css`)**:
   - Khi người dùng click vào bất kỳ bài viết nào trong danh sách Blog hoặc xem chi tiết kiến trúc dự án:
     - Toàn bộ các Modal / Popup Dialog được chuyển sang gắn trực tiếp vào gốc `document.body` thông qua **`createPortal`** của React DOM.
     - **Tự động bóc tách Mục lục (Table of Contents - TOC)**: Component [ArticleToc.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/ArticleToc.tsx) tự động duyệt cây DOM bài viết, trích xuất tối đa **2 cấp tiêu đề** (`h1`-`h6`), sinh định danh `id` duy nhất và tiêm trực tiếp vào bài viết.
     - **Mục lục cố định bên phải (Sticky Sidebar)**: Bảng mục lục nằm ở cột bên phải (`.article-toc-sidebar`) với `position: sticky; top: 10px;`, cố định vị trí khi người đọc cuộn nội dung bài viết.
     - **Scrollspy - Tự động làm sáng mục tương ứng**: Lắng nghe sự kiện cuộn của modal, xác định tiêu đề đang đọc trong tầm nhìn và kích hoạt trạng thái sáng màu đỏ/hồng (`.article-toc-item.active`) với đường viền dẫn hướng trực quan.
     - **Điều hướng mượt mà**: Click vào bất kỳ mục nào trong TOC sẽ tự động cuộn êm (`smooth scroll`) đến đúng vị trí tiêu đề tương ứng.
     - **Giải quyết triệt để lỗi Footer đè lên nội dung bài viết**: Sử dụng React Portal giúp Modal thoát hoàn toàn khỏi Stacking Context của `.container` (`z-index: 1`), loại bỏ 100% tình trạng Footer đè lên nội dung khi cuộn.
     - **Bảo vệ Header luôn hiển thị trên cùng**: Header (`.header`) được cấu hình `z-index: 1100`, đồng thời vùng mờ `.blog-modal-backdrop` (`z-index: 1000`) được neo từ `top: var(--navbar-height)` xuống cuối màn hình (`bottom: 0`).
     - **Tinh giản thông tin bài viết (Bỏ Author)**: Loại bỏ thông tin tác giả và avatar khỏi thanh meta bài viết, tập trung vào Ngày xuất bản (`📅 Published Date`) và Thời lượng đọc (`⏱️ Read Time`).
     - Hỗ trợ đóng popup tức thời bằng: Nút góc phải trên (X), Nút góc phải dưới (Đóng bài viết), click vùng nền mờ (Backdrop), hoặc phím `Escape`.

3. **Client / Desktop 4-Box Section Single-Row Alignment Flow (`index.css`, `About.tsx`, `Skills.tsx`, `Contact.tsx`, `Hero.tsx`)**:
   - Toàn bộ 4 section có cấu trúc 4 box cố định trên trang được đồng bộ hóa hiển thị trên **1 hàng duy nhất (4 cột `repeat(4, 1fr)`)** trên màn hình Desktop (`>= 993px`):
     - **Hero Stats Banner (`.hero-stats-banner`)**: 4 chỉ số thống kê nằm trên 1 hàng.
     - **About Principles Grid (`.principles-grid`)**: 4 triết lý kỹ thuật nằm trên 1 hàng.
     - **Skills Matrix Grid (`.skills-compact-grid`)**: 4 danh mục kỹ năng nằm trên 1 hàng.
     - **Contact Cards Grid (`.contact-cards-grid`)**: 4 thẻ liên hệ nằm trên 1 hàng.
   - **Cơ chế Responsive**: Tablet hiển thị lưới 2x2 (`repeat(2, 1fr)`), Mobile xếp chồng 1 cột (`1fr`).

4. **Client / Contact Section - Action Button Sizing & Alignment Standardization Flow (`Contact.tsx` & `index.css`)**:
   - Đồng bộ hóa toàn bộ kích cỡ, chiều cao và tỷ lệ căn chỉnh cho tất cả các nút hành động và huy hiệu (`badge`) trên 4 thẻ liên hệ:
     - **Email Card (Direct Email)**: 2 nút (*Copy Email* & *Compose*) phân chia 50% - 50%, cao `40px`.
     - **Phone & Zalo Card**: 2 nút (*Call* & *Chat Zalo*) phân chia 50% - 50%, cao `40px`.
     - **Location & Birthday Card**: Huy hiệu trạng thái sẵn sàng nhận việc cao `40px`.
     - **LinkedIn Profile Card**: Nút *View Profile* chiếm 100%, cao `40px`.

5. **Client / Projects Section - Action Button Layout Protection Flow (`Projects.tsx` & `index.css`)**:
   - Khắc phục triệt để lỗi tràn viền thẻ dự án của nút **"Demo"** trên các kho mã nguồn GitHub có cấu hình `homepage`.
   - Tái cấu trúc CSS Flexbox cho `.project-actions-compact` với `width: 100%` và `.project-actions-compact .btn` chuyển sang cơ chế `flex: 1 1 0`, `min-width: 0`, `width: auto`, `padding: 0 12px`.

6. **Client / Hero Profile Card Flow (`Hero.tsx`)**:
   - Dữ liệu `linkedinUrl` và `zaloUrl` được định nghĩa tập trung trong `src/data/cvData.ts`.
   - Component [Hero.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/Hero.tsx) tự động hiển thị đầy đủ bộ 4 nút kết nối xã hội trong Profile Card bên trái: **GitHub**, **LinkedIn**, **Zalo**, và **Email**.

7. **Drawer Menu & Mobile Touchpoints (`DrawerMenu.tsx`)**:
   - Cập nhật footer của Drawer Menu trên thiết bị di động và tablet với đầy đủ 3 liên kết nhanh: **GitHub**, **LinkedIn**, và **Zalo**.

8. **Header Navigation Streamlining (`Header.tsx` & `index.css`)**:
   - Loại bỏ nút **"Save CV"** khỏi thanh Header cố định trên Desktop nhằm giữ Header gọn gàng, thanh lịch và tập trung vào các liên kết điều hướng cốt lõi cùng các nút chuyển đổi ngôn ngữ/giao diện.
   - Chức năng lưu / xuất CV dạng PDF chuẩn ATS vẫn luôn khả dụng trực tiếp thông qua **Nút nổi cố định (Floating Action Button - FAB)** ở góc phải dưới màn hình và trong **Drawer Menu** trên thiết bị di động.

9. **Print CV & ATS Compatibility (`PrintCV.tsx`)**:
   - Bản in PDF chuẩn ATS tự động tích hợp thông tin LinkedIn trong thanh liên hệ đầu trang (`💼 linkedin.com/in/tan-huynh-nhat`).
   - Chuyển đổi toàn bộ các biểu tượng liên hệ đầu trang (`📧`, `📞`, `📍`, `🐙`, `💼`, `🌐`) sang vector SVG icon chuyên dụng (`MailIcon`, `PhoneIcon`, `MapPinIcon`, `GithubIcon`, `LinkedinIcon`, `GlobeIcon`) tương thích tuyệt đối chế độ in ấn đơn sắc ATS.

10. **Vector SVG Icon Unification & Semantic Emoji Mapping (`Icons.tsx`, `Header.tsx`, `Hero.tsx`, `Projects.tsx`, `BlogSection.tsx`, `BlogPage.tsx`, `DrawerMenu.tsx`, `cvData.ts`)**:
    - Chuyển đổi toàn bộ các ký tự emoji rải rác trên toàn bộ hệ thống sang bộ biểu tượng vector SVG outline chuẩn phong cách Feather (`strokeWidth="2"`, `stroke="currentColor"`, `fill="none"`):
      - **Metadata bài viết Blog**: Thay thế `📅` và `⏱️` bằng `<CalendarIcon size={14} />` và `<ClockIcon size={14} />`.
      - **Chuyển đổi ngôn ngữ & Chuẩn hóa Quốc kỳ Việt Nam**:
        - Thay thế cờ emoji `🇻🇳` và `🇬🇧` bằng `<VietnamFlagIcon />` và `<UKFlagIcon />` định dạng SVG sắc nét, đồng bộ.
        - **Chuẩn hóa Quốc kỳ Việt Nam theo Hiến pháp & Hướng dẫn số 3420/HD-BVHTTDL**: Tỉ lệ chiều rộng bằng 2/3 chiều dài (`viewBox="0 0 900 600"`), nền đỏ tươi (`#DA251D`), tâm sao vàng (`#FFFF00`) nằm chính giữa, đỉnh trên hướng thẳng đứng, bán kính đường tròn ngoại tiếp đỉnh sao $R = \frac{1}{5} L = \frac{3}{10} W = 180$, bán kính đường tròn nội tiếp góc lõm $r = 68.75$ với 5 cánh sao thẳng góc $36^\circ$ hoàn toàn chuẩn xác.
      - **Terminal Hero Status**: Thay thế `✔` bằng `<CheckIcon size={14} />` với màu sắc emerald đồng nhất với thiết kế console.
      - **Featured Engineering Projects Modal Headers**:
        - `🎯 Project Objective` -> `<TargetIcon size={18} />` (Target / Mục tiêu).
        - `⚡ Key Engineering Challenges` -> `<ZapIcon size={18} />` (Zap / Thách thức kỹ thuật).
        - `🛠️ Full Technology Stack` -> `<ToolsIcon size={18} />` (Tools / Ngăn xếp công nghệ).
      - **Featured Engineering Projects - Semantic Key Impact Badges (`getImpactIcon`)**:
        - `⚡` (Tối ưu truy vấn / độ trễ) -> `<ZapIcon size={12} />`
        - `🔒` (Tỷ lệ khớp nối / toàn vẹn dữ liệu) -> `<LockIcon size={12} />`
        - `🚀` (Đồng bộ CDC / thời gian thực) -> `<RocketIcon size={12} />`
        - `🛡️` (Bảo mật / quyền riêng tư PII) -> `<ShieldIcon size={12} />`
        - `⏱️` (Rút ngắn thời gian tạo báo cáo) -> `<ClockIcon size={12} />`
        - `👥` (Người dùng đồng thời / quy mô chịu tải) -> `<UsersIcon size={12} />`
        - `📉` (Giảm bớt tác vụ thủ công / giảm thời gian) -> `<TrendingDownIcon size={12} />`
        - `🧩` (Kiến trúc mô-đun hóa / linh hoạt UI) -> `<PuzzleIcon size={12} />`
        - `⏳` (Tiết kiệm số giờ làm việc mỗi tuần) -> `<HourglassIcon size={12} />`
      - **Engineering Excellence & Philosophy Icons ([About.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/About.tsx))**:
        - `Architectural Resilience`: `<LayersIcon />` (Kiến trúc phân tầng mô-đun & bền bỉ).
        - `Type Safety & Clean Code`: `<CodeIcon />` (An toàn kiểu dữ liệu & mã nguồn sạch).
        - `DevOps & Automation`: `<RefreshCwIcon />` (Vòng lặp tự động hóa CI/CD & zero-downtime).
        - `Data & Performance Driven`: `<ZapIcon />` (Hiệu năng xử lý dữ liệu tốc độ cao).

---

## 2. Database & Schema Changes
- Cập nhật hợp đồng dữ liệu [src/types/index.ts](file:///Users/tanhn/Projects/ga2631.github.io/src/types/index.ts):
  - Bổ sung trường `zaloUrl?: string;` vào interface `PersonalInfo`.
- Cập nhật dữ liệu tĩnh trong [src/data/cvData.ts](file:///Users/tanhn/Projects/ga2631.github.io/src/data/cvData.ts):
  - Bổ sung `call: string;` và `zalo: string;` vào interface `UITranslation['contact']` và từ điển bản dịch EN/VI.
  - Khai báo `linkedinUrl: 'https://www.linkedin.com/in/tan-huynh-nhat/'` và `zaloUrl: 'https://zalo.me/0963684520'` vào `personalInfo` của cả `cvDataEn` và `cvDataVi`.
  - Tách bỏ hoàn toàn các ký tự emoji ra khỏi chuỗi nhãn và mảng dữ liệu (`workingTreeClean`, `objective`, `challenges`, `fullStack`, `keyImpacts`).

---

## 3. Technical Optimizations
- **Streamlined Modal Navigation UX**: Loại bỏ các nút đóng dư thừa, chỉ duy trì 2 điểm chạm đóng trực quan (góc phải trên và góc phải dưới), giảm thiểu sự lộn xộn thị giác và tăng tính chuyên nghiệp của giao diện.
- **Modal Lifecycle & Scroll Lock Management**: Sử dụng React Hooks (`useEffect`) quản lý tự động `document.body.style.overflow` và phím tắt `Escape`.
- **Single-Row 4-Column Desktop Grid Consistency**: Đồng bộ `grid-template-columns: repeat(4, 1fr)` cho tất cả các vùng chứa 4 box trên Desktop (`.hero-stats-banner`, `.principles-grid`, `.skills-compact-grid`, `.contact-cards-grid`).
- **Unified Action Element Geometry**: Thiết lập quy chuẩn kích thước hình học đồng nhất (`height: 40px`, `border-radius: var(--radius-sm)`, `box-sizing: border-box`) cho toàn bộ các nút bấm trong `.contact-card-actions`.
- **Flexbox Equal Distribution & Zero Overflow**: Tối ưu `.project-actions-compact` và `.contact-card-actions` với thuộc tính `flex: 1 1 0` và `min-width: 0`.
- **Semantic SVG Icon Mapping Engine**: Cơ chế `getImpactIcon()`, `getCategoryConfig()`, và `getPrincipleConfig()` ánh xạ chính xác 1-1 từng chỉ số kỹ thuật và triết lý với biểu tượng mang đúng ý nghĩa nguyên bản, đảm bảo 100% chuẩn nét SVG trên mọi thiết bị và hệ điều hành.

---

## 4. Impacted Files
- [src/components/Icons.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/Icons.tsx): Bổ sung các vector SVG icon `CalendarIcon`, `ClockIcon`, `GlobeIcon`, `TargetIcon`, `ZapIcon`, `ToolsIcon`, `LockIcon`, `RocketIcon`, `ShieldIcon`, `UsersIcon`, `TrendingDownIcon`, `PuzzleIcon`, `HourglassIcon`, `RefreshCwIcon`, `VietnamFlagIcon`, `UKFlagIcon`.
- [src/components/ArticleToc.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/ArticleToc.tsx): Component bóc tách mục lục tự động (tối đa 2 cấp thẻ heading) và hiển thị sidebar TOC cố định.
- [src/components/Header.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/Header.tsx): Tinh gọn thanh Header Desktop, tích hợp `VietnamFlagIcon` và `UKFlagIcon` SVG.
- [src/components/DrawerMenu.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/DrawerMenu.tsx): Tích hợp nút Zalo, SVG flags cho bộ chuyển ngôn ngữ trên mobile/tablet.
- [src/pages/BlogPage.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/pages/BlogPage.tsx): Tinh gọn nút đóng bài viết, thay thế emoji ngày/thời gian bằng vector icon.
- [src/components/BlogSection.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/BlogSection.tsx): Đồng bộ giao diện popup bài viết với nút đóng và vector icon.
- [src/styles/index.css](file:///Users/tanhn/Projects/ga2631.github.io/src/styles/index.css): Thêm animation `modalFadeIn`, cấu hình 4 box 1 hàng trên Desktop, căn chỉnh icon cho `.impact-pill`.
- [src/components/About.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/About.tsx): Cấu hình `.principles-grid` 4 cột trên Desktop và ánh xạ icon ngữ nghĩa cho từng triết lý kỹ thuật.
- [src/components/Contact.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/Contact.tsx): Chuẩn hóa cấu trúc nút bấm 50/50 đồng nhất.
- [src/components/Projects.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/Projects.tsx): Tích hợp hàm `getImpactIcon()` và render vector icons chuẩn ngữ nghĩa cho impact badges và modal headers.
- [src/components/Skills.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/Skills.tsx): Cấu hình `.principles-grid` 4 cột trên Desktop và chuẩn hóa logic nhận diện icon/màu sắc chính xác cho 4 danh mục kỹ năng.
- [src/types/index.ts](file:///Users/tanhn/Projects/ga2631.github.io/src/types/index.ts): Khai báo kiểu `zaloUrl?: string;` trong `PersonalInfo`.
- [src/data/cvData.ts](file:///Users/tanhn/Projects/ga2631.github.io/src/data/cvData.ts): Chuẩn hóa chuỗi dữ liệu, loại bỏ emoji trong translations và project impacts.
- [src/components/Hero.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/Hero.tsx): Bổ sung `CheckIcon` cho terminal status và nút liên kết Zalo.
- [src/components/PrintCV.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/PrintCV.tsx): Thay thế emoji bằng vector icon cho bản in ATS.
- [docs/features/ui-optimization.md](file:///Users/tanhn/Projects/ga2631.github.io/docs/features/ui-optimization.md): Tài liệu kỹ thuật chi tiết của task tối ưu hóa giao diện.

