import { Transform } from '../../types/transform';
import { UpdateElementCommand } from '../../command/commands/UpdateElementCommand';
import { BatchCommand } from '../../command/commands/BatchCommand';
import { Scene } from '../../scene/Scene';

/**
 * 拖拽移动处理器
 */
export class DragHandler {
  private startPositions: Map<string, Transform> = new Map();
  private startMousePos: { x: number; y: number } | null = null;
  private currentPositions: Map<string, Transform> = new Map();

  constructor(private scene: Scene) {}

  /**
   * 开始拖拽
   */
  start(
    elementIds: string[],
    mouseX: number,
    mouseY: number
  ): void {
    this.startMousePos = { x: mouseX, y: mouseY };
    this.startPositions.clear();
    this.currentPositions.clear();

    // 保存每个元素的初始位置
    for (const id of elementIds) {
      const element = this.scene.get(id);
      if (element) {
        const transform = { ...element.transform };
        this.startPositions.set(id, transform);
        this.currentPositions.set(id, transform);
      }
    }
  }

  /**
   * 更新拖拽（实时更新元素位置）
   */
  update(mouseX: number, mouseY: number): void {
    if (!this.startMousePos) return;

    const deltaX = mouseX - this.startMousePos.x;
    const deltaY = mouseY - this.startMousePos.y;

    // 更新所有选中元素的位置
    for (const [id, startTransform] of this.startPositions) {
      const element = this.scene.get(id);
      if (!element) continue;

      const newTransform: Transform = {
        ...element.transform,
        x: startTransform.x + deltaX,
        y: startTransform.y + deltaY,
      };

      // 实时更新 Scene
      this.scene.update(id, {
        transform: newTransform,
      });

      // 保存当前位置
      this.currentPositions.set(id, newTransform);
    }
  }

  /**
   * 完成拖拽，生成命令
   * 策略：先恢复到开始位置，然后创建命令，命令的 execute 会移动到当前位置
   */
  finish(): UpdateElementCommand | BatchCommand | null {
    if (this.startPositions.size === 0) return null;

    const commands: UpdateElementCommand[] = [];

    for (const [id, startTransform] of this.startPositions) {
      const currentTransform = this.currentPositions.get(id);
      if (!currentTransform) continue;

      // 如果位置没有变化，不需要创建命令
      if (
        currentTransform.x === startTransform.x &&
        currentTransform.y === startTransform.y
      ) {
        continue;
      }

      // 先恢复到开始位置（这样命令的 execute 会移动到当前位置）
      this.scene.update(id, {
        transform: startTransform,
      }, true);

      // 创建命令：execute 时移动到当前位置
      const command = new UpdateElementCommand(
        this.scene,
        id,
        {
          transform: currentTransform,
        }
      );

      commands.push(command);
    }

    if (commands.length === 0) return null;

    // 如果只有一个元素，直接返回单个命令
    if (commands.length === 1) {
      return commands[0];
    }

    // 多个元素，返回批量命令
    return new BatchCommand(commands);
  }

  /**
   * 取消拖拽，恢复原始位置
   */
  cancel(): void {
    for (const [id, startTransform] of this.startPositions) {
      const element = this.scene.get(id);
      if (!element) continue;

      this.scene.update(id, {
        transform: startTransform,
      });
    }

    this.startPositions.clear();
    this.currentPositions.clear();
    this.startMousePos = null;
  }

  /**
   * 检查是否在拖拽中
   */
  isActive(): boolean {
    return this.startPositions.size > 0;
  }
}
