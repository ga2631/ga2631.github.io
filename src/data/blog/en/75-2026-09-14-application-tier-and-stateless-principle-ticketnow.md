---
id: 75
slug: application-tier-and-stateless-principle-ticketnow
title: "Distributed System Design #04: Application Tier - The 'Stateless' Heart of TicketNow"
summary: 'In horizontal architecture, the Application Tier acts as the "brain" processing all business logic such as calculating ticket prices, reserving seats, and confirming payments. Unlike the Edge Tier (only handles routing) or Data Tier (must store persistently), the Application Tier is where nodes (servers/containers) are born and die continuously based on traffic volume (Auto-scaling).'
category: architecture-system-design
publishedAt: 2026-09-14
date: 2026-09-14
readTime: 8 mins
tags:
  - "System Design"
  - "Distributed Systems"
  - "Backend"
  - "Architecture"
  - "Horizontal Scaling"
---

For this scaling process to happen smoothly during the BlackPink ticket sale on TicketNow without breaking the user experience, the ultimate principle that must be followed is **Statelessness**.

## 1. The Nature of the Stateless Philosophy

In traditional (Monolithic/Stateful) architectures, servers often "remember" who the user is by saving Sessions to RAM or storing static image files locally.

**Consequences when horizontally scaling:** Imagine at 8:59, the Load Balancer pushes User A's "Login" request to Node 1. At exactly 9:00, User A clicks "Select Seat", and this request is accidentally pushed by the Load Balancer to Node 2. If TicketNow doesn't use a stateless design, Node 2 won't know who User A is and will force them to log in again. Their chance to buy a ticket instantly vanishes! Also, if Node 1 crashes, all sessions on it are wiped clean.

**Stateless Architecture** demands that App Nodes suffer from "amnesia". A request sent must contain **all necessary information** so that any Node can process it. State like shopping carts, login info, and reserved seat status must be pushed to external storage services (Externalized State).

## 2. Source Code Organization Guide to Achieve Stateless Standards

For TicketNow's source code to truly adhere to Stateless principles, we need to apply **The 12-Factor App** standards. Below are practical techniques:

**1. Configuration Management via Environment Variables (ENV)**: Never store configurations (Database URL, Secret Keys, VNPay payment gateway API Keys) in static code files like `config.json`. When scaling with Docker, hundreds of TicketNow Nodes must share a single static image. Differences between Dev and Prod environments must solely be determined via Environment Variables.
_Practice:_ Use libraries like `dotenv` (Node.js/Python) or `viper` (Go).

**2. Handling Static Files and Uploads (External Storage)**: Never use commands like `fs.writeFile()` (Node.js) or `os.Create()` (Go) to save PDF tickets locally. _Standard design for TicketNow:_ When the system finishes rendering the PDF ticket file for a customer, the App Node streams (Pipes) that file directly to Object Storage (like Amazon S3 or Google Cloud Storage - GCS). Then, only the file URL is saved in the Database. Any node can send that URL to the customer's email.

**3. Identity & Session Management (Authentication & Sessions)**: So that Ticket Nodes don't need to store login information, TicketNow can use 2 methods:

- **Method 1 - JWT (JSON Web Token):** This is absolutely Stateless. The Node stores nothing. The token issued to the user inherently contains the User ID, Role, and is securely signed. Node 2, upon receiving the ticket booking request, only needs to decode the JWT to know the user is valid.
- **Method 2 - External Session (Redis):** To support features like "10-minute seat holds", TicketNow must push the shopping cart state and sessions into Redis Cache. Every Ticket Node reads/writes states from this shared Redis cluster.

**4. Reference Source Code Directory Structure (Clean Architecture)**: Whatever language is used, TicketNow's source code needs to clearly separate the communication layer and the core business logic:

