---
id: 75
slug: application-tier-and-stateless-principle-ticketnow
title: "Thiết Kế Hệ Thống Phân Tán #04: Tầng Ứng dụng (Application Tier) - Trái tim 'Phi trạng thái' của TicketNow"
summary: 'Trong kiến trúc hàng ngang, Tầng Ứng dụng (Application Layer) đóng vai trò là "khối óc" xử lý toàn bộ logic nghiệp vụ (business logic) như tính toán giá vé, giữ chỗ, và xác nhận thanh toán. Khác với Tầng Biên (chỉ lo điều hướng) hay Tầng Dữ liệu (phải lưu trữ bền vững), Tầng Ứng dụng là nơi các node (máy chủ/container) sinh ra và chết đi liên tục dựa trên lưu lượng truy cập (Auto-scaling).'
category: architecture-system-design
publishedAt: 2026-09-14
date: 2026-09-14
readTime: 8 phút đọc
tags:
  - "System Design"
  - "Distributed Systems"
  - "Backend"
  - "Architecture"
  - "Horizontal scaling"
---

Để quá trình co giãn này diễn ra mượt mà trong đợt mở bán vé BlackPink trên TicketNow mà không làm đứt gãy trải nghiệm của người dùng, nguyên tắc tối thượng phải tuân thủ là **Phi trạng thái (Stateless)**.

## 1. Bản chất của triết lý Phi trạng thái (Stateless)

Trong kiến trúc truyền thống (Monolithic/Stateful), máy chủ thường "nhớ" người dùng là ai bằng cách lưu Session vào RAM hoặc lưu file ảnh tĩnh cục bộ.

**Hậu quả khi scale ngang:** Hãy tưởng tượng lúc 8h59, Load Balancer đẩy request "Đăng nhập" của User A vào Node 1. Đến đúng 9h00, User A bấm "Chọn ghế", request này vô tình được Load Balancer đẩy sang Node 2. Nếu TicketNow không dùng thiết kế phi trạng thái, Node 2 sẽ không biết User A là ai và bắt họ đăng nhập lại. Cơ hội mua vé lập tức tan tành! Đồng thời, nếu Node 1 sập, toàn bộ session trên đó mất trắng.

**Kiến trúc Phi trạng thái (Stateless)** yêu cầu App Node phải bị "mất trí nhớ". Một request gửi đến phải chứa **đủ toàn bộ thông tin** để bất kỳ Node nào cũng có thể xử lý được. Trạng thái (State) như giỏ hàng, thông tin đăng nhập, trạng thái ghế đang giữ phải được đẩy ra các dịch vụ lưu trữ bên ngoài (Externalized State).

## 2. Hướng dẫn tổ chức Source Code để đạt chuẩn Stateless

Để mã nguồn TicketNow thực sự tuân thủ nguyên tắc Stateless, chúng ta cần áp dụng tiêu chuẩn **The 12-Factor App** (Ứng dụng 12 yếu tố). Dưới đây là các kỹ thuật thực chiến:

**1. Quản lý Cấu hình (Config) qua Biến Môi Trường (ENV)**: Tuyệt đối không lưu cấu hình (Database URL, Secret Key, API Keys của cổng thanh toán VNPay) trong file code tĩnh như `config.json`. Khi scale bằng Docker, hàng trăm Node TicketNow phải sử dụng chung 1 image tĩnh duy nhất. Sự khác biệt giữa môi trường Dev và Prod chỉ được phép quyết định qua Biến môi trường (Environment Variables).
_Thực hành:_ Sử dụng thư viện `dotenv` (Node.js/Python) hoặc `viper` (Go).

**2. Xử lý File tĩnh và Uploads (External Storage)**: Không bao giờ dùng các lệnh như `fs.writeFile()` (Node.js) hoặc `os.Create()` (Go) để lưu vé PDF cục bộ. _Thiết kế chuẩn cho TicketNow:_ Khi hệ thống render xong file Vé PDF cho khách hàng, App Node đẩy thẳng (Pipe) file đó lên Object Storage (như Amazon S3 hoặc Google Cloud Storage - GCS). Sau đó chỉ lưu URL của file vào Database. Bất kỳ node nào cũng có thể gửi URL đó vào email khách hàng.

**3. Quản lý Định danh & Phiên (Authentication & Sessions)**: Để các Ticket Node không cần lưu thông tin đăng nhập, TicketNow có thể dùng 2 cách:

- **Cách 1 - JWT (JSON Web Token):** Đây là Stateless tuyệt đối. Node không lưu gì cả. Token cấp cho người dùng chứa sẵn User ID, Role và được ký bảo mật. Node 2 khi nhận request mua vé chỉ cần giải mã JWT là biết user đó hợp lệ.
- **Cách 2 - External Session (Redis):** Để hỗ trợ các tính năng như "Giữ ghế 10 phút", TicketNow bắt buộc phải đẩy trạng thái giỏ hàng và phiên làm việc vào Redis Cache. Mọi Ticket Node đều đọc/ghi trạng thái từ cụm Redis dùng chung này.

**4. Cấu trúc thư mục mã nguồn tham khảo (Clean Architecture)**: Dù dùng ngôn ngữ nào, source code TicketNow cần tách biệt rõ ràng phần giao tiếp và phần lõi nghiệp vụ:

