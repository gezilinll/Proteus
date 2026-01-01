import { useEffect, useRef, useState, useCallback } from 'react';
import { Editor, screenToCanvas, CopyElementsCommand, CutElementsCommand, PasteElementsCommand, DeleteElementsCommand } from '@proteus/core';

export interface EditorCanvasProps {
  editor: Editor;
  width?: number;
  height?: number;
  className?: string;
}

/**
 * 获取设备像素比
 */
function getDevicePixelRatio(): number {
  return typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
}

/**
 * 编辑器画布组件
 * 负责渲染画布和处理用户交互
 */
export function EditorCanvas({
  editor,
  width = 800,
  height = 600,
  className,
}: EditorCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null);

  // 设置 Canvas 尺寸，处理 DPR
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = getDevicePixelRatio();
    
    // 设置物理像素尺寸
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    
    // 设置显示尺寸（CSS）
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    return dpr;
  }, [width, height]);

  // 初始化 Editor
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = setupCanvas() ?? 1;
    
    if (!editor.isInitialized()) {
      editor.init(canvas, dpr);
    }

    return () => {
      // 注意：不在这里销毁 Editor，由外部管理生命周期
    };
  }, [editor, setupCanvas]);

  // 处理视口变化，触发重渲染
  useEffect(() => {
    editor.requestRender();
  }, [editor.viewport.zoom, editor.viewport.offsetX, editor.viewport.offsetY, editor]);

  // 滚轮缩放
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // 计算缩放增量（更平滑的缩放：每次 3%）
    // 使用连续的缩放因子，基于滚轮滚动量
    const zoomIntensity = 0.002;
    const delta = Math.exp(-e.deltaY * zoomIntensity);
    editor.viewport.zoomBy(delta, mouseX, mouseY);
    
    // 立即请求重新渲染
    editor.requestRender();
  };

  // 键盘状态跟踪
  const spaceKeyRef = useRef(false);

  // 统一的粘贴处理（内部元素 + 外部内容）
  // 优先使用 clipboardData（事件直接提供，最可靠），然后才用系统剪贴板 API
  const handlePaste = useCallback(async (e: ClipboardEvent | { clipboardData?: DataTransfer }) => {
    // 如果焦点在输入框或文本编辑器中，不处理
    const target = (e as any).target as HTMLElement | undefined;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
      return;
    }

    if ((e as any).preventDefault) {
      (e as any).preventDefault();
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const canvasPos = screenToCanvas(centerX - rect.left, centerY - rect.top, {
      zoom: editor.viewport.zoom,
      offsetX: editor.viewport.offsetX,
      offsetY: editor.viewport.offsetY,
    });

    // ============ 第一优先级：从 clipboardData 检测图片 ============
    // clipboardData 是事件直接提供的，对于图片来说最可靠
    if (e.clipboardData) {
      const items = Array.from(e.clipboardData.items);
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            const imageTool = editor.toolManager.getTool('image');
            if (imageTool) {
              (imageTool as any).setImageSource(file);
              imageTool.onMouseDown(canvasPos.x, canvasPos.y);
            }
            return; // 找到图片就直接返回
          }
        }
      }
    }

    // ============ 第二优先级：从 clipboardData 检测文本（可能是内部元素 JSON 或普通文本）============
    const clipboardText = e.clipboardData?.getData('text/plain');
    if (clipboardText && clipboardText.trim()) {
      // 尝试解析为内部元素 JSON
      try {
        const data = JSON.parse(clipboardText);
        const { ElementType } = await import('@proteus/core');
        if (
          Array.isArray(data) &&
          data.length > 0 &&
          data[0].id &&
          data[0].type &&
          Object.values(ElementType).includes(data[0].type)
        ) {
          // 这是内部元素 JSON，恢复到剪贴板管理器并粘贴
          (editor.clipboardManager as any).clipboard = data;
          (editor.clipboardManager as any).isInternalContent = true;
          
          const command = new PasteElementsCommand(editor.scene, editor.clipboardManager);
          editor.executeCommand(command);
          const pastedIds = command.getPastedElementIds();
          if (pastedIds.length > 0) {
            editor.selectionManager.selectMultiple(pastedIds);
          }
          editor.requestRender();
          return;
        }
      } catch {
        // 不是 JSON，继续检查是否为普通文本
      }

      // 普通文本：创建文本元素
      const { createElement, ElementType, AddElementCommand } = await import('@proteus/core');
      const element = createElement(ElementType.TEXT, {
        transform: {
          x: canvasPos.x - 100,
          y: canvasPos.y - 20,
          width: 200,
          height: 40,
          rotation: 0,
        },
        style: {
          text: clipboardText.trim(),
          fill: '#000000', // 黑色文本
          fontSize: 16,
          fontFamily: 'Arial',
          fontWeight: 'normal',
          textAlign: 'center',
        },
      });

      const command = new AddElementCommand(editor.scene, element);
      editor.executeCommand(command);
      editor.selectionManager.select(element.id);
      editor.toolManager.setTool('select');
      editor.requestRender();
      return;
    }

    // ============ 第三优先级：尝试使用系统剪贴板 API（用于 clipboardData 不可用的情况）============
    try {
      const systemClipboardData = await editor.clipboardManager.readFromSystemClipboard();
      if (systemClipboardData) {
        // 处理图片
        if (systemClipboardData.image && systemClipboardData.imageType) {
          const imageTool = editor.toolManager.getTool('image');
          if (imageTool) {
            const imageFile = systemClipboardData.image instanceof File 
              ? systemClipboardData.image 
              : new File([systemClipboardData.image], 'pasted-image.png', { type: systemClipboardData.imageType });
            (imageTool as any).setImageSource(imageFile);
            imageTool.onMouseDown(canvasPos.x, canvasPos.y);
          }
          return;
        }

        // 处理内部元素
        if (systemClipboardData.internalElements && systemClipboardData.internalElements.length > 0) {
          (editor.clipboardManager as any).clipboard = systemClipboardData.internalElements;
          (editor.clipboardManager as any).isInternalContent = true;
          
          const command = new PasteElementsCommand(editor.scene, editor.clipboardManager);
          editor.executeCommand(command);
          const pastedIds = command.getPastedElementIds();
          if (pastedIds.length > 0) {
            editor.selectionManager.selectMultiple(pastedIds);
          }
          editor.requestRender();
          return;
        }

        // 处理普通文本
        if (systemClipboardData.text && systemClipboardData.text.trim()) {
          const { createElement, ElementType, AddElementCommand } = await import('@proteus/core');
          const element = createElement(ElementType.TEXT, {
            transform: {
              x: canvasPos.x - 100,
              y: canvasPos.y - 20,
              width: 200,
              height: 40,
              rotation: 0,
            },
            style: {
              text: systemClipboardData.text.trim(),
              fill: '#000000',
              fontSize: 16,
              fontFamily: 'Arial',
              fontWeight: 'normal',
              textAlign: 'center',
            },
          });

          const command = new AddElementCommand(editor.scene, element);
          editor.executeCommand(command);
          editor.selectionManager.select(element.id);
          editor.toolManager.setTool('select');
          editor.requestRender();
          return;
        }
      }
    } catch (err) {
      console.warn('Failed to read from system clipboard:', err);
    }

    // ============ 最后：检查内部剪贴板（兼容旧逻辑）============
    if (editor.clipboardManager.hasContent() && editor.clipboardManager.isInternal()) {
      const command = new PasteElementsCommand(editor.scene, editor.clipboardManager);
      editor.executeCommand(command);
      const pastedIds = command.getPastedElementIds();
      if (pastedIds.length > 0) {
        editor.selectionManager.selectMultiple(pastedIds);
      }
      editor.requestRender();
    }
  }, [editor, canvasRef]);

  // 监听粘贴事件
  useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [handlePaste]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 如果焦点在输入框或文本编辑器中，不处理快捷键
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        // 只处理删除键（在文本编辑器中）
        if ((e.key === 'Delete' || e.key === 'Backspace') && !target.isContentEditable) {
          const selectedIds = Array.from(editor.selectionManager.getSelectedIds());
          if (selectedIds.length > 0) {
            e.preventDefault();
            const command = new DeleteElementsCommand(editor.scene, selectedIds);
            editor.executeCommand(command);
            editor.requestRender();
          }
        }
        return;
      }

      if (e.code === 'Space') {
        spaceKeyRef.current = true;
        return;
      }

      const ctrlOrCmd = e.ctrlKey || e.metaKey;

      // 复制 (Ctrl/Cmd + C)
      if (ctrlOrCmd && e.key === 'c') {
        e.preventDefault();
        const selectedIds = Array.from(editor.selectionManager.getSelectedIds());
        if (selectedIds.length > 0) {
          const elements = selectedIds
            .map((id) => editor.scene.get(id))
            .filter((el) => el !== undefined);
          if (elements.length > 0) {
            const command = new CopyElementsCommand(editor.clipboardManager, elements);
            editor.executeCommand(command);
          }
        }
        return;
      }

      // 剪切 (Ctrl/Cmd + X)
      if (ctrlOrCmd && e.key === 'x') {
        e.preventDefault();
        const selectedIds = Array.from(editor.selectionManager.getSelectedIds());
        if (selectedIds.length > 0) {
          const elements = selectedIds
            .map((id) => editor.scene.get(id))
            .filter((el) => el !== undefined);
          if (elements.length > 0) {
            const command = new CutElementsCommand(editor.scene, editor.clipboardManager, elements);
            editor.executeCommand(command);
            editor.requestRender();
          }
        }
        return;
      }

      // 粘贴 (Ctrl/Cmd + V)
      // 不在这里处理，让浏览器触发真正的 paste 事件（通过 window.addEventListener('paste', handlePaste)）
      // 这样可以获得完整的 clipboardData，包括图片等二进制数据
      if (ctrlOrCmd && e.key === 'v') {
        // 不阻止默认行为，让 paste 事件正常触发
        return;
      }

      // 全选 (Ctrl/Cmd + A)
      if (ctrlOrCmd && e.key === 'a') {
        e.preventDefault();
        const allIds = editor.scene.getAllIds();
        editor.selectionManager.selectMultiple(allIds);
        editor.requestRender();
        return;
      }

      // 删除 (Delete/Backspace)
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        const selectedIds = Array.from(editor.selectionManager.getSelectedIds());
        if (selectedIds.length > 0) {
          const command = new DeleteElementsCommand(editor.scene, selectedIds);
          editor.executeCommand(command);
          editor.requestRender();
        }
        return;
      }

      // 工具快捷键
      const key = e.key.toUpperCase();
      const tool = editor.toolManager.getToolByShortcut(key);
      if (tool) {
        e.preventDefault();
        editor.toolManager.setTool(tool.name);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        spaceKeyRef.current = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [editor]);

  // 获取画布坐标
  const getCanvasCoordinates = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const screenX = clientX - rect.left;
    const screenY = clientY - rect.top;

    return screenToCanvas(screenX, screenY, {
      zoom: editor.viewport.zoom,
      offsetX: editor.viewport.offsetX,
      offsetY: editor.viewport.offsetY,
    });
  }, [editor.viewport]);

  // 鼠标按下（开始拖拽或选择）
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 阻止默认的文本选择行为
    e.preventDefault();

    // 空格键 + 左键 或 中键 = 拖拽视口
    if (e.button === 1 || (e.button === 0 && spaceKeyRef.current)) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        offsetX: editor.viewport.offsetX,
        offsetY: editor.viewport.offsetY,
      };
      return;
    }

    // 左键 = 使用当前工具
    if (e.button === 0) {
      const coords = getCanvasCoordinates(e.clientX, e.clientY);
      const currentTool = editor.toolManager.getCurrentTool();
      
      if (currentTool) {
        currentTool.onMouseDown(coords.x, coords.y, {
          ctrlKey: e.ctrlKey || e.metaKey,
          shiftKey: e.shiftKey,
          altKey: e.altKey,
        });
      }
    }
  };

  // 鼠标移动（拖拽中或框选中）
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // 阻止默认的文本选择行为
    if (isDragging || e.buttons !== 0) {
      e.preventDefault();
    }

    if (isDragging && dragStartRef.current) {
      // 拖拽视口
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      editor.viewport.setOffset(
        dragStartRef.current.offsetX + deltaX,
        dragStartRef.current.offsetY + deltaY
      );
    } else {
      // 使用当前工具
      const coords = getCanvasCoordinates(e.clientX, e.clientY);
      const currentTool = editor.toolManager.getCurrentTool();
      if (currentTool) {
        currentTool.onMouseMove(coords.x, coords.y);
      }
    }
  };

  // 鼠标抬起（结束拖拽或选择）
  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setIsDragging(false);
      dragStartRef.current = null;
    } else {
      const coords = getCanvasCoordinates(e.clientX, e.clientY);
      const currentTool = editor.toolManager.getCurrentTool();
      if (currentTool) {
        currentTool.onMouseUp(coords.x, coords.y);
      }
    }
  };

  // 鼠标离开画布（结束拖拽）
  const handleMouseLeave = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  // 根据当前工具获取鼠标样式
  const getCursor = () => {
    if (isDragging) return 'grabbing';
    
    const currentTool = editor.toolManager.getCurrentTool();
    if (!currentTool) return 'default';

    switch (currentTool.name) {
      case 'select':
        return 'default';
      case 'rectangle':
      case 'ellipse':
        return 'crosshair';
      case 'text':
        return 'text';
      case 'image':
        return 'copy';
      default:
        return 'default';
    }
  };

  return (
    <canvas
      ref={canvasRef}
      className={className}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onDragStart={(e) => e.preventDefault()} // 阻止拖拽图片等默认行为
      style={{
        cursor: getCursor(),
        width: `${width}px`,
        height: `${height}px`,
        userSelect: 'none', // CSS 方式阻止文本选择
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
      }}
    />
  );
}
