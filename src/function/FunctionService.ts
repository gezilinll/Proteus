import { FunctionItem } from '../Defines';
import { FunctionModel } from './FunctionModel';

export class FunctionService {
    private _model: FunctionModel;

    constructor(model: FunctionModel) {
        this._model = model;
    }

    handleItemClicked(type: FunctionItem) {
        if (type === 'selector') {
            this._model.showPanel.value = false;
        } else if (this._model.type.value === type) {
            this._model.showPanel.value = !this._model.showPanel.value;
        }
        this._model.type.value = type;
    }
}
