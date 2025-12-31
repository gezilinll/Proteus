import { describe, it, expect, beforeEach } from 'vitest';
import { UpdateElementCommand } from './UpdateElementCommand';
import { Scene } from '../../scene/Scene';
import { Element, createElement } from '../../types/element';
import { ElementType } from '../../types/ElementType';

describe('UpdateElementCommand', () => {
  let scene: Scene;
  let element: Element;

  beforeEach(() => {
    scene = new Scene();
    element = createElement(ElementType.RECTANGLE, {
      transform: { x: 0, y: 0, width: 100, height: 100 },
    });
    scene.add(element);
  });

  it('should update element on execute', () => {
    const updates = {
      transform: { ...element.transform, x: 50 },
    };
    const cmd = new UpdateElementCommand(scene, element.id, updates);
    cmd.execute();

    const updated = scene.get(element.id);
    expect(updated?.transform.x).toBe(50);
  });

  it('should restore element on undo', () => {
    const originalX = element.transform.x;
    const updates = {
      transform: { ...element.transform, x: 50 },
    };
    const cmd = new UpdateElementCommand(scene, element.id, updates);
    cmd.execute();
    cmd.undo();

    const restored = scene.get(element.id);
    expect(restored?.transform.x).toBe(originalX);
  });

  it('should support partial updates', () => {
    const updates = {
      style: { fill: '#ff0000' },
    };
    const cmd = new UpdateElementCommand(scene, element.id, updates);
    cmd.execute();

    const updated = scene.get(element.id);
    expect(updated?.style.fill).toBe('#ff0000');
    expect(updated?.transform.x).toBe(element.transform.x); // 其他属性不变
  });
});

