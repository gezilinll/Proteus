import { describe, it, expect, beforeEach } from 'vitest';
import { RemoveElementCommand } from './RemoveElementCommand';
import { Scene } from '../../scene/Scene';
import { Element, createElement } from '../../types/element';
import { ElementType } from '../../types/ElementType';

describe('RemoveElementCommand', () => {
  let scene: Scene;
  let element: Element;

  beforeEach(() => {
    scene = new Scene();
    element = createElement(ElementType.RECTANGLE);
    scene.add(element);
  });

  it('should remove element on execute', () => {
    const cmd = new RemoveElementCommand(scene, element.id);
    cmd.execute();

    expect(scene.get(element.id)).toBeUndefined();
  });

  it('should restore element on undo', () => {
    const cmd = new RemoveElementCommand(scene, element.id);
    cmd.execute();
    cmd.undo();

    expect(scene.get(element.id)).toEqual(element);
  });

  it('should remove and restore children', () => {
    const parent = createElement(ElementType.GROUP);
    const child = createElement(ElementType.RECTANGLE, { parentId: parent.id });

    scene.add(parent);
    scene.add(child);

    const cmd = new RemoveElementCommand(scene, parent.id);
    cmd.execute();
    expect(scene.get(child.id)).toBeUndefined();

    cmd.undo();
    expect(scene.get(parent.id)).toBeDefined();
    expect(scene.get(child.id)).toBeDefined();
  });

  it('should restore element at original order position', () => {
    // 使用新的 scene 来测试顺序恢复
    const testScene = new Scene();
    const el1 = createElement(ElementType.RECTANGLE);
    const el2 = createElement(ElementType.ELLIPSE);
    const el3 = createElement(ElementType.RECTANGLE);

    testScene.add(el1);
    testScene.add(el2);
    testScene.add(el3);

    // 删除中间的元素
    const cmd = new RemoveElementCommand(testScene, el2.id);
    cmd.execute();
    expect(testScene.getOrder()).toEqual([el1.id, el3.id]);

    // 恢复后应该回到原来的位置
    cmd.undo();
    expect(testScene.getOrder()).toEqual([el1.id, el2.id, el3.id]);
  });
});

