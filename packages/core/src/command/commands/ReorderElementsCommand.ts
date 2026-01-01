import { Command } from '../Command';
import { Scene } from '../../scene/Scene';

/**
 * 重新排序元素命令
 * 用于拖拽排序等操作
 */
export class ReorderElementsCommand implements Command {
  private oldOrder: string[] = [];

  constructor(
    private scene: Scene,
    private newOrder: string[]
  ) {}

  execute(): void {
    // 保存旧顺序
    this.oldOrder = this.scene.getOrder();
    
    // 设置新顺序
    this.scene.setOrder(this.newOrder);
  }

  undo(): void {
    if (this.oldOrder.length === 0) return;
    
    // 恢复旧顺序
    this.scene.setOrder(this.oldOrder);
  }

  get description(): string {
    return 'Reorder elements';
  }
}

