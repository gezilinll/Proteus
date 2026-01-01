import { Tool } from '../Tool';
import { Scene } from '../../scene/Scene';
import { Editor } from '../../Editor';
import { createElement, Element } from '../../types/element';
import { ElementType } from '../../types/ElementType';
import { AddElementCommand } from '../../command/commands/AddElementCommand';

/**
 * 矩形工具
 * 通过拖拽创建矩形元素
 */
export class RectangleTool implements Tool {
  readonly name = 'rectangle';
  readonly icon = '▭';
  readonly shortcut = 'R';

  private startPos: { x: number; y: number } | null = null;
  private previewElement: Element | null = null;

  constructor(
    private scene: Scene,
    private editor: Editor
  ) {}

  onMouseDown(
    canvasX: number,
    canvasY: number,
    _options?: {
      ctrlKey?: boolean;
      shiftKey?: boolean;
      altKey?: boolean;
    }
  ): void {
    this.startPos = { x: canvasX, y: canvasY };
    this.previewElement = null;
  }

  onMouseMove(canvasX: number, canvasY: number): void {
    if (!this.startPos) return;

    const width = canvasX - this.startPos.x;
    const height = canvasY - this.startPos.y;

    // 处理负方向拖拽
    const x = width < 0 ? this.startPos.x + width : this.startPos.x;
    const y = height < 0 ? this.startPos.y + height : this.startPos.y;

    // 创建预览元素
    this.previewElement = createElement(ElementType.RECTANGLE, {
      transform: {
        x,
        y,
        width: Math.abs(width),
        height: Math.abs(height),
        rotation: 0,
      },
      style: {
        fill: '#3b82f6',
        stroke: '#1e40af',
        strokeWidth: 2,
        opacity: 0.8, // 预览时半透明
      },
    });

    this.editor.requestRender();
  }

  onMouseUp(canvasX: number, canvasY: number): void {
    if (!this.startPos) return;

    const width = canvasX - this.startPos.x;
    const height = canvasY - this.startPos.y;

    // 如果尺寸太小，取消创建
    if (Math.abs(width) < 5 || Math.abs(height) < 5) {
      this.cancel();
      return;
    }

    // 处理负方向拖拽
    const x = width < 0 ? this.startPos.x + width : this.startPos.x;
    const y = height < 0 ? this.startPos.y + height : this.startPos.y;

    // 创建实际元素
    const element = createElement(ElementType.RECTANGLE, {
      transform: {
        x,
        y,
        width: Math.abs(width),
        height: Math.abs(height),
        rotation: 0,
      },
      style: {
        fill: '#3b82f6',
        stroke: '#1e40af',
        strokeWidth: 2,
      },
    });

    const command = new AddElementCommand(this.scene, element);
    this.editor.executeCommand(command);

    // 自动选中新创建的元素
    this.editor.selectionManager.select(element.id);
    
    // 自动切换回 select 工具
    this.editor.toolManager.setTool('select');

    // 清理
    this.startPos = null;
    this.previewElement = null;
    this.editor.requestRender();
  }

  cancel(): void {
    this.startPos = null;
    this.previewElement = null;
    this.editor.requestRender();
  }

  getPreviewElement(): Element | null {
    return this.previewElement;
  }
}

