import { Element, RendererRegistry, RenderContext } from '@proteus/core';

/**
 * 生成元素缩略图
 * @param element 要生成缩略图的元素
 * @param registry 渲染器注册表
 * @param size 缩略图大小（默认 32x32）
 * @returns 缩略图的 data URL
 */
export function generateElementThumbnail(
  element: Element,
  registry: RendererRegistry,
  size: number = 32
): string {
  // 创建离屏 Canvas
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return '';
  }

  const renderContext = new RenderContext(ctx);

  // 计算缩放比例，使元素适应缩略图大小
  const { width, height } = element.transform;
  const maxDimension = Math.max(width, height, 1);
  const scale = (size * 0.8) / maxDimension; // 留 20% 边距

  // 保存上下文
  renderContext.save();

  // 移动到画布中心
  ctx.translate(size / 2, size / 2);
  ctx.scale(scale, scale);

  // 应用旋转（如果需要）
  if (element.transform.rotation !== 0) {
    ctx.rotate(element.transform.rotation);
  }

  // 获取渲染器并渲染
  const renderer = registry.get(element.type);
  if (renderer) {
    try {
      renderer.render(renderContext, element);
    } catch (error) {
      console.warn('Failed to render thumbnail for element:', element.id, error);
    }
  }

  // 恢复上下文
  renderContext.restore();

  // 返回 data URL
  return canvas.toDataURL('image/png');
}

/**
 * 元素缩略图缓存
 */
const thumbnailCache = new Map<string, string>();

/**
 * 获取元素缩略图（带缓存）
 */
export function getElementThumbnail(
  element: Element,
  registry: RendererRegistry,
  size: number = 32
): string {
  // 生成缓存键（基于元素 ID 和关键属性）
  const cacheKey = `${element.id}-${element.transform.width}-${element.transform.height}-${element.transform.rotation}-${element.style.fill}-${element.style.stroke}-${element.style.text || ''}-${element.style.imageUrl || ''}`;
  
  // 检查缓存
  if (thumbnailCache.has(cacheKey)) {
    return thumbnailCache.get(cacheKey)!;
  }

  // 生成缩略图
  const thumbnail = generateElementThumbnail(element, registry, size);
  
  // 缓存（限制缓存大小，避免内存泄漏）
  if (thumbnailCache.size > 100) {
    // 清除最旧的缓存项（简单策略：清除第一个）
    const firstKey = thumbnailCache.keys().next().value;
    if (firstKey) {
      thumbnailCache.delete(firstKey);
    }
  }
  thumbnailCache.set(cacheKey, thumbnail);

  return thumbnail;
}

/**
 * 清除缩略图缓存
 */
export function clearThumbnailCache(): void {
  thumbnailCache.clear();
}

