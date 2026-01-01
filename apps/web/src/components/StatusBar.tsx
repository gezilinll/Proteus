import { useState, useEffect, useCallback } from 'react';
import { ZoomIn, ZoomOut, HelpCircle, Layers } from 'lucide-react';
import { Editor } from '@proteus/core';

interface StatusBarProps {
  editor: Editor;
  mousePosition?: { x: number; y: number };
  onLayersClick?: () => void;
}

// 预设缩放级别（匹配 Viewport 的 minZoom/maxZoom 范围：2%-500%）
const ZOOM_PRESETS = [0.05, 0.1, 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 5];

/**
 * 浮动状态栏 - Miro 风格
 * 右下角浮动的缩放控制和帮助按钮
 */
export function StatusBar({ editor, onLayersClick }: StatusBarProps) {
  const [zoom, setZoom] = useState(editor.viewport.zoom);

  // 监听状态变化
  useEffect(() => {
    const updateZoom = () => setZoom(editor.viewport.zoom);

    editor.viewport.on('zoomChanged', updateZoom);
    editor.viewport.on('offsetChanged', updateZoom);

    return () => {
      editor.viewport.off('zoomChanged', updateZoom);
      editor.viewport.off('offsetChanged', updateZoom);
    };
  }, [editor]);

  const handleZoomIn = useCallback(() => {
    const currentIndex = ZOOM_PRESETS.findIndex((z) => z >= zoom);
    const nextIndex = Math.min(currentIndex + 1, ZOOM_PRESETS.length - 1);
    editor.viewport.setZoom(ZOOM_PRESETS[nextIndex]);
  }, [editor, zoom]);

  const handleZoomOut = useCallback(() => {
    const currentIndex = ZOOM_PRESETS.findIndex((z) => z >= zoom);
    const prevIndex = Math.max(currentIndex - 1, 0);
    editor.viewport.setZoom(ZOOM_PRESETS[prevIndex]);
  }, [editor, zoom]);

  const formatZoom = (value: number) => `${Math.round(value * 100)}%`;

  return (
    <div className="absolute bottom-4 right-4 flex items-center gap-2">
      {/* 图层按钮 */}
      <button
        onClick={onLayersClick}
        className="w-10 h-10 bg-white rounded-lg shadow-md border border-gray-200
                   flex items-center justify-center text-gray-500 hover:text-gray-700
                   hover:bg-gray-50 transition-colors"
        title="Layers"
      >
        <Layers size={18} />
      </button>

      {/* 缩放控制 */}
      <div className="flex items-center bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 flex items-center justify-center text-gray-500 
                     hover:text-gray-700 hover:bg-gray-50 transition-colors border-r border-gray-200"
          title="Zoom out"
        >
          <ZoomOut size={18} />
        </button>

        {/* 缩放值（可点击选择预设） */}
        <div className="relative group">
          <button className="w-16 h-10 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            {formatZoom(zoom)}
          </button>
          
          {/* 缩放预设下拉菜单 */}
          <div className="
            absolute bottom-full mb-2 left-1/2 -translate-x-1/2
            bg-white rounded-lg shadow-xl border border-gray-200
            opacity-0 group-hover:opacity-100 transition-opacity
            pointer-events-none group-hover:pointer-events-auto
            py-1 min-w-[100px] z-50
          ">
            {ZOOM_PRESETS.map((preset) => (
              <button
                key={preset}
                onClick={() => editor.viewport.setZoom(preset)}
                className={`
                  w-full px-4 py-2 text-left text-sm
                  ${Math.abs(zoom - preset) < 0.01
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                {formatZoom(preset)}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleZoomIn}
          className="w-10 h-10 flex items-center justify-center text-gray-500 
                     hover:text-gray-700 hover:bg-gray-50 transition-colors border-l border-gray-200"
          title="Zoom in"
        >
          <ZoomIn size={18} />
        </button>
      </div>

      {/* 帮助按钮 */}
      <button
        className="w-10 h-10 bg-white rounded-lg shadow-md border border-gray-200
                   flex items-center justify-center text-gray-500 hover:text-gray-700
                   hover:bg-gray-50 transition-colors"
        title="Help"
      >
        <HelpCircle size={18} />
      </button>
    </div>
  );
}
