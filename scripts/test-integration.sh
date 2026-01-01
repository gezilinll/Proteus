#!/bin/bash

# Phase 1 集成测试脚本
# 运行所有集成测试并生成报告

set -e

echo "🚀 开始运行 Phase 1 集成测试..."

# 运行核心包的集成测试
echo ""
echo "📦 运行 @proteus/core 集成测试..."
pnpm --filter @proteus/core test Editor.integration.test.ts --reporter=verbose

echo ""
echo "✅ 集成测试完成！"
echo ""
echo "测试覆盖："
echo "  - 元素创建与渲染 (4 个测试)"
echo "  - 选择系统 (3 个测试)"
echo "  - 变换操作 (1 个测试)"
echo "  - 复制粘贴 (3 个测试)"
echo "  - 删除操作 (1 个测试)"
echo "  - 撤销/重做 (4 个测试)"
echo "  - 批量操作 (2 个测试)"
echo "  - 性能测试 (2 个测试)"
echo "  - 工具系统 (1 个测试)"
echo "  - 视口操作 (3 个测试)"
echo ""
echo "总计: 24 个集成测试"

