import { BrushPanelItem } from '../../Defines';
import { BrushPanelModel } from './BrushPanelModel';

export class BrushPanelService {
    constructor(private _model: BrushPanelModel) {}

    handleItemClicked(type: BrushPanelItem) {
        this._model.selected.value = type;
    }

    handleConfigClick(index: number) {
        if (this._model.selected.value === 'pen') {
            if (this._model.penConfigIndex.value === index) {
                this._model.showColorPanel.value = !this._model.showColorPanel.value;
            }
            this._model.penConfigIndex.value = index;
            this._model.brushColor.value = this._model.penConfigs[index].color;
        } else if (this._model.selected.value === 'highlighter') {
            if (this._model.highlighterConfigIndex.value === index) {
                this._model.showColorPanel.value = !this._model.showColorPanel.value;
            }
            this._model.highlighterConfigIndex.value = index;
            this._model.brushColor.value = this._model.highlighterConfigs[index].color;
        }
    }
}
