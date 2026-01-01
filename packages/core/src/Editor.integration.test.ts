/**
 * Editor 集成测试
 * 测试编辑器的完整功能流程
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Editor } from './Editor';
import { createElement } from './types/element';
import { ElementType } from './types/ElementType';
import {
  AddElementCommand,
  RemoveElementCommand,
  UpdateElementCommand,
  CopyElementsCommand,
  PasteElementsCommand,
  CutElementsCommand,
  DeleteElementsCommand,
  BatchCommand,
} from './command';
import { generateId } from './utils/id';
import { screenToCanvas, canvasToScreen } from './utils/math';

// Mock requestAnimationFrame for jsdom environment
vi.stubGlobal('requestAnimationFrame', (cb: (time: number) => void) => {
  return setTimeout(() => cb(performance.now()), 16) as unknown as number;
});
vi.stubGlobal('cancelAnimationFrame', (id: number) => {
  clearTimeout(id);
});

describe('Editor Integration Tests', () => {
  let editor: Editor;
  let canvas: HTMLCanvasElement;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    
    // Mock getContext for jsdom environment
    const mockCtx = {
      save: vi.fn(),
      restore: vi.fn(),
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      closePath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      arc: vi.fn(),
      rect: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      fillText: vi.fn(),
      strokeText: vi.fn(),
      measureText: vi.fn().mockReturnValue({ width: 100 }),
      drawImage: vi.fn(),
      setTransform: vi.fn(),
      resetTransform: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      scale: vi.fn(),
      globalAlpha: 1,
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      font: '',
      textAlign: 'left',
      textBaseline: 'alphabetic',
      imageSmoothingEnabled: true,
      canvas: canvas,
    } as unknown as CanvasRenderingContext2D;

    canvas.getContext = vi.fn().mockReturnValue(mockCtx);
    document.body.appendChild(canvas);

    editor = new Editor();
    editor.init(canvas);
  });

  afterEach(() => {
    editor.destroy();
    document.body.removeChild(canvas);
  });

  describe('Element Creation and Rendering', () => {
    it('should create and render rectangle element', () => {
      const element = createElement(ElementType.RECTANGLE, {
        transform: { x: 100, y: 100, width: 200, height: 150, rotation: 0 },
        style: { fill: '#ff0000', stroke: '#000000', strokeWidth: 2 },
      });

      const command = new AddElementCommand(editor.scene, element);
      editor.executeCommand(command);

      expect(editor.scene.get(element.id)).toBeDefined();
      expect(editor.scene.get(element.id)?.type).toBe(ElementType.RECTANGLE);
    });

    it('should create and render ellipse element', () => {
      const element = createElement(ElementType.ELLIPSE, {
        transform: { x: 200, y: 200, width: 150, height: 100, rotation: 0 },
        style: { fill: '#00ff00', stroke: '#000000', strokeWidth: 2 },
      });

      const command = new AddElementCommand(editor.scene, element);
      editor.executeCommand(command);

      expect(editor.scene.get(element.id)).toBeDefined();
      expect(editor.scene.get(element.id)?.type).toBe(ElementType.ELLIPSE);
    });

    it('should create and render text element', () => {
      const element = createElement(ElementType.TEXT, {
        transform: { x: 300, y: 300, width: 200, height: 40, rotation: 0 },
        style: {
          text: 'Hello World',
          fill: '#000000',
          fontSize: 16,
          fontFamily: 'Arial',
          fontWeight: 'normal',
          textAlign: 'center',
        },
      });

      const command = new AddElementCommand(editor.scene, element);
      editor.executeCommand(command);

      expect(editor.scene.get(element.id)).toBeDefined();
      expect(editor.scene.get(element.id)?.type).toBe(ElementType.TEXT);
      expect(editor.scene.get(element.id)?.style.text).toBe('Hello World');
    });

    it('should create and render image element', () => {
      const element = createElement(ElementType.IMAGE, {
        transform: { x: 400, y: 400, width: 200, height: 200, rotation: 0 },
        style: {
          imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzAwMCIvPjwvc3ZnPg==',
          opacity: 1,
        },
      });

      const command = new AddElementCommand(editor.scene, element);
      editor.executeCommand(command);

      expect(editor.scene.get(element.id)).toBeDefined();
      expect(editor.scene.get(element.id)?.type).toBe(ElementType.IMAGE);
    });
  });

  describe('Selection System', () => {
    it('should select single element', () => {
      const element = createElement(ElementType.RECTANGLE);
      editor.executeCommand(new AddElementCommand(editor.scene, element));

      editor.selectionManager.select(element.id);

      expect(editor.selectionManager.getSelectedIds().has(element.id)).toBe(true);
      expect(editor.selectionManager.getSelectedIds().size).toBe(1);
    });

    it('should select multiple elements', () => {
      const elements = [
        createElement(ElementType.RECTANGLE),
        createElement(ElementType.ELLIPSE),
        createElement(ElementType.TEXT),
      ];

      elements.forEach((el) => {
        editor.executeCommand(new AddElementCommand(editor.scene, el));
      });

      editor.selectionManager.selectMultiple(elements.map((el) => el.id));

      expect(editor.selectionManager.getSelectedIds().size).toBe(3);
      elements.forEach((el) => {
        expect(editor.selectionManager.getSelectedIds().has(el.id)).toBe(true);
      });
    });

    it('should clear selection', () => {
      const element = createElement(ElementType.RECTANGLE);
      editor.executeCommand(new AddElementCommand(editor.scene, element));
      editor.selectionManager.select(element.id);

      editor.selectionManager.clear();

      expect(editor.selectionManager.getSelectedIds().size).toBe(0);
    });
  });

  describe('Transform Operations', () => {
    it('should update element transform', () => {
      const element = createElement(ElementType.RECTANGLE, {
        transform: { x: 100, y: 100, width: 200, height: 150, rotation: 0 },
      });

      editor.executeCommand(new AddElementCommand(editor.scene, element));

      const updateCommand = new UpdateElementCommand(editor.scene, element.id, {
        transform: { x: 200, y: 200, width: 300, height: 250, rotation: 45 },
      });
      editor.executeCommand(updateCommand);

      const updated = editor.scene.get(element.id);
      expect(updated?.transform.x).toBe(200);
      expect(updated?.transform.y).toBe(200);
      expect(updated?.transform.width).toBe(300);
      expect(updated?.transform.height).toBe(250);
      expect(updated?.transform.rotation).toBe(45);
    });
  });

  describe('Copy, Cut, and Paste', () => {
    it('should copy and paste elements', () => {
      const element = createElement(ElementType.RECTANGLE, {
        transform: { x: 100, y: 100, width: 200, height: 150, rotation: 0 },
      });

      editor.executeCommand(new AddElementCommand(editor.scene, element));
      editor.selectionManager.select(element.id);

      // 复制
      const copyCommand = new CopyElementsCommand(editor.clipboardManager, [element]);
      editor.executeCommand(copyCommand);

      expect(editor.clipboardManager.hasContent()).toBe(true);
      expect(editor.clipboardManager.isInternal()).toBe(true);

      // 粘贴
      const pasteCommand = new PasteElementsCommand(editor.scene, editor.clipboardManager);
      editor.executeCommand(pasteCommand);

      const allElements = editor.scene.getAllIds();
      expect(allElements.length).toBe(2); // 原始 + 粘贴的

      const pastedId = pasteCommand.getPastedElementIds()[0];
      const pasted = editor.scene.get(pastedId);
      expect(pasted).toBeDefined();
      expect(pasted?.transform.x).toBe(110); // 原始 x + 偏移 10
      expect(pasted?.transform.y).toBe(110); // 原始 y + 偏移 10
    });

    it('should cut and paste elements', () => {
      const element = createElement(ElementType.RECTANGLE);
      editor.executeCommand(new AddElementCommand(editor.scene, element));
      editor.selectionManager.select(element.id);

      // 剪切
      const cutCommand = new CutElementsCommand(editor.scene, editor.clipboardManager, [element]);
      editor.executeCommand(cutCommand);

      // 元素应该被删除
      expect(editor.scene.get(element.id)).toBeUndefined();
      expect(editor.clipboardManager.hasContent()).toBe(true);
      expect(editor.clipboardManager.getIsCut()).toBe(true);

      // 粘贴
      const pasteCommand = new PasteElementsCommand(editor.scene, editor.clipboardManager);
      editor.executeCommand(pasteCommand);

      const pastedId = pasteCommand.getPastedElementIds()[0];
      expect(editor.scene.get(pastedId)).toBeDefined();
    });

    it('should copy multiple elements', () => {
      const elements = [
        createElement(ElementType.RECTANGLE),
        createElement(ElementType.ELLIPSE),
        createElement(ElementType.TEXT),
      ];

      elements.forEach((el) => {
        editor.executeCommand(new AddElementCommand(editor.scene, el));
      });

      const copyCommand = new CopyElementsCommand(editor.clipboardManager, elements);
      editor.executeCommand(copyCommand);

      const pasteCommand = new PasteElementsCommand(editor.scene, editor.clipboardManager);
      editor.executeCommand(pasteCommand);

      expect(pasteCommand.getPastedElementIds().length).toBe(3);
    });
  });

  describe('Delete Operations', () => {
    it('should delete selected elements', () => {
      const elements = [
        createElement(ElementType.RECTANGLE),
        createElement(ElementType.ELLIPSE),
        createElement(ElementType.TEXT),
      ];

      elements.forEach((el) => {
        editor.executeCommand(new AddElementCommand(editor.scene, el));
      });

      const deleteCommand = new DeleteElementsCommand(
        editor.scene,
        elements.map((el) => el.id)
      );
      editor.executeCommand(deleteCommand);

      elements.forEach((el) => {
        expect(editor.scene.get(el.id)).toBeUndefined();
      });
    });
  });

  describe('Undo/Redo System', () => {
    it('should undo add element', () => {
      const element = createElement(ElementType.RECTANGLE);
      editor.executeCommand(new AddElementCommand(editor.scene, element));

      expect(editor.scene.get(element.id)).toBeDefined();
      expect(editor.canUndo()).toBe(true);

      editor.undo();

      expect(editor.scene.get(element.id)).toBeUndefined();
      expect(editor.canUndo()).toBe(false);
      expect(editor.canRedo()).toBe(true);
    });

    it('should redo add element', () => {
      const element = createElement(ElementType.RECTANGLE);
      editor.executeCommand(new AddElementCommand(editor.scene, element));
      editor.undo();
      editor.redo();

      expect(editor.scene.get(element.id)).toBeDefined();
      expect(editor.canRedo()).toBe(false);
    });

    it('should undo multiple operations', () => {
      const elements = [
        createElement(ElementType.RECTANGLE),
        createElement(ElementType.ELLIPSE),
        createElement(ElementType.TEXT),
      ];

      elements.forEach((el) => {
        editor.executeCommand(new AddElementCommand(editor.scene, el));
      });

      expect(editor.scene.getAllIds().length).toBe(3);

      // 撤销 3 次
      editor.undo();
      expect(editor.scene.getAllIds().length).toBe(2);

      editor.undo();
      expect(editor.scene.getAllIds().length).toBe(1);

      editor.undo();
      expect(editor.scene.getAllIds().length).toBe(0);
    });

    it('should undo update operation', () => {
      const element = createElement(ElementType.RECTANGLE, {
        transform: { x: 100, y: 100, width: 200, height: 150, rotation: 0 },
      });

      editor.executeCommand(new AddElementCommand(editor.scene, element));

      const updateCommand = new UpdateElementCommand(editor.scene, element.id, {
        transform: { x: 200, y: 200, width: 300, height: 250, rotation: 45 },
      });
      editor.executeCommand(updateCommand);

      expect(editor.scene.get(element.id)?.transform.x).toBe(200);

      editor.undo();

      expect(editor.scene.get(element.id)?.transform.x).toBe(100);
    });
  });

  describe('Batch Operations', () => {
    it('should execute batch command', () => {
      const elements = [
        createElement(ElementType.RECTANGLE),
        createElement(ElementType.ELLIPSE),
        createElement(ElementType.TEXT),
      ];

      const commands = elements.map((el) => new AddElementCommand(editor.scene, el));
      const batchCommand = new BatchCommand(commands);
      editor.executeCommand(batchCommand);

      expect(editor.scene.getAllIds().length).toBe(3);
    });

    it('should undo batch command', () => {
      const elements = [
        createElement(ElementType.RECTANGLE),
        createElement(ElementType.ELLIPSE),
      ];

      const commands = elements.map((el) => new AddElementCommand(editor.scene, el));
      const batchCommand = new BatchCommand(commands);
      editor.executeCommand(batchCommand);

      expect(editor.scene.getAllIds().length).toBe(2);

      editor.undo();

      expect(editor.scene.getAllIds().length).toBe(0);
    });
  });

  describe('Performance Tests', () => {
    it('should handle 100 elements efficiently', () => {
      const elements: ReturnType<typeof createElement>[] = [];
      const cols = 10;
      const spacing = 150;

      for (let i = 0; i < 100; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = col * spacing;
        const y = row * spacing;

        const typeIndex = i % 4;
        let element;

        switch (typeIndex) {
          case 0:
            element = createElement(ElementType.RECTANGLE, {
              transform: { x, y, width: 100, height: 100, rotation: 0 },
            });
            break;
          case 1:
            element = createElement(ElementType.ELLIPSE, {
              transform: { x, y, width: 100, height: 100, rotation: 0 },
            });
            break;
          case 2:
            element = createElement(ElementType.TEXT, {
              transform: { x, y, width: 100, height: 40, rotation: 0 },
              style: { text: `Text ${i}`, fill: '#000', fontSize: 16, fontFamily: 'Arial', fontWeight: 'normal', textAlign: 'center' },
            });
            break;
          default:
            element = createElement(ElementType.IMAGE, {
              transform: { x, y, width: 100, height: 100, rotation: 0 },
              style: { imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzAwMCIvPjwvc3ZnPg==', opacity: 1 },
            });
        }

        elements.push(element);
      }

      // 批量添加
      const commands = elements.map((el) => new AddElementCommand(editor.scene, el));
      const batchCommand = new BatchCommand(commands);

      const startTime = performance.now();
      editor.executeCommand(batchCommand);
      const endTime = performance.now();

      expect(editor.scene.getAllIds().length).toBe(100);
      expect(endTime - startTime).toBeLessThan(100); // 应该在 100ms 内完成

      // 测试渲染性能
      const renderStart = performance.now();
      editor.requestRender();
      const renderEnd = performance.now();

      // 渲染应该在合理时间内完成（这里只是检查不会卡死）
      expect(renderEnd - renderStart).toBeLessThan(1000);
    });

    it('should handle rapid operations without memory leak', () => {
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;

      // 执行大量操作
      for (let i = 0; i < 50; i++) {
        const element = createElement(ElementType.RECTANGLE, {
          transform: {
            x: Math.random() * 1000,
            y: Math.random() * 1000,
            width: 100,
            height: 100,
            rotation: 0,
          },
        });

        editor.executeCommand(new AddElementCommand(editor.scene, element));

        // 随机删除
        if (Math.random() > 0.5) {
          const allIds = editor.scene.getAllIds();
          if (allIds.length > 0) {
            const randomId = allIds[Math.floor(Math.random() * allIds.length)];
            editor.executeCommand(new RemoveElementCommand(editor.scene, randomId));
          }
        }
      }

      // 等待垃圾回收
      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;

      // 内存增长应该在合理范围内（如果浏览器支持 memory API）
      if (initialMemory > 0 && finalMemory > 0) {
        const growth = (finalMemory - initialMemory) / 1024 / 1024; // MB
        // 允许一定增长，但不应该超过 50MB
        expect(growth).toBeLessThan(50);
      }
    });
  });

  describe('Tool System', () => {
    it('should switch tools', () => {
      editor.toolManager.setTool('rectangle');
      expect(editor.toolManager.getCurrentTool()?.name).toBe('rectangle');

      editor.toolManager.setTool('ellipse');
      expect(editor.toolManager.getCurrentTool()?.name).toBe('ellipse');

      editor.toolManager.setTool('select');
      expect(editor.toolManager.getCurrentTool()?.name).toBe('select');
    });
  });

  describe('Viewport Operations', () => {
    it('should zoom viewport', () => {
      const initialZoom = editor.viewport.zoom;
      editor.viewport.setZoom(2);
      expect(editor.viewport.zoom).toBe(2);

      editor.viewport.setZoom(0.5);
      expect(editor.viewport.zoom).toBe(0.5);
    });

    it('should translate viewport', () => {
      editor.viewport.setOffset(100, 200);
      expect(editor.viewport.offsetX).toBe(100);
      expect(editor.viewport.offsetY).toBe(200);
    });

    it('should convert coordinates correctly', () => {
      editor.viewport.setZoom(2);
      editor.viewport.setOffset(100, 200);

      const screenX = 300;
      const screenY = 400;

      const canvasPos = screenToCanvas(screenX, screenY, {
        zoom: editor.viewport.zoom,
        offsetX: editor.viewport.offsetX,
        offsetY: editor.viewport.offsetY,
      });
      const backToScreen = canvasToScreen(canvasPos.x, canvasPos.y, {
        zoom: editor.viewport.zoom,
        offsetX: editor.viewport.offsetX,
        offsetY: editor.viewport.offsetY,
      });

      // 允许小的浮点误差
      expect(Math.abs(backToScreen.x - screenX)).toBeLessThan(0.1);
      expect(Math.abs(backToScreen.y - screenY)).toBeLessThan(0.1);
    });
  });
});

