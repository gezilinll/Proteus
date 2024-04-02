import { useEditorStore } from '@blitz/editor';
import { Fn, useRafFn } from '@vueuse/core';
import { ref } from 'vue';

const usePresenter = () => {
    const store = useEditorStore();
    const editor = store.editor!;

    const currentZoom = ref(100);
    let targetZoom = store.viewport.scale;

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
        if (store.viewport.scale >= 4) {
            return;
        }
        pauseAnimation?.();
        animationToTarget(Math.min(4, store.viewport.scale + step), 1);
    };

    const zoomOut = (step: number) => {
        if (store.viewport.scale <= 0.1) {
            return;
        }
        animationToTarget(Math.max(0.1, store.viewport.scale - step), -1);
    };

    const zoomTo100 = () => {
        if (store.viewport.scale === 1) {
            return;
        }
        animationToTarget(1, store.viewport.scale < 1 ? 1 : -1);
    };

    const fitToScreen = () => {};

    const animationToTarget = (target: number, direction: number) => {
        pauseAnimation?.();
        if (Math.abs(target - store.viewport.scale) <= 0.03) {
            editor.scale(target);
        } else {
            targetZoom = target;
            const animStep = direction * Math.abs((target - store.viewport.scale) / 15);
            const { pause } = useRafFn(() => {
                if (store.viewport.scale !== targetZoom) {
                    let result = store.viewport.scale + animStep;
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

    store.editor.events.scale.subscribe((value) => {
        currentZoom.value = Math.floor(value.target * 100);
    });

    return {
        currentZoom,
        handleZoomOutClicked,
        handleZoomInClicked,
        handleZoomTo100Clicked,
        handleFitToScreenClicked,
    };
};

export default usePresenter;
