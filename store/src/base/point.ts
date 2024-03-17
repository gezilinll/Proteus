export class Point {
    x: number = 0;
    y: number = 0;

    constructor(x?: number, y?: number) {
        this.x = x ?? 0;
        this.y = y ?? 0;
    }
}
