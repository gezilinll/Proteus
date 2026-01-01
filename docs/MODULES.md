# 模块索引

> 本文档列出所有核心模块及其代码位置。AI 助手应根据任务需求定位相关模块后直接阅读源码。

---

## packages/core/src/

### 场景管理

| 模块 | 文件 | 职责 |
|------|------|------|
| Scene | `scene/Scene.ts` | 元素存储、CRUD、z-order 管理 |

### 命令系统

| 模块 | 文件 | 职责 |
|------|------|------|
| Command 接口 | `command/Command.ts` | 命令基础接口 |
| CommandHistory | `command/CommandHistory.ts` | 撤销/重做栈管理 |
| AddElementCommand | `command/commands/AddElementCommand.ts` | 添加元素 |
| RemoveElementCommand | `command/commands/RemoveElementCommand.ts` | 删除元素 |
| UpdateElementCommand | `command/commands/UpdateElementCommand.ts` | 更新元素属性 |
| BatchCommand | `command/commands/BatchCommand.ts` | 批量命令 |
| CopyElementsCommand | `command/commands/CopyElementsCommand.ts` | 复制元素 |
| CutElementsCommand | `command/commands/CutElementsCommand.ts` | 剪切元素 |
| PasteElementsCommand | `command/commands/PasteElementsCommand.ts` | 粘贴元素 |
| DeleteElementsCommand | `command/commands/DeleteElementsCommand.ts` | 删除选中元素 |
| AlignElementsCommand | `command/commands/AlignElementsCommand.ts` | 对齐元素 |
| DistributeElementsCommand | `command/commands/DistributeElementsCommand.ts` | 分布元素 |
| ReorderElementsCommand | `command/commands/ReorderElementsCommand.ts` | 调整图层顺序 |

### 渲染系统

| 模块 | 文件 | 职责 |
|------|------|------|
| Renderer | `renderer/Renderer.ts` | 主渲染循环 |
| RenderContext | `renderer/RenderContext.ts` | Canvas 上下文封装 |
| RendererRegistry | `renderer/RendererRegistry.ts` | 元素渲染器注册表 |
| ElementRenderer | `renderer/ElementRenderer.ts` | 渲染器接口 |
| RectangleRenderer | `renderer/renderers/RectangleRenderer.ts` | 矩形渲染 |
| EllipseRenderer | `renderer/renderers/EllipseRenderer.ts` | 圆形渲染 |
| TextRenderer | `renderer/renderers/TextRenderer.ts` | 文字渲染 |
| ImageRenderer | `renderer/renderers/ImageRenderer.ts` | 图片渲染 |
| SelectionOverlay | `renderer/overlays/SelectionOverlay.ts` | 选择框渲染 |
| MarqueeOverlay | `renderer/overlays/MarqueeOverlay.ts` | 框选矩形渲染 |
| GuideOverlay | `renderer/overlays/GuideOverlay.ts` | 辅助线渲染 |

### 交互系统

| 模块 | 文件 | 职责 |
|------|------|------|
| InteractionManager | `interaction/InteractionManager.ts` | 交互状态管理 |
| HitTester | `interaction/HitTester.ts` | 元素点击检测 |
| ControlPointHitTester | `interaction/ControlPointHitTester.ts` | 控制点检测 |
| DragHandler | `interaction/handlers/DragHandler.ts` | 拖拽处理 |
| ResizeHandler | `interaction/handlers/ResizeHandler.ts` | 缩放处理 |
| RotateHandler | `interaction/handlers/RotateHandler.ts` | 旋转处理 |
| SnapGuide | `interaction/SnapGuide.ts` | 吸附辅助线 |

### 选择管理

| 模块 | 文件 | 职责 |
|------|------|------|
| SelectionManager | `selection/SelectionManager.ts` | 选中元素管理 |

### 工具系统

