import { Command } from '../Command';
import { Element } from '../../types/element';
import { Scene } from '../../scene/Scene';
import { deepClone } from '../../utils/clone';

/**
 * 更新元素命令
 */
export class UpdateElementCommand implements Command {
  private oldElementSnapshot?: Element;

  constructor(
    private scene: Scene,
    private elementId: string,
    private updates: Partial<Element>
  ) {}

  execute(): void {
    const element = this.scene.get(this.elementId);
    if (!element) {
      throw new Error(`Element with id "${this.elementId}" not found`);
    }

    // 保存旧状态
    this.oldElementSnapshot = deepClone(element);

    // 应用更新
    this.scene.update(this.elementId, this.updates);
  }

  undo(): void {
    if (!this.oldElementSnapshot) {
      throw new Error('Cannot undo: old element snapshot not found');
    }

    // 恢复旧状态（跳过时间戳更新）
    this.scene.update(this.elementId, this.oldElementSnapshot, true);
  }

  get description(): string {
    return `Update element ${this.elementId}`;
  }
}

