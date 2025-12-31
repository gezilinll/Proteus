# Yjs

> 高性能 CRDT 框架，用于构建实时协同应用。

---

## 概述

### 是什么

Yjs 是一个高性能的 CRDT（Conflict-free Replicated Data Type，无冲突复制数据类型）实现。它允许多个用户同时编辑共享数据，无需中央服务器协调，自动解决冲突。

### 解决什么问题

- **实时协同**：多人同时编辑同一文档
- **冲突解决**：无需手动处理编辑冲突
- **离线支持**：断网后可继续编辑，重连后自动同步
- **历史记录**：支持 Undo/Redo

---

## 核心概念

### 1. CRDT 基础原理

```
传统方式（OT - Operational Transformation）:
  需要中央服务器协调所有操作的顺序

CRDT 方式:
  每个操作都有全局唯一 ID
  相同的操作集合，无论顺序，最终状态一致
  
关键特性:
  - 交换律: A + B = B + A
  - 结合律: (A + B) + C = A + (B + C)
  - 幂等性: A + A = A
```

### 2. Y.Doc - 核心文档

```typescript
import * as Y from 'yjs';

// 创建文档
const ydoc = new Y.Doc();

// 文档有唯一 ID
console.log(ydoc.clientID);

// 监听所有更新
ydoc.on('update', (update: Uint8Array) => {
  // update 可以发送给其他客户端
  broadcastUpdate(update);
});

// 应用来自其他客户端的更新
Y.applyUpdate(ydoc, updateFromOther);

// 编码文档状态
const state = Y.encodeStateAsUpdate(ydoc);
```

### 3. 共享类型

#### Y.Text - 文本

```typescript
const ytext = ydoc.getText('my-text');

// 插入文本
ytext.insert(0, 'Hello');
ytext.insert(5, ' World');

// 删除文本
ytext.delete(0, 5); // 删除 "Hello"

// 格式化（富文本）
ytext.format(0, 5, { bold: true });

// 获取内容
console.log(ytext.toString()); // " World"

// 监听变化
ytext.observe((event) => {
  event.delta.forEach((op) => {
    if (op.insert) console.log('插入:', op.insert);
    if (op.delete) console.log('删除:', op.delete);
    if (op.retain) console.log('保留:', op.retain);
  });
});
```

#### Y.Array - 数组

```typescript
const yarray = ydoc.getArray<string>('my-array');

// 添加元素
yarray.push(['a', 'b', 'c']);
yarray.insert(1, ['x']);

// 删除元素
yarray.delete(0, 1);

// 获取元素
console.log(yarray.get(0));
console.log(yarray.toArray());

// 遍历
yarray.forEach((item, index) => {
  console.log(index, item);
});

// 监听变化
yarray.observe((event) => {
  event.changes.delta.forEach((change) => {
    if (change.insert) console.log('插入:', change.insert);
    if (change.delete) console.log('删除:', change.delete);
  });
});
```

#### Y.Map - 映射

```typescript
const ymap = ydoc.getMap<any>('my-map');

// 设置值
ymap.set('name', '张三');
ymap.set('age', 25);
ymap.set('nested', new Y.Map()); // 嵌套

// 获取值
console.log(ymap.get('name'));
console.log(ymap.toJSON());

// 删除
ymap.delete('age');

// 检查
ymap.has('name');
ymap.size;

// 遍历
ymap.forEach((value, key) => {
  console.log(key, value);
});

// 监听变化
ymap.observe((event) => {
  event.keysChanged.forEach((key) => {
    console.log('变化的 key:', key);
    console.log('新值:', ymap.get(key));
  });
});
```

#### Y.XmlFragment / Y.XmlElement - XML

```typescript
const yxml = ydoc.getXmlFragment('my-xml');

// 创建元素
const div = new Y.XmlElement('div');
div.setAttribute('class', 'container');

// 添加子元素
const span = new Y.XmlElement('span');
span.insert(0, [new Y.XmlText('Hello')]);
div.insert(0, [span]);

// 添加到文档
yxml.insert(0, [div]);

// 获取内容
console.log(yxml.toDOM()); // DOM 元素
```

### 4. 事务（Transactions）

```typescript
// 批量操作放入事务，只触发一次更新事件
ydoc.transact(() => {
  ymap.set('a', 1);
  ymap.set('b', 2);
  ymap.set('c', 3);
});

// 带 origin 的事务（用于区分本地/远程操作）
ydoc.transact(() => {
  yarray.push(['item']);
}, 'local');

ydoc.on('update', (update, origin) => {
  if (origin === 'local') {
    // 本地操作，需要同步到服务器
  } else {
    // 远程操作，不需要重复同步
  }
});
```

### 5. Undo/Redo

