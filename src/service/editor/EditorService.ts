import axios from 'axios';
import { SERVER_URL } from '../../Constants';
import { BrushElementModel } from '../../model/element/BrushElementModel';
import { ElementType } from '../../Defines';
import { BoardElementModel } from '../../model/element/BoardElementModel';
import { CanvasModel } from '../../model/CanvasModel';

export class EditorService {
    canvas: CanvasModel = new CanvasModel();
    board: BoardElementModel = new BoardElementModel();

    constructor() {}

    loadFromContent(json: string) {}

    exportContent() {
        return '';
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
                console.error('getUserInfo failed');
                reject();
            }
        });
    }

    createElement(type: ElementType) {
        const model = new BrushElementModel();
        this.board.addElement(model);
        return model;
    }

    move(deltaX: number, deltaY: number) {
        this.canvas.move(deltaX, deltaY);
        this.board.move(deltaX, deltaY);
        this.board.notifyUpdated();
    }

    calculateGlobalPosition(mouseX: number, mouseY: number) {
        return {
            x: (mouseX - this.board.position.left) / this.board.scale.x,
            y: (mouseY - this.board.position.top) / this.board.scale.y,
        };
    }

    zoomTo(target: number) {
        this.canvas.zoomTo(target);
        this.board.scaleTo(target);
        this.board.notifyUpdated();
    }

    get zoom() {
        return this.board.scale.x;
    }
}
