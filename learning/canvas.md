# Canvas 2D

> 浏览器原生图形绘制 API。

---

## 概述

### 是什么

Canvas 是 HTML5 引入的元素，提供了一个可以通过 JavaScript 绘制图形的区域。Canvas 2D Context 是最常用的渲染上下文，提供 2D 图形绘制能力。

### 适用场景

- 图形编辑器
- 数据可视化
- 游戏开发
- 图像处理
- 自定义 UI 组件

---

## 核心概念

### 1. 基础设置

```typescript
// 获取 Canvas 元素
const canvas = document.getElementById('canvas') as HTMLCanvasElement;

// 获取 2D 上下文
const ctx = canvas.getContext('2d')!;

// 设置画布大小（注意：CSS 大小和实际大小不同）
canvas.width = 800;  // 实际像素宽度
canvas.height = 600; // 实际像素高度

// 高清屏适配
const dpr = window.devicePixelRatio || 1;
canvas.width = 800 * dpr;
canvas.height = 600 * dpr;
canvas.style.width = '800px';
canvas.style.height = '600px';
ctx.scale(dpr, dpr);
```

### 2. 基础图形绘制

```typescript
// 矩形
ctx.fillStyle = '#3498db';
ctx.fillRect(10, 10, 100, 50);     // 填充矩形

ctx.strokeStyle = '#e74c3c';
ctx.lineWidth = 2;
ctx.strokeRect(130, 10, 100, 50);  // 描边矩形

ctx.clearRect(20, 20, 30, 30);     // 清除区域

// 圆形/椭圆
ctx.beginPath();
ctx.arc(100, 150, 40, 0, Math.PI * 2); // x, y, radius, startAngle, endAngle
ctx.fill();

ctx.beginPath();
ctx.ellipse(200, 150, 60, 30, 0, 0, Math.PI * 2); // x, y, radiusX, radiusY, rotation, start, end
ctx.stroke();

// 线条
ctx.beginPath();
ctx.moveTo(10, 200);
ctx.lineTo(100, 250);
ctx.lineTo(50, 300);
ctx.closePath(); // 闭合路径
ctx.stroke();
```

### 3. 路径绘制

```typescript
// 路径是 Canvas 绑核心概念
ctx.beginPath();        // 开始新路径

// 移动画笔
ctx.moveTo(x, y);

// 直线
ctx.lineTo(x, y);

// 贝塞尔曲线
ctx.quadraticCurveTo(cpx, cpy, x, y);           // 二次贝塞尔
ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y); // 三次贝塞尔

// 圆弧
ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
ctx.arcTo(x1, y1, x2, y2, radius);

// 矩形路径
ctx.rect(x, y, width, height);

// 闭合路径
ctx.closePath();

// 绘制路径
ctx.stroke();  // 描边
ctx.fill();    // 填充

// Path2D 对象（可复用）
const path = new Path2D();
path.rect(10, 10, 100, 100);
path.arc(50, 50, 40, 0, Math.PI * 2);
ctx.fill(path);
```

### 4. 样式设置

```typescript
// 颜色
ctx.fillStyle = '#3498db';              // CSS 颜色
ctx.fillStyle = 'rgb(52, 152, 219)';
ctx.fillStyle = 'rgba(52, 152, 219, 0.5)';
ctx.strokeStyle = 'hsl(210, 70%, 50%)';

// 渐变
const linearGradient = ctx.createLinearGradient(0, 0, 200, 0);
linearGradient.addColorStop(0, 'red');
linearGradient.addColorStop(0.5, 'yellow');
linearGradient.addColorStop(1, 'green');
ctx.fillStyle = linearGradient;

const radialGradient = ctx.createRadialGradient(100, 100, 10, 100, 100, 100);
radialGradient.addColorStop(0, 'white');
radialGradient.addColorStop(1, 'black');

// 图案
const img = new Image();
img.src = 'pattern.png';
img.onload = () => {
  const pattern = ctx.createPattern(img, 'repeat'); // repeat, repeat-x, repeat-y, no-repeat
  ctx.fillStyle = pattern!;
};

// 线条样式
ctx.lineWidth = 5;
ctx.lineCap = 'round';    // butt, round, square
ctx.lineJoin = 'round';   // round, bevel, miter
ctx.miterLimit = 10;
ctx.setLineDash([5, 15]); // 虚线
ctx.lineDashOffset = 0;   // 虚线偏移

// 阴影
ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
ctx.shadowBlur = 10;
ctx.shadowOffsetX = 5;
ctx.shadowOffsetY = 5;
```

### 5. 变换（Transform）

```typescript
// 平移
ctx.translate(x, y);

// 旋转（弧度）
ctx.rotate(angle);

// 缩放
ctx.scale(x, y);

// 变换矩阵
ctx.transform(a, b, c, d, e, f);
ctx.setTransform(a, b, c, d, e, f); // 重置后设置

// 保存和恢复状态
ctx.save();    // 保存当前状态到栈
// ... 进行变换和绑
ctx.restore(); // 恢复之前的状态

// 示例：以中心点旋转
function drawRotated(x: number, y: number, width: number, height: number, angle: number) {
  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);
  ctx.rotate(angle);
  ctx.fillRect(-width / 2, -height / 2, width, height);
  ctx.restore();
}
```

### 6. 合成与透明度

