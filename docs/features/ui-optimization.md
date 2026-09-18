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

11. **Hero Profile Card Desktop 1/3 Space & Mobile/Tablet Optimization (`Hero.tsx` & `index.css`)**:
    - **Tỷ lệ hiển thị Desktop 1/3 không gian (1fr 2fr Desktop Grid Ratio)**:
      - Cấu hình lưới `.hero-grid` trên Desktop (`> 992px`) chuyển sang tỉ lệ vàng `grid-template-columns: 1fr 2fr;` với khoảng cách `gap: 48px;`.
      - Profile Card bên trái (`.avatar-card`) chiếm chính xác **1/3 (33.3%)** chiều ngang không gian hiển thị, tạo cảm giác bề thế, đĩnh đạc và cân đối tuyệt đối với khối nội dung giới thiệu 2/3 (66.7%) bên phải.
    - **Tối ưu hóa độ rộng Profile Card trên Mobile/Tablet**:
      - Mở rộng giới hạn chiều dài/chiều ngang của Profile Card (`.avatar-card`) trên màn hình Tablet (`@media (max-width: 992px)`) lên `max-width: 540px` với padding `32px 28px`, và trên màn hình Mobile (`@media (max-width: 576px)`) lên `max-width: 100%` với padding `24px 18px`.
      - Giúp khối Profile Card trở nên cân đối, đầy đặn, không bị co hẹp hoặc ép dòng thông tin trong console status box.
    - **Cơ chế hiển thị thích ứng cho huy hiệu "Open to work" (Adaptive Status Pill)**:
      - **Desktop (`> 992px`)**: Huy hiệu trạng thái (`.desktop-only-status`) duy trì ở vị trí mặc định ban đầu tại cột giới thiệu bên phải, nằm ngay trên tiêu đề chào mừng (`hero-name`).
      - **Mobile / Tablet (`<= 992px`)**: Huy hiệu trạng thái (`.mobile-only-status`) tự động chuyển vào nằm trực tiếp **dưới tên lập trình viên** (`.avatar-name`) trong Profile Card bên trái, trong khi ẩn pill ở cột giới thiệu bên dưới để tránh trùng lặp.
      - Sử dụng CSS Media Queries chuyên dụng (`.desktop-only-status` và `.mobile-only-status`) đảm bảo chuyển đổi mượt mà, chính xác theo từng breakpoint mà không gây giật layout hay phát sinh DOM dư thừa.

12. **Experience Section - Company Link Streamlining & Top-Right Period Alignment (`Experience.tsx` & `index.css`)**:
    - **Cố định thời gian làm việc ở góc phải trên (Top-Right Period Alignment)**:
      - Tái cấu trúc vùng tiêu đề thẻ kinh nghiệm bằng hàng chứa `.timeline-title-row` phân bổ theo Flexbox (`justify-content: space-between; align-items: flex-start; gap: 16px;`).
      - Đảm bảo khoảng thời gian làm việc (`.timeline-period-wrapper` / `.timeline-period`) luôn được cố định ở **góc phải trên, nằm ngang hàng trực tiếp với Chức danh công việc (Job title / `.timeline-role`)** trên mọi độ phân giải (Desktop, Tablet, và Mobile).
      - Xóa bỏ hành vi ép `flex-direction: column` ở breakpoint 768px để tránh làm rớt thời gian làm việc xuống dưới công ty.
