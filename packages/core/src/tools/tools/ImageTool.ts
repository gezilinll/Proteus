import { Tool } from '../Tool';
import { Scene } from '../../scene/Scene';
import { Editor } from '../../Editor';
import { createElement, Element } from '../../types/element';
import { ElementType } from '../../types/ElementType';
import { AddElementCommand } from '../../command/commands/AddElementCommand';
import { loadImage, ImageSource } from '../../utils/imageLoader';

/**
 * 图片工具
 * 点击创建图片元素，支持从 URL、File、Base64 加载
 */
export class ImageTool implements Tool {
  readonly name = 'image';
  readonly icon = '🖼️';
  readonly shortcut = 'I';

  private pendingImageSource: ImageSource | null = null;

  constructor(
    private scene: Scene,
    private editor: Editor
  ) {}

  /**
   * 设置待插入的图片源
   */
  setImageSource(source: ImageSource): void {
    this.pendingImageSource = source;
  }

  onMouseDown(
    canvasX: number,
    canvasY: number,
    _options?: {
      ctrlKey?: boolean;
      shiftKey?: boolean;
      altKey?: boolean;
    }
  ): void {
    // 如果没有待插入的图片，不执行任何操作
    // 图片源应该通过 setImageSource 或文件选择器设置
    if (!this.pendingImageSource) {
      return;
    }

    // 先创建一个占位元素，显示 loading 状态
    const placeholderWidth = 200;
    const placeholderHeight = 150;
    const placeholderElement = createElement(ElementType.IMAGE, {
      transform: {
        x: canvasX,
        y: canvasY,
        width: placeholderWidth,
        height: placeholderHeight,
        rotation: 0,
      },
      style: {
        _loading: true, // 标记为加载中
        opacity: 1,
      },
    });

    const addCommand = new AddElementCommand(this.scene, placeholderElement);
    this.editor.executeCommand(addCommand);
    this.editor.requestRender();

    // 异步加载图片
    const imageSource = this.pendingImageSource;
    this.pendingImageSource = null; // 立即清空，避免重复使用

    // 持续请求渲染以显示加载动画
    const renderInterval = setInterval(() => {
      this.editor.requestRender();
    }, 16); // 约 60fps

    loadImage(imageSource)
      .then((result) => {
        // 清除渲染间隔
        clearInterval(renderInterval);
        const { image, width, height } = result;

        // 计算最终尺寸（限制最大尺寸为 800px）
        const maxSize = 800;
        let elementWidth = width;
        let elementHeight = height;

        if (width > maxSize || height > maxSize) {
          const scale = Math.min(maxSize / width, maxSize / height);
          elementWidth = width * scale;
          elementHeight = height * scale;
        }

        // 将图片转换为 Base64 以便存储
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Failed to get canvas context');
        }

        ctx.drawImage(image, 0, 0);
        const imageUrl = canvas.toDataURL('image/png');

        // 更新占位元素，移除 loading 标记，设置图片 URL
        this.scene.update(placeholderElement.id, {
          transform: {
            ...placeholderElement.transform,
            width: elementWidth,
            height: elementHeight,
          },
          style: {
            ...placeholderElement.style,
            imageUrl,
            _loading: false,
          },
        });

        // 自动选中新创建的图片元素
        this.editor.selectionManager.select(placeholderElement.id);
        
        // 自动切换回 select 工具
        this.editor.toolManager.setTool('select');

        this.editor.requestRender();
      })
      .catch((error) => {
        // 清除渲染间隔
        clearInterval(renderInterval);
        
        console.error('Failed to load image:', error);
        // 加载失败，移除占位元素或显示错误状态
        this.scene.remove(placeholderElement.id);
        this.editor.requestRender();
      });
  }

  onMouseMove(_canvasX: number, _canvasY: number): void {
    // 图片工具不需要拖拽预览
  }

  onMouseUp(_canvasX: number, _canvasY: number): void {
    // 创建已完成
  }

  cancel(): void {
    this.pendingImageSource = null;
  }

  getPreviewElement(): Element | null {
    // 图片工具不需要预览
    return null;
  }
}

