import { describe, it, expect } from 'vitest';
import { screenToCanvas, canvasToScreen, clamp, lerp, distance } from './math';

describe('math utilities', () => {
  describe('screenToCanvas', () => {
    it('should convert screen coordinates to canvas coordinates', () => {
      const viewport = { zoom: 1.0, offsetX: 0, offsetY: 0 };
      const result = screenToCanvas(100, 200, viewport);
      expect(result).toEqual({ x: 100, y: 200 });
    });

    it('should account for zoom', () => {
      const viewport = { zoom: 2.0, offsetX: 0, offsetY: 0 };
      const result = screenToCanvas(100, 200, viewport);
      expect(result).toEqual({ x: 50, y: 100 });
    });

    it('should account for offset', () => {
      const viewport = { zoom: 1.0, offsetX: 50, offsetY: 100 };
      const result = screenToCanvas(150, 300, viewport);
      expect(result).toEqual({ x: 100, y: 200 });
    });

    it('should account for both zoom and offset', () => {
      const viewport = { zoom: 2.0, offsetX: 100, offsetY: 200 };
      const result = screenToCanvas(300, 600, viewport);
      expect(result).toEqual({ x: 100, y: 200 });
    });
  });

  describe('canvasToScreen', () => {
    it('should convert canvas coordinates to screen coordinates', () => {
      const viewport = { zoom: 1.0, offsetX: 0, offsetY: 0 };
      const result = canvasToScreen(100, 200, viewport);
      expect(result).toEqual({ x: 100, y: 200 });
    });

    it('should account for zoom', () => {
      const viewport = { zoom: 2.0, offsetX: 0, offsetY: 0 };
      const result = canvasToScreen(50, 100, viewport);
      expect(result).toEqual({ x: 100, y: 200 });
    });

    it('should account for offset', () => {
      const viewport = { zoom: 1.0, offsetX: 50, offsetY: 100 };
      const result = canvasToScreen(100, 200, viewport);
      expect(result).toEqual({ x: 150, y: 300 });
    });

    it('should account for both zoom and offset', () => {
      const viewport = { zoom: 2.0, offsetX: 100, offsetY: 200 };
      const result = canvasToScreen(100, 200, viewport);
      expect(result).toEqual({ x: 300, y: 600 });
    });
  });

  describe('clamp', () => {
    it('should clamp value to range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });
  });

  describe('lerp', () => {
    it('should interpolate between values', () => {
      expect(lerp(0, 10, 0)).toBe(0);
      expect(lerp(0, 10, 1)).toBe(10);
      expect(lerp(0, 10, 0.5)).toBe(5);
      expect(lerp(10, 20, 0.3)).toBe(13);
    });
  });

  describe('distance', () => {
    it('should calculate distance between points', () => {
      expect(distance(0, 0, 3, 4)).toBe(5); // 3-4-5 triangle
      expect(distance(0, 0, 0, 0)).toBe(0);
      expect(distance(1, 1, 4, 5)).toBe(5); // 3-4-5 triangle
    });
  });
});

