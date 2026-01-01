import { Command } from '../Command';
import { Scene } from '../../scene/Scene';
import { ClipboardManager } from '../../clipboard/ClipboardManager';
import { BatchCommand } from './BatchCommand';
import { AddElementCommand } from './AddElementCommand';

/**
 * 粘贴元素命令
 */
export class PasteElementsCommand implements Command {
  private batchCommand: BatchCommand | null = null;
  private isCut: boolean = false;
  private pastedElementIds: string[] = [];

  constructor(
    private scene: Scene,
    private clipboardManager: ClipboardManager,
    private offsetX: number = 10,
    private offsetY: number = 10
  ) {
    this.isCut = clipboardManager.getIsCut();
  }

  execute(): void {
    // 注意：剪切操作的删除应该在 CutElementsCommand 中处理
    // 这里只处理粘贴逻辑

    // 粘贴元素
    const pastedElements = this.clipboardManager.paste(this.offsetX, this.offsetY);
    if (pastedElements.length === 0) {
      return;
    }

    // 保存粘贴的元素 ID（用于选中）
    this.pastedElementIds = pastedElements.map((el) => el.id);

    // 创建添加命令
    const commands = pastedElements.map((el) => new AddElementCommand(this.scene, el));
    this.batchCommand = new BatchCommand(commands);
    this.batchCommand.execute();

    // 如果是剪切操作，清空剪贴板（粘贴后不再可以重复粘贴）
    if (this.isCut) {
      this.clipboardManager.clear();
    }
  }

  /**
   * 获取粘贴的元素 ID（用于选中）
   */
  getPastedElementIds(): string[] {
    return [...this.pastedElementIds];
  }

  undo(): void {
    if (this.batchCommand) {
      this.batchCommand.undo();
    }
  }

  get description(): string {
    return 'Paste elements';
  }
}

