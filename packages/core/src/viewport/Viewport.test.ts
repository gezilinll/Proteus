import { describe, it, expect, beforeEach } from 'vitest';
import { Viewport } from './Viewport';

describe('Viewport', () => {
  let viewport: Viewport;

  beforeEach(() => {
    viewport = new Viewport();
  });

  describe('initialization', () => {
    it('should initialize with default values', () => {
      expect(viewport.zoom).toBe(1.0);
      expect(viewport.offsetX).toBe(0);
      expect(viewport.offsetY).toBe(0);
      expect(viewport.minZoom).toBe(0.02);
      expect(viewport.maxZoom).toBe(5);
    });

    it('should initialize with custom values', () => {
      const custom = new Viewport({
        zoom: 2.0,
        offsetX: 100,
        offsetY: 200,
        minZoom: 0.5,
        maxZoom: 5,
      });

      expect(custom.zoom).toBe(2.0);
      expect(custom.offsetX).toBe(100);
      expect(custom.offsetY).toBe(200);
      expect(custom.minZoom).toBe(0.5);
      expect(custom.maxZoom).toBe(5);
    });

    it('should clamp initial zoom to min/max', () => {
      const tooSmall = new Viewport({ zoom: 0.01 });
      expect(tooSmall.zoom).toBe(0.02);

      const tooLarge = new Viewport({ zoom: 20 });
      expect(tooLarge.zoom).toBe(5);
    });
  });

  describe('setZoom', () => {
    it('should set zoom', () => {
      viewport.setZoom(2.0);
      expect(viewport.zoom).toBe(2.0);
    });

    it('should clamp zoom to min/max', () => {
      viewport.setZoom(0.01);
      expect(viewport.zoom).toBe(0.02);

      viewport.setZoom(20);
      expect(viewport.zoom).toBe(5);
    });

    it('should adjust offset when zooming with center point', () => {
      viewport.setOffset(100, 100);
      viewport.setZoom(2.0, 200, 200);

      // 中心点在 (200, 200)，放大后该点应该仍在 (200, 200)
      const transform = viewport.getTransform();
      expect(transform.scaleX).toBe(2.0);
    });
  });

  describe('zoomBy', () => {
    it('should zoom by multiplier', () => {
      viewport.setZoom(1.0);
      viewport.zoomBy(2.0);
      expect(viewport.zoom).toBe(2.0);

      viewport.zoomBy(0.5);
      expect(viewport.zoom).toBe(1.0);
    });

    it('should clamp when zooming beyond limits', () => {
      viewport.setZoom(1.0);
      viewport.zoomBy(0.01); // 尝试缩小到 0.01
      expect(viewport.zoom).toBe(0.02); // 应该被限制到 minZoom

      viewport.setZoom(1.0);
      viewport.zoomBy(100); // 尝试放大到 100
      expect(viewport.zoom).toBe(5); // 应该被限制到 maxZoom
    });
  });

  describe('setOffset', () => {
    it('should set offset', () => {
      viewport.setOffset(100, 200);
      expect(viewport.offsetX).toBe(100);
      expect(viewport.offsetY).toBe(200);
    });
  });

  describe('offsetBy', () => {
    it('should add to offset', () => {
      viewport.setOffset(100, 100);
      viewport.offsetBy(50, -30);
      expect(viewport.offsetX).toBe(150);
      expect(viewport.offsetY).toBe(70);
    });
  });

  describe('reset', () => {
    it('should reset to default values', () => {
      viewport.setZoom(2.0);
      viewport.setOffset(100, 200);
      viewport.reset();

      expect(viewport.zoom).toBe(1.0);
      expect(viewport.offsetX).toBe(0);
      expect(viewport.offsetY).toBe(0);
    });
  });

  describe('getTransform', () => {
    it('should return correct transform', () => {
      viewport.setZoom(2.0);
      viewport.setOffset(100, 200);

      const transform = viewport.getTransform();
      expect(transform).toEqual({
        scaleX: 2.0,
        scaleY: 2.0,
        translateX: 100,
        translateY: 200,
      });
    });
  });
});

