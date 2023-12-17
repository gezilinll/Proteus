import * as PIXI from 'pixi.js';
import { UserAwareness } from '../../service/collab/Whiteboard';
import { UserAwarenessWidget } from '../widget/UserAwarenessWidget';
import { BoardSprite } from '../sprite/BoardSprite';
import { BoardElementModel } from '../../model/element/BoardElementModel';
import { BackgroundSprite } from '../sprite/BackgroundSprite';
import { BackgroundModel } from '../../model/BackgroundModel';

export class EditorCanvasService {
    private _bgSprite: BackgroundSprite;
    private _boardSprite: BoardSprite;

    private _userAwarenessContainer: PIXI.Container;
    private _userAwarenessWidgets: Map<string, UserAwarenessWidget> = new Map();

    private _pixi: PIXI.Application;

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

        this._userAwarenessContainer = new PIXI.Container();
        this._userAwarenessContainer.zIndex = 999999999;
        this._pixi.stage.addChild(this._userAwarenessContainer);
    }

    updateUserAwareness(awareness: UserAwareness) {
        let widget: UserAwarenessWidget;
        if (this._userAwarenessWidgets.has(awareness.id)) {
            widget = this._userAwarenessWidgets.get(awareness.id)!;
        } else {
            widget = new UserAwarenessWidget();
            this._userAwarenessContainer.addChild(widget.sprit);
            this._userAwarenessWidgets.set(awareness.id, widget);
        }
        widget.updateUserAwareness(awareness);
    }
}
