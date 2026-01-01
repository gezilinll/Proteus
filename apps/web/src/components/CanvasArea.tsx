import { useRef, useCallback, useState, useEffect } from 'react';
import { EditorCanvas, TextEditOverlay } from '@proteus/react';
import { Editor, screenToCanvas, ImageTool } from '@proteus/core';
import { StatusBar } from './StatusBar';

// 网格配置常量
const GRID_CONFIG = {
  baseSize: 40,       // 100% 缩放时的网格大小（px）
  minSize: 5,         // 最小网格大小（px）
  maxSize: 300,       // 最大网格大小（px）
  comfortMin: 15,     // 舒适范围最小值（px），低于此值透明度降低
  comfortMax: 120,    // 舒适范围最大值（px），高于此值透明度降低
  normalOpacity: 0.6, // 正常透明度
  minOpacity: 0.3,    // 最低透明度
};

interface CanvasAreaProps {
  editor: Editor;
  onMouseMove?: (position: { x: number; y: number }) => void;
}

/**
 * 画布区域组件 - Miro 风格
 * 浅色网格背景，随 zoom 变化
 */
export function CanvasArea({ editor, onMouseMove }: CanvasAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(editor.viewport.zoom);
  const [offset, setOffset] = useState({ x: editor.viewport.offsetX, y: editor.viewport.offsetY });

  // 监听视口变化
  useEffect(() => {
    const handleZoomChanged = (newZoom: number) => {
      setZoom(newZoom);
    };

    const handleOffsetChanged = (newOffsetX: number, newOffsetY: number) => {
      setOffset({ x: newOffsetX, y: newOffsetY });
    };

    editor.viewport.on('zoomChanged', handleZoomChanged);
    editor.viewport.on('offsetChanged', handleOffsetChanged);

    return () => {
      editor.viewport.off('zoomChanged', handleZoomChanged);
      editor.viewport.off('offsetChanged', handleOffsetChanged);
    };
  }, [editor.viewport]);

  // 计算画布尺寸
  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDimensions({
        width: Math.floor(rect.width),
        height: Math.floor(rect.height),
      });
    }
  }, []);

  // 监听容器尺寸变化
  const handleRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      containerRef.current = node;
      updateDimensions();

      const resizeObserver = new ResizeObserver(updateDimensions);
      resizeObserver.observe(node);

      return () => {
        resizeObserver.disconnect();
      };
    }
    return undefined;
  }, [updateDimensions]);

  // 处理鼠标移动
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current || !onMouseMove) return;

    const rect = containerRef.current.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;

    const canvasPos = screenToCanvas(screenX, screenY, {
      zoom: editor.viewport.zoom,
      offsetX: editor.viewport.offsetX,
      offsetY: editor.viewport.offsetY,
    });

    onMouseMove(canvasPos);
  }, [editor, onMouseMove]);

  // 计算网格样式（随 zoom 连续变化，无跳跃）
  const rawGridSize = GRID_CONFIG.baseSize * zoom;
  
  // 限制网格大小在合理范围内
  const gridSize = Math.max(
    GRID_CONFIG.minSize,
    Math.min(GRID_CONFIG.maxSize, rawGridSize)
  );
  
  // 透明度：在舒适范围内正常，超出范围渐变降低
  const opacityRange = GRID_CONFIG.normalOpacity - GRID_CONFIG.minOpacity;
  let gridOpacity = GRID_CONFIG.normalOpacity;
  if (rawGridSize < GRID_CONFIG.comfortMin) {
    gridOpacity = GRID_CONFIG.minOpacity + opacityRange * (rawGridSize / GRID_CONFIG.comfortMin);
  } else if (rawGridSize > GRID_CONFIG.comfortMax) {
    gridOpacity = GRID_CONFIG.minOpacity + opacityRange * (GRID_CONFIG.comfortMax / rawGridSize);
  }

  const gridOffsetX = offset.x % gridSize;
  const gridOffsetY = offset.y % gridSize;

  // 图片导入处理
  const handleImageImport = useCallback((file: File, canvasX: number, canvasY: number) => {
    const tool = editor.toolManager.getTool('image');
    if (!tool || tool.name !== 'image') return;

    const imageTool = tool as ImageTool;
    // 设置图片源
    imageTool.setImageSource(file);
    
    // 模拟点击创建图片元素
    imageTool.onMouseDown(canvasX, canvasY);
  }, [editor]);

  // 文件选择器
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(file => file.type.startsWith('image/'));
    if (files.length === 0) return;

    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const canvasPos = screenToCanvas(centerX, centerY, {
      zoom: editor.viewport.zoom,
      offsetX: editor.viewport.offsetX,
      offsetY: editor.viewport.offsetY,
    });

    handleImageImport(files[0], canvasPos.x, canvasPos.y);
    
    // 清空 input，允许重复选择同一文件
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [editor, handleImageImport]);

  // 处理拖拽
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    if (files.length === 0) return;

    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;

    const canvasPos = screenToCanvas(screenX, screenY, {
      zoom: editor.viewport.zoom,
      offsetX: editor.viewport.offsetX,
      offsetY: editor.viewport.offsetY,
    });

    // 导入第一个图片文件
    handleImageImport(files[0], canvasPos.x, canvasPos.y);
  }, [editor, handleImageImport]);

  // 监听来自 ToolPanel 的图片文件选择事件
  useEffect(() => {
    const handleImageFileSelected = (e: CustomEvent<{ file: File }>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const canvasPos = screenToCanvas(centerX, centerY, {
        zoom: editor.viewport.zoom,
        offsetX: editor.viewport.offsetX,
        offsetY: editor.viewport.offsetY,
      });

      handleImageImport(e.detail.file, canvasPos.x, canvasPos.y);
    };

    window.addEventListener('imageFileSelected', handleImageFileSelected as EventListener);
    return () => {
      window.removeEventListener('imageFileSelected', handleImageFileSelected as EventListener);
    };
  }, [editor, handleImageImport]);

  // 处理粘贴
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = Array.from(e.clipboardData?.items || []);
      const imageItem = items.find(item => item.type.startsWith('image/'));

      if (!imageItem) return;

      e.preventDefault();
      e.stopPropagation();

      const file = imageItem.getAsFile();
      if (!file) return;

      // 在画布中心位置粘贴
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const canvasPos = screenToCanvas(centerX, centerY, {
        zoom: editor.viewport.zoom,
        offsetX: editor.viewport.offsetX,
        offsetY: editor.viewport.offsetY,
      });

      handleImageImport(file, canvasPos.x, canvasPos.y);
    };

    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [editor, handleImageImport]);

  return (
    <div
      ref={handleRef}
      className="relative w-full h-full overflow-hidden"
      style={{
        backgroundColor: '#f5f5f5',
        backgroundImage: `
          linear-gradient(rgba(200, 200, 200, ${gridOpacity}) 1px, transparent 1px),
          linear-gradient(90deg, rgba(200, 200, 200, ${gridOpacity}) 1px, transparent 1px)
        `,
        backgroundSize: `${gridSize}px ${gridSize}px`,
        backgroundPosition: `${gridOffsetX}px ${gridOffsetY}px`,
      }}
      onMouseMove={handleMouseMove}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* 画布容器 */}
      {dimensions.width > 0 && dimensions.height > 0 && (
        <>
          <EditorCanvas
            editor={editor}
            width={dimensions.width}
            height={dimensions.height}
            className="absolute inset-0"
          />
          {/* 文字编辑覆盖层 */}
          <TextEditOverlay editor={editor} />
        </>
      )}

      {/* 浮动状态栏 */}
      <StatusBar editor={editor} />

      {/* 隐藏的文件选择器 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={false}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
