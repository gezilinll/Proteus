import * as PIXI from 'pixi.js';
import { UserAwareness } from '../../service/collab/Whiteboard';
import { UserAwarenessUI } from '../widget/UserAwarenessUI';
import { BoardSprite } from '../sprite/BoardSprite';
import { BoardElementModel } from '../../model/element/BoardElementModel';
import { BackgroundSprite } from '../sprite/BackgroundSprite';
import { BackgroundModel } from '../../model/BackgroundModel';

export class EditorCanvasService {
    private _bgSprite: BackgroundSprite;
    private _boardSprite: BoardSprite;

    private _pixi: PIXI.Application;
    private _awareness: Map<string, UserAwarenessUI> = new Map();

    constructor(
        canvas: HTMLCanvasElement,
        backgroundModel: BackgroundModel,
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

        backgroundModel.setup(canvas);
        this._bgSprite = new BackgroundSprite(backgroundModel);
        this._pixi.stage.addChild(this._bgSprite.sprite);

        this._boardSprite = new BoardSprite(
            boardModel,
            this._pixi.view.width / window.devicePixelRatio,
            this._pixi.view.height / window.devicePixelRatio
        );
        this._pixi.stage.addChild(this._boardSprite.sprite);
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
