---
id: 67
slug: design-pattern-16-2-design-patterns-series-finale-workflow
title: "Design Pattern #16.2: Series Finale - Checkout Execution Coordination Flow"
summary: "Detailed analysis of how a Checkout request will travel through Design Patterns in real-time (Runtime)."
category: "code-craftsmanship-languages"
publishedAt: "2026-09-17"
date: "2026-09-17"
readTime: "6 min read"
tags:
  - "Design Patterns"
  - "System Architecture"
  - "Use Case Analysis"
  - "Best Practices"
---

Static architecture is beautiful, but how do Patterns communicate with each other when the system is running (Runtime)? Let's follow a "Place Order" Request to see the rhythmic coordination of the system.

## Sequence Diagram: The Journey of an Order

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

    note over Facade,Strategy: 2. Calculation (Structural & Behavioral)
    Facade->>Decorator: calculateTotal(cart, vouchers)
    Decorator-->>Facade: total_price
    Facade->>Strategy: calculateShipping(distance, mode)
    Strategy-->>Facade: shipping_fee

    note over Facade,UoW: 3. Storage (Data Access)
    Facade->>UoW: startTransaction()
    Facade->>UoW: orderRepo.save(order)
    Facade->>UoW: inventoryRepo.deduct(cart)

    alt Database Error
        UoW-->>Facade: Exception
        Facade->>UoW: rollback()
        Facade-->>User: return 500 Error
    else Success
        UoW->>UoW: commit()
    end

    note over Facade,Observer: 4. Notification (Behavioral)
    Facade->>Observer: changeStatus("PAID")
    Observer-->>EmailService: update() (Asynchronous)
    Observer-->>SMSService: update() (Asynchronous)

    Facade-->>User: return 200 OK
```

## Touchpoints Analysis

1. **Entering through the Facade:** The Controller doesn't need to know how many steps are inside; it just calls `Facade.placeOrder()`.
2. **Checking with Adapter:** The Facade asks the Adapter if the warehouse has stock. The Adapter silently translates the request into XML and sends it to the old inventory system.
3. **Overlapping Calculations:** Discount vouchers stack on top of each other thanks to the `Decorator`. Shipping fees are calculated using a specific `Strategy` (e.g., Express Delivery).
4. **Data Commitment:** Saving the Order and deducting Stock must occur within the same `Unit of Work` to ensure ACID compliance.
5. **Event Propagation:** Once the order is saved, the status changes to PAID. The `Observer` automatically wakes up the Email/SMS services without the main thread having to wait.

This is exactly the difference between "Code that works" and "Standard Software Engineering Code".
