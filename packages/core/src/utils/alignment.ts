import { Element } from '../types/element';
import { boundsFromTransform } from '../types/bounds';

/**
 * 对齐方式
 */
export enum AlignmentType {
  /** 左对齐 */
  LEFT = 'left',
  /** 右对齐 */
  RIGHT = 'right',
  /** 水平居中 */
  CENTER_H = 'center-h',
  /** 上对齐 */
  TOP = 'top',
  /** 下对齐 */
  BOTTOM = 'bottom',
  /** 垂直居中 */
  CENTER_V = 'center-v',
}

/**
 * 分布方式
 */
export enum DistributionType {
  /** 水平等距分布 */
  HORIZONTAL = 'horizontal',
  /** 垂直等距分布 */
  VERTICAL = 'vertical',
}

/**
 * 计算多个元素的边界框
 */
export function getElementsBounds(elements: Element[]): {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
} {
  if (elements.length === 0) {
    return {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      width: 0,
      height: 0,
      centerX: 0,
      centerY: 0,
    };
  }

  const bounds = elements.map((el) => boundsFromTransform(el.transform));
  const left = Math.min(...bounds.map((b) => b.left));
  const top = Math.min(...bounds.map((b) => b.top));
  const right = Math.max(...bounds.map((b) => b.right));
  const bottom = Math.max(...bounds.map((b) => b.bottom));

  return {
    left,
    top,
    right,
    bottom,
    width: right - left,
    height: bottom - top,
    centerX: (left + right) / 2,
    centerY: (top + bottom) / 2,
  };
}

/**
 * 对齐元素
 * @param elements 要对齐的元素
 * @param alignment 对齐方式
 * @param referenceBounds 参考边界框（可选，默认使用所有元素的边界框）
 * @returns 更新后的元素变换信息
 */
export function alignElements(
  elements: Element[],
  alignment: AlignmentType,
  referenceBounds?: {
    left: number;
    top: number;
    right: number;
    bottom: number;
    centerX: number;
    centerY: number;
  }
): Map<string, { x: number; y: number }> {
  if (elements.length === 0) {
    return new Map();
  }

  const bounds = referenceBounds ?? getElementsBounds(elements);
  const updates = new Map<string, { x: number; y: number }>();

  for (const element of elements) {
    const { width, height } = element.transform;
    let newX = element.transform.x;
    let newY = element.transform.y;

    switch (alignment) {
      case AlignmentType.LEFT:
        newX = bounds.left;
        break;
      case AlignmentType.RIGHT:
        newX = bounds.right - width;
        break;
      case AlignmentType.CENTER_H:
        newX = bounds.centerX - width / 2;
        break;
      case AlignmentType.TOP:
        newY = bounds.top;
        break;
      case AlignmentType.BOTTOM:
        newY = bounds.bottom - height;
        break;
      case AlignmentType.CENTER_V:
        newY = bounds.centerY - height / 2;
        break;
    }

    updates.set(element.id, { x: newX, y: newY });
  }

  return updates;
}

/**
 * 分布元素
 * @param elements 要分布的元素（需要至少 3 个元素）
 * @param distribution 分布方式
 * @returns 更新后的元素变换信息
 */
export function distributeElements(
  elements: Element[],
  distribution: DistributionType
): Map<string, { x: number; y: number }> {
  if (elements.length < 3) {
    return new Map();
  }

  const updates = new Map<string, { x: number; y: number }>();

  if (distribution === DistributionType.HORIZONTAL) {
    // 按 X 坐标排序（使用中心点）
    const sorted = [...elements].sort((a, b) => {
      const aCenterX = a.transform.x + a.transform.width / 2;
      const bCenterX = b.transform.x + b.transform.width / 2;
      return aCenterX - bCenterX;
    });

    const firstCenterX = sorted[0].transform.x + sorted[0].transform.width / 2;
    const lastCenterX = sorted[sorted.length - 1].transform.x + sorted[sorted.length - 1].transform.width / 2;
    const startX = firstCenterX;
    const endX = lastCenterX;
    const totalDistance = endX - startX;

    // 计算每个元素之间的间距
    const spacing = totalDistance / (sorted.length - 1);

    for (let i = 0; i < sorted.length; i++) {
      const element = sorted[i];
      const targetCenterX = startX + spacing * i;
      const newX = targetCenterX - element.transform.width / 2;
      updates.set(element.id, { x: newX, y: element.transform.y });
    }
  } else {
    // 按 Y 坐标排序（使用中心点）
    const sorted = [...elements].sort((a, b) => {
      const aCenterY = a.transform.y + a.transform.height / 2;
      const bCenterY = b.transform.y + b.transform.height / 2;
      return aCenterY - bCenterY;
    });

    const firstCenterY = sorted[0].transform.y + sorted[0].transform.height / 2;
    const lastCenterY = sorted[sorted.length - 1].transform.y + sorted[sorted.length - 1].transform.height / 2;
    const startY = firstCenterY;
    const endY = lastCenterY;
    const totalDistance = endY - startY;

    // 计算每个元素之间的间距
    const spacing = totalDistance / (sorted.length - 1);

    for (let i = 0; i < sorted.length; i++) {
      const element = sorted[i];
      const targetCenterY = startY + spacing * i;
      const newY = targetCenterY - element.transform.height / 2;
      updates.set(element.id, { x: element.transform.x, y: newY });
    }
  }

  return updates;
}

