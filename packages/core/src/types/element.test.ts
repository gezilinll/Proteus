import { describe, it, expect } from 'vitest';
import { createElement } from './element';
import { ElementType } from './ElementType';

describe('createElement', () => {
  it('should create element with default values', () => {
    const element = createElement(ElementType.RECTANGLE);

    expect(element.type).toBe(ElementType.RECTANGLE);
    expect(element.id).toBeDefined();
    expect(element.transform).toBeDefined();
    expect(element.style).toBeDefined();
    expect(element.meta).toBeDefined();
    expect(element.meta.createdAt).toBeDefined();
    expect(element.meta.visible).toBe(true);
    expect(element.meta.locked).toBe(false);
  });

  it('should create element with custom id', () => {
    const element = createElement(ElementType.RECTANGLE, { id: 'custom-id' });

    expect(element.id).toBe('custom-id');
  });

  it('should merge transform options', () => {
    const element = createElement(ElementType.RECTANGLE, {
      transform: { x: 100, y: 200 },
    });

    expect(element.transform.x).toBe(100);
    expect(element.transform.y).toBe(200);
    expect(element.transform.width).toBe(100); // 默认值
    expect(element.transform.height).toBe(100); // 默认值
  });

  it('should merge style options', () => {
    const element = createElement(ElementType.RECTANGLE, {
      style: { fill: '#ff0000', opacity: 0.5 },
    });

    expect(element.style.fill).toBe('#ff0000');
    expect(element.style.opacity).toBe(0.5);
    expect(element.style.stroke).toBeDefined(); // 默认值保留
  });

  it('should merge meta options', () => {
    const element = createElement(ElementType.RECTANGLE, {
      meta: { name: 'My Element', locked: true },
    });

    expect(element.meta.name).toBe('My Element');
    expect(element.meta.locked).toBe(true);
    expect(element.meta.visible).toBe(true); // 默认值保留
  });

  it('should set parentId', () => {
    const element = createElement(ElementType.RECTANGLE, {
      parentId: 'parent-123',
    });

    expect(element.parentId).toBe('parent-123');
  });

  it('should create different element types', () => {
    const rectangle = createElement(ElementType.RECTANGLE);
    const ellipse = createElement(ElementType.ELLIPSE);
    const text = createElement(ElementType.TEXT);
    const image = createElement(ElementType.IMAGE);
    const group = createElement(ElementType.GROUP);

    expect(rectangle.type).toBe(ElementType.RECTANGLE);
    expect(ellipse.type).toBe(ElementType.ELLIPSE);
    expect(text.type).toBe(ElementType.TEXT);
    expect(image.type).toBe(ElementType.IMAGE);
    expect(group.type).toBe(ElementType.GROUP);
  });

  it('should generate unique ids', () => {
    const el1 = createElement(ElementType.RECTANGLE);
    const el2 = createElement(ElementType.RECTANGLE);
    const el3 = createElement(ElementType.RECTANGLE);

    expect(el1.id).not.toBe(el2.id);
    expect(el2.id).not.toBe(el3.id);
    expect(el1.id).not.toBe(el3.id);
  });

  it('should create element with all custom options', () => {
    const element = createElement(ElementType.TEXT, {
      id: 'text-1',
      transform: { x: 50, y: 100, width: 200, height: 30, rotation: Math.PI / 4 },
      style: { fill: '#000000', fontSize: 16, text: 'Hello' },
      meta: { name: 'Title', locked: false, visible: true },
      parentId: 'group-1',
    });

    expect(element.id).toBe('text-1');
    expect(element.transform.x).toBe(50);
    expect(element.transform.rotation).toBe(Math.PI / 4);
    expect(element.style.text).toBe('Hello');
    expect(element.meta.name).toBe('Title');
    expect(element.parentId).toBe('group-1');
  });
});

