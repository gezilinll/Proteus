export class BackgroundRenderer {
    private _canvas: HTMLCanvasElement;
    private _zoom: number = 1.0;
    private _moveX: number = 0;
    private _moveY: number = 0;

    constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas;
    }

    zoomTo(value: number) {
        this._zoom = value;
    }

    dragTo(x: number, y: number) {
        this._moveX = x;
        this._moveY = y;
    }

    render(): void {
        const canvasWidth = this._canvas.width;
        const canvasHeight = this._canvas.height;
        const rectSize = 100 * this._zoom;

        const ctx = this._canvas.getContext('2d')!;
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = 'rgb(240, 240, 240)';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        ctx.strokeStyle = 'rgb(222, 222, 222)';
        ctx.beginPath();
        const startY = canvasHeight / 2.0;
        const startX = canvasWidth / 2.0;
        ctx.moveTo(0, startY);
        ctx.lineTo(canvasWidth, startY);
        ctx.moveTo(startX, 0);
        ctx.lineTo(startX, canvasHeight);
        for (let yIndex = 1; ; yIndex++) {
            const upY = startY - yIndex * rectSize;
            const downY = startY + yIndex * rectSize;
            if (upY < 0 && downY > canvasHeight) {
                break;
            }
            ctx.moveTo(0, upY);
            ctx.lineTo(canvasWidth, upY);
            ctx.moveTo(0, downY);
            ctx.lineTo(canvasWidth, downY);
        }
        for (let xIndex = 1; ; xIndex++) {
            const leftX = startX - xIndex * rectSize;
            const rightX = startX + xIndex * rectSize;
            if (leftX < 0 && rightX > canvasWidth) {
                break;
            }
            ctx.moveTo(leftX, 0);
            ctx.lineTo(leftX, canvasHeight);
            ctx.moveTo(rightX, 0);
            ctx.lineTo(rightX, canvasHeight);
        }
        ctx.closePath();
        ctx.stroke();
    }
}
