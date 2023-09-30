import axios from 'axios';
import { ElementType } from '../Defines';
import { EditorModel, Element } from './EditorModel';
import { BrushElementModel } from './element/brush/BrushElementModel';
import { BrushElementService } from './element/brush/BrushElementService';
import { ViewportService } from './element/viewport/ViewportService';
import * as PIXI from 'pixi.js';
import { SERVER_URL } from '../Constants';
import { ElementModel } from './element/ElementModel';
import { UserAwareness } from '../collab/room/Whiteboard';
import { UserAwarenessUI } from './ui/UserAwarenessUI';

export class EditorService {
    private _vpService: ViewportService;
    private _pixi: PIXI.Application;
    private _awareness: Map<string, UserAwarenessUI> = new Map();

    constructor(pixi: PIXI.Application, model: EditorModel) {
        this._pixi = pixi;
        this._vpService = new ViewportService(model.viewport);
        this._pixi.stage.addChild(this._vpService.container);
        this._pixi.ticker.add(this._renderFrame, this);
    }

    loadFromContent(json: string) {
        const elements = JSON.parse(json) as ElementModel[];
        // for (const item of elements) {
        //     //TODO
        // }
        console.log('loadFromContent', json, elements);
    }

    exportContent() {
        const elements = [];
        for (const service of this._vpService.services) {
            elements.push(service[1].toJSON());
        }
        return JSON.stringify(elements);
    }

    uploadContent(recordID: string, content: string, token: string) {
        return new Promise(async (resolve, reject) => {
            try {
                await axios.get(
                    `${SERVER_URL}/record/updateContent?recordID=${recordID}&content=${content}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                resolve(undefined);
            } catch (error) {
                console.log('getUserInfo failed');
                reject();
            }
        });
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

    calculateGlobalPosition(mouseX: number, mouseY: number) {
        return {
            x: (mouseX - this._vpService.container.position.x) / this._vpService.container.scale.x,
            y: (mouseY - this._vpService.container.position.y) / this._vpService.container.scale.y,
        };
    }

    updateUserAwareness(awareness: UserAwareness) {
        let ui: UserAwarenessUI;
        if (this._awareness.has(awareness.id)) {
            ui = this._awareness.get(awareness.id)!;
        } else {
            ui = new UserAwarenessUI(this._vpService.container);
            this._vpService.container.addChild(ui.sprit);
            this._awareness.set(awareness.id, ui);
        }
        ui.updateUserAwareness(awareness);
    }

    get zoom() {
        return this._vpService.container.scale.x;
    }

    zoomTo(target: number) {
        this._vpService.zoomTo(target);
    }

    private _renderFrame() {
        this._vpService.render();
    }
}
