import { ElementRenderer } from '../ElementRenderer';
import { RenderContext } from '../RenderContext';
import { Element } from '../../types/element';

/**
 * 矩形渲染器
 */
export class RectangleRenderer implements ElementRenderer {
  render(ctx: RenderContext, element: Element): void {
    const { width, height } = element.transform;
    const { fill, stroke, strokeWidth, opacity, borderRadius } = element.style;

    ctx.getRawContext().globalAlpha = opacity ?? 1;

    // 绘制矩形路径
    if (borderRadius && borderRadius > 0) {
      // 圆角矩形
      this.renderRoundedRect(ctx, -width / 2, -height / 2, width, height, borderRadius);
    } else {
      // 普通矩形
      ctx.beginPath();
      ctx.rect(-width / 2, -height / 2, width, height);
    }

    // 填充
    if (fill) {
      ctx.setFillStyle(fill);
      ctx.fill();
    }

    // 描边
    if (stroke && strokeWidth) {
      ctx.setStrokeStyle(stroke);
      ctx.setLineWidth(strokeWidth);
      ctx.stroke();
    }
  }

  /**
   * 渲染圆角矩形
   */
  private renderRoundedRect(
    ctx: RenderContext,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ): void {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.arc(x + width - r, y + r, r, -Math.PI / 2, 0, false);
    ctx.lineTo(x + width, y + height - r);
    ctx.arc(x + width - r, y + height - r, r, 0, Math.PI / 2, false);
    ctx.lineTo(x + r, y + height);
    ctx.arc(x + r, y + height - r, r, Math.PI / 2, Math.PI, false);
    ctx.lineTo(x, y + r);
    ctx.arc(x + r, y + r, r, Math.PI, -Math.PI / 2, false);
    ctx.closePath();
  }
}

