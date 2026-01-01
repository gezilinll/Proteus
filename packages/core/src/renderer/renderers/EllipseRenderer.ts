import { ElementRenderer } from '../ElementRenderer';
import { RenderContext } from '../RenderContext';
import { Element } from '../../types/element';

/**
 * 椭圆渲染器
 */
export class EllipseRenderer implements ElementRenderer {
  render(ctx: RenderContext, element: Element): void {
    const { width, height } = element.transform;
    const { fill, stroke, strokeWidth, opacity } = element.style;

    ctx.getRawContext().globalAlpha = opacity ?? 1;

    // 绘制椭圆
    ctx.beginPath();
    const radiusX = width / 2;
    const radiusY = height / 2;
    
    // 使用 ellipse 方法绘制真正的椭圆
    ctx.getRawContext().ellipse(0, 0, radiusX, radiusY, 0, 0, Math.PI * 2);

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
}

