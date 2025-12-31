# Vite

> 下一代前端构建工具，极速开发体验。

---

## 概述

### 是什么

Vite（法语"快速"）是由 Vue.js 作者尤雨溪开发的前端构建工具。它利用浏览器原生 ES 模块支持，提供极速的开发服务器启动和热更新。

### 核心优势

- **极速冷启动**：不需要打包，直接启动
- **即时热更新**：毫秒级 HMR
- **按需编译**：只编译当前需要的文件
- **优化构建**：生产环境使用 Rollup 打包

---

## 核心概念

### 1. 开发服务器工作原理

```
传统打包器（Webpack）:
  启动 → 分析依赖 → 打包所有模块 → 启动服务器
  （可能需要几十秒）

Vite:
  启动 → 直接启动服务器 → 按需编译
  （通常 < 1 秒）
```

**原理**：
- 利用浏览器原生 ES 模块（`<script type="module">`）
- 依赖预构建：将 node_modules 依赖打包成 ESM
- 源码按需转换：只编译浏览器请求的文件

### 2. 基础配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  
  // 开发服务器配置
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  
  // 构建配置
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
  },
  
  // 路径别名
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
    },
  },
});
```

### 3. 环境变量

```bash
# .env
VITE_API_URL=https://api.example.com

# .env.development
VITE_API_URL=http://localhost:8080

# .env.production
VITE_API_URL=https://api.production.com
```

```typescript
// 使用环境变量
const apiUrl = import.meta.env.VITE_API_URL;

// 内置变量
import.meta.env.MODE      // 'development' | 'production'
import.meta.env.DEV       // true in dev
import.meta.env.PROD      // true in prod
import.meta.env.BASE_URL  // 部署基础路径
```

```typescript
// TypeScript 类型声明
// env.d.ts
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

### 4. 静态资源处理

```typescript
// 导入图片
import logo from './logo.png';
// logo = '/assets/logo.2d8e4f.png'

// URL 导入
import workletURL from './worker.js?url';

// 原始内容导入
import shaderSource from './shader.glsl?raw';

// Web Worker
import Worker from './worker.js?worker';

// 内联资源
import icon from './icon.svg?inline';
```

### 5. CSS 处理

```typescript
// 原生 CSS 导入
import './style.css';

// CSS Modules
import styles from './style.module.css';
<div className={styles.container} />

// CSS 预处理器（需安装对应预处理器）
import './style.scss';
import './style.less';

// PostCSS（自动检测 postcss.config.js）
```

### 6. 插件系统

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  plugins: [
    react(),
    
    // 兼容旧浏览器
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
});
```

#### 常用官方插件

- `@vitejs/plugin-react` - React 支持
- `@vitejs/plugin-vue` - Vue 支持
- `@vitejs/plugin-legacy` - 传统浏览器支持

#### 常用社区插件

```typescript
import compression from 'vite-plugin-compression'; // Gzip 压缩
import { visualizer } from 'rollup-plugin-visualizer'; // 包分析
import svgr from 'vite-plugin-svgr'; // SVG 转 React 组件
```

### 7. 自定义插件

```typescript
// 插件本质是一个对象
const myPlugin = {
  name: 'my-plugin',
  
  // 配置解析
  config(config, { command }) {
    if (command === 'build') {
      return { base: '/production/' };
    }
  },
  
  // 转换代码
  transform(code, id) {
    if (id.endsWith('.md')) {
      return { code: transformMarkdown(code) };
    }
  },
  
  // 构建时钩子
  buildStart() {
    console.log('构建开始');
  },
  
  // 开发服务器钩子
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      // 自定义中间件
      next();
    });
  },
};
```

### 8. 构建优化

```typescript
export default defineConfig({
  build: {
    // 代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          // 将 React 相关库打包到一起
          vendor: ['react', 'react-dom'],
          // UI 库单独打包
          ui: ['antd', '@ant-design/icons'],
        },
      },
    },
    
    // 压缩配置
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 移除 console
      },
    },
    
    // 资源内联阈值
    assetsInlineLimit: 4096, // < 4KB 的资源内联
    
    // CSS 代码分割
    cssCodeSplit: true,
  },
});
```

### 9. 依赖预构建

```typescript
export default defineConfig({
  optimizeDeps: {
    // 强制预构建
    include: ['lodash-es', 'axios'],
    
    // 排除预构建
    exclude: ['your-local-package'],
    
    // 入口文件
    entries: ['./src/main.tsx'],
  },
});
```

### 10. 多页面应用

```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin/index.html'),
      },
    },
  },
});
```

### 11. 库模式

```typescript
// 构建为库
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MyLib',
      fileName: (format) => `my-lib.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});
```

---

## 在本项目中的应用

- **开发服务器**：`pnpm dev` 启动 Vite 开发服务器
- **路径别名**：`@proteus/core` 和 `@proteus/react` 别名配置
- **React 插件**：使用 `@vitejs/plugin-react` 支持 JSX 和 Fast Refresh
- **Monorepo 集成**：配合 pnpm workspace 使用

---

## 学习资源

### 官方资源

- [Vite 官方文档](https://vitejs.dev/) - 最权威的参考
- [Vite 中文文档](https://cn.vitejs.dev/) - 官方中文翻译
- [Vite GitHub](https://github.com/vitejs/vite) - 源码和 issues

### 教程

- [Vite 学习笔记](https://kisugitakumi.net/2025/04/06/Vite%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0/index.html) - 个人学习笔记

### 视频

- [Vite 世界指南](https://www.bilibili.com/video/BV1GN4y1M7P5/) - B站深入教程

### 深入理解

- [Vite 设计理念](https://vitejs.dev/guide/why.html) - 官方解释为什么创建 Vite
- [Rollup 文档](https://rollupjs.org/) - Vite 生产构建使用的打包器

---

*建议学习顺序：快速上手 → 配置文件 → 插件系统 → 构建优化*

