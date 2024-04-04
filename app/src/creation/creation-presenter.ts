import { MouseType, useBoardStore, useBoardStore } from '@blitz/editor';

import { useCreationStore } from '../store/creation';

const usePresenter = () => {
    const editor = useBoardStore();
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
        editor.mouseType = type;
    };

    return {
        handleSelectClicked,
        handleGrabClicked,
        handleBrushClicked,
        handleTextClicked,
        handleShapeClicked,
    };
};

export default usePresenter;
