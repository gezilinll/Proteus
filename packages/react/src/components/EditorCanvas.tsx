import { useEffect, useRef, useState, useCallback } from 'react';
import { Editor, screenToCanvas, CopyElementsCommand, CutElementsCommand, PasteElementsCommand, DeleteElementsCommand } from '@proteus/core';

export interface EditorCanvasProps {
  editor: Editor;
  width?: number;
  height?: number;
  className?: string;
}

/**
 * 获取设备像素比
 */
function getDevicePixelRatio(): number {
  return typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
}

/**
 * 编辑器画布组件
 * 负责渲染画布和处理用户交互
 */
export function EditorCanvas({
  editor,
  width = 800,
  height = 600,
  className,
}: EditorCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null);

  // 设置 Canvas 尺寸，处理 DPR
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = getDevicePixelRatio();
    
    // 设置物理像素尺寸
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    
    // 设置显示尺寸（CSS）
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    return dpr;
  }, [width, height]);

  // 初始化 Editor
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = setupCanvas() ?? 1;
    
    if (!editor.isInitialized()) {
      editor.init(canvas, dpr);
    }

    return () => {
      // 注意：不在这里销毁 Editor，由外部管理生命周期
    };
  }, [editor, setupCanvas]);

  // 处理视口变化，触发重渲染
  useEffect(() => {
    editor.requestRender();
  }, [editor.viewport.zoom, editor.viewport.offsetX, editor.viewport.offsetY, editor]);

  // 滚轮缩放
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // 计算缩放增量（更平滑的缩放：每次 3%）
    // 使用连续的缩放因子，基于滚轮滚动量
    const zoomIntensity = 0.002;
    const delta = Math.exp(-e.deltaY * zoomIntensity);
    editor.viewport.zoomBy(delta, mouseX, mouseY);
    
    // 立即请求重新渲染
    editor.requestRender();
  };

  // 键盘状态跟踪
  const spaceKeyRef = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 如果焦点在输入框或文本编辑器中，不处理快捷键
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        // 只处理删除键（在文本编辑器中）
        if ((e.key === 'Delete' || e.key === 'Backspace') && !target.isContentEditable) {
          const selectedIds = Array.from(editor.selectionManager.getSelectedIds());
          if (selectedIds.length > 0) {
            e.preventDefault();
            const command = new DeleteElementsCommand(editor.scene, selectedIds);
            editor.executeCommand(command);
            editor.requestRender();
          }
        }
        return;
      }

      if (e.code === 'Space') {
        spaceKeyRef.current = true;
        return;
      }

      const ctrlOrCmd = e.ctrlKey || e.metaKey;

      // 复制 (Ctrl/Cmd + C)
      if (ctrlOrCmd && e.key === 'c') {
        e.preventDefault();
        const selectedIds = Array.from(editor.selectionManager.getSelectedIds());
        if (selectedIds.length > 0) {
          const elements = selectedIds
            .map((id) => editor.scene.get(id))
            .filter((el) => el !== undefined);
          if (elements.length > 0) {
            const command = new CopyElementsCommand(editor.clipboardManager, elements);
            editor.executeCommand(command);
          }
        }
        return;
      }

      // 剪切 (Ctrl/Cmd + X)
      if (ctrlOrCmd && e.key === 'x') {
        e.preventDefault();
        const selectedIds = Array.from(editor.selectionManager.getSelectedIds());
        if (selectedIds.length > 0) {
          const elements = selectedIds
            .map((id) => editor.scene.get(id))
            .filter((el) => el !== undefined);
          if (elements.length > 0) {
            const command = new CutElementsCommand(editor.scene, editor.clipboardManager, elements);
            editor.executeCommand(command);
            editor.requestRender();
          }
        }
        return;
      }

      // 粘贴 (Ctrl/Cmd + V)
      if (ctrlOrCmd && e.key === 'v') {
        e.preventDefault();
        if (editor.clipboardManager.hasContent()) {
          const command = new PasteElementsCommand(editor.scene, editor.clipboardManager);
          editor.executeCommand(command);
          // 选中粘贴的元素
          const pastedIds = command.getPastedElementIds();
          if (pastedIds.length > 0) {
            editor.selectionManager.selectMultiple(pastedIds);
          }
          editor.requestRender();
        }
        return;
      }

      // 全选 (Ctrl/Cmd + A)
      if (ctrlOrCmd && e.key === 'a') {
        e.preventDefault();
        const allIds = editor.scene.getAllIds();
        editor.selectionManager.selectMultiple(allIds);
        editor.requestRender();
        return;
      }

      // 删除 (Delete/Backspace)
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        const selectedIds = Array.from(editor.selectionManager.getSelectedIds());
        if (selectedIds.length > 0) {
          const command = new DeleteElementsCommand(editor.scene, selectedIds);
          editor.executeCommand(command);
          editor.requestRender();
        }
        return;
      }

      // 工具快捷键
      const key = e.key.toUpperCase();
      const tool = editor.toolManager.getToolByShortcut(key);
      if (tool) {
        e.preventDefault();
        editor.toolManager.setTool(tool.name);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        spaceKeyRef.current = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [editor]);

  // 获取画布坐标
  const getCanvasCoordinates = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const screenX = clientX - rect.left;
    const screenY = clientY - rect.top;

    return screenToCanvas(screenX, screenY, {
      zoom: editor.viewport.zoom,
      offsetX: editor.viewport.offsetX,
      offsetY: editor.viewport.offsetY,
    });
  }, [editor.viewport]);

  // 鼠标按下（开始拖拽或选择）
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 阻止默认的文本选择行为
    e.preventDefault();

    // 空格键 + 左键 或 中键 = 拖拽视口
    if (e.button === 1 || (e.button === 0 && spaceKeyRef.current)) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        offsetX: editor.viewport.offsetX,
        offsetY: editor.viewport.offsetY,
      };
      return;
    }

    // 左键 = 使用当前工具
    if (e.button === 0) {
      const coords = getCanvasCoordinates(e.clientX, e.clientY);
      const currentTool = editor.toolManager.getCurrentTool();
      
      if (currentTool) {
        currentTool.onMouseDown(coords.x, coords.y, {
          ctrlKey: e.ctrlKey || e.metaKey,
          shiftKey: e.shiftKey,
          altKey: e.altKey,
        });
      }
    }
  };

  // 鼠标移动（拖拽中或框选中）
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // 阻止默认的文本选择行为
    if (isDragging || e.buttons !== 0) {
      e.preventDefault();
    }

    if (isDragging && dragStartRef.current) {
      // 拖拽视口
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      editor.viewport.setOffset(
        dragStartRef.current.offsetX + deltaX,
        dragStartRef.current.offsetY + deltaY
      );
    } else {
      // 使用当前工具
      const coords = getCanvasCoordinates(e.clientX, e.clientY);
      const currentTool = editor.toolManager.getCurrentTool();
      if (currentTool) {
        currentTool.onMouseMove(coords.x, coords.y);
      }
    }
  };

  // 鼠标抬起（结束拖拽或选择）
  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setIsDragging(false);
      dragStartRef.current = null;
    } else {
      const coords = getCanvasCoordinates(e.clientX, e.clientY);
      const currentTool = editor.toolManager.getCurrentTool();
      if (currentTool) {
        currentTool.onMouseUp(coords.x, coords.y);
      }
    }
  };

  // 鼠标离开画布（结束拖拽）
  const handleMouseLeave = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  // 根据当前工具获取鼠标样式
  const getCursor = () => {
    if (isDragging) return 'grabbing';
    
    const currentTool = editor.toolManager.getCurrentTool();
    if (!currentTool) return 'default';

    switch (currentTool.name) {
      case 'select':
        return 'default';
      case 'rectangle':
      case 'ellipse':
        return 'crosshair';
      case 'text':
        return 'text';
      case 'image':
        return 'copy';
      default:
        return 'default';
    }
  };

  return (
    <canvas
      ref={canvasRef}
      className={className}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onDragStart={(e) => e.preventDefault()} // 阻止拖拽图片等默认行为
      style={{
        cursor: getCursor(),
        width: `${width}px`,
        height: `${height}px`,
        userSelect: 'none', // CSS 方式阻止文本选择
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
      }}
    />
  );
}
