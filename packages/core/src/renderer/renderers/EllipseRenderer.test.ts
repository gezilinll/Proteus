import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EllipseRenderer } from './EllipseRenderer';
import { RenderContext } from '../RenderContext';
import { createElement } from '../../types/element';
import { ElementType } from '../../types/ElementType';

describe('EllipseRenderer', () => {
  let renderer: EllipseRenderer;
  let mockCtx: CanvasRenderingContext2D;
  let renderContext: RenderContext;

  beforeEach(() => {
    renderer = new EllipseRenderer();
    mockCtx = {
      save: vi.fn(),
      restore: vi.fn(),
      beginPath: vi.fn(),
      ellipse: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      clearRect: vi.fn(),
      setTransform: vi.fn(),
      resetTransform: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      scale: vi.fn(),
      globalAlpha: 1,
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
    } as unknown as CanvasRenderingContext2D;
    renderContext = new RenderContext(mockCtx);
  });

  it('should render an ellipse', () => {
    const element = createElement(ElementType.ELLIPSE, {
      transform: { x: 0, y: 0, width: 100, height: 50 },
      style: { fill: '#ff0000', stroke: '#000000', strokeWidth: 2 },
    });

    renderer.render(renderContext, element);

    expect(mockCtx.ellipse).toHaveBeenCalledWith(0, 0, 50, 25, 0, 0, Math.PI * 2);
    expect(mockCtx.fillStyle).toBe('#ff0000');
    expect(mockCtx.strokeStyle).toBe('#000000');
    expect(mockCtx.lineWidth).toBe(2);
    expect(mockCtx.fill).toHaveBeenCalled();
    expect(mockCtx.stroke).toHaveBeenCalled();
  });

  it('should apply opacity', () => {
    const element = createElement(ElementType.ELLIPSE, {
      transform: { x: 0, y: 0, width: 100, height: 50 },
      style: { opacity: 0.7 },
    });

    renderer.render(renderContext, element);

    expect(mockCtx.globalAlpha).toBe(0.7);
  });

  it('should not fill if fill is not set', () => {
    const element = createElement(ElementType.ELLIPSE, {
      transform: { x: 0, y: 0, width: 100, height: 50 },
      style: { fill: undefined, stroke: '#000000', strokeWidth: 1 },
    });

    renderer.render(renderContext, element);

    expect(mockCtx.fill).not.toHaveBeenCalled();
    expect(mockCtx.stroke).toHaveBeenCalled();
  });

  it('should not stroke if stroke is not set', () => {
    const element = createElement(ElementType.ELLIPSE, {
      transform: { x: 0, y: 0, width: 100, height: 50 },
      style: { fill: '#ff0000', stroke: undefined, strokeWidth: undefined },
    });

    renderer.render(renderContext, element);

    expect(mockCtx.fill).toHaveBeenCalled();
    expect(mockCtx.stroke).not.toHaveBeenCalled();
  });
});

