# 拖拽指示线闪烁导致 Drop 失效

## 现象

- 图层面板拖拽排序时，指示线不断闪烁
- 松手时 `handleDrop` 接收到的 `dropTargetId` 为 `null`
- 拖拽操作无法生效

## 环境

- React + HTML5 Drag and Drop API
- 指示线通过条件渲染显示（绝对定位 div）

## 原因分析

### 根本原因

拖拽指示线是一个绝对定位的 `div`，当它渲染在目标元素内部时：

1. 鼠标经过指示线 → 触发目标元素的 `dragLeave`
2. `handleDragLeave` 清除 `dropTargetId` 状态
3. 指示线消失 → 触发 `dragOver`
4. `handleDragOver` 重新设置 `dropTargetId` 状态
5. 指示线重新渲染 → 循环回到步骤 1

形成"设置 → 清除 → 设置"的闪烁循环。

### 日志证据

```json
// dragOver 设置状态
{"message":"dragOver triggered","data":{"elementId":"xxx","willUpdate":true}}
// 立即触发 dragLeave，状态被清除
{"message":"dragLeave triggered","data":{"containsRelated":false,"willClear":true}}
// dragOver 再次设置...
```

## 解决方案

给指示线元素添加 `pointer-events: none`，让鼠标事件穿透：

```tsx
{showDropIndicator && (
  <div className="absolute ... pointer-events-none">
    {/* 指示线内容 */}
  </div>
)}
```

### 核心代码

```tsx
// 放置指示器 - 上方
{showDropBefore && (
  <div className="absolute left-0 right-0 -top-1 z-20 flex items-center pointer-events-none">
    <div className="w-3 h-3 rounded-full bg-blue-500 ..." />
    <div className="flex-1 h-0.5 bg-blue-500 ..." />
  </div>
)}
```

## 延伸知识

### `pointer-events: none` 的作用

- 元素不响应任何鼠标事件
- 事件会"穿透"到下层元素
- 常用于：
  - 装饰性覆盖层
  - 拖拽指示器
  - Loading 遮罩（不阻塞底层交互时）

### 类似场景

以下场景可能遇到相同问题：
- Tooltip 覆盖在拖拽区域上
- 选中边框/手柄导致事件被拦截
- 水印/辅助线遮挡画布

### 调试技巧

当拖拽事件行为异常时：
1. 添加日志到 `dragOver`、`dragLeave`、`drop`
2. 检查 `relatedTarget` 是什么元素
3. 检查是否有覆盖元素阻挡事件

## 参考

- MDN: [pointer-events](https://developer.mozilla.org/en-US/docs/Web/CSS/pointer-events)
- HTML Drag and Drop API: [dragenter/dragleave 事件](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)