```text
├── cmd/                # Entry point khởi chạy ứng dụng (main)
│   └── api/            # Setup Load Config, Khởi tạo kết nối DB/Redis
├── internal/           # Mã nguồn nội bộ của service
│   ├── handlers/       # Tầng HTTP (Controller), nhận request chọn ghế, decode JSON
│   ├── services/       # Tầng Logic (Kiểm tra ghế trống, tính tiền vé)
│   ├── repositories/   # Tầng Dữ liệu, chứa code query DB hoặc set khóa trên Redis
│   └── models/         # Định nghĩa các Struct (Ticket, User, Order)
├── pkg/                # Các thư viện dùng chung (Utils, Logger)
├── Dockerfile          # Đóng gói ứng dụng thành Image chuẩn Stateless
└── .env.example        # Mẫu biến môi trường
```

## Thiết kế chuẩn cho Node Ứng dụng (Best Practices)

Để hàng trăm Node có thể sống sót và phối hợp nhịp nhàng dưới bàn tay đạo diễn của Load Balancer/Kubernetes, ứng dụng phải có 3 cơ chế sinh tồn cốt lõi:

**1. Health Checks (Kiểm tra sức khỏe)**: Load Balancer cần biết Node có đang "sống" không để đẩy traffic vào. Lập trình viên phải tạo 2 API endpoints:

- **Liveness Probe (`/health/live`):** Node trả về HTTP 200 ngay lập tức nếu tiến trình app đang chạy. Nếu nó treo, Kubernetes sẽ tự động "bắn bỏ" container và tạo cái mới.
- **Readiness Probe (`/health/ready`):** Kiểm tra xem Node đã _sẵn sàng nhận khách_ chưa. Ví dụ: Nếu Node 1 bị rớt mạng không kết nối được tới Database, endpoint này trả về 503. Load Balancer sẽ lập tức ngừng đẩy khách hàng vào Node 1 để tránh lỗi thanh toán oan uổng.

**2. Graceful Shutdown (Dừng hoạt động mềm mại)**: Khi đợt mở bán vé kết thúc, hệ thống bắt đầu tự động giảm tải (Scale down) để tiết kiệm chi phí. OS sẽ gửi một tín hiệu `SIGTERM` tới Node để yêu cầu tắt.

- **Lỗi thường gặp (Hard Kill):** Ứng dụng tắt ngay lập tức. Khách hàng đang trong quá trình chuyển khoản VNPay dở dang sẽ bị văng lỗi trắng trang. Vé mất, tiền có thể bị trừ.
- **Thiết kế chuẩn:** Ứng dụng bắt tín hiệu `SIGTERM`. Nó báo cho Load Balancer: "Đừng gửi khách mới cho tôi nữa". Tuy nhiên, Node vẫn nán lại 10-30 giây để xử lý nốt cho xong các giao dịch VNPay đang chạy dở, đóng an toàn các kết nối Database, rồi mới thực sự thoát (exit 0).

**3. Observability (Khả năng quan sát - Logs & Traces)**: Trong cụm có 100 node TicketNow, khi một request báo lỗi 500 "Không thể thanh toán", bạn không thể SSH vào từng node để dò log.

- **Structured Logging:** Ứng dụng xuất log dạng JSON (stdout). Hạ tầng tự động hút log về hệ thống trung tâm (ELK Stack).
- **Correlation ID (Trace ID):** Ngay tại Load Balancer, một ID độc nhất (`X-Request-ID`) được sinh ra và gắn vào Header. Node ứng dụng phải lấy ID này đính kèm vào mọi dòng log của giao dịch mua vé đó. Khi khách báo lỗi, bộ phận CSKH cung cấp ID, kỹ sư có thể tìm ra chính xác hành trình giao dịch đó đã đi qua những cụm server nào và chết ở dòng code nào.

## Tích hợp triển khai trên Google Cloud Platform (GCP)

Nếu xây dựng theo đúng các tiêu chuẩn Stateless trên, việc mang TicketNow lên Cloud sẽ nhẹ nhàng và uy lực vô cùng, đặc biệt với **Google Cloud Run**.

Cloud Run là môi trường Serverless Container sinh ra để dành cho các ứng dụng Stateless:

- **Không lo hạ tầng:** Chỉ cần viết mã nguồn (Go/Node.js) phi trạng thái, tạo file `Dockerfile`, đẩy lên Google Artifact Registry, và triển khai. Cloud Run ẩn đi hoàn toàn khái niệm về máy chủ vật lý.
- **Auto-scaling vi diệu cho flash-sale:** Khi không có ai mua vé, Cloud Run tự động scale về 0 (bạn không tốn tiền). Đúng 9h00 khi có 100.000 requests/giây ập tới, Cloud Run tự động "spin-up" hàng ngàn container song song trong chớp mắt (tính bằng mili-giây) để gánh tải mượt mà.
- **Tích hợp sẵn Observability:** Mọi `console.log()` dạng JSON của bạn sẽ được Google thu thập tự động vào **Cloud Logging** và **Cloud Trace**, giúp việc giám sát hệ thống bán vé nhàn nhã hơn bao giờ hết.

> Tầng Ứng dụng trong kiến trúc hàng ngang sinh ra để làm một "người lính" hoàn hảo: linh hoạt, tuân thủ kỷ luật (Stateless), và sẵn sàng rút lui an toàn (Graceful Shutdown) mà không để lại bất kỳ tổn thất nào cho dữ liệu của người dùng. Bằng cách đẩy toàn bộ "trí nhớ" ra bên ngoài và tuân thủ các chuẩn mực của The 12-Factor App, TicketNow có thể tự tin nhân bản hàng ngàn máy chủ chỉ trong tích tắc để đón đầu những đợt mở bán vé khổng lồ. Tuy nhiên, khi các Ticket Node đã trở nên "phi trạng thái", thì gánh nặng lưu giữ trạng thái cực kỳ quan trọng đó (như ghế nào đã có người mua, ghế nào đang khóa tạm thời) sẽ dồn hết về một nơi duy nhất: **Tầng Dữ liệu**.
