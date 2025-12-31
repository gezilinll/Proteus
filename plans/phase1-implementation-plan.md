# Phase 1 实施计划：基础编辑器

> 本文档详细规划 Phase 1（第 1-4 周）的实现步骤，将基础编辑器功能分解为可执行的开发任务。

---

## Phase 1 目标回顾

**核心交付物**：
- ✅ 无限画布 + 视口控制（缩放、平移）
- ✅ 基础元素（矩形、圆形、文字、图片）
- ✅ 选择、变换、图层、对齐
- ✅ Undo/Redo

---

## 实施步骤分解

### Step 1: 项目基础搭建（2 天）

**目标**：搭建 monorepo 结构，配置开发环境

**任务清单**：
- [ ] 初始化 monorepo（pnpm workspace）
- [ ] 配置 TypeScript、ESLint、Prettier
- [ ] 配置 Vite 构建工具
- [ ] 创建基础包结构：
  - `packages/core` - 编辑器核心（框架无关）
  - `packages/react` - React 绑定
  - `apps/web` - Web 应用
- [ ] 配置测试环境（Vitest）
- [ ] 配置 Tailwind CSS
- [ ] 配置 Zustand（状态管理）

**关键文件**：
```
proteus/
├── packages/
│   ├── core/
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── react/
│       ├── src/
│       │   └── index.ts
│       └── package.json
├── apps/
│   └── web/
│       ├── src/
│       │   ├── App.tsx
│       │   └── main.tsx
│       └── package.json
├── pnpm-workspace.yaml
├── package.json
└── tsconfig.json
```

**验收标准**：
- 项目可以正常启动（`pnpm dev`）
- 所有包可以独立构建
- 代码规范检查通过
- 可以在浏览器看到基础页面

---

### Step 2: 核心数据结构与命令系统（2 天）

**目标**：定义场景图、元素结构，以及命令系统（Undo/Redo 基础）

> ⚠️ **设计决策**：命令系统在此阶段就要实现，因为后续所有操作都需要通过 Command 执行才能支持 Undo/Redo。

**任务清单**：
- [ ] 定义 `Element` 接口（transform、style、meta）
- [ ] 定义元素类型枚举（rectangle、ellipse、text、image、group）
- [ ] 实现 `Scene` 类（扁平化 Map 存储）
- [ ] 实现元素的基础 CRUD 操作
- [ ] 定义 `Command` 接口
- [ ] 实现 `CommandExecutor`（执行、撤销、重做）
- [ ] 实现基础命令：
  - `AddElementCommand` - 添加元素
  - `RemoveElementCommand` - 删除元素
  - `UpdateElementCommand` - 更新元素属性
- [ ] 编写单元测试

**关键文件**：
```
packages/core/src/
├── types/
│   ├── element.ts           # Element 接口定义
│   ├── transform.ts         # Transform 类型
│   └── style.ts             # Style 类型
├── scene/
│   ├── Scene.ts             # Scene 类实现
│   └── index.ts
├── command/
│   ├── Command.ts           # Command 接口
│   ├── CommandExecutor.ts   # 命令执行器
│   ├── commands/
│   │   ├── AddElementCommand.ts
│   │   ├── RemoveElementCommand.ts
│   │   └── UpdateElementCommand.ts
│   └── index.ts
└── index.ts
```

**验收标准**：
- 可以创建、查询、更新、删除元素
- 可以执行命令并撤销、重做
- 所有操作有单元测试覆盖

---

### Step 3: 渲染引擎与视口控制（3 天）

**目标**：实现 Canvas 渲染和视口控制（缩放、平移）

**任务清单**：
- [ ] 实现 `Viewport` 类（zoom、offsetX、offsetY）
- [ ] 实现坐标系统转换：
  - 屏幕坐标 → 画布坐标
  - 画布坐标 → 屏幕坐标
- [ ] 实现 `Renderer` 类：
  - 初始化 Canvas
  - 清空画布
  - 应用视口变换
  - 渲染循环（requestAnimationFrame）
- [ ] 实现视口控制：
  - 鼠标滚轮缩放（以鼠标位置为中心）
  - 拖拽平移（空格键 + 拖拽 或 中键拖拽）
  - 缩放限制（minZoom: 0.1, maxZoom: 10）
- [ ] 实现 React 组件 `EditorCanvas`（基础版）

