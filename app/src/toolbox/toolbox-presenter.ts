import { useEditorStore } from '@blitz/editor';
import { Fn, useRafFn } from '@vueuse/core';
import { ref, watch } from 'vue';

const usePresenter = () => {
    const store = useEditorStore();

    const currentZoom = ref(100);
    const targetZoom = ref(100);

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

    let pauseAnimation: Fn | null = null;
    const zoomIn = (step: number) => {
        if (currentZoom.value >= 400) {
            return;
        }
        pauseAnimation?.();
        animationToTarget(Math.min(400, currentZoom.value + step), 1);
    };

    const zoomOut = (step: number) => {
        if (currentZoom.value <= 10) {
            return;
        }
        animationToTarget(Math.max(10, currentZoom.value - step), -1);
    };

    const zoomTo100 = () => {
        if (currentZoom.value === 100) {
            return;
        }
        animationToTarget(100, currentZoom.value < 100 ? 1 : -1);
    };

    const fitToScreen = () => {};

    const animationToTarget = (target: number, direction: number) => {
        pauseAnimation?.();
        if (Math.abs(target - currentZoom.value) <= 3) {
            currentZoom.value = target;
        } else {
            targetZoom.value = target;
            const animStep =
                Math.max(1, Math.floor(Math.abs(target - currentZoom.value) / (300 / 16))) *
                direction;
            const { pause } = useRafFn(() => {
                if (currentZoom.value !== targetZoom.value) {
                    let result = currentZoom.value + animStep;
                    if (direction === 1 && result > target) {
                        result = target;
                    } else if (direction === -1 && result < target) {
                        result = target;
                    }
                    currentZoom.value = result;
                } else {
                    pauseAnimation?.();
                }
            });
            pauseAnimation = pause;
        }
    };

    watch(
        () => currentZoom.value,
        () => {
            store.editor?.zoomTo(currentZoom.value / 100);
        }
    );

    return {
        currentZoom,
        handleZoomOutClicked,
        handleZoomInClicked,
        handleZoomTo100Clicked,
        handleFitToScreenClicked,
    };
};

export default usePresenter;
