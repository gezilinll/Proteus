import * as PIXI from 'pixi.js';
import { UserAwareness } from '../../service/collab/Whiteboard';

export class UserAwarenessWidget {
    sprit: PIXI.Container;

    private _text: PIXI.Text;
    private _background: PIXI.Sprite;

    constructor() {
        this.sprit = new PIXI.Container();
        this._text = new PIXI.Text();
        this._background = new PIXI.Sprite();
        this.sprit.addChild(this._background, this._text);
    }

    updateUserAwareness(awareness: UserAwareness) {
        this.sprit.position.x = awareness.mouseX;
        this.sprit.position.y = awareness.mouseY;
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
    }
}
