import { watch } from 'vue';

import { MouseType, useCreationStore } from '../store/creation';

const usePresenter = () => {
    const creation = useCreationStore();

    const handleSelectClicked = () => {
        handleItemClicked('select');
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

    const handleItemClicked = (type: MouseType) => {
        if (creation.secondaryPanelType === type) {
            creation.secondaryPanelType = 'none';
        } else if (type === 'brush') {
            creation.secondaryPanelType = 'brush';
        } else {
            creation.secondaryPanelType = 'none';
        }
        creation.mouseType = type;
    };

    watch(
        () => creation.mouseType,
        () => {
            if (creation.mouseType === 'select') {
                document.getElementsByTagName('body')[0].style.cursor = 'auto';
            } else if (creation.mouseType === 'grab') {
                document.getElementsByTagName('body')[0].style.cursor = 'grab';
            } else if (creation.mouseType === 'brush') {
                document.getElementsByTagName('body')[0].style.cursor =
                    'url("cursor-brush.png") 0 10, auto';
            } else if (creation.mouseType === 'shape') {
                document.getElementsByTagName('body')[0].style.cursor = 'crosshair';
            } else if (creation.mouseType === 'text') {
                document.getElementsByTagName('body')[0].style.cursor = 'text';
            }
        }
    );

    return {
        handleSelectClicked,
        handleGrabClicked,
        handleBrushClicked,
        handleTextClicked,
        handleShapeClicked,
    };
};

export default usePresenter;
