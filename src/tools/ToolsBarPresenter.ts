import { watch } from 'vue';
import { useModel } from './ToolsBarModel';
import { useBlitzStore } from '../store/Blitz.store';
import { Fn, useRafFn } from '@vueuse/core';

const usePresenter = () => {
    const model = useModel();

    const blitz = useBlitzStore();
    model.current.value = 100;
    blitz.registerWheel((x: number, y: number) => {
        if (y > 0) {
            zoomOut(10);
        } else if (y < 0) {
            zoomIn(10);
        }
    });

    const handleZoomOutClicked = () => {
        zoomOut(25);
    };

    const handleZoomInClicked = () => {
        zoomIn(25);
    };

    const handleZoomTo100Clicked = () => {
        zoomTo100();
    };

    const handleFitToScreenClicked = () => {};

    let pauseAnimation: Fn | undefined = undefined;
    const zoomIn = (step: number) => {
        if (model.current.value >= 400) {
            return;
        }
        pauseAnimation?.();
        animationToTarget(Math.min(400, model.current.value + step), 1);
    };

    const zoomOut = (step: number) => {
        if (model.current.value <= 10) {
            return;
        }
        animationToTarget(Math.max(10, model.current.value - step), -1);
    };

    const zoomTo100 = () => {
        if (model.current.value === 100) {
            return;
        }
        animationToTarget(100, model.current.value < 100 ? 1 : -1);
    };

    const fitToScreen = () => {};

    const animationToTarget = (target: number, direction: number) => {
        pauseAnimation?.();
        if (Math.abs(target - model.current.value) <= 3) {
            model.current.value = target;
        } else {
            model.target.value = target;
            const animStep =
                Math.max(1, Math.floor(Math.abs(target - model.current.value) / (300 / 16))) *
                direction;
            const { pause } = useRafFn(() => {
                if (model.current.value !== model.target.value) {
                    let result = model.current.value + animStep;
                    if (direction === 1 && result > target) {
                        result = target;
                    } else if (direction === -1 && result < target) {
                        result = target;
                    }
                    model.current.value = result;
                } else {
                    pauseAnimation?.();
                }
            });
            pauseAnimation = pause;
        }
    };

    watch(
        () => model.current.value,
        () => {
            blitz.editorService.zoomTo(model.current.value / 100);
        }
    );

    return {
        model,
        handleZoomOutClicked,
        handleZoomInClicked,
        handleZoomTo100Clicked,
        handleFitToScreenClicked,
    };
};

export default usePresenter;
