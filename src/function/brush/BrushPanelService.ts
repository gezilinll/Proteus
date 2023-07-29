import { BrushPanelItem } from '../../Defines';
import { BrushPanelModel } from './BrushPanelModel';

export class BrushPanelService {
    constructor(private _model: BrushPanelModel) {}

    handleItemClicked(type: BrushPanelItem) {
        this._model.selected.value = type;
    }
}
