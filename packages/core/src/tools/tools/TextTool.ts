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
    // 检查是否有正在编辑的文字元素
    const allElements = this.scene.getAll();
    const editingElement = allElements.find(
      (el) => el.type === ElementType.TEXT && el.style._editing === true
    );

    if (editingElement) {
      // 如果有正在编辑的元素，清空选择并切换回 select 工具
      // 注意：实际的退出逻辑在 TextEditOverlay 中处理（通过工具切换事件）
      this.editor.selectionManager.clear();
      this.editor.toolManager.setTool('select');
      return;
    }

    // 创建默认大小的文字元素
    // 注意：transform.x, y 是左上角坐标，但用户点击的位置应该是中心
    // 所以需要减去 width/2 和 height/2
    const defaultWidth = 200;
    const defaultHeight = 40;
    const element = createElement(ElementType.TEXT, {
      transform: {
        x: canvasX - defaultWidth / 2,
        y: canvasY - defaultHeight / 2,
        width: defaultWidth,
        height: defaultHeight,
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

    // 注意：不立即切换回 select，因为文字会自动进入编辑模式
    // 编辑模式退出时会通过点击外部区域自动切换回 select

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

