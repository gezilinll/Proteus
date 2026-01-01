import { useEffect, useRef, useState, useCallback } from 'react';
import { Editor, Element, canvasToScreen, ElementType } from '@proteus/core';

interface TextEditOverlayProps {
  editor: Editor;
}

/**
 * 文字编辑覆盖层
 * 使用 contenteditable 实现所见即所得的文字编辑
 */
export function TextEditOverlay({ editor }: TextEditOverlayProps) {
  const [editingElement, setEditingElement] = useState<Element | null>(null);
  const [editPosition, setEditPosition] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  // 保存原始文本用于取消时恢复
  const originalTextRef = useRef<string>('');

  // 更新编辑位置
  const updateEditPosition = useCallback(
    (element: Element) => {
      const { x, y, width, height } = element.transform;
      const { zoom, offsetX, offsetY } = editor.viewport;

      // x, y 是元素左上角
      const screenPos = canvasToScreen(x, y, { zoom, offsetX, offsetY });

      setEditPosition({
        x: screenPos.x,
        y: screenPos.y,
        width: width * zoom,
        height: height * zoom,
      });
    },
    [editor.viewport]
  );

  // 进入编辑模式
  const enterEditMode = useCallback(
    (element: Element) => {
      // 先选中元素（如果是双击进入编辑）
      if (!editor.selectionManager.isSelected(element.id)) {
        editor.selectionManager.select(element.id);
      }

      // 设置编辑标记，隐藏 Canvas 渲染
      editor.scene.update(element.id, {
        style: { ...element.style, _editing: true },
      });
      editor.requestRender();

      // 获取更新后的元素
      const updatedElement = editor.scene.get(element.id);
      if (!updatedElement) return;

      originalTextRef.current = updatedElement.style.text || '';
      setEditingElement(updatedElement);
      updateEditPosition(updatedElement);
    },
    [editor, updateEditPosition]
  );

  // 退出编辑模式
  const exitEditMode = useCallback(
    (saveText: string) => {
      if (!editingElement) return;

      editor.scene.update(editingElement.id, {
        style: {
          ...editingElement.style,
          text: saveText,
          _editing: false,
        },
      });
      editor.requestRender();

      setEditingElement(null);
      setEditPosition(null);

      // 自动切换回 select 工具
      if (editor.toolManager.getCurrentTool()?.name === 'text') {
        editor.toolManager.setTool('select');
      }
    },
    [editingElement, editor]
  );

  // 监听元素创建事件
  useEffect(() => {
    const handleElementCreated = (element: Element) => {
      if (element.type === ElementType.TEXT) {
        enterEditMode(element);
      }
    };

    editor.toolManager.on('elementCreated', handleElementCreated);
    return () => {
      editor.toolManager.off('elementCreated', handleElementCreated);
    };
  }, [editor, enterEditMode]);

  // 监听双击事件
  useEffect(() => {
    const handleDoubleClick = (e: MouseEvent) => {
      const canvas = document.querySelector('canvas');
      if (!canvas || !canvas.contains(e.target as Node)) return;

      const rect = canvas.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;

      const canvasPos = {
        x: (screenX - editor.viewport.offsetX) / editor.viewport.zoom,
        y: (screenY - editor.viewport.offsetY) / editor.viewport.zoom,
      };

      const elements = editor.scene.getAll();
      for (const element of elements) {
        if (element.type === ElementType.TEXT) {
          const { x, y, width, height } = element.transform;
          if (
            canvasPos.x >= x &&
            canvasPos.x <= x + width &&
            canvasPos.y >= y &&
            canvasPos.y <= y + height
          ) {
            enterEditMode(element);
            break;
          }
        }
      }
    };

    window.addEventListener('dblclick', handleDoubleClick);
    return () => {
      window.removeEventListener('dblclick', handleDoubleClick);
    };
  }, [editor, enterEditMode]);

  // 监听工具切换，如果切换到非 text 工具，退出编辑模式
  useEffect(() => {
    if (!editingElement) return;

    const handleToolChanged = (tool: { name: string }) => {
      if (tool.name !== 'text') {
        // 工具切换为非 text，退出编辑模式
        exitEditMode(editingElement.style.text || '');
      }
    };

    editor.toolManager.on('toolChanged', handleToolChanged);

    return () => {
      editor.toolManager.off('toolChanged', handleToolChanged);
    };
  }, [editingElement, exitEditMode, editor.toolManager]);

  // 监听选择变化，如果编辑的元素被取消选择，退出编辑模式
  useEffect(() => {
    if (!editingElement) return;

    const handleSelectionChanged = (selectedIds: Set<string>) => {
      // 如果当前编辑的元素不在选择集中，退出编辑模式
      if (!selectedIds.has(editingElement.id)) {
        exitEditMode(editingElement.style.text || '');
      }
    };

    editor.selectionManager.on('selectionChanged', handleSelectionChanged);

    return () => {
      editor.selectionManager.off('selectionChanged', handleSelectionChanged);
    };
  }, [editingElement, exitEditMode, editor.selectionManager]);

  // 监听视口变化
  useEffect(() => {
    if (!editingElement) return;

    const handleViewportChange = () => {
      updateEditPosition(editingElement);
    };

    editor.viewport.on('zoomChanged', handleViewportChange);
    editor.viewport.on('offsetChanged', handleViewportChange);

    return () => {
      editor.viewport.off('zoomChanged', handleViewportChange);
      editor.viewport.off('offsetChanged', handleViewportChange);
    };
  }, [editingElement, updateEditPosition, editor.viewport]);

  // 自动聚焦并选中
  useEffect(() => {
    if (editingElement && editorRef.current) {
      // 设置初始文本
      editorRef.current.innerText = editingElement.style.text || '';
      editorRef.current.focus();

      // 选中所有文字
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(editorRef.current);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [editingElement]);

  // 处理输入
  const handleInput = useCallback(() => {
    if (!editorRef.current || !editingElement) return;

    const newText = editorRef.current.innerText;

    // 实时更新场景（但保持 _editing 状态）
    editor.scene.update(editingElement.id, {
      style: {
        ...editingElement.style,
        text: newText,
        _editing: true,
      },
    });
    // 不需要 requestRender，因为 _editing: true 会跳过渲染
  }, [editingElement, editor]);

  // 失去焦点时保存
  const handleBlur = useCallback(() => {
    if (!editorRef.current) return;
    const newText = editorRef.current.innerText;
    exitEditMode(newText);
  }, [exitEditMode]);

  // 键盘事件
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape') {
        // 取消，恢复原始文本
        if (editingElement) {
          editor.scene.update(editingElement.id, {
            style: {
              ...editingElement.style,
              text: originalTextRef.current,
              _editing: false,
            },
          });
          editor.requestRender();
        }
        setEditingElement(null);
        setEditPosition(null);
        
        // 自动切换回 select 工具
        if (editor.toolManager.getCurrentTool()?.name === 'text') {
          editor.toolManager.setTool('select');
        }
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        editorRef.current?.blur();
      }
    },
    [editingElement, editor]
  );

  if (!editingElement || !editPosition) {
    return null;
  }

  const {
    fontSize = 16,
    fontFamily = 'Arial',
    fontWeight = 'normal',
    fill = '#000000',
    textAlign = 'center',
  } = editingElement.style;
  const { zoom } = editor.viewport;
  const scaledFontSize = fontSize * zoom;

  // 补偿 CSS line-height 与 Canvas textBaseline 的差异
  // 偏差约为 fontSize * 0.15（经验值，与 line-height: 1.2 相关）
  const baselineOffset = scaledFontSize * 0.15;

  return (
    <div
      ref={editorRef}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      style={{
        position: 'absolute',
        left: editPosition.x,
        // 补偿 CSS line-height 与 Canvas textBaseline 的差异
        top: editPosition.y - baselineOffset,
        width: editPosition.width,
        height: editPosition.height,
        // 使用 Flexbox 实现垂直居中（与 Canvas TextRenderer 一致）
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', // 垂直居中
        // 文字样式（与 Canvas TextRenderer 一致）
        fontSize: scaledFontSize,
        fontFamily,
        fontWeight,
        color: fill,
        lineHeight: 1.2,
        textAlign, // 水平对齐由 textAlign 控制，不强制居中
        // 透明无边框
        background: 'transparent',
        border: 'none',
        outline: 'none',
        caretColor: '#3b82f6',
        // 其他
        padding: 0,
        margin: 0,
        boxSizing: 'border-box',
        overflow: 'hidden',
        zIndex: 1000,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        cursor: 'text',
      }}
    />
  );
}
