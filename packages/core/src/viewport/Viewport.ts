import { clamp } from '../utils/math';
import { EventEmitter } from '../utils/EventEmitter';

/**
 * Viewport 事件类型
 */
export interface ViewportEvents {
  zoomChanged: [zoom: number];
  offsetChanged: [offsetX: number, offsetY: number];
  [key: string]: unknown[];
}

/**
 * 视口状态
 * 管理画布的缩放和平移
 */
export class Viewport extends EventEmitter<ViewportEvents> {
  /** 缩放比例（1.0 = 100%） */
  private _zoom: number = 1.0;

  /** 水平偏移（像素） */
  private _offsetX: number = 0;

  /** 垂直偏移（像素） */
  private _offsetY: number = 0;

  /** 最小缩放 */
  public minZoom: number = 0.02;

  /** 最大缩放 */
  public maxZoom: number = 5;

  constructor(options?: {
    zoom?: number;
    offsetX?: number;
    offsetY?: number;
    minZoom?: number;
    maxZoom?: number;
  }) {
    super();
    if (options) {
      this._zoom = options.zoom ?? this._zoom;
      this._offsetX = options.offsetX ?? this._offsetX;
      this._offsetY = options.offsetY ?? this._offsetY;
      this.minZoom = options.minZoom ?? this.minZoom;
      this.maxZoom = options.maxZoom ?? this.maxZoom;
    }

    // 确保初始值在范围内
    this._zoom = clamp(this._zoom, this.minZoom, this.maxZoom);
  }

  /** 获取缩放比例 */
  get zoom(): number {
    return this._zoom;
  }

  /** 获取水平偏移 */
  get offsetX(): number {
    return this._offsetX;
  }

  /** 获取垂直偏移 */
  get offsetY(): number {
    return this._offsetY;
  }

  /**
   * 设置缩放
   */
  setZoom(zoom: number, centerX?: number, centerY?: number): void {
    const oldZoom = this._zoom;
    const oldOffsetX = this._offsetX;
    const oldOffsetY = this._offsetY;
    
    this._zoom = clamp(zoom, this.minZoom, this.maxZoom);

    // 如果指定了中心点，调整偏移以保持该点在屏幕上的位置不变
    if (centerX !== undefined && centerY !== undefined && this._zoom !== oldZoom) {
      const zoomRatio = this._zoom / oldZoom;
      this._offsetX = centerX - (centerX - oldOffsetX) * zoomRatio;
      this._offsetY = centerY - (centerY - oldOffsetY) * zoomRatio;
    }

    if (this._zoom !== oldZoom) {
      this.emit('zoomChanged', this._zoom);
      // 同时发出 offset 变化事件
      if (this._offsetX !== oldOffsetX || this._offsetY !== oldOffsetY) {
        this.emit('offsetChanged', this._offsetX, this._offsetY);
      }
    }
  }

  /**
   * 缩放增量（相对于当前缩放）
   */
  zoomBy(delta: number, centerX?: number, centerY?: number): void {
    this.setZoom(this._zoom * delta, centerX, centerY);
  }

  /**
   * 设置偏移
   */
  setOffset(x: number, y: number): void {
    const changed = this._offsetX !== x || this._offsetY !== y;
    this._offsetX = x;
    this._offsetY = y;
    if (changed) {
      this.emit('offsetChanged', this._offsetX, this._offsetY);
    }
  }

  /**
   * 偏移增量
   */
  offsetBy(deltaX: number, deltaY: number): void {
    this.setOffset(this._offsetX + deltaX, this._offsetY + deltaY);
  }

  /**
   * 重置视口
   */
  reset(): void {
    this._zoom = 1.0;
    this._offsetX = 0;
    this._offsetY = 0;
    this.emit('zoomChanged', this._zoom);
    this.emit('offsetChanged', this._offsetX, this._offsetY);
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
      scaleX: this._zoom,
      scaleY: this._zoom,
      translateX: this._offsetX,
      translateY: this._offsetY,
    };
  }
}
