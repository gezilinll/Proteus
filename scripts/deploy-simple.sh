#!/bin/bash

# 简化版部署脚本（使用 scp，不需要 rsync）

set -e

SERVER_IP="47.121.141.4"
SERVER_USER="${DEPLOY_USER:-root}"
TARGET_DIR="/var/gezilinll/Proteus"
LOCAL_DIST="./apps/web/dist"

echo "=== Proteus 部署脚本 ==="
echo ""

# 构建（如果需要）
if [ ! -d "$LOCAL_DIST" ]; then
    echo "构建项目..."
    pnpm --filter @proteus/core build
    pnpm --filter @proteus/react build
    cd apps/web && pnpm vite build && cd ../..
fi

# 上传
echo "上传文件到服务器..."
scp -r "${LOCAL_DIST}"/* "${SERVER_USER}@${SERVER_IP}:${TARGET_DIR}/"

echo ""
echo "部署完成！"
echo "服务器: ${SERVER_IP}"
echo "目录: ${TARGET_DIR}"

