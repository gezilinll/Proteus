import { useBoardStore } from '@blitz/editor';
import { Fn, useRafFn } from '@vueuse/core';
import { ref } from 'vue';

const usePresenter = () => {
    const store = useBoardStore();
    const editor = store.editor!;

    const currentZoom = ref(100);
    let targetZoom = store.renderer.viewportParam.scale;

    const handleZoomOutClicked = () => {
        zoomOut(0.25);
    };

    const handleZoomInClicked = () => {
        zoomIn(0.25);
    };

    const handleZoomTo100Clicked = () => {
        zoomTo100();
    };

    const handleFitToScreenClicked = () => {};

    let pauseAnimation: Fn | null = null;
    const zoomIn = (step: number) => {
        if (store.renderer.viewportParam.scale >= 4) {
            return;
        }
        pauseAnimation?.();
        animationToTarget(Math.min(4, store.renderer.viewportParam.scale + step), 1);
    };

    const zoomOut = (step: number) => {
        if (store.renderer.viewportParam.scale <= 0.1) {
            return;
        }
        animationToTarget(Math.max(0.1, store.renderer.viewportParam.scale - step), -1);
    };

    const zoomTo100 = () => {
        if (store.renderer.viewportParam.scale === 1) {
            return;
        }
        animationToTarget(1, store.renderer.viewportParam.scale < 1 ? 1 : -1);
    };

    const fitToScreen = () => {};

    const animationToTarget = (target: number, direction: number) => {
        pauseAnimation?.();
        if (Math.abs(target - store.renderer.viewportParam.scale) <= 0.03) {
            editor.scale(target);
        } else {
            targetZoom = target;
            const animStep =
                direction * Math.abs((target - store.renderer.viewportParam.scale) / 15);
            const { pause } = useRafFn(() => {
                if (store.renderer.viewportParam.scale !== targetZoom) {
                    let result = store.renderer.viewportParam.scale + animStep;
                    if (direction === 1 && result > target) {
                        result = target;
                    } else if (direction === -1 && result < target) {
                        result = target;
                    }
                    editor.scale(result);
                } else {
                    pauseAnimation?.();
                }
            });
            pauseAnimation = pause;
        }
    };

    const subscription = store.editor.events.scale.subscribe((value) => {
        currentZoom.value = Math.floor(value.target * 100);
    });

    const destroy = () => {
        subscription.unsubscribe();
    };

    return {
        currentZoom,
        handleZoomOutClicked,
        handleZoomInClicked,
        handleZoomTo100Clicked,
        handleFitToScreenClicked,
        destroy,
    };
};

export default usePresenter;
