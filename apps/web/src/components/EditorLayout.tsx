import { ReactNode } from 'react';

interface EditorLayoutProps {
  topBar: ReactNode;
  leftPanel: ReactNode;
  canvas: ReactNode;
}

/**
 * 编辑器主布局 - Miro 风格
 * 浮动式布局：各组件独立浮动在画布上方
 */
export function EditorLayout({
  topBar,
  leftPanel,
  canvas,
}: EditorLayoutProps) {
  return (
    <div className="h-screen w-screen relative overflow-hidden">
      {/* 画布层（最底层） */}
      <div className="absolute inset-0">
        {canvas}
      </div>

      {/* 顶栏（浮动） */}
      <div className="absolute top-3 left-3 right-3 z-10 pointer-events-none">
        <div className="pointer-events-auto">
          {topBar}
        </div>
      </div>

      {/* 左侧工具栏（浮动） */}
      <div className="absolute left-3 top-20 z-10 pointer-events-auto">
        {leftPanel}
      </div>
    </div>
  );
}
