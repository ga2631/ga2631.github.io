---
id: 78
slug: deployment-and-automation-when-system-is-code-ticketnow
title: "Thiết Kế Hệ Thống Phân Tán #07: Triển khai & Tự động hoá - Khi hệ thống biến thành Code (IaC)"
summary: 'Trong kiến trúc hệ thống, nếu bạn đã thiết kế thành công Tầng Biên, Tầng Ứng dụng phi trạng thái, Tầng Dữ liệu phân tán và Tầng Bất đồng bộ, bạn mới chỉ đi được một nửa chặng đường. Nửa còn lại quyết định hệ thống có "sống sót" trong thực tế hay không chính là Triển khai & Tự động hoá (Deployment & Automation).'
category: devops-cloud-tooling
publishedAt: 2026-09-23
date: 2026-09-23
readTime: 12 phút đọc
tags:
  - "System Design"
  - "Distributed Systems"
  - "Backend"
  - "Architecture"
  - "Horizontal scaling"
---

Hãy tưởng tượng bạn là CTO của TicketNow: Sáng mai 9:00 mở bán vé, dự kiến cần 100 máy chủ (nodes) để gánh tải, nhưng đến 11:00 bán xong thì phải tắt ngay đi 90 máy để khỏi "đốt tiền" công ty. Nếu làm thủ công (SSH vào từng máy, gõ lệnh, copy code), bạn sẽ thất bại thảm hại. Mọi thứ bắt buộc phải được định nghĩa bằng Code (Infrastructure as Code) và điều khiển hoàn toàn bằng máy móc.

## Hành trình tiến hóa: Từ Truyền thống lên Đám mây Bản địa

Sự chuyển đổi hệ thống của TicketNow không diễn ra sau một đêm, mà là một lộ trình tái cấu trúc dần qua 4 giai đoạn:

- **Giai đoạn 1: Monolithic & Cục bộ:** Mọi thứ (Web, API, DB) nằm chung trên một máy chủ (VPS). Triển khai bằng cách gõ `git pull`, chạy lại `pm2`. Hệ thống chết khi máy chủ nâng cấp hoặc khi có đợt mua vé đột biến.
- **Giai đoạn 2: Phân tách tầng (Decoupling):** Database ra một máy riêng. API ra máy riêng. File đẩy lên S3. Kỹ sư dùng bash script tự động copy code lên 2-3 máy chủ cùng lúc.
- **Giai đoạn 3: Đóng gói (Containerization):** Mã nguồn được đóng gói thành **Docker Image**. Đặt một Load Balancer phía trước. Khởi động các container trên các máy khác nhau.
- **Giai đoạn 4: Đám mây Bản địa (Cloud-Native & Auto-scaling):** Hệ thống được giao cho các nền tảng Điều phối như **Kubernetes (K8s)** hoặc **Google Cloud Run**. Kỹ sư chỉ cần khai báo: _"Tôi muốn chạy Image này, giữ mức CPU luôn dưới 70%"_. Nền tảng tự đo lường, tự bật thêm container lúc 8h59 và tự tắt đi lúc 11h00.

## Quy trình Triển khai tự động (CI/CD Pipeline)

Nguyên tắc tối thượng của hệ thống hàng ngang là **Cơ sở hạ tầng bất biến (Immutable Infrastructure)**. Tuyệt đối không bao giờ chui vào một container đang chạy để sửa code. Khi có thay đổi, ta đập bỏ container cũ, thay bằng container mới hoàn toàn.

Để làm được điều đó, hệ thống cần một luồng CI/CD vững chắc, đảm bảo không có bất kỳ khoảng thời gian chết nào (Zero-downtime) khi cập nhật phiên bản.

**1. Đóng gói Bất biến: Cấu hình Dockerfile**

Để hệ thống mở rộng nhanh, Image của TicketNow phải cực nhẹ. Dưới đây là `Dockerfile` chuẩn (Multi-stage build) cho Backend (Node.js):

```dockerfile
# Giai đoạn 1: Build (Chứa các công cụ compile nặng nề)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Giai đoạn 2: Production Runner (Chỉ chứa file chạy thực tế, siêu nhẹ)
FROM node:20-alpine AS runner
WORKDIR /app

# Ép ứng dụng chạy ở chế độ Production
ENV NODE_ENV=production

# Chỉ copy những file đã được compile từ Giai đoạn 1 sang
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm ci --only=production

# BẢO MẬT: Không chạy ứng dụng bằng quyền root
USER node
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

_Ý nghĩa:_ Image sinh ra chỉ vài chục MB. Nhờ vậy, khi đợt bán vé ập đến, Kubernetes có thể kéo (pull) image này và khởi động hàng chục container mới chỉ dưới 1 giây.

**2. Đường ống CI/CD: Cấu hình GitHub Actions**

Mỗi khi lập trình viên gộp mã (Merge) vào nhánh `main`, hệ thống tự động Build Image và triển khai lên Cloud Run mà không làm văng khách hàng đang chọn ghế.

File `.github/workflows/deploy.yml`:

```yaml
name: Tự động Triển khai lên Google Cloud Run

