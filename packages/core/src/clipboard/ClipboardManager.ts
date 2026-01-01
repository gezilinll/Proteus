import { Element } from '../types/element';
import { deepClone } from '../utils/clone';
import { generateId } from '../utils/id';

/**
 * 剪贴板管理器
 * 管理复制、剪切、粘贴操作
 */
export class ClipboardManager {
  private clipboard: Element[] = [];
  private isCut: boolean = false; // 标记是否为剪切操作

  /**
   * 复制元素
   */
  copy(elements: Element[]): void {
    if (elements.length === 0) return;

    // 深拷贝元素，并生成新的 ID
    this.clipboard = elements.map((el) => this.cloneElement(el));
    this.isCut = false;
  }

  /**
   * 剪切元素
   */
  cut(elements: Element[]): void {
    if (elements.length === 0) return;

    // 深拷贝元素，并生成新的 ID
    this.clipboard = elements.map((el) => this.cloneElement(el));
    this.isCut = true;
  }

  /**
   * 粘贴元素
   * @param offsetX X 偏移量（默认 10）
   * @param offsetY Y 偏移量（默认 10）
   * @returns 粘贴的元素列表
   */
  paste(offsetX: number = 10, offsetY: number = 10): Element[] {
    if (this.clipboard.length === 0) return [];

    // 为每个元素生成新 ID 并应用偏移
    return this.clipboard.map((el) => ({
      ...deepClone(el),
      id: generateId(),
      transform: {
        ...el.transform,
        x: el.transform.x + offsetX,
        y: el.transform.y + offsetY,
      },
    }));
  }

  /**
   * 检查剪贴板是否有内容
   */
  hasContent(): boolean {
    return this.clipboard.length > 0;
  }

  /**
   * 是否为剪切操作
   */
  getIsCut(): boolean {
    return this.isCut;
  }

  /**
   * 清空剪贴板
   */
  clear(): void {
    this.clipboard = [];
    this.isCut = false;
  }

  /**
   * 克隆元素（生成新 ID）
   */
  private cloneElement(element: Element): Element {
    return {
      ...deepClone(element),
      id: generateId(), // 生成新 ID
    };
  }
}

