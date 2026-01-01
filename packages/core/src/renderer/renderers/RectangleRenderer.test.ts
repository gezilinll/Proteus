import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RectangleRenderer } from './RectangleRenderer';
import { RenderContext } from '../RenderContext';
import { createElement } from '../../types/element';
import { ElementType } from '../../types/ElementType';

describe('RectangleRenderer', () => {
  let renderer: RectangleRenderer;
  let mockCtx: CanvasRenderingContext2D;
  let renderContext: RenderContext;

  beforeEach(() => {
    renderer = new RectangleRenderer();
    mockCtx = {
      save: vi.fn(),
      restore: vi.fn(),
      beginPath: vi.fn(),
      rect: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      arc: vi.fn(),
      closePath: vi.fn(),
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

  it('should render a simple rectangle', () => {
    const element = createElement(ElementType.RECTANGLE, {
      transform: { x: 0, y: 0, width: 100, height: 50 },
      style: { fill: '#ff0000', stroke: '#000000', strokeWidth: 2 },
    });

    renderer.render(renderContext, element);

    expect(mockCtx.rect).toHaveBeenCalledWith(-50, -25, 100, 50);
    expect(mockCtx.fillStyle).toBe('#ff0000');
    expect(mockCtx.strokeStyle).toBe('#000000');
    expect(mockCtx.lineWidth).toBe(2);
    expect(mockCtx.fill).toHaveBeenCalled();
    expect(mockCtx.stroke).toHaveBeenCalled();
  });

  it('should render rounded rectangle when borderRadius is set', () => {
    const element = createElement(ElementType.RECTANGLE, {
      transform: { x: 0, y: 0, width: 100, height: 50 },
      style: { borderRadius: 10, fill: '#ff0000' },
    });

    renderer.render(renderContext, element);

    // 圆角矩形使用路径绘制，不会调用 rect
    expect(mockCtx.rect).not.toHaveBeenCalled();
    expect(mockCtx.beginPath).toHaveBeenCalled();
    expect(mockCtx.fill).toHaveBeenCalled();
  });

  it('should apply opacity', () => {
    const element = createElement(ElementType.RECTANGLE, {
      transform: { x: 0, y: 0, width: 100, height: 50 },
      style: { opacity: 0.5 },
    });

    renderer.render(renderContext, element);

    expect(mockCtx.globalAlpha).toBe(0.5);
  });

  it('should not fill if fill is not set', () => {
    const element = createElement(ElementType.RECTANGLE, {
      transform: { x: 0, y: 0, width: 100, height: 50 },
      style: { fill: undefined, stroke: '#000000', strokeWidth: 1 },
    });

    renderer.render(renderContext, element);

    expect(mockCtx.fill).not.toHaveBeenCalled();
    expect(mockCtx.stroke).toHaveBeenCalled();
  });

  it('should not stroke if stroke is not set', () => {
    const element = createElement(ElementType.RECTANGLE, {
      transform: { x: 0, y: 0, width: 100, height: 50 },
      style: { fill: '#ff0000', stroke: undefined, strokeWidth: undefined },
    });

    renderer.render(renderContext, element);

    expect(mockCtx.fill).toHaveBeenCalled();
    expect(mockCtx.stroke).not.toHaveBeenCalled();
  });
});