on:
  push:
    branches: ["main"]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v3

      # Xác thực với GCP thông qua Service Account JSON
      - name: Google Cloud Auth
        uses: google-github-actions/auth@v1
        with:
          credentials_json: "${{ secrets.GCP_SA_KEY }}"

      # Build và gắn Tag cho Image bằng mã Hash của Git Commit
      - name: Build & Push Docker Image
        run: |
          export IMAGE_TAG=asia-southeast1-docker.pkg.dev/ticketnow/repo/api:${{ github.sha }}
          docker build -t $IMAGE_TAG .
          docker push $IMAGE_TAG

      # Triển khai bản cập nhật
      - name: Deploy to Cloud Run
        uses: google-github-actions/deploy-cloudrun@v1
        with:
          service: ticket-api-service
          image: asia-southeast1-docker.pkg.dev/ticketnow/repo/api:${{ github.sha }}
          region: asia-southeast1
          flags: "--allow-unauthenticated"
```

_Cơ chế Rolling Update:_ Nền tảng tự động ép traffic sang các container chứa bản code mới, và chỉ "giết" các container cũ khi các request thanh toán hiện tại trong đó đã chạy xong (Graceful Shutdown).

**3. Hạ tầng dưới dạng Code (IaC): Cấu hình Terraform**

Khi quản lý hàng trăm tài nguyên, bạn không thể click chuột. Bạn viết cấu hình mong muốn bằng Terraform. Nếu cụm server bị xóa nhầm, chỉ cần gõ `terraform apply`, 3 phút sau toàn bộ kiến trúc TicketNow được dựng lại chính xác 100%.

File `main.tf` định nghĩa Cụm Serverless trên GCP:

```hcl
# Định nghĩa một Service chạy trên Google Cloud Run
resource "google_cloud_run_v2_service" "api_service" {
  name     = "ticket-api-service"
  location = "asia-southeast1" # Data Center Singapore

  template {
    containers {
      image = "asia-southeast1-docker.pkg.dev/ticketnow/repo/api:latest"

      resources {
        limits = {
          cpu    = "2"      # 2 vCPU để xử lý mã hóa nhanh hơn
          memory = "1024Mi" # 1GB RAM
        }
      }

      # Chỉ truyền URL Database, không hardcode trong app
      env {
        name  = "DATABASE_URL"
        value = var.db_connection_string
      }
    }

    # BÀI TOÁN CO GIÃN CỦA TICKETNOW
    scaling {
      # Giữ ít nhất 5 nodes luôn chạy để tránh Cold Start lúc 8h59
      min_instance_count = 5
      # Khống chế không nở quá 200 nodes để tránh hóa đơn Cloud khổng lồ
      max_instance_count = 200
    }
  }
}
```

**4. Tự động Co giãn (Auto-scaling): Cấu hình Kubernetes HPA**

Nếu TicketNow quản lý hạ tầng bằng Kubernetes (GKE), linh hồn của kiến trúc nằm ở **HorizontalPodAutoscaler (HPA)** - người gác cổng liên tục đo lường Metric để quyết định tăng/giảm số lượng Node.

File `hpa.yaml`:

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ticket-api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ticket-api-deployment
  minReplicas: 3 # Mức sàn
  maxReplicas: 100 # Mức trần
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 75 # ĐIỀU KIỆN: Khi CPU trung bình vượt 75%, nhân bản node lập tức
```

> Bốn mảng cấu hình trên khi kết nối với nhau sẽ tạo ra một vòng lặp khép kín: _Lập trình viên viết Code -> CI/CD đóng gói thành Image bất biến -> Terraform cấp phát hạ tầng mạng -> K8s/Cloud Run tự động vận hành và co giãn._ Nhờ những "mảnh ghép" DevOps này, đội ngũ kỹ sư TicketNow có thể tự tin kê cao gối ngủ trước giờ G mở bán vé, để máy móc tự động lo liệu phần việc tay chân nặng nhọc nhất. Nhưng đi kèm với tự động hóa là một bài toán hóc búa khác: Làm sao để kiểm soát chi phí đám mây khi hệ thống có thể tự động nở ra 200 server? Trong bài viết tiếp theo, chúng ta sẽ cùng giải phẫu vấn đề đau đầu nhất của cấp quản lý: **Quản trị hệ thống phân tán - Chi phí vận hành**.
