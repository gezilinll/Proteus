import { ToolsBarModel } from './ToolsBarModel';
import { Fn, useRafFn } from '@vueuse/core';

export class ToolsBarService {
    private _pauseAnimation: Fn | undefined = undefined;

    constructor(private _model: ToolsBarModel) {}

    zoomIn(step: number) {
        if (this._model.current.value >= 400) {
            return;
        }
        this._pauseAnimation?.();
        this._animationToTarget(Math.min(400, this._model.current.value + step), 1);
    }

    zoomOut(step: number) {
        if (this._model.current.value <= 10) {
            return;
        }
        this._animationToTarget(Math.max(10, this._model.current.value - step), -1);
    }

    zoomTo100() {
        if (this._model.current.value === 100) {
            return;
        }
        this._animationToTarget(100, this._model.current.value < 100 ? 1 : -1);
    }

    fitToScreen() {}

    private _animationToTarget(target: number, direction: number) {
        this._pauseAnimation?.();
        if (Math.abs(target - this._model.current.value) <= 3) {
            this._model.current.value = target;
        } else {
            this._model.target.value = target;
            const animStep =
                Math.max(1, Math.floor(Math.abs(target - this._model.current.value) / (300 / 16))) *
                direction;
            const { pause } = useRafFn(() => {
                if (this._model.current.value !== this._model.target.value) {
                    let result = this._model.current.value + animStep;
                    if (direction === 1 && result > target) {
                        result = target;
                    } else if (direction === -1 && result < target) {
                        result = target;
                    }
                    this._model.current.value = result;
                } else {
                    this._pauseAnimation?.();
                }
            });
            this._pauseAnimation = pause;
        }
    }
}
