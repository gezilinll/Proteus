# 从零构建 AI 原生多模态编辑器（二）：渲染引擎核心实现

> 本文是《从零构建 AI 原生多模态编辑器》系列的第二篇。在上一篇我们完成了架构设计和技术选型，本文将深入渲染引擎的核心实现，包括 Viewport 视口控制、可扩展的元素渲染器系统、以及所见即所得的文字编辑方案。

---

## 渲染引擎的职责

在图形编辑器中，渲染引擎是连接数据层和用户视觉的桥梁。它需要：

1. **高效渲染**：将 Scene 中的元素绘制到 Canvas，保持 60fps
2. **视口控制**：支持缩放、平移，处理坐标转换
3. **元素变换**：正确应用位置、大小、旋转
4. **层级管理**：按 z-order 顺序渲染
5. **Overlay 绘制**：渲染选择框、控制点等 UI 元素

我们的渲染引擎采用单一渲染循环 + 可插拔元素渲染器的设计：

```
┌─────────────────────────────────────────┐
│              Renderer                    │
│  ┌─────────────────────────────────┐    │
│  │         Render Loop             │    │
│  │  1. Clear Canvas                │    │
│  │  2. Apply Viewport Transform    │    │
│  │  3. Render Elements (z-order)   │    │
│  │  4. Render Overlays             │    │
│  └─────────────────────────────────┘    │
│                   │                      │
│     ┌─────────────┼─────────────┐       │
│     ▼             ▼             ▼       │
│  ┌──────┐   ┌──────────┐   ┌────────┐  │
│  │Rect  │   │Ellipse   │   │Text    │  │
│  │Render│   │Renderer  │   │Renderer│  │
│  └──────┘   └──────────┘   └────────┘  │
└─────────────────────────────────────────┘
```

---

## Viewport：视口与坐标系

### 核心概念

用户在编辑器中看到的是一个「窗口」，透过它观察无限大的画布。Viewport 管理三个关键状态：

```typescript
class Viewport {
  private _zoom: number = 1.0;    // 缩放比例
  private _offsetX: number = 0;   // 水平偏移
  private _offsetY: number = 0;   // 垂直偏移
}
```

### 坐标转换

编辑器中存在两套坐标系：

| 坐标系 | 描述 | 示例 |
|--------|------|------|
| **屏幕坐标** | 相对于 Canvas 左上角的像素位置 | 鼠标点击位置 |
| **画布坐标** | 相对于逻辑画布原点的位置 | 元素的 x, y |

转换公式：

```typescript
// 屏幕坐标 → 画布坐标
function screenToCanvas(screenX: number, screenY: number, viewport: Viewport) {
  return {
    x: (screenX - viewport.offsetX) / viewport.zoom,
    y: (screenY - viewport.offsetY) / viewport.zoom,
  };
}

// 画布坐标 → 屏幕坐标
function canvasToScreen(canvasX: number, canvasY: number, viewport: Viewport) {
  return {
    x: canvasX * viewport.zoom + viewport.offsetX,
    y: canvasY * viewport.zoom + viewport.offsetY,
  };
}
```

### 以鼠标为中心的缩放

直觉的缩放行为是「鼠标所指的点在缩放后保持不动」。实现方式：

```typescript
zoomBy(delta: number, centerX: number, centerY: number): void {
  const oldZoom = this._zoom;
  const newZoom = clamp(this._zoom * delta, this.minZoom, this.maxZoom);
  
  // 调整偏移，保持 center 点位置不变
  const zoomRatio = newZoom / oldZoom;
  this._offsetX = centerX - (centerX - this._offsetX) * zoomRatio;
  this._offsetY = centerY - (centerY - this._offsetY) * zoomRatio;
  this._zoom = newZoom;
}
```

数学原理：设鼠标位置为 `(cx, cy)`，缩放前后该点对应的画布坐标应该相同：

```
缩放前画布坐标: (cx - offsetX) / oldZoom
缩放后画布坐标: (cx - newOffsetX) / newZoom

两者相等，解出 newOffsetX
```

---

## 高分辨率屏幕适配（DPR）

现代设备的 devicePixelRatio 通常大于 1（如 Retina 屏幕为 2）。如果不处理，Canvas 内容会显得模糊。

### 问题

```
Canvas 物理尺寸: 800 × 600 px
设备像素比: 2
实际显示像素: 1600 × 1200

不处理 DPR → 800×600 的图像被拉伸到 1600×1200 → 模糊
```