13. **Card Box Hover Effects & Primary Accent Title Color Transition (`index.css` & `EducationCertifications.tsx`)**:
    - **Tối ưu hóa hiệu ứng hover toàn diện trên các Box / Card**:
      - Khi người dùng rê chuột (hover) vào bất kỳ thẻ nội dung nào trên toàn bộ trang web, tiêu đề chính của thẻ sẽ tự động chuyển mượt mà sang **màu chủ đạo** (`var(--text-accent)` - đỏ ruby `#ff4d6d` ở Dark theme, đỏ crimson `#dc2626` ở Light theme) kết hợp hiệu ứng chuyển động mượt (`transition: color var(--transition-fast)`).
      - Đồng thời toàn bộ thẻ được nâng nhẹ độ cao (`transform: translateY(-3px)` hoặc `-4px`), viền thẻ sáng nhẹ (`border-color: var(--border-color-hover)`) kèm bóng hào quang màu đỏ (`box-shadow: var(--border-glow)`).
    - **Danh mục các box được áp dụng**:
      - **Hero Stats Banner Cards**: `.hero-stat-card:hover .hero-stat-label`
      - **Profile Card**: `.avatar-card:hover .avatar-name`
      - **About Principles Cards**: `.principle-card:hover .principle-card-title`
      - **Experience Timeline Cards**: `.timeline-card:hover .timeline-role`
      - **Enterprise Project Cards**: `.project-card-compact:hover .project-card-title`
      - **GitHub Repository Cards**: `.github-repo-card:hover .repo-link-title`, `.github-repo-card:hover .project-card-title`
      - **Skill Category Cards**: `.skill-card-compact:hover .skill-card-title`
      - **Academic Background Cards**: `.edu-card:hover .edu-degree`
      - **Certification Cards**: `.cert-card:hover .cert-title`, `.cert-card:hover h4`
      - **Contact Cards**: `.contact-card:hover .contact-card-value`, `.contact-card:hover .contact-card-label`
14. **Exact Clockwise Sequential Drawing Border: Top (3px default) -> Right -> Bottom -> Left -> Full 1px & Reversible Un-Hover (`index.css`)**:
    - **Khắc phục triệt để lỗi mất viền ở góc bo (Native Curved Corner Preservation)**:
      - Sử dụng đường viền CSS thực (`border-top`, `border-right`, `border-bottom`, `border-left`) kết hợp `border-radius: inherit` kế thừa chính xác bán kính cong `18px` (`--radius-lg`) của card.
      - Loại bỏ cách dùng gradient thẳng để tránh hiện tượng đường thẳng bị `overflow: hidden` cắt cụt tại 4 góc bo.
    - **Trạng thái ban đầu (Default state)**:
      - Cạnh Trên (Top Border) hiển thị sẵn với độ dày **3px** nổi bật cùng 2 góc bo trên uốn lượn mượt mà (`border-top: 3px solid var(--accent-red)` trên `::before` với vùng cắt `clip-path: polygon(-2px -2px, calc(100% + 2px) -2px, calc(100% + 2px) calc(var(--radius-lg) + 2px), -2px calc(var(--radius-lg) + 2px))`).
      - Các cạnh còn lại (Right, Bottom, Left) được ẩn với `width: 0`, `height: 0` và `clip-path`.
    - **Cơ chế chạy viền chiều kim đồng hồ khi Hover (0s -> 0.56s)**:
      - **Pha 1 (0.00s -> 0.14s)**: Cạnh Trên (**Top**) thu nhỏ độ dày từ 3px về **1px** (`border-top-width: 1px`).
      - **Pha 2 (0.14s -> 0.28s)**: Cạnh Phải (**Right**) mở rộng thẳng **từ trên xuống dưới**, uốn cong hoàn hảo qua góc bo dưới-phải (`clip-path` mở rộng xuống đáy).
      - **Pha 3 (0.28s -> 0.42s)**: Cạnh Dưới (**Bottom**) mở rộng ngang **từ phải sang trái** (`width: 0 -> 100%`), uốn cong mượt mà qua góc bo dưới-trái.
      - **Pha 4 (0.42s -> 0.56s)**: Cạnh Trái (**Left**) mở rộng thẳng **từ dưới lên trên** (`height: 0 -> 100%`), kết nối hoàn hảo vào góc bo trên-trái.
      - **Hoàn tất (0.56s)**: Toàn bộ 4 cạnh và 4 góc bo 18px liền mạch với độ dày đồng nhất **1px** bao quanh box.
    - **Cơ chế thu viền ngược chiều kim đồng hồ đối xứng khi rời chuột (Un-hover: 0s -> 0.56s)**:
      - Khi rời chuột (mouse leave), hiệu ứng tự động **chạy ngược lại 100%** theo thứ tự đối xứng hoàn hảo:
        - **Pha 1 (0.00s -> 0.14s)**: Cạnh Trái (**Left**) thu ngược **từ trên xuống dưới** (`height: 100% -> 0`).
        - **Pha 2 (0.14s -> 0.28s)**: Cạnh Dưới (**Bottom**) thu ngược **từ trái sang phải** (`width: 100% -> 0`).
        - **Pha 3 (0.28s -> 0.42s)**: Cạnh Phải (**Right**) thu ngược **từ dưới lên trên** (`clip-path` thu về góc bo trên).
        - **Pha 4 (0.42s -> 0.56s)**: Cạnh Trên (**Top**) dày dần trở lại từ 1px về **3px** ban đầu (`border-top-width: 1px -> 3px`).

