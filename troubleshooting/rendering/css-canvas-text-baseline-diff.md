# CSS line-height 与 Canvas textBaseline 的渲染差异

## 现象

在实现 Canvas 图形编辑器的"所见即所得"文字编辑功能时，DOM 编辑器（如 `contenteditable` div）中的文字位置与 Canvas 渲染的文字位置存在垂直偏移。

具体表现：
- DOM 编辑器的文字比 Canvas 渲染的文字**偏下约 2-3 像素**
- 偏移量与字体大小成正比
- 在编辑/预览模式切换时，文字会有明显的"跳动"

## 环境

- 任何使用 Canvas 2D API 渲染文字的 Web 应用
- 需要在 Canvas 渲染和 DOM 编辑之间无缝切换的场景
- 常见于：图形编辑器、白板应用、在线设计工具

## 原因分析

### Canvas 文字渲染机制

```javascript
ctx.textBaseline = 'top';
ctx.fillText('Hello', x, y);
```

- `textBaseline: 'top'`：y 坐标指向文字的**顶部边缘**（ascender line）
- 文字从 y 坐标位置**向下**绘制
- 没有额外的行间距

### CSS 文字渲染机制

```css
line-height: 1.2;
```

- `line-height` 创建一个**行框（line box）**
- 文字在行框内**垂直居中**
- 行框高度 = fontSize × lineHeight
- 文字上下各有 `(行框高度 - 字体高度) / 2` 的空间

### 偏移量计算

```
行框高度 = fontSize × lineHeight = fontSize × 1.2
额外空间 = 行框高度 - fontSize = fontSize × 0.2
上方空间 = 额外空间 / 2 = fontSize × 0.1
```

理论偏移约为 `fontSize × 0.1`，但实际测试发现偏移约为 `fontSize × 0.15`，额外的差异可能来自：
- 字体的 ascender/descender 比例
- 浏览器的文字渲染微调
- Flexbox/Grid 布局的对齐计算

## 解决方案

在 DOM 编辑器的定位中，减去一个与字体大小成正比的偏移量：

```typescript
// 计算 baseline 偏移补偿
const scaledFontSize = fontSize * zoom;
const baselineOffset = scaledFontSize * 0.15; // 经验值

// 应用偏移
<div
  style={{
    position: 'absolute',
    left: position.x,
    top: position.y - baselineOffset, // 向上偏移
    // ...其他样式
  }}
>
  {text}
</div>
```

### 关键点

1. **偏移量与缩放后的字体大小成正比**：`baselineOffset = scaledFontSize * 0.15`
2. **0.15 是经验值**：基于 `line-height: 1.2` 测试得出，不同 line-height 需要调整
3. **zoom 需要考虑**：如果有视口缩放，偏移量也需要相应缩放

## 延伸知识

### Canvas textBaseline 选项

| 值 | 描述 |
|----|------|
| `top` | 文字顶部对齐 y 坐标 |
| `hanging` | 悬挂基线（适用于某些文字系统） |
| `middle` | 文字垂直中心对齐 y 坐标 |
| `alphabetic` | 字母基线（默认值） |
| `ideographic` | 表意基线 |
| `bottom` | 文字底部对齐 y 坐标 |

### 其他解决方案

1. **Canvas 侧调整**：使用 `textBaseline: 'middle'` 并调整 y 坐标
2. **CSS 侧调整**：使用 `line-height: 1` 消除额外空间（但会影响多行文字）
3. **精确测量**：使用 `ctx.measureText()` 获取字体度量信息进行精确计算

### 字体度量 API

```javascript
const metrics = ctx.measureText('Hello');
console.log(metrics.actualBoundingBoxAscent);  // 实际上升高度
console.log(metrics.actualBoundingBoxDescent); // 实际下降高度
console.log(metrics.fontBoundingBoxAscent);    // 字体上升高度
console.log(metrics.fontBoundingBoxDescent);   // 字体下降高度
```

可以使用这些度量信息进行更精确的对齐计算。

## 参考

- [MDN: CanvasRenderingContext2D.textBaseline](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/textBaseline)
- [MDN: CSS line-height](https://developer.mozilla.org/en-US/docs/Web/CSS/line-height)
- [MDN: TextMetrics](https://developer.mozilla.org/en-US/docs/Web/API/TextMetrics)

