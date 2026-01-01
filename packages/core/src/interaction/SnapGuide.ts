import { Element } from '../types/element';
import { boundsFromTransform } from '../types/bounds';

/**
 * 对齐线类型
 */
export enum GuideType {
  /** 垂直对齐线（X 坐标） */
  VERTICAL = 'vertical',
  /** 水平对齐线（Y 坐标） */
  HORIZONTAL = 'horizontal',
}

/**
 * 对齐线
 */
export interface Guide {
  type: GuideType;
  position: number; // X 或 Y 坐标
  /** 对齐的元素 ID（用于高亮） */
  elementIds: string[];
}

/**
 * 吸附结果
 */
export interface SnapResult {
  /** 是否吸附 */
  snapped: boolean;
  /** 吸附后的 X 坐标 */
  x: number;
  /** 吸附后的 Y 坐标 */
  y: number;
  /** 显示的对齐线 */
  guides: Guide[];
}

/**
 * 智能辅助线和吸附功能
 */
export class SnapGuide {
  private snapThreshold: number = 5; // 吸附阈值（像素）

  constructor(snapThresholdPixels: number = 5) {
    this.snapThreshold = snapThresholdPixels;
  }

  /**
   * 计算对齐线
   * @param draggedElements 正在拖拽的元素
   * @param allElements 场景中的所有元素（排除拖拽的元素）
   * @returns 对齐线列表
   */
  computeGuides(
    draggedElements: Element[],
    allElements: Element[]
  ): Guide[] {
    if (draggedElements.length === 0) return [];

    const guides: Guide[] = [];
    const draggedIds = new Set(draggedElements.map((el) => el.id));

    // 获取拖拽元素的边界框
    const draggedBounds = draggedElements.map((el) => boundsFromTransform(el.transform));
    const draggedLeft = Math.min(...draggedBounds.map((b) => b.left));
    const draggedRight = Math.max(...draggedBounds.map((b) => b.right));
    const draggedTop = Math.min(...draggedBounds.map((b) => b.top));
    const draggedBottom = Math.max(...draggedBounds.map((b) => b.bottom));
    const draggedCenterX = (draggedLeft + draggedRight) / 2;
    const draggedCenterY = (draggedTop + draggedBottom) / 2;

    // 检查其他元素的边缘和中心点
    for (const element of allElements) {
      if (draggedIds.has(element.id)) continue;

      const bounds = boundsFromTransform(element.transform);
      const elementLeft = bounds.left;
      const elementRight = bounds.right;
      const elementTop = bounds.top;
      const elementBottom = bounds.bottom;
      const elementCenterX = (elementLeft + elementRight) / 2;
      const elementCenterY = (elementTop + elementBottom) / 2;

      // 检查垂直对齐线（左、右、中心）
      const verticalPositions = [elementLeft, elementRight, elementCenterX];
      for (const pos of verticalPositions) {
        if (
          Math.abs(draggedLeft - pos) < this.snapThreshold ||
          Math.abs(draggedRight - pos) < this.snapThreshold ||
          Math.abs(draggedCenterX - pos) < this.snapThreshold
        ) {
          guides.push({
            type: GuideType.VERTICAL,
            position: pos,
            elementIds: [element.id],
          });
        }
      }

      // 检查水平对齐线（上、下、中心）
      const horizontalPositions = [elementTop, elementBottom, elementCenterY];
      for (const pos of horizontalPositions) {
        if (
          Math.abs(draggedTop - pos) < this.snapThreshold ||
          Math.abs(draggedBottom - pos) < this.snapThreshold ||
          Math.abs(draggedCenterY - pos) < this.snapThreshold
        ) {
          guides.push({
            type: GuideType.HORIZONTAL,
            position: pos,
            elementIds: [element.id],
          });
        }
      }
    }

    // 去重（相同位置的对齐线合并）
    const uniqueGuides = new Map<string, Guide>();
    for (const guide of guides) {
      const key = `${guide.type}-${guide.position}`;
      if (!uniqueGuides.has(key)) {
        uniqueGuides.set(key, guide);
      } else {
        // 合并元素 ID
        const existing = uniqueGuides.get(key)!;
        existing.elementIds.push(...guide.elementIds);
      }
    }

    return Array.from(uniqueGuides.values());
  }