### 解决方案

```typescript
function setupCanvas(canvas: HTMLCanvasElement, width: number, height: number) {
  const dpr = window.devicePixelRatio || 1;
  
  // 设置物理像素尺寸
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  
  // 设置 CSS 显示尺寸
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  
  // 渲染时应用 DPR 缩放
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
}
```

---

## 可扩展的元素渲染器

### 设计原则

不同类型的元素（矩形、椭圆、文字、图片）有不同的渲染逻辑。我们采用**策略模式**，将渲染逻辑解耦：

```typescript
interface ElementRenderer {
  render(ctx: RenderContext, element: Element): void;
}

class RendererRegistry {
  private renderers = new Map<ElementType, ElementRenderer>();
  
  register(type: ElementType, renderer: ElementRenderer): void {
    this.renderers.set(type, renderer);
  }
  
  get(type: ElementType): ElementRenderer | undefined {
    return this.renderers.get(type);
  }
}
```

### 渲染流程

主渲染器遍历元素，根据类型委托给对应的渲染器：

```typescript
class Renderer {
  private render(): void {
    // 1. 清空画布
    ctx.clear(width, height);
    
    // 2. 应用 DPR 和 Viewport 变换
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.translate(viewport.offsetX, viewport.offsetY);
    ctx.scale(viewport.zoom, viewport.zoom);
    
    // 3. 按 z-order 渲染元素
    for (const element of scene.getOrdered()) {
      this.renderElement(ctx, element);
    }
    
    // 4. 渲染 Overlay（选择框、控制点）
    this.renderOverlays(ctx);
    
    ctx.restore();
  }
  
  private renderElement(ctx: RenderContext, element: Element): void {
    const renderer = this.registry.get(element.type);
    if (!renderer) return;
    
    ctx.save();
    
    // 移动到元素中心，应用旋转
    const { x, y, width, height, rotation } = element.transform;
    ctx.translate(x + width / 2, y + height / 2);
    ctx.rotate(rotation);
    
    // 委托给具体渲染器
    renderer.render(ctx, element);
    
    ctx.restore();
  }
}
```

### 矩形渲染器示例

```typescript
class RectangleRenderer implements ElementRenderer {
  render(ctx: RenderContext, element: Element): void {
    const { width, height } = element.transform;
    const { fill, stroke, strokeWidth, borderRadius, opacity } = element.style;
    
    ctx.globalAlpha = opacity ?? 1;
    
    const x = -width / 2;
    const y = -height / 2;
    
    ctx.beginPath();
    if (borderRadius && borderRadius > 0) {
      ctx.roundRect(x, y, width, height, borderRadius);
    } else {
      ctx.rect(x, y, width, height);
    }
    
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke && strokeWidth) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      ctx.stroke();
    }
  }
}
```

---

## 选择与变换 Overlay

选中元素时需要渲染：
- 选择框（虚线边框）
- 8 个缩放控制点
- 1 个旋转控制点

### 控制点计算

```typescript
function computeControlPoints(bounds: Bounds): ControlPoint[] {
  const { minX, minY, maxX, maxY } = bounds;
  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;
  
  return [
    { type: 'nw', x: minX, y: minY },
    { type: 'n',  x: midX, y: minY },
    { type: 'ne', x: maxX, y: minY },
    { type: 'e',  x: maxX, y: midY },
    { type: 'se', x: maxX, y: maxY },
    { type: 's',  x: midX, y: maxY },
    { type: 'sw', x: minX, y: maxY },
    { type: 'w',  x: minX, y: midY },
    { type: 'rotate', x: midX, y: minY - 30 }, // 旋转点在顶部上方
  ];
}
```

### 控制点固定尺寸

控制点的尺寸应该**不随缩放变化**，保持视觉一致性：

```typescript
renderControlPoints(ctx: RenderContext, points: ControlPoint[], zoom: number): void {
  const size = 8 / zoom;  // 反向缩放，保持固定尺寸
  
  for (const point of points) {
    ctx.fillRect(point.x - size/2, point.y - size/2, size, size);
  }
}
```

---

## 文字渲染与所见即所得编辑

文字是编辑器中最复杂的元素类型，因为它需要同时支持 Canvas 渲染和 DOM 编辑。

### 方案选择

