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
| **Lucide React** | 0.563 | 图标库 |

### 后端 (Backend)

| 技术 | 版本 | 说明 |
|------|------|------|
| **NestJS** | 11.0 | 企业级 Node.js 框架 |
| **Express** | - | HTTP 服务平台 |
| **TypeScript** | 5.7 | 类型安全 |
| **Jest** | 30.0 | 单元测试框架 |
| **RxJS** | 7.8 | 响应式编程库 |

### 工程化 (Engineering)

| 技术 | 说明 |
|------|------|
| **pnpm** | 高效的包管理器 |
| **Turbo** | Monorepo 构建系统 |
| **ESLint** | 代码规范检查 |
| **Prettier** | 代码格式化 |

---

## 📁 项目结构

```
propet/
├── apps/
│   ├── web/                 # Next.js 前端应用
│   │   ├── app/             # App Router 页面
│   │   ├── components/      # 页面组件
│   │   └── public/          # 静态资源
│   └── service/             # NestJS 后端服务
│       ├── src/             # 源代码
│       └── test/            # 测试文件
├── packages/
│   ├── ui/                  # 共享 UI 组件库
│   ├── eslint-config/       # ESLint 配置
│   └── typescript-config/   # TypeScript 配置
├── turbo.json               # Turbo 配置
├── pnpm-workspace.yaml      # 工作区配置
└── package.json
```

---

## 🚀 快速开始

### 环境要求

- Node.js >= 20
- pnpm >= 10.4

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
# 启动所有服务
pnpm dev

# 仅启动前端
pnpm --filter web dev

# 仅启动后端
pnpm --filter service start:dev
```

### 构建项目

```bash
pnpm build
```

---

## 📜 可用脚本

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 构建所有包 |
| `pnpm lint` | 运行代码检查 |
| `pnpm format` | 格式化代码 |

---

## 🤝 参与贡献

欢迎提交 Issue 和 Pull Request！

---

<div align="center">

  **用心记录，让爱宠的每一刻都值得珍藏** 🐾

</div>
