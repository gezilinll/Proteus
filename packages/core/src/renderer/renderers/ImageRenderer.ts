import { ElementRenderer } from '../ElementRenderer';
import { RenderContext } from '../RenderContext';
import { Element } from '../../types/element';

/**
 * 图片渲染器（占位实现）
 */
export class ImageRenderer implements ElementRenderer {
  render(ctx: RenderContext, element: Element): void {
    // TODO: 实现图片渲染
    const { width, height } = element.transform;
    ctx.setFillStyle('#cccccc');
    ctx.fillRect(-width / 2, -height / 2, width, height);
  }
}

