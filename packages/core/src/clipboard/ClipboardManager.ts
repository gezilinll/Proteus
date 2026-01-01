import { Element } from '../types/element';
import { ElementType } from '../types/ElementType';
import { deepClone } from '../utils/clone';
import { generateId } from '../utils/id';

/**
 * 剪贴板管理器
 * 管理复制、剪切、粘贴操作
 * 同时管理内部元素剪贴板和系统剪贴板
 */
export class ClipboardManager {
  private clipboard: Element[] = [];
  private isCut: boolean = false; // 标记是否为剪切操作
  private isInternalContent: boolean = false; // 标记是否为内部元素内容

  /**
   * 复制元素（同步到系统剪贴板）
   */
  async copy(elements: Element[]): Promise<void> {
    if (elements.length === 0) return;

    // 深拷贝元素，并生成新的 ID
    this.clipboard = elements.map((el) => this.cloneElement(el));
    this.isCut = false;
    this.isInternalContent = true;

    // 同步到系统剪贴板
    await this.syncToSystemClipboard(elements);
  }

  /**
   * 剪切元素（同步到系统剪贴板）
   */
  async cut(elements: Element[]): Promise<void> {
    if (elements.length === 0) return;

    // 深拷贝元素，并生成新的 ID
    this.clipboard = elements.map((el) => this.cloneElement(el));
    this.isCut = true;
    this.isInternalContent = true;

    // 同步到系统剪贴板
    await this.syncToSystemClipboard(elements);
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
   * 是否为内部元素内容
   */
  isInternal(): boolean {
    return this.isInternalContent;
  }

  /**
   * 标记为外部内容
   */
  markAsExternal(): void {
    this.isInternalContent = false;
  }

  /**
   * 同步到系统剪贴板
   */
  private async syncToSystemClipboard(elements: Element[]): Promise<void> {
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      return; // 浏览器不支持 Clipboard API
    }

    try {
      // 将元素序列化为 JSON
      const data = JSON.stringify(elements);
      
      // 创建 ClipboardItem
      const clipboardItem = new ClipboardItem({
        'text/plain': new Blob([data], { type: 'text/plain' }),
        'application/json': new Blob([data], { type: 'application/json' }),
      });

      await navigator.clipboard.write([clipboardItem]);
    } catch (error) {
      // 如果失败，尝试使用传统方法（仅文本）
      try {
        const textContent = elements
          .map((el) => {
            if (el.type === ElementType.TEXT) {
              return el.style.text || '';
            }
            return '';
          })
          .filter((text) => text)
          .join('\n');

        if (textContent) {
          await navigator.clipboard.writeText(textContent);
        }
      } catch (err) {
        console.warn('Failed to sync to system clipboard:', err);
      }
    }
  }

  /**
   * 从系统剪贴板读取（检查是否为内部元素）
   */
  async readFromSystemClipboard(): Promise<{ isInternal: boolean; data: any } | null> {
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      return null;
    }

    try {
      // 尝试读取 JSON 格式
      const clipboardItems = await navigator.clipboard.read();
      for (const item of clipboardItems) {
        for (const type of item.types) {
          if (type === 'application/json' || type === 'text/plain') {
            const blob = await item.getType(type);
            const text = await blob.text();
            try {
              const data = JSON.parse(text);
              // 检查是否为内部元素格式（有 id 和 type 字段，且 type 是有效的 ElementType）
              if (
                Array.isArray(data) &&
                data.length > 0 &&
                data[0].id &&
                data[0].type &&
                Object.values(ElementType).includes(data[0].type)
              ) {
                return { isInternal: true, data };
              }
            } catch {
              // 不是 JSON，继续
            }
          }
        }
      }
    } catch (error) {
      // 权限被拒绝或其他错误
      console.warn('Failed to read from system clipboard:', error);
    }

    return null;
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

