import { EventEmitter } from '../utils/EventEmitter';

/**
 * 键盘事件（自定义类型，避免与 DOM KeyboardEvent 冲突）
 */
export interface KeyboardEventData {
  key: string;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  metaKey: boolean;
  preventDefault?: () => void;
}

/**
 * 快捷键处理器
 */
export type KeyboardHandler = (event: KeyboardEventData) => void;

/**
 * 键盘管理器事件
 */
export interface KeyboardManagerEvents extends Record<string, any[]> {
  keyDown: [event: KeyboardEventData];
  keyUp: [event: KeyboardEventData];
}

/**
 * 键盘管理器
 * 管理快捷键绑定和处理
 */
export class KeyboardManager extends EventEmitter<KeyboardManagerEvents> {
  private handlers: Map<string, KeyboardHandler[]> = new Map();
  private isEnabled: boolean = true;

  constructor() {
    super();
    this.setupGlobalListeners();
  }

  /**
   * 设置全局监听器
   */
  private setupGlobalListeners(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('keydown', (e) => {
      if (!this.isEnabled) return;

      const event: KeyboardEventData = {
        key: e.key,
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
        altKey: e.altKey,
        metaKey: e.metaKey,
      };

      this.emit('keyDown', event);
      this.handleKeyDown(event, e);
    });

    window.addEventListener('keyup', (e) => {
      if (!this.isEnabled) return;

      const event: KeyboardEventData = {
        key: e.key,
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
        altKey: e.altKey,
        metaKey: e.metaKey,
      };

      this.emit('keyUp', event);
    });
  }

  /**
   * 处理按键按下
   */
  private handleKeyDown(event: KeyboardEventData, nativeEvent: globalThis.KeyboardEvent): void {
    // 生成快捷键字符串（例如：Ctrl+C, Cmd+V）
    const shortcut = this.getShortcutString(event);
    const handlers = this.handlers.get(shortcut);

    if (handlers && handlers.length > 0) {
      // 阻止默认行为
      nativeEvent.preventDefault();
      // 调用所有处理器
      handlers.forEach((handler) => {
        try {
          handler(event);
        } catch (error) {
          console.error('Error in keyboard handler:', error);
        }
      });
    }
  }

  /**
   * 注册快捷键
   */
  register(shortcut: string, handler: KeyboardHandler): void {
    const normalized = this.normalizeShortcut(shortcut);
    if (!this.handlers.has(normalized)) {
      this.handlers.set(normalized, []);
    }
    this.handlers.get(normalized)!.push(handler);
  }

  /**
   * 取消注册快捷键
   */
  unregister(shortcut: string, handler?: KeyboardHandler): void {
    const normalized = this.normalizeShortcut(shortcut);
    if (!handler) {
      // 移除所有处理器
      this.handlers.delete(normalized);
    } else {
      // 移除特定处理器
      const handlers = this.handlers.get(normalized);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index !== -1) {
          handlers.splice(index, 1);
        }
        if (handlers.length === 0) {
          this.handlers.delete(normalized);
        }
      }
    }
  }

  /**
   * 启用/禁用键盘管理器
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * 标准化快捷键字符串
   * 例如：'Ctrl+C' -> 'ctrl+c', 'Cmd+V' -> 'meta+v'
   */
  private normalizeShortcut(shortcut: string): string {
    return shortcut
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/cmd|command/g, 'meta')
      .replace(/ctrl/g, 'ctrl');
  }

  /**
   * 生成快捷键字符串
   */
  private getShortcutString(event: KeyboardEventData): string {
    const parts: string[] = [];

    if (event.ctrlKey) parts.push('ctrl');
    if (event.metaKey) parts.push('meta');
    if (event.shiftKey) parts.push('shift');
    if (event.altKey) parts.push('alt');

    // 按键名称（小写）
    const key = event.key.toLowerCase();
    if (key !== 'control' && key !== 'meta' && key !== 'shift' && key !== 'alt') {
      parts.push(key);
    }

    return parts.join('+');
  }
}

