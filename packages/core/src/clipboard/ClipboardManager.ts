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
    } catch {
      // 如果 ClipboardItem 方式失败，尝试使用 writeText 写入 JSON 字符串
      // 这样所有类型的元素（矩形、圆形、文本等）都能被正确保存
      try {
        const jsonData = JSON.stringify(elements);
        await navigator.clipboard.writeText(jsonData);
      } catch (err) {
        console.warn('Failed to sync to system clipboard:', err);
      }
    }
  }

  /**
   * 从系统剪贴板读取所有内容类型
   * 返回系统剪贴板的最新内容，包括图片、内部元素、文本等
   */
  async readFromSystemClipboard(): Promise<{
    image?: Blob;
    imageType?: string;
    internalElements?: Element[];
    text?: string;
  } | null> {
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      return null;
    }

    try {
      const clipboardItems = await navigator.clipboard.read();
      const result: {
        image?: Blob;
        imageType?: string;
        internalElements?: Element[];
        text?: string;
      } = {};

      // 遍历所有剪贴板项
      for (const item of clipboardItems) {
        const types = Array.from(item.types);

        // 1. 优先检查图片（图片数据是最明确的）
        for (const type of types) {
          if (type.startsWith('image/')) {
            try {
              const blob = await item.getType(type);
              result.image = blob;
              result.imageType = type;
              // 找到图片后，继续检查其他类型（可能同时有文本）
            } catch (err) {
              console.warn('Failed to read image from clipboard:', err);
            }
          }
        }

        // 2. 检查 JSON（可能是内部元素）
        for (const type of types) {
          if (type === 'application/json') {
            try {
              const blob = await item.getType(type);
              const text = await blob.text();
              try {
                const data = JSON.parse(text);
                // 检查是否为内部元素格式
                if (
                  Array.isArray(data) &&
                  data.length > 0 &&
                  data[0].id &&
                  data[0].type &&
                  Object.values(ElementType).includes(data[0].type)
                ) {
                  result.internalElements = data;
                }
              } catch {
                // 不是有效的内部元素 JSON，忽略
              }
            } catch (err) {
              console.warn('Failed to read JSON from clipboard:', err);
            }
          }
        }

        // 3. 检查普通文本（如果没有通过 application/json 找到内部元素，尝试从 text/plain 解析）
        if (!result.internalElements) {
          for (const type of types) {
            if (type === 'text/plain') {
              try {
                const blob = await item.getType(type);
                const text = await blob.text();
                if (text && text.trim()) {
                  // 尝试解析为内部元素 JSON
                  try {
                    const data = JSON.parse(text);
                    if (
                      Array.isArray(data) &&
                      data.length > 0 &&
                      data[0].id &&
                      data[0].type &&
                      Object.values(ElementType).includes(data[0].type)
                    ) {
                      // 找到内部元素，设置到结果中
                      result.internalElements = data;
                      break; // 找到内部元素后不再设置文本
                    }
                  } catch {
                    // 不是 JSON，作为普通文本
                  }
                  // 如果不是内部元素 JSON，设置为普通文本
                  if (!result.internalElements) {
                    result.text = text;
                  }
                }
              } catch (err) {
                console.warn('Failed to read text from clipboard:', err);
              }
            }
          }
        }
      }

      // 如果找到任何内容，返回结果
      if (result.image || result.internalElements || result.text) {
        return result;
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

