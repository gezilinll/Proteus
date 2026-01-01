import { Scene } from './scene/Scene';
import { Viewport } from './viewport/Viewport';
import { Renderer } from './renderer/Renderer';
import { CommandHistory } from './command/CommandHistory';
import { Command } from './command/Command';
import { SelectionManager } from './selection/SelectionManager';
import { InteractionManager } from './interaction/InteractionManager';
import { ToolManager } from './tools/ToolManager';
import { SelectTool } from './tools/tools/SelectTool';
import { RectangleTool } from './tools/tools/RectangleTool';
import { EllipseTool } from './tools/tools/EllipseTool';
import { TextTool } from './tools/tools/TextTool';
import { ImageTool } from './tools/tools/ImageTool';

/**
 * Editor 主类
 * 整合所有核心模块，提供统一的编辑器接口
 */
export class Editor {
  public readonly scene: Scene;
  public readonly viewport: Viewport;
  public readonly commandHistory: CommandHistory;
  public readonly selectionManager: SelectionManager;
  public readonly interactionManager: InteractionManager;
  public readonly toolManager: ToolManager;
  private renderer: Renderer | null = null;

  constructor(options?: {
    scene?: Scene;
    viewport?: Viewport;
    commandHistory?: CommandHistory;
    selectionManager?: SelectionManager;
  }) {
    this.scene = options?.scene ?? new Scene();
    this.viewport = options?.viewport ?? new Viewport();
    this.commandHistory = options?.commandHistory ?? new CommandHistory();
    this.selectionManager = options?.selectionManager ?? new SelectionManager();
    this.interactionManager = new InteractionManager(
      this.scene,
      this.viewport,
      this.selectionManager,
      this
    );

    // 初始化工具管理器
    this.toolManager = new ToolManager();
    this.toolManager.register(new SelectTool(this.interactionManager, this));
    this.toolManager.register(new RectangleTool(this.scene, this));
    this.toolManager.register(new EllipseTool(this.scene, this));
    this.toolManager.register(new TextTool(this.scene, this));
    this.toolManager.register(new ImageTool(this.scene, this));

    // 设置默认工具
    this.toolManager.setTool('select');
  }

  /**
   * 初始化编辑器
   * @param canvas Canvas 元素
   * @param dpr 设备像素比（可选，默认自动检测）
   */
  init(canvas: HTMLCanvasElement, dpr?: number): void {
    if (this.renderer) {
      throw new Error('Editor is already initialized');
    }

    const devicePixelRatio = dpr ?? (typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1);

    this.renderer = new Renderer(
      canvas,
      this.scene,
      this.viewport,
      devicePixelRatio,
      undefined,
      this.selectionManager,
      this.interactionManager,
      this.toolManager
    );
    this.renderer.start();
  }

  /**
   * 执行命令
   */
  executeCommand(command: Command): void {
    this.commandHistory.execute(command);
  }

  /**
   * 撤销
   */
  undo(): boolean {
    return this.commandHistory.undo();
  }

  /**
   * 重做
   */
  redo(): boolean {
    return this.commandHistory.redo();
  }

  /**
   * 是否可以撤销
   */
  canUndo(): boolean {
    return this.commandHistory.canUndo();
  }

  /**
   * 是否可以重做
   */
  canRedo(): boolean {
    return this.commandHistory.canRedo();
  }

  /**
   * 请求重渲染
   */
  requestRender(): void {
    this.renderer?.requestRender();
  }

  /**
   * 获取渲染器（只读）
   */
  getRenderer(): Renderer | null {
    return this.renderer;
  }

  /**
   * 销毁编辑器
   */
  destroy(): void {
    if (this.renderer) {
      this.renderer.destroy();
      this.renderer = null;
    }
  }

  /**
   * 检查是否已初始化
   */
  isInitialized(): boolean {
    return this.renderer !== null;
  }
}