**关键文件**：
```
packages/core/src/
├── viewport/
│   ├── Viewport.ts           # 视口状态
│   └── index.ts
├── renderer/
│   ├── Renderer.ts           # 渲染器主类
│   ├── RenderContext.ts      # 渲染上下文（封装 Canvas2D）
│   └── index.ts
└── utils/
    └── math.ts               # 数学工具（坐标转换等）

packages/react/src/
├── components/
│   └── EditorCanvas.tsx      # 编辑器画布组件
├── hooks/
│   └── useEditor.ts          # Editor Hook
└── index.ts
```

**验收标准**：
- Canvas 可以正常显示
- 可以通过滚轮缩放画布
- 可以拖拽平移画布
- 缩放平移流畅，60fps

---

### Step 4: Editor 主类与状态管理（2 天）

**目标**：实现 Editor 主类，整合所有模块；集成 Zustand 状态管理

**任务清单**：
- [ ] 实现 `Editor` 类，组装：
  - Scene（场景数据）
  - Viewport（视口状态）
  - Renderer（渲染器）
  - CommandExecutor（命令执行器）
  - 后续：InteractionManager、SelectionManager
- [ ] 实现 Zustand store：
  - `useEditorStore` - 编辑器全局状态
  - 支持选择性订阅
  - 支持非 React 代码访问
- [ ] 实现 Editor 生命周期管理（init、destroy）
- [ ] 完善 React 集成（`EditorProvider`、`useEditor`）

**关键文件**：
```
packages/core/src/
├── Editor.ts                 # Editor 主类
└── index.ts

packages/react/src/
├── store/
│   └── editorStore.ts        # Zustand store
├── context/
│   └── EditorContext.tsx     # Editor Context Provider
├── hooks/
│   ├── useEditor.ts
│   ├── useViewport.ts
│   └── useSelection.ts
└── index.ts
```

**验收标准**：
- Editor 可以正确初始化和销毁
- Zustand store 工作正常
- React 组件可以访问 Editor 状态

---

### Step 5: 基础元素渲染（2 天）

**目标**：实现矩形和圆形的渲染

**任务清单**：
- [ ] 实现元素渲染器接口 `ElementRenderer`
- [ ] 实现 `RectangleRenderer`（矩形渲染器）
  - 填充色、边框、圆角
- [ ] 实现 `EllipseRenderer`（圆形/椭圆渲染器）
- [ ] 实现元素变换矩阵应用（translate、rotate、scale）
- [ ] 实现元素排序（按创建顺序，zIndex）
- [ ] 实现元素可见性控制
- [ ] 实现渲染器注册表（支持扩展）

**关键文件**：
```
packages/core/src/renderer/
├── Renderer.ts
├── ElementRenderer.ts        # 元素渲染器接口
├── RendererRegistry.ts       # 渲染器注册表
├── renderers/
│   ├── RectangleRenderer.ts
│   ├── EllipseRenderer.ts
│   └── index.ts
└── index.ts
```

**验收标准**：
- 可以在画布上渲染矩形和圆形
- 元素正确应用变换（位置、旋转、缩放）
- 元素按正确顺序渲染
- 不可见元素不渲染

---

### Step 6: 交互系统 - 选择与命中检测（3 天）

**目标**：实现点击选择、框选、多选功能

**任务清单**：
- [ ] 实现 `SelectionManager`（选择状态管理）
- [ ] 实现 `HitTester`（命中检测）：
  - 点击命中检测
  - 考虑元素变换（旋转后的命中）
  - 命中优先级（上层元素优先）
- [ ] 实现交互状态机 `InteractionManager`：
  - `idle` - 空闲状态
  - `selecting` - 框选状态
- [ ] 实现点击选择元素
- [ ] 实现框选（拖拽选择框）
- [ ] 实现多选（Ctrl/Cmd + 点击）
- [ ] 实现选择可视化：
  - 选择框（蓝色边框）
  - 控制点（8 个方向 + 旋转）
  - 框选矩形

**关键文件**：
```
packages/core/src/
├── selection/
│   ├── SelectionManager.ts
│   └── index.ts
├── interaction/
│   ├── InteractionManager.ts
│   ├── HitTester.ts
│   ├── handlers/
│   │   ├── SelectHandler.ts
│   │   └── MarqueeHandler.ts
│   └── index.ts
├── renderer/
│   └── overlays/
│       ├── SelectionOverlay.ts    # 选择框渲染
│       └── MarqueeOverlay.ts      # 框选矩形渲染
```

**验收标准**：
- 可以点击选择单个元素
- 可以框选多个元素
- 可以 Ctrl/Cmd 多选
- 选择框和控制点正确显示

---

### Step 7: 交互系统 - 变换操作（3 天）

**目标**：实现元素的移动、缩放、旋转

**任务清单**：
- [ ] 扩展交互状态机：
  - `dragging` - 拖拽移动状态
  - `resizing` - 缩放状态
  - `rotating` - 旋转状态
