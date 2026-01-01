import { RenderContext } from './RenderContext';
import { Viewport } from '../viewport/Viewport';
import { Scene } from '../scene/Scene';
import { Element } from '../types/element';
import { RendererRegistry } from './RendererRegistry';
import { SelectionManager } from '../selection/SelectionManager';
import { InteractionManager } from '../interaction/InteractionManager';
import { ToolManager } from '../tools/ToolManager';
import { SelectionOverlay } from './overlays/SelectionOverlay';
import { MarqueeOverlay } from './overlays/MarqueeOverlay';

/**
 * 渲染器
 * 负责将 Scene 中的元素渲染到 Canvas 上
 */
export class Renderer {
  private context: RenderContext | null = null;
  private animationFrameId: number | null = null;
  private isRendering: boolean = false;
  private registry: RendererRegistry;
  private selectionOverlay: SelectionOverlay;
  private marqueeOverlay: MarqueeOverlay;

  constructor(
    private canvas: HTMLCanvasElement,
    private scene: Scene,
    private viewport: Viewport,
    private dpr: number = 1,
    registry?: RendererRegistry,
    private selectionManager?: SelectionManager,
    private interactionManager?: InteractionManager,
    private toolManager?: ToolManager
  ) {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D context from canvas');
    }
    this.context = new RenderContext(ctx);
    this.registry = registry ?? new RendererRegistry();
    this.selectionOverlay = new SelectionOverlay();
    this.marqueeOverlay = new MarqueeOverlay();

    // 监听 Scene 变化
    this.scene.on('elementAdded', () => this.requestRender());
    this.scene.on('elementUpdated', () => this.requestRender());
    this.scene.on('elementRemoved', () => this.requestRender());
    this.scene.on('orderChanged', () => this.requestRender());

    // 监听选择变化
    if (this.selectionManager) {
      this.selectionManager.on('selectionChanged', () => this.requestRender());
    }

    // 监听交互状态变化
    if (this.interactionManager) {
      this.interactionManager.on('stateChanged', () => this.requestRender());
    }
  }

  /**
   * 开始渲染循环
   */
  start(): void {
    if (this.isRendering) return;
    this.isRendering = true;
    this.render();
  }

  /**
   * 停止渲染循环
   */
  stop(): void {
    this.isRendering = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * 请求渲染（用于外部触发）
   */
  requestRender(): void {
    if (!this.isRendering) {
      this.render();
    }
  }

  /**
   * 获取渲染器注册表
   */
  getRegistry(): RendererRegistry {
    return this.registry;
  }

  /**
   * 渲染一帧
   */
  private render(): void {
    if (!this.context) return;

    const { width, height } = this.canvas;
    const ctx = this.context;

    // 重置变换并清空画布
    ctx.resetTransform();
    ctx.clear(width, height);

    // 应用 DPR 缩放
    ctx.save();
    ctx.getRawContext().scale(this.dpr, this.dpr);

    // 应用视口变换
    const transform = this.viewport.getTransform();
    ctx.getRawContext().translate(transform.translateX, transform.translateY);
    ctx.getRawContext().scale(transform.scaleX, transform.scaleY);

    // 按顺序渲染所有元素
    const elements = this.scene.getOrdered();
    for (const element of elements) {
      if (!element.meta.visible) continue;
      this.renderElement(ctx, element);
    }

    // 渲染预览元素（在元素之上，但在 Overlay 之下）
    if (this.toolManager) {
      const currentTool = this.toolManager.getCurrentTool();
      const previewElement = currentTool?.getPreviewElement();
      if (previewElement) {
        this.renderElement(ctx, previewElement);
      }
    }

    // 渲染 Overlay（在元素之上）
    this.renderOverlays(ctx);

    ctx.restore();

    // 继续渲染循环
    if (this.isRendering) {
      this.animationFrameId = requestAnimationFrame(() => this.render());
    }
  }

  /**
   * 渲染单个元素
   */
  private renderElement(ctx: RenderContext, element: Element): void {
    // 获取对应的渲染器
    const renderer = this.registry.get(element.type);
    if (!renderer) {
      // 如果没有注册的渲染器，跳过
      console.warn(`No renderer registered for element type: ${element.type}`);
      return;
    }

    ctx.save();

    // 应用元素变换
    const { x, y, width, height, rotation } = element.transform;

    // 移动到元素中心
    ctx.getRawContext().translate(x + width / 2, y + height / 2);

    // 应用旋转
    if (rotation !== 0) {
      ctx.getRawContext().rotate(rotation);
    }

    // 使用注册的渲染器渲染
    renderer.render(ctx, element);

    ctx.restore();
  }

  /**
   * 渲染 Overlay
   */
  private renderOverlays(ctx: RenderContext): void {
    // 渲染选择框
    if (this.selectionManager) {
      const selectedIds = this.selectionManager.getSelectedIds();
      if (selectedIds.size > 0) {
        const selectedElements = Array.from(selectedIds)
          .map((id) => this.scene.get(id))
          .filter((el): el is Element => el !== undefined);

        if (selectedElements.length > 0) {
          const selectionBox = this.selectionOverlay.computeSelectionBox(selectedElements);
          if (selectionBox) {
            this.selectionOverlay.render(ctx, selectionBox);
          }
        }
      }
    }

    // 渲染框选矩形
    if (this.interactionManager) {
      const marqueeBounds = this.interactionManager.getMarqueeBoundsForRender();
      if (marqueeBounds) {
        this.marqueeOverlay.render(ctx, marqueeBounds);
      }
    }
  }

  /**
   * 销毁渲染器
   */
  destroy(): void {
    this.stop();
    this.context = null;
  }
}
