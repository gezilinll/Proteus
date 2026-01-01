import { EventEmitter } from '../utils/EventEmitter';

/**
 * 选择管理器事件
 */
export interface SelectionManagerEvents extends Record<string, any[]> {
  selectionChanged: [selectedIds: Set<string>];
}

/**
 * 选择管理器
 * 管理当前选中的元素
 */
export class SelectionManager extends EventEmitter<SelectionManagerEvents> {
  private selectedIds: Set<string> = new Set();

  /**
   * 获取选中的元素 ID
   */
  getSelectedIds(): Set<string> {
    return new Set(this.selectedIds);
  }

  /**
   * 获取选中的元素数量
   */
  getCount(): number {
    return this.selectedIds.size;
  }

  /**
   * 是否选中
   */
  isSelected(id: string): boolean {
    return this.selectedIds.has(id);
  }

  /**
   * 是否为空
   */
  isEmpty(): boolean {
    return this.selectedIds.size === 0;
  }

  /**
   * 选择单个元素
   */
  select(id: string): void {
    if (this.selectedIds.has(id)) return;

    this.selectedIds.clear();
    this.selectedIds.add(id);
    this.emit('selectionChanged', this.getSelectedIds());
  }

  /**
   * 多选（添加到选择集）
   */
  add(id: string): void {
    if (this.selectedIds.has(id)) return;

    this.selectedIds.add(id);
    this.emit('selectionChanged', this.getSelectedIds());
  }

  /**
   * 取消选择
   */
  deselect(id: string): void {
    if (!this.selectedIds.has(id)) return;

    this.selectedIds.delete(id);
    this.emit('selectionChanged', this.getSelectedIds());
  }

  /**
   * 选择多个元素
   */
  selectMultiple(ids: string[]): void {
    this.selectedIds.clear();
    ids.forEach((id) => this.selectedIds.add(id));
    this.emit('selectionChanged', this.getSelectedIds());
  }

  /**
   * 清空选择
   */
  clear(): void {
    if (this.selectedIds.size === 0) return;

    this.selectedIds.clear();
    this.emit('selectionChanged', this.getSelectedIds());
  }

  /**
   * 切换选择状态
   */
  toggle(id: string): void {
    if (this.selectedIds.has(id)) {
      this.deselect(id);
    } else {
      this.add(id);
    }
  }
}

