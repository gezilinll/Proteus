import { useState, useEffect, useRef, useMemo } from 'react';
import { Eye, EyeOff, Lock, Unlock, Layers, GripVertical } from 'lucide-react';
import { Editor, Element, ElementType, UpdateElementCommand, ReorderElementsCommand } from '@proteus/core';
import { getElementThumbnail } from '../utils/elementThumbnail';

interface LayerPanelProps {
  editor: Editor;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 图层面板
 * 显示所有图层，支持拖拽排序、显示/隐藏、锁定/解锁、重命名
 */
export function LayerPanel({ editor, isOpen, onClose }: LayerPanelProps) {
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [dropPosition, setDropPosition] = useState<'before' | 'after' | null>(null);
  const [editingElementId, setEditingElementId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');
  const editInputRef = useRef<HTMLInputElement>(null);

  // 获取渲染器注册表
  const registry = useMemo(() => {
    return editor.getRendererRegistry();
  }, [editor]);

  // 更新元素列表
  const updateElements = () => {
    const ordered = editor.scene.getOrdered();
    setElements([...ordered]);
  };

  // 更新选择状态
  const updateSelection = () => {
    setSelectedIds(editor.selectionManager.getSelectedIds());
  };

  useEffect(() => {
    updateElements();
    updateSelection();

    const handleElementAdded = () => updateElements();
    const handleElementRemoved = () => {
      updateElements();
      updateSelection();
    };
    const handleElementUpdated = () => updateElements();
    const handleOrderChanged = () => updateElements();
    const handleSelectionChanged = (ids: Set<string>) => setSelectedIds(new Set(ids));

    editor.scene.on('elementAdded', handleElementAdded);
    editor.scene.on('elementRemoved', handleElementRemoved);
    editor.scene.on('elementUpdated', handleElementUpdated);
    editor.scene.on('orderChanged', handleOrderChanged);
    editor.selectionManager.on('selectionChanged', handleSelectionChanged);

    return () => {
      editor.scene.off('elementAdded', handleElementAdded);
      editor.scene.off('elementRemoved', handleElementRemoved);
      editor.scene.off('elementUpdated', handleElementUpdated);
      editor.scene.off('orderChanged', handleOrderChanged);
      editor.selectionManager.off('selectionChanged', handleSelectionChanged);
    };
  }, [editor]);

  // 切换显示/隐藏
  const toggleVisible = (element: Element) => {
    const command = new UpdateElementCommand(editor.scene, element.id, {
      meta: { ...element.meta, visible: !element.meta.visible },
    });
    editor.executeCommand(command);
  };

  // 切换锁定/解锁
  const toggleLocked = (element: Element) => {
    const command = new UpdateElementCommand(editor.scene, element.id, {
      meta: { ...element.meta, locked: !element.meta.locked },
    });
    editor.executeCommand(command);
  };

  // 选择元素
  const selectElement = (element: Element, ctrlKey: boolean) => {
    if (ctrlKey) {
      editor.selectionManager.toggle(element.id);
    } else {
      editor.selectionManager.select(element.id);
    }
  };

  // 开始编辑名称
  const startEditing = (element: Element) => {
    setEditingElementId(element.id);
    setEditingName(getElementName(element));
    setTimeout(() => {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }, 0);
  };

  // 保存名称
  const saveName = (element: Element) => {
    const newName = editingName.trim();
    const command = new UpdateElementCommand(editor.scene, element.id, {
      meta: { ...element.meta, name: newName || undefined },
    });
    editor.executeCommand(command);
    setEditingElementId(null);
    setEditingName('');
  };

  // 取消编辑
  const cancelEditing = () => {
    setEditingElementId(null);
    setEditingName('');
  };

  // 拖拽开始
  const handleDragStart = (e: React.DragEvent, element: Element) => {
    setDraggedId(element.id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', element.id);
  };

  // 拖拽结束
  const handleDragEnd = () => {
    setDraggedId(null);
    setDropTargetId(null);
    setDropPosition(null);
  };

  // 拖拽悬停
  const handleDragOver = (e: React.DragEvent, element: Element) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';

    if (!draggedId || draggedId === element.id) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    const threshold = rect.height / 2;
    const newPosition = mouseY < threshold ? 'before' : 'after';

    // 只在状态变化时更新，避免不必要的重渲染
    if (dropTargetId !== element.id || dropPosition !== newPosition) {
      setDropTargetId(element.id);
      setDropPosition(newPosition);
    }
  };

  // 拖拽离开
  const handleDragLeave = (e: React.DragEvent) => {
    const relatedTarget = e.relatedTarget as HTMLElement | null;
    const currentTarget = e.currentTarget as HTMLElement;

    // 如果 relatedTarget 是当前元素的子元素，不清除状态
    if (relatedTarget && currentTarget.contains(relatedTarget)) {
      return;
    }

    setDropTargetId(null);
    setDropPosition(null);
  };

  // 放置
  const handleDrop = (e: React.DragEvent, targetElement: Element) => {
    e.preventDefault();

    if (!draggedId || draggedId === targetElement.id || !dropPosition) {
      handleDragEnd();
      return;
    }

    // order 数组：底层在前（索引小），顶层在后（索引大）
    // UI 用 reverse() 显示：顶层在上，底层在下
    // 所以：
    // - UI 中拖到目标"上方"（before）= 希望在 UI 中显示在目标上面 = 在 order 中应该在目标后面（索引更大）
    // - UI 中拖到目标"下方"（after）= 希望在 UI 中显示在目标下面 = 在 order 中应该在目标前面（索引更小）

    const currentOrder = editor.scene.getOrder();
    const draggedIndex = currentOrder.indexOf(draggedId);
    const targetIndex = currentOrder.indexOf(targetElement.id);

    if (draggedIndex === -1 || targetIndex === -1) {
      handleDragEnd();
      return;
    }

    const newOrder = [...currentOrder];
    newOrder.splice(draggedIndex, 1);

    // 计算新的目标索引（移除拖拽元素后）
    let newTargetIndex = targetIndex;
    if (draggedIndex < targetIndex) {
      newTargetIndex -= 1;
    }

    // 根据放置位置决定插入点
    let insertIndex: number;
    if (dropPosition === 'before') {
      // UI 中放在目标上方 = order 中放在目标后面
      insertIndex = newTargetIndex + 1;
    } else {
      // UI 中放在目标下方 = order 中放在目标前面
      insertIndex = newTargetIndex;
    }

    insertIndex = Math.max(0, Math.min(insertIndex, newOrder.length));
    newOrder.splice(insertIndex, 0, draggedId);

    const command = new ReorderElementsCommand(editor.scene, newOrder);
    editor.executeCommand(command);

    handleDragEnd();
  };

  // 获取元素显示名称
  const getElementName = (element: Element): string => {
    if (element.meta.name) return element.meta.name;
    switch (element.type) {
      case ElementType.RECTANGLE: return 'Rectangle';
      case ElementType.ELLIPSE: return 'Ellipse';
      case ElementType.TEXT: return element.style.text || 'Text';
      case ElementType.IMAGE: return 'Image';
      default: return 'Element';
    }
  };

  // 获取元素缩略图
  const getElementThumbnailUrl = (element: Element): string | null => {
    if (!registry) return null;
    try {
      return getElementThumbnail(element, registry, 64); // 使用更大的尺寸
    } catch (error) {
      console.warn('Failed to generate thumbnail:', element.id, error);
      return null;
    }
  };

  // 获取元素图标颜色
  const getElementColor = (element: Element): string => {
    switch (element.type) {
      case ElementType.RECTANGLE: return 'bg-blue-500';
      case ElementType.ELLIPSE: return 'bg-green-500';
      case ElementType.TEXT: return 'bg-purple-500';
      case ElementType.IMAGE: return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  if (!isOpen) return null;

  // UI 显示顺序：reverse 后顶层在上
  const displayElements = [...elements].reverse();

  return (
    <div className="absolute right-3 top-20 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50 flex flex-col max-h-[calc(100vh-6rem)]">
      {/* 标题栏 */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Layers size={18} className="text-gray-600" />
          <h3 className="font-semibold text-sm text-gray-800">Layers</h3>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          ×
        </button>
      </div>

      {/* 图层列表 */}
      <div className="flex-1 overflow-y-auto p-2">
        {elements.length === 0 ? (
          <div className="text-center text-gray-400 text-sm py-8">No layers</div>
        ) : (
          <div className="space-y-0.5">
            {displayElements.map((element) => {
              const isSelected = selectedIds.has(element.id);
              const isVisible = element.meta.visible !== false;
              const isLocked = element.meta.locked === true;
              const isDragging = draggedId === element.id;
              const isDropTarget = dropTargetId === element.id;
              const isEditing = editingElementId === element.id;
              const showDropBefore = isDropTarget && dropPosition === 'before';
              const showDropAfter = isDropTarget && dropPosition === 'after';

              return (
                <div key={element.id} className="relative">
                  {/* 放置指示器 - 上方 */}
                  {showDropBefore && (
                    <div className="absolute left-0 right-0 -top-1 z-20 flex items-center pointer-events-none">
                      <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-md" />
                      <div className="flex-1 h-0.5 bg-blue-500 shadow-sm" />
                    </div>
                  )}

                  <div
                    draggable={!isLocked && !isEditing}
                    onDragStart={(e) => handleDragStart(e, element)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => handleDragOver(e, element)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, element)}
                    onClick={(e) => !isEditing && selectElement(element, e.ctrlKey || e.metaKey)}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      if (!isLocked) startEditing(element);
                    }}
                    className={`
                      group flex items-center gap-2 p-2 rounded-lg transition-all duration-150
                      ${isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-transparent'}
                      ${!isVisible ? 'opacity-50' : ''}
                      ${isDragging ? 'opacity-30 scale-95 bg-gray-200 border-dashed border-gray-400' : ''}
                      ${isDropTarget ? 'bg-blue-50' : ''}
                      ${isLocked ? 'cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'}
                    `}
                  >
                    {/* 拖拽手柄 */}
                    <GripVertical
                      size={14}
                      className={`flex-shrink-0 ${isLocked ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-600'}`}
                    />

                    {/* 元素缩略图 */}
                    <div className="w-8 h-8 rounded border border-gray-200 flex-shrink-0 overflow-hidden bg-white flex items-center justify-center">
                      {element.type === ElementType.TEXT ? (
                        <div className="w-full h-full flex items-center justify-center bg-purple-100">
                          <span className="text-purple-600 font-bold text-sm">T</span>
                        </div>
                      ) : (
                        (() => {
                          const thumbnailUrl = getElementThumbnailUrl(element);
                          return thumbnailUrl ? (
                            <img src={thumbnailUrl} alt="" className="w-full h-full object-contain" />
                          ) : (
                            <div className={`w-full h-full ${getElementColor(element)}`} />
                          );
                        })()
                      )}
                    </div>

                    {/* 元素名称 */}
                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <input
                          ref={editInputRef}
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onBlur={() => {
                            const el = editor.scene.get(element.id);
                            if (el) saveName(el);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const el = editor.scene.get(element.id);
                              if (el) saveName(el);
                            } else if (e.key === 'Escape') {
                              e.preventDefault();
                              cancelEditing();
                            }
                          }}
                          className="w-full text-sm text-gray-800 bg-white border border-blue-300 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <div className="text-sm text-gray-800 truncate">{getElementName(element)}</div>
                      )}
                    </div>

                    {/* 操作按钮 */}
                    {!isEditing && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleVisible(element); }}
                          className="p-1 rounded hover:bg-gray-200 transition-colors"
                          title={isVisible ? 'Hide' : 'Show'}
                        >
                          {isVisible ? <Eye size={14} className="text-gray-600" /> : <EyeOff size={14} className="text-gray-400" />}
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleLocked(element); }}
                          className="p-1 rounded hover:bg-gray-200 transition-colors"
                          title={isLocked ? 'Unlock' : 'Lock'}
                        >
                          {isLocked ? <Lock size={14} className="text-gray-600" /> : <Unlock size={14} className="text-gray-400" />}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* 放置指示器 - 下方 */}
                  {showDropAfter && (
                    <div className="absolute left-0 right-0 -bottom-1 z-20 flex items-center pointer-events-none">
                      <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-md" />
                      <div className="flex-1 h-0.5 bg-blue-500 shadow-sm" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
