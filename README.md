# Proteus

**AI-Native Multimodal Collaborative Editor**

> Proteus（普罗透斯）：希腊神话中的海神，能随意变换成任何形态。正如我们的编辑器，能承载任何类型的内容。

## 项目结构

```
proteus/
├── packages/
│   ├── core/          # 编辑器核心（框架无关）
│   └── react/         # React 绑定
├── apps/
│   └── web/           # Web 应用
└── articles/          # 技术文章
```

## 开发

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
# 启动 Web 应用
pnpm dev

# 监听模式构建核心包
pnpm --filter @proteus/core dev
pnpm --filter @proteus/react dev
```

### 构建

```bash
# 构建所有包
pnpm build

# 构建特定包
pnpm --filter @proteus/core build
```

### 测试

```bash
# 运行所有测试
pnpm test

# 运行特定包的测试
pnpm --filter @proteus/core test
```

### 代码检查

```bash
# Lint
pnpm lint

# 类型检查
pnpm type-check

# 格式化
pnpm format
```

## 技术栈

- **前端框架**: React 19
- **语言**: TypeScript
- **构建工具**: Vite
- **状态管理**: Zustand
- **样式**: Tailwind CSS
- **测试**: Vitest
- **包管理**: pnpm (monorepo)

## 开发计划

详见 [Phase 1 实施计划](./articles/phase1-implementation-plan.md)

## License

MIT

