/**
 * 边界框（用于碰撞检测、选择框等）
 */
export interface Bounds {
  /** 左边界 */
  left: number;
  /** 上边界 */
  top: number;
  /** 右边界 */
  right: number;
  /** 下边界 */
  bottom: number;
  /** 宽度 */
  width: number;
  /** 高度 */
  height: number;
}

/**
 * 从变换信息计算边界框
 */
export function boundsFromTransform(transform: { x: number; y: number; width: number; height: number }): Bounds {
  return {
    left: transform.x,
    top: transform.y,
    right: transform.x + transform.width,
    bottom: transform.y + transform.height,
    width: transform.width,
    height: transform.height,
  };
}

/**
 * 合并多个边界框
 */
export function mergeBounds(...bounds: Bounds[]): Bounds | null {
  if (bounds.length === 0) return null;

  let minLeft = bounds[0].left;
  let minTop = bounds[0].top;
  let maxRight = bounds[0].right;
  let maxBottom = bounds[0].bottom;

  for (let i = 1; i < bounds.length; i++) {
    minLeft = Math.min(minLeft, bounds[i].left);
    minTop = Math.min(minTop, bounds[i].top);
    maxRight = Math.max(maxRight, bounds[i].right);
    maxBottom = Math.max(maxBottom, bounds[i].bottom);
  }

  return {
    left: minLeft,
    top: minTop,
    right: maxRight,
    bottom: maxBottom,
    width: maxRight - minLeft,
    height: maxBottom - minTop,
  };
}

