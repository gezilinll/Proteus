import { Command } from '../Command';
import { Element } from '../../types/element';
import { Scene } from '../../scene/Scene';

/**
 * 添加元素命令
 */
export class AddElementCommand implements Command {
  private orderIndex?: number;

  constructor(
    private scene: Scene,
    private element: Element,
    private atIndex?: number
  ) {}

  execute(): void {
    this.scene.add(this.element, this.atIndex ?? this.orderIndex);
    // 记录实际添加的位置，用于 redo
    const order = this.scene.getOrder();
    this.orderIndex = order.indexOf(this.element.id);
  }

  undo(): void {
    // 记录当前位置用于 redo
    const order = this.scene.getOrder();
    this.orderIndex = order.indexOf(this.element.id);
    this.scene.remove(this.element.id);
  }

  get description(): string {
    return `Add ${this.element.type} element`;
  }
}

