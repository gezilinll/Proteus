import { ElementRenderer } from '../ElementRenderer';
import { RenderContext } from '../RenderContext';
import { Element } from '../../types/element';

/**
 * 图片渲染器
 * 支持图片加载、渲染、变换和透明度
 */
export class ImageRenderer implements ElementRenderer {
  // 图片缓存：URL -> HTMLImageElement
  private imageCache = new Map<string, HTMLImageElement>();

  render(ctx: RenderContext, element: Element): void {
    const { width, height } = element.transform;
    const { imageUrl, opacity, _loading } = element.style;

    const rawCtx = ctx.getRawContext();
    rawCtx.save();

    // 设置透明度
    rawCtx.globalAlpha = opacity ?? 1;

    // 如果正在加载或没有图片 URL，显示加载状态
    if (_loading || !imageUrl) {
      this.renderLoadingState(rawCtx, width, height);
      rawCtx.restore();
      return;
    }

    // 获取或加载图片
    const image = this.getImage(imageUrl);

    if (image && image.complete && image.naturalWidth > 0) {
      // 图片已加载，绘制图片
      rawCtx.drawImage(
        image,
        -width / 2,
        -height / 2,
        width,
        height
      );
    } else {
      // 图片未加载完成，显示加载状态
      this.renderLoadingState(rawCtx, width, height);
    }

    rawCtx.restore();
  }

  /**
   * 渲染加载状态
   */
  private renderLoadingState(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    // 绘制占位背景（浅灰色，带虚线边框）
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(-width / 2, -height / 2, width, height);

    // 绘制虚线边框
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 4]);
    ctx.strokeRect(-width / 2, -height / 2, width, height);
    ctx.setLineDash([]);

    // 绘制加载图标（简单的旋转圆圈）
    const centerX = 0;
    const centerY = 0;
    const radius = Math.min(width, height) * 0.15;
    
    // 使用时间戳计算旋转角度（每秒旋转一圈）
    const rotationSpeed = 2 * Math.PI / 1000; // 每毫秒的弧度
    const currentTime = Date.now();
    const rotation = (currentTime * rotationSpeed) % (Math.PI * 2);
    
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    
    // 绘制圆弧（模拟旋转效果）
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, rotation, rotation + Math.PI * 1.5);
    ctx.stroke();

    // 绘制 "Loading..." 文字
    ctx.fillStyle = '#6b7280';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Loading...', centerX, centerY + radius + 20);
  }

  /**
   * 获取图片（从缓存或创建新实例）
   */
  private getImage(url: string): HTMLImageElement | null {
    // 如果已缓存，直接返回
    if (this.imageCache.has(url)) {
      return this.imageCache.get(url)!;
    }

    // 创建新图片并加载
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      // 图片加载成功，缓存已自动更新
    };

    img.onerror = () => {
      // 图片加载失败，从缓存中移除
      this.imageCache.delete(url);
    };

    img.src = url;
    this.imageCache.set(url, img);

    return img;
  }

  /**
   * 预加载图片
   */
  preloadImage(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.imageCache.has(url)) {
        const img = this.imageCache.get(url)!;
        if (img.complete && img.naturalWidth > 0) {
          resolve();
          return;
        }
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        this.imageCache.set(url, img);
        resolve();
      };

      img.onerror = () => {
        this.imageCache.delete(url);
        reject(new Error(`Failed to load image: ${url}`));
      };

      img.src = url;
    });
  }

  /**
   * 清除图片缓存
   */
  clearCache(): void {
    this.imageCache.clear();
  }
}
