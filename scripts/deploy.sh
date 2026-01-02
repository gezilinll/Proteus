#!/bin/bash

# Proteus Web 应用部署脚本
# 将构建结果部署到阿里云 ECS 实例

set -e

# 配置信息
SERVER_IP="47.121.141.4"
SERVER_USER="${DEPLOY_USER:-root}"  # 可以通过环境变量 DEPLOY_USER 指定用户名，默认为 root
TARGET_DIR="/var/gezilinll/Proteus"
LOCAL_DIST="./apps/web/dist"

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Proteus 部署脚本 ===${NC}\n"

# 1. 检查构建产物
if [ ! -d "$LOCAL_DIST" ]; then
    echo -e "${YELLOW}构建产物不存在，开始构建...${NC}"
    echo "构建依赖包..."
    pnpm --filter @proteus/core build
    pnpm --filter @proteus/react build
    echo "构建 Web 应用..."
    cd apps/web && pnpm vite build && cd ../..
    echo -e "${GREEN}构建完成！${NC}\n"
fi

# 2. 检查 SSH 连接
echo -e "${YELLOW}检查服务器连接...${NC}"
if ! ssh -o ConnectTimeout=5 -o BatchMode=yes "${SERVER_USER}@${SERVER_IP}" exit 2>/dev/null; then
    echo -e "${RED}错误: 无法连接到服务器 ${SERVER_USER}@${SERVER_IP}${NC}"
    echo "请确保："
    echo "  1. SSH 密钥已配置（推荐使用 ssh-copy-id）"
    echo "  2. 服务器 IP 地址正确"
    echo "  3. 用户名正确（当前: ${SERVER_USER}，可通过 DEPLOY_USER 环境变量修改）"
    exit 1
fi
echo -e "${GREEN}服务器连接正常${NC}\n"

# 3. 创建目标目录
echo -e "${YELLOW}创建目标目录...${NC}"
ssh "${SERVER_USER}@${SERVER_IP}" "mkdir -p ${TARGET_DIR}"
echo -e "${GREEN}目录创建完成${NC}\n"

# 4. 上传文件
echo -e "${YELLOW}上传构建产物到服务器...${NC}"
rsync -avz --delete \
    --exclude='.git' \
    "${LOCAL_DIST}/" \
    "${SERVER_USER}@${SERVER_IP}:${TARGET_DIR}/"

echo -e "${GREEN}文件上传完成！${NC}\n"

# 5. 显示部署信息
echo -e "${GREEN}=== 部署完成 ===${NC}"
echo "服务器地址: ${SERVER_IP}"
echo "部署目录: ${TARGET_DIR}"
echo ""
echo "下一步："
echo "  1. 在服务器上配置 Web 服务器（Nginx/Apache）"
echo "  2. 将 ${TARGET_DIR} 配置为静态文件根目录"
echo "  3. 或者使用 Node.js 静态文件服务器："
echo "     cd ${TARGET_DIR} && npx serve -s . -l 80"

