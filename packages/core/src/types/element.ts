import { ElementType } from './ElementType';
import { Transform, createTransform } from './transform';
import { Style, createStyle } from './style';
import { ElementMeta, createMeta } from './meta';
import { generateId } from '../utils/id';

/**
 * 编辑器元素
 */
export interface Element {
  /** 唯一标识符 */
  id: string;
  /** 元素类型 */
  type: ElementType;
  /** 变换信息 */
  transform: Transform;
  /** 样式信息 */
  style: Style;
  /** 元数据 */
  meta: ElementMeta;
  /** 父元素 ID（用于分组） */
  parentId?: string;
}

/**
 * 创建元素
 */
export function createElement(
  type: ElementType,
  options?: {
    id?: string;
    transform?: Partial<Transform>;
    style?: Partial<Style>;
    meta?: Partial<ElementMeta>;
    parentId?: string;
  }
): Element {
  return {
    id: options?.id ?? generateId(),
    type,
    transform: {
      ...createTransform(),
      ...options?.transform,
    },
    style: {
      ...createStyle(),
      ...options?.style,
    },
    meta: {
      ...createMeta(),
      ...options?.meta,
    },
    parentId: options?.parentId,
  };
}

