import { ElementType } from '../types/ElementType';
import { ElementRenderer } from './ElementRenderer';
import {
  RectangleRenderer,
  EllipseRenderer,
  TextRenderer,
  ImageRenderer,
} from './renderers';

/**
 * 渲染器注册表
 * 管理元素类型到渲染器的映射
 */
export class RendererRegistry {
  private renderers: Map<ElementType, ElementRenderer> = new Map();

  constructor() {
    // 注册默认渲染器
    this.register(ElementType.RECTANGLE, new RectangleRenderer());
    this.register(ElementType.ELLIPSE, new EllipseRenderer());
    this.register(ElementType.TEXT, new TextRenderer());
    this.register(ElementType.IMAGE, new ImageRenderer());
  }

  /**
   * 注册渲染器
   */
  register(type: ElementType, renderer: ElementRenderer): void {
    this.renderers.set(type, renderer);
  }

  /**
   * 获取渲染器
   */
  get(type: ElementType): ElementRenderer | undefined {
    return this.renderers.get(type);
  }

  /**
   * 检查是否已注册
   */
  has(type: ElementType): boolean {
    return this.renderers.has(type);
  }

  /**
   * 移除渲染器
   */
  unregister(type: ElementType): void {
    this.renderers.delete(type);
  }
}

