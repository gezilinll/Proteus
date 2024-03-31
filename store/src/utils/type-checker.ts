import { Element } from '../doc/base-element';
import { BrushElement } from '../doc/brush-element';

export function isBrushElement(e: Element): e is BrushElement {
    return e.type === 'brush';
}
