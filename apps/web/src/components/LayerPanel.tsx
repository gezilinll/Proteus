import { useState, useEffect, useRef, useMemo } from 'react';
import { Eye, EyeOff, Lock, Unlock, Layers } from 'lucide-react';
import { Editor, Element, ElementType, UpdateElementCommand, ReorderElementsCommand } from '@proteus/core';
import { getElementThumbnail } from '../utils/elementThumbnail';

interface LayerPanelProps {
  editor: Editor;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 图层面板 - Miro 风格
 * 显示所有图层，支持拖拽排序、显示/隐藏、锁定/解锁、重命名
 */
export function LayerPanel({ editor, isOpen, onClose }: LayerPanelProps) {
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [draggedElementId, setDraggedElementId] = useState<string | null>(null);
  const [dragOverElementId, setDragOverElementId] = useState<string | null>(null);
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

    // 监听场景变化
    const handleElementAdded = () => {
      updateElements();
    };
    const handleElementRemoved = () => {
      updateElements();
      updateSelection();
    };
    const handleElementUpdated = () => {
      updateElements();
    };
    const handleOrderChanged = () => {
      updateElements();
    };

    // 监听选择变化
    const handleSelectionChanged = (ids: Set<string>) => {
      setSelectedIds(new Set(ids));
    };

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
      meta: {
        ...element.meta,
        visible: !element.meta.visible,
      },
    });
    editor.executeCommand(command);
  };

  // 切换锁定/解锁
  const toggleLocked = (element: Element) => {
    const command = new UpdateElementCommand(editor.scene, element.id, {
      meta: {
        ...element.meta,
        locked: !element.meta.locked,
      },
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
    // 延迟聚焦，确保 DOM 已更新
    setTimeout(() => {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }, 0);
  };

  // 保存名称
  const saveName = (element: Element) => {
    const newName = editingName.trim();
    const command = new UpdateElementCommand(editor.scene, element.id, {
      meta: {
        ...element.meta,
        name: newName || undefined, // 空字符串转为 undefined
      },
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
    setDraggedElementId(element.id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', element.id);
    // 设置拖拽图像为半透明
    if (e.dataTransfer.setDragImage) {
      const dragImage = document.createElement('div');
      dragImage.style.opacity = '0.5';
      dragImage.textContent = getElementName(element);
      document.body.appendChild(dragImage);
      e.dataTransfer.setDragImage(dragImage, 0, 0);
      setTimeout(() => document.body.removeChild(dragImage), 0);
    }
  };

  // 拖拽结束
  const handleDragEnd = () => {
    setDraggedElementId(null);
    setDragOverElementId(null);
  };

  // 拖拽悬停
  const handleDragOver = (e: React.DragEvent, element: Element) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedElementId && draggedElementId !== element.id) {
      setDragOverElementId(element.id);
    }
  };

  // 拖拽离开
  const handleDragLeave = () => {
    setDragOverElementId(null);
  };

  // 放置
  const handleDrop = (e: React.DragEvent, targetElement: Element) => {
    e.preventDefault();
    if (!draggedElementId || draggedElementId === targetElement.id) {
      setDraggedElementId(null);
      setDragOverElementId(null);
      return;
    }

    // 计算新顺序
    const currentOrder = editor.scene.getOrder();
    const draggedIndex = currentOrder.indexOf(draggedElementId);
    const targetIndex = currentOrder.indexOf(targetElement.id);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedElementId(null);
      setDragOverElementId(null);
      return;
    }

    // 创建新顺序
    const newOrder = [...currentOrder];
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedElementId);

    // 执行命令
    const command = new ReorderElementsCommand(editor.scene, newOrder);
    editor.executeCommand(command);

    setDraggedElementId(null);
    setDragOverElementId(null);
  };

  // 获取元素显示名称
  const getElementName = (element: Element): string => {
    if (element.meta.name) {
      return element.meta.name;
    }
    switch (element.type) {
      case ElementType.RECTANGLE:
        return 'Rectangle';
      case ElementType.ELLIPSE:
        return 'Ellipse';
      case ElementType.TEXT:
        return element.style.text || 'Text';
      case ElementType.IMAGE:
        return 'Image';
      default:
        return 'Element';
    }
  };

  // 获取元素缩略图
  const getElementThumbnailUrl = (element: Element): string | null => {
    if (!registry) return null;
    try {
      return getElementThumbnail(element, registry, 32);
    } catch (error) {
      console.warn('Failed to generate thumbnail for element:', element.id, error);
      return null;
    }
  };

  // 获取元素图标颜色（作为缩略图失败时的后备）
  const getElementColor = (element: Element): string => {
    switch (element.type) {
      case ElementType.RECTANGLE:
        return 'bg-blue-500';
      case ElementType.ELLIPSE:
        return 'bg-green-500';
      case ElementType.TEXT:
        return 'bg-purple-500';
      case ElementType.IMAGE:
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-3 top-20 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50 flex flex-col max-h-[calc(100vh-6rem)]">
      {/* 标题栏 */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Layers size={18} className="text-gray-600" />
          <h3 className="font-semibold text-sm text-gray-800">Layers</h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          ×
        </button>
      </div>

      {/* 图层列表 */}
      <div className="flex-1 overflow-y-auto p-2">
        {elements.length === 0 ? (
          <div className="text-center text-gray-400 text-sm py-8">
            No layers
          </div>
        ) : (
          <div className="space-y-1">
            {/* 从后往前渲染（顶层在上） */}
            {[...elements].reverse().map((element) => {
              const isSelected = selectedIds.has(element.id);
              const isVisible = element.meta.visible !== false;
              const isLocked = element.meta.locked === true;
              const isDragging = draggedElementId === element.id;
              const isDragOver = dragOverElementId === element.id;
              const isEditing = editingElementId === element.id;

              return (
                <div
                  key={element.id}
                  draggable={!isLocked && !isEditing}
                  onDragStart={(e) => handleDragStart(e, element)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => handleDragOver(e, element)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, element)}
                  className={`
                    group flex items-center gap-2 p-2 rounded-lg cursor-pointer
                    transition-all
                    ${isSelected
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50 border border-transparent'
                    }
                    ${!isVisible ? 'opacity-50' : ''}
                    ${isDragging ? 'opacity-30' : ''}
                    ${isDragOver ? 'border-t-2 border-blue-400' : ''}
                  `}
                  onClick={(e) => {
                    if (!isEditing) {
                      selectElement(element, e.ctrlKey || e.metaKey);
                    }
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    if (!isLocked) {
                      startEditing(element);
                    }
                  }}
                >
                  {/* 元素缩略图 */}
                  <div className="w-8 h-8 rounded border border-gray-200 flex-shrink-0 overflow-hidden bg-white flex items-center justify-center">
                    {(() => {
                      // 文字元素显示 T 图标
                      if (element.type === ElementType.TEXT) {
                        return (
                          <div className="w-full h-full flex items-center justify-center bg-purple-100">
                            <span className="text-purple-600 font-bold text-sm">T</span>
                          </div>
                        );
                      }
                      
                      // 其他元素使用缩略图
                      const thumbnailUrl = getElementThumbnailUrl(element);
                      return thumbnailUrl ? (
                        <img
                          src={thumbnailUrl}
                          alt={getElementName(element)}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className={`w-full h-full ${getElementColor(element)}`} />
                      );
                    })()}
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
                          if (el) {
                            saveName(el);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const el = editor.scene.get(element.id);
                            if (el) {
                              saveName(el);
                            }
                          } else if (e.key === 'Escape') {
                            e.preventDefault();
                            cancelEditing();
                          }
                        }}
                        className="w-full text-sm text-gray-800 bg-white border border-blue-300 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <div className="text-sm text-gray-800 truncate">
                        {getElementName(element)}
                      </div>
                    )}
                  </div>

                  {/* 操作按钮 */}
                  {!isEditing && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* 显示/隐藏 */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleVisible(element);
                        }}
                        className="p-1 rounded hover:bg-gray-200 transition-colors"
                        title={isVisible ? 'Hide' : 'Show'}
                      >
                        {isVisible ? (
                          <Eye size={14} className="text-gray-600" />
                        ) : (
                          <EyeOff size={14} className="text-gray-400" />
                        )}
                      </button>

                      {/* 锁定/解锁 */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLocked(element);
                        }}
                        className="p-1 rounded hover:bg-gray-200 transition-colors"
                        title={isLocked ? 'Unlock' : 'Lock'}
                      >
                        {isLocked ? (
                          <Lock size={14} className="text-gray-600" />
                        ) : (
                          <Unlock size={14} className="text-gray-400" />
                        )}
                      </button>
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
