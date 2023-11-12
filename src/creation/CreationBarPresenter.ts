import { watch } from 'vue';
import { useModel } from './CreationBarModel';
import { CreationBarService } from './CreationBarService';
import { useBlitzStore } from '../store/Blitz.store';

const usePresenter = () => {
    const blitz = useBlitzStore();
    const model = useModel();
    const service = new CreationBarService(model);

    const handleSelectorClicked = () => {
        service.handleItemClicked('selector');
    };

    const handleGrabClicked = () => {
        service.handleItemClicked('grab');
    };

    const handleBrushClicked = () => {
        service.handleItemClicked('brush');
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
