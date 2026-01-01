import { EventEmitter } from '../utils/EventEmitter';
import { Tool } from './Tool';
import { Element } from '../types/element';

/**
 * 工具管理器事件
 */
export interface ToolManagerEvents extends Record<string, any[]> {
  toolChanged: [tool: Tool];
  elementCreated: [element: Element];
}

/**
 * 工具管理器
 * 管理当前激活的工具
 */
export class ToolManager extends EventEmitter<ToolManagerEvents> {
  private currentTool: Tool | null = null;
  private tools: Map<string, Tool> = new Map();

  /**
   * 注册工具
   */
  register(tool: Tool): void {
    this.tools.set(tool.name, tool);
  }

  /**
   * 设置当前工具
   */
  setTool(toolName: string): void {
    const tool = this.tools.get(toolName);
    if (!tool) {
      throw new Error(`Tool "${toolName}" not found`);
    }

    // 取消之前工具的操作
    if (this.currentTool) {
      this.currentTool.cancel();
    }

    this.currentTool = tool;
    this.emit('toolChanged', tool);
  }

  /**
   * 获取当前工具
   */
  getCurrentTool(): Tool | null {
    return this.currentTool;
  }

  /**
   * 根据名称获取工具
   */
  getTool(toolName: string): Tool | null {
    return this.tools.get(toolName) ?? null;
  }

  /**
   * 根据快捷键获取工具
   */
  getToolByShortcut(shortcut: string): Tool | null {
    for (const tool of this.tools.values()) {
      if (tool.shortcut === shortcut) {
        return tool;
      }
    }
    return null;
  }

  /**
   * 获取所有工具
   */
  getAllTools(): Tool[] {
    return Array.from(this.tools.values());
  }
}

