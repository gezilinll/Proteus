import { ElementRenderer } from '../ElementRenderer';
import { RenderContext } from '../RenderContext';
import { Element } from '../../types/element';

/**
 * 文字渲染器
 * 支持多行文本、对齐方式、自动换行
 */
export class TextRenderer implements ElementRenderer {
  render(ctx: RenderContext, element: Element): void {
    // 如果正在编辑，跳过渲染（由 DOM 编辑器显示）
    if (element.style._editing) {
      return;
    }

    const { width } = element.transform;
    const { fill, fontSize, fontFamily, fontWeight, text, textAlign, opacity } = element.style;

    const rawCtx = ctx.getRawContext();
    rawCtx.save();

    // 设置透明度
    rawCtx.globalAlpha = opacity ?? 1;

    // 设置字体
    const font = `${fontWeight ?? 'normal'} ${fontSize ?? 16}px ${fontFamily ?? 'Arial'}`;
    rawCtx.font = font;
    rawCtx.textBaseline = 'top'; // 使用 top 基准，便于多行计算

    // 设置对齐方式
    const align = textAlign ?? 'center';
    rawCtx.textAlign = align;

    if (!fill || !text) {
      rawCtx.restore();
      return;
    }

    ctx.setFillStyle(fill);

    // 处理多行文本
    const currentFontSize = fontSize ?? 16;
    const lines = this.wrapText(rawCtx, text, width);
    const lineHeight = currentFontSize * 1.2; // 行高为字体大小的 1.2 倍
    const totalHeight = lines.length * lineHeight;
    
    // 垂直居中
    const startY = -totalHeight / 2;

    // 绘制每一行
    lines.forEach((line, index) => {
      let x = 0;
      if (align === 'left') {
        x = -width / 2;
      } else if (align === 'right') {
        x = width / 2;
      }
      // center 时 x = 0

      const y = startY + index * lineHeight;
      rawCtx.fillText(line, x, y);
    });

    rawCtx.restore();
  }

  /**
   * 文本换行处理
   */
  private wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && currentLine) {
        // 如果当前行加上新词超过宽度，先保存当前行
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    // 如果没有内容，至少返回一行空字符串
    return lines.length > 0 ? lines : [''];
  }
}

