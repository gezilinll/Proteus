import { describe, it, expect, beforeEach } from 'vitest';
import { HitTester } from './HitTester';
import { Scene } from '../scene/Scene';
import { createElement } from '../types/element';
import { ElementType } from '../types/ElementType';

describe('HitTester', () => {
  let scene: Scene;
  let hitTester: HitTester;

  beforeEach(() => {
    scene = new Scene();
    hitTester = new HitTester(scene);
  });

  describe('hitTest - rectangle', () => {
    it('should hit rectangle at center', () => {
      const element = createElement(ElementType.RECTANGLE, {
        transform: { x: 100, y: 100, width: 200, height: 150 },
      });
      scene.add(element);

      const results = hitTester.hitTest(200, 175); // 中心点

      expect(results.length).toBe(1);
      expect(results[0].element.id).toBe(element.id);
    });

    it('should hit rectangle at corner', () => {
      const element = createElement(ElementType.RECTANGLE, {
        transform: { x: 100, y: 100, width: 200, height: 150 },
      });
      scene.add(element);

      const results = hitTester.hitTest(100, 100); // 左上角

      expect(results.length).toBe(1);
    });

    it('should not hit outside rectangle', () => {
      const element = createElement(ElementType.RECTANGLE, {
        transform: { x: 100, y: 100, width: 200, height: 150 },
      });
      scene.add(element);

      const results = hitTester.hitTest(50, 50); // 外部

      expect(results.length).toBe(0);
    });

    it('should hit rotated rectangle', () => {
      const element = createElement(ElementType.RECTANGLE, {
        transform: { x: 100, y: 100, width: 200, height: 150, rotation: Math.PI / 4 },
      });
      scene.add(element);

      const centerX = 200;
      const centerY = 175;
      const results = hitTester.hitTest(centerX, centerY);

      expect(results.length).toBe(1);
    });
  });

  describe('hitTest - ellipse', () => {
    it('should hit ellipse at center', () => {
      const element = createElement(ElementType.ELLIPSE, {
        transform: { x: 100, y: 100, width: 200, height: 150 },
      });
      scene.add(element);

      const results = hitTester.hitTest(200, 175); // 中心点

      expect(results.length).toBe(1);
      expect(results[0].element.id).toBe(element.id);
    });

    it('should not hit outside ellipse', () => {
      const element = createElement(ElementType.ELLIPSE, {
        transform: { x: 100, y: 100, width: 200, height: 150 },
      });
      scene.add(element);

      const results = hitTester.hitTest(50, 50); // 外部

      expect(results.length).toBe(0);
    });
  });

  describe('hitTest - multiple elements', () => {
    it('should return elements sorted by distance', () => {
      const element1 = createElement(ElementType.RECTANGLE, {
        transform: { x: 100, y: 100, width: 200, height: 150 },
      });
      const element2 = createElement(ElementType.RECTANGLE, {
        transform: { x: 150, y: 150, width: 200, height: 150 },
      });
      scene.add(element1);
      scene.add(element2);

      const results = hitTester.hitTest(200, 200); // 重叠区域

      expect(results.length).toBe(2);
      // 结果按距离排序（距离近的优先）
      const resultIds = results.map((r) => r.element.id);
      expect(resultIds).toContain(element1.id);
      expect(resultIds).toContain(element2.id);
      // 距离应该递增
      expect(results[0].distance).toBeLessThanOrEqual(results[1].distance);
    });
  });

  describe('testMarquee', () => {
    it('should select elements in marquee area', () => {
      const element1 = createElement(ElementType.RECTANGLE, {
        transform: { x: 100, y: 100, width: 50, height: 50 },
      });
      const element2 = createElement(ElementType.RECTANGLE, {
        transform: { x: 200, y: 200, width: 50, height: 50 },
      });
      const element3 = createElement(ElementType.RECTANGLE, {
        transform: { x: 300, y: 300, width: 50, height: 50 },
      });
      scene.add(element1);
      scene.add(element2);
      scene.add(element3);

      const results = hitTester.testMarquee(50, 50, 250, 250);

      expect(results.length).toBe(2);
      expect(results.map((el) => el.id)).toContain(element1.id);
      expect(results.map((el) => el.id)).toContain(element2.id);
      expect(results.map((el) => el.id)).not.toContain(element3.id);
    });
  });
});

