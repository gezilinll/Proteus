# 从零构建 AI 原生多模态编辑器（一）：架构设计与技术选型

> 本文是《从零构建 AI 原生多模态编辑器》系列的第一篇。我们将从一个空白项目开始，逐步构建一个支持文字、图片、视频、网页等多模态内容的协同编辑器，并深度集成 AI Agent 能力，当然还会有类似视频会议之类的功能。本文聚焦于整体架构设计和关键技术选型的决策过程。

---

## 为什么要做这个项目

项目地址：[Proteus](https://github.com/gezilinll/Proteus)

体验地址：

过去几年，我一直在从事编辑器相关的技术工作——从非线性视频编辑引擎到无限画布，从跨平台渲染到实时协同。2025 年，随着大语言模型能力的飞跃，两个问题一直困扰着我：

**自己的核心竞争力是什么？**

2025 年之前，「能写代码」还是一种竞争力，编码需要大量的知识积累和手感训练，这个门槛把大多数人挡在外面。但 Cursor、Claude 这样的工具以及 Opus、Sonnet 这样的模型正在快速拉平这个差距——它们在 80% 的场景下已经能写出足够好的代码，而且可预见还会变得更好，甚至那 20% 不够好的很多时候是缺少项目的上下文建设。

那如果「写代码」不再稀缺，在未来对于开发者而言什么能力才能称之为竞争力？

我目前的想法是：**系统设计能力、技术决策能力以及业务自闭环能力**。

就比如自己这些年积累的经验，核心价值不在于「我知道怎么用 Canvas API 画一个矩形」，而在于：

- **架构层面**：如何设计一个可扩展的编辑器架构？比如渲染层、数据层、交互层如何解耦？
- **技术选型**：Canvas 2D 还是 WebGL 甚至是 WebGPU？CRDT 还是 OT？这些决策背后的权衡是什么？
- **踩坑经验**：高 DPI 屏幕的适配陷阱、所见即所得文字编辑的实现难点、视频播放快速 Seek 的优化经验，当然还有各种刁钻的机型适配

这段时间高强度使用 AI 后，也逐渐摸索出了一些人与 AI 的协作边界，比如：

| AI 擅长的        | 人更擅长的               |
| ---------------- | ------------------------ |
| 根据描述生成代码 | 判断架构设计是否合理     |
| 实现具体功能     | 预见潜在的坑和边界情况   |
| 遵循既有模式     | 在没有先例时做出技术决策 |
| 处理局部问题     | 保持全局一致性           |

因此这意味着我几乎不会 Review AI 生成的代码和实现逻辑，但是我会严格把控架构、实现方案的设计与实现，提供问题的解决思路，以及不断引导其完成自动化测试、上下文建设等全局性的工作。

第二个问题是：**编辑器的下一代形态是什么？**

Figma 定义了设计工具的协同范式，Notion 重新定义了文档的边界，而 Cursor 则展示了 AI 如何融入开发者工作流（其实远不止于开发领域）。但在「多模态内容创作」这个领域，我们还没有看到一个真正 AI 原生的答案。

现有的编辑器要么专注于单一模态（文字或图形），要么在 AI 集成上停留在「功能叠加」的层面——AI 是一个独立的功能入口，而不是编辑体验的一部分。

我想尝试一条不同的路径：**从第一行代码开始就把 AI 作为核心设计约束**，而不是事后的附加功能，这样在长期的决策中都优先考虑整个项目如何做到最大程度的 AI 友好。

那么对于对这个项目感兴趣的你，从这个项目能获取到什么呢：

* **从零构建复杂前端应用**：不依赖现成框架，理解编辑器核心原理

* **AI 原生架构设计**：如何让代码库对 AI 友好，实现高效的人机协作开发

* **Canvas 渲染与交互**：场景图、坐标变换、手势处理的完整实现

* **工程化实践**：Monorepo 组织、框架无关设计、可测试架构

* **AI Agent 与后端架构**：LLM 集成、Agent 工作流设计、实时协同后端

* **踩坑大全**：我将把自己在多媒体领域这几年踩过的坑在过程中引导 AI 避开或修复问题并额外沉淀到项目里

* **可能还有其他的，至少我希望如此**

---

## 我们要解决什么问题

在动手之前，先明确问题边界。我们要构建的编辑器需要满足以下核心需求：

### 1. 多模态内容支持

用户可以在同一个画布上自由组织多种类型的内容：

| 内容类型 | 能力举例 |
|----------|------|
| 文字 | 富文本编辑、字体、样式 |
| 图片 | 导入、裁剪、滤镜、变换 |
| 视频 | 预览、seek、帧级编辑 |
| 音频 | 波形可视化、剪辑 |
| 网页 | iframe 嵌入、截图 |
| 矢量路径 | 贝塞尔曲线、自由绘制 |

这些元素需要在统一的坐标系下进行选择、变换、分组。

### 2. AI Agent 深度集成

用户可以通过自然语言与编辑器交互：

```
用户：「把右边那张图片缩小一半」
Agent：识别「右边那张图片」→ 计算 50% 缩放 → 执行变换
```

这不是简单的命令映射，而是需要：
- 空间理解：「右边」「上面」「那个」
- 上下文记忆：「再大一点」
- 多模态感知：「这张图里有什么」

### 3. 实时协同

多人可以同时编辑同一个文档，要求：
- 毫秒级同步延迟
- 冲突自动解决
- 离线编辑能力
- 操作历史完整可追溯

### 4. 高性能渲染

在包含大量元素（10000+）和高分辨率媒体的场景下，编辑器需要保持 60fps 的交互流畅度。

---

## 架构总览

基于上述需求，初步设计了一下分层架构（先用比较简单的版本引导 AI 开展初期工作，后面肯定要进一步抽象层级和细化模块的）：

```
+-------------------------------------------------------------------+
|                         Application Layer                          |
|  +---------------+  +----------------+  +----------------------+   |
|  |   UI Shell    |  |  Agent Panel   |  |   Collab Overlay     |   |
|  | (Panels, Menu)|  | (Chat, Voice)  |  | (Cursors, Avatars)   |   |
|  +-------+-------+  +-------+--------+  +----------+-----------+   |
|          |                  |                      |               |
+----------+------------------+----------------------+---------------+
           |                  |                      |
+----------v------------------v----------------------v---------------+
|                          Editor Core                                |
|  +------------+  +------------+  +-------------+  +-------------+  |
|  |  Renderer  |  |   Scene    |  | Interaction |  |   History   |  |
|  |  Engine    |  |   Graph    |  |   System    |  |   Manager   |  |
|  +------------+  +------------+  +-------------+  +-------------+  |
|                                                                     |
|  +------------+  +------------+  +-------------+                   |
|  |  Element   |  |  Viewport  |  |   Command   |                   |
|  |  Registry  |  |  Manager   |  |   Executor  |                   |
|  +------------+  +------------+  +-------------+                   |
+------------------------------+--------------------------------------+
                               |
+------------------------------v--------------------------------------+
|                          Data Layer                                 |
|  +--------------+  +--------------+  +--------------+              |
|  |  CRDT Store  |  |   Sync Hub   |  |  Persistence |              |
|  |    (Yjs)     |  | (WebSocket)  |  | (IndexedDB)  |              |
|  +--------------+  +--------------+  +--------------+              |
+-------------------------------------------------------------------+
                               |
                               | Network
                               v
+-------------------------------------------------------------------+
|                         Server Layer                               |
|  +--------------+  +--------------+  +--------------+             |
|  |    Agent     |  |     Sync     |  |    Media     |             |
|  |   Service    |  |   Service    |  |   Service    |             |
|  +--------------+  +--------------+  +--------------+             |
+-------------------------------------------------------------------+
```

### 分层职责

**Application Layer**：用户界面，处理视觉呈现和用户输入。这一层不包含业务逻辑，只负责将用户意图转化为对 Editor Core 的调用。

**Editor Core**：编辑器的核心逻辑，包括渲染引擎、场景图管理、交互处理、历史记录。这一层是纯逻辑层，不依赖任何 UI 框架。

**Data Layer**：数据持久化和同步。使用 CRDT 实现多端一致性，通过 WebSocket 进行实时同步。

**Server Layer**：后端服务，包括 AI Agent 的推理服务、同步服务器、媒体处理服务。

这种分层的核心原则是：**每一层只依赖其下层，不反向依赖**。这使得各层可以独立测试和替换。

---

## 核心模块设计（第一阶段）

### 1. 场景图（Scene Graph）

场景图是编辑器的数据骨架，定义了所有元素的层级关系和属性。

```typescript
// 基础元素接口
interface Element {
  id: string;
  type: ElementType;
  
  // 变换属性
  transform: {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;  // 弧度
    scaleX: number;
    scaleY: number;
  };
  
  // 样式属性
  style: {
    opacity: number;
    blendMode: BlendMode;
    // ... 更多样式
  };
  
  // 父子关系
  parentId: string | null;
  childIds: string[];
  
  // 元素特有属性，由具体类型定义
  props: ElementProps;
  
  // 元数据
  meta: {
    locked: boolean;
    visible: boolean;
    name: string;
  };
}

// 元素类型枚举
type ElementType = 
  | 'rectangle'
  | 'ellipse'
  | 'text'
  | 'image'
  | 'video'
  | 'audio'
  | 'path'
  | 'iframe'
  | 'group';
```

**为什么使用扁平化存储而非树形结构？**

虽然元素之间存在父子关系（通过 `parentId` 和 `childIds` 表示），但我们选择将所有元素存储在一个扁平的 Map 中，而非嵌套的树结构：

```typescript
// 我们选择这种方式
type ElementStore = Map<string, Element>;

// 而非
interface TreeNode {
  element: Element;
  children: TreeNode[];
}
```

原因：
1. **CRDT 友好**：扁平结构更容易进行并发修改的合并
2. **O(1) 访问**：任意元素的查询都是常数时间
3. **简化更新**：修改单个元素不需要遍历树

树形关系在需要时通过遍历 `parentId/childIds` 动态构建。

### 2. 渲染引擎（Renderer）

渲染引擎负责将场景图绘制到 Canvas 上。核心设计如下：

```typescript
class Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private viewport: Viewport;
  private elementRegistry: ElementRegistry;
  
  // 渲染主循环
  render(scene: Scene): void {
    this.clear();
    
    // 应用视口变换
    this.ctx.save();
    this.applyViewportTransform();
    
    // 按 z-index 排序后渲染
    const sortedElements = this.getSortedElements(scene);
    for (const element of sortedElements) {
      this.renderElement(element);
    }
    
    this.ctx.restore();
    
    // 渲染覆盖层（选择框、辅助线等）
    this.renderOverlays();
  }
  
  private renderElement(element: Element): void {
    if (!element.meta.visible) return;
    
    this.ctx.save();
    
    // 应用元素变换
    this.applyElementTransform(element.transform);
    
    // 应用样式
    this.ctx.globalAlpha = element.style.opacity;
    this.ctx.globalCompositeOperation = element.style.blendMode;
    
    // 委托给具体的元素渲染器
    const renderer = this.elementRegistry.getRenderer(element.type);
    renderer.render(this.ctx, element);
    
    this.ctx.restore();
  }
}
```

**为什么从 Canvas 2D 开始？**

虽然 WebGPU（预计后续也不会考虑 WebGL，毕竟是探索性的项目，整体的选型我都会更激进一些） 提供了更高的性能上限，但我们选择从 Canvas 2D Context 开始：

1. **更快启动**：Canvas 2D API 更简单，可以快速验证架构
2. **更好的文字支持**：Canvas 2D 的文字渲染能力更成熟
3. **渐进迁移**：架构设计为渲染后端可替换，后续可以无缝切换到 WebGPU

渲染引擎对上层暴露统一的接口，底层实现对调用者透明：

```typescript
interface RenderBackend {
  init(canvas: HTMLCanvasElement): void;
  clear(): void;
  drawRect(x: number, y: number, w: number, h: number, style: Style): void;
  drawImage(image: ImageSource, transform: Transform): void;
  drawPath(path: Path2D, style: Style): void;
  // ...
}

// 可以有多种实现
class Canvas2DBackend implements RenderBackend { /* ... */ }
class WebGPUBackend implements RenderBackend { /* ... */ }
```

### 3. 交互系统（Interaction System）

交互系统处理用户输入并将其转化为对场景的操作。采用状态机模式管理不同的交互状态：

```typescript
// 交互状态
type InteractionState = 
  | { type: 'idle' }
  | { type: 'selecting'; startPoint: Point }
  | { type: 'dragging'; elements: string[]; startTransforms: Transform[] }
  | { type: 'resizing'; element: string; handle: ResizeHandle }
  | { type: 'rotating'; element: string; startAngle: number }
  | { type: 'drawing'; tool: DrawingTool; points: Point[] };

class InteractionManager {
  private state: InteractionState = { type: 'idle' };
  private commandExecutor: CommandExecutor;
  
  handlePointerDown(event: PointerEvent): void {
    const point = this.screenToCanvas(event);
    const hitResult = this.hitTest(point);
    
    if (hitResult.type === 'element') {
      this.startDragging(hitResult.elementId, point);
    } else if (hitResult.type === 'handle') {
      this.startResizing(hitResult.elementId, hitResult.handle);
    } else {
      this.startSelecting(point);
    }
  }
  
  handlePointerMove(event: PointerEvent): void {
    const point = this.screenToCanvas(event);
    
    switch (this.state.type) {
      case 'dragging':
        this.updateDrag(point);
        break;
      case 'resizing':
        this.updateResize(point);
        break;
      case 'selecting':
        this.updateSelection(point);
        break;
    }
  }
  
  handlePointerUp(event: PointerEvent): void {
    switch (this.state.type) {
      case 'dragging':
        this.commitDrag();
        break;
      case 'resizing':
        this.commitResize();
        break;
      case 'selecting':
        this.commitSelection();
        break;
    }
    
    this.state = { type: 'idle' };
  }
  
  private commitDrag(): void {
    // 生成 Command 并执行，这样可以支持 Undo
    const command = new MoveElementsCommand(
      this.state.elements,
      this.state.startTransforms,
      this.getCurrentTransforms()
    );
    this.commandExecutor.execute(command);
  }
}
```

### 4. 命令系统（Command System）

所有对场景的修改都通过 Command 进行，这是实现 Undo/Redo 的基础（当然后面也会考虑跟 yjs 直接合并）：

```typescript
interface Command {
  execute(): void;
  undo(): void;
  redo(): void;
  
  // 用于合并连续的相同操作（如连续拖动）
  merge?(other: Command): Command | null;
}

class CommandExecutor {
  private undoStack: Command[] = [];
  private redoStack: Command[] = [];
  
  execute(command: Command): void {
    command.execute();
    
    // 尝试与上一个命令合并
    const lastCommand = this.undoStack[this.undoStack.length - 1];
    if (lastCommand?.merge) {
      const merged = lastCommand.merge(command);
      if (merged) {
        this.undoStack[this.undoStack.length - 1] = merged;
        return;
      }
    }
    
    this.undoStack.push(command);
    this.redoStack = []; // 清空 redo 栈
  }
  
  undo(): void {
    const command = this.undoStack.pop();
    if (command) {
      command.undo();
      this.redoStack.push(command);
    }
  }
  
  redo(): void {
    const command = this.redoStack.pop();
    if (command) {
      command.redo();
      this.undoStack.push(command);
    }
  }
}
```

---

## 技术选型

### 前端技术栈

| 类别 | 选择 | 备选方案 | 选择理由 |
|------|------|----------|----------|
| UI 框架 | React 19 | Vue 3, Svelte | 生态最成熟，AI 对 React 代码理解和生成能力最强 |
| 语言 | TypeScript | JavaScript | 类型安全对复杂项目至关重要，也便于 AI 理解代码意图 |
| 构建工具 | Vite | webpack, esbuild | 开发体验好，HMR 快，配置简单 |
| 状态管理 | Zustand | Redux, Jotai | 轻量，API 简洁，支持在 React 外部访问状态 |
| 样式方案 | Tailwind CSS | CSS Modules, styled-components | 原子化 CSS，快速迭代，AI 生成样式更可控 |
| 测试 | Vitest + Playwright | Jest + Cypress | Vite 生态原生支持，速度快 |

### 为什么选择 Zustand 而非 Redux？

编辑器的状态管理有其特殊性：

1. **高频更新**：拖动操作每帧都可能触发状态更新
2. **部分订阅**：组件只需要关心特定元素的变化
3. **外部集成**：状态需要被非 React 代码（如渲染引擎）访问

Zustand 在这些场景下表现更好：

```typescript
// Zustand 的选择性订阅
const elementTransform = useEditorStore(
  state => state.elements[elementId]?.transform,
  shallow // 浅比较，避免不必要的重渲染
);

// 在非 React 代码中直接访问
const state = useEditorStore.getState();
renderer.render(state.scene);
```

Redux 的 action/reducer 模式在这种高频场景下会引入不必要的开销。

### 后端技术栈

后端的部分没什么特别的，组合基本都比较固定，第一阶段还不会涉及，后续会再详细说使用哪些三方库。

| 类别 | 选择 | 选择理由 |
|------|------|----------|
| Agent 服务 | Python + FastAPI | LLM 生态主要在 Python |
| 同步服务 | Node.js + y-websocket | Yjs 官方方案 |
| 媒体服务 | Node.js + FFmpeg | 视频处理需求 |

---

## 项目结构

项目将采用 monorepo 结构：

```
proteus/
├── packages/
│   ├── core/                 # 编辑器核心（框架无关）
│   │   ├── src/
│   │   │   ├── scene/        # 场景图
│   │   │   ├── renderer/     # 渲染引擎
│   │   │   ├── interaction/  # 交互系统
│   │   │   ├── command/      # 命令系统
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── react/                # React 绑定
│   ├── collab/               # 协同模块
│   └── agent/                # Agent 客户端
│
├── apps/
│   ├── web/                  # Web 应用
│   ├── server/               # 后端服务
│   └── docs/                 # 文档站点
│
├── pnpm-workspace.yaml
└── package.json
```

**为什么将 core 设计为框架无关？**

1. **可测试性**：核心逻辑可以在 Node.js 环境下进行单元测试
2. **可移植性**：未来可以支持 Vue、Svelte 或其他框架
3. **关注点分离**：UI 层和逻辑层的职责清晰

---

## 下一步

下一篇文章将深入渲染引擎的实现，包括：

- 渲染循环的设计
- 坐标系统和变换矩阵
- 元素渲染器的实现
- 视口控制（缩放、平移）
- 性能优化策略
