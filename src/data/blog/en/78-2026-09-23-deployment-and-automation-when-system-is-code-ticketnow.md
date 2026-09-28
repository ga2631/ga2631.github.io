---
id: 78
slug: deployment-and-automation-when-system-is-code-ticketnow
title: "Distributed System Design #07: Deployment & Automation - When Infrastructure Becomes Code (IaC)"
summary: 'In system architecture, if you have successfully designed the Edge Tier, stateless Application Tier, distributed Data Tier, and Asynchronous Tier, you are only halfway there. The remaining half that determines whether the system "survives" in reality is Deployment & Automation.'
category: devops-cloud-tooling
publishedAt: 2026-09-23
date: 2026-09-23
readTime: 12 mins
tags:
  - "System Design"
  - "Distributed Systems"
  - "Backend"
  - "Architecture"
  - "Horizontal Scaling"
---

Imagine you are the CTO of TicketNow: Tomorrow morning at 9:00 ticket sales open, estimating a need for 100 servers (nodes) to handle the load, but by 11:00 when sales are over, you must shut down 90 servers instantly to avoid "burning money". If done manually (SSH into each machine, type commands, copy code), you will fail miserably. Everything must be defined as Code (Infrastructure as Code) and completely controlled by machines.

## The Evolutionary Journey: From Traditional to Cloud-Native

TicketNow's system transformation did not happen overnight, but was a gradual restructuring roadmap across 4 phases:

- **Phase 1: Monolithic & Local:** Everything (Web, API, DB) sits together on a single server (VPS). Deployment means typing `git pull`, running `pm2`. The system dies during server upgrades or sudden ticket buying spikes.
- **Phase 2: Decoupling:** Database gets its own server. API gets its own server. Files are pushed to S3. Engineers use bash scripts to automatically copy code to 2-3 servers simultaneously.
- **Phase 3: Containerization:** Source code is packaged into **Docker Images**. A Load Balancer is placed in front. Containers are started on different machines.
- **Phase 4: Cloud-Native & Auto-scaling:** The system is handed over to Orchestration platforms like **Kubernetes (K8s)** or **Google Cloud Run**. Engineers simply declare: _"I want to run this Image, keep CPU always below 70%"_. The platform measures itself, automatically turns on more containers at 8:59, and automatically turns them off at 11:00.

## Automated Deployment Pipeline (CI/CD Pipeline)

The ultimate principle of a horizontal system is **Immutable Infrastructure**. Never jump into a running container to edit code. When there are changes, we destroy the old container and replace it with an entirely new one.

To do that, the system needs a solid CI/CD pipeline, ensuring absolutely zero downtime when updating versions.

**1. Immutable Packaging: Dockerfile Configuration**

For the system to scale fast, TicketNow's Image must be extremely lightweight. Below is a standard `Dockerfile` (Multi-stage build) for the Backend (Node.js):

```dockerfile
# Stage 1: Build (Contains heavy compiling tools)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production Runner (Only contains actual run files, super lightweight)
FROM node:20-alpine AS runner
WORKDIR /app

# Force application to run in Production mode
ENV NODE_ENV=production

# Only copy compiled files from Stage 1 over
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm ci --only=production

# SECURITY: Do not run application as root
USER node
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

_Significance:_ The resulting Image is only a few dozen MBs. Because of this, when a ticket wave hits, Kubernetes can pull this image and boot dozens of new containers in under 1 second.

**2. CI/CD Pipeline: GitHub Actions Configuration**

Every time a developer merges code into the `main` branch, the system automatically Builds the Image and deploys to Cloud Run without throwing out customers currently choosing seats.

File `.github/workflows/deploy.yml`:

```yaml
name: Auto Deploy to Google Cloud Run

on:
  push:
    branches: ["main"]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v3

      # Authenticate with GCP via Service Account JSON
      - name: Google Cloud Auth
        uses: google-github-actions/auth@v1
        with:
          credentials_json: "${{ secrets.GCP_SA_KEY }}"

      # Build and Tag Image with Git Commit Hash
      - name: Build & Push Docker Image
        run: |
          export IMAGE_TAG=asia-southeast1-docker.pkg.dev/ticketnow/repo/api:${{ github.sha }}
          docker build -t $IMAGE_TAG .
          docker push $IMAGE_TAG

      # Deploy update
      - name: Deploy to Cloud Run
        uses: google-github-actions/deploy-cloudrun@v1
        with:
          service: ticket-api-service
          image: asia-southeast1-docker.pkg.dev/ticketnow/repo/api:${{ github.sha }}
          region: asia-southeast1
          flags: "--allow-unauthenticated"
```

_Rolling Update Mechanism:_ The platform automatically forces traffic to containers holding the new code, and only "kills" old containers when their current payment requests finish executing (Graceful Shutdown).

**3. Infrastructure as Code (IaC): Terraform Configuration**

When managing hundreds of resources, you cannot click around. You write your desired configuration using Terraform. If a server cluster is accidentally deleted, just type `terraform apply`, and 3 minutes later the entire TicketNow architecture is rebuilt 100% accurately.

File `main.tf` defining the Serverless Cluster on GCP:

```hcl
# Define a Service running on Google Cloud Run
resource "google_cloud_run_v2_service" "api_service" {
  name     = "ticket-api-service"
  location = "asia-southeast1" # Singapore Data Center

  template {
    containers {
      image = "asia-southeast1-docker.pkg.dev/ticketnow/repo/api:latest"

      resources {
        limits = {
          cpu    = "2"      # 2 vCPUs for faster encryption processing
          memory = "1024Mi" # 1GB RAM
        }
      }

      # Pass Database URL only, no hardcoding in app
      env {
        name  = "DATABASE_URL"
        value = var.db_connection_string
      }
    }

    # TICKETNOW'S SCALING PROBLEM
    scaling {
      # Keep at least 5 nodes always running to avoid Cold Starts at 8:59
      min_instance_count = 5
      # Limit expansion to max 200 nodes to avoid massive Cloud bills
      max_instance_count = 200
    }
  }
}
```

**4. Auto-scaling: Kubernetes HPA Configuration**

If TicketNow manages infrastructure with Kubernetes (GKE), the soul of the architecture lies in the **HorizontalPodAutoscaler (HPA)** - the gatekeeper continuously measuring Metrics to decide whether to increase/decrease Nodes.

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
  minReplicas: 3 # Floor level
  maxReplicas: 100 # Ceiling level
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 75 # CONDITION: When avg CPU exceeds 75%, clone nodes instantly
```

> The four configuration sectors above connect to form a closed loop: _Developers write Code -> CI/CD packages into immutable Image -> Terraform provisions network infrastructure -> K8s/Cloud Run operates and scales automatically._ Thanks to these DevOps "puzzle pieces", TicketNow's engineering team can confidently sleep soundly before opening hour, letting machines automatically handle the heavy lifting. But along with automation comes another tough problem: How to control cloud costs when the system can automatically bloom to 200 servers? In the next article, we will dissect the biggest headache for management: **Distributed System Governance - Operational Costs**.
