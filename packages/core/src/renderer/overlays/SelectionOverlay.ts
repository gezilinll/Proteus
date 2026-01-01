import { RenderContext } from '../RenderContext';
import { Bounds, mergeBounds, boundsFromTransform } from '../../types/bounds';
import { Element } from '../../types/element';

/**
 * 控制点类型
 */
export enum ControlPointType {
  /** 左上角 */
  RESIZE_NW = 'resize-nw',
  /** 上边中点 */
  RESIZE_N = 'resize-n',
  /** 右上角 */
  RESIZE_NE = 'resize-ne',
  /** 右边中点 */
  RESIZE_E = 'resize-e',
  /** 右下角 */
  RESIZE_SE = 'resize-se',
  /** 下边中点 */
  RESIZE_S = 'resize-s',
  /** 左下角 */
  RESIZE_SW = 'resize-sw',
  /** 左边中点 */
  RESIZE_W = 'resize-w',
  /** 旋转控制点 */
  ROTATE = 'rotate',
}

/**
 * 控制点
 */
export interface ControlPoint {
  x: number;
  y: number;
  type: ControlPointType;
}

/**
 * 选择框数据
 */
export interface SelectionBox {
  /** 边界框 */
  bounds: Bounds;
  /** 旋转角度（弧度），仅单选时有效 */
  rotation: number;
  /** 控制点列表 */
  controlPoints: ControlPoint[];
}

/**
 * 选择框渲染器
 */
export class SelectionOverlay {
  private readonly CONTROL_POINT_SIZE = 8; // 固定大小（像素）
  private readonly SELECTION_STROKE_WIDTH = 2;
  private readonly SELECTION_COLOR = '#3b82f6'; // 蓝色
  private readonly ROTATE_POINT_OFFSET = 20; // 旋转控制点距离选择框的距离

  /**
   * 计算选择框数据
   */
  computeSelectionBox(elements: Element[]): SelectionBox | null {
    if (elements.length === 0) return null;

    // 单选：显示单个元素的边界框和旋转
    if (elements.length === 1) {
      return this.computeSingleSelectionBox(elements[0]);
    }

    // 多选：显示合并边界框（无旋转）
    return this.computeMultiSelectionBox(elements);
  }

  /**
   * 计算单选选择框
   */
  private computeSingleSelectionBox(element: Element): SelectionBox {
    const bounds = boundsFromTransform(element.transform);
    const { rotation } = element.transform;
    const controlPoints = this.computeControlPoints(bounds, rotation);

    return {
      bounds,
      rotation,
      controlPoints,
    };
  }

  /**
   * 计算多选选择框
   */
  private computeMultiSelectionBox(elements: Element[]): SelectionBox {
    const boundsList = elements.map((el) => boundsFromTransform(el.transform));
    const mergedBounds = mergeBounds(...boundsList);

    if (!mergedBounds) {
      // 理论上不会发生，但为了类型安全
      return {
        bounds: { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 },
        rotation: 0,
        controlPoints: [],
      };
    }

    const controlPoints = this.computeControlPoints(mergedBounds, 0);

    return {
      bounds: mergedBounds,
      rotation: 0,
      controlPoints,
    };
  }

  /**
   * 计算控制点
   */
  private computeControlPoints(bounds: Bounds, rotation: number): ControlPoint[] {
    const { left, top, right, bottom } = bounds;
    const centerX = (left + right) / 2;
    const centerY = (top + bottom) / 2;

    const points: ControlPoint[] = [
      // 8 个缩放控制点
      { x: left, y: top, type: ControlPointType.RESIZE_NW },
      { x: centerX, y: top, type: ControlPointType.RESIZE_N },
      { x: right, y: top, type: ControlPointType.RESIZE_NE },
      { x: right, y: centerY, type: ControlPointType.RESIZE_E },
      { x: right, y: bottom, type: ControlPointType.RESIZE_SE },
      { x: centerX, y: bottom, type: ControlPointType.RESIZE_S },
      { x: left, y: bottom, type: ControlPointType.RESIZE_SW },
      { x: left, y: centerY, type: ControlPointType.RESIZE_W },
    ];

    // 旋转控制点（始终显示，用于旋转操作）
    const rotatePointY = top - this.ROTATE_POINT_OFFSET;
    
    // 如果有旋转，需要旋转控制点
    if (rotation !== 0) {
      const cos = Math.cos(rotation);
      const sin = Math.sin(rotation);
      // 相对于中心的偏移
      const dx = 0; // 中心点 x 偏移为 0
      const dy = rotatePointY - centerY; // y 偏移
      const rotatedX = centerX + dx * cos - dy * sin;
      const rotatedY = centerY + dx * sin + dy * cos;
      points.push({ x: rotatedX, y: rotatedY, type: ControlPointType.ROTATE });
    } else {
      points.push({ x: centerX, y: rotatePointY, type: ControlPointType.ROTATE });
    }

    return points;
  }

  /**
   * 渲染选择框
   */
  render(ctx: RenderContext, selectionBox: SelectionBox): void {
    const { bounds, rotation, controlPoints } = selectionBox;

    ctx.save();

    // 应用旋转（如果有）
    if (rotation !== 0) {
      const centerX = (bounds.left + bounds.right) / 2;
      const centerY = (bounds.top + bounds.bottom) / 2;
      ctx.getRawContext().translate(centerX, centerY);
      ctx.getRawContext().rotate(rotation);
      ctx.getRawContext().translate(-centerX, -centerY);
    }

    // 渲染边界框
    this.renderBounds(ctx, bounds);

    ctx.restore();

    // 渲染控制点（不受旋转影响，使用原始坐标）
    this.renderControlPoints(ctx, controlPoints);
  }

  /**
   * 渲染边界框
   */
  private renderBounds(ctx: RenderContext, bounds: Bounds): void {
    const { left, top, width, height } = bounds;

    ctx.getRawContext().strokeStyle = this.SELECTION_COLOR;
    ctx.getRawContext().lineWidth = this.SELECTION_STROKE_WIDTH;
    ctx.getRawContext().setLineDash([5, 5]); // 虚线

    ctx.beginPath();
    ctx.rect(left, top, width, height);
    ctx.stroke();

    // 重置虚线
    ctx.getRawContext().setLineDash([]);
  }

  /**
   * 渲染控制点
   */
  private renderControlPoints(ctx: RenderContext, controlPoints: ControlPoint[]): void {
    const size = this.CONTROL_POINT_SIZE;
    const halfSize = size / 2;

    ctx.getRawContext().fillStyle = this.SELECTION_COLOR;

    for (const point of controlPoints) {
      if (point.type === ControlPointType.ROTATE) {
        // 旋转控制点：圆形
        ctx.beginPath();
        ctx.arc(point.x, point.y, halfSize, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // 缩放控制点：方形
        ctx.fillRect(point.x - halfSize, point.y - halfSize, size, size);
      }
    }
  }
}