15. **Profile Card Continuous Dual-Symmetric Rotating Border Effect (`index.css`)**:
    - **Cơ chế xoay vòng liên tục không ngừng (Infinite Continuous Rotation)**:
      - Khác với các card thông thường kích hoạt khi hover, Profile Card (`.avatar-card`) sở hữu hiệu ứng viền phát sáng chạy vòng quanh tuần hoàn liên tục (`animation: rotateProfileDualBorder 5s linear infinite`).
    - **Cấu trúc tia sáng xuất phát từ 2 góc đối xứng (Dual-Symmetric Beam Structure)**:
      - Điểm sáng xuất phát đồng thời từ **2 góc đối xứng 180°** (0° và 180°) với sắc đỏ chủ đạo rực rỡ (`var(--accent-red)`).
      - Độ sáng lan tỏa và **mờ dần (fade-out)** mềm mại về 2 góc cạnh kề (90° và 270°) thành dải trong suốt (`transparent`), tạo thành hiệu ứng 2 tia sáng đối xứng đuổi nhau tuần hoàn quanh thân card.
    - **Quy chuẩn độ dày viền 1.5px (Exact 1.5px Border Thickness Boundary)**:
      - Sử dụng kỹ thuật CSS Mask (`-webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); mask-composite: exclude;`) với `padding: 1.5px` và `border-radius: inherit`.
      - Khóa chặt độ dày viền chính xác ở mức **1.5px**, ôm sát hoàn hảo mọi đường cong bo góc `18px` của Profile Card kết hợp hào quang tỏa nhẹ (`filter: drop-shadow(0 0 4px rgba(239, 68, 68, 0.45))`).

16. **Anti-Scraping Phone Number & Sensitive Contact Protection (`obfuscation.tsx`, `Contact.tsx`, `Hero.tsx`, `DrawerMenu.tsx`, `PrintCV.tsx`, `cvData.ts`, `en/cv.json`, `vi/cv.json`)**:
    - **Bảo vệ chống công cụ quét số điện thoại & Email tự động (Bot & Crawler Defense)**:
      - Loại bỏ hoàn toàn các chuỗi email (`email`), số điện thoại (`phone`) và đường dẫn liên hệ Zalo (`zaloUrl`) dạng văn bản thuần khỏi cả mã nguồn tĩnh, file JSON dữ liệu (`src/data/locales/en/cv.json`, `src/data/locales/vi/cv.json`), bundle JavaScript tĩnh và các thuộc tính DOM tĩnh (`title`, `href="mailto:..."`, `href="tel:..."`, `href="https://zalo.me/..."`).
      - Dữ liệu trong các file JSON được mã hóa Base64 và giải mã an toàn ở runtime thông qua hàm `decodeBase64Safe()`.
      - Kết hợp kỹ thuật render phân tách (`split tokens`), bidi-override honeypot và sự kiện động để bảo vệ 100% dữ liệu liên lạc cá nhân.
