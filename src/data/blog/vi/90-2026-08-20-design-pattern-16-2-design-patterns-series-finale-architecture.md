---
id: 90
slug: design-pattern-16-2-design-patterns-series-finale-workflow
title: "Design Pattern #16.2: Tổng hợp Series - Luồng phối hợp thực thi Checkout"
summary: "Phân tích chi tiết một request Checkout sẽ đi qua các Design Patterns như thế nào theo thời gian thực (Runtime)."
category: "code-craftsmanship-languages"
publishedAt: "2026-09-22"
date: "2026-09-22"
readTime: "6 phút đọc"
tags:
  - "Design Patterns"
  - "System Architecture"
  - "Use Case Analysis"
  - "Best Practices"
---

Kiến trúc tĩnh thì đẹp, nhưng khi hệ thống chạy (Runtime) thì các Pattern giao tiếp với nhau ra sao? Hãy theo chân một Request "Đặt hàng" (Place Order) để xem sự phối hợp nhịp nhàng của hệ thống.

## Sequence Diagram: Hành trình của một Đơn hàng

```mermaid
sequenceDiagram
    actor User
    participant Facade as CheckoutFacade
    participant Adapter as InventoryAdapter
    participant Decorator as PricingDecorator
    participant Strategy as ShippingStrategy
    participant UoW as UnitOfWork
    participant Observer as OrderSubject (Observer)

    User->>Facade: POST /checkout (cart_data)

    note over Facade,Adapter: 1. Structural Pattern
    Facade->>Adapter: checkStock(cart)
    Adapter-->>Facade: return OK

    note over Facade,Strategy: 2. Tính toán (Structural & Behavioral)
    Facade->>Decorator: calculateTotal(cart, vouchers)
    Decorator-->>Facade: total_price
    Facade->>Strategy: calculateShipping(distance, mode)
    Strategy-->>Facade: shipping_fee

    note over Facade,UoW: 3. Lưu trữ (Data Access)
    Facade->>UoW: startTransaction()
    Facade->>UoW: orderRepo.save(order)
    Facade->>UoW: inventoryRepo.deduct(cart)

    alt Lỗi Database
        UoW-->>Facade: Exception
        Facade->>UoW: rollback()
        Facade-->>User: return 500 Error
    else Thành công
        UoW->>UoW: commit()
    end

    note over Facade,Observer: 4. Thông báo (Behavioral)
    Facade->>Observer: changeStatus("PAID")
    Observer-->>EmailService: update() (Bất đồng bộ)
    Observer-->>SMSService: update() (Bất đồng bộ)

    Facade-->>User: return 200 OK
```

## Phân tích điểm chạm (Touchpoints)

1. **Vào cửa qua Facade:** Controller không cần biết bên trong có bao nhiêu bước, nó chỉ gọi `Facade.placeOrder()`.
2. **Kiểm tra với Adapter:** Facade hỏi Adapter xem kho còn hàng không. Adapter âm thầm dịch request sang XML gửi cho hệ thống kho cũ.
3. **Tính toán chồng chéo:** Các voucher giảm giá xếp chồng lên nhau nhờ `Decorator`. Phí ship được tính bằng 1 `Strategy` cụ thể (Ví dụ: Giao Hỏa tốc).
4. **Cam kết dữ liệu:** Ghi Order và trừ Stock phải diễn ra trong cùng một `Unit of Work` để đảm bảo ACID.
5. **Lan truyền sự kiện:** Đơn hàng lưu xong, trạng thái đổi thành PAID. `Observer` tự động đánh thức các dịch vụ Email/SMS mà luồng chính không cần chờ đợi.

Đây chính là sự khác biệt giữa "Code chạy được" và "Code chuẩn Software Engineering".
