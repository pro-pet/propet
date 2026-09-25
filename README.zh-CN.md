<div align="center">
  <img src="apps/web/public/logo-rounded.svg" alt="ProPet Logo" width="120" height="120" />

  # ProPet

  **让每一只宠物都成为主角**

  一个专注于宠物本身的社交分享平台，记录它们的成长、分享它们的故事

  [![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?style=flat-square&logo=nestjs)](https://nestjs.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
  [![pnpm](https://img.shields.io/badge/pnpm-10.4-F69220?style=flat-square&logo=pnpm)](https://pnpm.io/)

  简体中文 | [English](./README.md)

</div>

---

## ✨ 项目简介

ProPet 是一个创新的宠物社交平台，与传统社交媒体不同，我们将焦点放在**宠物本身**而非宠物主人。在这里，每一只猫咪、狗狗、仓鼠或其他小可爱都拥有属于自己的"社交账号"，记录它们的日常、成长轨迹和有趣瞬间。

### 🎯 核心理念

- **宠物为中心** - 每只宠物都是独立的个体，拥有自己的主页和故事
- **成长记录** - 从幼崽到成年，完整记录宠物的成长历程
- **社区互动** - 让相同品种或兴趣的宠物主人们相互交流
- **健康管理** - 记录疫苗、体检、饮食等健康信息

> 🚧 **项目状态**: 目前处于框架搭建阶段，核心功能正在开发中

---

## 🛠️ 技术栈

### 前端 (Frontend)

| 技术 | 版本 | 说明 |
|------|------|------|
| **Next.js** | 16.1 | React 全栈框架，支持 SSR/SSG |
| **React** | 19.2 | 用户界面库 |
| **TypeScript** | 5.9 | 类型安全的 JavaScript |
| **Tailwind CSS** | 4.1 | 原子化 CSS 框架 |
| **shadcn/ui** | - | 基于 Radix UI 的组件库 |
| **Radix UI** | 1.4 | 无障碍 UI 原语 |
| **Hugeicons React** | - | 图标库 |

### 后端 (Backend)

| 技术 | 版本 | 说明 |
|------|------|------|
| **NestJS** | 11.0 | 企业级 Node.js 框架 |
| **Express** | - | HTTP 服务平台 |
| **TypeScript** | 5.7 | 类型安全 |
| **Jest** | 30.0 | 单元测试框架 |
| **MySQL** | 8.4 | Docker 持久化关系型数据库 |
| **Prisma** | 7.4 | ORM、版本化迁移与客户端生成 |
| **RxJS** | 7.8 | 响应式编程库 |

### 工程化 (Engineering)

| 技术 | 说明 |
|------|------|
| **pnpm** | 高效的包管理器 |
| **Turbo** | Monorepo 构建系统 |
| **ESLint** | 代码规范检查 |
| **Prettier** | 代码格式化 |

---

## 🚀 快速开始

环境要求：Node.js 22.12+（推荐 Node.js 22 LTS）、pnpm 10.4.1，以及已启动的 Docker Desktop / Docker Engine + Compose v2。

### 本地开发：Docker MySQL + 本机前后端

```bash
pnpm install
# 首次配置时复制；已有 .env 时直接编辑
cp .env.example .env
pnpm db:up
pnpm db:generate
pnpm db:deploy
pnpm db:seed     # 可选：创建 test@propet.com / password123 测试用户
pnpm dev
```

访问前端 <http://localhost:3000>、后端 <http://localhost:3001/api>，开发模式 API 文档位于 <http://localhost:3001/docs>。数据库健康检查为 `/api/health`。

MySQL 8.4 使用命名卷持久化数据，默认地址为 `127.0.0.1:3306`，数据库和用户名均为 `propet`，开发密码为 `propet_dev_password`。首次初始化还会创建供 Prisma 迁移使用的 `propet_shadow` 和集成测试使用的 `propet_test`。

配置优先级为：进程环境变量 → `.env.<环境>.local` → `.env.local` → `.env` → `.env.<环境>`。前后端与 Prisma CLI 使用相同顺序。Compose 从根目录 `.env` 读取配置。更改 MySQL 密码或端口时，同步更新 `DATABASE_URL`、`SHADOW_DATABASE_URL`；容器内仍使用 `mysql:3306`。已有数据卷的数据库密码不会随环境变量自动改变。

### 全部通过 Docker 启动

```bash
pnpm docker:up
# 可选：创建测试用户
# docker compose --profile app run --rm migrate pnpm db:seed
pnpm docker:logs
pnpm docker:down
```

也可以直接执行 `docker compose --profile app up -d --build --wait`，无需本机 Node.js/pnpm。Compose 等待 MySQL 就绪、执行版本化迁移，再依次启动 API 和前端。前端服务端通过内部地址 `http://service:3001` 访问 API。

默认端口仍为 3000/3001，镜像构建时需要联网安装依赖并下载 Next.js 字体。`docker:down` 保留数据库卷；`docker compose --profile app down -v` 会删除所有本项目数据库数据。默认密码和 JWT 密钥仅供本地开发；部署时请使用实际密钥并配置 HTTPS。

### 数据库迁移与测试

```bash
# 修改 schema.prisma 后生成开发迁移（使用专用 shadow 数据库）
pnpm db:migrate --name describe_change
pnpm db:generate

# 应用已提交的迁移
pnpm db:deploy

# 单元测试
pnpm --filter @propet/service test --runInBand

# 独立测试库，使用默认 Docker 开发密码
DATABASE_URL='mysql://propet:propet_dev_password@127.0.0.1:3306/propet_test' pnpm db:deploy
TEST_DATABASE_URL='mysql://propet:propet_dev_password@127.0.0.1:3306/propet_test' pnpm --filter @propet/service test:e2e --runInBand

pnpm build
```

真实 MySQL 集成测试覆盖注册登录、帖子增删改查、JSON 图片数组、中文和 emoji、UTC 日期与权限检查。测试必须显式提供 `TEST_DATABASE_URL`，只清理由测试创建的用户和数据。

当前后端的用户、宠物和帖子模型使用 Prisma 7 + MySQL；前端尚未接入 API 的展示模块仍可能使用示例数据。MySQL 迁移位于 `apps/service/prisma/migrations`。新基线仅创建 MySQL 表结构，**不会自动导入现有数据库数据**；已有业务数据需单独导出、转换并导入。

---

## 📜 可用脚本

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 本机启动前后端，需先启动 MySQL 并执行迁移 |
| `pnpm db:up` / `pnpm db:stop` | 启动 / 停止 Docker MySQL，保留数据 |
| `pnpm db:logs` | 查看 MySQL 日志 |
| `pnpm db:generate` | 生成 Prisma Client |
| `pnpm db:deploy` / `pnpm db:migrate` | 应用迁移 / 创建开发迁移 |
| `pnpm db:seed` / `pnpm db:studio` | 初始化测试账号 / 打开数据库管理界面 |
| `pnpm docker:up` / `pnpm docker:down` | 启动 / 停止完整容器环境 |
| `pnpm docker:logs` | 查看容器日志 |
| `pnpm build` | 构建所有包 |
| `pnpm lint` | 运行代码检查 |
| `pnpm format` | 格式化代码 |

---

<div align="center">

  **用心记录，让爱宠的每一刻都值得珍藏** 🐾

</div>
