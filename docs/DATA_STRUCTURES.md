# 数据结构

> 本文档列出核心数据结构的定义位置。详细定义请直接阅读源码。

---

## 元素 (Element)

**定义位置**：`packages/core/src/types/element.ts`

核心接口：
```typescript
interface Element {
  id: string;
  type: ElementType;
  transform: Transform;
  style: Style;
  meta: Meta;
}
```

**createElement 函数**：同文件，用于创建元素

---

## 元素类型 (ElementType)

**定义位置**：`packages/core/src/types/ElementType.ts`

```typescript
enum ElementType {
  RECTANGLE = 'rectangle',
  ELLIPSE = 'ellipse',
  TEXT = 'text',
  IMAGE = 'image',
}
```

---

## 变换 (Transform)

**定义位置**：`packages/core/src/types/transform.ts`

```typescript
interface Transform {
  x: number;      // 左上角 X
  y: number;      // 左上角 Y
  width: number;
  height: number;
  rotation: number; // 弧度
}
```

---

## 样式 (Style)

**定义位置**：`packages/core/src/types/style.ts`

通用样式 + 元素特有样式：
- `fill`, `stroke`, `strokeWidth`, `opacity`
- Text: `text`, `fontSize`, `fontFamily`, `fontWeight`, `textAlign`
- Image: `imageUrl`

---

## 元数据 (Meta)

**定义位置**：`packages/core/src/types/meta.ts`

```typescript
interface Meta {
  locked: boolean;
  visible: boolean;
  name: string;
}
```

---

## 边界 (Bounds)

**定义位置**：`packages/core/src/types/bounds.ts`

```typescript
interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}
```

工具函数：`getElementBounds`, `boundsIntersect` 等

---

## 命令 (Command)

**定义位置**：`packages/core/src/command/Command.ts`

```typescript
interface Command {
  execute(): void;
  undo(): void;
  redo(): void;
}
```

---

## 工具 (Tool)

**定义位置**：`packages/core/src/tools/Tool.ts`

```typescript
interface Tool {
  name: string;
  cursor: string;
  onMouseDown(x: number, y: number): void;
  onMouseMove(x: number, y: number): void;
  onMouseUp(x: number, y: number): void;
  onActivate?(): void;
  onDeactivate?(): void;
}
```

---

## 控制点类型

**定义位置**：`packages/core/src/interaction/ControlPointHitTester.ts`

```typescript
type ControlPointType = 
  | 'nw' | 'n' | 'ne' 
  | 'w'  |       'e' 
  | 'sw' | 's' | 'se'
  | 'rotate';
```

---

## 视口状态

**定义位置**：`packages/core/src/viewport/Viewport.ts`

关键属性：
- `zoom: number` - 缩放比例
- `offsetX: number` - 水平偏移
- `offsetY: number` - 垂直偏移

---

## Zustand Store

**定义位置**：`packages/react/src/store/editorStore.ts`

状态：
- `editor: Editor | null`
- `selectedIds: Set<string>`
- `zoom: number`
- `currentTool: string`

