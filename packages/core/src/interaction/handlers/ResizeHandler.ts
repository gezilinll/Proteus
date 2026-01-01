import { Transform } from '../../types/transform';
import { UpdateElementCommand } from '../../command/commands/UpdateElementCommand';
import { BatchCommand } from '../../command/commands/BatchCommand';
import { Scene } from '../../scene/Scene';
import { ControlPointType } from '../../renderer/overlays/SelectionOverlay';
import { Bounds, boundsFromTransform } from '../../types/bounds';

/**
 * 缩放处理器
 */
export class ResizeHandler {
  private startBounds: Map<string, Bounds> = new Map();
  private startMousePos: { x: number; y: number } | null = null;
  private controlPoint: ControlPointType | null = null;
  private keepAspectRatio: boolean = false;
  private fromCenter: boolean = false;

  constructor(private scene: Scene) {}

  /**
   * 开始缩放
   */
  start(
    elementIds: string[],
    controlPoint: ControlPointType,
    mouseX: number,
    mouseY: number,
    options?: {
      keepAspectRatio?: boolean;
      fromCenter?: boolean;
    }
  ): void {
    this.controlPoint = controlPoint;
    this.startMousePos = { x: mouseX, y: mouseY };
    this.keepAspectRatio = options?.keepAspectRatio ?? false;
    this.fromCenter = options?.fromCenter ?? false;
    this.startBounds.clear();

    // 保存每个元素的初始边界框
    for (const id of elementIds) {
      const element = this.scene.get(id);
      if (element) {
        this.startBounds.set(id, boundsFromTransform(element.transform));
      }
    }
  }

  /**
   * 更新缩放
   */
  update(mouseX: number, mouseY: number): void {
    if (!this.startMousePos || !this.controlPoint) return;

    const deltaX = mouseX - this.startMousePos.x;
    const deltaY = mouseY - this.startMousePos.y;

    for (const [id, startBounds] of this.startBounds) {
      const element = this.scene.get(id);
      if (!element) continue;

      const newTransform = this.calculateResize(
        startBounds,
        deltaX,
        deltaY,
        this.controlPoint
      );

      this.scene.update(id, {
        transform: newTransform,
      });
    }
  }

  /**
   * 计算缩放后的变换
   */
  private calculateResize(
    startBounds: Bounds,
    deltaX: number,
    deltaY: number,
    controlPoint: ControlPointType
  ): Transform {
    let newLeft = startBounds.left;
    let newTop = startBounds.top;
    let newWidth = startBounds.width;
    let newHeight = startBounds.height;

    switch (controlPoint) {
      case ControlPointType.RESIZE_NW:
        newLeft = startBounds.left + deltaX;
        newTop = startBounds.top + deltaY;
        newWidth = startBounds.width - deltaX;
        newHeight = startBounds.height - deltaY;
        break;
      case ControlPointType.RESIZE_N:
        newTop = startBounds.top + deltaY;
        newHeight = startBounds.height - deltaY;
        break;
      case ControlPointType.RESIZE_NE:
        newTop = startBounds.top + deltaY;
        newWidth = startBounds.width + deltaX;
        newHeight = startBounds.height - deltaY;
        break;
      case ControlPointType.RESIZE_E:
        newWidth = startBounds.width + deltaX;
        break;
      case ControlPointType.RESIZE_SE:
        newWidth = startBounds.width + deltaX;
        newHeight = startBounds.height + deltaY;
        break;
      case ControlPointType.RESIZE_S:
        newHeight = startBounds.height + deltaY;
        break;
      case ControlPointType.RESIZE_SW:
        newLeft = startBounds.left + deltaX;
        newWidth = startBounds.width - deltaX;
        newHeight = startBounds.height + deltaY;
        break;
      case ControlPointType.RESIZE_W:
        newLeft = startBounds.left + deltaX;
        newWidth = startBounds.width - deltaX;
        break;
    }

    // 保持宽高比
    if (this.keepAspectRatio) {
      const aspectRatio = startBounds.width / startBounds.height;
      const isNorth = controlPoint.includes('N') || controlPoint === ControlPointType.RESIZE_N;
      const isWest = controlPoint.includes('W') || controlPoint === ControlPointType.RESIZE_W;
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        newHeight = newWidth / aspectRatio;
        // 调整位置以保持锚点
        if (isNorth) {
          newTop = startBounds.top + startBounds.height - newHeight;
        }
        if (isWest) {
          newLeft = startBounds.left + startBounds.width - newWidth;
        }
      } else {
        newWidth = newHeight * aspectRatio;
        // 调整位置以保持锚点
        if (isNorth) {
          newTop = startBounds.top + startBounds.height - newHeight;
        }
        if (isWest) {
          newLeft = startBounds.left + startBounds.width - newWidth;
        }
      }
    }

    // 从中心缩放
    if (this.fromCenter) {
      const widthDelta = newWidth - startBounds.width;
      const heightDelta = newHeight - startBounds.height;
      newLeft = startBounds.left - widthDelta / 2;
      newTop = startBounds.top - heightDelta / 2;
    }

    // 确保最小尺寸
    const minSize = 10;
    const isNorth = controlPoint.includes('N') || controlPoint === ControlPointType.RESIZE_N;
    const isWest = controlPoint.includes('W') || controlPoint === ControlPointType.RESIZE_W;
    
    if (newWidth < minSize) {
      newWidth = minSize;
      if (isWest) {
        newLeft = startBounds.right - minSize;
      }
    }
    if (newHeight < minSize) {
      newHeight = minSize;
      if (isNorth) {
        newTop = startBounds.bottom - minSize;
      }
    }

    return {
      x: newLeft,
      y: newTop,
      width: newWidth,
      height: newHeight,
      rotation: 0, // 缩放不改变旋转
    };
  }

  /**
   * 完成缩放，生成命令
   */
  finish(): UpdateElementCommand | BatchCommand | null {
    if (this.startBounds.size === 0) return null;

    const commands: UpdateElementCommand[] = [];

    for (const [id, startBounds] of this.startBounds) {
      const element = this.scene.get(id);
      if (!element) continue;

      // 先恢复到开始位置
      const startTransform: Transform = {
        x: startBounds.left,
        y: startBounds.top,
        width: startBounds.width,
        height: startBounds.height,
        rotation: element.transform.rotation,
      };
      this.scene.update(id, {
        transform: startTransform,
      }, true);

      // 创建命令
      const command = new UpdateElementCommand(
        this.scene,
        id,
        {
          transform: element.transform,
        }
      );

      commands.push(command);
    }

    if (commands.length === 0) return null;

    if (commands.length === 1) {
      return commands[0];
    }

    return new BatchCommand(commands);
  }

  /**
   * 取消缩放
   */
  cancel(): void {
    for (const [id, startBounds] of this.startBounds) {
      const element = this.scene.get(id);
      if (!element) continue;

      const startTransform: Transform = {
        x: startBounds.left,
        y: startBounds.top,
        width: startBounds.width,
        height: startBounds.height,
        rotation: element.transform.rotation,
      };
      this.scene.update(id, {
        transform: startTransform,
      });
    }

    this.startBounds.clear();
    this.startMousePos = null;
    this.controlPoint = null;
  }

  /**
   * 检查是否在缩放中
   */
  isActive(): boolean {
    return this.startBounds.size > 0;
  }
}

