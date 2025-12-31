# Vitest

> 由 Vite 驱动的快速单元测试框架。

---

## 概述

### 是什么

Vitest 是一个由 Vite 提供支持的极速单元测试框架。它与 Vite 共享配置和转换管道，提供了与 Jest 兼容的 API。

### 核心优势

- **极速**：利用 Vite 的转换管道，无需额外配置
- **兼容 Jest**：API 与 Jest 高度兼容，迁移成本低
- **开箱即用**：原生支持 TypeScript、ESM、JSX
- **智能监听**：只运行受影响的测试

---

## 核心概念

### 1. 基础配置

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // 测试环境
    environment: 'node', // 'node' | 'jsdom' | 'happy-dom'
    
    // 全局 API（可选）
    globals: true,
    
    // 包含的测试文件
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    
    // 排除的文件
    exclude: ['node_modules', 'dist'],
    
    // 覆盖率
    coverage: {
      provider: 'v8', // 'v8' | 'istanbul'
      reporter: ['text', 'json', 'html'],
    },
    
    // 设置文件
    setupFiles: ['./src/test/setup.ts'],
  },
});
```

### 2. 编写测试

```typescript
// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

export function divide(a: number, b: number): number {
  if (b === 0) throw new Error('Cannot divide by zero');
  return a / b;
}

// math.test.ts
import { describe, it, expect } from 'vitest';
import { add, divide } from './math';

describe('math', () => {
  describe('add', () => {
    it('should add two numbers', () => {
      expect(add(1, 2)).toBe(3);
    });

    it('should handle negative numbers', () => {
      expect(add(-1, 1)).toBe(0);
    });
  });

  describe('divide', () => {
    it('should divide two numbers', () => {
      expect(divide(6, 2)).toBe(3);
    });

    it('should throw on division by zero', () => {
      expect(() => divide(1, 0)).toThrow('Cannot divide by zero');
    });
  });
});
```

### 3. 断言（Assertions）

```typescript
import { expect } from 'vitest';

// 基础断言
expect(value).toBe(expected);           // 严格相等
expect(value).toEqual(expected);        // 深度相等
expect(value).not.toBe(unexpected);     // 否定

// 类型断言
expect(value).toBeDefined();
expect(value).toBeUndefined();
expect(value).toBeNull();
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(typeof value).toBe('string');

// 数字断言
expect(value).toBeGreaterThan(3);
expect(value).toBeGreaterThanOrEqual(3);
expect(value).toBeLessThan(5);
expect(value).toBeCloseTo(0.3, 5);      // 浮点数比较

// 字符串断言
expect(value).toMatch(/regex/);
expect(value).toContain('substring');
expect(value).toHaveLength(3);

// 数组断言
expect(array).toContain(item);
expect(array).toContainEqual({ id: 1 });
expect(array).toHaveLength(3);

// 对象断言
expect(obj).toHaveProperty('key');
expect(obj).toHaveProperty('key', 'value');
expect(obj).toMatchObject({ key: 'value' });

// 错误断言
expect(() => fn()).toThrow();
expect(() => fn()).toThrow('error message');
expect(() => fn()).toThrow(ErrorClass);

// Promise 断言
await expect(promise).resolves.toBe(value);
await expect(promise).rejects.toThrow();

// 快照断言
expect(value).toMatchSnapshot();
expect(value).toMatchInlineSnapshot(`"expected"`);
```

### 4. Hooks（生命周期）

```typescript
import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';

describe('lifecycle', () => {
  beforeAll(() => {
    // 所有测试之前运行一次
    console.log('开始所有测试');
  });

  afterAll(() => {
    // 所有测试之后运行一次
    console.log('结束所有测试');
  });

  beforeEach(() => {
    // 每个测试之前运行
    console.log('开始单个测试');
  });

  afterEach(() => {
    // 每个测试之后运行
    console.log('结束单个测试');
  });

  it('test 1', () => { /* ... */ });
  it('test 2', () => { /* ... */ });
});
```

### 5. Mock

```typescript
import { vi, describe, it, expect } from 'vitest';

// Mock 函数
const mockFn = vi.fn();
mockFn('arg1', 'arg2');

expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
expect(mockFn).toHaveBeenCalledTimes(1);

// Mock 返回值
const mockFn2 = vi.fn()
  .mockReturnValue(10)
  .mockReturnValueOnce(5);

expect(mockFn2()).toBe(5);  // 第一次调用
expect(mockFn2()).toBe(10); // 后续调用

// Mock 实现
const mockFn3 = vi.fn((x: number) => x * 2);
expect(mockFn3(5)).toBe(10);

