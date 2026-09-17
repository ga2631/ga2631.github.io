import { BlogPost } from '../types/index.ts';

export const blogPostsEn: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'migrating-legacy-erp-to-medallion-data-warehouse-cdc',
    title: 'Migrating a 7-Year Legacy ERP to a Medallion Data Warehouse using CDC and Zero Data Loss',
    summary: 'How we extracted MySQL binlogs with Change Data Capture, leveraged RabbitMQ idempotent workers, and reduced analytical query times by >70% with zero downtime.',
    publishedAt: 'May 2026',
    readTime: '7 min read',
    tags: ['Golang', 'CDC', 'Medallion Architecture', 'PostgreSQL', 'RabbitMQ', 'Data Engineering'],
    author: 'Tan Huynh Nhat',
    contentHtml: `
      <h3>The Challenge: Entity-Attribute-Value (EAV) Bottlenecks</h3>
      <p>Over 7 years of operation, our core ERP database grew organically with extensive EAV tables. Analytical queries required joining dozens of attribute tables, causing query execution times to exceed several minutes and overloading the operational database.</p>
      
      <h3>1. Bypassing Application Code with Change Data Capture (CDC)</h3>
      <p>Rather than modifying the rigid legacy monolithic codebase, we hooked directly into MySQL binary logs (binlogs). Every <code>INSERT</code>, <code>UPDATE</code>, and <code>DELETE</code> event was automatically captured and published to RabbitMQ queues, creating a complete historical audit trail with zero performance impact on the ERP app.</p>

      <h3>2. The Medallion Architecture (Bronze - Silver - Gold)</h3>
      <ul>
        <li><strong>Bronze Layer (Raw Ingestion):</strong> Stores raw JSON event payloads exactly as received from MySQL binlogs.</li>
        <li><strong>Silver Layer (Cleansed & Idempotent Processing):</strong> Idempotent Go workers consume RabbitMQ events, validate schemas, and perform <code>ON CONFLICT DO UPDATE</code> (UPSERTs) in PostgreSQL.</li>
        <li><strong>Gold Layer (Aggregated Data Marts):</strong> Structured dimensional tables optimized for Looker Studio dashboards and fast aggregation.</li>
      </ul>

      <h3>3. Key Results</h3>
      <p>The migration achieved a <strong>96% data reconciliation rate with zero data loss</strong>, reduced complex analytical query times by <strong>over 70%</strong>, and kept end-to-end CDC pipeline latency under 2 seconds.</p>
    `,
  },
  {
    id: 'post-2',
    slug: 'building-reactive-event-tracking-spring-webflux-kafka',
    title: 'Architecting High-Throughput Event Ingestion with Spring WebFlux, Kafka & Automated PII Masking',
    summary: 'Building a privacy-compliant MarTech analytics gateway that handles thousands of real-time e-commerce conversion events with sub-second latency.',
    publishedAt: 'Apr 2026',
    readTime: '6 min read',
    tags: ['Java 17', 'Spring Boot', 'Spring WebFlux', 'Kafka', 'Google Analytics 4', 'Privacy'],
    author: 'Tan Huynh Nhat',
    contentHtml: `
      <h3>High-Throughput Non-Blocking Event Tracking</h3>
      <p>E-commerce checkout funnels require capturing micro-events (cart abandonment, add-on selections, voucher clicks) without introducing latency to user transactions. We leveraged <strong>Spring WebFlux</strong> to implement non-blocking asynchronous endpoints backed by Apache Kafka and RabbitMQ.</p>

      <h3>Automated PII Masking via Spring AOP</h3>
      <p>To comply with Decree 13/2023/ND-CP and international privacy laws, sensitive personal identifiable information (PII) must never reach third-party analytics endpoints like Google Analytics 4 (GA4). We implemented custom Spring AOP interceptors that recursively scan and mask sensitive fields prior to transmission.</p>

      <h3>Resilience with Circuit Breakers</h3>
      <p>Using Resilience4j Circuit Breakers and retry mechanisms, our API gateway gracefully absorbed external ad platform rate limits and network degradation without dropping customer conversion signals.</p>
    `,
  },
  {
    id: 'post-3',
    slug: 'scaling-customer-reporting-portal-high-concurrency-redis',
    title: 'Scaling an ERP Customer Reporting Portal to 1,000+ Concurrent Users with Redis & Node.js',
    summary: 'Techniques for caching heavy reporting queries, batch synchronization, and designing modular UI component architectures.',
    publishedAt: 'Jan 2026',
    readTime: '5 min read',
    tags: ['Node.js', 'Redis', 'Vue.js', 'High Concurrency', 'Architecture'],
    author: 'Tan Huynh Nhat',
    contentHtml: `
      <h3>The Concurrency Challenge</h3>
      <p>When multiple enterprise clients run heavy ad reporting analytics simultaneously during morning rush hours, database CPU usage spikes to 100%. We decoupled direct reporting queries from the transactional ERP database using Redis caching and intelligent query batching.</p>

      <h3>Modular Charting with Vue.js</h3>
      <p>By breaking reporting widgets into independent, reactive chart components with unified state contracts, client requests for new metrics could be rolled out in hours without touching backend core modules.</p>
    `,
  },
];

