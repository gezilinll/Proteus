import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MarqueeOverlay } from './MarqueeOverlay';
import { RenderContext } from '../RenderContext';

describe('MarqueeOverlay', () => {
  let overlay: MarqueeOverlay;
  let mockCtx: CanvasRenderingContext2D;
  let renderContext: RenderContext;

  beforeEach(() => {
    overlay = new MarqueeOverlay();
    mockCtx = {
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      fillRect: vi.fn(),
      beginPath: vi.fn(),
      rect: vi.fn(),
      stroke: vi.fn(),
      setLineDash: vi.fn(),
    } as unknown as CanvasRenderingContext2D;
    renderContext = new RenderContext(mockCtx);
  });

  describe('render', () => {
    it('should render marquee rectangle', () => {
      const bounds = {
        startX: 100,
        startY: 100,
        endX: 300,
        endY: 250,
      };

      overlay.render(renderContext, bounds);

      // 应该调用 fillRect 和 stroke
      expect(mockCtx.fillRect).toHaveBeenCalled();
      expect(mockCtx.stroke).toHaveBeenCalled();
      expect(mockCtx.setLineDash).toHaveBeenCalledWith([5, 5]);
    });

    it('should handle reversed coordinates', () => {
      const bounds = {
        startX: 300,
        startY: 250,
        endX: 100,
        endY: 100,
      };

      overlay.render(renderContext, bounds);

      // 应该正确处理反向坐标
      expect(mockCtx.fillRect).toHaveBeenCalled();
    });
  });
});