| 方案 | 优点 | 缺点 |
|------|------|------|
| **Canvas 原生** | 完全所见即所得 | 需自己实现光标、选区、输入法 |
| **DOM 覆盖层** | 利用浏览器能力 | DOM 和 Canvas 需精确对齐 |
| **第三方富文本库** | 功能完善 | 与 Canvas 集成困难 |

我们选择 **DOM 覆盖层方案**，在编辑时显示 `contenteditable` div，非编辑时渲染到 Canvas。

### 实现要点

#### 1. 编辑时隐藏 Canvas 渲染

```typescript
// TextRenderer.ts
render(ctx: RenderContext, element: Element): void {
  if (element.style._editing) {
    return; // 编辑模式下跳过 Canvas 渲染
  }
  // ... 正常渲染逻辑
}
```

#### 2. DOM 位置精确对齐

```typescript
// TextEditOverlay.tsx
const screenPos = canvasToScreen(element.x, element.y, viewport);

<div
  contentEditable
  style={{
    position: 'absolute',
    left: screenPos.x,
    top: screenPos.y - baselineOffset, // 补偿 baseline 差异
    width: element.width * zoom,
    height: element.height * zoom,
    fontSize: element.fontSize * zoom,
    // ...
  }}
/>
```

#### 3. CSS 与 Canvas 的 baseline 差异

**问题**：CSS `line-height` 和 Canvas `textBaseline` 的渲染机制不同，导致约 2-3px 的垂直偏移。

**原因**：
- Canvas `textBaseline: 'top'`：y 坐标是文字顶部
- CSS `line-height: 1.2`：在文字上下添加等量空间

**解决方案**：

```typescript
const baselineOffset = scaledFontSize * 0.15; // 经验值
top: screenPos.y - baselineOffset;
```

偏移量与缩放后的字体大小成正比，确保不同缩放级别下都能对齐。

---

## 自适应网格背景

Miro 风格的网格背景随缩放动态变化，提供空间参照感。

### 实现

```typescript
const baseGridSize = 40; // 100% 时的网格大小
const gridSize = Math.max(5, Math.min(300, baseGridSize * zoom));

// CSS 背景
style={{
  backgroundImage: `
    linear-gradient(rgba(200,200,200,0.6) 1px, transparent 1px),
    linear-gradient(90deg, rgba(200,200,200,0.6) 1px, transparent 1px)
  `,
  backgroundSize: `${gridSize}px ${gridSize}px`,
  backgroundPosition: `${offsetX % gridSize}px ${offsetY % gridSize}px`,
}}
```

### 关键点

- `gridSize` 限制在 5-300px 范围，避免过密或过疏
- `backgroundPosition` 随 offset 变化，实现平移跟随
- 网格密度与 zoom 线性关系，避免跳跃

---

## 性能优化

### 1. 按需渲染

只在需要时重绘，而不是持续的渲染循环：

```typescript
requestRender(): void {
  if (this.pendingRender) return;
  this.pendingRender = requestAnimationFrame(() => {
    this.render();
    this.pendingRender = null;
  });
}
```

### 2. 视口裁剪

只渲染视口内可见的元素：

```typescript
const visibleElements = elements.filter(el => 
  isIntersecting(el.bounds, viewportBounds)
);
```

### 3. 分层渲染

将静态内容和动态内容分离到不同 Canvas 层：

```
┌─────────────────────────┐
│  Overlay Canvas          │  ← 选择框、光标（频繁更新）
├─────────────────────────┤
│  Content Canvas          │  ← 元素（偶尔更新）
├─────────────────────────┤
│  Background Canvas       │  ← 网格（几乎不更新）
└─────────────────────────┘
```

---

## 总结

本文介绍了渲染引擎的核心实现：

1. **Viewport**：管理缩放和平移，处理坐标转换
2. **DPR 适配**：解决高分辨率屏幕模糊问题
3. **元素渲染器**：策略模式实现可扩展的渲染架构
4. **Overlay 系统**：渲染选择框和控制点
5. **文字编辑**：DOM 覆盖层实现所见即所得
6. **性能优化**：按需渲染、视口裁剪

下一篇我们将深入**交互系统设计**，包括工具状态机、拖拽/缩放/旋转的实现、以及撤销重做的集成。

---

*本文是《从零构建 AI 原生多模态编辑器》系列的第二篇。代码已开源在 [GitHub](https://github.com/gezilinll/Proteus)，欢迎 Star 和贡献。*

