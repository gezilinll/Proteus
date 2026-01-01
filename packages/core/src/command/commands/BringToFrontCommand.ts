import { Command } from '../Command';
import { Scene } from '../../scene/Scene';

/**
 * 置顶命令
 */
export class BringToFrontCommand implements Command {
  private oldOrder: string[] = [];

  constructor(
    private scene: Scene,
    private elementId: string
  ) {}

  execute(): void {
    // 保存旧顺序
    this.oldOrder = this.scene.getOrder();
    
    if (!this.oldOrder.includes(this.elementId)) {
      throw new Error(`Element with id "${this.elementId}" not found`);
    }

    this.scene.moveToTop(this.elementId);
  }

  undo(): void {
    if (this.oldOrder.length === 0) return;
    
    // 恢复旧顺序
    this.scene.setOrder(this.oldOrder);
  }

  get description(): string {
    return `Bring element ${this.elementId} to front`;
  }
}

