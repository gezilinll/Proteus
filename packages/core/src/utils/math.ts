/**
 * 数学工具函数
 * 用于坐标转换、几何计算等
 */

/**
 * 屏幕坐标转画布坐标
 * @param screenX 屏幕 X 坐标
 * @param screenY 屏幕 Y 坐标
 * @param viewport 视口状态
 */
export function screenToCanvas(
  screenX: number,
  screenY: number,
  viewport: { zoom: number; offsetX: number; offsetY: number }
): { x: number; y: number } {
  return {
    x: (screenX - viewport.offsetX) / viewport.zoom,
    y: (screenY - viewport.offsetY) / viewport.zoom,
  };
}

/**
 * 画布坐标转屏幕坐标
 * @param canvasX 画布 X 坐标
 * @param canvasY 画布 Y 坐标
 * @param viewport 视口状态
 */
export function canvasToScreen(
  canvasX: number,
  canvasY: number,
  viewport: { zoom: number; offsetX: number; offsetY: number }
): { x: number; y: number } {
  return {
    x: canvasX * viewport.zoom + viewport.offsetX,
    y: canvasY * viewport.zoom + viewport.offsetY,
  };
}

/**
 * 限制值在范围内
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * 线性插值
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * 计算两点距离
 */
export function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

