<div align="center">

# Proteus

**从零构建 AI 原生多模态编辑器**

*一场人机协作开发的公开实验*

[English](./README.en.md) · [在线体验](https://proteus.gezilinll.com) · [技术博客](./articles/)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

</div>

---

## 这是什么

Proteus 是一个**完全公开的编辑器开发实验**——从第一行代码开始，由人类设计架构、AI 编写代码，共同构建一个 AI 原生的多模态编辑器。

**为什么叫 Proteus？** 希腊神话中能随意变换形态的海神。正如这个编辑器，能承载任何类型的内容。

## 核心理念

```
人类负责：架构设计 → 技术决策 → 问题诊断 → 质量把控
  AI 负责：代码实现 → 模式复用 → 细节处理 → 测试编写
```

**这不是一个 AI 辅助项目，而是一个 AI 主导实现的项目。** 我们探索的是：当 AI 成为主要的代码贡献者时，软件开发的模式会如何改变？

## 你能从这里获得什么

- 🏗️ **从零构建复杂前端应用**：编辑器核心原理，不依赖现成框架
- 🤖 **AI 原生架构设计**：如何让代码库对 AI 友好，最大化人机协作效率
- 🎨 **Canvas 渲染引擎**：场景图、坐标变换、手势交互的完整实现
- 🔧 **工程化实践**：Monorepo、框架无关设计、可测试架构
- 💡 **踩坑实录**：多媒体领域的经验沉淀

## 快速开始

```bash
# 克隆项目
git clone https://github.com/gezilinll/Proteus.git
cd Proteus

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

访问 `http://localhost:5173` 开始体验。

## 开发进度

- [x] **Phase 1**: 核心编辑能力（场景图、渲染、交互、工具系统）
- [ ] **Phase 2**: 多模态元素（视频、音频、网页嵌入）
- [ ] **Phase 3**: AI 能力集成
- [ ] **Phase 4**: 实时协同

## 相关文章

1. [架构设计与技术选型](./articles/01-architecture-and-tech-stack.md)
2. [文本编辑设计](./articles/02-text-editing-design.md)
3. [渲染引擎实现](./articles/03-rendering-engine-implementation.md)
4. [交互系统设计](./articles/04-interaction-system-design.md)

---

<div align="center">

**MIT License** · Made with 🤖 + 🧠

</div>
