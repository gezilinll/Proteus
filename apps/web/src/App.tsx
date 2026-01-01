import { useState, useCallback } from 'react';
import { EditorCanvas, Toolbar } from '@proteus/react';
import { Editor } from '@proteus/core';

function App() {
  const [editor] = useState(() => new Editor());
  const [, forceUpdate] = useState({});

  // 触发 UI 更新
  const refreshUI = useCallback(() => {
    forceUpdate({});
  }, []);


  const handleUndo = () => {
    editor.undo();
    refreshUI();
  };

  const handleRedo = () => {
    editor.redo();
    refreshUI();
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* 工具栏 */}
      <div className="bg-white border-b border-gray-200 p-4 flex gap-2 items-center">
        <Toolbar editor={editor} />
        <div className="ml-auto flex gap-2">
          <button
            onClick={handleUndo}
            disabled={!editor.canUndo()}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
          >
            撤销
          </button>
          <button
            onClick={handleRedo}
            disabled={!editor.canRedo()}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
          >
            重做
          </button>
        </div>
      </div>

      {/* 画布 */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <EditorCanvas
          editor={editor}
          width={1200}
          height={800}
          className="border border-gray-300 shadow-lg bg-white"
        />
      </div>

      {/* 状态栏 */}
      <div className="bg-white border-t border-gray-200 p-2 text-sm text-gray-600">
        缩放: {editor.viewport.zoom.toFixed(2)}x | 元素数: {editor.scene.size()} | 
        偏移: ({editor.viewport.offsetX.toFixed(0)}, {editor.viewport.offsetY.toFixed(0)})
      </div>
    </div>
  );
}

export default App;
