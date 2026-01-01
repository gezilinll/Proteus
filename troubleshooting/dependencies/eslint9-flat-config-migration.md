# ESLint 9 Flat Config 迁移

## 现象

升级到 ESLint 9.x 后，运行 `pnpm lint` 出现以下错误：

```
ESLint couldn't find an eslint.config.(js|mjs|cjs) file.
```

原有的 `.eslintrc.cjs` 配置文件不再被识别。

同时，配置迁移后可能出现：

```
'document' is not defined  no-undef
'window' is not defined    no-undef
```

## 环境

- ESLint: 9.x
- 从 ESLint 8.x 升级
- 发生时间：Step 1 项目初始化时

## 原因分析

ESLint 9.0 是一个 **major breaking change**，最大的变化是弃用了传统的 `.eslintrc.*` 配置文件格式，改用全新的 **Flat Config** 格式。

### 主要变化

| 方面 | ESLint 8.x | ESLint 9.x |
|------|-----------|-----------|
| 配置文件 | `.eslintrc.js`, `.eslintrc.cjs`, `.eslintrc.json` | `eslint.config.js`, `eslint.config.mjs` |
| 配置结构 | 对象（带 env、extends、rules 等字段） | 数组（配置对象列表） |
| 插件使用 | 字符串引用 `"plugins": ["react"]` | 直接导入 `import react from 'eslint-plugin-react'` |
| 环境变量 | `env: { browser: true }` | 使用 `globals` 包 |
| extends | 字符串数组 | 直接展开配置对象 |

### 为什么 browser globals 丢失

在 ESLint 8.x 中，我们通过 `env: { browser: true }` 来声明浏览器环境，ESLint 会自动识别 `document`、`window` 等全局变量。

在 Flat Config 中，没有 `env` 字段，需要手动通过 `globals` 包来定义：

```javascript
import globals from 'globals';

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser, // document, window, etc.
      }
    }
  }
];
```

## 解决方案

### 1. 安装必要依赖

```bash
pnpm add -D globals @eslint/js
```

### 2. 创建新配置文件

删除旧的 `.eslintrc.cjs`，创建 `eslint.config.js`：

```javascript
import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  // 基础 JS 推荐规则
  js.configs.recommended,

  // TypeScript 文件配置
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,  // document, window, navigator...
        ...globals.node,     // process, __dirname...
        ...globals.es2022,   // Promise, Map, Set...
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react: react,
      'react-hooks': reactHooks,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // React 17+ 不需要
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // Prettier 兼容（放最后）
  prettier,

  // 忽略文件
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/*.js'],
  },
];
```

### 3. 测试配置

```bash
pnpm lint
```

## 延伸知识

### Flat Config 的优势

1. **更直观**：配置就是一个数组，按顺序应用
2. **更灵活**：可以用 JS 逻辑动态生成配置
3. **更明确**：没有隐式的 extends 继承链
4. **更好的类型支持**：直接导入插件对象

### 配置合并规则

Flat Config 数组中的配置按顺序合并：

```javascript
export default [
  { rules: { 'no-console': 'warn' } },
  { rules: { 'no-console': 'error' } }, // 后面的覆盖前面的
];
```

### 文件匹配

使用 `files` 和 `ignores` 字段：

```javascript
{
  files: ['**/*.ts', '**/*.tsx'],  // 只对这些文件生效
  ignores: ['**/*.test.ts'],       // 排除这些文件
  rules: { ... }
}
```

### 迁移工具

ESLint 官方提供了迁移工具：

```bash
npx @eslint/migrate-config .eslintrc.cjs
```

但建议手动迁移以更好理解新格式。

## 参考

- [ESLint Flat Config 官方文档](https://eslint.org/docs/latest/use/configure/configuration-files)
- [ESLint 9 迁移指南](https://eslint.org/docs/latest/use/migrate-to-9.0.0)
- [globals 包](https://www.npmjs.com/package/globals)
- [TypeScript ESLint Flat Config](https://typescript-eslint.io/getting-started/)

