import { Element, RendererRegistry, RenderContext } from '@proteus/core';

/**
 * 生成元素缩略图
 * @param element 要生成缩略图的元素
 * @param registry 渲染器注册表
 * @param size 缩略图大小（默认 64x64）
 * @returns 缩略图的 data URL
 */
export function generateElementThumbnail(
  element: Element,
  registry: RendererRegistry,
  displaySize: number = 64
): string {
  // 获取设备像素比，确保高清显示
  const dpr = Math.max(window.devicePixelRatio || 1, 2); // 至少使用 2x
  
  // 创建离屏 Canvas，使用高分辨率
  const canvas = document.createElement('canvas');
  const renderSize = displaySize * dpr;
  canvas.width = renderSize;
  canvas.height = renderSize;
  
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) {
    return '';
  }

  // 启用抗锯齿
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // 清空背景
  ctx.clearRect(0, 0, renderSize, renderSize);

  // 计算缩放比例，使元素适应缩略图大小（留 15% 边距）
  const { width, height } = element.transform;
  const maxDimension = Math.max(width, height, 1);
  const scale = (renderSize * 0.85) / maxDimension;

  // 保存上下文状态
  ctx.save();

  // 移动到画布中心
  ctx.translate(renderSize / 2, renderSize / 2);
  
  // 应用缩放
  ctx.scale(scale, scale);

  // 应用旋转（如果需要）
  if (element.transform.rotation !== 0) {
    ctx.rotate(element.transform.rotation);
  }

  // 创建渲染上下文
  const renderContext = new RenderContext(ctx);

  // 获取渲染器并渲染
  const renderer = registry.get(element.type);
  if (renderer) {
    try {
      renderer.render(renderContext, element);
    } catch (error) {
      console.warn('Failed to render thumbnail for element:', element.id, error);
    }
  }

  // 恢复上下文状态
  ctx.restore();

  // 返回 data URL
  return canvas.toDataURL('image/png');
}

/**
 * 元素缩略图缓存
 */
const thumbnailCache = new Map<string, { dataUrl: string; dpr: number }>();

/**
 * 获取元素缩略图（带缓存）
 */
export function getElementThumbnail(
  element: Element,
  registry: RendererRegistry,
  displaySize: number = 64
): string {
  const dpr = Math.max(window.devicePixelRatio || 1, 2);
  
  // 生成缓存键（包含所有影响显示的属性）
  const cacheKey = [
    element.id,
    element.transform.width.toFixed(0),
    element.transform.height.toFixed(0),
    element.transform.rotation.toFixed(2),
    element.style.fill || '',
    element.style.stroke || '',
    element.style.strokeWidth || 0,
    element.style.opacity ?? 1,
    element.style.borderRadius || 0,
    element.style.imageUrl || '',
    displaySize,
    dpr,
  ].join('-');
  
  // 检查缓存
  const cached = thumbnailCache.get(cacheKey);
  if (cached) {
    return cached.dataUrl;
  }

  // 生成缩略图
  const dataUrl = generateElementThumbnail(element, registry, displaySize);
  
  // 缓存（限制大小，使用 LRU 策略）
  if (thumbnailCache.size > 50) {
    const firstKey = thumbnailCache.keys().next().value;
    if (firstKey) {
      thumbnailCache.delete(firstKey);
    }
  }
  thumbnailCache.set(cacheKey, { dataUrl, dpr });

  return dataUrl;
}

/**
 * 清除缩略图缓存
 */
export function clearThumbnailCache(): void {
  thumbnailCache.clear();
}
