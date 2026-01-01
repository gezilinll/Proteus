import { RenderContext } from '../RenderContext';
import { Guide, GuideType } from '../../interaction/SnapGuide';
import { Viewport } from '../../viewport/Viewport';

/**
 * 对齐线覆盖层渲染器
 */
export class GuideOverlay {
  constructor(private viewport: Viewport) {}

  /**
   * 渲染对齐线
   */
  render(ctx: RenderContext, guides: Guide[]): void {
    if (guides.length === 0) return;

    const { zoom, offsetX, offsetY } = this.viewport;

    ctx.save();

    // 设置样式
    ctx.setStrokeStyle('#3b82f6'); // 蓝色对齐线
    ctx.setLineWidth(1 / zoom); // 根据缩放调整线宽
    ctx.setLineDash([4 / zoom, 4 / zoom]); // 虚线

    for (const guide of guides) {
      if (guide.type === GuideType.VERTICAL) {
        // 垂直对齐线
        const screenX = guide.position * zoom + offsetX;
        ctx.beginPath();
        ctx.moveTo(screenX, 0);
        ctx.lineTo(screenX, ctx.getRawContext().canvas.height);
        ctx.stroke();
      } else {
        // 水平对齐线
        const screenY = guide.position * zoom + offsetY;
        ctx.beginPath();
        ctx.moveTo(0, screenY);
        ctx.lineTo(ctx.getRawContext().canvas.width, screenY);
        ctx.stroke();
      }
    }

    ctx.restore();
  }
}

