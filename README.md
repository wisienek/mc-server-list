# McList Knowledgebase

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Monorepo Structure (Nx)](#monorepo-structure-nx)
3. [Applications](#applications)
    - [Frontend (Next.js)](#frontend-nextjs)
    - [Backend API (NestJS)](#backend-api-nestjs)
4. [Libraries](#libraries)
5. [Backend Architecture: Modules, Controllers, Endpoints](#backend-architecture-modules-controllers-endpoints)
6. [Deployment Guide](#deployment-guide)
    - [Kubernetes (Recommended)](#kubernetes-recommended)
    - [Secrets Reference](#secrets-reference)
    - [Docker Compose (Local Dev)](#docker-compose-local-dev)
    - [Cloud Providers (AWS/GCP)](#cloud-providers-awsgcp)
7. [Debugging & Logs](#debugging--logs)
    - [Application Logs](#application-logs)
    - [Kubernetes Logs](#kubernetes-logs)
    - [Remote Server Debugging](#remote-server-debugging)
8. [Technical Specifications](#technical-specifications)
    - [Minimum Requirements](#minimum-requirements)
    - [Database & Resources](#database--resources)
    - [Environment Variables](#environment-variables)
9. [FAQ & Useful Commands](#faq--useful-commands)

---

## Project Overview

**McList** is a full-stack, monorepo project for managing and listing Minecraft servers. It is designed for scalability, maintainability, and cloud-native deployment. The project uses:

-   **Nx** for monorepo management
-   **Next.js** for the frontend (React, SSR, i18n, Sentry)
-   **NestJS** for the backend API (TypeScript, TypeORM, CQRS, Sentry, Passport.js)
-   **PostgreSQL** for persistent data
-   **Redis** for caching and session management
-   **Kubernetes** for production deployment, with Docker Compose for local development

---

## Monorepo Structure (Nx)

-   **apps/**: Deployable applications
    -   `front`: Next.js frontend
    -   `server`: NestJS backend API
-   **libs/**: Shared and domain-specific libraries
    -   `backend/`: Auth, commander (CQRS), config, database, logger, mc-stats-api, redis
    -   `frontend/`: React components
    -   `shared/`: DTOs, enums, types, core helpers
-   **k8s/**: Kubernetes manifests (deployments, services, ingress, secrets, etc.)
-   **.github/**: CI/CD workflows (Docker build, push, deploy)
-   **.docker/**: Local Docker resources (e.g., Postgres data)
-   **docker-compose.yml**: Local dev stack (Postgres, Redis)

---

## Applications

### Frontend (Next.js)

-   **Path**: `apps/front`
-   **Tech**: Next.js, React, TypeScript, i18n (multi-language), Sentry integration
-   **Purpose**: User-facing web app for browsing, searching, and managing Minecraft servers
-   **Key Features**:
    -   Multi-language support (i18n, locales: pl, en, de, fr, it)
    -   OAuth2 login (Discord)
    -   Server list, search, voting, server details
    -   Responsive, modern UI
    -   Error tracking with Sentry
-   **Build/Serve**: `npx nx build front` / `npx nx serve front`
-   **Dockerfile**: `apps/front/Dockerfile`
-   **Environment Variables**:
    -   `NEXT_PUBLIC_API_URL`: URL to backend API (e.g., `https://yourdomain/api`)
    -   `NEXT_PUBLIC_DOMAIN`: Public domain for the frontend
    -   `NEXT_PUBLIC_SENTRY_DSN`: Sentry DSN for error tracking (optional)

### Backend API (NestJS)

-   **Path**: `apps/server`
-   **Tech**: NestJS, TypeORM, PostgreSQL, Redis, CQRS, Sentry, Passport.js
-   **Purpose**: REST API for server management, user authentication, server verification, voting, etc.
-   **Key Features**:
    -   Modular architecture (Users, Servers, Auth, Logger, etc.)
    -   CQRS pattern for commands/queries/events
    -   TypeORM for DB access, migrations
    -   Redis for caching and session storage
    -   Sentry for error tracking
    -   Swagger docs at `/api/docs`
-   **Build/Serve**: `npx nx build server` / `npx nx serve server`
-   **Dockerfile**: `apps/server/Dockerfile`
-   **Environment Variables**:
    -   `APP_PORT`: Port to run the API (default: 3000)
    -   `COOKIE_SECRET`: Secret for session cookies
    -   `DB_*`: Database connection (see below)
    -   `REDIS_*`: Redis connection (see below)
    -   `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, `DISCORD_REDIRECT_URI`: Discord OAuth2
    -   `SENTRY_*`: Sentry integration

---

## Libraries

### Backend Libraries (`libs/backend/`)

-   **auth**: Guards, decorators, strategies for authentication (e.g., Discord OAuth2, JWT, session)
-   **commander**: CQRS commands, queries, events, sagas (used for server verification, voting, etc.)
-   **config**: Centralized configuration schemas using Zod (API, DB, Redis, etc.)
-   **database**: TypeORM entities (User, Server, Vote, etc.), migrations, DB module
-   **logger**: Winston-based logger, HTTP interceptors, log formatting (pretty in dev, JSON in prod)
-   **mc-stats-api**: Integration with Minecraft stats APIs
-   **redis**: Redis client, repository, and module for caching/session

### Frontend Libraries (`libs/frontend/`)

-   **components**: Shared React components (atoms, molecules, organisms, themes)

### Shared Libraries (`libs/shared/`)

-   **core**: Shared helpers, error classes
-   **dto**: Data Transfer Objects (validation, serialization)
-   **enums**: Shared enums (e.g., server types, user roles)
-   **types**: Shared TypeScript types (e.g., Minecraft server info, ports)

---

## Backend Architecture: Modules, Controllers, Endpoints

### Main Modules (see `apps/server/src/app/app.module.ts`)

-   **DatabaseModule**: Sets up TypeORM, runs migrations, provides DB connection
-   **LoggerModule**: Provides request/response logging, error logging, context-aware logs
-   **UsersModule**: User registration, login (Discord OAuth2), profile, password management
-   **ServersModule**: Server CRUD, verification, voting, server info, search
-   **RedisModule**: Redis client for caching and session storage
-   **CQRS (CqrsModule)**: Command/Query separation for business logic
-   **SentryModule**: Error tracking and reporting
-   **ThrottlerModule**: Rate limiting (e.g., 20 requests/minute)
-   **ScheduleModule**: Cron jobs for periodic tasks (e.g., server verification)
-   **PassportModule**: Session and OAuth2 authentication

### Example Controllers & Endpoints

-   **UsersController** (`/api/users`):
    -   `POST /register`: Register new user
    -   `POST /login`: Login via Discord OAuth2
    -   `GET /me`: Get current user profile
    -   `POST /set-password`: Set or change password
-   **ServersController** (`/api/servers`):
    -   `POST /`: Add new server
    -   `GET /`: List/search servers
    -   `GET /:id`: Get server details
    -   `POST /:id/verify`: Start verification process
    -   `POST /:id/vote`: Vote for a server
    -   `GET /:id/votes`: Get vote count
-   **Swagger Docs**: `/api/docs` (auto-generated, interactive)

**To explore all endpoints:**

-   Run the backend and visit `/api/docs` for full, up-to-date API documentation.

---

## Deployment Guide

### Kubernetes (Recommended)

#### 1. Build Docker Images

-   Frontend: `docker build -t <docker_user>/mc-sv-list-frontend:latest -f apps/front/Dockerfile .`
-   Backend: `docker build -t <docker_user>/mc-sv-list-api:latest -f apps/server/Dockerfile .`

#### 2. Push Images to Registry

-   Push to Docker Hub or your private registry

#### 3. Prepare Kubernetes Manifests

-   Edit `k8s/*.yaml` for your domain, email, and Docker username
-   Use `k8s/deploy.sh` to apply secrets and manifests
-   Main manifests:
    -   `api-deployment.yaml`, `frontend-deployment.yaml`: Deploy API and frontend
    -   `postgres-deployment.yaml`, `redis-deployment.yaml`: Deploy Postgres and Redis
    -   `api-ingress.yaml`, `frontend-ingress.yaml`: Ingress rules (Traefik, TLS)
    -   `cert-issuer.yaml`: LetsEncrypt ClusterIssuer
    -   `api-strip-middleware.yaml`: Traefik middleware to strip `/api` prefix

#### 4. Deploy

-   `kubectl apply -f k8s/`
-   Or use the provided GitHub Actions workflow for CI/CD deployment

#### 5. Ingress & TLS

-   Uses Traefik and cert-manager for HTTPS
-   Ingress rules in `k8s/api-ingress.yaml` and `k8s/frontend-ingress.yaml`

### Secrets Reference

Secrets are managed via Kubernetes secrets (see `k8s/deploy.sh`). **Each secret is required for a secure, functional deployment.**

| Secret Name                      | Purpose                                             | Default/Example Value             |
| -------------------------------- | --------------------------------------------------- | --------------------------------- |
| `COOKIE_SECRET`                  | Secret for signing session cookies (backend)        | Random 16+ char string            |
| `DISCORD_CLIENT_ID`              | Discord OAuth2 client ID (backend, frontend)        | From Discord Developer Portal     |
| `DISCORD_CLIENT_SECRET`          | Discord OAuth2 client secret                        | From Discord Developer Portal     |
| `DISCORD_REDIRECT_URI`           | OAuth2 redirect URI (must match Discord app config) | `https://<domain>/oauth/callback` |
| `POSTGRES_PASSWORD`              | Password for Postgres DB (backend, Postgres pod)    | Set by you, e.g. `supersecret`    |
| `AUTOMATIC_VERIFICATION`         | Enable/disable auto server verification (backend)   | `true` or `false`                 |
| `AUTOMATIC_SERVER_TIMEOUT_TIMES` | Timeout threshold for server inactivity (backend)   | e.g. `3`                          |
| `AUTOMATIC_SERVER_TIMEOUT_BATCH` | Batch size for timeout checks (backend)             | e.g. `50`                         |
| `TOKEN_EXPIRATION_HOURS`         | JWT/session token expiration (backend)              | e.g. `336` (14 days)              |
| `NEXT_PUBLIC_SENTRY_DSN`         | Sentry DSN for frontend error tracking              | From Sentry                       |
| `BE_SENTRY_URL`                  | Sentry DSN for backend error tracking               | From Sentry                       |
| `SENTRY_AUTH_TOKEN`              | Sentry auth token for CI/CD releases                | From Sentry                       |
| `SENTRY_ORG`                     | Sentry organization name                            | From Sentry                       |
| `SENTRY_PROJECT`                 | Sentry project name                                 | From Sentry                       |

**Defaults:**

-   For local dev, you can use `.env.example` as a template.
-   For production, always use strong, unique secrets.

#### Database & Redis

-   Deployed as pods/services (`k8s/postgres-deployment.yaml`, `k8s/redis-deployment.yaml`)
-   Postgres DB: `mc-list` (user: `AdminUser`)
-   Redis: default port 6379

### Docker Compose (Local Dev)

-   Use `docker-compose.yml` for local development
-   Services: `pg_db` (Postgres), `redis`
-   Configure `.env` for local overrides (see `.env.example`)
-   Example:
    -   `DB_DATABASE=mc-list`
    -   `DB_USERNAME=AdminUser`
    -   `DB_PASSWORD=supersecret`
    -   `REDIS_PORT=6379`

### Cloud Providers (AWS/GCP)

-   **AWS**: Use EKS (Elastic Kubernetes Service), ECR for Docker images, RDS for managed Postgres, ElastiCache for Redis
-   **GCP**: Use GKE (Google Kubernetes Engine), GCR for Docker images, Cloud SQL for Postgres, Memorystore for Redis
-   Adapt manifests for cloud-specific storage, ingress, and secrets management (e.g., use AWS Secrets Manager or GCP Secret Manager)
-   Use persistent storage classes for Postgres data

---

## Debugging & Logs

### Application Logs

-   **Backend**: Winston logger, logs to stdout (console)
    -   Log level via `LOG_LEVEL` env var (`info`, `debug`, `warn`, `error`)
    -   Pretty logs in dev, JSON in production
    -   Logs include request context, user info, trace IDs
-   **Frontend**: Next.js logs to stdout
-   **Sentry**: Errors are reported to Sentry if configured (see Sentry DSN secrets)

### Kubernetes Logs

-   **Get pod logs**:
    -   `kubectl get pods` (list pods)
    -   `kubectl logs <pod-name>` (view logs)
    -   `kubectl logs -f <pod-name>` (stream logs)
-   **Restart deployments**:
    -   `kubectl rollout restart deployment <deployment-name>`
-   **Check services/deployments**:
    -   `kubectl get services`
    -   `kubectl get deployments`
-   **Debugging tips**:
    -   Use `kubectl describe pod <pod-name>` for detailed info (env, events, mounts)
    -   Check events: `kubectl get events --sort-by=.metadata.creationTimestamp`
    -   Use `kubectl exec -it <pod> -- /bin/sh` for shell access

### Remote Server Debugging

-   SSH into server: `ssh <user>@<host>`
-   Use `docker ps`, `docker logs <container>` for Docker troubleshooting
-   Use `journalctl -u k3s` for k3s (Kubernetes) logs if using k3s
-   Check `/var/log/containers/` for raw pod logs
-   Use `htop`, `df -h`, `free -m` to monitor resources

---

## Technical Specifications

### Minimum Requirements

-   **CPU**: 2+ vCPU (4+ for production, especially with traffic)
-   **RAM**: 2GB+ (4GB+ for production)
-   **Disk**: 10GB+ SSD (more for large DBs or logs)
-   **OS**: Linux (Ubuntu 20.04+ recommended), or any OS supporting Docker/K8s
-   **Node.js**: 18+
-   **Docker**: 23+
-   **Kubernetes**: 1.25+
-   **PostgreSQL**: 14+ (official Docker image used)
-   **Redis**: 7+

### Database & Resources

-   **Database**: PostgreSQL (default DB: `mc-list`, user: `AdminUser`)
-   **Cache**: Redis (default port: 6379)
-   **Storage**: PersistentVolumeClaim for Postgres data (see `k8s/postgres-deployment.yaml`)
-   **Env Vars**: See [Secrets Reference](#secrets-reference) and `libs/backend/config/src/lib/schema/`

### Environment Variables

-   **API**:
    -   `APP_PORT`: Port for API (default: 3000)
    -   `COOKIE_SECRET`: Session cookie secret (required)
    -   `TOKEN_EXPIRATION_HOURS`: Session/JWT expiration (default: 336)
    -   `AUTOMATIC_VERIFICATION`: Enable/disable auto server verification (default: true)
    -   `AUTOMATIC_SERVER_TIMEOUT_TIMES`: Timeout threshold (default: 3)
    -   `AUTOMATIC_SERVER_TIMEOUT_BATCH`: Batch size for timeouts (default: 50)
-   **Database**:
    -   `DB_HOST`: Postgres host (default: `localhost` or `postgres-service` in K8s)
    -   `DB_PORT`: Postgres port (default: 5432)
    -   `DB_USERNAME`: Postgres user (default: `AdminUser`)
    -   `DB_DATABASE`: Postgres DB (default: `mc-list`)
    -   `DB_PASSWORD`: Postgres password (required)
-   **Redis**:
    -   `REDIS_HOST`: Redis host (default: `localhost` or `redis-service` in K8s)
    -   `REDIS_PORT`: Redis port (default: 6379)
-   **Discord OAuth2**:
    -   `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, `DISCORD_REDIRECT_URI`
-   **Sentry**:
    -   `NEXT_PUBLIC_SENTRY_DSN`, `BE_SENTRY_URL`, `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT`

---

## FAQ & Useful Commands

### Nx Workspace

-   List all projects: `npx nx show projects`
-   Run app: `npx nx serve <app>`
-   Build app: `npx nx build <app>`
-   Test app/lib: `npx nx test <project>`
-   Show project targets: `npx nx show project <project>`

### Database Migrations

-   Generate: `yarn run typeorm -d libs/backend/database/src/config/cli-data-source/app.ts migration:generate libs/backend/database/src/migrations/<name>`
-   Run: `yarn run typeorm -d libs/backend/database/src/config/cli-data-source/app.ts migration:run`
-   Revert: `yarn run typeorm -d libs/backend/database/src/config/cli-data-source/app.ts migration:revert`

### Kubernetes

-   Deploy: `kubectl apply -f k8s/`
-   Get pods: `kubectl get pods`
-   Logs: `kubectl logs <pod>`
-   Restart: `kubectl rollout restart deployment <deployment>`
-   Shell into pod: `kubectl exec -it <pod> -- /bin/sh`
-   Get all resources: `kubectl get all`

### Docker Compose

-   Start: `docker-compose up`
-   Stop: `docker-compose down`
-   View logs: `docker-compose logs -f`

---

## Contributing & Community

-   PRs and issues welcome!
-   See LICENSE for terms (AGPL-3.0)

---

For further details, see code comments, Swagger docs, and the `/k8s` and `/libs` directories for advanced configuration. For questions about secrets, deployment, or debugging, see the [Secrets Reference](#secrets-reference) and [Debugging & Logs](#debugging--logs) sections above.

## Environment Variables (Complete Reference)

Below is a comprehensive table of all environment variables used in the project. Set these in your `.env` file (for local dev), as Kubernetes secrets (for production), or as GitHub Actions secrets (for CI/CD).

| Variable Name                    | Purpose/Usage                                       | Default/Example Value             |
| -------------------------------- | --------------------------------------------------- | --------------------------------- |
| `APP_PORT`                       | Port for backend API                                | `3000`                            |
| `NODE_ENV`                       | Node.js environment (`development`/`production`)    | `production`                      |
| `LOG_LEVEL`                      | Log verbosity (`info`, `debug`, `warn`, `error`)    | `info`                            |
| `COOKIE_SECRET`                  | Secret for signing session cookies (backend)        | Random 16+ char string            |
| `DB_HOST`                        | Postgres host                                       | `localhost`/`postgres-service`    |
| `DB_PORT`                        | Postgres port                                       | `5432`                            |
| `DB_USERNAME`                    | Postgres user                                       | `AdminUser`                       |
| `DB_DATABASE`                    | Postgres database name                              | `mc-list`                         |
| `DB_PASSWORD`                    | Postgres password                                   | (set by you)                      |
| `REDIS_HOST`                     | Redis host                                          | `localhost`/`redis-service`       |
| `REDIS_PORT`                     | Redis port                                          | `6379`                            |
| `DISCORD_CLIENT_ID`              | Discord OAuth2 client ID                            | From Discord Developer Portal     |
| `DISCORD_CLIENT_SECRET`          | Discord OAuth2 client secret                        | From Discord Developer Portal     |
| `DISCORD_REDIRECT_URI`           | OAuth2 redirect URI (must match Discord app config) | `https://<domain>/oauth/callback` |
| `AUTOMATIC_VERIFICATION`         | Enable/disable auto server verification (backend)   | `true` or `false`                 |
| `AUTOMATIC_SERVER_TIMEOUT_TIMES` | Timeout threshold for server inactivity (backend)   | `3`                               |
| `AUTOMATIC_SERVER_TIMEOUT_BATCH` | Batch size for timeout checks (backend)             | `50`                              |
| `TOKEN_EXPIRATION_HOURS`         | JWT/session token expiration (backend)              | `336` (14 days)                   |
| `NEXT_PUBLIC_API_URL`            | Public URL to backend API (frontend)                | `https://<domain>/api`            |
| `NEXT_PUBLIC_DOMAIN`             | Public domain for frontend                          | `https://<domain>`                |
| `NEXT_PUBLIC_ENV`                | Frontend environment indicator                      | `production`/`development`        |
| `NEXT_PUBLIC_SENTRY_DSN`         | Sentry DSN for frontend error tracking              | From Sentry                       |
| `BE_SENTRY_URL`                  | Sentry DSN for backend error tracking               | From Sentry                       |
| `SENTRY_ORG`                     | Sentry organization name                            | From Sentry                       |
| `SENTRY_PROJECT`                 | Sentry project name                                 | From Sentry                       |
| `SENTRY_AUTH_TOKEN`              | Sentry auth token for CI/CD releases                | From Sentry                       |
| `CI_COMMIT_SHORT_SHA`            | Git commit SHA (used in CI/CD, optional)            | (set by CI)                       |
| `CI`                             | Set to `true` in CI environments                    | (set by CI)                       |
| `NX_TASK_TARGET_PROJECT`         | Used by Nx for logging context                      | (set by Nx)                       |
| `TRACING_SERVICE_NAME`           | Used for distributed tracing (optional)             |                                   |
| `NEXT_RUNTIME`                   | Next.js runtime (edge/nodejs, internal)             |                                   |

**Note:** Only variables prefixed with `NEXT_PUBLIC_` are exposed to the browser/frontend.

---

## Logs: How to Check Application and Traefik Logs

### 1. Application Logs (Node.js/Backend/Frontend)

-   **Local development:**
    -   Run with `npx nx serve server` or `npx nx serve front` and view logs in your terminal.
    -   With Docker Compose: `docker-compose logs -f server` or `docker-compose logs -f front`
-   **Kubernetes:**
    -   List pods: `kubectl get pods`
    -   View logs: `kubectl logs <pod-name>` (e.g., `kubectl logs deployment/api`)
    -   Stream logs: `kubectl logs -f <pod-name>`
    -   For deployments: `kubectl logs deployment/<deployment-name>`
-   **Log format:**
    -   Pretty logs in development, JSON logs in production.
    -   Log level controlled by `LOG_LEVEL` env var.

### 2. Traefik Logs (Ingress Controller)

-   **Kubernetes (k3s default):**
    -   Traefik usually runs in the `kube-system` namespace.
    -   List pods: `kubectl get pods -n kube-system | grep traefik`
    -   View logs: `kubectl logs -n kube-system deployment/traefik` or `kubectl logs -n kube-system <traefik-pod-name>`
    -   If using k3s: `journalctl -u k3s | grep traefik`
-   **Docker Compose:**
    -   If Traefik is defined as a service: `docker-compose logs -f traefik`
-   **What to look for:**
    -   Traefik logs show HTTP routing, SSL/TLS issues, and ingress errors.
    -   Useful for debugging 404s, SSL problems, or routing issues.

---

## Changing the Database

-   **Kubernetes:**
    -   Edit `k8s/postgres-deployment.yaml` to change the Postgres image, user, password, or storage.
    -   Update DB connection env vars in your Kubernetes secrets (see [Secrets Reference](#environment-variables-complete-reference)).
-   **Local development:**
    -   Edit `.env` or `docker-compose.yml` to change DB settings.
    -   Example for `.env`:
        ```env
        DB_HOST=localhost
        DB_PORT=5432
        DB_USERNAME=AdminUser
        DB_DATABASE=mc-list
        DB_PASSWORD=supersecret
        ```
-   **Production/Cloud:**
    -   Use a managed DB (e.g., AWS RDS, GCP Cloud SQL) and set the connection info in your secrets.
    -   Update `DB_HOST`, `DB_PORT`, etc., to point to your managed DB instance.

---

## Where to Put Environment Variables and Secrets

-   **Local development:**
    -   Use a `.env` file in the root, or in `apps/front`/`apps/server` as needed.
    -   Example: copy `.env.example` to `.env` and fill in your values.
-   **Kubernetes:**
    -   Use `k8s/deploy.sh` to create secrets from your environment, or manually create secrets with `kubectl create secret ...`.
    -   Secrets are referenced in deployment manifests (see `envFrom` in `k8s/api-deployment.yaml`).
    -   Example: `kubectl create secret generic mc-secrets --from-literal=DB_PASSWORD=supersecret ...`
-   **GitHub Actions (CI/CD):**
    -   Set secrets in your repo's **Settings > Secrets and variables > Actions**.
    -   These are used for Docker builds, pushing to registries, and remote deployment.
    -   Example secrets: `DOCKER_USERNAME`, `DOCKER_PASSWORD`, `POSTGRES_PASSWORD`, `COOKIE_SECRET`, etc.
-   **Frontend:**
    -   Only variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. All others are server-only.

---

## Example: Adding/Changing a Secret in GitHub Actions

1. Go to your repository on GitHub.
2. Click **Settings > Secrets and variables > Actions**.
3. Click **New repository secret**.
4. Enter the name (e.g., `POSTGRES_PASSWORD`) and value.
5. Reference these secrets in your GitHub Actions workflow (see `.github/workflows/docker-kubernetes-vps-build.yml`).

---

## Example: Adding/Changing a Secret in Kubernetes

```sh
kubectl create secret generic mc-secrets \
  --from-literal=DB_PASSWORD=supersecret \
  --from-literal=COOKIE_SECRET=your_cookie_secret \
  ...
```

Or use the provided `k8s/deploy.sh` script, which reads from your environment.

---

For more, see the [Deployment Guide](#deployment-guide) and [Technical Specifications](#technical-specifications) sections above.
