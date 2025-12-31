/**
 * 轻量级事件发射器
 * 用于 Scene 等模块的事件通知
 */
export class EventEmitter<T extends Record<string, any[]>> {
  private listeners: Map<keyof T, Set<(...args: any[]) => void>> = new Map();

  /**
   * 订阅事件
   */
  on<K extends keyof T>(event: K, listener: (...args: T[K]) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);

    // 返回取消订阅函数
    return () => {
      this.off(event, listener);
    };
  }

  /**
   * 取消订阅
   */
  off<K extends keyof T>(event: K, listener: (...args: T[K]) => void): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(listener);
      if (eventListeners.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  /**
   * 触发事件
   */
  emit<K extends keyof T>(event: K, ...args: T[K]): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      // 使用 Array.from 创建副本，避免在执行过程中修改 Set 导致的问题
      const listeners = Array.from(eventListeners);
      listeners.forEach((listener) => {
        try {
          listener(...args);
        } catch (error) {
          // 捕获错误但不中断其他 listener 的执行
          console.error(`Error in event listener for "${String(event)}":`, error);
        }
      });
    }
  }

  /**
   * 清除所有监听器
   */
  clear(): void {
    this.listeners.clear();
  }

  /**
   * 获取指定事件的监听器数量
   */
  listenerCount<K extends keyof T>(event: K): number {
    return this.listeners.get(event)?.size ?? 0;
  }
}

