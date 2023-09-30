import { ElementService } from '../ElementService';
import { ViewportModel } from './ViewportModel';
import * as PIXI from 'pixi.js';
import { ElementModel } from '../ElementModel';

export class ViewportService {
    container: PIXI.Container;
    services: Map<string, ElementService> = new Map();

    private _moveX: number = 0;
    private _moveY: number = 0;
    private _model: ViewportModel;

    constructor(model: ViewportModel) {
        this._model = model;
        this.container = new PIXI.Container();
    }

    get elements() {
        return this._model.elements;
    }

    add(model: ElementModel, service: ElementService) {
        this._model.elements.push(model);
        this.container.addChild(service.sprite);
        this.services.set(model.uuid, service);
    }

    move(deltaX: number, deltaY: number): void {
        this.container.position.x -= this._moveX;
        this.container.position.y -= this._moveY;

        this._moveX += deltaX;
        this._moveY += deltaY;

        this.container.position.x += this._moveX;
        this.container.position.y += this._moveY;

        this._model.position.left = this.container.position.x;
        this._model.position.top = this.container.position.y;
    }

    zoomTo(target: number): void {
        this.container.scale.set(target, target);
        const newW = this._model.canvasWidth * target;
        const newH = this._model.canvasHeight * target;
        const offsetX = (this._model.canvasWidth - newW) / 2.0;
        const offsetY = (this._model.canvasHeight - newH) / 2.0;
        this.container.position.x = offsetX + this._moveX;
        this.container.position.y = offsetY + this._moveY;
    }

    render(): void {
        for (const entry of this.services) {
            entry[1].render();
        }
    }
}
