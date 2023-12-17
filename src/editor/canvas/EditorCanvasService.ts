import * as PIXI from 'pixi.js';
import { UserAwareness } from '../../service/collab/Whiteboard';
import { UserAwarenessUI } from '../widget/UserAwarenessUI';
import { ViewportSprite } from '../sprite/ViewportSprite';
import { BoardElementModel } from '../../model/element/BoardElementModel';
import { BackgroundSprite } from '../sprite/BackgroundSprite';
import { CanvasModel } from '../../model/CanvasModel';

export class EditorCanvasService {
    private _bgSprite: BackgroundSprite;
    private _vpSprite: ViewportSprite;

    private _pixi: PIXI.Application;
    private _awareness: Map<string, UserAwarenessUI> = new Map();

    constructor(
        canvas: HTMLCanvasElement,
        canvasModel: CanvasModel,
        boardModel: BoardElementModel
    ) {
        this._pixi = new PIXI.Application({
            view: canvas,
            background: '#fff',
            antialias: true,
            autoDensity: true,
            resizeTo: canvas.parentElement!,
            resolution: window.devicePixelRatio,
        });
        this._pixi.stage.cullable = true;
        this._pixi.stage.eventMode = 'static';
        (globalThis as any).__PIXI_APP__ = this._pixi;

        canvasModel.setup(canvas);
        this._bgSprite = new BackgroundSprite(canvasModel);
        this._pixi.stage.addChild(this._bgSprite.sprite);

        this._vpSprite = new ViewportSprite(
            boardModel,
            this._pixi.view.width / window.devicePixelRatio,
            this._pixi.view.height / window.devicePixelRatio
        );
        this._pixi.stage.addChild(this._vpSprite.sprite);
    }

    updateUserAwareness(awareness: UserAwareness) {
        // let ui: UserAwarenessUI;
        // if (this._awareness.has(awareness.id)) {
        //     ui = this._awareness.get(awareness.id)!;
        // } else {
        //     ui = new UserAwarenessUI(this._vpService.container);
        //     this._vpService.container.addChild(ui.sprit);
        //     this._awareness.set(awareness.id, ui);
        // }
        // ui.updateUserAwareness(awareness);
    }
}
