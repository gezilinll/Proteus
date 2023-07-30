import { watch } from 'vue';
import { useModel } from './BrushPanelModel';
import { BrushPanelService } from './BrushPanelService';
import { useAppStore } from '../../App.store';

const usePresenter = () => {
    const appStore = useAppStore();
    const model = useModel();
    const service = new BrushPanelService(model);

    appStore.brushConfig.weight = model.brushWeight.value;
    appStore.brushConfig.color = model.brushColor.value;

    const handlePenClicked = () => {
        service.handleItemClicked('pen');
        appStore.brushConfig.weight = model.penConfigs[model.penConfigIndex.value].weight;
        appStore.brushConfig.color = model.penConfigs[model.penConfigIndex.value].color;
    };

    const handleHighlighterClicked = () => {
        service.handleItemClicked('highlighter');
        appStore.brushConfig.weight =
            model.highlighterConfigs[model.highlighterConfigIndex.value].weight;
        appStore.brushConfig.color =
            model.highlighterConfigs[model.highlighterConfigIndex.value].color;
    };

    const handleEraserClicked = () => {
        service.handleItemClicked('eraser');
    };

    const handlePenConfigClicked = (index: number) => {
        service.handleConfigClick(index);
        appStore.brushConfig.weight = model.penConfigs[index].weight;
        appStore.brushConfig.color = model.penConfigs[index].color;
    };

    const handleHighlighterConfigClicked = (index: number) => {
        service.handleConfigClick(index);
        appStore.brushConfig.weight = model.highlighterConfigs[index].weight;
        appStore.brushConfig.color = model.highlighterConfigs[index].color;
    };

    watch(
        () => model.brushColor.value,
        () => {
            if (model.selected.value === 'pen') {
                model.penConfigs[model.penConfigIndex.value].color = model.brushColor.value;
            } else if (model.selected.value === 'highlighter') {
                model.highlighterConfigs[model.highlighterConfigIndex.value].color =
                    model.brushColor.value;
            }
            appStore.brushConfig.color = model.brushColor.value;
        }
    );

    watch(
        () => model.brushWeight.value,
        () => {
            if (model.selected.value === 'pen') {
                model.penConfigs[model.penConfigIndex.value].weight = model.brushWeight.value;
            } else if (model.selected.value === 'highlighter') {
                model.highlighterConfigs[model.highlighterConfigIndex.value].weight =
                    model.brushWeight.value;
                appStore.brushConfig.weight = model.brushWeight.value;
            }
        }
    );

    return {
        model,
        handlePenClicked,
        handleHighlighterClicked,
        handleEraserClicked,
        handlePenConfigClicked,
        handleHighlighterConfigClicked,
    };
};

export default usePresenter;
