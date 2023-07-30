import { ElementService } from '../ElementService';
import { ViewportModel } from './ViewportModel';
import * as PIXI from 'pixi.js';
import { ElementModel } from '../ElementModel';

export class ViewportService {
    sprite: PIXI.Container;
    services: Map<string, ElementService> = new Map();

    private _moveX: number = 0;
    private _moveY: number = 0;
    private _model: ViewportModel;

    constructor(model: ViewportModel) {
        this._model = model;
        this.sprite = new PIXI.Container();
    }

    add(model: ElementModel, service: ElementService) {
        this._model.elements.push(model);
        this.sprite.addChild(service.sprite);
        this.services.set(model.uuid, service);
    }

    move(deltaX: number, deltaY: number): void {
        this.sprite.position.x -= this._moveX;
        this.sprite.position.y -= this._moveY;

        this._moveX += deltaX;
        this._moveY += deltaY;

        this.sprite.position.x += this._moveX;
        this.sprite.position.y += this._moveY;

        this._model.position.left = this.sprite.position.x;
        this._model.position.top = this.sprite.position.y;
    }

    zoomTo(target: number): void {
        this.sprite.scale.set(target, target);
        const newW = this._model.canvasWidth * target;
        const newH = this._model.canvasHeight * target;
        const offsetX = (this._model.canvasWidth - newW) / 2.0;
        const offsetY = (this._model.canvasHeight - newH) / 2.0;
        this.sprite.position.x = offsetX + this._moveX;
        this.sprite.position.y = offsetY + this._moveY;
    }

    render(): void {
        for (const entry of this.services) {
            entry[1].render();
        }
    }
}
