import { RenderContext } from './RenderContext';
import { Element } from '../types/element';

/**
 * 元素渲染器接口
 * 每个元素类型对应一个渲染器实现
 */
export interface ElementRenderer {
  /**
   * 渲染元素
   * @param ctx 渲染上下文
   * @param element 要渲染的元素
   */
  render(ctx: RenderContext, element: Element): void;
}

