import { FunctionPanelItem } from '../Defines';
import { FunctionPanelModel } from './FunctionPanelModel';

export class FunctionPanelService {
    private _model: FunctionPanelModel;

    constructor(model: FunctionPanelModel) {
        this._model = model;
    }

    handleItemClicked(type: FunctionPanelItem) {
        if (type === 'selector') {
            this._model.showPanel.value = false;
        } else if (this._model.selected.value === type) {
            this._model.showPanel.value = !this._model.showPanel.value;
        }
        this._model.selected.value = type;
    }
}
