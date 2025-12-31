import { describe, it, expect, beforeEach } from 'vitest';
import { AddElementCommand } from './AddElementCommand';
import { Scene } from '../../scene/Scene';
import { Element, createElement } from '../../types/element';
import { ElementType } from '../../types/ElementType';

describe('AddElementCommand', () => {
  let scene: Scene;
  let element: Element;

  beforeEach(() => {
    scene = new Scene();
    element = createElement(ElementType.RECTANGLE);
  });

  it('should add element on execute', () => {
    const cmd = new AddElementCommand(scene, element);
    cmd.execute();

    expect(scene.get(element.id)).toEqual(element);
  });

  it('should remove element on undo', () => {
    const cmd = new AddElementCommand(scene, element);
    cmd.execute();
    cmd.undo();

    expect(scene.get(element.id)).toBeUndefined();
  });
});

