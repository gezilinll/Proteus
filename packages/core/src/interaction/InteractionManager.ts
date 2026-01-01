import { EventEmitter } from '../utils/EventEmitter';
import { SelectionManager } from '../selection/SelectionManager';
import { HitTester } from './HitTester';
import { ControlPointHitTester } from './ControlPointHitTester';
import { DragHandler } from './handlers/DragHandler';
import { ResizeHandler } from './handlers/ResizeHandler';
import { RotateHandler } from './handlers/RotateHandler';
import { Scene } from '../scene/Scene';
import { Viewport } from '../viewport/Viewport';
import { Editor } from '../Editor';
import { ControlPointType } from '../renderer/overlays/SelectionOverlay';

/**
 * 交互状态
 */
export enum InteractionState {
  /** 空闲状态 */
  IDLE = 'idle',
  /** 框选状态 */
  SELECTING = 'selecting',
  /** 拖拽移动状态 */
  DRAGGING = 'dragging',
  /** 缩放状态 */
  RESIZING = 'resizing',
  /** 旋转状态 */
  ROTATING = 'rotating',
}

/**
 * 交互管理器事件
 */
export interface InteractionManagerEvents extends Record<string, any[]> {
  stateChanged: [state: InteractionState];
}

/**
 * 交互管理器
 * 管理用户交互（点击、拖拽、框选等）
 */
export class InteractionManager extends EventEmitter<InteractionManagerEvents> {
  private state: InteractionState = InteractionState.IDLE;
  private hitTester: HitTester;
  private controlPointHitTester: ControlPointHitTester;
  private dragHandler: DragHandler;
  private resizeHandler: ResizeHandler;
  private rotateHandler: RotateHandler;
  private marqueeStart: { x: number; y: number } | null = null;

  constructor(
    private scene: Scene,
    _viewport: Viewport,
    private selectionManager: SelectionManager,
    private editor?: Editor
  ) {
    super();
    this.hitTester = new HitTester(scene);
    this.controlPointHitTester = new ControlPointHitTester();
    this.dragHandler = new DragHandler(scene);
    this.resizeHandler = new ResizeHandler(scene);
    this.rotateHandler = new RotateHandler(scene);
  }

  /**
   * 获取当前状态
   */
  getState(): InteractionState {
    return this.state;
  }

  /**
   * 获取框选状态（用于渲染）
   */
  getMarqueeBounds(): { startX: number; startY: number; endX: number; endY: number } | null {
    if (this.state !== InteractionState.SELECTING || !this.marqueeStart) {
      return null;
    }
    // 注意：这里返回的是开始位置，结束位置需要在渲染时从外部传入
    // 或者我们需要存储当前鼠标位置
    return null; // 暂时返回 null，后续优化
  }

  /**
   * 获取当前框选结束位置（用于实时渲染）
   */
  private currentMarqueeEnd: { x: number; y: number } | null = null;

  /**
   * 设置当前框选结束位置
   */
  setMarqueeEnd(x: number, y: number): void {
    if (this.state === InteractionState.SELECTING) {
      this.currentMarqueeEnd = { x, y };
    }
  }

  /**
   * 获取完整的框选边界（用于渲染）
   */
  getMarqueeBoundsForRender(): { startX: number; startY: number; endX: number; endY: number } | null {
    if (this.state !== InteractionState.SELECTING || !this.marqueeStart || !this.currentMarqueeEnd) {
      return null;
    }
    return {
      startX: this.marqueeStart.x,
      startY: this.marqueeStart.y,
      endX: this.currentMarqueeEnd.x,
      endY: this.currentMarqueeEnd.y,
    };
  }

