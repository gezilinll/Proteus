import { describe, it, expect, beforeEach } from 'vitest';
import { RendererRegistry } from './RendererRegistry';
import { ElementType } from '../types/ElementType';
import { RectangleRenderer } from './renderers/RectangleRenderer';
import { EllipseRenderer } from './renderers/EllipseRenderer';
import { ElementRenderer } from './ElementRenderer';

describe('RendererRegistry', () => {
  let registry: RendererRegistry;

  beforeEach(() => {
    registry = new RendererRegistry();
  });

  describe('default renderers', () => {
    it('should have default renderers registered', () => {
      expect(registry.has(ElementType.RECTANGLE)).toBe(true);
      expect(registry.has(ElementType.ELLIPSE)).toBe(true);
      expect(registry.has(ElementType.TEXT)).toBe(true);
      expect(registry.has(ElementType.IMAGE)).toBe(true);
    });

    it('should return renderer instances', () => {
      expect(registry.get(ElementType.RECTANGLE)).toBeInstanceOf(RectangleRenderer);
      expect(registry.get(ElementType.ELLIPSE)).toBeInstanceOf(EllipseRenderer);
    });
  });

  describe('register', () => {
    it('should register a custom renderer', () => {
      const customRenderer: ElementRenderer = {
        render: () => {},
      };

      registry.register(ElementType.RECTANGLE, customRenderer);
      expect(registry.get(ElementType.RECTANGLE)).toBe(customRenderer);
    });

    it('should override existing renderer', () => {
      const customRenderer: ElementRenderer = {
        render: () => {},
      };

      const original = registry.get(ElementType.RECTANGLE);
      registry.register(ElementType.RECTANGLE, customRenderer);
      
      expect(registry.get(ElementType.RECTANGLE)).toBe(customRenderer);
      expect(registry.get(ElementType.RECTANGLE)).not.toBe(original);
    });
  });

  describe('unregister', () => {
    it('should remove a renderer', () => {
      expect(registry.has(ElementType.RECTANGLE)).toBe(true);
      
      registry.unregister(ElementType.RECTANGLE);
      
      expect(registry.has(ElementType.RECTANGLE)).toBe(false);
      expect(registry.get(ElementType.RECTANGLE)).toBeUndefined();
    });
  });

  describe('get', () => {
    it('should return undefined for unregistered type', () => {
      // GROUP 类型默认未注册
      expect(registry.get(ElementType.GROUP)).toBeUndefined();
    });
  });
});

