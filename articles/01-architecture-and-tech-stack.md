# 从零构建 AI 原生多模态编辑器（一）：架构设计与技术选型

> 本文是《从零构建 AI 原生多模态编辑器》系列的第一篇。我们将从一个空白项目开始，逐步构建一个支持文字、图片、视频、网页等多模态内容的协同编辑器，并深度集成 AI Agent 能力。本文聚焦于整体架构设计和关键技术选型的决策过程。

---

## 为什么要做这个项目

过去几年，我一直在从事编辑器相关的技术工作——从非线性编辑引擎到无限画布，从跨平台渲染到实时协同。2024 年，随着大语言模型能力的飞跃，一个问题开始困扰我：

**编辑器的下一代形态是什么？**

Figma 定义了设计工具的协同范式，Notion 重新定义了文档的边界，而 Cursor 则展示了 AI 如何融入开发者工作流。但在「多模态内容创作」这个领域，我们还没有看到一个真正 AI 原生的答案。

现有的编辑器要么专注于单一模态（文字或图形），要么在 AI 集成上停留在「功能叠加」的层面——AI 是一个独立的功能入口，而不是编辑体验的一部分。

我想尝试一条不同的路径：**从第一行代码开始就把 AI 作为核心设计约束**，而不是事后的附加功能。

这个系列将记录整个构建过程，包括设计决策、技术细节、踩过的坑。代码完全开源，欢迎参与。

---

## 我们要解决什么问题

在动手之前，先明确问题边界。我们要构建的编辑器需要满足以下核心需求：

### 1. 多模态内容支持

用户可以在同一个画布上自由组织多种类型的内容：

| 内容类型 | 能力 |
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

在包含大量元素（1000+）和高分辨率媒体的场景下，编辑器需要保持 60fps 的交互流畅度。

---

## 架构总览

基于上述需求，我设计了如下分层架构：

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

## 核心模块设计

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

设计决策说明：

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

虽然 WebGPU 提供了更高的性能上限，但我们选择从 Canvas 2D Context 开始：

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

所有对场景的修改都通过 Command 进行，这是实现 Undo/Redo 的基础：

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
| UI 框架 | React 19 | Vue 3, Svelte | 最新稳定版，ref 作为 prop 简化组件设计 |
| 语言 | TypeScript | JavaScript | 类型安全对复杂项目至关重要 |
| 构建工具 | Vite | webpack, esbuild | 开发体验好，HMR 快 |
| 状态管理 | Zustand | Redux, Jotai | 轻量，API 简洁 |
| 样式方案 | Tailwind CSS | CSS Modules, styled-components | 原子化 CSS，快速迭代 |
| 测试 | Vitest + Playwright | Jest + Cypress | Vite 生态，速度快 |

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

| 类别 | 选择 | 选择理由 |
|------|------|----------|
| Agent 服务 | Python + FastAPI | LLM 生态主要在 Python |
| 同步服务 | Node.js + y-websocket | Yjs 官方方案 |
| 媒体服务 | Node.js + FFmpeg | 视频处理需求 |

### 协同技术选型

选择 **Yjs** 作为 CRDT 实现，而非 Automerge 或自研：

1. **成熟度**：Yjs 已在多个生产级项目中验证（Liveblocks、Hocuspocus）
2. **性能**：针对文档编辑场景优化，内存占用低
3. **生态**：有现成的 WebSocket 同步方案、持久化方案
4. **子文档支持**：可以按需加载大文档的部分内容

```typescript
import * as Y from 'yjs';

// 创建文档
const ydoc = new Y.Doc();

// 定义共享数据结构
const yElements = ydoc.getMap('elements');
const yMeta = ydoc.getMap('meta');

// 监听变化
yElements.observe(event => {
  event.changes.keys.forEach((change, key) => {
    if (change.action === 'add') {
      // 新增元素
    } else if (change.action === 'update') {
      // 更新元素
    } else if (change.action === 'delete') {
      // 删除元素
    }
  });
});

// 修改数据
ydoc.transact(() => {
  yElements.set('element-1', {
    type: 'rectangle',
    transform: { x: 100, y: 100, width: 200, height: 150 },
    // ...
  });
});
```

---

## 项目结构

基于以上设计，项目采用 monorepo 结构：

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

本文完成了架构设计和技术选型。下一篇文章将深入渲染引擎的实现，包括：

- 渲染循环的设计
- 坐标系统和变换矩阵
- 元素渲染器的实现
- 视口控制（缩放、平移）
- 性能优化策略

代码已经开始编写，项目地址将在下一篇文章中公布。

---

## 附录：关键设计决策总结

| 决策点 | 选择 | 核心理由 |
|--------|------|----------|
| 元素存储结构 | 扁平 Map | CRDT 友好，O(1) 访问 |
| 渲染后端 | Canvas 2D（可替换） | 快速启动，渐进优化 |
| 交互管理 | 状态机模式 | 状态明确，易于扩展 |
| 操作抽象 | Command 模式 | 支持 Undo/Redo |
| 状态管理 | Zustand | 轻量，支持部分订阅 |
| 协同引擎 | Yjs | 成熟，性能好 |
| 项目结构 | Monorepo | 模块独立，共享配置 |

---

*本文是《从零构建 AI 原生多模态编辑器》系列的第一篇。如果你对这个项目感兴趣，欢迎关注后续更新。*

