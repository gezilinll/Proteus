import { useState, useEffect, useRef } from 'react';
import { 
  MousePointer2, 
  Square, 
  Circle, 
  Type,
  Image as ImageIcon,
  Sparkles,
  Plus,
  Undo2,
  Redo2
} from 'lucide-react';
import { Editor } from '@proteus/core';

interface ToolPanelProps {
  editor: Editor;
}

// 工具图标映射
const toolIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  select: MousePointer2,
  rectangle: Square,
  ellipse: Circle,
  text: Type,
  image: ImageIcon,
};

// 工具分组配置 - Miro 风格
const toolGroups = [
  {
    name: 'main',
    tools: ['select'],
  },
  {
    name: 'create',
    tools: ['rectangle', 'ellipse', 'text', 'image'],
  },
];

/**
 * 左侧工具面板 - Miro 风格
 * 独立浮动的工具栏
 */
export function ToolPanel({ editor }: ToolPanelProps) {
  const [currentToolName, setCurrentToolName] = useState<string | null>(
    editor.toolManager.getCurrentTool()?.name ?? null
  );
  const [canUndo, setCanUndo] = useState(editor.canUndo());
  const [canRedo, setCanRedo] = useState(editor.canRedo());
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleToolChanged = (tool: { name: string }) => {
      setCurrentToolName(tool.name);
    };

    const updateUndoRedo = () => {
      setCanUndo(editor.canUndo());
      setCanRedo(editor.canRedo());
    };

    editor.toolManager.on('toolChanged', handleToolChanged);
    editor.scene.on('elementAdded', updateUndoRedo);
    editor.scene.on('elementRemoved', updateUndoRedo);
    editor.scene.on('elementUpdated', updateUndoRedo);

    return () => {
      editor.toolManager.off('toolChanged', handleToolChanged);
      editor.scene.off('elementAdded', updateUndoRedo);
      editor.scene.off('elementRemoved', updateUndoRedo);
      editor.scene.off('elementUpdated', updateUndoRedo);
    };
  }, [editor, editor.toolManager]);

  const handleToolClick = (toolName: string) => {
    editor.toolManager.setTool(toolName);
    
    // 如果选择图片工具，打开文件选择器
    if (toolName === 'image' && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(file => file.type.startsWith('image/'));
    if (files.length === 0) return;

    const tool = editor.toolManager.getTool('image');
    if (!tool || tool.name !== 'image') return;

    const imageTool = tool as any; // 临时使用 any，因为 ImageTool 类型未导出到 React 层
    
    // 设置图片源
    imageTool.setImageSource(files[0]);
    
    // 触发自定义事件，通知 CanvasArea 在画布中心创建图片
    // CanvasArea 会监听此事件并处理
    window.dispatchEvent(new CustomEvent('imageFileSelected', {
      detail: { file: files[0] }
    }));

    // 清空 input，允许重复选择同一文件
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const allTools = editor.toolManager.getAllTools();

  return (
    <div className="flex flex-col gap-2">
      {/* AI 功能按钮 - 独立浮动 */}
      <button
        className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 
                   flex items-center justify-center shadow-lg
                   hover:shadow-xl hover:scale-105 transition-all duration-200
                   group relative"
        title="AI Assistant"
      >
        <Sparkles size={22} className="text-white" />
        
        {/* 悬停提示 */}
        <div className="
          absolute left-full ml-3 px-3 py-1.5 rounded-lg
          bg-gray-900 text-white text-xs whitespace-nowrap
          opacity-0 group-hover:opacity-100 transition-opacity
          pointer-events-none shadow-xl z-50
        ">
          AI Assistant
        </div>
      </button>

      {/* 主工具栏 - 独立浮动 */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-1.5 flex flex-col gap-0.5">
        {toolGroups.map((group, groupIndex) => (
          <div key={group.name}>
            {groupIndex > 0 && (
              <div className="mx-2 my-1.5 h-px bg-gray-200" />
            )}
            
            {group.tools.map((toolName) => {
              const tool = allTools.find((t) => t.name === toolName);
              if (!tool) return null;

              const isActive = currentToolName === toolName;
              const IconComponent = toolIcons[toolName] || Square;

              return (
                <button
                  key={toolName}
                  onClick={() => handleToolClick(toolName)}
                  className={`
                    w-9 h-9 rounded-lg flex items-center justify-center
                    transition-all duration-150 relative group
                    ${isActive
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                    }
                  `}
                  title={`${tool.name} (${tool.shortcut})`}
                >
                  <IconComponent size={20} />
                  
                  {/* 悬停提示 */}
                  <div className="
                    absolute left-full ml-3 px-3 py-1.5 rounded-lg
                    bg-gray-900 text-white text-xs whitespace-nowrap
                    opacity-0 group-hover:opacity-100 transition-opacity
                    pointer-events-none shadow-xl z-50
                    flex items-center gap-2
                  ">
                    <span className="capitalize">{tool.name}</span>
                    <span className="px-1.5 py-0.5 bg-gray-700 rounded text-[10px]">{tool.shortcut}</span>
                  </div>
                </button>
              );
            })}
          </div>
        ))}

        {/* 分隔线 */}
        <div className="mx-2 my-1.5 h-px bg-gray-200" />

        {/* 更多工具按钮 */}
        <button
          className="w-9 h-9 rounded-lg flex items-center justify-center
                     text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all
                     group relative"
          title="More tools"
        >
          <Plus size={20} strokeWidth={1.5} />
          
          <div className="
            absolute left-full ml-3 px-3 py-1.5 rounded-lg
            bg-gray-900 text-white text-xs whitespace-nowrap
            opacity-0 group-hover:opacity-100 transition-opacity
            pointer-events-none shadow-xl z-50
          ">
            More tools
          </div>
        </button>
      </div>

      {/* 撤销/重做 - 独立浮动 */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-1.5 flex flex-col gap-0.5">
        <button
          onClick={() => { editor.undo(); setCanUndo(editor.canUndo()); setCanRedo(editor.canRedo()); }}
          disabled={!canUndo}
          className="w-9 h-9 rounded-lg flex items-center justify-center
                     text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all
                     disabled:opacity-30 disabled:cursor-not-allowed
                     group relative"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={18} />
          
          <div className="
            absolute left-full ml-3 px-3 py-1.5 rounded-lg
            bg-gray-900 text-white text-xs whitespace-nowrap
            opacity-0 group-hover:opacity-100 transition-opacity
            pointer-events-none shadow-xl z-50
          ">
            Undo
          </div>
        </button>
        <button
          onClick={() => { editor.redo(); setCanUndo(editor.canUndo()); setCanRedo(editor.canRedo()); }}
          disabled={!canRedo}
          className="w-9 h-9 rounded-lg flex items-center justify-center
                     text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all
                     disabled:opacity-30 disabled:cursor-not-allowed
                     group relative"
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo2 size={18} />
          
          <div className="
            absolute left-full ml-3 px-3 py-1.5 rounded-lg
            bg-gray-900 text-white text-xs whitespace-nowrap
            opacity-0 group-hover:opacity-100 transition-opacity
            pointer-events-none shadow-xl z-50
          ">
            Redo
          </div>
        </button>
      </div>

      {/* 隐藏的文件选择器（用于图片工具） */}
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