- [ ] 实现拖拽移动：
  - 单个元素拖拽
  - 多选元素统一拖拽
  - 移动时生成 `UpdateElementCommand`
- [ ] 实现拖拽缩放：
  - 8 个方向的控制点
  - 约束缩放（Shift 保持宽高比）
  - 从中心缩放（Alt 键）
- [ ] 实现拖拽旋转：
  - 旋转控制点（选择框上方）
  - 约束旋转（Shift 15° 步进）
- [ ] 实现命令合并（连续拖拽合并为一个命令）

**关键文件**：
```
packages/core/src/interaction/handlers/
├── DragHandler.ts            # 拖拽移动处理
├── ResizeHandler.ts          # 缩放处理
└── RotateHandler.ts          # 旋转处理

packages/core/src/command/commands/
└── BatchUpdateCommand.ts     # 批量更新命令（多选变换）
```

**验收标准**：
- 可以拖拽移动元素
- 可以通过控制点缩放元素
- 可以旋转元素
- 支持约束操作（Shift、Alt 键）
- 多选元素可以统一变换
- Undo/Redo 正常工作

---

### Step 8: 工具系统与元素创建（2 天）

**目标**：实现工具切换和元素创建流程

**任务清单**：
- [ ] 实现 `ToolManager`（工具管理器）
- [ ] 实现工具接口 `Tool`
- [ ] 实现基础工具：
  - `SelectTool` - 选择工具（默认）
  - `RectangleTool` - 矩形工具
  - `EllipseTool` - 圆形工具
- [ ] 实现绘制流程：
  - 点击拖拽创建元素
  - 实时预览
  - 释放确认创建
- [ ] 实现工具快捷键（V 选择，R 矩形，O 圆形）
- [ ] 实现工具栏 UI（React）

**关键文件**：
```
packages/core/src/tools/
├── Tool.ts                   # 工具接口
├── ToolManager.ts            # 工具管理器
├── tools/
│   ├── SelectTool.ts
│   ├── RectangleTool.ts
│   └── EllipseTool.ts
└── index.ts

packages/react/src/components/
└── Toolbar.tsx               # 工具栏组件
```

**验收标准**：
- 可以切换不同工具
- 可以拖拽创建矩形和圆形
- 工具快捷键正常工作
- 工具栏 UI 显示当前工具

---

### Step 9: 文字元素（2 天）

**目标**：实现文字元素的渲染和编辑

**任务清单**：
- [ ] 定义文字元素属性（content、fontSize、fontFamily、color、align）
- [ ] 实现 `TextRenderer`（文字渲染器）
- [ ] 实现 `TextTool`（文字工具）：
  - 点击创建文字元素
  - 立即进入编辑模式
- [ ] 实现文字编辑：
  - 双击进入编辑模式
  - 覆盖 `<textarea>` 或 contenteditable
  - 失去焦点保存
- [ ] 实现文字属性面板（字体、大小、颜色）

**关键文件**：
```
packages/core/src/
├── renderer/renderers/
│   └── TextRenderer.ts
├── tools/tools/
│   └── TextTool.ts
├── interaction/
│   └── TextEditor.ts         # 文字编辑控制器

packages/react/src/components/
├── TextEditOverlay.tsx       # 文字编辑覆盖层
└── PropertyPanel.tsx         # 属性面板（包含文字属性）
```

**验收标准**：
- 可以创建文字元素
- 双击可以编辑文字
- 文字样式可以修改
- 编辑体验流畅

---

### Step 10: 图片元素（2 天）

**目标**：实现图片元素的导入和渲染

**任务清单**：
- [ ] 定义图片元素属性（src、naturalWidth、naturalHeight）
- [ ] 实现图片加载器（支持 URL、File、Base64）
- [ ] 实现 `ImageRenderer`（图片渲染器）
- [ ] 实现图片导入：
  - 拖拽文件到画布
  - 文件选择器
  - 粘贴图片
- [ ] 实现图片变换（默认保持宽高比）
- [ ] 实现图片加载状态（loading、error）

**关键文件**：
```
packages/core/src/
├── renderer/renderers/
│   └── ImageRenderer.ts
├── utils/
│   └── imageLoader.ts        # 图片加载工具

packages/react/src/components/
└── ImageDropZone.tsx         # 图片拖拽区域
```

**验收标准**：
- 可以导入图片（拖拽、选择、粘贴）
- 图片正确渲染和变换
- 图片加载有状态提示

---

### Step 11: 图层管理（2 天）

**目标**：实现图层的排序、显示、锁定

