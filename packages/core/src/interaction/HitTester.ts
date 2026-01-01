import { Element } from '../types/element';
import { ElementType } from '../types/ElementType';
import { Scene } from '../scene/Scene';

/**
 * 命中测试结果
 */
export interface HitTestResult {
  element: Element;
  distance: number; // 用于排序，距离近的优先
}

/**
 * 命中测试器
 * 检测点是否命中元素
 */
export class HitTester {
  constructor(private scene: Scene) {}

  /**
   * 测试点是否命中元素
   * @param canvasX 画布 X 坐标
   * @param canvasY 画布 Y 坐标
   * @param options 选项
   */
  hitTest(
    canvasX: number,
    canvasY: number,
    options?: {
      /** 是否只测试可见元素 */
      visibleOnly?: boolean;
      /** 命中容差（像素） */
      tolerance?: number;
    }
  ): HitTestResult[] {
    const visibleOnly = options?.visibleOnly ?? true;
    const tolerance = options?.tolerance ?? 0;

    const results: HitTestResult[] = [];
    const elements = this.scene.getOrdered();

    // 从后往前遍历（上层元素优先）
    for (let i = elements.length - 1; i >= 0; i--) {
      const element = elements[i];

      if (visibleOnly && !element.meta.visible) continue;

      const hit = this.testElement(canvasX, canvasY, element, tolerance);
      if (hit) {
        const centerX = element.transform.x + element.transform.width / 2;
        const centerY = element.transform.y + element.transform.height / 2;
        const distance = Math.sqrt(
          (canvasX - centerX) ** 2 + (canvasY - centerY) ** 2
        );
        results.push({ element, distance });
      }
    }

    // 按距离排序（距离近的优先）
    results.sort((a, b) => a.distance - b.distance);

    return results;
  }

  /**
   * 测试单个元素
   */
  private testElement(
    canvasX: number,
    canvasY: number,
    element: Element,
    tolerance: number
  ): boolean {
    const { x, y, width, height, rotation } = element.transform;
    const centerX = x + width / 2;
    const centerY = y + height / 2;

    // 将点转换到元素局部坐标系（考虑旋转）
    const dx = canvasX - centerX;
    const dy = canvasY - centerY;

    let localX: number;
    let localY: number;

    if (rotation !== 0) {
      // 反向旋转到局部坐标系
      const cos = Math.cos(-rotation);
      const sin = Math.sin(-rotation);
      localX = dx * cos - dy * sin;
      localY = dx * sin + dy * cos;
    } else {
      localX = dx;
      localY = dy;
    }

    // 根据元素类型进行命中检测
    switch (element.type) {
      case ElementType.RECTANGLE:
        return this.testRectangle(localX, localY, width, height, tolerance);
      case ElementType.ELLIPSE:
        return this.testEllipse(localX, localY, width, height, tolerance);
      case ElementType.TEXT:
        return this.testRectangle(localX, localY, width, height, tolerance);
      case ElementType.IMAGE:
        return this.testRectangle(localX, localY, width, height, tolerance);
      default:
        return false;
    }
  }

  /**
   * 测试矩形（局部坐标系，已考虑旋转）
   */
  private testRectangle(
    localX: number,
    localY: number,
    width: number,
    height: number,
    tolerance: number
  ): boolean {
    const halfWidth = width / 2;
    const halfHeight = height / 2;

    return (
      localX >= -halfWidth - tolerance &&
      localX <= halfWidth + tolerance &&
      localY >= -halfHeight - tolerance &&
      localY <= halfHeight + tolerance
    );
  }

  /**
   * 测试椭圆（局部坐标系，已考虑旋转）
   */
  private testEllipse(
    localX: number,
    localY: number,
    width: number,
    height: number,
    tolerance: number
  ): boolean {
    const radiusX = width / 2;
    const radiusY = height / 2;

    // 椭圆方程: (x/a)² + (y/b)² <= 1
    const normalizedX = localX / (radiusX + tolerance);
    const normalizedY = localY / (radiusY + tolerance);

    return normalizedX * normalizedX + normalizedY * normalizedY <= 1;
  }

  /**
   * 测试框选（矩形区域）
   * @param startX 起始 X
   * @param startY 起始 Y
   * @param endX 结束 X
   * @param endY 结束 Y
   */
  testMarquee(
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ): Element[] {
    const left = Math.min(startX, endX);
    const top = Math.min(startY, endY);
    const right = Math.max(startX, endX);
    const bottom = Math.max(startY, endY);

    const results: Element[] = [];
    const elements = this.scene.getOrdered();

    for (const element of elements) {
      if (!element.meta.visible) continue;

      // 检查元素的边界框是否与框选区域相交
      const { x, y, width, height } = element.transform;
      const elementLeft = x;
      const elementTop = y;
      const elementRight = x + width;
      const elementBottom = y + height;

      // 矩形相交检测
      if (
        elementLeft < right &&
        elementRight > left &&
        elementTop < bottom &&
        elementBottom > top
      ) {
        results.push(element);
      }
    }

    return results;
  }
}

