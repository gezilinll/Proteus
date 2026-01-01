/**
 * 渲染上下文
 * 封装 Canvas 2D 上下文，提供统一的渲染接口
 */
export class RenderContext {
  constructor(private ctx: CanvasRenderingContext2D) {}

  /**
   * 保存当前状态
   */
  save(): void {
    this.ctx.save();
  }

  /**
   * 恢复之前的状态
   */
  restore(): void {
    this.ctx.restore();
  }

  /**
   * 清空画布
   */
  clear(width: number, height: number): void {
    this.ctx.clearRect(0, 0, width, height);
  }

  /**
   * 应用变换矩阵
   */
  setTransform(
    scaleX: number,
    scaleY: number,
    translateX: number,
    translateY: number
  ): void {
    this.ctx.setTransform(scaleX, 0, 0, scaleY, translateX, translateY);
  }

  /**
   * 重置变换
   */
  resetTransform(): void {
    this.ctx.resetTransform();
  }

  /**
   * 获取原始 Canvas 上下文（用于高级操作）
   */
  getRawContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  /**
   * 设置填充样式
   */
  setFillStyle(style: string | CanvasGradient | CanvasPattern): void {
    this.ctx.fillStyle = style;
  }

  /**
   * 设置描边样式
   */
  setStrokeStyle(style: string | CanvasGradient | CanvasPattern): void {
    this.ctx.strokeStyle = style;
  }

  /**
   * 设置线宽
   */
  setLineWidth(width: number): void {
    this.ctx.lineWidth = width;
  }

  /**
   * 填充矩形
   */
  fillRect(x: number, y: number, width: number, height: number): void {
    this.ctx.fillRect(x, y, width, height);
  }

  /**
   * 描边矩形
   */
  strokeRect(x: number, y: number, width: number, height: number): void {
    this.ctx.strokeRect(x, y, width, height);
  }

  /**
   * 开始路径
   */
  beginPath(): void {
    this.ctx.beginPath();
  }

  /**
   * 移动到点
   */
  moveTo(x: number, y: number): void {
    this.ctx.moveTo(x, y);
  }

  /**
   * 画线到点
   */
  lineTo(x: number, y: number): void {
    this.ctx.lineTo(x, y);
  }

  /**
   * 画弧
   */
  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void {
    this.ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise ?? false);
  }

  /**
   * 填充路径
   */
  fill(): void {
    this.ctx.fill();
  }

  /**
   * 描边路径
   */
  stroke(): void {
    this.ctx.stroke();
  }

  /**
   * 闭合路径
   */
  closePath(): void {
    this.ctx.closePath();
  }
}

