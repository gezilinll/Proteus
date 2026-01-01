import { clamp } from '../utils/math';

/**
 * 视口状态
 * 管理画布的缩放和平移
 */
export class Viewport {
  /** 缩放比例（1.0 = 100%） */
  public zoom: number = 1.0;

  /** 水平偏移（像素） */
  public offsetX: number = 0;

  /** 垂直偏移（像素） */
  public offsetY: number = 0;

  /** 最小缩放 */
  public minZoom: number = 0.1;

  /** 最大缩放 */
  public maxZoom: number = 10;

  constructor(options?: {
    zoom?: number;
    offsetX?: number;
    offsetY?: number;
    minZoom?: number;
    maxZoom?: number;
  }) {
    if (options) {
      this.zoom = options.zoom ?? this.zoom;
      this.offsetX = options.offsetX ?? this.offsetX;
      this.offsetY = options.offsetY ?? this.offsetY;
      this.minZoom = options.minZoom ?? this.minZoom;
      this.maxZoom = options.maxZoom ?? this.maxZoom;
    }

    // 确保初始值在范围内
    this.zoom = clamp(this.zoom, this.minZoom, this.maxZoom);
  }

  /**
   * 设置缩放
   */
  setZoom(zoom: number, centerX?: number, centerY?: number): void {
    const oldZoom = this.zoom;
    this.zoom = clamp(zoom, this.minZoom, this.maxZoom);

    // 如果指定了中心点，调整偏移以保持该点在屏幕上的位置不变
    if (centerX !== undefined && centerY !== undefined) {
      const zoomRatio = this.zoom / oldZoom;
      this.offsetX = centerX - (centerX - this.offsetX) * zoomRatio;
      this.offsetY = centerY - (centerY - this.offsetY) * zoomRatio;
    }
  }

  /**
   * 缩放增量（相对于当前缩放）
   */
  zoomBy(delta: number, centerX?: number, centerY?: number): void {
    this.setZoom(this.zoom * delta, centerX, centerY);
  }

  /**
   * 设置偏移
   */
  setOffset(x: number, y: number): void {
    this.offsetX = x;
    this.offsetY = y;
  }

  /**
   * 偏移增量
   */
  offsetBy(deltaX: number, deltaY: number): void {
    this.offsetX += deltaX;
    this.offsetY += deltaY;
  }

  /**
   * 重置视口
   */
  reset(): void {
    this.zoom = 1.0;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  /**
   * 获取变换矩阵（用于 Canvas 变换）
   */
  getTransform(): {
    scaleX: number;
    scaleY: number;
    translateX: number;
    translateY: number;
  } {
    return {
      scaleX: this.zoom,
      scaleY: this.zoom,
      translateX: this.offsetX,
      translateY: this.offsetY,
    };
  }
}

