import { describe, it, expect, beforeEach } from 'vitest';
import { Scene } from './Scene';
import { Element, createElement } from '../types/element';
import { ElementType } from '../types/ElementType';

describe('Scene', () => {
  let scene: Scene;
  let element1: Element;
  let element2: Element;

  beforeEach(() => {
    scene = new Scene();
    element1 = createElement(ElementType.RECTANGLE, {
      transform: { x: 0, y: 0, width: 100, height: 100 },
    });
    element2 = createElement(ElementType.ELLIPSE, {
      transform: { x: 100, y: 100, width: 50, height: 50 },
    });
  });

  describe('CRUD operations', () => {
    it('should add element', () => {
      scene.add(element1);
      expect(scene.get(element1.id)).toEqual(element1);
      expect(scene.size()).toBe(1);
    });

    it('should throw error when adding duplicate id', () => {
      scene.add(element1);
      expect(() => scene.add(element1)).toThrow();
    });

    it('should get element by id', () => {
      scene.add(element1);
      expect(scene.get(element1.id)).toEqual(element1);
      expect(scene.get('non-existent')).toBeUndefined();
    });

    it('should update element', () => {
      scene.add(element1);
      const originalUpdatedAt = element1.meta.updatedAt!;
      
      // 等待一小段时间确保时间戳不同
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          scene.update(element1.id, {
            transform: { ...element1.transform, x: 50 },
          });

          const updated = scene.get(element1.id);
          expect(updated?.transform.x).toBe(50);
          expect(updated?.meta.updatedAt).toBeGreaterThanOrEqual(originalUpdatedAt);
          resolve();
        }, 10);
      });
    });

    it('should throw error when updating non-existent element', () => {
      expect(() => scene.update('non-existent', {})).toThrow();
    });

    it('should remove element', () => {
      scene.add(element1);
      scene.remove(element1.id);
      expect(scene.get(element1.id)).toBeUndefined();
      expect(scene.size()).toBe(0);
    });

    it('should throw error when removing non-existent element', () => {
      expect(() => scene.remove('non-existent')).toThrow();
    });

    it('should remove children when removing parent', () => {
      const parent = createElement(ElementType.GROUP);
      const child = createElement(ElementType.RECTANGLE, { parentId: parent.id });

      scene.add(parent);
      scene.add(child);

      scene.remove(parent.id);
      expect(scene.get(child.id)).toBeUndefined();
    });
  });

  describe('order management', () => {
    it('should maintain order', () => {
      scene.add(element1);
      scene.add(element2);

      const order = scene.getOrder();
      expect(order).toEqual([element1.id, element2.id]);
    });

    it('should get ordered elements', () => {
      scene.add(element1);
      scene.add(element2);

      const ordered = scene.getOrdered();
      expect(ordered.map((el) => el.id)).toEqual([element1.id, element2.id]);
    });

    it('should move to top', () => {
      scene.add(element1);
      scene.add(element2);
      scene.moveToTop(element1.id);

      const order = scene.getOrder();
      expect(order).toEqual([element2.id, element1.id]);
    });

    it('should move to bottom', () => {
      scene.add(element1);
      scene.add(element2);
      scene.moveToBottom(element2.id);

      const order = scene.getOrder();
      expect(order).toEqual([element2.id, element1.id]);
    });

    it('should move up', () => {
      scene.add(element1);
      scene.add(element2);
      scene.moveUp(element1.id);

      const order = scene.getOrder();
      expect(order).toEqual([element2.id, element1.id]);
    });

    it('should move down', () => {
      scene.add(element1);
      scene.add(element2);
      scene.moveDown(element2.id);

      const order = scene.getOrder();
      expect(order).toEqual([element2.id, element1.id]);
    });
  });

  describe('events', () => {
    it('should emit elementAdded event', () => {
      let emitted = false;
      scene.on('elementAdded', () => {
        emitted = true;
      });

      scene.add(element1);
      expect(emitted).toBe(true);
    });

    it('should emit elementUpdated event', () => {
      let emitted = false;
      scene.on('elementUpdated', () => {
        emitted = true;
      });

      scene.add(element1);
      scene.update(element1.id, { transform: { ...element1.transform, x: 10 } });
      expect(emitted).toBe(true);
    });

    it('should emit elementRemoved event', () => {
      let emitted = false;
      scene.on('elementRemoved', () => {
        emitted = true;
      });

      scene.add(element1);
      scene.remove(element1.id);
      expect(emitted).toBe(true);
    });

    it('should emit orderChanged event', () => {
      let emitted = false;
      scene.on('orderChanged', () => {
        emitted = true;
      });

      scene.add(element1);
      scene.moveToTop(element1.id);
      expect(emitted).toBe(true);
    });
  });

  describe('utility methods', () => {
    it('should get all elements', () => {
      scene.add(element1);
      scene.add(element2);

      const all = scene.getAll();
      expect(all.length).toBe(2);
      expect(all).toContainEqual(element1);
      expect(all).toContainEqual(element2);
    });

    it('should get all ids', () => {
      scene.add(element1);
      scene.add(element2);

      const ids = scene.getAllIds();
      expect(ids).toContain(element1.id);
      expect(ids).toContain(element2.id);
    });

    it('should get children', () => {
      const parent = createElement(ElementType.GROUP);
      const child1 = createElement(ElementType.RECTANGLE, { parentId: parent.id });
      const child2 = createElement(ElementType.ELLIPSE, { parentId: parent.id });

      scene.add(parent);
      scene.add(child1);
      scene.add(child2);

      const children = scene.getChildren(parent.id);
      expect(children.length).toBe(2);
      expect(children).toContainEqual(child1);
      expect(children).toContainEqual(child2);
    });

    it('should clear all elements', () => {
      scene.add(element1);
      scene.add(element2);
      scene.clear();

      expect(scene.size()).toBe(0);
      expect(scene.getOrder().length).toBe(0);
    });

    it('should check if element exists', () => {
      scene.add(element1);
      expect(scene.has(element1.id)).toBe(true);
      expect(scene.has('non-existent')).toBe(false);
    });
  });
});

