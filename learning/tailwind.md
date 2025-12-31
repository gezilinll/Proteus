# Tailwind CSS

> 实用优先的 CSS 框架。

---

## 概述

### 是什么

Tailwind CSS 是一个实用优先（Utility-First）的 CSS 框架，提供大量预定义的原子类，让你直接在 HTML 中构建设计，无需编写自定义 CSS。

### 核心理念

- **实用优先**：使用小而单一用途的类构建 UI
- **约束设计**：预定义的设计系统（颜色、间距、字体等）
- **响应式**：内置响应式修饰符
- **按需生成**：只打包使用到的样式

---

## 核心概念

### 1. 基础类

```html
<!-- 传统 CSS -->
<div style="padding: 16px; background-color: blue; color: white; border-radius: 8px;">
  Hello
</div>

<!-- Tailwind CSS -->
<div class="p-4 bg-blue-500 text-white rounded-lg">
  Hello
</div>
```

### 2. 间距系统

```html
<!-- Padding -->
<div class="p-4">    <!-- 1rem 所有方向 -->
<div class="px-4">   <!-- 水平方向 -->
<div class="py-4">   <!-- 垂直方向 -->
<div class="pt-4">   <!-- 上 -->
<div class="pr-4">   <!-- 右 -->
<div class="pb-4">   <!-- 下 -->
<div class="pl-4">   <!-- 左 -->

<!-- Margin -->
<div class="m-4">    <!-- 1rem 所有方向 -->
<div class="mx-auto"><!-- 水平居中 -->
<div class="mt-4">   <!-- 上边距 -->
<div class="-mt-4">  <!-- 负边距 -->

<!-- 间距单位 -->
<!-- 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96 -->
<!-- 例如：p-4 = 1rem = 16px -->
```

### 3. 颜色系统

```html
<!-- 背景色 -->
<div class="bg-blue-500">    <!-- 蓝色 -->
<div class="bg-gray-100">    <!-- 浅灰 -->
<div class="bg-transparent"> <!-- 透明 -->

<!-- 文字色 -->
<div class="text-white">
<div class="text-gray-900">
<div class="text-blue-600">

<!-- 边框色 -->
<div class="border border-gray-300">
<div class="border-2 border-blue-500">

<!-- 颜色级别：50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 -->
<!-- 500 是标准色，数字越小越浅 -->

<!-- 透明度 -->
<div class="bg-blue-500/50">     <!-- 50% 透明度 -->
<div class="text-black/75">      <!-- 75% 透明度 -->
```

### 4. 布局

```html
<!-- Display -->
<div class="block">
<div class="inline-block">
<div class="flex">
<div class="inline-flex">
<div class="grid">
<div class="hidden">

<!-- Flexbox -->
<div class="flex items-center justify-between gap-4">
  <div class="flex-1">左侧</div>
  <div class="flex-shrink-0">右侧</div>
</div>

<div class="flex flex-col gap-2">     <!-- 垂直排列 -->
<div class="flex flex-wrap">          <!-- 换行 -->
<div class="flex items-start">        <!-- 顶部对齐 -->
<div class="flex justify-center">     <!-- 水平居中 -->

<!-- Grid -->
<div class="grid grid-cols-3 gap-4">  <!-- 3 列 -->
<div class="grid grid-cols-12">       <!-- 12 列栅格 -->
<div class="col-span-6">              <!-- 占 6 列 -->

<!-- 定位 -->
<div class="relative">
<div class="absolute top-0 right-0">
<div class="fixed inset-0">           <!-- 全屏固定 -->
<div class="sticky top-0">            <!-- 粘性定位 -->
<div class="z-10">                    <!-- z-index -->
```

### 5. 尺寸

```html
<!-- 宽度 -->
<div class="w-full">        <!-- 100% -->
<div class="w-1/2">         <!-- 50% -->
<div class="w-screen">      <!-- 100vw -->
<div class="w-64">          <!-- 16rem = 256px -->
<div class="w-[200px]">     <!-- 任意值 -->
<div class="min-w-0">       <!-- min-width -->
<div class="max-w-md">      <!-- max-width: 28rem -->

<!-- 高度 -->
<div class="h-full">        <!-- 100% -->
<div class="h-screen">      <!-- 100vh -->
<div class="h-64">          <!-- 16rem -->
<div class="min-h-screen">  <!-- min-height: 100vh -->
```

### 6. 字体排版

```html
<!-- 字号 -->
<div class="text-xs">       <!-- 12px -->
<div class="text-sm">       <!-- 14px -->
<div class="text-base">     <!-- 16px -->
<div class="text-lg">       <!-- 18px -->
<div class="text-xl">       <!-- 20px -->
<div class="text-2xl">      <!-- 24px -->
<div class="text-4xl">      <!-- 36px -->

<!-- 字重 -->
<div class="font-thin">     <!-- 100 -->
<div class="font-normal">   <!-- 400 -->
<div class="font-medium">   <!-- 500 -->
<div class="font-semibold"> <!-- 600 -->
<div class="font-bold">     <!-- 700 -->

<!-- 对齐 -->
<div class="text-left">
<div class="text-center">
<div class="text-right">

<!-- 行高 -->
<div class="leading-none">    <!-- 1 -->
<div class="leading-tight">   <!-- 1.25 -->
<div class="leading-normal">  <!-- 1.5 -->
<div class="leading-relaxed"> <!-- 1.625 -->

<!-- 其他 -->
<div class="truncate">       <!-- 文本截断 -->
<div class="line-clamp-2">   <!-- 限制 2 行 -->
<div class="whitespace-nowrap">
```

