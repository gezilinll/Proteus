# TypeScript

> JavaScript 的超集，添加了静态类型系统。

---

## 概述

### 是什么

TypeScript 是由微软开发的开源编程语言，它是 JavaScript 的严格超集，添加了可选的静态类型和基于类的面向对象编程。

### 解决什么问题

- **类型错误**：在编译时发现错误，而非运行时
- **代码可维护性**：类型即文档，代码自解释
- **IDE 支持**：更好的自动补全、重构支持
- **大型项目协作**：明确的接口契约

---

## 核心概念

### 1. 基础类型

```typescript
// 原始类型
let name: string = "张三";
let age: number = 25;
let isActive: boolean = true;
let data: null = null;
let value: undefined = undefined;

// 数组
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ["a", "b"];

// 元组
let tuple: [string, number] = ["hello", 42];

// 枚举
enum Color { Red, Green, Blue }
let c: Color = Color.Green;

// any 与 unknown
let anything: any = 4;        // 跳过类型检查（不推荐）
let uncertain: unknown = 4;   // 类型安全的 any
```

### 2. 接口与类型别名

```typescript
// 接口 - 描述对象的形状
interface User {
  id: number;
  name: string;
  email?: string;          // 可选属性
  readonly createdAt: Date; // 只读属性
}

// 类型别名 - 可以描述任意类型
type ID = string | number;
type Point = { x: number; y: number };

// 接口继承
interface Employee extends User {
  department: string;
}

// 类型交叉
type Admin = User & { permissions: string[] };
```

### 3. 联合类型与交叉类型

```typescript
// 联合类型 - 多选一
type Status = "pending" | "approved" | "rejected";
type Input = string | number;

// 交叉类型 - 合并多个类型
type Combined = TypeA & TypeB;

// 类型收窄
function process(input: string | number) {
  if (typeof input === "string") {
    return input.toUpperCase(); // 这里 input 是 string
  }
  return input * 2; // 这里 input 是 number
}
```

### 4. 泛型

```typescript
// 泛型函数
function identity<T>(arg: T): T {
  return arg;
}

// 泛型接口
interface Container<T> {
  value: T;
  getValue(): T;
}

// 泛型约束
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

// 泛型工具类型
type Partial<T> = { [P in keyof T]?: T[P] };
type Required<T> = { [P in keyof T]-?: T[P] };
type Readonly<T> = { readonly [P in keyof T]: T[P] };
type Pick<T, K extends keyof T> = { [P in K]: T[P] };
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

### 5. 类型推断与断言

```typescript
// 类型推断 - 自动推断类型
let x = 3;              // 推断为 number
let arr = [1, "hello"]; // 推断为 (number | string)[]

// 类型断言 - 告诉编译器类型
const canvas = document.getElementById("canvas") as HTMLCanvasElement;

// 非空断言
function process(value: string | null) {
  console.log(value!.length); // 断言 value 不为 null
}

// const 断言
const colors = ["red", "green"] as const;
// 类型为 readonly ["red", "green"]
```

### 6. 高级类型

```typescript
// 条件类型
type IsString<T> = T extends string ? true : false;

// 映射类型
type Getters<T> = {
  [K in keyof T as `get${Capitalize<K & string>}`]: () => T[K];
};

// 模板字面量类型
type EventName<T extends string> = `${T}Changed`;

// infer 关键字
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

// 递归类型
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
```

### 7. 模块系统

```typescript
// 导出
export interface User { ... }
export const API_URL = "...";
export default class MyClass { ... }

// 导入
import MyClass, { User, API_URL } from "./module";
import * as Utils from "./utils";
import type { User } from "./types"; // 仅导入类型

// 重新导出
export { User } from "./types";
export * from "./utils";
```

### 8. 声明文件

```typescript
// types.d.ts - 声明文件
declare module "some-library" {
  export function doSomething(): void;
}

// 全局声明
declare global {
  interface Window {
    myGlobal: string;
  }
}

// 环境声明
declare const __DEV__: boolean;
```

---

## 在本项目中的应用

- **严格模式**：`tsconfig.json` 启用 `strict: true`
- **路径别名**：使用 `@proteus/core` 等别名简化导入
- **接口定义**：所有元素类型、命令接口等都有明确的类型定义
- **泛型**：Command 系统使用泛型实现类型安全的命令模式

---

## 学习资源

### 官方资源

- [TypeScript 官方文档](https://www.typescriptlang.org/docs/) - 最权威的参考
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) - 官方入门手册
- [TypeScript Playground](https://www.typescriptlang.org/play) - 在线练习环境

### 中文教程

- [TypeScript 入门教程](https://ts.xcatliu.com/) - 阮一峰推荐，适合入门
- [深入理解 TypeScript](https://jkchao.github.io/typescript-book-chinese/) - 进阶必读

### 视频课程

- [TypeScript 官方视频教程](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)

### 实践项目

- [Type Challenges](https://github.com/type-challenges/type-challenges) - TypeScript 类型体操练习

---

*建议学习顺序：基础类型 → 接口 → 泛型 → 高级类型*

