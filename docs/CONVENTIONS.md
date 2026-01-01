# 开发约定

> 本文档列出项目的开发规范和约定。AI 助手在编写代码时应遵循这些规则。

---

## 代码风格

### TypeScript

- 使用 TypeScript 严格模式
- 优先使用 `interface` 而非 `type`（可扩展性更好）
- 导出类型时使用 `export type`
- 避免 `any`，使用 `unknown` 需要时进行类型收窄

### 命名

| 类型 | 风格 | 示例 |
|------|------|------|
| 类 | PascalCase | `RectangleRenderer` |
| 接口 | PascalCase | `ElementRenderer` |
| 函数 | camelCase | `createElement` |
| 变量 | camelCase | `selectedIds` |
| 常量 | UPPER_SNAKE | `MAX_ZOOM` |
| 文件（类/组件） | PascalCase | `SelectTool.ts` |
| 文件（工具函数） | camelCase | `math.ts` |
| 测试文件 | `*.test.ts` | `Scene.test.ts` |

### 目录结构

- 模块相关文件放在同一目录
- 每个目录有 `index.ts` 导出公共 API
- 测试文件与源文件同目录

---

## 架构约定

### Command 模式

**必须**：所有对 Scene 的修改通过 Command 执行

```typescript
// ✅ 正确
const command = new UpdateElementCommand(scene, id, changes);
editor.executeCommand(command);

// ❌ 错误
scene.update(id, changes);  // 直接修改，无法撤销
```

### 渲染请求

**必须**：修改后调用 `editor.requestRender()`

```typescript
// ✅ 正确
editor.executeCommand(command);
editor.requestRender();

// ❌ 错误
editor.executeCommand(command);
// 忘记请求渲染，画面不更新
```

### 深拷贝

**必须**：存储元素时使用深拷贝，避免引用共享

```typescript
// ✅ 正确
this.clipboard = elements.map(el => deepClone(el));

// ❌ 错误
this.clipboard = elements;  // 引用共享，后续修改会影响剪贴板
```

使用：`packages/core/src/utils/clone.ts` 的 `deepClone`

### 事件发射

使用 `EventEmitter` 进行模块间通信：

```typescript
// 定义事件类型
interface SceneEvents {
  elementAdded: [element: Element];
  elementRemoved: [id: string];
}

// 发射事件
this.emit('elementAdded', element);

// 监听事件
scene.on('elementAdded', (element) => { ... });
```

---

## 新增功能的标准流程

### 新增元素类型

1. 在 `ElementType` 枚举添加类型
2. 创建 `XXXRenderer` 实现 `ElementRenderer` 接口
3. 在 `Renderer` 中注册渲染器
4. 如需工具，创建 `XXXTool` 实现 `Tool` 接口
5. 添加测试

### 新增命令

1. 在 `command/commands/` 创建命令类
2. 实现 `Command` 接口的 `execute`, `undo`, `redo`
3. 在 `command/index.ts` 导出
4. 添加测试

### 新增工具

1. 在 `tools/tools/` 创建工具类
2. 实现 `Tool` 接口
3. 在 `ToolManager` 中注册
4. 在 UI 工具栏添加按钮
5. 注册快捷键（如需要）

---

## 测试约定

### 单元测试

- 每个模块应有对应的测试文件
- 测试文件命名：`ModuleName.test.ts`
- 使用 Vitest 的 `describe`, `it`, `expect`

### 集成测试

- 入口：`packages/core/src/Editor.integration.test.ts`
- 测试完整的用户交互流程
- 新增功能应添加对应的集成测试

### Mock

Canvas 环境使用 jsdom + canvas 包，或手动 mock：

```typescript
canvas.getContext = vi.fn().mockReturnValue({
  save: vi.fn(),
  restore: vi.fn(),
  // ...
});
```

---

## Git 约定

### Commit Message

使用 Conventional Commits：

```
feat: 添加图片元素支持
fix: 修复旋转元素点击检测
refactor: 重构渲染器注册机制
docs: 更新架构文档
test: 添加选择系统测试
chore: 更新依赖版本
```

### 分支

- `main`: 稳定版本
- `feat/xxx`: 功能开发
- `fix/xxx`: Bug 修复

---

## 性能约定

### 渲染

- 使用 `requestAnimationFrame` 合并渲染请求
- 视口裁剪：只渲染可见元素
- 避免在渲染循环中创建对象

### 事件处理

- `mousemove` 等高频事件中避免重复计算
- 使用防抖/节流处理非关键更新

### 内存

- 及时清理事件监听器
- `destroy()` 方法中释放资源