### 7. 边框与圆角

```html
<!-- 边框 -->
<div class="border">         <!-- 1px solid -->
<div class="border-2">       <!-- 2px -->
<div class="border-t">       <!-- 只有上边框 -->
<div class="border-dashed">  <!-- 虚线 -->

<!-- 圆角 -->
<div class="rounded">        <!-- 0.25rem -->
<div class="rounded-md">     <!-- 0.375rem -->
<div class="rounded-lg">     <!-- 0.5rem -->
<div class="rounded-xl">     <!-- 0.75rem -->
<div class="rounded-full">   <!-- 50% -->
<div class="rounded-t-lg">   <!-- 只有上边圆角 -->
```

### 8. 阴影与效果

```html
<!-- 阴影 -->
<div class="shadow">
<div class="shadow-md">
<div class="shadow-lg">
<div class="shadow-xl">
<div class="shadow-2xl">
<div class="shadow-inner">   <!-- 内阴影 -->
<div class="shadow-none">

<!-- 透明度 -->
<div class="opacity-50">
<div class="opacity-0">

<!-- 过渡 -->
<div class="transition">              <!-- 默认过渡 -->
<div class="transition-all">          <!-- 所有属性 -->
<div class="transition-colors">       <!-- 只有颜色 -->
<div class="duration-300">            <!-- 300ms -->
<div class="ease-in-out">             <!-- 缓动函数 -->

<!-- 动画 -->
<div class="animate-spin">
<div class="animate-ping">
<div class="animate-pulse">
<div class="animate-bounce">
```

### 9. 响应式设计

```html
<!-- 断点前缀 -->
<!-- sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px -->

<div class="text-sm md:text-base lg:text-lg">
  <!-- 小屏 14px，中屏 16px，大屏 18px -->
</div>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <!-- 小屏 1 列，中屏 2 列，大屏 3 列 -->
</div>

<div class="hidden lg:block">
  <!-- 只在大屏显示 -->
</div>
```

### 10. 状态变体

```html
<!-- Hover -->
<button class="bg-blue-500 hover:bg-blue-600">

<!-- Focus -->
<input class="focus:outline-none focus:ring-2 focus:ring-blue-500">

<!-- Active -->
<button class="active:scale-95">

<!-- Disabled -->
<button class="disabled:opacity-50 disabled:cursor-not-allowed">

<!-- Group Hover -->
<div class="group">
  <span class="group-hover:text-blue-500">
</div>

<!-- 深色模式 -->
<div class="bg-white dark:bg-gray-900 text-black dark:text-white">

<!-- First/Last Child -->
<li class="first:pt-0 last:pb-0">
```

### 11. 自定义配置

```javascript
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  
  theme: {
    extend: {
      // 扩展颜色
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
      },
      
      // 扩展字体
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      
      // 扩展间距
      spacing: {
        '128': '32rem',
      },
      
      // 扩展动画
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
```

### 12. 任意值

```html
<!-- 使用任意值 -->
<div class="w-[137px]">
<div class="bg-[#1da1f2]">
<div class="grid-cols-[200px_1fr_100px]">
<div class="text-[22px]">
<div class="top-[calc(100%-2rem)]">

<!-- 任意属性 -->
<div class="[mask-type:luminance]">
```

---

## 在本项目中的应用

- **UI 组件**：工具栏、面板等 UI 使用 Tailwind 构建
- **响应式布局**：适配不同屏幕尺寸
- **深色模式**：支持深色主题
- **快速迭代**：无需编写自定义 CSS，开发更快

---

## 学习资源

### 官方资源

- [Tailwind CSS 官方文档](https://tailwindcss.com/docs) - 最权威的参考
- [Tailwind CSS 中文文档](https://www.tailwindcss.cn/) - 中文翻译
- [Tailwind Play](https://play.tailwindcss.com/) - 在线练习

### 教程

- [Tailwind CSS 从入门到实战](https://www.youtube.com/results?search_query=tailwind+css+tutorial) - 视频教程

### 工具

- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) - VS Code 插件
- [Headless UI](https://headlessui.com/) - 无样式组件库
- [Heroicons](https://heroicons.com/) - 配套图标

### 组件库

- [Tailwind UI](https://tailwindui.com/) - 官方组件库（付费）
- [DaisyUI](https://daisyui.com/) - 免费组件库
- [Flowbite](https://flowbite.com/) - 组件库

---

*建议学习顺序：基础类 → 响应式 → 状态变体 → 自定义配置*

