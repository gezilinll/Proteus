# React 19

> 用于构建用户界面的 JavaScript 库。

---

## 概述

### 是什么

React 是 Meta（原 Facebook）开发的声明式、组件化的 UI 库。React 19 是 2024 年底发布的最新大版本，带来了多项重要更新。

### 核心理念

- **声明式**：描述 UI 应该是什么样子，而非如何操作 DOM
- **组件化**：将 UI 拆分为独立、可复用的组件
- **单向数据流**：数据从父组件流向子组件

---

## 核心概念

### 1. 组件

```tsx
// 函数组件（推荐）
function Greeting({ name }: { name: string }) {
  return <h1>Hello, {name}!</h1>;
}

// 使用组件
<Greeting name="World" />
```

### 2. JSX

```tsx
// JSX 是 JavaScript 的语法扩展
const element = (
  <div className="container">
    <h1>{title}</h1>
    {items.map(item => (
      <Item key={item.id} data={item} />
    ))}
  </div>
);

// 条件渲染
{isLoggedIn && <UserPanel />}
{isAdmin ? <AdminView /> : <UserView />}

// 列表渲染（必须有 key）
{items.map(item => <Item key={item.id} {...item} />)}
```

### 3. Props 与 Children

```tsx
interface ButtonProps {
  variant?: "primary" | "secondary";
  onClick?: () => void;
  children: React.ReactNode;
}

function Button({ variant = "primary", onClick, children }: ButtonProps) {
  return (
    <button className={`btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  );
}

// 使用
<Button variant="primary" onClick={handleClick}>
  点击我
</Button>
```

### 4. Hooks

#### useState - 状态管理

```tsx
const [count, setCount] = useState(0);
const [user, setUser] = useState<User | null>(null);

// 更新状态
setCount(count + 1);
setCount(prev => prev + 1); // 函数式更新（推荐）

// 对象状态
setUser({ ...user, name: "新名字" });
```

#### useEffect - 副作用处理

```tsx
// 组件挂载时执行
useEffect(() => {
  console.log("组件挂载");
  return () => console.log("组件卸载"); // 清理函数
}, []);

// 依赖变化时执行
useEffect(() => {
  fetchData(userId);
}, [userId]);

// 每次渲染都执行（谨慎使用）
useEffect(() => {
  document.title = `Count: ${count}`;
});
```

#### useRef - 引用 DOM 或保存可变值

```tsx
// 引用 DOM
const inputRef = useRef<HTMLInputElement>(null);
inputRef.current?.focus();

// 保存可变值（不触发重渲染）
const timerRef = useRef<number | null>(null);
timerRef.current = window.setInterval(...);
```

#### useMemo 与 useCallback - 性能优化

```tsx
// 缓存计算结果
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);

// 缓存函数引用
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

#### useContext - 上下文

```tsx
// 创建 Context
const ThemeContext = createContext<Theme>("light");

// 提供值
<ThemeContext.Provider value="dark">
  <App />
</ThemeContext.Provider>

// 消费值
const theme = useContext(ThemeContext);
```

### 5. React 19 新特性

#### Actions

```tsx
// useActionState - 处理异步操作
const [state, submitAction, isPending] = useActionState(
  async (prevState, formData) => {
    const result = await saveData(formData);
    return result;
  },
  initialState
);

<form action={submitAction}>
  <input name="title" />
  <button disabled={isPending}>
    {isPending ? "保存中..." : "保存"}
  </button>
</form>
```

#### useOptimistic - 乐观更新

```tsx
const [optimisticMessages, addOptimisticMessage] = useOptimistic(
  messages,
  (state, newMessage) => [...state, { ...newMessage, pending: true }]
);

async function sendMessage(formData) {
  addOptimisticMessage({ text: formData.get("text") });
  await deliverMessage(formData);
}
```

#### use - 读取资源

```tsx
// 读取 Promise
function Comments({ commentsPromise }) {
  const comments = use(commentsPromise);
  return comments.map(c => <Comment key={c.id} {...c} />);
}

// 读取 Context
function Button() {
  const theme = use(ThemeContext);
  return <button className={theme}>...</button>;
}
```

#### ref 作为 prop

```tsx
// React 19 之前需要 forwardRef
// React 19 可以直接传递
function Input({ ref, ...props }) {
  return <input ref={ref} {...props} />;
}
```

#### 文档元数据

```tsx
function BlogPost({ post }) {
  return (
    <article>
      <title>{post.title}</title>
      <meta name="description" content={post.excerpt} />
      <h1>{post.title}</h1>
      ...
    </article>
  );
}
```

### 6. 组件设计模式

#### 受控组件 vs 非受控组件

```tsx
// 受控组件 - React 控制值
function ControlledInput() {
  const [value, setValue] = useState("");
  return <input value={value} onChange={e => setValue(e.target.value)} />;
}

// 非受控组件 - DOM 控制值
function UncontrolledInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleSubmit = () => console.log(inputRef.current?.value);
  return <input ref={inputRef} />;
}
```

#### 组合 vs 继承

```tsx
// React 推荐组合而非继承
function Dialog({ title, children }) {
  return (
    <div className="dialog">
      <h2>{title}</h2>
      <div className="content">{children}</div>
    </div>
  );
}

function ConfirmDialog() {
  return (
    <Dialog title="确认">
      <p>确定要继续吗？</p>
      <button>确定</button>
    </Dialog>
  );
}
```

#### 渲染属性模式

```tsx
interface MouseTrackerProps {
  render: (position: { x: number; y: number }) => React.ReactNode;
}

function MouseTracker({ render }: MouseTrackerProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  return <div onMouseMove={...}>{render(position)}</div>;
}

// 使用
<MouseTracker render={({ x, y }) => <p>位置: {x}, {y}</p>} />
```

---

## 在本项目中的应用

- **React 19**：使用最新版本，享受新特性
- **函数组件 + Hooks**：全部使用函数组件
- **Zustand 集成**：状态管理使用 Zustand 而非 Context
- **组件库**：`packages/react` 提供编辑器组件

---

## 学习资源

### 官方资源

- [React 官方文档](https://react.dev/) - 全新的官方文档（2023 年重写）
- [React 官方教程](https://react.dev/learn) - 交互式学习
- [React 19 发布公告](https://react.dev/blog/2024/12/05/react-19) - 新特性介绍

### 中文教程

- [React 19 全解 · 基础版](https://usehook.cn/r19base) - 系统学习 React 19
- [React 技术揭秘](https://react.iamkasong.com/) - 深入理解 React 原理

### 视频课程

- [Epic React](https://epicreact.dev/) - Kent C. Dodds 出品，业界公认最佳

### 生态系统

- [React Router](https://reactrouter.com/) - 路由管理
- [TanStack Query](https://tanstack.com/query/latest) - 服务端状态管理
- [React Hook Form](https://react-hook-form.com/) - 表单处理

---

*建议学习顺序：JSX → 组件 → Props → Hooks → React 19 新特性*

