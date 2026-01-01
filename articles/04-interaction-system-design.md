# 从零构建 AI 原生多模态编辑器（三）：交互系统设计

> 本文是《从零构建 AI 原生多模态编辑器》系列的第三篇。在前两篇中我们完成了架构设计和渲染引擎实现，本文将深入交互系统的设计，包括选择系统、变换操作、工具状态机、以及复制粘贴的完整实现。

---

## 交互系统的职责

一个图形编辑器的交互系统需要处理用户的各种输入，并将其转化为对画布的操作：

1. **选择系统**：点选、框选、多选元素
2. **变换操作**：移动、缩放、旋转元素
3. **工具系统**：不同工具的切换和行为
4. **键盘快捷键**：复制粘贴、删除、撤销重做
5. **命令执行**：所有操作封装为可撤销的命令

核心设计原则是：**用户输入 → 意图识别 → 命令生成 → 执行与记录**。

```
┌─────────────────────────────────────────────────────────────┐
│                    Interaction System                        │
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │  Hit Tester  │    │   Handlers   │    │   Commands   │  │
│  │  点击检测     │ → │  操作处理器   │ → │   命令系统    │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         ↑                   ↑                   ↓           │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │ Tool Manager │    │  Selection   │    │   History    │  │
│  │  工具管理器   │    │  Manager     │    │   Undo/Redo  │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 选择系统

### 点击检测（Hit Testing）

当用户点击画布时，需要判断点击到了什么：

```typescript
interface HitResult {
  type: 'element' | 'control-point' | 'empty';
  elementId?: string;
  controlPoint?: ControlPointType;
}

class HitTester {
  test(x: number, y: number, scene: Scene, viewport: Viewport): HitResult {
    // 1. 优先检测控制点（选中元素的手柄）
    const controlPoint = this.testControlPoints(x, y, selectedElements);
    if (controlPoint) {
      return { type: 'control-point', ...controlPoint };
    }
    
    // 2. 从上到下检测元素（z-index 高的优先）
    const elements = scene.getOrderedElements().reverse();
    for (const element of elements) {
      if (this.isPointInElement(x, y, element)) {
        return { type: 'element', elementId: element.id };
      }
    }
    
    // 3. 点击空白
    return { type: 'empty' };
  }
  
  private isPointInElement(x: number, y: number, element: Element): boolean {
    const { transform } = element;
    
    // 将点转换到元素的本地坐标系（考虑旋转）
    const localPoint = this.toLocalCoordinates(x, y, transform);
    
    // 检测是否在边界内
    const halfWidth = transform.width / 2;
    const halfHeight = transform.height / 2;
    
    return Math.abs(localPoint.x) <= halfWidth && 
           Math.abs(localPoint.y) <= halfHeight;
  }
}
```

### 旋转元素的点击检测

对于旋转过的元素，需要将点击坐标转换到元素的本地坐标系：

```typescript
toLocalCoordinates(x: number, y: number, transform: Transform): Point {
  const centerX = transform.x + transform.width / 2;
  const centerY = transform.y + transform.height / 2;
  
  // 平移到元素中心
  const dx = x - centerX;
  const dy = y - centerY;
  
  // 反向旋转
  const cos = Math.cos(-transform.rotation);
  const sin = Math.sin(-transform.rotation);
  
  return {
    x: dx * cos - dy * sin,
    y: dx * sin + dy * cos,
  };
}
```

### 控制点检测

选中元素时显示 8 个缩放控制点和 1 个旋转控制点：

```typescript
type ControlPointType = 
  | 'nw' | 'n' | 'ne' 
  | 'w'  |       'e' 
  | 'sw' | 's' | 'se'
  | 'rotate';

class ControlPointHitTester {
  private controlPointSize = 8;
  
