# ESLint 9

> JavaScript/TypeScript 代码静态分析工具。

---

## 概述

### 是什么

ESLint 是一个可插拔的 JavaScript/TypeScript 代码检查工具。它可以发现代码中的问题、强制执行代码风格、提升代码质量。

### ESLint 9 重大变化

ESLint 9（2024 年发布）带来了重大更新，最显著的是全新的 **Flat Config** 配置系统。

---

## 核心概念

### 1. Flat Config（新配置格式）

```javascript
// eslint.config.js（ESLint 9 默认）
import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  // 预设配置
  js.configs.recommended,
  
  // 自定义配置
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
  
  // 忽略文件
  {
    ignores: ['dist/', 'node_modules/'],
  },
];
```

### 2. 旧配置 vs 新配置

```javascript
// 旧配置（.eslintrc.js）- ESLint 8 及之前
module.exports = {
  extends: ['eslint:recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'no-unused-vars': 'warn',
  },
};

// 新配置（eslint.config.js）- ESLint 9
import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';

export default [
  js.configs.recommended,
  {
    plugins: { '@typescript-eslint': typescript },
    rules: {
      'no-unused-vars': 'warn',
    },
  },
];
```

### 3. 规则配置

```javascript
// 规则级别
// "off" 或 0 - 关闭规则
// "warn" 或 1 - 警告（不影响退出码）
// "error" 或 2 - 错误（退出码为 1）

{
  rules: {
    // 关闭规则
    'no-console': 'off',
    
    // 警告
    'no-debugger': 'warn',
    
    // 错误
    'no-unused-vars': 'error',
    
    // 带选项的规则
    'quotes': ['error', 'single'],
    'indent': ['error', 2],
    'max-len': ['warn', { code: 100, ignoreUrls: true }],
    
    // TypeScript 规则
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],
  },
}
```

### 4. 常用规则分类

#### 可能的错误

```javascript
{
  rules: {
    'no-cond-assign': 'error',      // 禁止条件中赋值
    'no-constant-condition': 'error', // 禁止常量条件
    'no-dupe-keys': 'error',        // 禁止重复键
    'no-duplicate-case': 'error',   // 禁止重复 case
    'no-unreachable': 'error',      // 禁止不可达代码
    'no-unsafe-negation': 'error',  // 禁止不安全的否定
    'valid-typeof': 'error',        // 强制 typeof 有效
  },
}
```

#### 最佳实践

```javascript
{
  rules: {
    'eqeqeq': 'error',              // 强制使用 ===
    'no-eval': 'error',             // 禁止 eval
    'no-implied-eval': 'error',     // 禁止隐式 eval
    'no-return-await': 'error',     // 禁止不必要的 return await
    'prefer-const': 'error',        // 优先使用 const
    'no-var': 'error',              // 禁止 var
    'curly': 'error',               // 强制使用大括号
  },
}
```

#### 代码风格

```javascript
{
  rules: {
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'indent': ['error', 2],
    'comma-dangle': ['error', 'always-multiline'],
    'arrow-parens': ['error', 'always'],
    'object-curly-spacing': ['error', 'always'],
  },
}
```

### 5. TypeScript 集成

```javascript
// eslint.config.js
import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      
      // 禁用 JS 规则，使用 TS 版本
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error',
      
      // TypeScript 特有规则
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
    },
  },
];
```

### 6. React 集成

```javascript
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      
      'react/react-in-jsx-scope': 'off',  // React 17+ 不需要
      'react/prop-types': 'off',          // 使用 TypeScript
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
```

### 7. Prettier 集成

```javascript
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  
  // ... 其他配置
  
  // Prettier 必须放在最后，关闭冲突的规则
  prettier,
];
```

### 8. 全局变量

```javascript
import globals from 'globals';

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,     // document, window 等
        ...globals.node,        // process, __dirname 等
        ...globals.es2022,      // Promise, Map 等
        myGlobal: 'readonly',   // 自定义只读全局变量
      },
    },
  },
];
```

### 9. 忽略文件

```javascript
export default [
  // 全局忽略
  {
    ignores: [
      'dist/',
      'build/',
      'node_modules/',
      '*.config.js',
      '*.config.mjs',
      'coverage/',
    ],
  },
  
  // 其他配置...
];

// 或使用 .eslintignore 文件（仍然支持）
```

### 10. 命令行使用

```bash
# 检查文件
eslint src/

# 检查并修复
eslint src/ --fix

# 指定扩展名
eslint src/ --ext .ts,.tsx

# 输出格式
eslint src/ --format stylish
eslint src/ --format json > report.json

# 缓存（提升速度）
eslint src/ --cache

# 调试配置
eslint --print-config src/index.ts
```

### 11. 自定义规则

```javascript
// my-rules/no-foo.js
export default {
  meta: {
    type: 'problem',
    docs: {
      description: '禁止使用 foo 变量名',
    },
    fixable: 'code',
    schema: [],
  },
  create(context) {
    return {
      Identifier(node) {
        if (node.name === 'foo') {
          context.report({
            node,
            message: '不允许使用 "foo" 作为变量名',
            fix(fixer) {
              return fixer.replaceText(node, 'bar');
            },
          });
        }
      },
    };
  },
};

// eslint.config.js
import noFoo from './my-rules/no-foo.js';

export default [
  {
    plugins: {
      'my-rules': {
        rules: { 'no-foo': noFoo },
      },
    },
    rules: {
      'my-rules/no-foo': 'error',
    },
  },
];
```

### 12. 迁移到 Flat Config

```bash
# 官方迁移工具
npx @eslint/migrate-config .eslintrc.json

# 手动迁移步骤
# 1. 创建 eslint.config.js
# 2. 将 extends 改为数组导入
# 3. 将 plugins 改为对象格式
# 4. 将 env 改为 globals
# 5. 删除 .eslintrc.* 文件
```

---

## 在本项目中的应用

- **Flat Config**：使用 ESLint 9 的新配置格式
- **TypeScript**：集成 `@typescript-eslint`
- **React**：集成 `eslint-plugin-react` 和 `eslint-plugin-react-hooks`
- **Prettier**：使用 `eslint-config-prettier` 避免冲突

---

## 学习资源

### 官方资源

- [ESLint 官方文档](https://eslint.org/docs/latest/) - 最权威的参考
- [ESLint 规则列表](https://eslint.org/docs/latest/rules/) - 所有内置规则
- [Flat Config 迁移指南](https://eslint.org/docs/latest/use/configure/migration-guide)

### TypeScript ESLint

- [typescript-eslint 文档](https://typescript-eslint.io/) - TypeScript 集成官方文档
- [规则列表](https://typescript-eslint.io/rules/)

### 插件

- [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react)
- [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks)
- [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier)

---

*建议学习顺序：Flat Config 基础 → 规则配置 → TypeScript 集成 → React 集成*