**任务清单**：
- [ ] 实现图层顺序数据结构（Scene 中维护 zIndex）
- [ ] 实现图层顺序调整命令：
  - `BringToFrontCommand` - 置顶
  - `SendToBackCommand` - 置底
  - `BringForwardCommand` - 上移一层
  - `SendBackwardCommand` - 下移一层
- [ ] 实现图层显示/隐藏
- [ ] 实现图层锁定/解锁（锁定后不可选择和编辑）
- [ ] 实现图层面板 UI（React）
  - 图层列表
  - 拖拽排序
  - 显示/隐藏切换
  - 锁定/解锁切换
  - 图层重命名

**关键文件**：
```
packages/core/src/command/commands/
├── BringToFrontCommand.ts
├── SendToBackCommand.ts
├── BringForwardCommand.ts
└── SendBackwardCommand.ts

packages/react/src/components/
└── LayerPanel.tsx            # 图层面板
```

**验收标准**：
- 可以调整元素图层顺序
- 可以显示/隐藏元素
- 可以锁定元素
- 图层面板正确显示和交互

---

### Step 12: 对齐与辅助功能（2 天）

**目标**：实现对齐、分布、辅助线

**任务清单**：
- [ ] 实现对齐算法：
  - 左对齐、右对齐、水平居中
  - 上对齐、下对齐、垂直居中
- [ ] 实现分布算法：
  - 水平等距分布
  - 垂直等距分布
- [ ] 实现对齐命令
- [ ] 实现智能辅助线（拖拽时显示）：
  - 元素边缘对齐线
  - 元素中心对齐线
  - 画布中心线
- [ ] 实现吸附功能（拖拽时自动吸附到辅助线）
- [ ] 实现对齐操作 UI（工具栏按钮或右键菜单）

**关键文件**：
```
packages/core/src/
├── utils/
│   └── alignment.ts          # 对齐算法
├── interaction/
│   └── SnapGuide.ts          # 智能辅助线
├── renderer/overlays/
│   └── GuideOverlay.ts       # 辅助线渲染

packages/react/src/components/
└── AlignmentToolbar.tsx      # 对齐工具栏
```

**验收标准**：
- 可以对齐多个元素
- 可以分布元素
- 拖拽时显示智能辅助线
- 支持吸附

---

### Step 13: 复制粘贴与快捷键（1.5 天）

**目标**：实现剪贴板操作和完整的快捷键支持

**任务清单**：
- [ ] 实现剪贴板管理器：
  - 复制（Ctrl/Cmd + C）
  - 剪切（Ctrl/Cmd + X）
  - 粘贴（Ctrl/Cmd + V）
  - 原位粘贴
- [ ] 实现复制/粘贴命令
- [ ] 实现删除（Delete/Backspace）
- [ ] 实现全选（Ctrl/Cmd + A）
- [ ] 实现快捷键管理器
- [ ] 实现右键菜单

**关键文件**：
```
packages/core/src/
├── clipboard/
│   └── ClipboardManager.ts
├── keyboard/
│   └── KeyboardManager.ts
├── command/commands/
│   ├── CopyCommand.ts
│   ├── PasteCommand.ts
│   └── DuplicateCommand.ts

packages/react/src/components/
└── ContextMenu.tsx           # 右键菜单
```

**验收标准**：
- 复制粘贴正常工作
- 所有快捷键正常响应
- 右键菜单显示正确

---

### Step 14: UI 完善与打磨（1.5 天）

**目标**：完善整体 UI 和交互体验

**任务清单**：
- [ ] 完善工具栏设计
- [ ] 完善属性面板（根据选中元素类型显示不同属性）
- [ ] 完善图层面板样式
- [ ] 添加状态栏（显示缩放比例、选中元素数量等）
- [ ] 添加欢迎引导或空状态
- [ ] 优化交互反馈（hover、active 状态）
- [ ] 响应式布局适配
- [ ] 整体视觉风格统一

**验收标准**：
- UI 美观、专业
- 交互流畅、反馈清晰
- 整体体验完整

---

## 修订后的依赖关系图

```
Step 1: 项目基础
    ↓
Step 2: 核心数据结构 + 命令系统  ← 【关键：命令系统提前】
    ↓
Step 3: 渲染引擎 + 视口控制
    ↓
Step 4: Editor 主类 + 状态管理 (Zustand)
    ↓
Step 5: 基础元素渲染 (矩形、圆形)
    ↓
Step 6: 交互系统 - 选择与命中检测
    ↓
Step 7: 交互系统 - 变换操作 (移动、缩放、旋转)
    ↓
Step 8: 工具系统与元素创建
    ↓
    ├──→ Step 9: 文字元素
    │
    ├──→ Step 10: 图片元素
    │
    ↓
Step 11: 图层管理
    ↓
Step 12: 对齐与辅助功能
    ↓
Step 13: 复制粘贴与快捷键
    ↓
Step 14: UI 完善与打磨
```