  /**
   * 计算吸附位置
   * @param x 当前 X 坐标
   * @param y 当前 Y 坐标
   * @param draggedElements 正在拖拽的元素
   * @param allElements 场景中的所有元素（排除拖拽的元素）
   * @returns 吸附结果
   */
  snap(
    x: number,
    y: number,
    draggedElements: Element[],
    allElements: Element[]
  ): SnapResult {
    if (draggedElements.length === 0) {
      return {
        snapped: false,
        x,
        y,
        guides: [],
      };
    }

    // 获取拖拽元素的边界框
    const draggedBounds = draggedElements.map((el) => boundsFromTransform(el.transform));
    const draggedWidth = draggedBounds[0].width;
    const draggedHeight = draggedBounds[0].height;
    const draggedLeft = x;
    const draggedRight = x + draggedWidth;
    const draggedTop = y;
    const draggedBottom = y + draggedHeight;
    const draggedCenterX = (draggedLeft + draggedRight) / 2;
    const draggedCenterY = (draggedTop + draggedBottom) / 2;

    let snappedX = x;
    let snappedY = y;
    let snapped = false;
    const guides: Guide[] = [];
    const draggedIds = new Set(draggedElements.map((el) => el.id));

    // 检查其他元素的边缘和中心点
    for (const element of allElements) {
      if (draggedIds.has(element.id)) continue;

      const bounds = boundsFromTransform(element.transform);
      const elementLeft = bounds.left;
      const elementRight = bounds.right;
      const elementTop = bounds.top;
      const elementBottom = bounds.bottom;
      const elementCenterX = (elementLeft + elementRight) / 2;
      const elementCenterY = (elementTop + elementBottom) / 2;

      // 检查垂直对齐（左、右、中心）
      const verticalPositions = [
        { pos: elementLeft, name: 'left' },
        { pos: elementRight, name: 'right' },
        { pos: elementCenterX, name: 'center' },
      ];

      for (const { pos } of verticalPositions) {
        // 检查左边缘对齐
        if (Math.abs(draggedLeft - pos) < this.snapThreshold) {
          snappedX = pos;
          snapped = true;
          guides.push({
            type: GuideType.VERTICAL,
            position: pos,
            elementIds: [element.id],
          });
        }
        // 检查右边缘对齐
        else if (Math.abs(draggedRight - pos) < this.snapThreshold) {
          snappedX = pos - draggedWidth;
          snapped = true;
          guides.push({
            type: GuideType.VERTICAL,
            position: pos,
            elementIds: [element.id],
          });
        }
        // 检查中心对齐
        else if (Math.abs(draggedCenterX - pos) < this.snapThreshold) {
          snappedX = pos - draggedWidth / 2;
          snapped = true;
          guides.push({
            type: GuideType.VERTICAL,
            position: pos,
            elementIds: [element.id],
          });
        }
      }

      // 检查水平对齐（上、下、中心）
      const horizontalPositions = [
        { pos: elementTop, name: 'top' },
        { pos: elementBottom, name: 'bottom' },
        { pos: elementCenterY, name: 'center' },
      ];

      for (const { pos } of horizontalPositions) {
        // 检查上边缘对齐
        if (Math.abs(draggedTop - pos) < this.snapThreshold) {
          snappedY = pos;
          snapped = true;
          guides.push({
            type: GuideType.HORIZONTAL,
            position: pos,
            elementIds: [element.id],
          });
        }
        // 检查下边缘对齐
        else if (Math.abs(draggedBottom - pos) < this.snapThreshold) {
          snappedY = pos - draggedHeight;
          snapped = true;
          guides.push({
            type: GuideType.HORIZONTAL,
            position: pos,
            elementIds: [element.id],
          });
        }
        // 检查中心对齐
        else if (Math.abs(draggedCenterY - pos) < this.snapThreshold) {
          snappedY = pos - draggedHeight / 2;
          snapped = true;
          guides.push({
            type: GuideType.HORIZONTAL,
            position: pos,
            elementIds: [element.id],
          });
        }
      }
    }

    // 去重对齐线
    const uniqueGuides = new Map<string, Guide>();
    for (const guide of guides) {
      const key = `${guide.type}-${guide.position}`;
      if (!uniqueGuides.has(key)) {
        uniqueGuides.set(key, guide);
      } else {
        const existing = uniqueGuides.get(key)!;
        existing.elementIds.push(...guide.elementIds);
      }
    }

    return {
      snapped,
      x: snappedX,
      y: snappedY,
      guides: Array.from(uniqueGuides.values()),
    };
  }
}

