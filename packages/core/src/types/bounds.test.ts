import { describe, it, expect } from 'vitest';
import { boundsFromTransform, mergeBounds, Bounds } from './bounds';

describe('bounds', () => {
  describe('boundsFromTransform', () => {
    it('should calculate bounds from transform', () => {
      const transform = { x: 10, y: 20, width: 100, height: 50 };
      const bounds = boundsFromTransform(transform);

      expect(bounds).toEqual({
        left: 10,
        top: 20,
        right: 110,
        bottom: 70,
        width: 100,
        height: 50,
      });
    });

    it('should handle zero position', () => {
      const transform = { x: 0, y: 0, width: 50, height: 50 };
      const bounds = boundsFromTransform(transform);

      expect(bounds.left).toBe(0);
      expect(bounds.top).toBe(0);
      expect(bounds.right).toBe(50);
      expect(bounds.bottom).toBe(50);
    });

    it('should handle negative position', () => {
      const transform = { x: -10, y: -20, width: 100, height: 50 };
      const bounds = boundsFromTransform(transform);

      expect(bounds.left).toBe(-10);
      expect(bounds.top).toBe(-20);
      expect(bounds.right).toBe(90);
      expect(bounds.bottom).toBe(30);
    });
  });

  describe('mergeBounds', () => {
    it('should merge single bounds', () => {
      const bounds: Bounds = {
        left: 10,
        top: 20,
        right: 110,
        bottom: 70,
        width: 100,
        height: 50,
      };

      const merged = mergeBounds(bounds);

      expect(merged).toEqual(bounds);
    });

    it('should merge multiple bounds', () => {
      const bounds1: Bounds = {
        left: 10,
        top: 20,
        right: 50,
        bottom: 60,
        width: 40,
        height: 40,
      };

      const bounds2: Bounds = {
        left: 30,
        top: 40,
        right: 80,
        bottom: 90,
        width: 50,
        height: 50,
      };

      const merged = mergeBounds(bounds1, bounds2);

      expect(merged).toEqual({
        left: 10,
        top: 20,
        right: 80,
        bottom: 90,
        width: 70,
        height: 70,
      });
    });

    it('should merge three bounds', () => {
      const bounds1: Bounds = { left: 0, top: 0, right: 10, bottom: 10, width: 10, height: 10 };
      const bounds2: Bounds = { left: 20, top: 20, right: 30, bottom: 30, width: 10, height: 10 };
      const bounds3: Bounds = { left: 5, top: 5, right: 25, bottom: 25, width: 20, height: 20 };

      const merged = mergeBounds(bounds1, bounds2, bounds3);

      expect(merged).toEqual({
        left: 0,
        top: 0,
        right: 30,
        bottom: 30,
        width: 30,
        height: 30,
      });
    });

    it('should return null for empty array', () => {
      const merged = mergeBounds();
      expect(merged).toBeNull();
    });

    it('should handle overlapping bounds', () => {
      const bounds1: Bounds = { left: 10, top: 10, right: 50, bottom: 50, width: 40, height: 40 };
      const bounds2: Bounds = { left: 30, top: 30, right: 70, bottom: 70, width: 40, height: 40 };

      const merged = mergeBounds(bounds1, bounds2);

      expect(merged).toEqual({
        left: 10,
        top: 10,
        right: 70,
        bottom: 70,
        width: 60,
        height: 60,
      });
    });

    it('should handle non-overlapping bounds', () => {
      const bounds1: Bounds = { left: 0, top: 0, right: 10, bottom: 10, width: 10, height: 10 };
      const bounds2: Bounds = { left: 100, top: 100, right: 110, bottom: 110, width: 10, height: 10 };

      const merged = mergeBounds(bounds1, bounds2);

      expect(merged).toEqual({
        left: 0,
        top: 0,
        right: 110,
        bottom: 110,
        width: 110,
        height: 110,
      });
    });
  });
});

