import * as PIXI from 'pixi.js';
import { UserAwareness } from '../../room/Whiteboard';

export class UserAwarenessUI {
    sprit: PIXI.Container;

    private _viewport: PIXI.Container;
    private _text: PIXI.Text;
    private _background: PIXI.Sprite;

    constructor(viewport: PIXI.Container) {
        this._viewport = viewport;
        this.sprit = new PIXI.Container();
        this._text = new PIXI.Text();
        this._background = new PIXI.Sprite();
        this.sprit.addChild(this._background, this._text);
    }

    updateUserAwareness(awareness: UserAwareness) {
        this.sprit.position.x = awareness.mouseX;
        this.sprit.position.y = awareness.mouseY;
        this.sprit.zIndex = 999999999;
        this._text.text = awareness.name;
        const style = new PIXI.TextStyle({
            fill: '#ffffff',
            fontFamily: 'Gill Sans sans-serif',
            fontSize: 16,
        });
        this._text.style = style;
        this._text.position.x = 5;
        this._text.position.y = 5;
        const textMetrics = PIXI.TextMetrics.measureText(awareness.name, style);
        this._background.texture.destroy(true);
        this._background.texture = PIXI.Texture.WHITE;
        this._background.tint = new PIXI.Color(awareness.color).toNumber();
        this._background.width = textMetrics.width + 10;
        this._background.height = textMetrics.height + 10;

        this.sprit.scale.set(1.0 / this._viewport.scale.x, 1.0 / this._viewport.scale.y);
    }
}
