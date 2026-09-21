---
id: "68"
slug: "database-design-2nf-resolving-partial-dependency"
title: "Database Design #02: 2NF Standard – Resolving Partial Dependency"
summary: 'The 2NF standard was introduced by Edgar F. Codd a year later (1971) in the paper "Further Normalization of the Data Base Relational Model." Codd recognized that 1NF still resulted in update anomalies, so he defined the concept of "Functional Dependency" to refine the structure.'
category: "data-engineering-analytics"
publishedAt: "01/09/2026"
date: "2026-09-01"
readTime: "5 mins read"
tags:
  - "Database"
  - "Data Engineering"
  - "2NF"
  - "Normalization"
  - "PostgreSQL"
---

## Business Scenario / Data Requirement

Our ERP system is expanding to include a **Project Allocation Module**.
Engineers have created a `Project_Assignments` table to store data on which employees are assigned to which projects, the number of working hours, as well as the `project_name` and `client_name`.

This table uses a composite primary key consisting of `(emp_id, project_id)`. However, a situation arises where a client changes their company name (`client_name`). The system is then forced to scan and `UPDATE` thousands of assignment records for all employees involved in that project. Clearly, `project_name` and `client_name` do not depend on `emp_id`; they depend solely on `project_id`. This is known as **Partial Dependency**.

## Data Modeling

The 2NF standard requires: **The table must satisfy 1NF and have NO non-key attributes that depend on only a part of the primary key.**

```mermaid
erDiagram
    "1NF_ProjectAssignments" {
        int emp_id PK
        int project_id PK
        int assigned_hours
        string project_name "Partial dependency (on project_id only)"
        string client_name "Partial dependency (on project_id only)"
    }

    "2NF_Projects" {
        int project_id PK
        string project_name
        string client_name
    }

    "2NF_ProjectAssignments" {
        int emp_id PK
        int project_id PK "FK to 2NF_Projects"
        int assigned_hours
    }

    "1NF_ProjectAssignments" ||--o{ "2NF_ProjectAssignments" : "Upgrade to 2NF"
    "2NF_Projects" ||--o{ "2NF_ProjectAssignments" : "Split Master table"
```

## Building the Pipeline / Processing Script

We extract Project information into a standalone Master table (Projects) and retain the Assignments table as a Transaction table:

```sql
-- 1. Create Projects table (Master Data)
CREATE TABLE projects_2nf AS
SELECT DISTINCT project_id, project_name, client_name
FROM project_assignments_1nf;

ALTER TABLE projects_2nf ADD PRIMARY KEY (project_id);

-- 2. Create 2NF-compliant Assignments table
CREATE TABLE project_assignments_2nf AS
SELECT emp_id, project_id, assigned_hours
FROM project_assignments_1nf;

ALTER TABLE project_assignments_2nf ADD PRIMARY KEY (emp_id, project_id);
ALTER TABLE project_assignments_2nf
ADD FOREIGN KEY (project_id) REFERENCES projects_2nf(project_id);
-- (Note: emp_id should also have a foreign key referencing the employees_1nf table from the previous lesson)
```

## Data Testing & Performance Optimization

- **Update Testing:** Now, when a client changes their name, we only need to execute a single `UPDATE` statement: `UPDATE projects_2nf SET client_name = 'New Client' WHERE project_id = 101;`. The data is immediately synchronized across the entire assignment system.
- **Space Optimization:** Long strings (such as project names or client names) are no longer repeated thousands of times, which reduces storage requirements and speeds up data scanning.

## Summary & Recommendations

The 2NF standard effectively resolves the issues associated with tables using Composite Keys. A core principle in ERP systems is to always separate Master Data (e.g., Projects, Clients) from Transaction Data (e.g., Assignments, Timekeeping records).
