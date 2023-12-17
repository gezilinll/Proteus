import { throttle } from 'lodash';
import { FunctionPanelItem } from '../../Defines';
import { BrushElementModel } from '../../model/element/BrushElementModel';
import { useBlitzStore } from '../../store/Blitz.store';
import { BaseElementModel } from '../../model/element/BaseElementModel';

const usePresenter = () => {
    const blitz = useBlitzStore();
    let currentElement: BaseElementModel | null = null;
    const mouse: {
        type: 'pressed' | 'dragging' | 'moving';
        lastX: number;
        lastY: number;
    } = {
        type: 'moving',
        lastX: 0,
        lastY: 0,
    };

    const onMouseDown = (type: FunctionPanelItem, x: number, y: number) => {
        mouse.type = 'pressed';
        mouse.lastX = x;
        mouse.lastY = y;
        if (type === 'brush') {
            currentElement = blitz.editorService.createElement(type);
            const position = blitz.editorService.calculateGlobalPosition(x, y);
            currentElement.moveTo(position.x, position.y);
            (currentElement as BrushElementModel).color = blitz.brushConfig.color;
            (currentElement as BrushElementModel).weight = blitz.brushConfig.weight;
            currentElement.notifyUpdated();
        }
    };

    const onMouseMove = (type: FunctionPanelItem, x: number, y: number) => {
        if (mouse.type === 'pressed') {
            mouse.type = 'dragging';
        }
        if (mouse.type === 'dragging' && type === 'grab') {
            blitz.editorService.move(x - mouse.lastX, y - mouse.lastY);
        } else if (mouse.type === 'dragging' && type === 'brush') {
            (currentElement as BrushElementModel).lineTo(
                (x - mouse.lastX) / blitz.editorService.zoom,
                (y - mouse.lastY) / blitz.editorService.zoom
            );
            currentElement!.notifyUpdated();
        }
        mouse.lastX = x;
        mouse.lastY = y;

        updateUserMousePosition(x, y);
    };

    const onMouseUp = () => {
        mouse.type = 'moving';
        currentElement = null!;
    };

    const updateUserMousePosition = throttle(function (x: number, y: number) {
        const globalPosition = blitz.editorService.calculateGlobalPosition(x, y);
        blitz.self.mouseX = globalPosition.x;
        blitz.self.mouseY = globalPosition.y;
    }, 50);

    return { onMouseDown, onMouseMove, onMouseUp };
};

export default usePresenter;
