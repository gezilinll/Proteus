/**
 * 命令接口
 * 所有编辑器操作都通过 Command 执行，以支持 Undo/Redo
 */
export interface Command {
  /** 执行命令 */
  execute(): void;
  /** 撤销命令 */
  undo(): void;
  /** 命令描述（用于调试） */
  description?: string;
}

