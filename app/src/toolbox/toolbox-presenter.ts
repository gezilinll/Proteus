import { useEditorStore } from '@blitz/editor';
import { Fn, useRafFn } from '@vueuse/core';
import { ref } from 'vue';

const usePresenter = () => {
    const store = useEditorStore();
    const editor = store.editor!;

    const currentZoom = ref(100);
    let targetZoom = editor.zoom;

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
        if (editor.zoom >= 4) {
            return;
        }
        pauseAnimation?.();
        animationToTarget(Math.min(4, editor.zoom + step), 1);
    };

    const zoomOut = (step: number) => {
        if (editor.zoom <= 0.1) {
            return;
        }
        animationToTarget(Math.max(0.1, editor.zoom - step), -1);
    };

    const zoomTo100 = () => {
        if (editor.zoom === 1) {
            return;
        }
        animationToTarget(1, editor.zoom < 1 ? 1 : -1);
    };

    const fitToScreen = () => {};

    const animationToTarget = (target: number, direction: number) => {
        pauseAnimation?.();
        if (Math.abs(target - editor.zoom) <= 0.03) {
            editor.zoomCanvasTo(target);
        } else {
            targetZoom = target;
            const animStep = 0.01 * direction;
            const { pause } = useRafFn(() => {
                if (editor.zoom !== targetZoom) {
                    let result = editor.zoom + animStep;
                    if (direction === 1 && result > target) {
                        result = target;
                    } else if (direction === -1 && result < target) {
                        result = target;
                    }
                    editor.zoomCanvasTo(result);
                } else {
                    pauseAnimation?.();
                }
            });
            pauseAnimation = pause;
        }
    };

    store.editor.events.zoomCanvasTo.subscribe((value) => {
        currentZoom.value = Math.floor(value * 100);
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
