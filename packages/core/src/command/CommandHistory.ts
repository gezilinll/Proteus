import { Command } from './Command';

/**
 * 命令历史管理器
 * 负责执行、撤销、重做命令
 */
export class CommandHistory {
  /** 历史记录（已执行的命令） */
  private history: Command[] = [];

  /** 当前指针位置（用于重做） */
  private currentIndex: number = -1;

  /** 最大历史记录数 */
  private maxHistorySize: number = 100;

  constructor(maxHistorySize: number = 100) {
    this.maxHistorySize = maxHistorySize;
  }

  /**
   * 执行命令
   */
  execute(command: Command): void {
    // 如果当前不在历史末尾，删除后续命令（无法重做）
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1);
    }

    // 执行命令
    command.execute();

    // 添加到历史
    this.history.push(command);
    this.currentIndex = this.history.length - 1;

    // 限制历史记录大小
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
      this.currentIndex--;
    }
  }

  /**
   * 撤销
   */
  undo(): boolean {
    if (!this.canUndo()) {
      return false;
    }

    const command = this.history[this.currentIndex];
    command.undo();
    this.currentIndex--;
    return true;
  }

  /**
   * 重做
   */
  redo(): boolean {
    if (!this.canRedo()) {
      return false;
    }

    this.currentIndex++;
    const command = this.history[this.currentIndex];
    command.execute();
    return true;
  }

  /**
   * 是否可以撤销
   */
  canUndo(): boolean {
    return this.currentIndex >= 0;
  }

  /**
   * 是否可以重做
   */
  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  /**
   * 清空历史
   */
  clear(): void {
    this.history = [];
    this.currentIndex = -1;
  }

  /**
   * 获取历史记录数量
   */
  getHistorySize(): number {
    return this.history.length;
  }

  /**
   * 获取当前指针位置
   */
  getCurrentIndex(): number {
    return this.currentIndex;
  }
}

