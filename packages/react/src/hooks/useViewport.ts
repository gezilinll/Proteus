import { useEditor } from './useEditor';

/**
 * 使用 Viewport Hook
 * 获取视口状态和操作
 */
export function useViewport() {
  const editor = useEditor();
  const viewport = editor.viewport;

  // 注意：Viewport 目前没有事件系统，视口变化时由 EditorCanvas 组件处理重渲染
  // 后续可以在 Viewport 中添加事件支持，这里暂时不需要 useEffect

  return {
    viewport,
    zoom: viewport.zoom,
    offsetX: viewport.offsetX,
    offsetY: viewport.offsetY,
    setZoom: (zoom: number, centerX?: number, centerY?: number) => {
      viewport.setZoom(zoom, centerX, centerY);
      editor.requestRender();
    },
    zoomBy: (delta: number, centerX?: number, centerY?: number) => {
      viewport.zoomBy(delta, centerX, centerY);
      editor.requestRender();
    },
    setOffset: (x: number, y: number) => {
      viewport.setOffset(x, y);
      editor.requestRender();
    },
    offsetBy: (deltaX: number, deltaY: number) => {
      viewport.offsetBy(deltaX, deltaY);
      editor.requestRender();
    },
    reset: () => {
      viewport.reset();
      editor.requestRender();
    },
  };
}