| 模块 | 文件 | 职责 |
|------|------|------|
| Tool 接口 | `tools/Tool.ts` | 工具基础接口 |
| ToolManager | `tools/ToolManager.ts` | 工具注册和切换 |
| SelectTool | `tools/tools/SelectTool.ts` | 选择工具 |
| RectangleTool | `tools/tools/RectangleTool.ts` | 矩形工具 |
| EllipseTool | `tools/tools/EllipseTool.ts` | 圆形工具 |
| TextTool | `tools/tools/TextTool.ts` | 文字工具 |
| ImageTool | `tools/tools/ImageTool.ts` | 图片工具 |

### 视口控制

| 模块 | 文件 | 职责 |
|------|------|------|
| Viewport | `viewport/Viewport.ts` | 缩放、平移、坐标转换 |

### 剪贴板

| 模块 | 文件 | 职责 |
|------|------|------|
| ClipboardManager | `clipboard/ClipboardManager.ts` | 剪贴板管理、系统剪贴板同步 |

### 键盘管理

| 模块 | 文件 | 职责 |
|------|------|------|
| KeyboardManager | `keyboard/KeyboardManager.ts` | 快捷键注册和处理 |

### 编辑器主类

| 模块 | 文件 | 职责 |
|------|------|------|
| Editor | `Editor.ts` | 整合所有模块的入口类 |

### 类型定义

| 模块 | 文件 | 职责 |
|------|------|------|
| Element | `types/element.ts` | 元素类型定义、createElement |
| ElementType | `types/ElementType.ts` | 元素类型枚举 |
| Transform | `types/transform.ts` | 变换类型 |
| Style | `types/style.ts` | 样式类型 |
| Bounds | `types/bounds.ts` | 边界类型 |
| Meta | `types/meta.ts` | 元数据类型 |

### 工具函数

| 模块 | 文件 | 职责 |
|------|------|------|
| math | `utils/math.ts` | 坐标转换、数学函数 |
| clone | `utils/clone.ts` | 深拷贝 |
| id | `utils/id.ts` | ID 生成 |
| alignment | `utils/alignment.ts` | 对齐分布算法 |
| imageLoader | `utils/imageLoader.ts` | 图片加载 |
| EventEmitter | `utils/EventEmitter.ts` | 事件发射器 |

---

## packages/react/src/

| 模块 | 文件 | 职责 |
|------|------|------|
| EditorContext | `context/EditorContext.tsx` | React Context Provider |
| useEditor | `hooks/useEditor.ts` | 获取 Editor 实例 |
| useSelection | `hooks/useSelection.ts` | 选中状态订阅 |
| useViewport | `hooks/useViewport.ts` | 视口状态订阅 |
| editorStore | `store/editorStore.ts` | Zustand store |
| EditorCanvas | `components/EditorCanvas.tsx` | Canvas 组件 |
| TextEditOverlay | `components/TextEditOverlay.tsx` | 文字编辑覆盖层 |
| Toolbar | `components/Toolbar.tsx` | 工具栏组件 |

---

## apps/web/src/

| 模块 | 文件 | 职责 |
|------|------|------|
| EditorLayout | `components/EditorLayout.tsx` | 整体布局 |
| ToolPanel | `components/ToolPanel.tsx` | 左侧工具栏 |
| TopBar | `components/TopBar.tsx` | 顶部导航栏 |
| StatusBar | `components/StatusBar.tsx` | 底部状态栏 |
| LayerPanel | `components/LayerPanel.tsx` | 图层面板 |
| AlignmentToolbar | `components/AlignmentToolbar.tsx` | 对齐分布工具栏 |
| CanvasArea | `components/CanvasArea.tsx` | 画布区域 |

---

## 测试文件

测试文件与源文件同目录，命名为 `*.test.ts`。

关键测试：
- `packages/core/src/Editor.integration.test.ts` - 24 个集成测试
- `packages/core/src/scene/Scene.test.ts` - Scene 单元测试
- `packages/core/src/command/CommandHistory.test.ts` - 命令历史测试

运行测试：
```bash
pnpm test                    # 所有测试
pnpm test:integration        # 仅集成测试
```

