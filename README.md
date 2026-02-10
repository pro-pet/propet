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
| **Lucide React** | 0.563 | Icon library |

### Backend

| Technology | Version | Description |
|------------|---------|-------------|
| **NestJS** | 11.0 | Enterprise Node.js framework |
| **Express** | - | HTTP server platform |
| **TypeScript** | 5.7 | Type safety |
| **Jest** | 30.0 | Testing framework |
| **RxJS** | 7.8 | Reactive programming library |

### Engineering

| Technology | Description |
|------------|-------------|
| **pnpm** | Fast, disk space efficient package manager |
| **Turbo** | Monorepo build system |
| **ESLint** | Code linting |
| **Prettier** | Code formatting |

---

## Project Structure

```
propet/
├── apps/
│   ├── web/                 # Next.js frontend app
│   │   ├── app/             # App Router pages
│   │   ├── components/      # Page components
│   │   └── public/          # Static assets
│   └── service/             # NestJS backend service
│       ├── src/             # Source code
│       └── test/            # Test files
├── packages/
│   ├── ui/                  # Shared UI component library
│   ├── eslint-config/       # ESLint configuration
│   └── typescript-config/   # TypeScript configuration
├── turbo.json               # Turbo configuration
├── pnpm-workspace.yaml      # Workspace configuration
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 10.4

### Install Dependencies

```bash
pnpm install
```

### Start Development Server

```bash
# Start all services
pnpm dev

# Frontend only
pnpm --filter web dev

# Backend only
pnpm --filter service start:dev
```

### Build

```bash
pnpm build
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build all packages |
| `pnpm lint` | Run linting |
| `pnpm format` | Format code |

---

## Contributing

Issues and Pull Requests are welcome!

---

<div align="center">

  **Cherish every moment with your beloved pets**

</div>
