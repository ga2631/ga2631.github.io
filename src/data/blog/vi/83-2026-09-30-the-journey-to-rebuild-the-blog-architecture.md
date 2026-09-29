---
id: 83
slug: the-journey-to-rebuild-the-blog-architecture
title: '[Ngoài lề] Xin phép "phá lịch" đăng bài: Hành trình đập đi xây lại kiến trúc Blog'
summary: "Thông báo tạm ngưng ra bài mới để tập trung nâng cấp hệ thống web từ Static Site sang Dynamic Mini-CMS với Supabase."
category: tech-radar-career-insights
publishedAt: 2026-09-30
date: 2026-09-30
readTime: 6 phút đọc
tags:
  - "Announcement"
  - "Architecture"
  - "Devlog"
---

Chào mọi người,

Đáng lẽ ra theo đúng lịch trình, ngày hôm nay chúng ta sẽ có một bài viết mới về chủ đề chuyên môn quen thuộc. Tuy nhiên, hôm nay tôi xin phép được "phá lệ" một hôm để lên một bài viết hoàn toàn... sai chuyên mục.

Đây là một thông báo đặc biệt liên quan đến "bộ máy" đứng sau chính trang web mà các bạn đang đọc. Thời gian tới, blog này sẽ tạm ngưng cập nhật bài viết mới. Lý do không phải vì tôi cạn ý tưởng hay lười biếng, mà là vì tôi đang chuẩn bị thực hiện một đợt "đại phẫu" kiến trúc cho toàn bộ hệ thống.

## Tại sao lại có cuộc đại phẫu này?

Từ ngày đầu vận hành, blog này hoạt động dưới dạng một trang web tĩnh (Static Site). Toàn bộ nội dung được viết dưới dạng các file Markdown (`.md`), lưu trữ chung trong kho chứa mã nguồn (Git) và được deploy tự động thông qua Github Actions.

Kiến trúc này mang lại tốc độ tải trang tuyệt vời. Nhưng sau một thời gian, nó bắt đầu bộc lộ những điểm nghẽn về mặt trải nghiệm của người viết (developer experience):

- **Sự cồng kềnh của Git:** Việc nhồi nhét file `.md` và đặc biệt là hình ảnh vào Git khiến dung lượng repository ngày càng phình to không cần thiết.
- **Thiếu tính linh hoạt:** Để xuất bản hay sửa một lỗi chính tả nhỏ xíu, tôi buộc phải mở máy tính, bật IDE, sửa text, tạo commit và push lên Github. Tôi hoàn toàn không thể viết hoặc sửa bài khi đang ngồi ở quán cafe chỉ với một chiếc điện thoại hay tablet.

## Từ Tĩnh hóa Động: Kế hoạch nâng cấp

Để giải quyết triệt để bài toán trên, tôi quyết định biến hệ thống tĩnh này thành một ứng dụng động (Dynamic) hoàn chỉnh:

1.  **Dữ liệu di cư lên mây:** Toàn bộ nội dung bài viết và hình ảnh sẽ được tháo gỡ khỏi Git và chuyển sang lưu trữ trên **Supabase** (một nền tảng Backend-as-a-Service cực kỳ mạnh mẽ dựa trên PostgreSQL).
2.  **Trang Admin "ẩn":** Tôi sẽ tự tay xây dựng một phân hệ `/admin` được bảo mật nghiêm ngặt ngay trên chính domain này. Nó sẽ được tích hợp sẵn Markdown Editor, cho phép tôi soạn thảo, preview, lưu nháp và xuất bản bài viết từ bất kỳ thiết bị nào, ở bất kỳ đâu mà không cần gõ một dòng lệnh Git nào nữa.
3.  **Giữ vững phong độ tốc độ:** Hệ thống sẽ được tối ưu để parse trực tiếp nội dung từ Database xuống giao diện người đọc một cách mượt mà nhất, đảm bảo tốc độ vẫn chớp nhoáng như kiến trúc cũ.

Quá trình chuyển dịch này đòi hỏi tôi phải cấu trúc lại Database, viết script migrate hàng loạt dữ liệu cũ, cấu hình Row Level Security (RLS) để bảo vệ API và code lại logic render của Frontend. Khối lượng công việc tương đối dày và cần sự tập trung cao độ.

Vì vậy, tôi xin phép tạm "đóng băng" lịch đăng bài thường lệ để dồn 100% công lực cho đợt nâng cấp hạ tầng này.

> Rất có thể, bài viết đầu tiên đánh dấu sự trở lại trên hệ thống mới sẽ chính là một bài _Devlog_ mổ xẻ chi tiết từng dòng code tôi đã viết để xây dựng trang Admin và tích hợp Supabase này.

Cảm ơn mọi người đã luôn theo dõi. Hẹn gặp lại các bạn ở một phiên bản kiến trúc xịn xò hơn!
