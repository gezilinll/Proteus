# Proteus 项目上下文索引

> 本目录为 AI 助手提供项目的结构化上下文，采用「索引 + 代码自解释」的设计理念。
> 
> **核心原则**：告诉 AI **去哪里找代码**，让代码解释自身逻辑。

---

## 快速导航

| 你想了解... | 查看 |
|------------|------|
| 整体架构和设计决策 | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| 核心模块和代码位置 | [MODULES.md](./MODULES.md) |
| 数据结构定义 | [DATA_STRUCTURES.md](./DATA_STRUCTURES.md) |
| 开发约定和规范 | [CONVENTIONS.md](./CONVENTIONS.md) |

---

## 使用说明

### 对于 AI 助手

1. **先读索引**：从本目录获取项目结构概览
2. **再读代码**：根据索引定位具体文件，直接阅读源码理解逻辑
3. **遵循约定**：按 CONVENTIONS.md 中的规范编写代码

### 索引的更新时机

- 新增模块或重大架构变更时更新 MODULES.md
- 新增核心数据结构时更新 DATA_STRUCTURES.md
- 发现新的开发约定时更新 CONVENTIONS.md

---

## 项目概述

**Proteus** 是一个 AI 原生多模态协同编辑器，类似 Miro/Figma 的无限画布。

### 技术栈

- **前端**：React 19 + TypeScript + Vite + Tailwind CSS
- **状态管理**：Zustand
- **渲染**：Canvas 2D
- **测试**：Vitest
- **包管理**：pnpm monorepo

### 项目结构

```
proteus/
├── packages/
│   ├── core/          # 编辑器核心（框架无关）
│   └── react/         # React 绑定
├── apps/
│   └── web/           # Web 应用
├── articles/          # 技术博客文章
├── plans/             # 开发计划
├── troubleshooting/   # 踩坑记录
└── docs/              # 本目录（AI 上下文索引）
```

---

## 当前阶段

**Phase 1: 基础编辑器** ✅ 已完成

支持的功能：
- 元素：矩形、圆形、文本、图片
- 交互：选择、移动、缩放、旋转
- 编辑：复制粘贴、撤销重做、图层管理
- 工具：选择、矩形、圆形、文字、图片

下一阶段：Phase 2 多模态元素（视频、音频、网页嵌入）

---

*索引设计理念：最小化文档维护成本，最大化代码的自解释能力。*

