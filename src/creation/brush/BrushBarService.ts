import { BrushPanelItem } from '../../Defines';
import { BrushBarModel } from './BrushBarModel';

export class BrushBarService {
    constructor(private _model: BrushBarModel) {}

    handleItemClicked(type: BrushPanelItem) {
        this._model.selected.value = type;
        this._model.showConfigPanel.value = false;
    }

    handleConfigClick(index: number) {
        if (this._model.selected.value === 'pen') {
            if (this._model.penConfigIndex.value === index) {
                this._model.showConfigPanel.value = !this._model.showConfigPanel.value;
            }
            this._model.penConfigIndex.value = index;
            this._model.brushColor.value = this._model.penConfigs[index].color;
            this._model.brushWeight.value = this._model.penConfigs[index].weight;
        } else if (this._model.selected.value === 'highlighter') {
            if (this._model.highlighterConfigIndex.value === index) {
                this._model.showConfigPanel.value = !this._model.showConfigPanel.value;
            }
            this._model.highlighterConfigIndex.value = index;
            this._model.brushColor.value = this._model.highlighterConfigs[index].color;
            this._model.brushWeight.value = this._model.highlighterConfigs[index].weight;
        }
    }
}