  test(x: number, y: number, element: Element, zoom: number): ControlPointType | null {
    const points = this.computeControlPoints(element);
    const hitRadius = (this.controlPointSize / 2 + 4) / zoom; // 加大点击区域
    
    for (const [type, point] of Object.entries(points)) {
      const distance = Math.hypot(x - point.x, y - point.y);
      if (distance <= hitRadius) {
        return type as ControlPointType;
      }
    }
    
    return null;
  }
}
```

### 框选（Marquee Selection）

拖拽出选择框，选中所有与之相交的元素：

```typescript
class MarqueeOverlay {
  render(ctx: RenderContext, startPoint: Point, currentPoint: Point): void {
    const minX = Math.min(startPoint.x, currentPoint.x);
    const minY = Math.min(startPoint.y, currentPoint.y);
    const width = Math.abs(currentPoint.x - startPoint.x);
    const height = Math.abs(currentPoint.y - startPoint.y);
    
    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    
    ctx.fillRect(minX, minY, width, height);
    ctx.strokeRect(minX, minY, width, height);
  }
}

// 判断元素是否与选择框相交
function isElementInMarquee(element: Element, marquee: Bounds): boolean {
  const elementBounds = getElementBounds(element);
  return boundsIntersect(elementBounds, marquee);
}
```

---

## 变换操作

### 拖拽移动

```typescript
class DragHandler {
  private startX: number = 0;
  private startY: number = 0;
  private startTransforms: Map<string, Transform> = new Map();
  
  start(x: number, y: number, elements: Element[]): void {
    this.startX = x;
    this.startY = y;
    
    // 保存所有选中元素的初始变换
    for (const element of elements) {
      this.startTransforms.set(element.id, { ...element.transform });
    }
  }
  
  update(x: number, y: number, scene: Scene): void {
    const dx = x - this.startX;
    const dy = y - this.startY;
    
    for (const [id, startTransform] of this.startTransforms) {
      const element = scene.get(id);
      if (element) {
        element.transform.x = startTransform.x + dx;
        element.transform.y = startTransform.y + dy;
      }
    }
  }
  
  commit(scene: Scene, commandHistory: CommandHistory): void {
    const updates: ElementUpdate[] = [];
    
    for (const [id, startTransform] of this.startTransforms) {
      const element = scene.get(id);
      if (element) {
        updates.push({
          id,
          before: { transform: startTransform },
          after: { transform: { ...element.transform } },
        });
      }
    }
    
    const command = new BatchUpdateCommand(scene, updates);
    commandHistory.execute(command);
  }
}
```

### 缩放操作

缩放需要根据拖拽的控制点类型来决定哪些边移动：

```typescript
class ResizeHandler {
  resize(
    element: Element,
    controlPoint: ControlPointType,
    dx: number,
    dy: number,
    keepAspectRatio: boolean
  ): Transform {
    const { x, y, width, height, rotation } = element.transform;
    
    let newX = x, newY = y, newWidth = width, newHeight = height;
    
    // 根据控制点调整对应的边
    switch (controlPoint) {
      case 'se': // 右下角
        newWidth = Math.max(10, width + dx);
        newHeight = Math.max(10, height + dy);
        break;
      case 'nw': // 左上角
        newX = x + dx;
        newY = y + dy;
        newWidth = Math.max(10, width - dx);
        newHeight = Math.max(10, height - dy);
        break;
      case 'e': // 右边
        newWidth = Math.max(10, width + dx);
        break;
      // ... 其他控制点
    }
    
    // 保持宽高比
    if (keepAspectRatio) {
      const aspectRatio = width / height;
      if (Math.abs(dx) > Math.abs(dy)) {
        newHeight = newWidth / aspectRatio;
      } else {
        newWidth = newHeight * aspectRatio;
      }
    }
    
    return { x: newX, y: newY, width: newWidth, height: newHeight, rotation };
  }
}
```

### 旋转操作

旋转以元素中心为原点，计算鼠标位置与中心的角度：

```typescript
class RotateHandler {
  rotate(element: Element, mouseX: number, mouseY: number): number {
    const { x, y, width, height } = element.transform;
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    
    // 计算鼠标相对于中心的角度
    const angle = Math.atan2(mouseY - centerY, mouseX - centerX);
    
    // 加上 90 度（因为旋转控制点在顶部）
    return angle + Math.PI / 2;
  }
}
```

---

## 工具系统

### 工具接口

每种工具实现统一的接口：

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

### 工具管理器

```typescript
class ToolManager {
  private tools = new Map<string, Tool>();
  private currentTool: Tool | null = null;
  
