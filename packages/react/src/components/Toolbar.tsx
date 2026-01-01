import { useState, useEffect } from 'react';
import { Editor } from '@proteus/core';

export interface ToolbarProps {
  editor: Editor;
}

/**
 * 工具栏组件
 * 显示所有可用工具，允许切换工具
 */
export function Toolbar({ editor }: ToolbarProps) {
  const [currentToolName, setCurrentToolName] = useState<string | null>(
    editor.toolManager.getCurrentTool()?.name ?? null
  );

  // 监听工具变化
  useEffect(() => {
    const handleToolChanged = (tool: { name: string }) => {
      setCurrentToolName(tool.name);
    };

    editor.toolManager.on('toolChanged', handleToolChanged);

    return () => {
      editor.toolManager.off('toolChanged', handleToolChanged);
    };
  }, [editor.toolManager]);

  const tools = editor.toolManager.getAllTools();

  const handleToolClick = (toolName: string) => {
    editor.toolManager.setTool(toolName);
  };

  return (
    <div className="flex gap-2 p-2 bg-white border-b border-gray-200 shadow-sm">
      {tools.map((tool) => {
        const isActive = currentToolName === tool.name;
        return (
          <button
            key={tool.name}
            onClick={() => handleToolClick(tool.name)}
            className={`
              px-4 py-2 rounded-md font-medium text-sm transition-colors
              ${isActive
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
            title={`${tool.name} (${tool.shortcut})`}
          >
            <span className="mr-2">{tool.icon}</span>
            {tool.name}
            {tool.shortcut && (
              <span className="ml-2 text-xs opacity-75">
                ({tool.shortcut})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

