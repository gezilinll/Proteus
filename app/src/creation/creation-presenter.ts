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
        creation.mouseType = type;
    };

    // watch(
    //     () => model.selected.value,
    //     () => {
    //         if (model.selected.value === 'selector') {
    //             document.getElementsByTagName('body')[0].style.cursor = 'auto';
    //         } else if (model.selected.value === 'grab') {
    //             document.getElementsByTagName('body')[0].style.cursor = 'grab';
    //         } else if (model.selected.value === 'brush') {
    //             document.getElementsByTagName('body')[0].style.cursor =
    //                 'url("cursor-brush.png") 0 10, auto';
    //         } else if (model.selected.value === 'shape') {
    //             document.getElementsByTagName('body')[0].style.cursor = 'crosshair';
    //         } else if (model.selected.value === 'text') {
    //             document.getElementsByTagName('body')[0].style.cursor = 'text';
    //         }
    //         blitz.selectedFunction = model.selected.value;
    //     }
    // );

    return {
        handleSelectClicked,
        handleGrabClicked,
        handleBrushClicked,
        handleTextClicked,
        handleShapeClicked,
    };
};

export default usePresenter;
