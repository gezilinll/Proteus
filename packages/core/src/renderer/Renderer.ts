import { RenderContext } from './RenderContext';
import { Viewport } from '../viewport/Viewport';
import { Scene } from '../scene/Scene';
import { Element } from '../types/element';
import { ElementType } from '../types/ElementType';

/**
 * 渲染器
 * 负责将 Scene 中的元素渲染到 Canvas 上
 */
export class Renderer {
  private context: RenderContext | null = null;
  private animationFrameId: number | null = null;
  private isRendering: boolean = false;

  constructor(
    private canvas: HTMLCanvasElement,
    private scene: Scene,
    private viewport: Viewport,
    private dpr: number = 1
  ) {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D context from canvas');
    }
    this.context = new RenderContext(ctx);

    // 监听 Scene 变化
    this.scene.on('elementAdded', () => this.requestRender());
    this.scene.on('elementUpdated', () => this.requestRender());
    this.scene.on('elementRemoved', () => this.requestRender());
    this.scene.on('orderChanged', () => this.requestRender());
  }

  /**
   * 开始渲染循环
   */
  start(): void {
    if (this.isRendering) return;
    this.isRendering = true;
    this.render();
  }

  /**
   * 停止渲染循环
   */
  stop(): void {
    this.isRendering = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * 请求渲染（用于外部触发）
   */
  requestRender(): void {
    if (!this.isRendering) {
      this.render();
    }
  }

  /**
   * 渲染一帧
   */
  private render(): void {
    if (!this.context) return;

    const { width, height } = this.canvas;
    const ctx = this.context;

    // 重置变换并清空画布
    ctx.resetTransform();
    ctx.clear(width, height);

    // 应用 DPR 缩放
    ctx.save();
    ctx.getRawContext().scale(this.dpr, this.dpr);

    // 应用视口变换
    const transform = this.viewport.getTransform();
    ctx.getRawContext().translate(transform.translateX, transform.translateY);
    ctx.getRawContext().scale(transform.scaleX, transform.scaleY);

    // 按顺序渲染所有元素
    const elements = this.scene.getOrdered();
    for (const element of elements) {
      if (!element.meta.visible) continue;
      this.renderElement(ctx, element);
    }

    ctx.restore();

    // 继续渲染循环
    if (this.isRendering) {
      this.animationFrameId = requestAnimationFrame(() => this.render());
    }
  }

  /**
   * 渲染单个元素
   */
  private renderElement(ctx: RenderContext, element: Element): void {
    ctx.save();

    // 应用元素变换
    const { x, y, width, height, rotation } = element.transform;

    // 移动到元素中心
    ctx.getRawContext().translate(x + width / 2, y + height / 2);
    ctx.getRawContext().rotate(rotation);

    // 根据类型渲染
    switch (element.type) {
      case ElementType.RECTANGLE:
        this.renderRectangle(ctx, element);
        break;
      case ElementType.ELLIPSE:
        this.renderEllipse(ctx, element);
        break;
      case ElementType.TEXT:
        this.renderText(ctx, element);
        break;
      case ElementType.IMAGE:
        this.renderImage(ctx, element);
        break;
      // GROUP 暂时不渲染（后续实现）
    }

    ctx.restore();
  }

  /**
   * 渲染矩形
   */
  private renderRectangle(ctx: RenderContext, element: Element): void {
    const { width, height } = element.transform;
    const { fill, stroke, strokeWidth, opacity, borderRadius } = element.style;

    ctx.getRawContext().globalAlpha = opacity ?? 1;

    // 绘制矩形
    if (borderRadius && borderRadius > 0) {
      // 圆角矩形
      this.renderRoundedRect(ctx, -width / 2, -height / 2, width, height, borderRadius);
    } else {
      // 普通矩形
      ctx.beginPath();
      ctx.moveTo(-width / 2, -height / 2);
      ctx.lineTo(width / 2, -height / 2);
      ctx.lineTo(width / 2, height / 2);
      ctx.lineTo(-width / 2, height / 2);
      ctx.closePath();
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

  /**
   * 渲染椭圆
   */
  private renderEllipse(ctx: RenderContext, element: Element): void {
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

  /**
   * 渲染文字（基础版）
   */
  private renderText(ctx: RenderContext, element: Element): void {
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

  /**
   * 渲染图片（占位，后续实现）
   */
  private renderImage(ctx: RenderContext, element: Element): void {
    // TODO: 实现图片渲染
    const { width, height } = element.transform;
    ctx.setFillStyle('#cccccc');
    ctx.fillRect(-width / 2, -height / 2, width, height);
  }

  /**
   * 销毁渲染器
   */
  destroy(): void {
    this.stop();
    this.context = null;
  }
}

