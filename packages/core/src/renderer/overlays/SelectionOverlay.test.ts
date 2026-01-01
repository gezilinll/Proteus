import { describe, it, expect, beforeEach } from 'vitest';
import { SelectionOverlay } from './SelectionOverlay';
import { createElement } from '../../types/element';
import { ElementType } from '../../types/ElementType';
import { ControlPointType } from './SelectionOverlay';

describe('SelectionOverlay', () => {
  let overlay: SelectionOverlay;

  beforeEach(() => {
    overlay = new SelectionOverlay();
  });

  describe('computeSelectionBox', () => {
    it('should return null for empty selection', () => {
      const result = overlay.computeSelectionBox([]);
      expect(result).toBeNull();
    });

    it('should compute single selection box', () => {
      const element = createElement(ElementType.RECTANGLE, {
        transform: { x: 100, y: 100, width: 200, height: 150 },
      });

      const result = overlay.computeSelectionBox([element]);

      expect(result).not.toBeNull();
      expect(result?.bounds.left).toBe(100);
      expect(result?.bounds.top).toBe(100);
      expect(result?.bounds.width).toBe(200);
      expect(result?.bounds.height).toBe(150);
      expect(result?.rotation).toBe(0);
      expect(result?.controlPoints.length).toBe(9); // 8 resize + 1 rotate
    });

    it('should compute multi-selection box', () => {
      const element1 = createElement(ElementType.RECTANGLE, {
        transform: { x: 100, y: 100, width: 50, height: 50 },
      });
      const element2 = createElement(ElementType.RECTANGLE, {
        transform: { x: 200, y: 200, width: 50, height: 50 },
      });

      const result = overlay.computeSelectionBox([element1, element2]);

      expect(result).not.toBeNull();
      // 合并边界框应该包含两个元素
      expect(result?.bounds.left).toBe(100);
      expect(result?.bounds.top).toBe(100);
      expect(result?.bounds.right).toBe(250);
      expect(result?.bounds.bottom).toBe(250);
      expect(result?.rotation).toBe(0); // 多选时无旋转
    });

    it('should include rotation control point for rotated element', () => {
      const element = createElement(ElementType.RECTANGLE, {
        transform: { x: 100, y: 100, width: 200, height: 150, rotation: Math.PI / 4 },
      });

      const result = overlay.computeSelectionBox([element]);

      expect(result).not.toBeNull();
      expect(result?.rotation).toBe(Math.PI / 4);
      const rotatePoint = result?.controlPoints.find((p) => p.type === ControlPointType.ROTATE);
      expect(rotatePoint).toBeDefined();
    });
  });

  describe('control points', () => {
    it('should have 8 resize control points', () => {
      const element = createElement(ElementType.RECTANGLE, {
        transform: { x: 100, y: 100, width: 200, height: 150 },
      });

      const result = overlay.computeSelectionBox([element]);

      const resizePoints = result?.controlPoints.filter(
        (p) => p.type !== ControlPointType.ROTATE
      );
      expect(resizePoints?.length).toBe(8);
    });

    it('should have resize points at correct positions', () => {
      const element = createElement(ElementType.RECTANGLE, {
        transform: { x: 100, y: 100, width: 200, height: 150 },
      });

      const result = overlay.computeSelectionBox([element]);

      const nwPoint = result?.controlPoints.find((p) => p.type === ControlPointType.RESIZE_NW);
      expect(nwPoint?.x).toBe(100); // left
      expect(nwPoint?.y).toBe(100); // top

      const sePoint = result?.controlPoints.find((p) => p.type === ControlPointType.RESIZE_SE);
      expect(sePoint?.x).toBe(300); // right
      expect(sePoint?.y).toBe(250); // bottom
    });
  });
});

