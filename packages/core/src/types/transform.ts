/**
 * 元素变换信息
 */
export interface Transform {
  /** X 坐标 */
  x: number;
  /** Y 坐标 */
  y: number;
  /** 宽度 */
  width: number;
  /** 高度 */
  height: number;
  /** 旋转角度（弧度） */
  rotation: number;
}

/**
 * 创建默认变换
 */
export function createTransform(
  x: number = 0,
  y: number = 0,
  width: number = 100,
  height: number = 100,
  rotation: number = 0
): Transform {
  return { x, y, width, height, rotation };
}