```typescript
import { UndoManager } from 'yjs';

// 创建 Undo 管理器
const undoManager = new UndoManager([ytext, yarray]);

// 执行操作
ytext.insert(0, 'Hello');

// 撤销
undoManager.undo();

// 重做
undoManager.redo();

// 检查状态
undoManager.canUndo();
undoManager.canRedo();

// 清除历史
undoManager.clear();

// 停止追踪（合并操作）
undoManager.stopCapturing();
```

### 6. 网络同步

#### WebSocket Provider

```typescript
import { WebsocketProvider } from 'y-websocket';

const ydoc = new Y.Doc();

const provider = new WebsocketProvider(
  'wss://your-server.com',
  'room-name',
  ydoc
);

// 监听连接状态
provider.on('status', ({ status }) => {
  console.log('连接状态:', status); // 'connected' | 'disconnected'
});

// 获取其他用户
provider.awareness.getStates().forEach((state, clientID) => {
  console.log('用户:', clientID, state);
});

// 设置本地用户状态
provider.awareness.setLocalState({
  user: { name: '张三', color: '#ff0000' },
  cursor: { x: 100, y: 200 },
});

// 监听用户状态变化
provider.awareness.on('change', () => {
  const states = provider.awareness.getStates();
  // 更新协作者光标显示
});
```

#### WebRTC Provider（P2P）

```typescript
import { WebrtcProvider } from 'y-webrtc';

const provider = new WebrtcProvider('room-name', ydoc, {
  signaling: ['wss://signaling.server.com'],
});
```

### 7. 持久化

#### IndexedDB Provider

```typescript
import { IndexeddbPersistence } from 'y-indexeddb';

const persistence = new IndexeddbPersistence('my-doc', ydoc);

persistence.on('synced', () => {
  console.log('从本地存储同步完成');
});
```

### 8. 子文档（Subdocuments）

```typescript
// 用于大型文档的按需加载
const rootDoc = new Y.Doc();
const pages = rootDoc.getMap('pages');

// 创建子文档
const page1 = new Y.Doc({ guid: 'page-1' });
pages.set('page-1', page1);

// 子文档独立同步
// 只有访问时才加载
```

### 9. 相对位置（Relative Positions）

```typescript
// 用于保存光标位置等
import { createRelativePositionFromTypeIndex, createAbsolutePositionFromRelativePosition } from 'yjs';

const ytext = ydoc.getText('text');
ytext.insert(0, 'Hello World');

// 创建相对位置（在 "World" 之前）
const relPos = createRelativePositionFromTypeIndex(ytext, 6);

// 即使文本变化，相对位置仍然有效
ytext.insert(0, 'Say ');
// 文本现在是 "Say Hello World"

// 获取绝对位置
const absPos = createAbsolutePositionFromRelativePosition(relPos, ydoc);
console.log(absPos.index); // 10（仍然指向 "World" 之前）
```

---

## 在本项目中的应用

- **实时协同编辑**：多人同时编辑画布
- **离线支持**：断网后继续编辑，重连后自动同步
- **Undo/Redo**：利用 UndoManager 实现撤销重做
- **状态同步**：使用 Y.Map 存储画布元素状态

---

## 学习资源

### 官方资源

- [Yjs 官方文档](https://docs.yjs.dev/) - 最权威的参考
- [Yjs GitHub](https://github.com/yjs/yjs) - 源码和示例
- [Yjs 示例](https://github.com/yjs/yjs-demos) - 官方示例集合

### 教程

- [CRDT 介绍](https://crdt.tech/) - 理解 CRDT 原理
- [构建实时协同应用](https://www.youtube.com/watch?v=0l5XgnQ6rB4) - Kevin Jahns 演讲

### 生态系统

- [y-websocket](https://github.com/yjs/y-websocket) - WebSocket Provider
- [y-webrtc](https://github.com/yjs/y-webrtc) - WebRTC Provider
- [y-indexeddb](https://github.com/yjs/y-indexeddb) - IndexedDB 持久化
- [y-protocols](https://github.com/yjs/y-protocols) - 同步协议

### 编辑器集成

- [y-prosemirror](https://github.com/yjs/y-prosemirror) - ProseMirror 集成
- [y-codemirror](https://github.com/yjs/y-codemirror) - CodeMirror 集成
- [y-monaco](https://github.com/yjs/y-monaco) - Monaco Editor 集成
- [y-quill](https://github.com/yjs/y-quill) - Quill 集成

### 商业方案（基于 Yjs）

- [Liveblocks](https://liveblocks.io/) - 托管协同服务
- [Hocuspocus](https://hocuspocus.dev/) - 开源 Yjs 后端

---

*建议学习顺序：CRDT 原理 → Y.Doc 基础 → 共享类型 → 网络同步 → Undo/Redo*

