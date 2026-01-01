import { useState, useEffect } from 'react';
import {
  AlignLeft,
  AlignRight,
  AlignCenter,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyEnd,
  Space,
} from 'lucide-react';
import {
  Editor,
  AlignmentType,
  DistributionType,
  AlignElementsCommand,
  DistributeElementsCommand,
} from '@proteus/core';

interface AlignmentToolbarProps {
  editor: Editor;
}

/**
 * 对齐工具栏
 * 提供对齐和分布功能的浮动工具栏
 */
export function AlignmentToolbar({ editor }: AlignmentToolbarProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateSelection = () => {
      const ids = editor.selectionManager.getSelectedIds();
      setSelectedIds(ids);
      setIsVisible(ids.size >= 2); // 至少选中 2 个元素才显示
    };

    updateSelection();

    editor.selectionManager.on('selectionChanged', updateSelection);

    return () => {
      editor.selectionManager.off('selectionChanged', updateSelection);
    };
  }, [editor]);

  const handleAlign = (alignment: AlignmentType) => {
    const ids = Array.from(selectedIds);
    if (ids.length < 2) return;

    const command = new AlignElementsCommand(editor.scene, ids, alignment);
    editor.executeCommand(command);
    editor.requestRender();
  };

  const handleDistribute = (distribution: DistributionType) => {
    const ids = Array.from(selectedIds);
    if (ids.length < 3) return;

    const command = new DistributeElementsCommand(editor.scene, ids, distribution);
    editor.executeCommand(command);
    editor.requestRender();
  };

  if (!isVisible) return null;

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-lg border border-gray-200 z-40 flex items-center gap-1 p-1.5">
      {/* 水平对齐 */}
      <div className="flex items-center gap-0.5 border-r border-gray-200 pr-1.5 mr-1.5">
        <button
          onClick={() => handleAlign(AlignmentType.LEFT)}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
          title="左对齐"
        >
          <AlignLeft size={16} className="text-gray-600" />
        </button>
        <button
          onClick={() => handleAlign(AlignmentType.CENTER_H)}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
          title="水平居中"
        >
          <AlignCenter size={16} className="text-gray-600" />
        </button>
        <button
          onClick={() => handleAlign(AlignmentType.RIGHT)}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
          title="右对齐"
        >
          <AlignRight size={16} className="text-gray-600" />
        </button>
      </div>

      {/* 垂直对齐 */}
      <div className="flex items-center gap-0.5 border-r border-gray-200 pr-1.5 mr-1.5">
        <button
          onClick={() => handleAlign(AlignmentType.TOP)}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
          title="上对齐"
        >
          <AlignVerticalJustifyStart size={16} className="text-gray-600" />
        </button>
        <button
          onClick={() => handleAlign(AlignmentType.CENTER_V)}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
          title="垂直居中"
        >
          <AlignVerticalJustifyCenter size={16} className="text-gray-600" />
        </button>
        <button
          onClick={() => handleAlign(AlignmentType.BOTTOM)}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
          title="下对齐"
        >
          <AlignVerticalJustifyEnd size={16} className="text-gray-600" />
        </button>
      </div>

      {/* 分布 */}
      {selectedIds.size >= 3 && (
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => handleDistribute(DistributionType.HORIZONTAL)}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
            title="水平等距分布"
          >
            <Space size={16} className="text-gray-600 rotate-90" />
          </button>
          <button
            onClick={() => handleDistribute(DistributionType.VERTICAL)}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
            title="垂直等距分布"
          >
            <Space size={16} className="text-gray-600" />
          </button>
        </div>
      )}
    </div>
  );
}

