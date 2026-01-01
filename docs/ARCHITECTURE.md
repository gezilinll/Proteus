# 架构设计

> 本文档描述 Proteus 的整体架构和核心设计决策。

---

## 分层架构

```
┌─────────────────────────────────────────────────────┐
│                 Application Layer                    │
│  apps/web/src/components/                           │
│  - UI 组件、布局、用户交互入口                        │
├─────────────────────────────────────────────────────┤
│                 React Binding Layer                  │
│  packages/react/src/                                │
│  - React Context、Hooks、状态同步                    │
├─────────────────────────────────────────────────────┤
│                    Editor Core                       │
│  packages/core/src/                                 │
│  - 纯逻辑层，框架无关                                │
│  - Scene、Renderer、Command、Selection、Tools       │
└─────────────────────────────────────────────────────┘
```

---

## 核心设计决策

### 1. 框架无关的 Core

**决策**：`packages/core` 不依赖任何 UI 框架

**理由**：
- 可在 Node.js 环境下测试
- 未来可支持 Vue、Svelte 等框架
- 逻辑层和 UI 层职责分离

**代码位置**：`packages/core/src/`

### 2. Command 模式

**决策**：所有对 Scene 的修改都通过 Command 执行

**理由**：
- 原生支持 Undo/Redo
- 操作可序列化（为协同编辑做准备）
- 修改可追踪

**代码位置**：`packages/core/src/command/`

### 3. 扁平化元素存储

**决策**：元素存储在 `Map<id, Element>` 而非树形结构

**理由**：
- O(1) 访问任意元素
- CRDT 友好（为协同编辑做准备）
- 父子关系通过 `parentId/childIds` 动态构建

**代码位置**：`packages/core/src/scene/Scene.ts`

### 4. 策略模式的渲染器

**决策**：每种元素类型有独立的渲染器

**理由**：
- 新增元素类型只需添加渲染器
- 渲染逻辑解耦
- 便于测试

**代码位置**：`packages/core/src/renderer/renderers/`

### 5. 工具状态机

**决策**：每个工具管理自己的状态和交互逻辑

**理由**：
- 交互逻辑清晰
- 工具可独立开发和测试
- 避免巨大的 switch 语句

**代码位置**：`packages/core/src/tools/tools/`

---

## 数据流

```
用户交互 → Tool.onMouseDown/Move/Up
         → 生成 Command
         → CommandHistory.execute(command)
         → command.execute() 修改 Scene
         → Editor.requestRender()
         → Renderer.render(scene)
         → Canvas 更新
```

---

## 模块依赖关系

```
Scene ←── Renderer
  ↑           ↑
  │           │
Command ───→ Editor ←── ToolManager
  ↑                         ↑
  │                         │
CommandHistory         SelectionManager
```

- **Scene**：数据源，被所有模块读取
- **Editor**：协调者，整合所有模块
- **Command**：修改 Scene 的唯一方式
- **Renderer**：读取 Scene 并渲染
- **ToolManager**：管理当前工具和交互

---

## 详细了解

- 具体模块和代码位置：[MODULES.md](./MODULES.md)
- 数据结构定义：[DATA_STRUCTURES.md](./DATA_STRUCTURES.md)
- 技术博客：`articles/` 目录

