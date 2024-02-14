import { watch } from 'vue';

import { CreationType } from '../defines';
import { useBlitzStore } from '../store/blitz.store';
import { useModel } from './CreationBarModel';

const usePresenter = () => {
    const blitz = useBlitzStore();
    const model = useModel();

    const handleSelectorClicked = () => {
        handleItemClicked('selector');
    };

    const handleGrabClicked = () => {
        handleItemClicked('grab');
    };

    const handleBrushClicked = () => {
        handleItemClicked('brush');
    };

    const handleTextClicked = () => {
        handleItemClicked('text');
    };

    const handleShapeClicked = () => {
        handleItemClicked('shape');
    };

    const handleItemClicked = (type: CreationType) => {
        if (type === 'selector') {
            model.showPanel.value = false;
        } else if (model.selected.value === type) {
            model.showPanel.value = !model.showPanel.value;
        }
        model.selected.value = type;
    };

    watch(
        () => model.selected.value,
        () => {
            if (model.selected.value === 'selector') {
                document.getElementsByTagName('body')[0].style.cursor = 'auto';
            } else if (model.selected.value === 'grab') {
                document.getElementsByTagName('body')[0].style.cursor = 'grab';
            } else if (model.selected.value === 'brush') {
                document.getElementsByTagName('body')[0].style.cursor =
                    'url("cursor-brush.png") 0 10, auto';
            } else if (model.selected.value === 'shape') {
                document.getElementsByTagName('body')[0].style.cursor = 'crosshair';
            } else if (model.selected.value === 'text') {
                document.getElementsByTagName('body')[0].style.cursor = 'text';
            }
            blitz.selectedFunction = model.selected.value;
        }
    );

    return {
        model,
        handleSelectorClicked,
        handleGrabClicked,
        handleBrushClicked,
        handleTextClicked,
        handleShapeClicked,
    };
};

export default usePresenter;
