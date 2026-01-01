import { Command } from '../Command';
import { ClipboardManager } from '../../clipboard/ClipboardManager';
import { Element } from '../../types/element';

/**
 * 复制元素命令
 */
export class CopyElementsCommand implements Command {
  constructor(
    private clipboardManager: ClipboardManager,
    private elements: Element[]
  ) {}

  execute(): void {
    // 异步执行，但不阻塞命令历史
    this.clipboardManager.copy(this.elements).catch((err) => {
      console.warn('Failed to sync to system clipboard:', err);
    });
  }

  undo(): void {
    // 复制操作不需要撤销（剪贴板操作）
  }

  get description(): string {
    return `Copy ${this.elements.length} elements`;
  }
}

