import { Command } from '../Command';

/**
 * 批量命令
 * 将多个命令包装为一个命令，作为一个撤销单元
 */
export class BatchCommand implements Command {
  constructor(
    private commands: Command[],
    public description?: string
  ) {}

  execute(): void {
    this.commands.forEach((cmd) => cmd.execute());
  }

  undo(): void {
    // 反向执行撤销
    for (let i = this.commands.length - 1; i >= 0; i--) {
      this.commands[i].undo();
    }
  }

  /**
   * 添加命令到批量
   */
  add(command: Command): void {
    this.commands.push(command);
  }

  /**
   * 获取命令数量
   */
  size(): number {
    return this.commands.length;
  }
}

