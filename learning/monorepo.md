# pnpm + Monorepo

> 现代 JavaScript 包管理与多包架构。

---

## 概述

### 什么是 pnpm

pnpm（Performant npm）是快速、节省磁盘空间的包管理器。它使用硬链接和符号链接共享依赖，避免重复安装。

### 什么是 Monorepo

Monorepo 是将多个项目/包放在同一个代码仓库中的架构方式，便于代码共享和统一管理。

---

## pnpm 核心概念

### 1. 安装与基础命令

```bash
# 安装 pnpm
npm install -g pnpm

# 或使用 corepack（Node.js 16.13+）
corepack enable
corepack prepare pnpm@latest --activate

# 基础命令
pnpm install              # 安装所有依赖
pnpm add <pkg>            # 添加依赖
pnpm add -D <pkg>         # 添加开发依赖
pnpm add -g <pkg>         # 全局安装
pnpm remove <pkg>         # 移除依赖
pnpm update               # 更新依赖
pnpm update --latest      # 更新到最新版本
```

### 2. pnpm 的工作原理

```
传统 npm/yarn:
每个项目都有完整的 node_modules
├── project-a/
│   └── node_modules/
│       └── react/        # 完整副本
└── project-b/
    └── node_modules/
        └── react/        # 另一份完整副本

pnpm:
全局存储 + 硬链接
~/.pnpm-store/
└── react/                # 只存储一份

project-a/node_modules/.pnpm/
└── react -> ~/.pnpm-store/react  # 硬链接

project-b/node_modules/.pnpm/
└── react -> ~/.pnpm-store/react  # 硬链接
```

### 3. pnpm 的优势

| 特性 | npm | yarn | pnpm |
|------|-----|------|------|
| 磁盘空间 | 高 | 高 | **低** |
| 安装速度 | 慢 | 中 | **快** |
| 严格依赖 | 否 | 否 | **是** |
| Monorepo | 差 | 一般 | **好** |

### 4. npmrc 配置

```ini
# .npmrc
# 使用淘宝镜像
registry=https://registry.npmmirror.com

# pnpm 特定配置
shamefully-hoist=true       # 提升依赖（兼容性）
strict-peer-dependencies=false
auto-install-peers=true
```

---

## Monorepo 核心概念

### 1. 工作区配置

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'       # packages 下所有目录
  - 'apps/*'           # apps 下所有目录
  - '!**/test/**'      # 排除 test 目录
```

### 2. 典型项目结构

```
my-monorepo/
├── packages/
│   ├── core/              # 核心库
│   │   ├── package.json   # name: @my/core
│   │   └── src/
│   ├── utils/             # 工具库
│   │   ├── package.json   # name: @my/utils
│   │   └── src/
│   └── ui/                # UI 组件库
│       ├── package.json   # name: @my/ui
│       └── src/
├── apps/
│   ├── web/               # Web 应用
│   │   ├── package.json
│   │   └── src/
│   └── mobile/            # 移动应用
│       ├── package.json
│       └── src/
├── package.json           # 根 package.json
├── pnpm-workspace.yaml
└── pnpm-lock.yaml
```

### 3. 包间依赖

```json
// packages/ui/package.json
{
  "name": "@my/ui",
  "dependencies": {
    "@my/core": "workspace:*",    // 使用工作区版本
    "@my/utils": "workspace:^1.0.0"
  }
}

// apps/web/package.json
{
  "name": "my-web-app",
  "dependencies": {
    "@my/ui": "workspace:*",
    "@my/core": "workspace:*"
  }
}
```

`workspace:` 协议说明：
- `workspace:*` - 使用任意版本
- `workspace:^` - 发布时替换为 ^version
- `workspace:~` - 发布时替换为 ~version

### 4. 运行命令

```bash
# 在所有包中运行命令
pnpm -r <command>              # 递归运行
pnpm -r build                  # 所有包执行 build
pnpm -r test                   # 所有包执行 test

