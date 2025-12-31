import { Element } from '../types/element';
import { EventEmitter } from '../utils/EventEmitter';
import { deepClone } from '../utils/clone';

/**
 * Scene 事件类型
 */
export interface SceneEvents extends Record<string, any[]> {
  /** 元素添加 */
  elementAdded: [element: Element];
  /** 元素更新 */
  elementUpdated: [element: Element, oldElement: Element];
  /** 元素删除 */
  elementRemoved: [elementId: string];
  /** 顺序变化 */
  orderChanged: [order: string[]];
}

/**
 * 场景图（Scene Graph）
 * 管理所有编辑器元素
 */
export class Scene extends EventEmitter<SceneEvents> {
  /** 元素存储（扁平化 Map） */
  private elements: Map<string, Element> = new Map();

  /** 图层顺序（底层在前，顶层在后） */
  private order: string[] = [];

  /**
   * 添加元素
   * @param atIndex 可选：插入到指定位置（用于撤销删除时恢复顺序）
   */
  add(element: Element, atIndex?: number): void {
    if (this.elements.has(element.id)) {
      throw new Error(`Element with id "${element.id}" already exists`);
    }

    this.elements.set(element.id, element);
    
    if (atIndex !== undefined && atIndex >= 0 && atIndex <= this.order.length) {
      this.order.splice(atIndex, 0, element.id);
    } else {
      this.order.push(element.id);
    }
    
    this.emit('elementAdded', element);
  }

  /**
   * 获取元素
   */
  get(id: string): Element | undefined {
    return this.elements.get(id);
  }

  /**
   * 更新元素
   * @param skipTimestamp 是否跳过时间戳更新（用于撤销操作）
   */
  update(id: string, updates: Partial<Element>, skipTimestamp: boolean = false): void {
    const element = this.elements.get(id);
    if (!element) {
      throw new Error(`Element with id "${id}" not found`);
    }

    // 深拷贝旧元素用于事件通知
    const oldElement = deepClone(element);

    // 深度合并所有嵌套对象
    const updatedElement: Element = {
      ...element,
      ...updates,
      transform: {
        ...element.transform,
        ...updates.transform,
      },
      style: {
        ...element.style,
        ...updates.style,
      },
      meta: {
        ...element.meta,
        ...updates.meta,
        ...(skipTimestamp ? {} : { updatedAt: Date.now() }),
      },
    };

    this.elements.set(id, updatedElement);
    this.emit('elementUpdated', updatedElement, oldElement);
  }

  /**
   * 删除元素
   */
  remove(id: string): void {
    const element = this.elements.get(id);
    if (!element) {
      throw new Error(`Element with id "${id}" not found`);
    }

    // 删除子元素
    const children = this.getChildren(id);
    children.forEach((child) => this.remove(child.id));

    this.elements.delete(id);
    const index = this.order.indexOf(id);
    if (index !== -1) {
      this.order.splice(index, 1);
    }
    this.emit('elementRemoved', id);
  }

  /**
   * 获取所有元素
   */
  getAll(): Element[] {
    return Array.from(this.elements.values());
  }

  /**
   * 获取所有元素 ID
   */
  getAllIds(): string[] {
    return Array.from(this.elements.keys());
  }

  /**
   * 获取按顺序排列的元素
   */
  getOrdered(): Element[] {
    return this.order.map((id) => this.elements.get(id)!).filter(Boolean);
  }

  /**
   * 获取图层顺序
   */
  getOrder(): string[] {
    return [...this.order];
  }

  /**
   * 获取子元素
   */
  getChildren(parentId: string): Element[] {
    return this.getAll().filter((el) => el.parentId === parentId);
  }

  /**
   * 移动到顶层
   */
  moveToTop(id: string): void {
    const index = this.order.indexOf(id);
    if (index === -1) return;

    this.order.splice(index, 1);
    this.order.push(id);
    this.emit('orderChanged', this.getOrder());
  }

  /**
   * 移动到底层
   */
  moveToBottom(id: string): void {
    const index = this.order.indexOf(id);
    if (index === -1) return;

    this.order.splice(index, 1);
    this.order.unshift(id);
    this.emit('orderChanged', this.getOrder());
  }

  /**
   * 上移一层
   */
  moveUp(id: string): void {
    const index = this.order.indexOf(id);
    if (index === -1 || index === this.order.length - 1) return;

    [this.order[index], this.order[index + 1]] = [this.order[index + 1], this.order[index]];
    this.emit('orderChanged', this.getOrder());
  }

  /**
   * 下移一层
   */
  moveDown(id: string): void {
    const index = this.order.indexOf(id);
    if (index === -1 || index === 0) return;

    [this.order[index], this.order[index - 1]] = [this.order[index - 1], this.order[index]];
    this.emit('orderChanged', this.getOrder());
  }

  /**
   * 清空场景
   */
  clear(): void {
    const ids = this.getAllIds();
    this.elements.clear();
    this.order = [];
    ids.forEach((id) => this.emit('elementRemoved', id));
  }

  /**
   * 获取元素数量
   */
  size(): number {
    return this.elements.size;
  }

  /**
   * 检查元素是否存在
   */
  has(id: string): boolean {
    return this.elements.has(id);
  }
}