// Mock 模块
vi.mock('./module', () => ({
  someFunction: vi.fn(() => 'mocked'),
}));

// 部分 Mock
vi.mock('./module', async () => {
  const actual = await vi.importActual('./module');
  return {
    ...actual,
    someFunction: vi.fn(),
  };
});

// Spy
import * as utils from './utils';

const spy = vi.spyOn(utils, 'someFunction');
utils.someFunction();
expect(spy).toHaveBeenCalled();
spy.mockRestore();

// Mock 日期
vi.useFakeTimers();
vi.setSystemTime(new Date('2024-01-01'));
// ... 测试
vi.useRealTimers();

// Mock 定时器
vi.useFakeTimers();
setTimeout(() => {}, 1000);
vi.advanceTimersByTime(1000);
vi.runAllTimers();
```

### 6. 异步测试

```typescript
import { it, expect } from 'vitest';

// async/await
it('async test', async () => {
  const result = await fetchData();
  expect(result).toBe('data');
});

// Promise
it('promise test', () => {
  return fetchData().then((result) => {
    expect(result).toBe('data');
  });
});

// 回调
it('callback test', (done) => {
  fetchDataWithCallback((result) => {
    expect(result).toBe('data');
    done();
  });
});

// 等待条件
import { waitFor } from '@testing-library/react';

it('wait test', async () => {
  await waitFor(() => {
    expect(element).toBeVisible();
  });
});
```

### 7. React 组件测试

```typescript
// 安装
// pnpm add -D @testing-library/react @testing-library/jest-dom jsdom

// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});

// src/test/setup.ts
import '@testing-library/jest-dom';

// Button.tsx
interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
}

export function Button({ onClick, children }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>;
}

// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
```

### 8. 测试覆盖率

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'test/',
        '**/*.d.ts',
        '**/*.test.ts',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
```

```bash
# 运行覆盖率
vitest run --coverage
```

### 9. 快照测试

```typescript
import { expect, it } from 'vitest';

it('snapshot test', () => {
  const user = { name: 'John', age: 30 };
  expect(user).toMatchSnapshot();
});

// 内联快照
it('inline snapshot', () => {
  const user = { name: 'John', age: 30 };
  expect(user).toMatchInlineSnapshot(`
    {
      "age": 30,
      "name": "John",
    }
  `);
});

// 更新快照
// vitest -u
```

### 10. 并发测试

```typescript
import { describe, it } from 'vitest';

// 并发运行测试
describe.concurrent('concurrent tests', () => {
  it('test 1', async () => { /* ... */ });
  it('test 2', async () => { /* ... */ });
});

// 跳过测试
it.skip('skipped test', () => { /* ... */ });

// 只运行这个测试
it.only('only this test', () => { /* ... */ });

// Todo 测试
it.todo('implement later');

// 条件跳过
it.skipIf(process.platform === 'win32')('unix only', () => {});
it.runIf(process.env.CI)('only in CI', () => {});
```

### 11. 命令行使用

```bash
# 运行所有测试
vitest

# 运行一次（不监听）
vitest run

# 运行特定文件
vitest run src/utils.test.ts

# 运行匹配的测试
vitest run -t "should add"

# UI 模式
vitest --ui

# 覆盖率
vitest run --coverage

# 更新快照
vitest -u

# 调试
vitest --inspect-brk
```

### 12. 与 Jest 的区别

```typescript
// Jest
jest.fn()
jest.mock()
jest.spyOn()

// Vitest
vi.fn()
vi.mock()
vi.spyOn()

// 兼容模式（vitest.config.ts）
export default defineConfig({
  test: {
    globals: true, // 全局 API，类似 Jest
  },
});
```

---

## 在本项目中的应用

- **单元测试**：测试核心逻辑（Scene、Command 等）
- **组件测试**：测试 React 组件
- **Mock**：模拟浏览器 API 和外部依赖
- **覆盖率**：确保代码质量

---

## 学习资源

### 官方资源

- [Vitest 官方文档](https://vitest.dev/) - 最权威的参考
- [Vitest GitHub](https://github.com/vitest-dev/vitest) - 源码和示例

### Testing Library

- [Testing Library 官方文档](https://testing-library.com/) - React 测试最佳实践
- [Testing Library Cheatsheet](https://testing-library.com/docs/react-testing-library/cheatsheet/)

### 教程

- [Vitest 官方示例](https://github.com/vitest-dev/vitest/tree/main/examples)

### 相关工具

- [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/)
- [@testing-library/jest-dom](https://github.com/testing-library/jest-dom)
- [msw](https://mswjs.io/) - API Mock

---

*建议学习顺序：基础测试 → 断言 → Mock → React 组件测试 → 覆盖率*

