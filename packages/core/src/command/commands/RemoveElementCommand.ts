import { Command } from '../Command';
import { Element } from '../../types/element';
import { Scene } from '../../scene/Scene';
import { deepClone } from '../../utils/clone';

/**
 * 删除元素命令
 */
export class RemoveElementCommand implements Command {
  private elementSnapshot?: Element;
  private elementOrderIndex?: number;
  private childrenSnapshots: { element: Element; orderIndex: number }[] = [];

  constructor(
    private scene: Scene,
    private elementId: string
  ) {}

  execute(): void {
    const element = this.scene.get(this.elementId);
    if (!element) {
      throw new Error(`Element with id "${this.elementId}" not found`);
    }

    // 保存快照和顺序位置
    this.elementSnapshot = deepClone(element);
    const order = this.scene.getOrder();
    this.elementOrderIndex = order.indexOf(this.elementId);

    // 保存子元素快照和顺序
    const children = this.scene.getChildren(this.elementId);
    this.childrenSnapshots = children.map((child) => ({
      element: deepClone(child),
      orderIndex: order.indexOf(child.id),
    }));

    // 删除元素（会自动删除子元素）
    this.scene.remove(this.elementId);
  }

  undo(): void {
    if (!this.elementSnapshot || this.elementOrderIndex === undefined) {
      throw new Error('Cannot undo: element snapshot not found');
    }

    // 恢复元素到原始位置
    this.scene.add(this.elementSnapshot, this.elementOrderIndex);

    // 恢复子元素到原始位置（按顺序恢复）
    const sortedChildren = [...this.childrenSnapshots].sort((a, b) => a.orderIndex - b.orderIndex);
    sortedChildren.forEach(({ element, orderIndex }) => {
      this.scene.add(element, orderIndex);
    });
  }

  get description(): string {
    return `Remove element ${this.elementId}`;
  }
}