# 在特定包中运行命令
pnpm --filter <package> <command>
pnpm --filter @my/core build   # 只构建 core 包
pnpm --filter web dev          # 只运行 web 应用

# 过滤语法
pnpm --filter "@my/*" build    # 匹配模式
pnpm --filter "...@my/ui" build # ui 及其依赖
pnpm --filter "@my/ui..." build # ui 及依赖它的包
pnpm --filter "...[origin/main]" build # 与 main 有差异的包
```

### 5. 根目录 package.json

```json
{
  "name": "my-monorepo",
  "private": true,
  "scripts": {
    "dev": "pnpm --filter web dev",
    "build": "pnpm -r build",
    "test": "pnpm -r test",
    "lint": "pnpm -r lint",
    "clean": "pnpm -r exec rm -rf dist node_modules"
  },
  "devDependencies": {
    "typescript": "^5.0.0",      // 共享的开发依赖
    "eslint": "^9.0.0",
    "prettier": "^3.0.0"
  }
}
```

### 6. 依赖管理

```bash
# 在根目录添加依赖（所有包共享）
pnpm add -D -w typescript      # -w 表示根工作区

# 在特定包添加依赖
pnpm --filter @my/core add lodash
pnpm --filter @my/ui add -D vitest

# 在多个包添加依赖
pnpm --filter "@my/*" add -D @types/node

# 更新特定包的依赖
pnpm --filter @my/core update lodash

# 查看依赖关系
pnpm why <package>
pnpm --filter @my/ui why react
```

### 7. TypeScript 配置

```json
// 根目录 tsconfig.json（基础配置）
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true
  }
}

// packages/core/tsconfig.json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}

// packages/ui/tsconfig.json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "references": [
    { "path": "../core" }    // 项目引用
  ]
}
```

### 8. 发布流程

```bash
# 使用 changeset 管理版本
pnpm add -D -w @changesets/cli
pnpm changeset init

# 创建变更集
pnpm changeset

# 更新版本
pnpm changeset version

# 发布
pnpm publish -r --access public
```

### 9. 常见问题

#### 幽灵依赖

```bash
# pnpm 默认严格，不允许访问未声明的依赖
# 如果需要（不推荐），可以在 .npmrc 中配置
shamefully-hoist=true
```

#### 构建顺序

```bash
# pnpm 自动处理依赖关系的构建顺序
# core 会先于 ui 构建（因为 ui 依赖 core）
pnpm -r build
```

#### 开发时热更新

```javascript
// vite.config.ts - 使用别名直接指向源码
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@my/core': path.resolve(__dirname, '../../packages/core/src'),
      '@my/ui': path.resolve(__dirname, '../../packages/ui/src'),
    },
  },
});
```

---

## 在本项目中的应用

- **工作区**：`packages/core`、`packages/react`、`apps/web`
- **共享依赖**：TypeScript、ESLint 等在根目录
- **包引用**：使用 `workspace:*` 引用本地包
- **统一脚本**：根目录脚本管理所有包

---

## 学习资源

### 官方资源

- [pnpm 官方文档](https://pnpm.io/) - 最权威的参考
- [pnpm 中文文档](https://pnpm.io/zh/) - 官方中文翻译
- [pnpm GitHub](https://github.com/pnpm/pnpm) - 源码

### 教程

- [pnpm Workspaces](https://pnpm.io/workspaces) - 工作区详解

### Monorepo 工具

- [Turborepo](https://turbo.build/) - Vercel 出品的构建系统
- [Nx](https://nx.dev/) - 企业级 Monorepo 工具
- [Lerna](https://lerna.js.org/) - 老牌 Monorepo 工具
- [Changesets](https://github.com/changesets/changesets) - 版本管理

### 最佳实践

- [Monorepo.tools](https://monorepo.tools/) - Monorepo 资源汇总

---

*建议学习顺序：pnpm 基础 → 工作区配置 → 包间依赖 → 过滤命令 → 发布流程*

