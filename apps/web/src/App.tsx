import { useState, useCallback } from 'react';
import { EditorCanvas } from '@proteus/react';
import { Editor, createElement, ElementType, AddElementCommand } from '@proteus/core';

function App() {
  const [editor] = useState(() => new Editor());
  const [, forceUpdate] = useState({});

  // 触发 UI 更新
  const refreshUI = useCallback(() => {
    forceUpdate({});
  }, []);

  // 添加测试元素
  const addRectangle = () => {
    const element = createElement(ElementType.RECTANGLE, {
      transform: { x: 100, y: 100, width: 200, height: 150 },
      style: { fill: '#3b82f6', stroke: '#1e40af', strokeWidth: 2 },
    });
    const command = new AddElementCommand(editor.scene, element);
    editor.executeCommand(command);
    refreshUI();
  };

  const addCircle = () => {
    const element = createElement(ElementType.ELLIPSE, {
      transform: { x: 300, y: 200, width: 150, height: 150 },
      style: { fill: '#ef4444', stroke: '#dc2626', strokeWidth: 2 },
    });
    const command = new AddElementCommand(editor.scene, element);
    editor.executeCommand(command);
    refreshUI();
  };

  const addText = () => {
    const element = createElement(ElementType.TEXT, {
      transform: { x: 150, y: 300, width: 200, height: 50 },
      style: {
        fill: '#000000',
        fontSize: 24,
        fontFamily: 'Arial',
        text: 'Hello Proteus!',
      },
    });
    const command = new AddElementCommand(editor.scene, element);
    editor.executeCommand(command);
    refreshUI();
  };

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
      <div className="bg-white border-b border-gray-200 p-4 flex gap-2">
        <button
          onClick={addRectangle}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          添加矩形
        </button>
        <button
          onClick={addCircle}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          添加圆形
        </button>
        <button
          onClick={addText}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          添加文字
        </button>
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