---

## 修订后的时间安排

### Week 1（6 天工作日）
| Step | 内容 | 天数 | 累计 |
|------|------|------|------|
| 1 | 项目基础搭建 | 2 | 2 |
| 2 | 核心数据结构 + 命令系统 | 2 | 4 |
| 3 | 渲染引擎 + 视口控制 | 2 | 6 |

**Week 1 里程碑**：可以看到空白画布，可以缩放平移

### Week 2（5 天）
| Step | 内容 | 天数 | 累计 |
|------|------|------|------|
| 3 | 渲染引擎（续） | 1 | 1 |
| 4 | Editor 主类 + Zustand | 2 | 3 |
| 5 | 基础元素渲染 | 2 | 5 |

**Week 2 里程碑**：可以在画布上看到矩形和圆形

### Week 3（5 天）
| Step | 内容 | 天数 | 累计 |
|------|------|------|------|
| 6 | 选择与命中检测 | 3 | 3 |
| 7 | 变换操作 | 2 | 5 |

**Week 3 里程碑**：可以选择、移动、缩放、旋转元素，Undo/Redo 可用

### Week 4（5 天）
| Step | 内容 | 天数 | 累计 |
|------|------|------|------|
| 7 | 变换操作（续） | 1 | 1 |
| 8 | 工具系统 | 2 | 3 |
| 9 | 文字元素 | 2 | 5 |

### Week 5（5 天）- 缓冲周
| Step | 内容 | 天数 | 累计 |
|------|------|------|------|
| 10 | 图片元素 | 2 | 2 |
| 11 | 图层管理 | 2 | 4 |
| 12 | 对齐功能 | 1 | 5 |

### Week 6（3 天）- 收尾
| Step | 内容 | 天数 | 累计 |
|------|------|------|------|
| 12 | 对齐功能（续） | 1 | 1 |
| 13 | 复制粘贴与快捷键 | 1.5 | 2.5 |
| 14 | UI 完善 | 0.5 | 3 |

---

## 里程碑检查点

### M1.1: 基础可视化（Week 2 结束）
- ✅ 画布可以缩放和平移
- ✅ 可以看到预置的矩形和圆形元素
- ✅ Editor 架构搭建完成

### M1.2: 核心交互（Week 3 结束）
- ✅ 可以选择元素（点击、框选）
- ✅ 可以变换元素（移动、缩放、旋转）
- ✅ Undo/Redo 完全可用

### M1.3: 元素创建（Week 4 结束）
- ✅ 可以创建矩形、圆形、文字
- ✅ 工具系统完善
- ✅ 文字可以编辑

### M1.4: 功能完整（Week 5/6 结束）
- ✅ 图片导入可用
- ✅ 图层管理完善
- ✅ 对齐辅助线可用
- ✅ 复制粘贴完善
- ✅ UI 完整美观

---

## 与原计划对比：主要变更

| 项目 | 原计划 | 修订后 | 原因 |
|------|--------|--------|------|
| 命令系统 | Step 8 (Week 3) | Step 2 (Week 1) | 架构要求所有操作通过 Command |
| React 集成 | Step 12 (Week 4) | Step 3-4 (Week 1-2) | 需要尽早有可视化验证 |
| Zustand | 未明确 | Step 4 (Week 2) | 状态管理是核心依赖 |
| Editor 主类 | 未包含 | Step 4 (Week 2) | 需要统一入口组装模块 |
| 工具系统 | 未包含 | Step 8 (Week 4) | 创建元素的核心机制 |
| 时间安排 | 4 周 | 6 周 | 原计划过于紧张 |
| 步骤数 | 12 步 | 14 步 | 更细粒度，更可控 |

---

## 风险与缓冲

1. **技术风险**：文字编辑（Step 9）可能比预期复杂，预留时间
2. **时间缓冲**：Week 5 作为缓冲周，吸收前面的延期
3. **功能降级**：如果时间紧张，智能辅助线可以简化

---

## 测试策略

每个步骤完成后：
- **单元测试**：核心逻辑（Scene、Command）
- **手动验证**：在 Web 应用中验证功能
- **代码审查**：确保架构符合设计

Phase 1 结束后：
- **集成测试**：模块间协作
- **E2E 测试**：关键用户流程

---

*本文档将随着开发进度持续更新。*