14. **Brand Logo Streamlining (`Header.tsx`, `DrawerMenu.tsx`, `Hero.tsx`, `favicon.svg`)**:
    - Chuyển đổi toàn bộ biểu tượng logo thương hiệu viết tắt từ `TN` sang chữ cái đơn `T` tinh gọn, hiện đại và tạo điểm nhấn thị giác sắc nét hơn.
    - Cập nhật đồng bộ trên [Header.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/Header.tsx), [DrawerMenu.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/DrawerMenu.tsx), ảnh đại diện fallback [Hero.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/Hero.tsx) và file vector favicon [public/favicon.svg](file:///Users/tanhn/Projects/ga2631.github.io/public/favicon.svg).

18. **Data-Driven Architecture & Comprehensive UI Localization Audit (`cvData.ts`, `DrawerMenu.tsx`, `Header.tsx`, `Projects.tsx`, `Experience.tsx`, `EducationCertifications.tsx`, `FloatingActions.tsx`, `Footer.tsx`, `PrintCV.tsx`, `ArticleToc.tsx`, `BlogSection.tsx`, `BlogPage.tsx`, `App.tsx`)**:
    - **Triệt tiêu 100% chuỗi tĩnh và điều kiện ngôn ngữ phân tán (Zero Hardcoded Strings)**:
      - Rà soát toàn bộ các component và view trong repository.
      - Mở rộng hợp đồng dữ liệu `UITranslation` trong [src/data/cvData.ts](file:///Users/tanhn/Projects/ga2631.github.io/src/data/cvData.ts) bổ sung đầy đủ các danh mục con: `common`, `drawer`, `printCv`, cùng các nhãn `currentPosition`, `featuredProject`, `team`, `credentialId`, `article`, `showingArticles`, `resetFilters`, `allRightsReserved`.
    - **DrawerMenu Dynamic Integration ([DrawerMenu.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/DrawerMenu.tsx))**:
      - Nhận đầy đủ các props từ dữ liệu thật: `personalInfo`, `tNav`, `tDrawer`, `tCommon`.
      - Toàn bộ tên lập trình viên, chức danh, tiêu đề các phân đoạn (`NAVIGATION`, `PREFERENCES & ACTIONS`), nhãn ngôn ngữ (`Language:`), chế độ giao diện (`Theme Mode:`), các nút chuyển đổi sáng/tối (`Switch to Light/Dark Mode`), huy hiệu bài viết (`Articles`), thông tin bản quyền và liên kết mạng xã hội được nạp tự động từ `cvData.ts` tương ứng theo ngôn ngữ được chọn.
    - **Đồng bộ hóa toàn bộ các component còn lại**:
      - [Projects.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/Projects.tsx): Chuyển `+N more`, `Featured Project`, `Team:` sang `tCommon.more`, `t.featuredProject`, `t.team`.
      - [Experience.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/Experience.tsx): Chuyển nhãn vị trí hiện tại sang `t.currentPosition`.
      - [EducationCertifications.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/EducationCertifications.tsx): Chuyển `Credential ID:` sang `t.credentialId`.
      - [FloatingActions.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/FloatingActions.tsx): Chuyển tooltip cuộn trang và xuất PDF sang `tCommon.scrollToTop`, `tCommon.exportPdf`.
      - [Footer.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/Footer.tsx): Nạp `fullName` và `t.allRightsReserved`.
      - [PrintCV.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/PrintCV.tsx): Chuyển toàn bộ tiêu đề mục in và đoạn mô tả bổ sung sang nạp trực tiếp từ `t: UITranslation['printCv']`.
      - [ArticleToc.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/ArticleToc.tsx), [BlogSection.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/BlogSection.tsx), [BlogPage.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/pages/BlogPage.tsx): Tự động nạp `tCommon.tableOfContents`, `tCommon.copiedLink`, `tCommon.shareLink`, `tCommon.overview`, `t.showingArticles`, `t.article`, `t.resetFilters`.

18. **JSON-Based Modular Localization & Data Decoupling (`src/data/locales/`)**:
    - **Tách biệt hoàn toàn dữ liệu tĩnh sang file JSON theo ngôn ngữ**:
      - Chuyển đổi toàn bộ từ điển giao diện, dữ liệu hồ sơ năng lực và bài viết blog từ mã TypeScript tĩnh sang cấu trúc JSON thuần túy:
        - `src/data/locales/en/ui.json` & `src/data/locales/vi/ui.json`: Quản lý toàn bộ nhãn giao diện, nút điều hướng, drawer menu, modal controls, tiêu đề in ATS.
        - `src/data/locales/en/cv.json` & `src/data/locales/vi/cv.json`: Quản lý toàn bộ thông tin cá nhân, kinh nghiệm làm việc, dự án tiêu biểu, kỹ năng, học vấn và chứng chỉ.
        - `src/data/locales/en/blog.json` & `src/data/locales/vi/blog.json`: Quản lý danh sách các bài viết kỹ thuật chuyên sâu và nội dung HTML.
    - **Mở rộng đa ngôn ngữ trong tương lai (Future-Proof Scalability)**:
      - Khi cần bổ sung ngôn ngữ mới (ví dụ `ja`, `fr`, `de`), chỉ cần tạo thư mục `src/data/locales/{lang}/` với bộ 3 file `ui.json`, `cv.json`, `blog.json` mà không cần sửa đổi bất kỳ logic giao diện hay component JSX nào.
    - **TypeScript Data Loader & Runtime Security Injection**:
      - [cvData.ts](file:///Users/tanhn/Projects/ga2631.github.io/src/data/cvData.ts) và [blogData.ts](file:///Users/tanhn/Projects/ga2631.github.io/src/data/blogData.ts) đóng vai trò Loader tầng dữ liệu có kiểm tra kiểu chặt chẽ (`Type Guard`), đồng thời tự động tiêm các token bảo mật chống bot crawler `getSecureEmail()`, `getSecurePhone()`, `getSecureZaloUrl()` vào `personalInfo`.

19. **Standardized 5-Section Enterprise Project Case Study Architecture & Metric Highlighting (`Projects.tsx`, `Experience.tsx`, `PrintCV.tsx`, `types/index.ts`, `cvData.ts`, `en/cv.json`, `vi/cv.json`)**:
    - Chuẩn hóa cấu trúc mô tả chi tiết của toàn bộ các dự án kiến trúc tiêu biểu thành **5 thành phần chuyên sâu và chuyên nghiệp**:
      1. **Project Objective (Mục tiêu Dự án)**: Trình bày bài toán kinh doanh và mục tiêu kỹ thuật cốt lõi cần giải quyết.
      2. **Key Responsibilities & Strengths (Trách nhiệm chính & Thế mạnh cốt lõi)**: Mô tả vai trò kỹ thuật chuyên sâu, lãnh đạo kiến trúc, thiết kế tầng dịch vụ và thế mạnh chuyên môn.
      3. **Challenges & Solutions (Thách thức Kỹ thuật & Giải pháp Thực thi)**: Cấu trúc từng cặp Thách thức (`Challenge`) và Giải pháp kỹ thuật (`Solution`) với thiết kế trực quan nổi bật.
      4. **Key Achievements & Metrics (Thành tựu & Kết quả định lượng)**: Làm nổi bật các chỉ số đo lường hiệu năng (`96% reconciliation rate`, `zero data loss`, `>70% latency reduction`, `1,000+ CCU`, `63% report time`, `10-12 hours/week saved`) bằng thẻ `<b>` và cơ chế render HTML an toàn `dangerouslySetInnerHTML`.
      5. **Technology Stack (Hệ sinh thái Công nghệ & Ngăn xếp)**: Bộ thẻ tag công nghệ, công cụ và nền tảng hạ tầng thực tế được áp dụng.

---

## 2. Database & Schema Changes
- Cập nhật hợp đồng dữ liệu [src/types/index.ts](file:///Users/tanhn/Projects/ga2631.github.io/src/types/index.ts):
  - Bổ sung trường `zaloUrl?: string;` vào interface `PersonalInfo`.
  - Mở rộng interface `ProjectItem` với các trường cấu trúc chuẩn hóa: `responsibilities?: string[];`, `challengesSolutions?: { challenge: string; solution: string }[];`, `achievements?: string[];`.
  - Loại bỏ trường không còn sử dụng `companyUrl?: string;` khỏi interface `ExperienceItem`.
- Cập nhật từ điển dịch thuật [src/data/cvData.ts](file:///Users/tanhn/Projects/ga2631.github.io/src/data/cvData.ts):
  - Bổ sung các nhãn 5 thành phần dự án: `responsibilities`, `challengesSolutions`, `achievements`, `techStack`, `challengeLabel`, `solutionLabel`.
- Cập nhật dữ liệu tĩnh trong [src/data/cvData.ts](file:///Users/tanhn/Projects/ga2631.github.io/src/data/cvData.ts) & [src/data/locales/](file:///Users/tanhn/Projects/ga2631.github.io/src/data/locales/):
  - Khởi tạo cấu trúc lưu trữ localization dạng JSON độc lập cho từng ngôn ngữ:
    - [src/data/locales/en/ui.json](file:///Users/tanhn/Projects/ga2631.github.io/src/data/locales/en/ui.json) & [src/data/locales/vi/ui.json](file:///Users/tanhn/Projects/ga2631.github.io/src/data/locales/vi/ui.json)
    - [src/data/locales/en/cv.json](file:///Users/tanhn/Projects/ga2631.github.io/src/data/locales/en/cv.json) & [src/data/locales/vi/cv.json](file:///Users/tanhn/Projects/ga2631.github.io/src/data/locales/vi/cv.json)
    - [src/data/locales/en/blog.json](file:///Users/tanhn/Projects/ga2631.github.io/src/data/locales/en/blog.json) & [src/data/locales/vi/blog.json](file:///Users/tanhn/Projects/ga2631.github.io/src/data/locales/vi/blog.json)
  - Tích hợp các hàm giải mã động `getSecureEmail()`, `getSecurePhone()`, và `getSecureZaloUrl()` thay thế chuỗi tĩnh cho `email`, `phone`, và `zaloUrl` trong `personalInfo` của cả `cvDataEn` và `cvDataVi`.
  - Tách bỏ hoàn toàn các ký tự emoji ra khỏi chuỗi nhãn và mảng dữ liệu (`workingTreeClean`, `objective`, `challenges`, `fullStack`, `keyImpacts`).

---

## 3. Technical Optimizations
- **JSON-Based Modular Localization Engine**: Tách rời toàn bộ nội dung tĩnh ra các file JSON theo từng ngôn ngữ trong `src/data/locales/`, đảm bảo khả năng mở rộng thêm ngôn ngữ mới mà không làm phình to mã nguồn TypeScript.
- **Data-Driven Architecture & Localization Engine**: Centralized 100% UI texts and metadata with strict TypeScript contracts (`UITranslation`), ensuring complete separation of concerns and eliminating inline ternary language switches across JSX templates.
- **Streamlined Modal Navigation UX**: Loại bỏ các nút đóng dư thừa, chỉ duy trì 2 điểm chạm đóng trực quan (góc phải trên và góc phải dưới), giảm thiểu sự lộn xộn thị giác và tăng tính chuyên nghiệp của giao diện.
- **Modal Lifecycle & Scroll Lock Management**: Sử dụng React Hooks (`useEffect`) quản lý tự động `document.body.style.overflow` và phím tắt `Escape`.
- **Single-Row 4-Column Desktop Grid Consistency**: Đồng bộ `grid-template-columns: repeat(4, 1fr)` cho tất cả các vùng chứa 4 box trên Desktop (`.hero-stats-banner`, `.principles-grid`, `.skills-compact-grid`, `.contact-cards-grid`).
- **Unified Action Element Geometry**: Thiết lập quy chuẩn kích thước hình học đồng nhất (`height: 40px` - `42px`, `border-radius: var(--radius-md)`, `box-sizing: border-box`) cho toàn bộ các nút bấm trong `.contact-card-actions` và Drawer Menu (`.drawer-cv-btn`, `.drawer-lang-pill`, `.drawer-theme-toggle-btn`, `.drawer-social-btn`).
- **Unified Project Badge & Tag Geometry**: Đồng bộ hóa 100% hình học, kích thước, hiệu ứng hover và cơ chế hiển thị `+N more` giữa GitHub Repositories và Enterprise Case Studies, loại bỏ sự phân mảnh về phong cách tag trong phần Projects.
- **Clockwise Sequential Border Animation Preservation**: Chuẩn hóa lớp hover của `.github-repo-card` kế thừa trực tiếp từ `.glass-panel`, loại bỏ `border-color` tĩnh giúp khôi phục hiệu ứng viền chạy theo chiều kim đồng hồ mượt mà.
- **Flexbox Equal Distribution & Zero Overflow**: Tối ưu `.project-actions-compact` và `.contact-card-actions` với thuộc tính `flex: 1 1 0` và `min-width: 0`.
- **Semantic SVG Icon Mapping Engine**: Cơ chế `getImpactIcon()`, `getCategoryConfig()`, và `getPrincipleConfig()` ánh xạ chính xác 1-1 từng chỉ số kỹ thuật và triết lý với biểu tượng mang đúng ý nghĩa nguyên bản, đảm bảo 100% chuẩn nét SVG trên mọi thiết bị và hệ điều hành.
- **Responsive Profile Card Geometric Balancing**: Tối ưu tỷ lệ co giãn của Profile Card trên Tablet (`max-width: 540px`) và Mobile (`max-width: 100%`), kết hợp chuyển đổi pill trạng thái nhận việc dưới tên cá nhân giúp trải nghiệm xem CV trên thiết bị cầm tay đạt độ hoàn thiện cao nhất.
- **Timeline Top-Right Geometric Alignment**: Tái lập cấu trúc Flexbox hai tầng cho Timeline Header (`.timeline-title-row` và `.timeline-company`) giúp khóa chặt thời gian làm việc ở góc phải trên ngang hàng với chức danh trên mọi màn hình.
- **Micro-Interaction & Hover State Harmonization**: Chuẩn hóa chuyển đổi trạng thái màu chữ tiêu đề (`transition: color var(--transition-fast)`) sang màu nhấn chính `var(--text-accent)` trên toàn bộ hệ thống thẻ/card, tăng độ phản hồi thị giác (visual feedback) và tính tương tác cao cấp cho trang web.
- **Native Curved Corner Preserving Clockwise Sequential Border Engine**: Áp dụng hệ thống CSS Keyframes với `clip-path: polygon()` điều khiển tuần tự 4 pha chạy viền trên các phần tử sở hữu đường viền CSS thực sự (`border-top`, `border-right`, `border-bottom`, `border-left`) và `border-radius: inherit`, đảm bảo 4 góc bo cong 18px luôn mềm mại, không bị đứt đoạn hay cắt khuyết góc.
- **Dual-Symmetric Continuous Rotating Border Mask Engine**: Áp dụng CSS `@property --profile-border-angle` kết hợp `conic-gradient` đối xứng 2 đầu cực và `mask-composite: exclude` tạo hiệu ứng 2 luồng sáng viền 1.5px chạy tuần hoàn bất tận quanh Profile Card với hiệu năng phần cứng 60fps.
- **Client-Side Runtime Anti-Scraping Token Obfuscation**: Hệ thống bảo mật thông tin liên hệ đa tầng kết hợp giải mã động phân mảnh token Base64 ở client-side, thẻ con phân tách (`split tokens`), CSS bidi-override honeypot và bộ xử lý sự kiện động, chặn 100% các công cụ regex crawler mà vẫn giữ trải nghiệm xem số/email và click gọi/gửi thư mượt mà cho người dùng thật.

---

## 4. Impacted Files
- [public/favicon.svg](file:///Users/tanhn/Projects/ga2631.github.io/public/favicon.svg): Cập nhật logo chữ cái `T` trên favicon trình duyệt.
- [src/data/locales/en/ui.json](file:///Users/tanhn/Projects/ga2631.github.io/src/data/locales/en/ui.json): File JSON từ điển UI tiếng Anh.
- [src/data/locales/en/cv.json](file:///Users/tanhn/Projects/ga2631.github.io/src/data/locales/en/cv.json): File JSON hồ sơ CV tiếng Anh.
- [src/data/locales/en/blog.json](file:///Users/tanhn/Projects/ga2631.github.io/src/data/locales/en/blog.json): File JSON bài viết blog tiếng Anh.
- [src/data/locales/vi/ui.json](file:///Users/tanhn/Projects/ga2631.github.io/src/data/locales/vi/ui.json): File JSON từ điển UI tiếng Việt.
- [src/data/locales/vi/cv.json](file:///Users/tanhn/Projects/ga2631.github.io/src/data/locales/vi/cv.json): File JSON hồ sơ CV tiếng Việt.
- [src/data/locales/vi/blog.json](file:///Users/tanhn/Projects/ga2631.github.io/src/data/locales/vi/blog.json): File JSON bài viết blog tiếng Việt.
- [src/data/cvData.ts](file:///Users/tanhn/Projects/ga2631.github.io/src/data/cvData.ts): Data loader nạp `ui.json` và `cv.json` theo ngôn ngữ và inject obfuscation.
- [src/data/blogData.ts](file:///Users/tanhn/Projects/ga2631.github.io/src/data/blogData.ts): Data loader nạp `blog.json` theo ngôn ngữ.
- [src/utils/obfuscation.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/utils/obfuscation.tsx): Bộ tiện ích bảo mật thông tin liên hệ và các components `<SecureEmail />`, `<SecurePhone />` chống scraping tự động.
- [src/components/Icons.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/Icons.tsx): Bổ sung các vector SVG icon `CalendarIcon`, `ClockIcon`, `GlobeIcon`, `TargetIcon`, `ZapIcon`, `ToolsIcon`, `LockIcon`, `RocketIcon`, `ShieldIcon`, `UsersIcon`, `TrendingDownIcon`, `PuzzleIcon`, `HourglassIcon`, `RefreshCwIcon`, `VietnamFlagIcon`, `UKFlagIcon`.
- [src/components/ArticleToc.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/ArticleToc.tsx): Component bóc tách mục lục tự động và hiển thị sidebar TOC với tiêu đề động `tocTitle`.
- [src/components/Header.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/Header.tsx): Nạp `personalInfo` và `t: UITranslation`, cập nhật logo `T` và tên thương hiệu động.
- [src/components/DrawerMenu.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/DrawerMenu.tsx): Nạp dữ liệu động 100% từ `personalInfo`, `tNav`, `tDrawer`, `tCommon`.
- [src/pages/BlogPage.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/pages/BlogPage.tsx): Nạp dữ liệu động cho breadcrumb, nhãn kết quả bài viết, nút reset và modal actions.
- [src/components/BlogSection.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/BlogSection.tsx): Chuyển đổi TOC title sang nạp động từ `tCommon`.
- [src/styles/index.css](file:///Users/tanhn/Projects/ga2631.github.io/src/styles/index.css): Thêm animation `modalFadeIn`, cấu hình 4 box 1 hàng trên Desktop, căn chỉnh icon cho `.impact-pill`, mở rộng kích thước Profile Card và pill trạng thái trên mobile/tablet, cấu hình `.timeline-title-row` và `.timeline-company` hỗ trợ căn lề thời gian làm việc góc phải trên, cấu hình hiệu ứng hover chuyển màu tiêu đề sang màu chủ đạo, cấu hình border top mặc định và hiệu ứng chạy viền xung quanh toàn bộ khung cho các thẻ, cấu hình viền xoay liên tục đối xứng 1.5px cho Profile Card, bổ sung `.badge-purple`, `.badge:hover` và đồng bộ giao diện tag, phục hồi hiệu ứng viền clockwise cho GitHub cards.
- [src/components/About.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/About.tsx): Cấu hình `.principles-grid` 4 cột trên Desktop và ánh xạ icon ngữ nghĩa cho từng triết lý kỹ thuật.
- [src/components/Contact.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/Contact.tsx): Tích hợp `<SecureEmail />`, `<SecurePhone />` và bộ kích hoạt mở email / gọi điện / chat Zalo bảo mật chống scraping.
- [src/components/Projects.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/Projects.tsx): Nạp động nhãn `more`, `featuredProject`, `team`, render vector icons chuẩn ngữ nghĩa cho impact badges và modal headers, đồng nhất định dạng thẻ tag `.badge`.
- [src/components/Skills.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/Skills.tsx): Cấu hình `.principles-grid` 4 cột trên Desktop và chuẩn hóa logic nhận diện icon/màu sắc chính xác cho 4 danh mục kỹ năng.
- [src/components/Experience.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/Experience.tsx): Nạp động `t.currentPosition`, cố định thời gian làm việc ở góc phải trên.
- [src/components/EducationCertifications.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/EducationCertifications.tsx): Nạp động `t.credentialId`.
- [src/components/FloatingActions.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/FloatingActions.tsx): Nạp động tooltip từ `tCommon.scrollToTop` và `tCommon.exportPdf`.
- [src/components/Footer.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/Footer.tsx): Nạp động `fullName` và `t.allRightsReserved`.
- [src/components/Hero.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/Hero.tsx): Nạp động thông tin cá nhân và bản dịch giao diện.
- [src/components/PrintCV.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/components/PrintCV.tsx): Nạp động 100% tiêu đề các phần và mô tả từ `t: UITranslation['printCv']`.
- [src/App.tsx](file:///Users/tanhn/Projects/ga2631.github.io/src/App.tsx): Điều phối dữ liệu tập trung và truyền props `personalInfo`, `t`, `tCommon` xuống toàn bộ cây component.
- [src/types/index.ts](file:///Users/tanhn/Projects/ga2631.github.io/src/types/index.ts): Khai báo kiểu `zaloUrl?: string;` trong `PersonalInfo`, loại bỏ `companyUrl?: string;` trong `ExperienceItem`.
- [docs/features/ui-optimization.md](file:///Users/tanhn/Projects/ga2631.github.io/docs/features/ui-optimization.md): Tài liệu kỹ thuật chi tiết của task tối ưu hóa giao diện.