  register(tool: Tool): void {
    this.tools.set(tool.name, tool);
  }
  
  setTool(name: string): void {
    if (this.currentTool?.onDeactivate) {
      this.currentTool.onDeactivate();
    }
    
    this.currentTool = this.tools.get(name) ?? null;
    
    if (this.currentTool?.onActivate) {
      this.currentTool.onActivate();
    }
  }
  
  getCursor(): string {
    return this.currentTool?.cursor ?? 'default';
  }
}
```

### 选择工具

选择工具是最复杂的工具，需要处理多种交互模式：

```typescript
class SelectTool implements Tool {
  name = 'select';
  cursor = 'default';
  
  private mode: 'idle' | 'dragging' | 'resizing' | 'rotating' | 'marquee' = 'idle';
  
  onMouseDown(x: number, y: number): void {
    const hit = this.hitTester.test(x, y, this.scene, this.viewport);
    
    if (hit.type === 'control-point') {
      if (hit.controlPoint === 'rotate') {
        this.mode = 'rotating';
        this.rotateHandler.start(x, y);
      } else {
        this.mode = 'resizing';
        this.resizeHandler.start(hit.controlPoint, x, y);
      }
    } else if (hit.type === 'element') {
      // 如果点击的元素未选中，先选中它
      if (!this.selectionManager.isSelected(hit.elementId)) {
        if (!this.isShiftPressed) {
          this.selectionManager.clear();
        }
        this.selectionManager.select(hit.elementId);
      }
      
      this.mode = 'dragging';
      this.dragHandler.start(x, y, this.getSelectedElements());
    } else {
      // 点击空白，开始框选
      if (!this.isShiftPressed) {
        this.selectionManager.clear();
      }
      this.mode = 'marquee';
      this.marqueeStart = { x, y };
    }
  }
  
  onMouseMove(x: number, y: number): void {
    switch (this.mode) {
      case 'dragging':
        this.dragHandler.update(x, y, this.scene);
        break;
      case 'resizing':
        this.resizeHandler.update(x, y);
        break;
      case 'rotating':
        this.rotateHandler.update(x, y);
        break;
      case 'marquee':
        this.updateMarqueeSelection(x, y);
        break;
    }
    
    this.editor.requestRender();
  }
  
  onMouseUp(x: number, y: number): void {
    switch (this.mode) {
      case 'dragging':
        this.dragHandler.commit(this.scene, this.commandHistory);
        break;
      case 'resizing':
        this.resizeHandler.commit();
        break;
      case 'rotating':
        this.rotateHandler.commit();
        break;
    }
    
    this.mode = 'idle';
  }
}
```

### 形状工具

矩形工具创建新元素：

```typescript
class RectangleTool implements Tool {
  name = 'rectangle';
  cursor = 'crosshair';
  
  private startPoint: Point | null = null;
  private previewElement: Element | null = null;
  
  onMouseDown(x: number, y: number): void {
    this.startPoint = { x, y };
    
    // 创建预览元素
    this.previewElement = createElement(ElementType.RECTANGLE, {
      transform: { x, y, width: 0, height: 0, rotation: 0 },
      style: { fill: '#3b82f6', stroke: '#1e40af', strokeWidth: 2 },
    });
  }
  
  onMouseMove(x: number, y: number): void {
    if (!this.startPoint || !this.previewElement) return;
    
    const width = x - this.startPoint.x;
    const height = y - this.startPoint.y;
    
    // 处理负方向拖拽
    this.previewElement.transform = {
      x: width < 0 ? x : this.startPoint.x,
      y: height < 0 ? y : this.startPoint.y,
      width: Math.abs(width),
      height: Math.abs(height),
      rotation: 0,
    };
    
    this.editor.requestRender();
  }
  
