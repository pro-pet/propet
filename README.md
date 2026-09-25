<div align="center">
  <img src="apps/web/public/logo-rounded.svg" alt="ProPet Logo" width="120" height="120" />

  # ProPet

  **Let Every Pet Be the Star**

  A social sharing platform focused on pets themselves, not their owners

  [![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?style=flat-square&logo=nestjs)](https://nestjs.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
  [![pnpm](https://img.shields.io/badge/pnpm-10.4-F69220?style=flat-square&logo=pnpm)](https://pnpm.io/)

  [简体中文](./README.zh-CN.md) | English

</div>

---

## About

ProPet is an innovative pet social platform. Unlike traditional social media, we focus on **the pets themselves** rather than their owners. Here, every cat, dog, hamster, or other adorable creature has their own "social account" to record their daily life, growth journey, and fun moments.

### Core Concepts

- **Pet-Centric** - Each pet is an individual with their own profile and story
- **Growth Records** - Document the complete journey from baby to adult
- **Community** - Connect owners of similar breeds or interests
- **Health Management** - Track vaccinations, checkups, and diet

> **Project Status**: Currently in the framework stage, core features under development

---

## Tech Stack

### Frontend

| Technology | Version | Description |
|------------|---------|-------------|
| **Next.js** | 16.1 | React full-stack framework with SSR/SSG |
| **React** | 19.2 | UI library |
| **TypeScript** | 5.9 | Type-safe JavaScript |
| **Tailwind CSS** | 4.1 | Utility-first CSS framework |
| **shadcn/ui** | - | Radix UI based component library |
| **Radix UI** | 1.4 | Accessible UI primitives |
| **Hugeicons React** | - | Icon library |

### Backend

| Technology | Version | Description |
|------------|---------|-------------|
| **NestJS** | 11.0 | Enterprise Node.js framework |
| **Express** | - | HTTP server platform |
| **TypeScript** | 5.9 | Type safety |
| **Jest** | 30.0 | Testing framework |
| **MySQL** | 8.4 | Persistent relational database in Docker |
| **Prisma** | 7.4 | ORM, versioned migrations and generated client |
| **RxJS** | 7.8 | Reactive programming library |

### Engineering

| Technology | Description |
|------------|-------------|
| **pnpm** | Fast, disk space efficient package manager |
| **Turbo** | Monorepo build system |
| **ESLint** | Code linting |
| **Prettier** | Code formatting |

---

## Getting Started

Requirements: Node.js 22.12+ (Node.js 22 LTS recommended), pnpm 10.4.1, and a running Docker Desktop or Docker Engine with Compose v2.

### Local apps with Docker MySQL

```bash
pnpm install
# First-time setup only; edit an existing .env instead of replacing it
cp .env.example .env
pnpm db:up
pnpm db:generate
pnpm db:deploy
pnpm db:seed     # Optional: test@propet.com / password123
pnpm dev
```

Open <http://localhost:3000> for the web app, <http://localhost:3001/api> for the API, or <http://localhost:3001/docs> for development API docs. `/api/health` checks database connectivity.

MySQL 8.4 persists data in a named volume. The default connection is `127.0.0.1:3306`, database/user `propet`, password `propet_dev_password`. Initialization also creates `propet_shadow` for development migrations and `propet_test` for integration tests.

The API, web app and Prisma CLI read configuration in this order: process environment → `.env.<environment>.local` → `.env.local` → `.env` → `.env.<environment>`. Compose reads the root `.env`. If you change MySQL credentials or its host port, update both database URLs too. Containers always connect to `mysql:3306`. Changing environment variables does not change passwords in an existing volume.

### Run everything in Docker

```bash
pnpm docker:up
# Optional demo user:
# docker compose --profile app run --rm migrate pnpm db:seed
pnpm docker:logs
pnpm docker:down
```

Alternatively, run `docker compose --profile app up -d --build --wait` without installing Node.js or pnpm locally. Compose waits for MySQL, applies versioned migrations, then starts the API and web app. The Next.js server uses `http://service:3001` internally; browser ports remain 3000/3001.

Image builds require network access for dependencies and Next.js fonts. Stopping the stack preserves data; `docker compose --profile app down -v` deletes its databases. Default credentials and JWT secrets are for local development. Configure real secrets and HTTPS for deployment.

### Migrations and tests

```bash
# After editing schema.prisma
pnpm db:migrate --name describe_change
pnpm db:generate

# Apply committed migrations
pnpm db:deploy
pnpm --filter @propet/service test --runInBand

# Dedicated test database with the default Docker development credentials
DATABASE_URL='mysql://propet:propet_dev_password@127.0.0.1:3306/propet_test' pnpm db:deploy
TEST_DATABASE_URL='mysql://propet:propet_dev_password@127.0.0.1:3306/propet_test' pnpm --filter @propet/service test:e2e --runInBand

pnpm build
```

Integration tests use real MySQL for authentication, post CRUD, JSON image arrays, Unicode, UTC dates and ownership checks. They require an explicit `TEST_DATABASE_URL` and only remove records they create.

Backend users, pets and posts now use Prisma 7 with MySQL. Frontend sections without API integration may still show sample data. Active MySQL migrations live in `apps/service/prisma/migrations`. The new baseline creates schema only and **does not import existing database data**; export, transform and import any existing data separately.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start local apps after starting MySQL and applying migrations |
| `pnpm db:up` / `pnpm db:stop` | Start / stop Docker MySQL, preserving data |
| `pnpm db:logs` | Follow MySQL logs |
| `pnpm db:generate` | Generate Prisma Client |
| `pnpm db:deploy` / `pnpm db:migrate` | Apply / create migrations |
| `pnpm db:seed` / `pnpm db:studio` | Seed a demo account / browse the database |
| `pnpm docker:up` / `pnpm docker:down` | Start / stop the full container stack |
| `pnpm docker:logs` | Follow container logs |
| `pnpm build` | Build all packages |
| `pnpm lint` | Run linting |
| `pnpm format` | Format code |

---

<div align="center">

  **Cherish every moment with your beloved pets**

</div>
