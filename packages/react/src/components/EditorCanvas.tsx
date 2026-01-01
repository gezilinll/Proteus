import { useEffect, useRef, useState, useCallback } from 'react';
import { Editor, screenToCanvas } from '@proteus/core';

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

    // 计算缩放增量（向下滚动缩小，向上滚动放大）
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    editor.viewport.zoomBy(delta, mouseX, mouseY);
  };

  // 键盘状态跟踪
  const spaceKeyRef = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        spaceKeyRef.current = true;
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
  }, []);

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

    // 空格键 + 左键 或 中键 = 拖拽视口
    if (e.button === 1 || (e.button === 0 && spaceKeyRef.current)) {
      e.preventDefault();
      setIsDragging(true);
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        offsetX: editor.viewport.offsetX,
        offsetY: editor.viewport.offsetY,
      };
      return;
    }

    // 左键 = 选择或框选
    if (e.button === 0) {
      const coords = getCanvasCoordinates(e.clientX, e.clientY);
      editor.interactionManager.handleMouseDown(coords.x, coords.y, {
        ctrlKey: e.ctrlKey || e.metaKey,
        shiftKey: e.shiftKey,
      });
    }
  };

  // 鼠标移动（拖拽中或框选中）
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging && dragStartRef.current) {
      // 拖拽视口
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      editor.viewport.setOffset(
        dragStartRef.current.offsetX + deltaX,
        dragStartRef.current.offsetY + deltaY
      );
    } else {
      // 框选或交互
      const coords = getCanvasCoordinates(e.clientX, e.clientY);
      editor.interactionManager.handleMouseMove(coords.x, coords.y);
    }
  };

  // 鼠标抬起（结束拖拽或选择）
  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setIsDragging(false);
      dragStartRef.current = null;
    } else {
      const coords = getCanvasCoordinates(e.clientX, e.clientY);
      editor.interactionManager.handleMouseUp(coords.x, coords.y);
    }
  };

  // 鼠标离开画布（结束拖拽）
  const handleMouseLeave = () => {
    setIsDragging(false);
    dragStartRef.current = null;
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
      style={{
        cursor: isDragging ? 'grabbing' : 'default',
        width: `${width}px`,
        height: `${height}px`,
      }}
    />
  );
}
