---
id: 41
slug: "optimizing-the-ad-performance-reporting-system-for-1000-ccu"
title: "From 100 to 1000 CCU #02: Optimizing the Ad Performance Reporting System for 1000 CCU: Moving to Data Architecture"
summary: "When traffic increases 10-fold (1000 CCU) and data volume balloons to tens of GB/TB, a monolithic architecture will completely collapse. This article presents a solution to transition to a Modern Data Architecture. The core of this model is the complete separation of the operational Database (PostgreSQL) and the Data Warehouse (BigQuery), applying Cache (Redis) as a shield to protect the system from query storms, and building a professional Data Pipeline."
category: "architecture-system-design"
publishedAt: "2026-09-28"
date: "2026-09-28"
readTime: "5 minutes read"
tags:
  - "System design"
  - "Data architecture"
  - "BigQuery"
  - "Redis"
  - "ETL"
---

## Context & Problem

The reporting platform is a huge success, and the customer base is skyrocketing. At the end of the month, up to 1000 CCU access the system simultaneously to export reports and view Custom Dimensions on a massive amount of historical data.
The old system begins to reveal its fatal flaws: Chart loading takes more than 10 seconds, the Database constantly reports 100% CPU, and batch jobs for updating data spill over into working hours due to too much data needing processing.

## System Requirements

- **Performance:** Dashboards load in under 1 second, even when querying months of data.
- **Load Capacity:** 1000 CCU, capable of auto-scaling during traffic spikes.
- **Data:** Extremely large analytical data, supporting multi-dimensional queries (OLAP).
- **Availability:** 99.9%, serving 24/7 without a single point of failure (SPOF).

## Architecture Design

The architecture must now strictly separate the write flow (Data Pipeline) from the read flow (API / Dashboard).

```mermaid
graph TD
    Client[Client] --> CDN[Cloudflare / CDN]
    CDN --> LB[Load Balancer]

    subgraph App Cluster [Backend Auto-Scaling Group]
        LB --> API1[API Node 1 - Docker]
        LB --> API2[API Node 2 - Docker]
    end

    subgraph Caching Layer
        API1 <--> Redis[(Redis Cluster)]
        API2 <--> Redis
    end

    subgraph Data Warehousing
        API1 --> BQ[(BigQuery / OLAP)]
        API2 --> BQ
    end

    subgraph Operational DB
        API1 <--> PG[(PostgreSQL - Users/Auth)]
        API2 <--> PG
    end

    subgraph Data Pipeline [Medallion Architecture]
        Extract[ETL Workers - Rust/Python] -->|API Pull| AdNetworks[Google/Facebook Ads]
        Extract -->|Raw| Datalake[(Cloud Storage)]
        Datalake -->|Transform| BQ
    end
```

- **Load Balancing & Backend Cluster:** Requests pass through the Load Balancer and are distributed to Backend Nodes running in Docker containers for easy auto-scaling.
- **Caching Layer (Redis):** All static report query results are hashed by parameters and stored in Redis. 80% of user requests will be returned directly from Redis without touching the Database.
- **Data Warehouse (BigQuery):** Responsible for storing and processing analytical queries (OLAP). BigQuery is designed to scan TBs of data in seconds.
- **Data Pipeline (ETL):** Uses high-performance languages (like Rust or Python) to extract data, dump it into the Data Lake, and then transform and load it into BigQuery following the Medallion architecture standard.

## Trade-off Analysis

- **Performance vs. Data Stale:** Using a Cache (Redis) helps the system handle loads excellently, but users might see data that is a few minutes "old". A reasonable Cache Invalidation strategy must be designed.
- **Operational Costs:** Using a Data Warehouse like BigQuery incurs charges based on the amount of data scanned. If the backend does not control this well and directly queries without filters (WHERE), infrastructure bills will skyrocket.

## Real-world Lessons & Best Practices

1.  **Block Query Storms (Query Throttling/Debouncing):** When 1000 users hit F5 continuously without Cache, the Data Warehouse will overload. Redis must act as an iron shield. Rate Limiting mechanisms on the API server should also be integrated.
2.  **Optimize Data Model on OLAP:** Data in the Data Warehouse needs to be Denormalized and Partitioned/Clustered by date and `client_id`. This reduces the amount of scanned data by up to 90% during queries, increasing speed and reducing costs.
3.  **Service Separation:** Use a dedicated PostgreSQL for CRUD operations (creating users, permissions, campaign configuration) and let BigQuery purely handle metric calculations. Absolutely do not perform cross-database queries at the API layer.
