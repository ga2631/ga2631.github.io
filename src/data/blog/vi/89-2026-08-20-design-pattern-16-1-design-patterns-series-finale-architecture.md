---
id: 89
slug: design-pattern-16-1-design-patterns-series-finale-architecture
title: "Design Pattern #16.1: Tổng hợp Series - Bức tranh Kiến trúc Toàn diện Hệ thống"
summary: "Nhìn lại toàn bộ kiến trúc của Hệ thống Xử lý Đơn hàng sau khi đã áp dụng các Creational, Structural, Behavioral và Data Access Patterns."
category: "code-craftsmanship-languages"
publishedAt: "2026-09-22"
date: "2026-09-22"
readTime: "5 phút đọc"
tags:
  - "Design Patterns"
  - "System Architecture"
  - "Use Case Analysis"
  - "Best Practices"
---

Chúng ta đã đi qua một chặng đường dài, từ việc khởi tạo những object đầu tiên cho đến khi kết nối thành công với Database. Ở bài viết này, chúng ta sẽ nhìn lại **Hệ thống Xử lý Đơn hàng (Order Processing System)** dưới góc độ toàn cảnh.

Thay vì các class rời rạc, giờ đây hệ thống của chúng ta là một tập hợp các module được chuẩn hóa thông qua Design Patterns.

## Sơ đồ Kiến trúc phân lớp (Layered Architecture)

Mỗi nhóm Pattern đã giải quyết xuất sắc nhiệm vụ ở đúng tầng (Layer) của nó:

```mermaid
flowchart TD
    subgraph Presentation Layer
        API[API Endpoints]
        Facade["Checkout Facade\n(Structural)"]
    end

    subgraph Business Logic Layer
        Config["AppConfig\n(Singleton)"]

        OrderService[Order Service]
        Decorator["Pricing Decorator\n(Structural)"]
        Strategy["Shipping Strategy\n(Behavioral)"]
        Factory["Payment Factory\n(Creational)"]
        Observer["Notification Subject\n(Behavioral)"]
    end

    subgraph Infrastructure & Data Access Layer
        Adapter["Legacy Inventory Adapter\n(Structural)"]
        UoW["Unit Of Work\n(Data Access)"]
        Pool["Connection Pool\n(Creational)"]
        Repo["Repositories\n(Data Access)"]
    end

    API --> Facade
    Facade --> OrderService

    OrderService --> Decorator
    OrderService --> Strategy
    OrderService --> Factory
    OrderService --> Observer

    OrderService --> Adapter
    OrderService --> UoW
    UoW --> Repo
    Repo --> Pool
```

## Ý nghĩa của sự phân chia

- **Creational (Sinh ra):** `Singleton`, `Object Pool`, `Factory` giúp việc tạo ra các công cụ (như kết nối DB, cổng thanh toán) trở nên an toàn, tiết kiệm RAM và tái sử dụng tốt.
- **Structural (Lắp ráp):** `Facade`, `Decorator`, `Adapter` bọc các object lại với nhau, giúp logic tính giá không bị phình to, và hệ thống mới nói chuyện được với hệ thống cũ.
- **Behavioral (Hành vi):** `Strategy` và `Observer` phân chia rõ ràng trách nhiệm ai làm việc nấy, ai tính phí thì tính, ai gửi email thì chờ lệnh (Event-driven).
- **Data Access (Lưu trữ):** `Repository` và `Unit of Work` tạo thành lá chắn bảo vệ Business Logic khỏi các câu lệnh SQL thô kệch.

Ở phần 2, chúng ta sẽ xem một Request từ người dùng sẽ đi xuyên qua các Pattern này như thế nào.
