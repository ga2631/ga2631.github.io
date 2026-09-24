---
id: 53
slug: design-pattern-02-creational-patterns-object-pool
title: "Design Pattern #02: [Creational Patterns] Object Pool Pattern - Tối ưu hóa Kết nối Cơ sở dữ liệu"
summary: "Khắc phục nút thắt cổ chai hiệu suất khi lưu trữ đơn hàng bằng cách tái sử dụng kết nối Database thông qua Object Pool Pattern."
category: "code-craftsmanship-languages"
publishedAt: "2026-06-04"
date: "2026-06-04"
readTime: "7 phút đọc"
tags:
  - "Design Patterns"
  - "Creational Patterns"
  - "Object Pool"
  - "Use Case Analysis"
---

## Mô tả bài toán

Sau khi thiết lập cấu hình với Singleton, Hệ thống Xử lý Đơn hàng cần lưu dữ liệu vào Database. Vào các dịp Sale lớn, hàng nghìn đơn hàng được tạo mỗi giây. Việc mở và đóng kết nối TCP tới Database (như PostgreSQL hay MySQL) cho từng đơn hàng là một tác vụ cực kỳ tốn chi phí (Expensive Operation) và sẽ nhanh chóng làm sập hệ thống.

**Object Pool Pattern** là giải pháp tối ưu cho tình huống này.

## Object Pool Pattern là gì?

Thay vì tạo mới và hủy object liên tục, Object Pool duy trì một "hồ chứa" (pool) các object đã được khởi tạo sẵn. Khi cần, client mượn (borrow) một object từ pool, sử dụng xong thì trả lại (return) để client khác dùng tiếp.

## Áp dụng vào Hệ thống Xử lý Đơn hàng

Chúng ta sẽ xây dựng `DatabaseConnectionPool`. Pool này sẽ duy trì sẵn 10 kết nối DB. Khi `OrderRepository` cần lưu đơn hàng, nó lấy kết nối từ Pool, thực thi Query và trả lại.

```mermaid
sequenceDiagram
    participant OrderService
    participant DBPool
    participant Connection

    OrderService->>DBPool: acquireConnection()
    alt Pool có kết nối rảnh
        DBPool-->>OrderService: Trả về Connection #1
    else Pool hết kết nối rảnh
        DBPool-->>OrderService: Block hoặc throw Error
    end

    OrderService->>Connection: executeQuery("INSERT INTO orders...")
    OrderService->>DBPool: releaseConnection(Connection #1)
    Note right of DBPool: Đánh dấu Connection #1 là Available
```

## Cài đặt (Mã giả)

```typescript
class DatabaseConnection {
  public id: number;
  constructor(id: number) {
    this.id = id; /* Connect to DB */
  }
  public query(sql: string) {
    console.log(`Conn ${this.id} executing: ${sql}`);
  }
}

class DatabaseConnectionPool {
  private available: DatabaseConnection[] = [];
  private inUse: DatabaseConnection[] = [];

  constructor(size: number) {
    for (let i = 0; i < size; i++) {
      this.available.push(new DatabaseConnection(i));
    }
  }

  public acquire(): DatabaseConnection {
    if (this.available.length === 0) {
      throw new Error("No available connections!");
    }
    const conn = this.available.pop()!;
    this.inUse.push(conn);
    return conn;
  }

  public release(conn: DatabaseConnection) {
    this.inUse = this.inUse.filter((c) => c !== conn);
    this.available.push(conn);
  }
}

// Cách sử dụng
const pool = new DatabaseConnectionPool(5); // Khởi tạo pool 5 kết nối
const conn = pool.acquire(); // Mượn
conn.query("INSERT INTO orders (total) VALUES (500)");
pool.release(conn); // Trả lại
```

## Tổng kết

Object Pool giảm thiểu độ trễ đáng kể trong hệ thống backend. Ở bước tiếp theo, sau khi lưu trữ đơn hàng, khách hàng cần tiến hành thanh toán. Chúng ta sẽ dùng **Factory Method Pattern** để linh hoạt xử lý nhiều cổng thanh toán khác nhau (VNPay, Momo, Stripe).