  onMouseUp(x: number, y: number): void {
    if (this.previewElement && this.previewElement.transform.width > 1) {
      const command = new AddElementCommand(this.scene, this.previewElement);
      this.commandHistory.execute(command);
      
      // 自动选中新元素并切换到选择工具
      this.selectionManager.select(this.previewElement.id);
      this.toolManager.setTool('select');
    }
    
    this.startPoint = null;
    this.previewElement = null;
  }
}
```

---

## 复制粘贴系统

### 剪贴板管理

复制粘贴需要处理两种场景：
1. **编辑器内部**：复制元素的完整数据
2. **外部内容**：粘贴图片或文本

```typescript
class ClipboardManager {
  private clipboard: Element[] = [];
  private isInternalContent = false;
  private isCut = false;
  
  copy(elements: Element[]): void {
    // 深拷贝元素
    this.clipboard = elements.map(el => deepClone(el));
    this.isInternalContent = true;
    this.isCut = false;
    
    // 同步到系统剪贴板
    this.syncToSystemClipboard(this.clipboard);
  }
  
  cut(elements: Element[]): void {
    this.copy(elements);
    this.isCut = true;
  }
  
  private async syncToSystemClipboard(elements: Element[]): Promise<void> {
    try {
      const data = JSON.stringify(elements);
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/plain': new Blob([data], { type: 'text/plain' }),
          'application/json': new Blob([data], { type: 'application/json' }),
        }),
      ]);
    } catch (err) {
      console.warn('Failed to sync to system clipboard:', err);
    }
  }
  
  async readFromSystemClipboard(): Promise<ClipboardData | null> {
    try {
      const items = await navigator.clipboard.read();
      
      for (const item of items) {
        // 优先检查图片
        for (const type of item.types) {
          if (type.startsWith('image/')) {
            const blob = await item.getType(type);
            return { image: blob, imageType: type };
          }
        }
        
        // 检查文本/JSON
        if (item.types.includes('text/plain')) {
          const blob = await item.getType('text/plain');
          const text = await blob.text();
          
          // 尝试解析为内部元素
          try {
            const data = JSON.parse(text);
            if (this.isInternalElements(data)) {
              return { internalElements: data };
            }
          } catch {}
          
          return { text };
        }
      }
    } catch (err) {
      console.warn('Failed to read from system clipboard:', err);
    }
    
    return null;
  }
}
```

### 粘贴命令

```typescript
class PasteElementsCommand implements Command {
  private pastedElements: Element[] = [];
  
  execute(): void {
    const elements = this.clipboardManager.getContent();
    
    for (const element of elements) {
      // 生成新 ID，避免冲突
      const newElement = {
        ...deepClone(element),
        id: generateId(),
      };
      
      // 添加位置偏移
      newElement.transform.x += 10;
      newElement.transform.y += 10;
      
      this.scene.add(newElement);
      this.pastedElements.push(newElement);
    }
  }
  
  undo(): void {
    for (const element of this.pastedElements) {
      this.scene.remove(element.id);
    }
  }
  
  redo(): void {
    for (const element of this.pastedElements) {
      this.scene.add(element);
    }
  }
}
```

### 处理外部粘贴

```typescript
async function handlePaste(event: ClipboardEvent): Promise<void> {
  event.preventDefault();
  
  // 1. 从事件中读取数据（最准确）
  const clipboardData = event.clipboardData;
  
  // 2. 优先处理图片
  if (clipboardData) {
    for (const item of clipboardData.items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          await createImageElement(file);
          return;
        }
      }
    }
  }
  
  // 3. 尝试从系统剪贴板读取
  const systemData = await clipboardManager.readFromSystemClipboard();
  
  if (systemData?.image) {
    await createImageElement(systemData.image);
    return;
  }
  
  if (systemData?.internalElements) {
    pasteInternalElements(systemData.internalElements);
    return;
  }
  
  if (systemData?.text) {
    createTextElement(systemData.text);
    return;
  }
}
```

---

## 对齐与分布

### 对齐算法

```typescript
function alignElements(
  elements: Element[],
  alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom'
): void {
  if (elements.length < 2) return;
  
  // 计算所有元素的边界
  const bounds = elements.map(el => getElementBounds(el));
  const combinedBounds = mergeBounds(bounds);
  
  for (const element of elements) {
    const elBounds = getElementBounds(element);
    
    switch (alignment) {
      case 'left':
        element.transform.x = combinedBounds.minX;
        break;
      case 'center':
        const centerX = (combinedBounds.minX + combinedBounds.maxX) / 2;
        element.transform.x = centerX - element.transform.width / 2;
        break;
      case 'right':
        element.transform.x = combinedBounds.maxX - element.transform.width;
        break;
      // ... 类似处理 top, middle, bottom
    }
  }
}
```

### 分布算法

```typescript
function distributeElements(
  elements: Element[],
  direction: 'horizontal' | 'vertical'
): void {
  if (elements.length < 3) return;
  
  // 按位置排序
  const sorted = [...elements].sort((a, b) => 
    direction === 'horizontal' 
      ? a.transform.x - b.transform.x 
      : a.transform.y - b.transform.y
  );
  
  // 计算总间距
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  
  if (direction === 'horizontal') {
    const totalSpace = last.transform.x - first.transform.x - first.transform.width;
    const gap = totalSpace / (elements.length - 1);
    
    let currentX = first.transform.x + first.transform.width;
    for (let i = 1; i < sorted.length - 1; i++) {
      currentX += gap;
      sorted[i].transform.x = currentX;
      currentX += sorted[i].transform.width;
    }
  }
  // ... 类似处理 vertical
}
```

---

## 快捷键系统

### 键盘管理器

```typescript
class KeyboardManager {
  private shortcuts = new Map<string, () => void>();
  
