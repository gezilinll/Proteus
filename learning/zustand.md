# Zustand

> 轻量级、灵活的 React 状态管理库。

---

## 概述

### 是什么

Zustand（德语"状态"）是一个小巧、快速、可扩展的状态管理解决方案。它使用简化的 flux 原理，基于 hooks，没有 boilerplate 代码。

### 为什么选择 Zustand

| 特性 | Redux | Context | Zustand |
|------|-------|---------|---------|
| 包大小 | ~8KB | 0 | ~1KB |
| 样板代码 | 多 | 中 | 少 |
| 学习曲线 | 陡峭 | 平缓 | 平缓 |
| 性能优化 | 需手动 | 困难 | 自动 |
| React 外使用 | 困难 | 不可 | 简单 |

---

## 核心概念

### 1. 创建 Store

```typescript
import { create } from 'zustand';

// 基础用法
interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));
```

### 2. 在组件中使用

```tsx
function Counter() {
  // 订阅整个 store（不推荐）
  const { count, increment } = useCounterStore();
  
  return (
    <div>
      <span>{count}</span>
      <button onClick={increment}>+1</button>
    </div>
  );
}

// 选择性订阅（推荐 - 避免不必要的重渲染）
function CountDisplay() {
  const count = useCounterStore((state) => state.count);
  return <span>{count}</span>;
}

function IncrementButton() {
  const increment = useCounterStore((state) => state.increment);
  return <button onClick={increment}>+1</button>;
}
```

### 3. 选择性订阅与性能优化

```typescript
import { shallow } from 'zustand/shallow';

// 订阅多个值时使用 shallow 比较
const { count, name } = useStore(
  (state) => ({ count: state.count, name: state.name }),
  shallow
);

// 或使用 useShallow（Zustand 5 推荐）
import { useShallow } from 'zustand/shallow';

const { count, name } = useStore(
  useShallow((state) => ({ count: state.count, name: state.name }))
);
```

### 4. 异步操作

```typescript
interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
  fetchUser: (id: string) => Promise<void>;
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: false,
  error: null,
  
  fetchUser: async (id) => {
    set({ loading: true, error: null });
    try {
      const user = await api.getUser(id);
      set({ user, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));
```

### 5. get - 在 Action 中访问状态

```typescript
const useStore = create((set, get) => ({
  items: [],
  
  addItem: (item) => {
    const currentItems = get().items;
    if (currentItems.length >= 10) {
      console.warn('已达到上限');
      return;
    }
    set({ items: [...currentItems, item] });
  },
  
  getTotalPrice: () => {
    return get().items.reduce((sum, item) => sum + item.price, 0);
  },
}));
```

### 6. 在 React 外使用

```typescript
// 直接获取状态（不触发订阅）
const currentCount = useCounterStore.getState().count;

// 直接更新状态
useCounterStore.setState({ count: 10 });

// 订阅变化
const unsubscribe = useCounterStore.subscribe(
  (state) => console.log('状态变化:', state)
);

// 选择性订阅
const unsubscribe = useCounterStore.subscribe(
  (state) => state.count,
  (count, prevCount) => console.log('count 变化:', prevCount, '->', count)
);
```

### 7. 中间件

#### persist - 持久化

```typescript
import { persist } from 'zustand/middleware';

const useStore = create(
  persist<State>(
    (set) => ({
      // ...状态和操作
    }),
    {
      name: 'my-storage', // localStorage key
      storage: createJSONStorage(() => sessionStorage), // 可选：使用 sessionStorage
      partialize: (state) => ({ count: state.count }), // 只持久化部分状态
    }
  )
);
```

#### devtools - Redux DevTools 集成

```typescript
import { devtools } from 'zustand/middleware';

const useStore = create(
  devtools<State>(
    (set) => ({
      // ...
    }),
    { name: 'MyStore' }
  )
);
```

#### immer - 不可变更新

```typescript
import { immer } from 'zustand/middleware/immer';

const useStore = create(
  immer<State>((set) => ({
    user: { name: '张三', age: 25 },
    
    updateName: (name) => set((state) => {
      state.user.name = name; // 直接修改，immer 处理不可变性
    }),
  }))
);
```

#### 组合中间件

```typescript
const useStore = create<State>()(
  devtools(
    persist(
      immer((set) => ({
        // ...
      })),
      { name: 'my-store' }
    ),
    { name: 'MyStore' }
  )
);
```

### 8. 切片模式（大型应用）

```typescript
// userSlice.ts
export interface UserSlice {
  user: User | null;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
}

export const createUserSlice = (set, get) => ({
  user: null,
  login: async (credentials) => { /* ... */ },
  logout: () => set({ user: null }),
});

// cartSlice.ts
export interface CartSlice {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
}

export const createCartSlice = (set, get) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) => set((state) => ({ 
    items: state.items.filter(i => i.id !== id) 
  })),
});

// store.ts
type StoreState = UserSlice & CartSlice;

const useStore = create<StoreState>()((...a) => ({
  ...createUserSlice(...a),
  ...createCartSlice(...a),
}));
```

### 9. Zustand 5 新特性

```typescript
// useShallow 替代 shallow
import { useShallow } from 'zustand/shallow';

// 更好的 TypeScript 支持
const useStore = create<State>()((set) => ({
  // ...
}));

// createStore 用于非 React 环境
import { createStore, useStore } from 'zustand';

const store = createStore<State>((set) => ({
  // ...
}));

// 在 React 中使用
function Component() {
  const count = useStore(store, (state) => state.count);
}
```

---

## 在本项目中的应用

- **编辑器状态**：选中元素、视口位置、工具状态
- **选择性订阅**：组件只订阅需要的状态片段，优化渲染性能
- **非 React 访问**：渲染引擎直接通过 `getState()` 访问状态
- **中间件**：使用 devtools 便于调试

---

## 学习资源

### 官方资源

- [Zustand 官方文档](https://zustand.docs.pmnd.rs/) - 最新官方文档
- [Zustand GitHub](https://github.com/pmndrs/zustand) - 源码和示例

### 教程

- [Zustand 官方 README](https://github.com/pmndrs/zustand#readme) - 快速入门
- [Zustand 与 Redux 对比](https://docs.pmnd.rs/zustand/getting-started/comparison)

### 视频

- [Zustand Tutorial](https://www.youtube.com/results?search_query=zustand+tutorial) - YouTube 教程

### 相关库

- [zustand-persist](https://github.com/roadmanfong/zustand-persist) - 持久化扩展
- [zundo](https://github.com/charkour/zundo) - Undo/Redo 中间件

---

*建议学习顺序：创建 Store → 组件使用 → 选择性订阅 → 中间件 → 切片模式*

