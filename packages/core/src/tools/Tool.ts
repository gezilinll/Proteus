import { Element } from '../types/element';

/**
 * 工具事件
 */
export interface ToolEvents {
  /** 元素创建完成 */
  elementCreated: [element: Element];
}

/**
 * 工具接口
 * 所有工具必须实现此接口
 */
export interface Tool {
  /** 工具名称 */
  readonly name: string;
  /** 工具图标（可选） */
  readonly icon?: string;
  /** 工具快捷键（可选） */
  readonly shortcut?: string;

  /**
   * 处理鼠标按下
   */
  onMouseDown(
    canvasX: number,
    canvasY: number,
    options?: {
      ctrlKey?: boolean;
      shiftKey?: boolean;
      altKey?: boolean;
    }
  ): void;

  /**
   * 处理鼠标移动
   */
  onMouseMove(canvasX: number, canvasY: number): void;

  /**
   * 处理鼠标抬起
   */
  onMouseUp(canvasX: number, canvasY: number): void;

  /**
   * 取消当前操作
   */
  cancel(): void;

  /**
   * 获取预览元素（用于实时预览）
   */
  getPreviewElement(): Element | null;
}