  register(key: string, modifiers: Modifiers, handler: () => void): void {
    const id = this.createShortcutId(key, modifiers);
    this.shortcuts.set(id, handler);
  }
  
  handleKeyDown(key: string, modifiers: Modifiers): boolean {
    const id = this.createShortcutId(key, modifiers);
    const handler = this.shortcuts.get(id);
    
    if (handler) {
      handler();
      return true;
    }
    
    return false;
  }
  
  private createShortcutId(key: string, modifiers: Modifiers): string {
    const parts = [];
    if (modifiers.ctrlKey) parts.push('ctrl');
    if (modifiers.shiftKey) parts.push('shift');
    if (modifiers.altKey) parts.push('alt');
    parts.push(key.toLowerCase());
    return parts.join('+');
  }
}
```

### 注册快捷键

```typescript
// 工具切换
keyboardManager.register('v', {}, () => toolManager.setTool('select'));
keyboardManager.register('r', {}, () => toolManager.setTool('rectangle'));
keyboardManager.register('o', {}, () => toolManager.setTool('ellipse'));
keyboardManager.register('t', {}, () => toolManager.setTool('text'));
keyboardManager.register('i', {}, () => toolManager.setTool('image'));

// 编辑操作
keyboardManager.register('c', { ctrlKey: true }, handleCopy);
keyboardManager.register('v', { ctrlKey: true }, handlePaste);
keyboardManager.register('x', { ctrlKey: true }, handleCut);
keyboardManager.register('z', { ctrlKey: true }, handleUndo);
keyboardManager.register('z', { ctrlKey: true, shiftKey: true }, handleRedo);

// 删除
keyboardManager.register('Delete', {}, handleDelete);
keyboardManager.register('Backspace', {}, handleDelete);
```

---

## 总结

本文介绍了编辑器交互系统的核心实现：

1. **选择系统**：点击检测、控制点检测、框选
2. **变换操作**：拖拽、缩放、旋转的实现
3. **工具系统**：统一接口、工具管理器、具体工具实现
4. **复制粘贴**：内部剪贴板、系统剪贴板同步、外部内容处理
5. **对齐分布**：对齐和分布算法
6. **快捷键**：键盘管理器和快捷键注册

至此，Phase 1 的基础编辑器已经完成。它支持：
- 创建和编辑矩形、圆形、文本、图片
- 选择、移动、缩放、旋转元素
- 复制粘贴（内部和外部）
- 图层管理和对齐分布
- 完整的撤销重做

下一阶段我们将进入 **Phase 2: 多模态元素**，添加视频、音频、网页嵌入等更丰富的内容类型。

---

*本文是《从零构建 AI 原生多模态编辑器》系列的第三篇。代码已开源在 [GitHub](https://github.com/gezilinll/Proteus)，欢迎 Star 和贡献。*

