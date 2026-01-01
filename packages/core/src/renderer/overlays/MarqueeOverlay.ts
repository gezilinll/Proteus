import { RenderContext } from '../RenderContext';

/**
 * 框选矩形数据
 */
export interface MarqueeBounds {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

/**
 * 框选矩形渲染器
 */
export class MarqueeOverlay {
  private readonly STROKE_WIDTH = 2;
  private readonly STROKE_COLOR = '#3b82f6'; // 蓝色
  private readonly FILL_COLOR = 'rgba(59, 130, 246, 0.1)'; // 半透明蓝色

  /**
   * 渲染框选矩形
   */
  render(ctx: RenderContext, bounds: MarqueeBounds): void {
    const { startX, startY, endX, endY } = bounds;
    const left = Math.min(startX, endX);
    const top = Math.min(startY, endY);
    const width = Math.abs(endX - startX);
    const height = Math.abs(endY - startY);

    // 填充
    ctx.getRawContext().fillStyle = this.FILL_COLOR;
    ctx.fillRect(left, top, width, height);

    // 描边
    ctx.getRawContext().strokeStyle = this.STROKE_COLOR;
    ctx.getRawContext().lineWidth = this.STROKE_WIDTH;
    ctx.getRawContext().setLineDash([5, 5]); // 虚线
    ctx.beginPath();
    ctx.rect(left, top, width, height);
    ctx.stroke();

    // 重置虚线
    ctx.getRawContext().setLineDash([]);
  }
}

