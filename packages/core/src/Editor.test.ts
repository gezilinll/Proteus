import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Editor } from './Editor';
import { Scene } from './scene/Scene';
import { Viewport } from './viewport/Viewport';
import { CommandHistory } from './command/CommandHistory';
import { AddElementCommand } from './command/commands/AddElementCommand';
import { createElement } from './types/element';
import { ElementType } from './types/ElementType';

// Mock requestAnimationFrame for jsdom environment
vi.stubGlobal('requestAnimationFrame', (cb: (time: number) => void) => {
  return setTimeout(() => cb(performance.now()), 16) as unknown as number;
});
vi.stubGlobal('cancelAnimationFrame', (id: number) => {
  clearTimeout(id);
});

describe('Editor', () => {
  let editor: Editor;
  let canvas: HTMLCanvasElement;

  beforeEach(() => {
    editor = new Editor();
    canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    // Mock getContext
    canvas.getContext = vi.fn().mockReturnValue({
      save: vi.fn(),
      restore: vi.fn(),
      scale: vi.fn(),
      translate: vi.fn(),
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      strokeRect: vi.fn(),
      beginPath: vi.fn(),
      closePath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      arc: vi.fn(),
      ellipse: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      fillText: vi.fn(),
      measureText: vi.fn().mockReturnValue({ width: 100 }),
      setTransform: vi.fn(),
      resetTransform: vi.fn(),
      drawImage: vi.fn(),
      getImageData: vi.fn(),
      putImageData: vi.fn(),
      createLinearGradient: vi.fn(),
      createRadialGradient: vi.fn(),
      createPattern: vi.fn(),
    });
  });

  afterEach(() => {
    editor.destroy();
  });

  describe('initialization', () => {
    it('should create editor with default modules', () => {
      expect(editor.scene).toBeInstanceOf(Scene);
      expect(editor.viewport).toBeInstanceOf(Viewport);
      expect(editor.commandHistory).toBeInstanceOf(CommandHistory);
      expect(editor.isInitialized()).toBe(false);
    });

    it('should create editor with custom modules', () => {
      const scene = new Scene();
      const viewport = new Viewport();
      const commandHistory = new CommandHistory();
      const customEditor = new Editor({ scene, viewport, commandHistory });

      expect(customEditor.scene).toBe(scene);
      expect(customEditor.viewport).toBe(viewport);
      expect(customEditor.commandHistory).toBe(commandHistory);
      customEditor.destroy();
    });

    it('should initialize with canvas', () => {
      editor.init(canvas);
      expect(editor.isInitialized()).toBe(true);
      expect(editor.getRenderer()).not.toBeNull();
    });

    it('should throw error when initializing twice', () => {
      editor.init(canvas);
      expect(() => editor.init(canvas)).toThrow('Editor is already initialized');
    });
  });

  describe('command execution', () => {
    beforeEach(() => {
      editor.init(canvas);
    });

    it('should execute command', () => {
      const element = createElement(ElementType.RECTANGLE);
      const command = new AddElementCommand(editor.scene, element);

      editor.executeCommand(command);

      expect(editor.scene.get(element.id)).toBeDefined();
      expect(editor.canUndo()).toBe(true);
    });

    it('should undo command', () => {
      const element = createElement(ElementType.RECTANGLE);
      const command = new AddElementCommand(editor.scene, element);

      editor.executeCommand(command);
      editor.undo();

      expect(editor.scene.get(element.id)).toBeUndefined();
      expect(editor.canUndo()).toBe(false);
      expect(editor.canRedo()).toBe(true);
    });

    it('should redo command', () => {
      const element = createElement(ElementType.RECTANGLE);
      const command = new AddElementCommand(editor.scene, element);

      editor.executeCommand(command);
      editor.undo();
      editor.redo();

      expect(editor.scene.get(element.id)).toBeDefined();
      expect(editor.canRedo()).toBe(false);
    });
  });

  describe('render', () => {
    beforeEach(() => {
      editor.init(canvas);
    });

    it('should request render', () => {
      const renderer = editor.getRenderer();
      const requestRenderSpy = vi.spyOn(renderer!, 'requestRender');

      editor.requestRender();

      expect(requestRenderSpy).toHaveBeenCalled();
    });
  });

  describe('destroy', () => {
    it('should destroy editor', () => {
      editor.init(canvas);
      expect(editor.isInitialized()).toBe(true);

      editor.destroy();

      expect(editor.isInitialized()).toBe(false);
      expect(editor.getRenderer()).toBeNull();
    });

    it('should not throw when destroying uninitialized editor', () => {
      expect(() => editor.destroy()).not.toThrow();
    });
  });
});
