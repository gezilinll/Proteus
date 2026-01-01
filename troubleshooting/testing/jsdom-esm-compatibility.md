# jsdom 27 ESM 模块兼容性问题

## 现象

在运行 Vitest 单元测试时，测试环境无法启动，出现以下错误：

```
Error: require() of ES Module .../node_modules/@exodus/bytes/encoding-lite.js 
from .../node_modules/html-encoding-sniffer/lib/html-encoding-sniffer.js not supported.
Instead change the require of encoding-lite.js to a dynamic import() which is available 
in all CommonJS modules.
```

错误代码：`ERR_REQUIRE_ESM`

## 环境

- jsdom: 27.x
- Vitest: 4.x
- Node.js: 22.x
- 发生时间：Step 4 实现 Editor 单元测试时

## 原因分析

jsdom 27.x 版本依赖的 `html-encoding-sniffer` 库内部使用了 `require()` 来加载 `@exodus/bytes` 的 ESM 模块，这在 Node.js 的模块系统中是不允许的。

具体调用链：
```
jsdom 27.x
  └── html-encoding-sniffer 6.x
        └── @exodus/bytes (ESM 模块)
              ↑ 使用 require() 加载 ESM 模块 → 报错
```

这是一个依赖链中的兼容性问题，不是我们代码的问题。

## 解决方案

### 方案一：降级 jsdom 版本（推荐）

将 jsdom 降级到 24.x 版本，该版本不存在此兼容性问题：

```bash
pnpm --filter @proteus/core remove jsdom
pnpm --filter @proteus/core add -D jsdom@24.1.3
```

### 方案二：等待 jsdom 修复

跟踪 jsdom 的 GitHub issues，等待官方修复此兼容性问题后升级。

### 方案三：使用 happy-dom 替代

如果不依赖 jsdom 的特定功能，可以考虑使用 `happy-dom` 作为替代：

```bash
pnpm add -D happy-dom
```

在 `vitest.config.ts` 中配置：

```typescript
export default defineConfig({
  test: {
    environment: 'happy-dom',
  },
});
```

## 延伸知识

### ESM vs CommonJS

- **CommonJS (CJS)**：Node.js 的传统模块系统，使用 `require()` 和 `module.exports`
- **ES Modules (ESM)**：JavaScript 官方模块标准，使用 `import` 和 `export`

两者的关键区别：
- ESM 是静态的，可以在编译时分析依赖
- CJS 是动态的，可以在运行时加载模块
- **CJS 可以 require() CJS 模块，但不能 require() ESM 模块**
- ESM 可以 import CJS 模块（通过 default export）

### 为什么会出现这个问题

随着 JavaScript 生态向 ESM 迁移，越来越多的库开始发布纯 ESM 版本。但一些中间库（如 html-encoding-sniffer）仍在使用 CJS，当它们尝试用 `require()` 加载纯 ESM 依赖时就会出错。

### 如何判断包是 ESM 还是 CJS

1. 查看 `package.json` 中的 `type` 字段：
   - `"type": "module"` → ESM
   - `"type": "commonjs"` 或无此字段 → CJS

2. 查看入口文件扩展名：
   - `.mjs` → ESM
   - `.cjs` → CJS

## 参考

- [Node.js ESM 文档](https://nodejs.org/api/esm.html)
- [jsdom GitHub](https://github.com/jsdom/jsdom)
- [Vitest 环境配置](https://vitest.dev/config/#environment)