```text
├── cmd/                # Application entry point (main)
│   └── api/            # Load Config setup, Init DB/Redis connections
├── internal/           # Internal service source code
│   ├── handlers/       # HTTP Layer (Controller), receive seat request, decode JSON
│   ├── services/       # Logic Layer (Check availability, calculate ticket price)
│   ├── repositories/   # Data Layer, contains code to query DB or set Redis locks
│   └── models/         # Defines Structs (Ticket, User, Order)
├── pkg/                # Shared libraries (Utils, Logger)
├── Dockerfile          # Packages application into standard Stateless Image
└── .env.example        # Environment variables template
```

## Standard Design for Application Nodes (Best Practices)

For hundreds of Nodes to survive and coordinate harmoniously under the orchestration of Load Balancers/Kubernetes, the application must possess 3 core survival mechanisms:

**1. Health Checks**: The Load Balancer needs to know if a Node is "alive" to push traffic into it. Developers must create 2 API endpoints:

- **Liveness Probe (`/health/live`):** The Node returns HTTP 200 immediately if the app process is running. If it hangs, Kubernetes will automatically "shoot down" the container and create a new one.
- **Readiness Probe (`/health/ready`):** Checks if the Node is _ready to receive customers_. For example: If Node 1 drops its network connection to the Database, this endpoint returns 503. The Load Balancer will immediately stop pushing customers into Node 1 to avoid unjust payment errors.

**2. Graceful Shutdown**: When the ticket sale ends, the system automatically begins to scale down to save costs. The OS will send a `SIGTERM` signal to the Node to request a shutdown.

- **Common Error (Hard Kill):** The application shuts down instantly. Customers halfway through their VNPay money transfer will be thrown to a white error page. Tickets are lost, money might be deducted.
- **Standard Design:** The application catches the `SIGTERM` signal. It tells the Load Balancer: "Don't send me new customers anymore". However, the Node still lingers for 10-30 seconds to finish processing ongoing VNPay transactions, safely closes Database connections, and only then truly exits (exit 0).

**3. Observability (Logs & Traces)**: In a cluster of 100 TicketNow nodes, when a request throws a 500 "Payment failed" error, you can't SSH into every node to trace logs.

- **Structured Logging:** The application outputs logs in JSON format (stdout). The infrastructure automatically vacuums logs to a central system (ELK Stack).
- **Correlation ID (Trace ID):** Right at the Load Balancer, a unique ID (`X-Request-ID`) is generated and attached to the Header. The application node must fetch this ID and attach it to every log line of that ticket transaction. When a customer reports an error, Customer Service provides the ID, and engineers can find exactly which server clusters that transaction journey went through and at which line of code it died.

## Deployment Integration on Google Cloud Platform (GCP)

If built strictly to the above Stateless standards, bringing TicketNow to the Cloud will be effortless and incredibly powerful, especially with **Google Cloud Run**.

Cloud Run is a Serverless Container environment born for Stateless applications:

- **No infrastructure worries:** Just write stateless source code (Go/Node.js), create a `Dockerfile`, push it to Google Artifact Registry, and deploy. Cloud Run completely hides the concept of physical servers.
- **Magical auto-scaling for flash-sales:** When nobody is buying tickets, Cloud Run automatically scales down to 0 (you pay nothing). Exactly at 9:00 when 100,000 requests/second flood in, Cloud Run automatically "spins-up" thousands of parallel containers in a flash (measured in milliseconds) to carry the load smoothly.
- **Built-in Observability:** All your JSON-formatted `console.log()` outputs will be automatically collected by Google into **Cloud Logging** and **Cloud Trace**, making monitoring the ticketing system easier than ever.

> The Application Tier in horizontal architecture is born to be a perfect "soldier": flexible, disciplined (Stateless), and ready to withdraw safely (Graceful Shutdown) without leaving any losses to user data. By pushing all "memory" outwards and adhering to the 12-Factor App standards, TicketNow can confidently clone thousands of servers in a split second to welcome massive ticket sale waves. However, when Ticket Nodes become "stateless", the burden of preserving highly crucial states (like which seat is bought, which is temporarily locked) is all pushed to a single place: the **Data Tier**.
