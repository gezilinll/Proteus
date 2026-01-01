import { describe, it, expect, beforeEach } from 'vitest';
import { DragHandler } from './DragHandler';
import { Scene } from '../../scene/Scene';
import { createElement } from '../../types/element';
import { ElementType } from '../../types/ElementType';

describe('DragHandler', () => {
  let scene: Scene;
  let handler: DragHandler;

  beforeEach(() => {
    scene = new Scene();
    handler = new DragHandler(scene);
  });

  describe('start', () => {
    it('should start dragging and save initial positions', () => {
      const element = createElement(ElementType.RECTANGLE, {
        transform: { x: 100, y: 100, width: 50, height: 50 },
      });
      scene.add(element);

      handler.start([element.id], 200, 200);

      expect(handler.isActive()).toBe(true);
    });
  });

  describe('update', () => {
    it('should update element position during drag', () => {
      const element = createElement(ElementType.RECTANGLE, {
        transform: { x: 100, y: 100, width: 50, height: 50 },
      });
      scene.add(element);

      handler.start([element.id], 200, 200);
      handler.update(250, 250); // 移动 50, 50

      const updated = scene.get(element.id);
      expect(updated?.transform.x).toBe(150);
      expect(updated?.transform.y).toBe(150);
    });
  });

  describe('finish', () => {
    it('should generate command after drag', () => {
      const element = createElement(ElementType.RECTANGLE, {
        transform: { x: 100, y: 100, width: 50, height: 50 },
      });
      scene.add(element);

      handler.start([element.id], 200, 200);
      handler.update(250, 250);
      const command = handler.finish();

      expect(command).not.toBeNull();
      expect(handler.isActive()).toBe(false);
    });

    it('should return null if position did not change', () => {
      const element = createElement(ElementType.RECTANGLE, {
        transform: { x: 100, y: 100, width: 50, height: 50 },
      });
      scene.add(element);

      handler.start([element.id], 200, 200);
      handler.update(200, 200); // 没有移动
      const command = handler.finish();

      expect(command).toBeNull();
    });
  });

  describe('cancel', () => {
    it('should restore original positions', () => {
      const element = createElement(ElementType.RECTANGLE, {
        transform: { x: 100, y: 100, width: 50, height: 50 },
      });
      scene.add(element);

      handler.start([element.id], 200, 200);
      handler.update(250, 250);
      handler.cancel();

      const restored = scene.get(element.id);
      expect(restored?.transform.x).toBe(100);
      expect(restored?.transform.y).toBe(100);
      expect(handler.isActive()).toBe(false);
    });
  });
});

