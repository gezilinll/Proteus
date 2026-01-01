import { Tool } from '../Tool';
import { Scene } from '../../scene/Scene';
import { Editor } from '../../Editor';
import { createElement, Element } from '../../types/element';
import { ElementType } from '../../types/ElementType';
import { AddElementCommand } from '../../command/commands/AddElementCommand';

/**
 * 文字工具
 * 点击创建文字元素，创建后立即进入编辑模式
 */
export class TextTool implements Tool {
  readonly name = 'text';
  readonly icon = 'T';
  readonly shortcut = 'T';

  private createdElement: Element | null = null;

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
    // 创建默认大小的文字元素
    const element = createElement(ElementType.TEXT, {
      transform: {
        x: canvasX,
        y: canvasY,
        width: 200, // 默认宽度
        height: 40, // 默认高度（会根据内容自动调整）
        rotation: 0,
      },
      style: {
        fill: '#000000',
        fontSize: 16,
        fontFamily: 'Arial',
        fontWeight: 'normal',
        text: 'Text', // 默认文字
        textAlign: 'center', // 默认居中对齐，与 Canvas 渲染一致
      },
    });

    const command = new AddElementCommand(this.scene, element);
    this.editor.executeCommand(command);

    // 保存创建的元素，用于后续进入编辑模式
    this.createdElement = element;

    // 触发元素创建事件，React 层可以监听此事件进入编辑模式
    // 注意：这里需要通过 editor 来触发，因为 toolManager 需要访问 editor
    (this.editor.toolManager as any).emit('elementCreated', element);

    this.editor.requestRender();
  }

  onMouseMove(_canvasX: number, _canvasY: number): void {
    // 文字工具不需要拖拽预览
  }

  onMouseUp(_canvasX: number, _canvasY: number): void {
    // 创建已完成，清理状态
    this.createdElement = null;
  }

  cancel(): void {
    this.createdElement = null;
  }

  getPreviewElement(): Element | null {
    // 文字工具不需要预览
    return null;
  }

  /**
   * 获取最后创建的元素（用于进入编辑模式）
   */
  getCreatedElement(): Element | null {
    return this.createdElement;
  }
}

