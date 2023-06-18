export interface Element {
    type: 'graphics' | 'image';

    onMouseDown(e: MouseEvent): void;

    onMouseMove(e: MouseEvent): void;

    onMouseUp(e: MouseEvent): void;
}
