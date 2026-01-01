import { UpdateElementCommand } from '../../command/commands/UpdateElementCommand';
import { BatchCommand } from '../../command/commands/BatchCommand';
import { Scene } from '../../scene/Scene';
import { boundsFromTransform } from '../../types/bounds';

/**
 * 旋转处理器
 */
export class RotateHandler {
  private startRotations: Map<string, number> = new Map();
  private startMousePos: { x: number; y: number } | null = null;
  private startAngles: Map<string, number> = new Map(); // 每个元素中心到鼠标的初始角度
  private snapToAngle: boolean = false;
  private snapStep: number = Math.PI / 12; // 15度

  constructor(private scene: Scene) {}

  /**
   * 开始旋转
   */
  start(
    elementIds: string[],
    mouseX: number,
    mouseY: number,
    options?: {
      snapToAngle?: boolean;
    }
  ): void {
    this.startMousePos = { x: mouseX, y: mouseY };
    this.snapToAngle = options?.snapToAngle ?? false;
    this.startRotations.clear();
    this.startAngles.clear();

    // 保存每个元素的初始旋转角度和初始鼠标角度
    for (const id of elementIds) {
      const element = this.scene.get(id);
      if (!element) continue;

      const bounds = boundsFromTransform(element.transform);
      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;

      this.startRotations.set(id, element.transform.rotation);
      this.startAngles.set(id, Math.atan2(mouseY - centerY, mouseX - centerX));
    }
  }

  /**
   * 更新旋转
   */
  update(mouseX: number, mouseY: number): void {
    if (!this.startMousePos) return;

    for (const [id, startRotation] of this.startRotations) {
      const element = this.scene.get(id);
      if (!element) continue;

      const bounds = boundsFromTransform(element.transform);
      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;

      const startAngle = this.startAngles.get(id) ?? 0;
      const currentAngle = Math.atan2(mouseY - centerY, mouseX - centerX);
      let deltaRotation = currentAngle - startAngle;

      // 约束旋转（15度步进）
      if (this.snapToAngle) {
        const totalRotation = startRotation + deltaRotation;
        const snappedRotation = Math.round(totalRotation / this.snapStep) * this.snapStep;
        deltaRotation = snappedRotation - startRotation;
      }

      const newRotation = startRotation + deltaRotation;

      this.scene.update(id, {
        transform: {
          ...element.transform,
          rotation: newRotation,
        },
      });
    }
  }

  /**
   * 完成旋转，生成命令
   */
  finish(): UpdateElementCommand | BatchCommand | null {
    if (this.startRotations.size === 0) return null;

    const commands: UpdateElementCommand[] = [];

    for (const [id, startRotation] of this.startRotations) {
      const element = this.scene.get(id);
      if (!element) continue;

      // 如果旋转没有变化，不需要创建命令
      if (element.transform.rotation === startRotation) {
        continue;
      }

      // 先恢复到开始旋转
      this.scene.update(id, {
        transform: {
          ...element.transform,
          rotation: startRotation,
        },
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
   * 取消旋转
   */
  cancel(): void {
    for (const [id, startRotation] of this.startRotations) {
      const element = this.scene.get(id);
      if (!element) continue;

      this.scene.update(id, {
        transform: {
          ...element.transform,
          rotation: startRotation,
        },
      });
    }

    this.startRotations.clear();
    this.startAngles.clear();
    this.startMousePos = null;
  }

  /**
   * 检查是否在旋转中
   */
  isActive(): boolean {
    return this.startRotations.size > 0;
  }
}

