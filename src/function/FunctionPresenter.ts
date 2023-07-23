import { watch } from 'vue';
import { useModel } from './FunctionModel';
import { FunctionService } from './FunctionService';

const usePresenter = () => {
    const model = useModel();
    const service = new FunctionService(model);

    const handleSelectorClicked = () => {
        service.handleItemClicked('selector');
    };

    const handleGrabClicked = () => {
        service.handleItemClicked('grab');
    };

    const handleBrushClicked = () => {
        service.handleItemClicked('brush');
    };

    return {
        model,
        handleSelectorClicked,
        handleGrabClicked,
        handleBrushClicked,
    };
};

export default usePresenter;
