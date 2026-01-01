import { ControlPoint } from '../renderer/overlays/SelectionOverlay';
import { SelectionOverlay } from '../renderer/overlays/SelectionOverlay';
import { Element } from '../types/element';
import { distance } from '../utils/math';

/**
 * 控制点命中测试结果
 */
export interface ControlPointHitResult {
  controlPoint: ControlPoint;
  distance: number;
}

/**
 * 控制点命中测试器
 * 检测点是否命中控制点
 */
export class ControlPointHitTester {
  private readonly HIT_TOLERANCE = 10; // 命中容差（像素）

  /**
   * 测试点是否命中控制点
   */
  hitTest(
    canvasX: number,
    canvasY: number,
    controlPoints: ControlPoint[]
  ): ControlPoint | null {
    let closest: ControlPoint | null = null;
    let minDistance = Infinity;

    for (const point of controlPoints) {
      const dist = distance(canvasX, canvasY, point.x, point.y);
      if (dist < this.HIT_TOLERANCE && dist < minDistance) {
        minDistance = dist;
        closest = point;
      }
    }

    return closest;
  }

  /**
   * 从选中元素计算控制点并测试命中
   */
  hitTestFromSelection(
    canvasX: number,
    canvasY: number,
    selectedElements: Element[]
  ): ControlPoint | null {
    if (selectedElements.length === 0) return null;

    const overlay = new SelectionOverlay();
    const selectionBox = overlay.computeSelectionBox(selectedElements);
    if (!selectionBox) return null;

    return this.hitTest(canvasX, canvasY, selectionBox.controlPoints);
  }
}