  /**
   * 处理鼠标按下
   */
  handleMouseDown(
    canvasX: number,
    canvasY: number,
    options?: {
      /** 是否按住 Ctrl/Cmd */
      ctrlKey?: boolean;
      /** 是否按住 Shift */
      shiftKey?: boolean;
      /** 是否按住 Alt */
      altKey?: boolean;
    }
  ): void {
    const ctrlKey = options?.ctrlKey ?? false;
    const shiftKey = options?.shiftKey ?? false;
    const altKey = options?.altKey ?? false;

    // 先检查是否点击到控制点
    const selectedIds = Array.from(this.selectionManager.getSelectedIds());
    if (selectedIds.length > 0) {
      const selectedElements = selectedIds
        .map((id) => this.scene.get(id))
        .filter((el) => el !== undefined);

      const controlPoint = this.controlPointHitTester.hitTestFromSelection(
        canvasX,
        canvasY,
        selectedElements
      );

      if (controlPoint) {
        // 点击到控制点，开始缩放或旋转
        if (controlPoint.type === ControlPointType.ROTATE) {
          // 开始旋转
          this.rotateHandler.start(selectedIds, canvasX, canvasY, {
            snapToAngle: shiftKey,
          });
          this.setState(InteractionState.ROTATING);
        } else {
          // 开始缩放
          this.resizeHandler.start(selectedIds, controlPoint.type, canvasX, canvasY, {
            keepAspectRatio: shiftKey,
            fromCenter: altKey,
          });
          this.setState(InteractionState.RESIZING);
        }
        return;
      }
    }

    // 命中检测
    const hits = this.hitTester.hitTest(canvasX, canvasY);

    if (hits.length > 0) {
      // 点击到元素
      const hitElement = hits[0].element;

      if (ctrlKey || shiftKey) {
        // 多选模式：切换选择状态
        this.selectionManager.toggle(hitElement.id);
      } else {
        // 单选模式
        if (this.selectionManager.isSelected(hitElement.id)) {
          // 已选中，开始拖拽
          const selectedIds = Array.from(this.selectionManager.getSelectedIds());
          this.dragHandler.start(selectedIds, canvasX, canvasY);
          this.setState(InteractionState.DRAGGING);
        } else {
          // 未选中，选择它
          this.selectionManager.select(hitElement.id);
        }
      }
    } else {
      // 点击空白区域
      if (!ctrlKey && !shiftKey) {
        // 清空选择
        this.selectionManager.clear();
      }
      // 开始框选
      this.startMarquee(canvasX, canvasY);
    }
  }

  /**
   * 处理鼠标移动
   */
  handleMouseMove(canvasX: number, canvasY: number): void {
    if (this.state === InteractionState.SELECTING && this.marqueeStart) {
      // 更新框选区域
      this.setMarqueeEnd(canvasX, canvasY);
      this.updateMarquee(this.marqueeStart.x, this.marqueeStart.y, canvasX, canvasY);
    } else if (this.state === InteractionState.DRAGGING) {
      // 更新拖拽
      this.dragHandler.update(canvasX, canvasY);
      if (this.editor) {
        this.editor.requestRender();
      }
    } else if (this.state === InteractionState.RESIZING) {
      // 更新缩放
      this.resizeHandler.update(canvasX, canvasY);
      if (this.editor) {
        this.editor.requestRender();
      }
    } else if (this.state === InteractionState.ROTATING) {
      // 更新旋转
      this.rotateHandler.update(canvasX, canvasY);
      if (this.editor) {
        this.editor.requestRender();
      }
    }
  }

  /**
   * 处理鼠标抬起
   */
  handleMouseUp(canvasX: number, canvasY: number): void {
    if (this.state === InteractionState.SELECTING && this.marqueeStart) {
      // 完成框选
      this.finishMarquee(this.marqueeStart.x, this.marqueeStart.y, canvasX, canvasY);
    } else if (this.state === InteractionState.DRAGGING) {
      // 完成拖拽，生成命令
      const command = this.dragHandler.finish();
      if (command && this.editor) {
        this.editor.executeCommand(command);
      }
      this.setState(InteractionState.IDLE);
    } else if (this.state === InteractionState.RESIZING) {
      // 完成缩放，生成命令
      const command = this.resizeHandler.finish();
      if (command && this.editor) {
        this.editor.executeCommand(command);
      }
      this.setState(InteractionState.IDLE);
    } else if (this.state === InteractionState.ROTATING) {
      // 完成旋转，生成命令
      const command = this.rotateHandler.finish();
      if (command && this.editor) {
        this.editor.executeCommand(command);
      }
      this.setState(InteractionState.IDLE);
    }
  }

  /**
   * 开始框选
   */
  private startMarquee(x: number, y: number): void {
    this.marqueeStart = { x, y };
    this.setState(InteractionState.SELECTING);
  }

  /**
   * 更新框选
   */
  private updateMarquee(_startX: number, _startY: number, _endX: number, _endY: number): void {
    // 框选过程中可以实时高亮被选中的元素
    // 这里暂时不实现，后续可以添加
  }

  /**
   * 完成框选
   */
  private finishMarquee(startX: number, startY: number, endX: number, endY: number): void {
    const selected = this.hitTester.testMarquee(startX, startY, endX, endY);
    const selectedIds = selected.map((el) => el.id);
    this.selectionManager.selectMultiple(selectedIds);

    this.marqueeStart = null;
    this.currentMarqueeEnd = null;
    this.setState(InteractionState.IDLE);
  }

  /**
   * 设置状态
   */
  private setState(newState: InteractionState): void {
    if (this.state === newState) return;

    this.state = newState;
    this.emit('stateChanged', newState);
  }
}

