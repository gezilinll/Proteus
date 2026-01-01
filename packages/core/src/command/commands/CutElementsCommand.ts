import { Command } from '../Command';
import { Scene } from '../../scene/Scene';
import { ClipboardManager } from '../../clipboard/ClipboardManager';
import { Element } from '../../types/element';
import { BatchCommand } from './BatchCommand';
import { RemoveElementCommand } from './RemoveElementCommand';

/**
 * 剪切元素命令
 * 剪切 = 复制到剪贴板 + 删除元素
 */
export class CutElementsCommand implements Command {
  private removeCommand: BatchCommand;

  constructor(
    scene: Scene,
    private clipboardManager: ClipboardManager,
    private elements: Element[]
  ) {
    // 创建删除命令
    const commands = elements.map((el) => new RemoveElementCommand(scene, el.id));
    this.removeCommand = new BatchCommand(commands);
  }

  execute(): void {
    // 先复制到剪贴板
    this.clipboardManager.cut(this.elements);
    // 然后删除元素
    this.removeCommand.execute();
  }

  undo(): void {
    // 撤销删除操作
    this.removeCommand.undo();
    // 注意：剪贴板操作不需要撤销
  }

  get description(): string {
    return `Cut ${this.elements.length} elements`;
  }
}