```typescript
// 全局透明度
ctx.globalAlpha = 0.5;

// 合成模式
ctx.globalCompositeOperation = 'source-over';  // 默认
ctx.globalCompositeOperation = 'source-atop';
ctx.globalCompositeOperation = 'destination-over';
ctx.globalCompositeOperation = 'lighter';      // 叠加
ctx.globalCompositeOperation = 'multiply';     // 正片叠底
ctx.globalCompositeOperation = 'screen';       // 滤色

// 剪切
ctx.beginPath();
ctx.arc(100, 100, 50, 0, Math.PI * 2);
ctx.clip(); // 后续绑只在圆内可见
```

### 7. 文本绘制

```typescript
// 设置字体
ctx.font = '24px Arial';
ctx.font = 'bold 16px "Helvetica Neue", sans-serif';

// 对齐
ctx.textAlign = 'center';    // left, right, center, start, end
ctx.textBaseline = 'middle'; // top, hanging, middle, alphabetic, ideographic, bottom

// 绘制文本
ctx.fillText('Hello', 100, 100);
ctx.strokeText('World', 100, 150);
ctx.fillText('Long text...', 100, 200, 100); // 限制最大宽度

// 测量文本
const metrics = ctx.measureText('Hello');
console.log(metrics.width);
console.log(metrics.actualBoundingBoxAscent);
console.log(metrics.actualBoundingBoxDescent);
```

### 8. 图像绘制

```typescript
const img = new Image();
img.src = 'image.png';
img.onload = () => {
  // 基本绘制
  ctx.drawImage(img, x, y);
  
  // 指定大小
  ctx.drawImage(img, x, y, width, height);
  
  // 裁剪并绘制（9 参数）
  ctx.drawImage(
    img,
    sx, sy, sWidth, sHeight,  // 源图裁剪区域
    dx, dy, dWidth, dHeight   // 目标区域
  );
};

// 绘制另一个 Canvas
ctx.drawImage(anotherCanvas, 0, 0);

// 绘制视频帧
ctx.drawImage(video, 0, 0);
```

### 9. 像素操作

```typescript
// 获取像素数据
const imageData = ctx.getImageData(x, y, width, height);
const data = imageData.data; // Uint8ClampedArray [r, g, b, a, r, g, b, a, ...]

// 遍历像素
for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const a = data[i + 3];
  
  // 修改像素（例如：灰度化）
  const gray = (r + g + b) / 3;
  data[i] = data[i + 1] = data[i + 2] = gray;
}

// 写回像素数据
ctx.putImageData(imageData, x, y);

// 创建新的像素数据
const newImageData = ctx.createImageData(width, height);
```

### 10. 命中检测

```typescript
// 点是否在路径内
ctx.beginPath();
ctx.rect(10, 10, 100, 100);
const isInPath = ctx.isPointInPath(50, 50); // true

// 点是否在描边上
const isInStroke = ctx.isPointInStroke(10, 50);

// Path2D 命中检测
const path = new Path2D();
path.rect(10, 10, 100, 100);
ctx.isPointInPath(path, 50, 50);
```

### 11. 性能优化

```typescript
// 1. 使用 requestAnimationFrame
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // 绑逻辑
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// 2. 离屏 Canvas（预渲染）
const offscreen = document.createElement('canvas');
offscreen.width = 100;
offscreen.height = 100;
const offCtx = offscreen.getContext('2d')!;
// 在离屏 Canvas 上绑复杂图形
offCtx.arc(50, 50, 40, 0, Math.PI * 2);
offCtx.fill();
// 使用时直接绘制离屏 Canvas
ctx.drawImage(offscreen, x, y);

// 3. 减少状态切换
// 批量绘制相同样式的图形

// 4. 使用整数坐标
ctx.fillRect(Math.round(x), Math.round(y), w, h);

// 5. 分层 Canvas
// 静态内容和动态内容分开

// 6. 脏矩形渲染
// 只重绘变化的区域
ctx.clearRect(dirtyX, dirtyY, dirtyW, dirtyH);
```

### 12. OffscreenCanvas（Web Worker）

```typescript
// 主线程
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const offscreen = canvas.transferControlToOffscreen();
const worker = new Worker('canvas-worker.js');
worker.postMessage({ canvas: offscreen }, [offscreen]);

// canvas-worker.js
self.onmessage = (e) => {
  const canvas = e.data.canvas;
  const ctx = canvas.getContext('2d');
  // 在 Worker 中渲染
};
```

---

## 在本项目中的应用

- **渲染引擎**：使用 Canvas 2D 渲染所有画布元素
- **变换系统**：利用 `save/restore` 和变换矩阵实现元素变换
- **视口控制**：通过变换实现缩放和平移
- **离屏渲染**：复杂图形预渲染提升性能

---

## 学习资源

### 官方资源

- [MDN Canvas 教程](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial) - 最全面的参考
- [MDN CanvasRenderingContext2D](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D) - API 参考

### 教程

- [HTML5 Canvas Tutorials](https://www.html5canvastutorials.com/) - 经典教程
- [Canvas Deep Dive](https://joshondesign.com/p/books/canvasdeepdive/toc.html) - 深入教程

### 书籍

- 《HTML5 Canvas 核心技术》- 系统学习 Canvas

### 工具

- [Fabric.js](http://fabricjs.com/) - Canvas 高级库
- [Konva.js](https://konvajs.org/) - 2D Canvas 库
- [PixiJS](https://pixijs.com/) - 2D WebGL 渲染器

---

*建议学习顺序：基础图形 → 路径 → 变换 → 合成 → 性能优化*

