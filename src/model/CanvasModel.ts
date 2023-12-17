export declare type OnCanvasUpdated = () => void;

export class CanvasModel {
    width: number = 0;
    height: number = 0;
    styleWidth: number = 0;
    styleHeight: number = 0;
    zoom: number = 1.0;
    translateX: number = 0;
    translateY: number = 0;
    private _observer?: OnCanvasUpdated;

    registerObserver(observer: OnCanvasUpdated) {
        this._observer = observer;
    }

    setup(canvas: HTMLCanvasElement) {
        this.width = canvas.width;
        this.height = canvas.height;
        this.styleWidth = canvas.width * window.devicePixelRatio;
        this.styleHeight = canvas.height * window.devicePixelRatio;
        this._observer?.();
    }

    zoomTo(target: number) {
        this.zoom = target;
        this._observer?.();
    }

    move(deltaX: number, deltaY: number) {
        this.translateX += deltaX * window.devicePixelRatio;
        this.translateY += deltaY * window.devicePixelRatio;
        this._observer?.();
    }
}
