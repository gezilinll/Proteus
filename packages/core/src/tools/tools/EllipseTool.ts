import { Tool } from '../Tool';
import { Scene } from '../../scene/Scene';
import { Editor } from '../../Editor';
import { createElement, Element } from '../../types/element';
import { ElementType } from '../../types/ElementType';
import { AddElementCommand } from '../../command/commands/AddElementCommand';

/**
 * 椭圆工具
 * 通过拖拽创建椭圆元素
 */
export class EllipseTool implements Tool {
  readonly name = 'ellipse';
  readonly icon = '○';
  readonly shortcut = 'O';

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
    this.previewElement = createElement(ElementType.ELLIPSE, {
      transform: {
        x,
        y,
        width: Math.abs(width),
        height: Math.abs(height),
        rotation: 0,
      },
      style: {
        fill: '#ef4444',
        stroke: '#dc2626',
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
    const element = createElement(ElementType.ELLIPSE, {
      transform: {
        x,
        y,
        width: Math.abs(width),
        height: Math.abs(height),
        rotation: 0,
      },
      style: {
        fill: '#ef4444',
        stroke: '#dc2626',
        strokeWidth: 2,
      },
    });

    const command = new AddElementCommand(this.scene, element);
    this.editor.executeCommand(command);

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

