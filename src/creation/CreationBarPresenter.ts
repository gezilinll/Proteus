import { watch } from 'vue';
import { useAppStore } from '../store/App.store';
import { useModel } from './CreationBarModel';
import { CreationBarService } from './CreationBarService';

const usePresenter = () => {
    const appStore = useAppStore();
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
            appStore.selectedFunction = model.selected.value;
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
