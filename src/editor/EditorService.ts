import { ElementType } from '../Defines';
import { EditorModel, Element } from './EditorModel';
import { BrushElementModel } from './element/brush/BrushElementModel';
import { BrushElementService } from './element/brush/BrushElementService';
import { ViewportService } from './element/viewport/ViewportService';
import * as PIXI from 'pixi.js';

export class EditorService {
    private _vpService: ViewportService;
    private _pixi: PIXI.Application;

    constructor(pixi: PIXI.Application, model: EditorModel) {
        this._pixi = pixi;
        this._vpService = new ViewportService(model.viewport);
        this._pixi.stage.addChild(this._vpService.sprite);
        this._pixi.ticker.add(this._renderFrame, this);
    }

    createElement(type: ElementType): Element {
        const model = new BrushElementModel();
        const service = new BrushElementService(model);
        this._vpService.add(model, service);
        return { model, service };
    }

    move(deltaX: number, deltaY: number) {
        this._vpService.move(deltaX, deltaY);
    }

    private _renderFrame() {
        this._vpService.render();
    }
}
