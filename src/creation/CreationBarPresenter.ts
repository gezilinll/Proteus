import { watch } from 'vue';
import { useModel } from './CreationBarModel';
import { useBlitzStore } from '../store/Blitz.store';
import { FunctionPanelItem } from '../Defines';

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

    const handleItemClicked = (type: FunctionPanelItem) => {
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
            }
            blitz.selectedFunction = model.selected.value;
        }
    );

    return {
        model,
        handleSelectorClicked,
        handleGrabClicked,
        handleBrushClicked,
    };
};

export default usePresenter;
