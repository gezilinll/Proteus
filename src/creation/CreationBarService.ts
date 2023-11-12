import { FunctionPanelItem } from '../Defines';
import { CreationBarModel } from './CreationBarModel';

export class CreationBarService {
    private _model: CreationBarModel;

    constructor(model: CreationBarModel) {
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
