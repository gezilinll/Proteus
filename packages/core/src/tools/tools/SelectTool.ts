import { Tool } from '../Tool';
import { InteractionManager } from '../../interaction/InteractionManager';
import { Editor } from '../../Editor';
import { Element } from '../../types/element';

/**
 * 选择工具
 * 将交互委托给 InteractionManager
 */
export class SelectTool implements Tool {
  readonly name = 'select';
  readonly icon = '🔍';
  readonly shortcut = 'V';

  constructor(
    private interactionManager: InteractionManager,
    private editor: Editor
  ) {}

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
    this.editor.requestRender();
  }

  onMouseMove(canvasX: number, canvasY: number): void {
    this.interactionManager.handleMouseMove(canvasX, canvasY);
    this.editor.requestRender();
  }

  onMouseUp(canvasX: number, canvasY: number): void {
    this.interactionManager.handleMouseUp(canvasX, canvasY);
    this.editor.requestRender();
  }

  cancel(): void {
    // 选择工具无需取消操作
  }

  getPreviewElement(): Element | null {
    return null;
  }
}

