import { useEffect, useRef, useState, useCallback } from 'react';
import { Renderer, Scene, Viewport } from '@proteus/core';

export interface EditorCanvasProps {
  scene: Scene;
  viewport: Viewport;
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
  scene,
  viewport,
  width = 800,
  height = 600,
  className,
}: EditorCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<Renderer | null>(null);
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

  // 初始化渲染器
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = setupCanvas() ?? 1;
    const renderer = new Renderer(canvas, scene, viewport, dpr);
    rendererRef.current = renderer;
    renderer.start();

    return () => {
      renderer.destroy();
      rendererRef.current = null;
    };
  }, [scene, viewport, setupCanvas]);

  // 处理视口变化，触发重渲染
  useEffect(() => {
    rendererRef.current?.requestRender();
  }, [viewport.zoom, viewport.offsetX, viewport.offsetY]);

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
    viewport.zoomBy(delta, mouseX, mouseY);
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

  // 鼠标按下（开始拖拽）
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // 空格键 + 左键 或 中键
    if (e.button === 1 || (e.button === 0 && spaceKeyRef.current)) {
      e.preventDefault();
      setIsDragging(true);
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        offsetX: viewport.offsetX,
        offsetY: viewport.offsetY,
      };
    }
  };

  // 鼠标移动（拖拽中）
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging && dragStartRef.current) {
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      viewport.setOffset(
        dragStartRef.current.offsetX + deltaX,
        dragStartRef.current.offsetY + deltaY
      );
    }
  };

  // 鼠标抬起（结束拖拽）
  const handleMouseUp = () => {
    setIsDragging(false);
    dragStartRef.current = null;
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