export const blogPostsVi: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'migrating-legacy-erp-to-medallion-data-warehouse-cdc',
    title: 'Chuyển đổi Hệ thống ERP Kế thừa 7 năm sang Medallion Data Warehouse với CDC & Zero Data Loss',
    summary: 'Cách trích xuất MySQL binlog qua Change Data Capture, xây dựng worker Idempotent trên RabbitMQ và giảm hơn 70% thời gian truy vấn phân tích không gây gián đoạn hệ thống.',
    publishedAt: 'Tháng 5, 2026',
    readTime: '7 phút đọc',
    tags: ['Golang', 'CDC', 'Medallion Architecture', 'PostgreSQL', 'RabbitMQ', 'Data Engineering'],
    author: 'Huỳnh Nhật Tân',
    contentHtml: `
      <h3>Thách thức: Điểm nghẽn CSDL Entity-Attribute-Value (EAV)</h3>
      <p>Qua 7 năm vận hành, CSDL ERP kế thừa phát triển phình to với các bảng EAV phức tạp. Các truy vấn phân tích đòi hỏi join hàng chục bảng thuộc tính, khiến thời gian thực thi kéo dài nhiều phút và làm nghẽn CSDL vận hành.</p>
      
      <h3>1. Bỏ qua mã nguồn ứng dụng với Change Data Capture (CDC)</h3>
      <p>Thay vì sửa đổi khối mã nguồn monolithic cũ kỹ, chúng tôi bắt trực tiếp log nhị phân của MySQL (binlogs). Mọi sự kiện <code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code> được bắt tự động và đẩy vào hàng đợi RabbitMQ, tạo luồng kiểm toán hoàn chỉnh mà không ảnh hưởng hiệu năng ứng dụng ERP.</p>

      <h3>2. Kiến trúc Medallion (Bronze - Silver - Gold)</h3>
      <ul>
        <li><strong>Tầng Bronze (Raw Ingestion):</strong> Lưu trữ payload sự kiện JSON thô từ MySQL binlogs.</li>
        <li><strong>Tầng Silver (Xử lý Idempotent & Làm sạch):</strong> Các Go worker xử lý sự kiện, kiểm tra schema và thực thi <code>ON CONFLICT DO UPDATE</code> (UPSERTs) trên PostgreSQL.</li>
        <li><strong>Tầng Gold (Data Marts Tổng hợp):</strong> Các bảng đa chiều tối ưu cho báo cáo Looker Studio và tổng hợp tức thì.</li>
      </ul>

      <h3>3. Kết quả then chốt</h3>
      <p>Quá trình chuyển đổi đạt <strong>96% tỷ lệ khớp nối dữ liệu với 0% mất mát</strong>, giảm hơn <strong>70% thời gian thực thi truy vấn phức tạp</strong> và duy trì độ trễ đồng bộ toàn luồng CDC dưới 2 giây.</p>
    `,
  },
  {
    id: 'post-2',
    slug: 'building-reactive-event-tracking-spring-webflux-kafka',
    title: 'Kiến trúc Thu thập Sự kiện Thông lượng cao với Spring WebFlux, Kafka & Ẩn danh PII Tự động',
    summary: 'Xây dựng cổng MarTech tuân thủ quyền riêng tư dữ liệu, xử lý hàng nghìn sự kiện phễu chuyển đổi TMĐT thời gian thực với độ trễ dưới 1 giây.',
    publishedAt: 'Tháng 4, 2026',
    readTime: '6 phút đọc',
    tags: ['Java 17', 'Spring Boot', 'Spring WebFlux', 'Kafka', 'Google Analytics 4', 'Privacy'],
    author: 'Huỳnh Nhật Tân',
    contentHtml: `
      <h3>Thu thập Sự kiện Bất đồng bộ Non-Blocking</h3>
      <p>Phễu thanh toán TMĐT đòi hỏi ghi nhận các vi sự kiện (bỏ giỏ hàng, chọn sản phẩm kèm, áp mã voucher) mà không gây trễ cho giao dịch người dùng. Chúng tôi sử dụng <strong>Spring WebFlux</strong> để xây dựng các endpoint bất đồng bộ non-blocking kết hợp Apache Kafka và RabbitMQ.</p>

      <h3>Ẩn danh Dữ liệu PII Tự động qua Spring AOP</h3>
      <p>Nhằm tuân thủ Nghị định 13/2023/NĐ-CP và luật bảo vệ dữ liệu, thông tin cá nhân định danh (PII) không bao giờ được phép gửi sang bên thứ ba như Google Analytics 4 (GA4). Chúng tôi xây dựng các Spring AOP interceptor tùy biến quét đệ quy và mã hóa các trường nhạy cảm trước khi truyền đi.</p>

      <h3>Khả năng phục hồi với Circuit Breaker</h3>
      <p>Ứng dụng Resilience4j Circuit Breaker và cơ chế thử lại (Retry) giúp cổng API hấp thụ mượt mà các giới hạn rate-limit và sự cố mạng từ nền tảng quảng cáo ngoài mà không làm mất tín hiệu chuyển đổi của khách hàng.</p>
    `,
  },
  {
    id: 'post-3',
    slug: 'scaling-customer-reporting-portal-high-concurrency-redis',
    title: 'Mở rộng Cổng Báo cáo ERP chịu tải 1,000+ Người dùng đồng thời với Redis & Node.js',
    summary: 'Kỹ thuật đệm truy vấn báo cáo nặng, đồng bộ dữ liệu theo lô và thiết kế kiến trúc component giao diện dạng mô-đun.',
    publishedAt: 'Tháng 1, 2026',
    readTime: '5 phút đọc',
    tags: ['Node.js', 'Redis', 'Vue.js', 'High Concurrency', 'Architecture'],
    author: 'Huỳnh Nhật Tân',
    contentHtml: `
      <h3>Thách thức Tải đồng thời Cao</h3>
      <p>Khi nhiều khách hàng doanh nghiệp cùng chạy báo cáo dữ liệu quảng cáo nặng trong giờ cao điểm buổi sáng, CPU của CSDL chạm ngưỡng 100%. Chúng tôi tách rời các truy vấn báo cáo khỏi CSDL vận hành ERP nhờ bộ nhớ đệm Redis và gom lô truy vấn thông minh.</p>

      <h3>Kiến trúc Biểu đồ Mô-đun với Vue.js</h3>
      <p>Bằng cách chia nhỏ các widget báo cáo thành các component biểu đồ độc lập có hợp đồng trạng thái thống nhất, các yêu cầu thêm chỉ số mới từ đối tác được bàn giao trong vài giờ mà không phải can thiệp vào các mô-đun backend lõi.</p>
    `,
  },
];

export const blogPosts = blogPostsEn;
