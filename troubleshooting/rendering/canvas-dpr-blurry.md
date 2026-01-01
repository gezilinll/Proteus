# Canvas 高分辨率屏幕模糊问题 (DPR)

## 现象

在高分辨率屏幕（如 MacBook Retina 显示器、4K 显示器）上，Canvas 渲染的图形和文字出现明显模糊，边缘不清晰，影响用户体验。

在普通显示器（DPR = 1）上表现正常。

## 环境

- 高 DPR 设备（如 MacBook Pro，DPR = 2）
- 任何使用 Canvas 2D 渲染的场景
- 发生时间：Step 3 实现渲染引擎后

## 原因分析

### 什么是 DPR

**设备像素比 (Device Pixel Ratio, DPR)** = 物理像素 / 逻辑像素（CSS 像素）

| 设备 | DPR | 说明 |
|------|-----|------|
| 普通显示器 | 1 | 1 个 CSS 像素 = 1 个物理像素 |
| MacBook Retina | 2 | 1 个 CSS 像素 = 4 个物理像素 (2×2) |
| iPhone Pro | 3 | 1 个 CSS 像素 = 9 个物理像素 (3×3) |

### 为什么会模糊

Canvas 默认使用 CSS 像素作为尺寸单位。当你设置 `canvas.width = 800`，Canvas 内部的渲染缓冲区就是 800 个像素。

但在 DPR = 2 的屏幕上，800 CSS 像素实际对应 1600 个物理像素。浏览器会将 800 像素的 Canvas 缓冲区**拉伸**到 1600 物理像素显示，导致模糊。

```
┌─────────────────────────────────────────────────┐
│  Canvas 缓冲区: 800 × 600 像素                    │
│           ↓ 拉伸 (2×)                            │
│  屏幕显示: 1600 × 1200 物理像素                   │
│           = 模糊！                               │
└─────────────────────────────────────────────────┘
```

## 解决方案

### 核心思路

1. Canvas 缓冲区尺寸 = 显示尺寸 × DPR
2. 用 CSS 控制显示尺寸
3. 渲染时 scale(dpr, dpr) 让绑图坐标保持不变

### 代码实现

**设置 Canvas 尺寸：**

```typescript
function setupCanvas(canvas: HTMLCanvasElement, width: number, height: number) {
  const dpr = window.devicePixelRatio || 1;
  
  // 设置物理像素尺寸（渲染缓冲区）
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  
  // 设置显示尺寸（CSS）
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  
  return dpr;
}
```

**渲染时应用 DPR 缩放：**

```typescript
class Renderer {
  constructor(
    private canvas: HTMLCanvasElement,
    private dpr: number = 1
  ) {}

  render() {
    const ctx = this.canvas.getContext('2d');
    
    // 重置变换
    ctx.resetTransform();
    
    // 清空画布（使用物理像素尺寸）
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 应用 DPR 缩放
    ctx.scale(this.dpr, this.dpr);
    
    // 后续绑图使用逻辑像素坐标，无需关心 DPR
    ctx.fillRect(100, 100, 200, 150); // 正常使用
  }
}
```

### 修改前后对比

| 属性 | 修改前 | 修改后 (DPR=2) |
|------|--------|----------------|
| canvas.width | 800 | 1600 |
| canvas.height | 600 | 1200 |
| canvas.style.width | (未设置) | 800px |
| canvas.style.height | (未设置) | 600px |
| 绑图时 scale | (无) | scale(2, 2) |

## 延伸知识

### DPR 变化监听

用户可能在运行时改变 DPR（如拖动窗口到不同显示器）：

```typescript
function watchDPR(callback: (dpr: number) => void) {
  const media = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
  media.addEventListener('change', () => {
    callback(window.devicePixelRatio);
  });
}
```

### 注意事项

1. **坐标转换**：鼠标事件的坐标是 CSS 像素，需要考虑 DPR 转换
2. **图片渲染**：加载图片时也需要考虑 DPR，使用 `@2x` 资源
3. **性能影响**：高 DPR 意味着更多像素需要渲染，可能影响性能

### 其他渲染模糊原因

除了 DPR，还有其他可能导致 Canvas 模糊的原因：

1. **CSS 缩放**：使用 CSS transform: scale() 缩放 Canvas
2. **非整数坐标**：绑图时使用小数坐标（如 100.5, 200.3）
3. **图片质量设置**：ctx.imageSmoothingEnabled 的影响

## 参考

- [MDN: Window.devicePixelRatio](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio)
- [High DPI Canvas (HTML5 Rocks)](https://www.html5rocks.com/en/tutorials/canvas/hidpi/)
- [Canvas 优化指南 (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas)

