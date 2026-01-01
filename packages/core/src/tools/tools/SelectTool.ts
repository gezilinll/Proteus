import { Tool } from '../Tool';
import { InteractionManager } from '../../interaction/InteractionManager';
import { Element } from '../../types/element';

/**
 * 选择工具
 * 将交互委托给 InteractionManager
 */
export class SelectTool implements Tool {
  readonly name = 'select';
  readonly icon = '🔍';
  readonly shortcut = 'V';

  constructor(private interactionManager: InteractionManager) {}

  onMouseDown(
    canvasX: number,
    canvasY: number,
    options?: {
      ctrlKey?: boolean;
      shiftKey?: boolean;
      altKey?: boolean;
    }
  ): void {
    this.interactionManager.handleMouseDown(canvasX, canvasY, options);
  }

  onMouseMove(canvasX: number, canvasY: number): void {
    this.interactionManager.handleMouseMove(canvasX, canvasY);
  }

  onMouseUp(canvasX: number, canvasY: number): void {
    this.interactionManager.handleMouseUp(canvasX, canvasY);
  }

  cancel(): void {
    // 选择工具无需取消操作
  }

  getPreviewElement(): Element | null {
    return null;
  }
}

