import { ElementRenderer } from '../ElementRenderer';
import { RenderContext } from '../RenderContext';
import { Element } from '../../types/element';

/**
 * 文字渲染器
 */
export class TextRenderer implements ElementRenderer {
  render(ctx: RenderContext, element: Element): void {
    const { width } = element.transform;
    const { fill, fontSize, fontFamily, fontWeight, text, opacity } = element.style;

    ctx.getRawContext().globalAlpha = opacity ?? 1;

    const rawCtx = ctx.getRawContext();
    rawCtx.font = `${fontWeight ?? 'normal'} ${fontSize ?? 16}px ${fontFamily ?? 'Arial'}`;
    rawCtx.textAlign = 'center';
    rawCtx.textBaseline = 'middle';

    if (fill) {
      ctx.setFillStyle(fill);
      rawCtx.fillText(text ?? '', 0, 0, width);
    }
  }
}

